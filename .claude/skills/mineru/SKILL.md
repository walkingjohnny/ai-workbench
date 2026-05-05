---
name: mineru
description: 使用 MinerU 精准 API (VLM) 将 PDF 转换为 Markdown。当用户需要解析 PDF 文档、将 PDF 转为可编辑的 Markdown 文本、提取 PDF 中的文字内容时使用。触发词包括"PDF 转 Markdown"、"解析 PDF"、"提取 PDF 文字"、"mineru"、"PDF to md"。
---

# MinerU PDF 解析

基于 MinerU 精准 API (VLM) 的 PDF 转 Markdown CLI 工具。

## 用法

```bash
python3 SKILL_DIR/parse.py <输入...> [-o 输出路径] [选项]
```

输入支持本地文件路径或 URL，支持单个和批量（不可混合）。

## 选项

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `input` | 必填 | 一个或多个本地 PDF 文件路径或 URL |
| `-o`, `--output` | 当前目录/原文件名.md | 单文件时为完整文件路径，批量时为输出目录 |
| `--language` | `ch` | 文档语言（影响 OCR）：`ch`（中英文）、`en`（纯英文） |
| `--page-range` | 无 | 页码范围，如 `1-10` 或 `2,4-6` |
| `--timeout` | `300` | 轮询超时秒数 |
| `--interval` | `5` | 轮询间隔秒数 |

## 示例

```bash
# 解析本地 PDF
python3 SKILL_DIR/parse.py paper.pdf

# 指定输出路径
python3 SKILL_DIR/parse.py paper.pdf -o ~/output/paper.md

# 解析 URL
python3 SKILL_DIR/parse.py "https://example.com/paper.pdf"

# 批量解析本地文件，输出到指定目录
python3 SKILL_DIR/parse.py ch01.pdf ch02.pdf ch03.pdf -o ./results/

# 指定页码范围和语言
python3 SKILL_DIR/parse.py paper.pdf --page-range 1-20 --language en
```

## 输出

- 单文件：`-o` 指定完整文件路径；不指定则在当前目录生成 `原文件名.md`
- 批量：`-o` 指定输出目录，各文件按原文件名生成 `.md`

## 依赖

- `requests`
- `python-dotenv`
