---
name: minimax-xlsx
description: "打开、创建、读取、分析、编辑或验证 Excel/电子表格文件（.xlsx、.xlsm、.csv、.tsv）。当用户要求创建、构建、修改、分析、读取、验证或格式化任何 Excel 电子表格、财务模型、数据透视表或表格数据文件时使用。涵盖：从零创建新 xlsx、读取和分析现有文件、零格式损失编辑现有 xlsx、公式重算和验证，以及应用专业财务格式标准。触发词包括'电子表格'、'Excel'、'.xlsx'、'.csv'、'数据透视表'、'财务模型'、'公式'，或任何要求以 Excel 格式生成表格数据的请求。"
license: MIT
metadata:
  version: "1.0"
  category: productivity
  sources:
    - ECMA-376 Office Open XML File Formats
    - Microsoft Open XML SDK documentation
---

# MiniMax XLSX Skill

直接处理请求。不要生成子 agent。始终写出用户请求的输出文件。

## 任务路由

| 任务 | 方法 | 指南 |
|------|------|------|
| **READ** — 分析现有数据 | `xlsx_reader.py` + pandas | `references/read-analyze.md` |
| **CREATE** — 从零创建新 xlsx | XML 模板 | `references/create.md` + `references/format.md` |
| **EDIT** — 修改现有 xlsx | XML 解包→编辑→打包 | `references/edit.md`（如需样式则加 `format.md`） |
| **FIX** — 修复现有 xlsx 中损坏的公式 | XML 解包→修复 `<f>` 节点→打包 | `references/fix.md` |
| **VALIDATE** — 检查公式 | `formula_check.py` | `references/validate.md` |

## READ — 分析数据（先阅读 `references/read-analyze.md`）

先用 `xlsx_reader.py` 进行结构发现，再用 pandas 做自定义分析。绝不修改源文件。

**格式化规则**：当用户指定小数位数（如"2 位小数"）时，将该格式应用于所有数值——对每个数字使用 `f'{v:.2f}'`。当要求 `12875.00` 时，绝不输出 `12875`。

**聚合规则**：始终直接从 DataFrame 列计算总和/均值/计数——如 `df['Revenue'].sum()`。绝不在聚合前重新推导列值。

## CREATE — XML 模板（阅读 `references/create.md` + `references/format.md`）

复制 `templates/minimal_xlsx/` → 直接编辑 XML → 用 `xlsx_pack.py` 打包。每个派生值必须是 Excel 公式（`<f>SUM(B2:B9)</f>`），绝不使用硬编码数字。按 `format.md` 应用字体颜色。

## EDIT — XML 直接编辑（先阅读 `references/edit.md`）

**关键 — 编辑完整性规则：**
1. **绝不为编辑任务创建新的 `Workbook()`**。始终加载原始文件。
2. 输出必须包含与输入**相同的工作表**（相同名称、相同数据）。
3. 只修改任务要求的特定单元格——其他所有内容必须保持不变。
4. **保存 output.xlsx 后进行验证**：用 `xlsx_reader.py` 或 `pandas` 打开，确认原始工作表名称和部分原始数据存在。如果验证失败，说明写入了错误的文件——在交付前修复。

绝不对现有文件使用 openpyxl 往返操作（会损坏 VBA、数据透视表、迷你图）。应使用：解包 → 使用辅助脚本 → 重新打包。

**"填充单元格" / "向现有单元格添加公式" = EDIT 任务。** 如果输入文件已存在且要求填充、更新或向特定单元格添加公式，必须使用 XML 编辑路径。绝不创建新的 `Workbook()`。示例——用跨工作表 SUM 公式填充 B3：
```bash
python3 SKILL_DIR/scripts/xlsx_unpack.py input.xlsx /tmp/xlsx_work/
# Find the target sheet's XML via xl/workbook.xml → xl/_rels/workbook.xml.rels
# Then use the Edit tool to add <f> inside the target <c> element:
#   <c r="B3"><f>SUM('Sales Data'!D2:D13)</f><v></v></c>
python3 SKILL_DIR/scripts/xlsx_pack.py /tmp/xlsx_work/ output.xlsx
```

**添加列**（公式、numfmt、样式自动从相邻列复制）：
```bash
python3 SKILL_DIR/scripts/xlsx_unpack.py input.xlsx /tmp/xlsx_work/
python3 SKILL_DIR/scripts/xlsx_add_column.py /tmp/xlsx_work/ --col G \
    --sheet "Sheet1" --header "% of Total" \
    --formula '=F{row}/$F$10' --formula-rows 2:9 \
    --total-row 10 --total-formula '=SUM(G2:G9)' --numfmt '0.0%' \
    --border-row 10 --border-style medium
python3 SKILL_DIR/scripts/xlsx_pack.py /tmp/xlsx_work/ output.xlsx
```
`--border-row` 标志会对该行所有单元格（不仅是新列）应用顶部边框。当任务要求在合计行添加会计风格边框时使用。

**插入行**（移动现有行、更新 SUM 公式、修复循环引用）：
```bash
python3 SKILL_DIR/scripts/xlsx_unpack.py input.xlsx /tmp/xlsx_work/
# IMPORTANT: Find the correct --at row by searching for the label text
# in the worksheet XML, NOT by using the row number from the prompt.
# The prompt may say "row 5 (Office Rent)" but Office Rent might actually
# be at row 4. Always locate the row by its text label first.
python3 SKILL_DIR/scripts/xlsx_insert_row.py /tmp/xlsx_work/ --at 5 \
    --sheet "Budget FY2025" --text A=Utilities \
    --values B=3000 C=3000 D=3500 E=3500 \
    --formula 'F=SUM(B{row}:E{row})' --copy-style-from 4
python3 SKILL_DIR/scripts/xlsx_pack.py /tmp/xlsx_work/ output.xlsx
```
**行查找规则**：当任务说"在第 N 行（标签）之后"时，始终通过在工作表 XML 中搜索"标签"来查找行（`grep -n "Label" /tmp/xlsx_work/xl/worksheets/sheet*.xml` 或检查 sharedStrings.xml）。使用实际行号 + 1 作为 `--at` 的值。不要单独调用 `xlsx_shift_rows.py`——`xlsx_insert_row.py` 会在内部调用它。

**应用整行边框**（如合计行的会计线）：
运行辅助脚本后，对目标行的所有单元格（不仅是新增单元格）应用边框。在 `xl/styles.xml` 中，追加一个具有所需样式的新 `<border>`，然后在 `<cellXfs>` 中追加一个新的 `<xf>`，克隆每个单元格现有的 `<xf>` 但设置新的 `borderId`。通过 `s` 属性将新样式索引应用到该行的每个 `<c>` 元素：
```xml
<!-- In xl/styles.xml, append to <borders>: -->
<border>
  <left/><right/><top style="medium"/><bottom/><diagonal/>
</border>
<!-- Then append to <cellXfs> an xf clone with the new borderId for each existing style -->
```
**关键规则**：当任务说"为第 N 行添加边框"时，遍历从 A 到最后一列的所有单元格，不仅是新增的单元格。

**手动 XML 编辑**（用于辅助脚本未覆盖的任何操作）：
```bash
python3 SKILL_DIR/scripts/xlsx_unpack.py input.xlsx /tmp/xlsx_work/
# ... edit XML with the Edit tool ...
python3 SKILL_DIR/scripts/xlsx_pack.py /tmp/xlsx_work/ output.xlsx
```

## FIX — 修复损坏的公式（先阅读 `references/fix.md`）

这是一个 EDIT 任务。解包 → 修复损坏的 `<f>` 节点 → 打包。保留所有原始工作表和数据。

## VALIDATE — 检查公式（先阅读 `references/validate.md`）

运行 `formula_check.py` 进行静态验证。可用时使用 `libreoffice_recalc.py` 进行动态重算。

## 财务颜色标准

| 单元格角色 | 字体颜色 | 十六进制代码 |
|-----------|----------|-------------|
| 硬编码输入 / 假设值 | 蓝色 | `0000FF` |
| 公式 / 计算结果 | 黑色 | `000000` |
| 跨工作表引用公式 | 绿色 | `00B050` |

## 核心规则

1. **公式优先**：每个计算单元格必须使用 Excel 公式，不能使用硬编码数字
2. **CREATE → XML 模板**：复制最小模板，直接编辑 XML，用 `xlsx_pack.py` 打包
3. **EDIT → XML**：绝不使用 openpyxl 往返操作。使用解包/编辑/打包脚本
4. **始终生成输出文件** — 这是第一优先级
5. **交付前验证**：`formula_check.py` 退出码 0 = 安全

## 实用脚本

```bash
python3 SKILL_DIR/scripts/xlsx_reader.py input.xlsx                 # structure discovery
python3 SKILL_DIR/scripts/formula_check.py file.xlsx --json         # formula validation
python3 SKILL_DIR/scripts/formula_check.py file.xlsx --report      # standardized report
python3 SKILL_DIR/scripts/xlsx_unpack.py in.xlsx /tmp/work/         # unpack for XML editing
python3 SKILL_DIR/scripts/xlsx_pack.py /tmp/work/ out.xlsx          # repack after editing
python3 SKILL_DIR/scripts/xlsx_shift_rows.py /tmp/work/ insert 5 1  # shift rows for insertion
python3 SKILL_DIR/scripts/xlsx_add_column.py /tmp/work/ --col G ... # add column with formulas
python3 SKILL_DIR/scripts/xlsx_insert_row.py /tmp/work/ --at 6 ...  # insert row with data
```
