---
name: minimax-docx
license: MIT
metadata:
  version: "1.0.0"
  category: document-processing
  author: MiniMaxAI
  sources:
    - "ECMA-376 Office Open XML File Formats"
    - "GB/T 9704-2012 Layout Standard for Official Documents"
    - "IEEE / ACM / APA / MLA / Chicago / Turabian Style Guides"
    - "Springer LNCS / Nature / HBR Document Templates"
description: >
  使用 OpenXML SDK (.NET) 进行专业 DOCX 文档的创建、编辑和排版。
  三条管道：(A) 从零创建新文档，(B) 在现有文档中填充/编辑内容，(C) 应用模板排版并通过 XSD 验证关卡检查。
  当用户需要制作、修改或排版 Word 文档时必须使用此 skill——
  包括用户说"写一份报告"、"起草一份提案"、"做一份合同"、
  "填写这个表格"、"按这个模板重新排版"，或任何最终产出为 .docx 文件的任务。
  即使用户没有明确提到"docx"，只要任务暗示需要可打印的/正式的文档，就使用此 skill。
triggers:
  - Word
  - docx
  - document
  - 文档
  - Word文档
  - 报告
  - 合同
  - 公文
  - 排版
  - 套模板
---

# minimax-docx

通过 CLI 工具或基于 OpenXML SDK (.NET) 的 C# 脚本，创建、编辑和排版 DOCX 文档。

## 环境准备

**首次使用：** `bash scripts/setup.sh`（Windows 上使用 `powershell scripts/setup.ps1`，加 `--minimal` 可跳过可选依赖）。

**会话中首次操作：** `scripts/env_check.sh` — 如果输出 `NOT READY` 则不要继续。（同一会话内后续操作可跳过。）

## 快速入门：直接 C# 路径

当任务需要结构化文档操作（自定义样式、复杂表格、多节布局、页眉页脚、目录、图片）时，直接编写 C# 而不是纠结于 CLI 的局限性。使用以下脚手架：

```csharp
// File: scripts/dotnet/task.csx  (or a new .cs in a Console project)
// dotnet run --project scripts/dotnet/MiniMaxAIDocx.Cli -- run-script task.csx
#r "nuget: DocumentFormat.OpenXml, 3.2.0"

using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;

using var doc = WordprocessingDocument.Create("output.docx", WordprocessingDocumentType.Document);
var mainPart = doc.AddMainDocumentPart();
mainPart.Document = new Document(new Body());

// --- Your logic here ---
// Read the relevant Samples/*.cs file FIRST for tested patterns.
// See Samples/ table in References section below.
```

**编写任何 C# 代码前，先阅读相关的 `Samples/*.cs` 文件** — 其中包含可编译的、经过 SDK 版本验证的模式。下方参考资料部分的 Samples 表格会将主题映射到对应文件。

## CLI 简写

以下所有 CLI 命令中 `$CLI` 是以下内容的简写：
```bash
dotnet run --project scripts/dotnet/MiniMaxAIDocx.Cli --
```

## 管道路由

通过检查来路由：用户是否有输入的 .docx 文件？

```
User task
├─ No input file → Pipeline A: CREATE
│   signals: "write", "create", "draft", "generate", "new", "make a report/proposal/memo"
│   → Read references/scenario_a_create.md
│
└─ Has input .docx
    ├─ Replace/fill/modify content → Pipeline B: FILL-EDIT
    │   signals: "fill in", "replace", "update", "change text", "add section", "edit"
    │   → Read references/scenario_b_edit_content.md
    │
    └─ Reformat/apply style/template → Pipeline C: FORMAT-APPLY
        signals: "reformat", "apply template", "restyle", "match this format", "套模板", "排版"
        ├─ Template is pure style (no content) → C-1: OVERLAY (apply styles to source)
        └─ Template has structure (cover/TOC/example sections) → C-2: BASE-REPLACE
            (use template as base, replace example content with user content)
        → Read references/scenario_c_apply_template.md
```

如果请求跨越多条管道，按顺序执行（例如先 Create 再 Format-Apply）。

## 预处理

如需转换 `.doc` → `.docx`：`scripts/doc_to_docx.sh input.doc output_dir/`

编辑前预览（避免阅读原始 XML）：`scripts/docx_preview.sh document.docx`

分析文档结构（用于编辑场景）：`$CLI analyze --input document.docx`

## 场景 A：创建

先阅读 `references/scenario_a_create.md`、`references/typography_guide.md` 和 `references/design_principles.md`。从 `Samples/AestheticRecipeSamples.cs` 中选择与文档类型匹配的美学配方 — 不要自己编造排版参数值。如涉及 CJK，还需阅读 `references/cjk_typography.md`。

**选择路径：**
- **简单**（纯文本、最少排版）：使用 CLI — `$CLI create --type report --output out.docx --config content.json`
- **结构化**（自定义样式、多节、目录、图片、复杂表格）：直接编写 C#。先阅读相关的 `Samples/*.cs`。

CLI 选项：`--type` (report|letter|memo|academic)、`--title`、`--author`、`--page-size` (letter|a4|legal|a3)、`--margins` (standard|narrow|wide)、`--header`、`--footer`、`--page-numbers`、`--toc`、`--content-json`。

然后运行**验证管道**（见下方）。

## 场景 B：编辑/填充

先阅读 `references/scenario_b_edit_content.md`。流程：预览 → 分析 → 编辑 → 验证。

**选择路径：**
- **简单**（文本替换、占位符填充）：使用 CLI 子命令。
- **结构化**（添加/重组节、修改样式、操作表格、插入图片）：直接编写 C#。先阅读 `references/openxml_element_order.md` 和相关的 `Samples/*.cs`。

可用的 CLI 编辑子命令：
- `replace-text --find "X" --replace "Y"`
- `fill-placeholders --data '{"key":"value"}'`
- `fill-table --data table.json`
- `insert-section`、`remove-section`、`update-header-footer`

```bash
$CLI edit replace-text --input in.docx --output out.docx --find "OLD" --replace "NEW"
$CLI edit fill-placeholders --input in.docx --output out.docx --data '{"name":"John"}'
```

然后运行**验证管道**。同时运行 diff 以确认改动最小化：
```bash
$CLI diff --before in.docx --after out.docx
```

## 场景 C：应用模板

先阅读 `references/scenario_c_apply_template.md`。预览并分析源文件和模板。

```bash
$CLI apply-template --input source.docx --template template.docx --output out.docx
```

对于复杂模板操作（多模板合并、分节页眉页脚、样式合并），直接编写 C# — 参见下方关键规则中的必需模式。

运行**验证管道**，然后运行**硬性关卡检查**：
```bash
$CLI validate --input out.docx --gate-check assets/xsd/business-rules.xsd
```
关卡检查是**硬性要求**。通过之前不得交付。如果失败：诊断、修复、重新运行。

同时运行 diff 以确认内容保持完整：`$CLI diff --before source.docx --after out.docx`

## 验证管道

每次写操作后运行。场景 C 的完整管道是**强制性的**；场景 A/B 是**推荐的**（仅当操作极为简单时可跳过）。

```bash
$CLI merge-runs --input doc.docx                                    # 1. consolidate runs
$CLI validate --input doc.docx --xsd assets/xsd/wml-subset.xsd     # 2. XSD structure
$CLI validate --input doc.docx --business                           # 3. business rules
```

如果 XSD 失败，自动修复并重试：
```bash
$CLI fix-order --input doc.docx
$CLI validate --input doc.docx --xsd assets/xsd/wml-subset.xsd
```

如果 XSD 仍然失败，回退到业务规则 + 预览：
```bash
$CLI validate --input doc.docx --business
scripts/docx_preview.sh doc.docx
# Verify: font contamination=0, table count correct, drawing count correct, sectPr count correct
```

最终预览：`scripts/docx_preview.sh doc.docx`

## 关键规则

以下规则防止文件损坏 — OpenXML 对元素顺序要求严格。

**元素顺序**（属性始终在前）：

| 父元素 | 顺序 |
|--------|------|
| `w:p`  | `pPr` → runs |
| `w:r`  | `rPr` → `t`/`br`/`tab` |
| `w:tbl`| `tblPr` → `tblGrid` → `tr` |
| `w:tr` | `trPr` → `tc` |
| `w:tc` | `tcPr` → `p`（至少 1 个 `<w:p/>`） |
| `w:body` | block content → `sectPr`（必须是最后一个子元素） |

**直接格式污染：** 从源文档复制内容时，内联的 `rPr`（字体、颜色）和 `pPr`（边框、底纹、间距）会覆盖模板样式。务必剥离直接格式 — 只保留 `pStyle` 引用和 `t` 文本。表格也要清理（包括单元格内的 `pPr/rPr`）。

**修订标记：** `<w:del>` 使用 `<w:delText>`，绝不用 `<w:t>`。`<w:ins>` 使用 `<w:t>`，绝不用 `<w:delText>`。

**字号：** `w:sz` = 磅值 x 2（12pt → `sz="24"`）。边距/间距使用 DXA（1 英寸 = 1440，1cm ≈ 567）。

**标题样式必须包含 OutlineLevel：** 定义标题样式（Heading1、ThesisH1 等）时，务必在 `StyleParagraphProperties` 中包含 `new OutlineLevel { Val = N }`（H1→0, H2→1, H3→2）。缺少此项，Word 会将其视为普通样式文本 — 目录和导航窗格将无法工作。

**多模板合并：** 当提供多个模板文件（字体、标题、分节）时，先阅读 `references/scenario_c_apply_template.md` 的 "Multi-Template Merge" 章节。关键规则：
- 将所有模板的样式合并到一个 styles.xml 中。结构（节/分节符）来自分节模板。
- 每个内容段落必须精确出现一次 — 插入分节符时绝不复制段落。
- 绝不插入空白段落作为填充或分节分隔符。输出段落数必须等于输入段落数。使用分节符属性（`w:pPr` 内的 `w:sectPr`）和样式间距（`w:spacing` 的 before/after）来实现视觉分隔。
- 在每个章节标题前都插入 oddPage 分节符，不仅仅是第一个。即使某章包含双栏内容，也必须以 oddPage 开始；在标题后使用第二个 continuous 分节符来切换栏数。
- 双栏章节需要三个分节符：(1) 前一段落的 pPr 中的 oddPage，(2) 章节标题的 pPr 中的 continuous+cols=2，(3) 最后一个正文段落的 pPr 中的 continuous+cols=1 以恢复单栏。
- 从分节模板复制每个节的 `titlePg` 设置。摘要和目录节通常需要 `titlePg=true`。

**多节页眉页脚：** 包含 10+ 节的模板（如中文学位论文）各节有不同的页眉页脚（罗马数字 vs 阿拉伯数字页码、不同区域不同页眉文字）。规则：
- 使用 C-2 Base-Replace：将模板复制为输出基底，然后替换正文内容。这样可自动保留所有节、页眉、页脚和 titlePg 设置。
- 绝不从零重建页眉页脚 — 逐字节复制模板的页眉页脚 XML。
- 绝不添加模板页眉 XML 中不存在的格式（边框、对齐、字号）。
- 非封面节必须有页眉页脚 XML 文件（至少空页眉 + 页码页脚）。
- 参见 `references/scenario_c_apply_template.md` 的 "Multi-Section Header/Footer Transfer" 章节。

## 参考资料

按需加载 — 不要一次全部加载。选择与当前任务最相关的文件。

**下方的 C# 示例和设计参考是项目的知识库（"百科全书"）。** 编写 OpenXML 代码时，务必先阅读相关的示例文件 — 其中包含可编译的、经过 SDK 版本验证的模式，能够防止常见错误。做美学决策时，阅读设计原则和配方文件 — 它们编码了来自权威来源（IEEE、ACM、APA、Nature 等）的经过验证的、和谐的参数集，而非猜测。

### 场景指南（每条管道开始前先读）

| 文件 | 使用时机 |
|------|----------|
| `references/scenario_a_create.md` | 管道 A：从零创建 |
| `references/scenario_b_edit_content.md` | 管道 B：编辑现有内容 |
| `references/scenario_c_apply_template.md` | 管道 C：应用模板排版 |

### C# 代码示例（可编译、详细注释 — 编写代码时阅读）

| 文件 | 主题 |
|------|------|
| `Samples/DocumentCreationSamples.cs` | 文档生命周期：创建、打开、保存、流、文档默认值、设置、属性、页面设置、多节 |
| `Samples/StyleSystemSamples.cs` | 样式：Normal/Heading 链、字符/表格/列表样式、DocDefaults、latentStyles、CJK 公文、APA 7th、导入、解析继承 |
| `Samples/CharacterFormattingSamples.cs` | RunProperties：字体、字号、粗体/斜体、所有下划线类型、颜色、高亮、删除线、上标/下标、大写、字间距、底纹、边框、着重号 |
| `Samples/ParagraphFormattingSamples.cs` | ParagraphProperties：对齐、缩进、行距/段间距、孤行控制、大纲级别、边框、制表位、编号、双向文本、框架 |
| `Samples/TableSamples.cs` | 表格：边框、网格、单元格属性、边距、行高、表头重复、合并（水平+垂直）、嵌套、浮动、三线表、斑马纹 |
| `Samples/HeaderFooterSamples.cs` | 页眉页脚：页码、"第 X 页 共 Y 页"、首页/偶数页/奇数页、Logo 图片、表格布局、公文 "-X-"、分节 |
| `Samples/ImageSamples.cs` | 图片：嵌入、浮动、文字环绕、边框、替代文本、页眉/表格中的图片、替换、SVG 回退、尺寸计算 |
| `Samples/ListAndNumberingSamples.cs` | 编号：项目符号、多级十进制、自定义符号、大纲→标题、法律编号、中文 一/（一）/1./(1)、重新开始/继续 |
| `Samples/FieldAndTocSamples.cs` | 域：目录、SimpleField vs 复杂域、DATE/PAGE/REF/SEQ/MERGEFIELD/IF/STYLEREF、目录样式 |
| `Samples/FootnoteAndCommentSamples.cs` | 脚注、尾注、批注（四文件系统）、书签、超链接（内部+外部） |
| `Samples/TrackChangesSamples.cs` | 修订：插入（w:t）、删除（w:delText!）、格式更改、全部接受/拒绝、移动追踪 |
| `Samples/AestheticRecipeSamples.cs` | 13 套来自权威来源的美学配方：ModernCorporate、AcademicThesis、ExecutiveBrief、ChineseGovernment (GB/T 9704)、MinimalModern、IEEE Conference、ACM sigconf、APA 7th、MLA 9th、Chicago/Turabian、Springer LNCS、Nature、HBR — 每套都包含来自官方样式指南的精确数值 |

注：`Samples/` 路径相对于 `scripts/dotnet/MiniMaxAIDocx.Core/`。

### Markdown 参考文档（需要规格或设计规则时阅读）

| 文件 | 使用时机 |
|------|----------|
| `references/openxml_element_order.md` | XML 元素顺序规则（防止文件损坏） |
| `references/openxml_units.md` | 单位换算：DXA、EMU、half-points、eighth-points |
| `references/openxml_encyclopedia_part1.md` | 详细 C# 百科：文档创建、样式、字符和段落格式 |
| `references/openxml_encyclopedia_part2.md` | 详细 C# 百科：页面设置、表格、页眉页脚、节、文档属性 |
| `references/openxml_encyclopedia_part3.md` | 详细 C# 百科：目录、脚注、域、修订、批注、图片、数学公式、编号、保护 |
| `references/typography_guide.md` | 字体搭配、字号、间距、页面布局、表格设计、配色方案 |
| `references/cjk_typography.md` | CJK 字体、字号尺寸、RunFonts 映射、GB/T 9704 公文标准 |
| `references/cjk_university_template_guide.md` | 中文高校学位论文模板：数字 styleId（1/2/3 vs Heading1）、文档区域结构（封面→摘要→目录→正文→参考文献）、字体预期、常见错误 |
| `references/design_principles.md` | **美学基础**：6 大设计原则（留白、对比/比例、邻近、对齐、重复、层次） — 教的是"为什么"而非仅仅是"是什么" |
| `references/design_good_bad_examples.md` | **好坏对比**：10 类排版错误，附 OpenXML 数值、ASCII 示意图和修复方案 |
| `references/track_changes_guide.md` | 修订标记深度解析 |
| `references/troubleshooting.md` | **按症状索引的修复指南**：13 个常见问题按你看到的现象索引（标题错误、图片丢失、目录损坏等） — 按症状搜索，找到修复方案 |
