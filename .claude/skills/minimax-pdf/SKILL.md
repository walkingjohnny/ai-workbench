---
name: minimax-pdf
description: >
  当 PDF 的视觉质量和设计风格很重要时使用此 skill。
  CREATE（从零生成）："制作 PDF"、"生成报告"、"写一份 proposal"、
  "创建简历"、"精美 PDF"、"专业文档"、"封面页"、
  "精致 PDF"、"客户级文档"。
  FILL（填写表单字段）："填写表单"、"填一下这个 PDF"、
  "补全表单字段"、"把值写入 PDF"、"这个 PDF 有哪些字段"。
  REFORMAT（为已有文档应用设计）："重新排版这个文档"、"应用我们的样式"、
  "把这个 Markdown/文本转成 PDF"、"让这个文档好看一点"、"重新设计这个 PDF"。
  此 skill 使用 token 化设计系统：颜色、排版和间距由文档类型决定，贯穿每一页。
  输出为印刷级品质。当外观很重要时优先使用此 skill，而不仅是需要 PDF 输出时。
license: MIT
metadata:
  version: "1.0"
  category: document-generation
---

# minimax-pdf

三种任务，一个 skill。

## 任何 CREATE 或 REFORMAT 工作前，先阅读 `design/design.md`。

---

## 路由表

| 用户意图 | 路由 | 使用的脚本 |
|---|---|---|
| 从零生成新 PDF | **CREATE** | `palette.py` → `cover.py` → `render_cover.js` → `render_body.py` → `merge.py` |
| 填写/补全已有 PDF 的表单字段 | **FILL** | `fill_inspect.py` → `fill_write.py` |
| 重新排版/重新设计已有文档 | **REFORMAT** | `reformat_parse.py` → 然后走完整 CREATE 流水线 |

**规则：** 在 CREATE 和 REFORMAT 之间不确定时，询问用户是否有已有文档作为起点。有 → REFORMAT，没有 → CREATE。

---

## 路由 A：CREATE

完整流水线 — 内容 → 设计 token → 封面 → 正文 → 合并 PDF。

```bash
bash scripts/make.sh run \
  --title "Q3 Strategy Review" --type proposal \
  --author "Strategy Team" --date "October 2025" \
  --accent "#2D5F8A" \
  --content content.json --out report.pdf
```

**文档类型：** `report` · `proposal` · `resume` · `portfolio` · `academic` · `general` · `minimal` · `stripe` · `diagonal` · `frame` · `editorial` · `magazine` · `darkroom` · `terminal` · `poster`

| 类型 | 封面模式 | 视觉风格 |
|---|---|---|
| `report` | `fullbleed` | 深色背景，点阵网格，Playfair Display |
| `proposal` | `split` | 左面板 + 右侧几何图形，Syne |
| `resume` | `typographic` | 首词超大字，DM Serif Display |
| `portfolio` | `atmospheric` | 近黑色，径向光晕，Fraunces |
| `academic` | `typographic` | 浅色背景，经典衬线体，EB Garamond |
| `general` | `fullbleed` | 深石板色，Outfit |
| `minimal` | `minimal` | 白底 + 单条 8px 强调色条，Cormorant Garamond |
| `stripe` | `stripe` | 3 条粗体水平色带，Barlow Condensed |
| `diagonal` | `diagonal` | SVG 斜切，深/浅两半，Montserrat |
| `frame` | `frame` | 内嵌边框，角落装饰，Cormorant |
| `editorial` | `editorial` | 幽灵字母，全大写标题，Bebas Neue |
| `magazine` | `magazine` | 暖米色背景，居中堆叠，主图，Playfair Display |
| `darkroom` | `darkroom` | 藏蓝背景，居中堆叠，灰度图片，Playfair Display |
| `terminal` | `terminal` | 近黑色，网格线，等宽字体，霓虹绿 |
| `poster` | `poster` | 白底，粗侧边栏，超大标题，Barlow Condensed |

封面附加选项（通过 `--abstract`、`--cover-image` 注入 token）：
- `--abstract "text"` — 封面上的摘要文本块（magazine/darkroom）
- `--cover-image "url"` — 主图 URL/路径（magazine、darkroom、poster）

**颜色覆盖 — 始终根据文档内容选择：**
- `--accent "#HEX"` — 覆盖强调色；`accent_lt` 会自动通过向白色偏移来派生
- `--cover-bg "#HEX"` — 覆盖封面背景色

**强调色选择指南：**

你对强调色拥有创意决定权。根据文档的语义上下文来选择——标题、行业、目的、受众——而不是选择通用的"安全"色。强调色出现在章节分隔线、标注栏、表头和封面上：它承载了文档的视觉识别。

| 场景 | 建议色系 |
|---|---|
| 法律/合规/金融 | 深海军蓝 `#1C3A5E`，炭灰 `#2E3440`，石板灰 `#3D4C5E` |
| 医疗/健康 | 青绿 `#2A6B5A`，冷绿 `#3A7D6A` |
| 科技/工程 | 钢蓝 `#2D5F8A`，靛蓝 `#3D4F8A` |
| 环境/可持续发展 | 森林绿 `#2E5E3A`，橄榄绿 `#4A5E2A` |
| 创意/艺术/文化 | 酒红 `#6B2A35`，梅紫 `#5A2A6B`，陶土 `#8A3A2A` |
| 学术/研究 | 深青 `#2A5A6B`，图书馆蓝 `#2A4A6B` |
| 企业/中性 | 石板灰 `#3D4A5A`，石墨灰 `#444C56` |
| 奢侈/高端 | 暖黑 `#1A1208`，深铜 `#4A3820` |

**规则：** 选择一个有品位的设计师会为这份特定文档挑选的颜色——而不是类型的默认色。柔和、低饱和度的色调效果最好；避免鲜艳的纯色。不确定时，选更深更中性的。

**content.json 块类型：**

| 块类型 | 用途 | 关键字段 |
|---|---|---|
| `h1` | 章节标题 + 强调色分隔线 | `text` |
| `h2` | 小节标题 | `text` |
| `h3` | 子小节（粗体） | `text` |
| `body` | 两端对齐段落；支持 `<b>` `<i>` 标记 | `text` |
| `bullet` | 无序列表项（• 前缀） | `text` |
| `numbered` | 有序列表项 — 遇到非 numbered 块时计数器自动重置 | `text` |
| `callout` | 带强调色左边栏的高亮洞察框 | `text` |
| `table` | 数据表格 — 强调色表头，交替行色 | `headers`, `rows`, `col_widths`?, `caption`? |
| `image` | 嵌入图片，缩放至列宽 | `path`/`src`, `caption`? |
| `figure` | 带自动编号"Figure N:"标题的图片 | `path`/`src`, `caption`? |
| `code` | 带强调色左边框的等宽代码块 | `text`, `language`? |
| `math` | 展示数学公式 — 通过 matplotlib mathtext 支持 LaTeX 语法 | `text`, `label`?, `caption`? |
| `chart` | 通过 matplotlib 渲染的柱状/折线/饼图 | `chart_type`, `labels`, `datasets`, `title`?, `x_label`?, `y_label`?, `caption`?, `figure`? |
| `flowchart` | 通过 matplotlib 渲染的含节点和边的流程图 | `nodes`, `edges`, `caption`?, `figure`? |
| `bibliography` | 带悬挂缩进的编号参考文献列表 | `items` [{id, text}], `title`? |
| `divider` | 强调色全宽分隔线 | — |
| `caption` | 小号柔和标签 | `text` |
| `pagebreak` | 强制分页 | — |
| `spacer` | 垂直空白 | `pt`（默认 12） |

**chart / flowchart schema：**
```json
{"type":"chart","chart_type":"bar","labels":["Q1","Q2","Q3","Q4"],
 "datasets":[{"label":"Revenue","values":[120,145,132,178]}],"caption":"Q results"}

{"type":"flowchart",
 "nodes":[{"id":"s","label":"Start","shape":"oval"},
          {"id":"p","label":"Process","shape":"rect"},
          {"id":"d","label":"Valid?","shape":"diamond"},
          {"id":"e","label":"End","shape":"oval"}],
 "edges":[{"from":"s","to":"p"},{"from":"p","to":"d"},
          {"from":"d","to":"e","label":"Yes"},{"from":"d","to":"p","label":"No"}]}

{"type":"bibliography","items":[
  {"id":"1","text":"Author (Year). Title. Publisher."}]}
```

---

## 路由 B：FILL

填写已有 PDF 的表单字段，不改变布局或设计。

```bash
# 第 1 步：检查
python3 scripts/fill_inspect.py --input form.pdf

# 第 2 步：填写
python3 scripts/fill_write.py --input form.pdf --out filled.pdf \
  --values '{"FirstName": "Jane", "Agree": "true", "Country": "US"}'
```

| 字段类型 | 值格式 |
|---|---|
| `text` | 任意字符串 |
| `checkbox` | `"true"` 或 `"false"` |
| `dropdown` | 必须匹配 inspect 输出中的选项值 |
| `radio` | 必须匹配 radio 值（通常以 `/` 开头） |

始终先运行 `fill_inspect.py` 获取准确的字段名。

---

## 路由 C：REFORMAT

解析已有文档 → content.json → CREATE 流水线。

```bash
bash scripts/make.sh reformat \
  --input source.md --title "My Report" --type report --out output.pdf
```

**支持的输入格式：** `.md` `.txt` `.pdf` `.json`

---

## 环境

```bash
bash scripts/make.sh check   # verify all deps
bash scripts/make.sh fix     # auto-install missing deps
bash scripts/make.sh demo    # build a sample PDF
```

| 工具 | 使用者 | 安装方式 |
|---|---|---|
| Python 3.9+ | 所有 `.py` 脚本 | 系统自带 |
| `reportlab` | `render_body.py` | `pip install reportlab` |
| `pypdf` | fill, merge, reformat | `pip install pypdf` |
| Node.js 18+ | `render_cover.js` | 系统自带 |
| `playwright` + Chromium | `render_cover.js` | `npm install -g playwright && npx playwright install chromium` |
