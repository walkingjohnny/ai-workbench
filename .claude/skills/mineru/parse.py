#!/usr/bin/env python3
"""MinerU PDF Parser CLI - PDF to Markdown via MinerU Precision API (VLM)."""

import argparse
import io
import os
import sys
import time
import zipfile
from pathlib import Path
from urllib.parse import urlparse

import requests
from dotenv import load_dotenv

BASE_URL = "https://mineru.net/api/v4"


def load_token():
    env_path = Path(__file__).parent / ".env"
    load_dotenv(env_path)
    token = os.getenv("token")
    if not token:
        print("Error: token not found in .env", file=sys.stderr)
        sys.exit(1)
    return token


def headers(token):
    return {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
    }


def is_url(s):
    p = urlparse(s)
    return p.scheme in ("http", "https")


def extract_markdown(zip_bytes):
    """Extract full.md content from zip bytes."""
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
        for name in zf.namelist():
            if name.endswith("full.md"):
                return zf.read(name).decode("utf-8")
    return None


def derive_output_path(input_name, output_arg, is_batch):
    """Determine the output file path."""
    stem = Path(input_name).stem
    md_name = f"{stem}.md"

    if output_arg is None:
        return Path.cwd() / md_name

    out = Path(output_arg)
    if is_batch:
        # batch mode: -o is a directory
        out.mkdir(parents=True, exist_ok=True)
        return out / md_name
    else:
        # single mode: -o is the full file path
        out.parent.mkdir(parents=True, exist_ok=True)
        return out


# -- Single URL ----------------------------------------------------

def submit_url_single(token, url, language, page_ranges):
    data = {"url": url, "model_version": "vlm"}
    if language:
        data["language"] = language
    if page_ranges:
        data["page_ranges"] = page_ranges

    resp = requests.post(f"{BASE_URL}/extract/task", headers=headers(token), json=data)
    result = resp.json()
    if result.get("code") != 0:
        print(f"Error: {result.get('msg')}", file=sys.stderr)
        sys.exit(1)
    return result["data"]["task_id"]


def poll_single(token, task_id, timeout, interval):
    start = time.time()
    while time.time() - start < timeout:
        resp = requests.get(f"{BASE_URL}/extract/task/{task_id}", headers=headers(token))
        result = resp.json()
        state = result["data"]["state"]
        elapsed = int(time.time() - start)

        if state == "done":
            return result["data"]["full_zip_url"]
        if state == "failed":
            print(f"[{elapsed}s] 解析失败: {result['data'].get('err_msg', '未知错误')}", file=sys.stderr)
            sys.exit(1)

        label = {"pending": "排队中", "running": "解析中", "converting": "格式转换中"}.get(state, state)
        progress = result["data"].get("extract_progress", {})
        pages_info = ""
        if progress.get("total_pages"):
            pages_info = f" ({progress.get('extracted_pages', 0)}/{progress['total_pages']} 页)"
        print(f"[{elapsed}s] {label}{pages_info}", file=sys.stderr)
        time.sleep(interval)

    print(f"轮询超时 ({timeout}s)", file=sys.stderr)
    sys.exit(1)


# -- Batch URLs ----------------------------------------------------

def submit_url_batch(token, urls, language, page_ranges):
    files = []
    for url in urls:
        entry = {"url": url}
        if page_ranges:
            entry["page_ranges"] = page_ranges
        files.append(entry)

    data = {"files": files, "model_version": "vlm"}
    if language:
        data["language"] = language

    resp = requests.post(f"{BASE_URL}/extract/task/batch", headers=headers(token), json=data)
    result = resp.json()
    if result.get("code") != 0:
        print(f"Error: {result.get('msg')}", file=sys.stderr)
        sys.exit(1)
    return result["data"]["batch_id"]


# -- Batch Files (upload) ------------------------------------------

def submit_file_batch(token, file_paths, language, page_ranges):
    files = []
    for fp in file_paths:
        entry = {"name": Path(fp).name}
        if page_ranges:
            entry["page_ranges"] = page_ranges
        files.append(entry)

    data = {"files": files, "model_version": "vlm"}
    if language:
        data["language"] = language

    resp = requests.post(f"{BASE_URL}/file-urls/batch", headers=headers(token), json=data)
    result = resp.json()
    if result.get("code") != 0:
        print(f"Error: {result.get('msg')}", file=sys.stderr)
        sys.exit(1)

    batch_id = result["data"]["batch_id"]
    upload_urls = result["data"]["file_urls"]

    for fp, upload_url in zip(file_paths, upload_urls):
        print(f"上传: {Path(fp).name}", file=sys.stderr)
        with open(fp, "rb") as f:
            put_resp = requests.put(upload_url, data=f)
            if put_resp.status_code not in (200, 201):
                print(f"上传失败: {Path(fp).name} (HTTP {put_resp.status_code})", file=sys.stderr)
                sys.exit(1)

    return batch_id


# -- Batch Poll ----------------------------------------------------

def poll_batch(token, batch_id, timeout, interval):
    start = time.time()
    while time.time() - start < timeout:
        resp = requests.get(f"{BASE_URL}/extract-results/batch/{batch_id}", headers=headers(token))
        result = resp.json()
        items = result["data"]["extract_result"]
        elapsed = int(time.time() - start)

        all_done = True
        for item in items:
            state = item["state"]
            if state == "failed":
                print(f"[{elapsed}s] {item.get('file_name', '?')} 解析失败: {item.get('err_msg', '未知错误')}", file=sys.stderr)
                sys.exit(1)
            if state != "done":
                all_done = False

        if all_done:
            return [(item.get("file_name", ""), item["full_zip_url"]) for item in items]

        states = [item["state"] for item in items]
        done_count = states.count("done")
        print(f"[{elapsed}s] 进度: {done_count}/{len(items)} 完成", file=sys.stderr)
        time.sleep(interval)

    print(f"轮询超时 ({timeout}s)", file=sys.stderr)
    sys.exit(1)


# -- Download & Save -----------------------------------------------

def download_and_save(zip_url, output_path):
    resp = requests.get(zip_url)
    if resp.status_code != 200:
        print(f"下载失败: HTTP {resp.status_code}", file=sys.stderr)
        sys.exit(1)

    md_content = extract_markdown(resp.content)
    if md_content is None:
        print("Error: full.md not found in zip", file=sys.stderr)
        sys.exit(1)

    output_path.write_text(md_content, encoding="utf-8")
    print(f"已保存: {output_path}")


# -- CLI -----------------------------------------------------------

def build_parser():
    p = argparse.ArgumentParser(
        prog="mineru",
        description="PDF to Markdown via MinerU Precision API (VLM)",
    )
    p.add_argument("input", nargs="+", help="本地文件路径或 URL")
    p.add_argument("-o", "--output", default=None, help="输出路径：单文件时为完整文件路径，批量时为目录")
    p.add_argument("--language", default="ch", help="文档语言 (默认: ch)")
    p.add_argument("--page-range", default=None, help="页码范围，如 1-10 或 2,4-6")
    p.add_argument("--timeout", type=int, default=300, help="轮询超时秒数 (默认: 300)")
    p.add_argument("--interval", type=int, default=5, help="轮询间隔秒数 (默认: 5)")
    return p


def main():
    parser = build_parser()
    args = parser.parse_args()

    token = load_token()
    inputs = args.input
    is_batch = len(inputs) > 1
    all_urls = all(is_url(i) for i in inputs)
    all_files = all(not is_url(i) for i in inputs)

    if not all_urls and not all_files:
        print("Error: 不支持混合输入，请统一使用文件路径或 URL", file=sys.stderr)
        sys.exit(1)

    if all_files:
        for fp in inputs:
            if not Path(fp).is_file():
                print(f"Error: 文件不存在: {fp}", file=sys.stderr)
                sys.exit(1)

    # -- Single URL --
    if not is_batch and all_urls:
        url = inputs[0]
        file_name = Path(urlparse(url).path).name or "output.pdf"
        print(f"提交: {url}", file=sys.stderr)
        task_id = submit_url_single(token, url, args.language, args.page_range)
        print(f"task_id: {task_id}", file=sys.stderr)
        zip_url = poll_single(token, task_id, args.timeout, args.interval)
        out = derive_output_path(file_name, args.output, False)
        download_and_save(zip_url, out)
        return

    # -- Single File --
    if not is_batch and all_files:
        fp = inputs[0]
        print(f"提交: {Path(fp).name}", file=sys.stderr)
        batch_id = submit_file_batch(token, inputs, args.language, args.page_range)
        print(f"batch_id: {batch_id}", file=sys.stderr)
        results = poll_batch(token, batch_id, args.timeout, args.interval)
        _, zip_url = results[0]
        out = derive_output_path(fp, args.output, False)
        download_and_save(zip_url, out)
        return

    # -- Batch URLs --
    if is_batch and all_urls:
        print(f"批量提交: {len(inputs)} 个 URL", file=sys.stderr)
        batch_id = submit_url_batch(token, inputs, args.language, args.page_range)
        print(f"batch_id: {batch_id}", file=sys.stderr)
        results = poll_batch(token, batch_id, args.timeout, args.interval)
        for file_name, zip_url in results:
            out = derive_output_path(file_name, args.output, True)
            download_and_save(zip_url, out)
        return

    # -- Batch Files --
    if is_batch and all_files:
        print(f"批量提交: {len(inputs)} 个文件", file=sys.stderr)
        batch_id = submit_file_batch(token, inputs, args.language, args.page_range)
        print(f"batch_id: {batch_id}", file=sys.stderr)
        results = poll_batch(token, batch_id, args.timeout, args.interval)
        for (file_name, zip_url), fp in zip(results, inputs):
            out = derive_output_path(fp, args.output, True)
            download_and_save(zip_url, out)
        return


if __name__ == "__main__":
    main()
