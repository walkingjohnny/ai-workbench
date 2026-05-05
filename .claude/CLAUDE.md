# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

自动化办公工作区。通过 inbox 投递待处理文档，定时轮询识别并路由到对应 skill 处理。覆盖 Excel 数据分析、会议纪要整理、日报/周报生成、PPT 制作、PDF 解析等场景。

## 目录结构

| 目录 | 用途 |
|------|------|
| `inbox/` | 待处理任务投递箱，每个任务一个文件夹 |
| `tasks/` | 任务工作区，每个任务一个 `{YYYY-MM-DD}-{名称}/` 子文件夹，源文件和产出物放在一起 |
| `reports/` | 日报、周报、月报 |
| `daily/` | 日级别文件索引，每天一个 `{YYYY-MM-DD}.md` |
| `archive/{YYYY-MM}/` | 已完成任务的长期归档 |
| `templates/` | 常用文档模板 |

## Inbox 处理流程

inbox 的投递单元是**文件夹**，与 tasks/ 的结构对齐。每个文件夹代表一个任务，包含该任务所需的所有源文件。单个文件也应包一层文件夹后投递。

### 投递结构

```
inbox/
├── 任务A/
│   ├── file1.pdf
│   └── file2.docx
├── 任务B/
│   └── data.xlsx
```

### 处理步骤

1. 扫描 `inbox/` 下的子文件夹，每个文件夹视为一个待处理任务
2. 识别文件夹内文件的类型和任务意图
3. 将整个文件夹从 `inbox/` 移入 `tasks/`，重命名为 `{YYYY-MM-DD}-{任务名}/`
4. 路由到对应 skill 处理，产出物保存在同一任务文件夹
5. 更新 `changelog.md`、`daily/{YYYY-MM-DD}.md`、相关目录的 `README.md`
6. Git commit 本次任务变更（提交信息：`task: {任务名}`）

### 便签系统

用户将文件夹放入 inbox 后，在对话中说明处理意图。Claude 据此生成便签，记录任务需求和处理方案。便签生成规则见 `rules/inbox-interaction.md`。

便签放在对应的任务文件夹内，命名固定为 `task.md`。任务处理完成后，便签随文件夹一起移入 tasks/，作为任务记录保留。

便签格式：

```markdown
# {任务名}

## 文件
- file1.pdf
- file2.xlsx

## 需求
{用户的具体目标}

## 处理方案
- Skill: {选定的 skill}
- 步骤: {简要处理步骤}
```

### 文件路由

| 文件特征 | Skill |
|---------|-------|
| .xlsx / .csv / .tsv（数据分析、报表） | minimax-xlsx |
| .docx（编辑、排版、套模板） | minimax-docx |
| .pdf → Markdown 转换 | mineru |
| .pdf（合并、拆分、提取、表单填写） | pdf |
| 需要高品质设计的 PDF 输出 | minimax-pdf |
| .pptx 或 PPT 相关需求 | pptx-generator |
| 写日报 / 写周报 | work-report |
| 长文档协作撰写 | doc-coauthoring |

多个 PDF skill 的选择：**处理**现有 PDF（合并、拆分、提取）→ `pdf`；将 PDF **转为 Markdown** → `mineru`；**生成**高品质设计 PDF → `minimax-pdf`。路由歧义时询问用户，不自行猜测。

## 索引体系

三层索引，各有分工：

| 索引 | 位置 | 粒度 | 内容 |
|------|------|------|------|
| `changelog.md` | 根目录 | 任务级 | 时间、任务名、源文件、产出物、skill、备注 |
| `daily/{date}.md` | daily/ | 日+文件级 | 当日处理的所有文件清单（轻量） |
| `README.md` | 各目录内 | 目录级 | 该目录下所有条目的摘要索引 |

### 目录 README.md 格式

```markdown
---
folder: 目录名
updated: YYYY-MM-DD
---

# 目录标题

| 文件名 | 摘要 | 创建时间 | 标签 |
|--------|------|----------|------|
```

### 日索引格式

```markdown
---
date: YYYY-MM-DD
---

# YYYY-MM-DD 文件索引

| 文件名 | 位置 | 操作 | Skill |
|--------|------|------|-------|
```

索引维护时机：每次任务完成后立即更新（由 `rules/task-changelog.md` 规则约束）。

## Loop 工作流

| Loop | 间隔 | 提示词 | 职责 |
|------|------|--------|------|
| inbox-monitor | 20 分钟 | `.claude/loops/inbox-monitor.md` | 扫描 inbox 子文件夹，处理新任务 |
| daily-routine | 24 小时 | `.claude/loops/daily-routine.md` | 生成日报（含复盘），周五加周报 |

## 命名约定

- inbox 投递文件夹：用户自定义名称（如 `任务1/`、`Q1分析/`），无需日期前缀
- tasks 任务文件夹：`{YYYY-MM-DD}-{任务名}/`（从 inbox 移入时加日期前缀）
- 报告：`{YYYY-MM-DD}-日报.md`、`{YYYY-MM-DD}-周报.md`
- 产出物文件名应体现内容，不用通用名如 `output.xlsx`
