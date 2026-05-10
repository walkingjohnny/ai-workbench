/**
 * Meeting Minutes Generator - Template Script
 * 
 * This script provides the reusable skeleton for generating meeting minutes .docx files.
 * When using this skill, Claude should:
 * 1. Copy this file to output directory (user-specified > source file dir > ask user)
 * 2. Replace all PLACEHOLDER sections with actual meeting content
 * 3. Add/remove table rows, sections, and bullet items as needed
 * 4. Run with `node generate_minutes.js`
 * 5. Validate with `python scripts/office/validate.py` (relative to this skill's directory)
 * 
 * The seven-section architecture and all formatting helpers are pre-configured.
 * Focus only on content — structure and styling are handled.
 */

const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat,
  HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak
} = require("docx");

// ============================================================
// HELPER FUNCTIONS — Do not modify
// ============================================================

/** Section heading level 1: 一、二、三... */
const heading1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  children: [new TextRun({ text, font: "SimHei", size: 32, bold: true })],
  spacing: { before: 360, after: 200 },
});

/** Section heading level 2: 3.1, 3.2... */
const heading2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  children: [new TextRun({ text, font: "SimHei", size: 28, bold: true })],
  spacing: { before: 280, after: 160 },
});

/** Section heading level 3: 3.1.1, 3.1.2... */
const heading3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  children: [new TextRun({ text, font: "SimHei", size: 24, bold: true })],
  spacing: { before: 200, after: 120 },
});

/** Standard body paragraph with first-line indent. Pass { indent: false } to disable indent. */
const bodyText = (text, opts = {}) => new Paragraph({
  children: [new TextRun({ text, font: "SimSun", size: 22, ...opts })],
  spacing: { after: 120, line: 360 },
  indent: opts.indent !== false ? { firstLine: 480 } : undefined,
});

/** Body paragraph with mixed formatting runs. E.g.: bodyRuns([{ text: "Bold part:", bold: true }, { text: " Normal part" }]) */
const bodyRuns = (runs) => new Paragraph({
  children: runs.map(r => new TextRun({ font: "SimSun", size: 22, ...r })),
  spacing: { after: 120, line: 360 },
  indent: { firstLine: 480 },
});

/** Bullet list item */
const bulletItem = (text, ref = "bullets", level = 0) => new Paragraph({
  numbering: { reference: ref, level },
  children: [new TextRun({ text, font: "SimSun", size: 22 })],
  spacing: { after: 80, line: 340 },
});

/** Bullet list item with mixed formatting runs */
const bulletRuns = (runs, ref = "bullets", level = 0) => new Paragraph({
  numbering: { reference: ref, level },
  children: runs.map(r => new TextRun({ font: "SimSun", size: 22, ...r })),
  spacing: { after: 80, line: 340 },
});

/** Empty spacing paragraph */
const emptyLine = () => new Paragraph({ spacing: { after: 80 } });

// Table styling constants
const border = { style: BorderStyle.SINGLE, size: 1, color: "999999" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };

/** Table header cell — white text on blue background */
const headerCell = (text, width) => new TableCell({
  borders,
  width: { size: width, type: WidthType.DXA },
  shading: { fill: "2B579A", type: ShadingType.CLEAR },
  margins: cellMargins,
  children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, font: "SimHei", size: 22, bold: true, color: "FFFFFF" })],
  })],
});

/** Table data cell — optional shading, alignment, bold */
const dataCell = (text, width, opts = {}) => new TableCell({
  borders,
  width: { size: width, type: WidthType.DXA },
  margins: cellMargins,
  shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
  children: [new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    children: [new TextRun({ text, font: "SimSun", size: 21, ...opts })],
  })],
});

/** Create a standard info table (label-value pairs) */
const infoTable = (rows, labelWidth = 2200, valueWidth = 7306) => new Table({
  width: { size: labelWidth + valueWidth, type: WidthType.DXA },
  columnWidths: [labelWidth, valueWidth],
  rows: rows.map(([label, value]) => new TableRow({
    children: [
      dataCell(label, labelWidth, { bold: true, shading: "EDF2F9" }),
      dataCell(value, valueWidth),
    ],
  })),
});

/** Create a standard data table with header row and alternating shading */
const dataTable = (headers, rows, colWidths) => {
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        children: headers.map((h, i) => headerCell(h, colWidths[i])),
      }),
      ...rows.map((row, rowIdx) =>
        new TableRow({
          children: row.map((cell, colIdx) => {
            const isEvenRow = rowIdx % 2 === 1;
            const cellOpts = typeof cell === "object" ? cell : { text: cell };
            return dataCell(
              cellOpts.text || cell,
              colWidths[colIdx],
              {
                ...(cellOpts.bold ? { bold: true } : {}),
                ...(cellOpts.align ? { align: cellOpts.align } : {}),
                shading: isEvenRow ? "F5F8FC" : undefined,
                ...(cellOpts.shading ? { shading: cellOpts.shading } : {}),
              }
            );
          }),
        })
      ),
    ],
  });
};

// ============================================================
// PAGE WIDTH CONSTANT
// ============================================================
// A4 width (11906) - left margin (1200) - right margin (1200) = 9506 DXA
const CONTENT_WIDTH = 9506;

// ============================================================
// DOCUMENT CONSTRUCTION — Adapt content below
// ============================================================

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "SimSun", size: 22 } },
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "SimHei" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "SimHei" },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 },
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "SimHei" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }, {
          level: 1, format: LevelFormat.BULLET, text: "\u25CB",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } },
        }],
      },
      {
        reference: "numbers",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1200, bottom: 1440, left: 1200 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          // PLACEHOLDER: Replace with actual meeting title
          children: [new TextRun({ text: "会议纪要", font: "SimSun", size: 18, color: "888888", italics: true })],
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "2B579A", space: 4 } },
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC", space: 4 } },
          children: [
            new TextRun({ text: "第 ", font: "SimSun", size: 18, color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "SimSun", size: 18, color: "888888" }),
            new TextRun({ text: " 页", font: "SimSun", size: 18, color: "888888" }),
          ],
        })],
      }),
    },
    children: [
      // ================================================================
      // TITLE BLOCK
      // PLACEHOLDER: Replace title and subtitle with actual meeting info
      // ================================================================
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: "PLACEHOLDER: 会议标题", font: "SimHei", size: 44, bold: true, color: "1F3864" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2B579A", space: 8 } },
        children: [new TextRun({ text: "PLACEHOLDER: 会议副标题或主题描述", font: "SimSun", size: 24, color: "555555" })],
      }),

      // ================================================================
      // SECTION I: Meeting Basic Information
      // PLACEHOLDER: Replace info table rows with actual data
      // ================================================================
      heading1("一、会议基本信息"),
      infoTable([
        ["会议时间", "PLACEHOLDER"],
        ["会议形式", "PLACEHOLDER"],
        ["参会人员", "PLACEHOLDER"],
        ["会议主题", "PLACEHOLDER"],
        // Add more rows as needed: ["项目名称", "..."], ["讨论文档", "..."]
      ]),
      emptyLine(),

      // ================================================================
      // SECTION II: Topic Overview
      // PLACEHOLDER: Replace with actual topic summary table
      // ================================================================
      heading1("二、议题概述"),
      bodyText("PLACEHOLDER: 一句话总体概述"),
      emptyLine(),
      dataTable(
        ["序号", "议题", "概要描述"],
        [
          // PLACEHOLDER: Add rows for each major topic
          [{ text: "1", align: AlignmentType.CENTER }, "PLACEHOLDER: 议题名称", "PLACEHOLDER: 简要描述"],
          [{ text: "2", align: AlignmentType.CENTER }, "PLACEHOLDER: 议题名称", "PLACEHOLDER: 简要描述"],
          [{ text: "3", align: AlignmentType.CENTER }, "PLACEHOLDER: 议题名称", "PLACEHOLDER: 简要描述"],
        ],
        [600, 2400, 6506]
      ),
      emptyLine(),

      // ================================================================
      // SECTION III: Detailed Discussion (CORE SECTION)
      // PLACEHOLDER: Replicate this pattern for each major topic
      // ================================================================
      heading1("三、核心议题逐条讨论与决议"),

      // --- Topic 1 ---
      heading2("3.1 PLACEHOLDER: 议题一标题"),
      heading3("3.1.1 问题分析"),
      bodyText("PLACEHOLDER: 背景和问题描述..."),

      heading3("3.1.2 讨论要点"),
      bodyRuns([
        { text: "PLACEHOLDER 观点一：", bold: true },
        { text: "详细内容..." },
      ]),
      bodyRuns([
        { text: "PLACEHOLDER 观点二：", bold: true },
        { text: "详细内容..." },
      ]),

      heading3("3.1.3 达成共识与决议"),
      bulletRuns([
        { text: "决议一：", bold: true },
        { text: "PLACEHOLDER 具体内容..." },
      ]),
      bulletRuns([
        { text: "决议二：", bold: true },
        { text: "PLACEHOLDER 具体内容..." },
      ]),

      // --- Topic 2 (repeat pattern) ---
      // heading2("3.2 PLACEHOLDER: 议题二标题"),
      // ...

      // ================================================================
      // SECTION IV: Other Important Topics
      // PLACEHOLDER: Add secondary topics here
      // ================================================================
      heading1("四、其他重要议题"),

      heading2("4.1 PLACEHOLDER: 次要议题标题"),
      bodyText("PLACEHOLDER: 讨论内容概述..."),
      bulletItem("PLACEHOLDER: 要点一"),
      bulletItem("PLACEHOLDER: 要点二"),

      // ================================================================
      // SECTION V: Situational Analysis (optional)
      // PLACEHOLDER: Add context-specific analysis (reviewer stances,
      //   stakeholder mapping, risk assessment, etc.)
      //   Skip entirely if not applicable.
      // ================================================================
      heading1("五、背景与形势分析"),
      bodyText("PLACEHOLDER: 分析性文字..."),
      emptyLine(),
      // Example: comparison/analysis table
      dataTable(
        ["维度", "分析A", "分析B"],
        [
          ["PLACEHOLDER", "PLACEHOLDER", "PLACEHOLDER"],
        ],
        [1600, 3953, 3953]
      ),
      emptyLine(),

      // ================================================================
      // SECTION VI: Action Plan
      // PLACEHOLDER: Fill in action items table
      // ================================================================
      heading1("六、行动计划与优先级"),
      heading2("6.1 待办事项"),
      emptyLine(),
      dataTable(
        ["序号", "任务内容", "具体要求", "优先级/时间"],
        [
          // PLACEHOLDER: Add action item rows
          [{ text: "1", align: AlignmentType.CENTER }, { text: "PLACEHOLDER", bold: true }, "PLACEHOLDER", "PLACEHOLDER"],
          [{ text: "2", align: AlignmentType.CENTER }, { text: "PLACEHOLDER", bold: true }, "PLACEHOLDER", "PLACEHOLDER"],
        ],
        [600, 3200, 3200, 2506]
      ),

      // Include "NOT to do" list if applicable
      heading2("6.2 明确不做的事项"),
      bulletItem("PLACEHOLDER: 明确排除的行动一"),
      bulletItem("PLACEHOLDER: 明确排除的行动二"),

      // ================================================================
      // SECTION VII: Meeting Summary
      // PLACEHOLDER: Write 3-5 synthesis paragraphs
      // ================================================================
      heading1("七、会议总结"),
      bodyText("PLACEHOLDER: 一句总领..."),
      emptyLine(),
      bodyRuns([
        { text: "第一，", bold: true },
        { text: "PLACEHOLDER: 综合性总结要点一..." },
      ]),
      bodyRuns([
        { text: "第二，", bold: true },
        { text: "PLACEHOLDER: 综合性总结要点二..." },
      ]),
      bodyRuns([
        { text: "第三，", bold: true },
        { text: "PLACEHOLDER: 综合性总结要点三..." },
      ]),
      emptyLine(),
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 400 },
        // PLACEHOLDER: Replace with actual date
        children: [new TextRun({ text: "整理日期：YYYY年MM月DD日", font: "SimSun", size: 22, color: "666666" })],
      }),
    ],
  }],
});

// ============================================================
// OUTPUT
// ============================================================
const OUTPUT_PATH = process.argv[2] || "meeting_minutes.docx";

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUTPUT_PATH, buffer);
  console.log(`Document created: ${OUTPUT_PATH}`);
}).catch(err => {
  console.error("Failed to create document:", err);
  process.exit(1);
});
