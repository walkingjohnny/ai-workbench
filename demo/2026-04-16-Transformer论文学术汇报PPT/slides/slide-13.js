// slide-13.js — FFN, Embeddings & Positional Encoding
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  subtype: 'text',
  index: 13,
  title: 'FFN, Embeddings & Positional Encoding'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Title
  slide.addText("Position-wise FFN & Positional Encoding", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 26, fontFace: "Georgia",
    color: theme.primary, bold: true, align: "left",
    margin: 0
  });

  // === Left: FFN ===
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 4.5, h: 2.0,
    fill: { color: "FFFFFF" },
    shadow: { type: "outer", color: "000000", blur: 4, offset: 2, angle: 135, opacity: 0.08 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 0.08, h: 2.0,
    fill: { color: theme.secondary }
  });

  slide.addText("Feed-Forward Network (FFN)", {
    x: 0.8, y: 1.15, w: 4.0, h: 0.35,
    fontSize: 15, fontFace: "Georgia",
    color: theme.secondary, bold: true, align: "left",
    margin: 0
  });

  // Formula
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.6, w: 3.8, h: 0.5,
    fill: { color: theme.primary, transparency: 8 }
  });
  slide.addText("FFN(x) = max(0, xW\u2081 + b\u2081) W\u2082 + b\u2082", {
    x: 0.9, y: 1.6, w: 3.6, h: 0.5,
    fontSize: 15, fontFace: "Calibri",
    color: theme.primary, bold: true, align: "center", valign: "middle"
  });

  slide.addText([
    { text: "Two linear transforms with ReLU between", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: "Calibri", color: theme.primary } },
    { text: "d_model = 512, d_ff = 2048 (inner layer)", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: "Calibri", color: theme.primary } },
    { text: "Applied to each position independently", options: { bullet: true, fontSize: 12, fontFace: "Calibri", color: theme.primary } },
  ], {
    x: 0.8, y: 2.2, w: 4.0, h: 0.8,
    valign: "top", align: "left",
    paraSpaceAfter: 2
  });

  // === Right: Positional Encoding ===
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.1, w: 4.2, h: 2.0,
    fill: { color: "FFFFFF" },
    shadow: { type: "outer", color: "000000", blur: 4, offset: 2, angle: 135, opacity: 0.08 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.1, w: 0.08, h: 2.0,
    fill: { color: theme.accent }
  });

  slide.addText("Positional Encoding", {
    x: 5.6, y: 1.15, w: 3.8, h: 0.35,
    fontSize: 15, fontFace: "Georgia",
    color: theme.primary, bold: true, align: "left",
    margin: 0
  });

  // Formulas
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.6, y: 1.6, w: 3.7, h: 0.75,
    fill: { color: theme.accent, transparency: 10 }
  });
  slide.addText([
    { text: "PE(pos,2i) = sin(pos / 10000^(2i/d_model))", options: { breakLine: true, fontSize: 11, fontFace: "Calibri", color: theme.primary, bold: true } },
    { text: "PE(pos,2i+1) = cos(pos / 10000^(2i/d_model))", options: { fontSize: 11, fontFace: "Calibri", color: theme.primary, bold: true } },
  ], {
    x: 5.7, y: 1.6, w: 3.5, h: 0.75,
    valign: "middle", align: "center"
  });

  slide.addText([
    { text: "Added to input embeddings (same d_model)", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: "Calibri", color: theme.primary } },
    { text: "Enables learning relative positions", options: { bullet: true, fontSize: 12, fontFace: "Calibri", color: theme.primary } },
  ], {
    x: 5.6, y: 2.45, w: 3.8, h: 0.55,
    valign: "top", align: "left",
    paraSpaceAfter: 2
  });

  // === Bottom: Complexity Comparison Table ===
  slide.addText("Computational Complexity Comparison (Table 1 from paper)", {
    x: 0.5, y: 3.35, w: 9, h: 0.35,
    fontSize: 15, fontFace: "Georgia",
    color: theme.secondary, bold: true, align: "left",
    margin: 0
  });

  // Table
  const tableRows = [
    [
      { text: "Layer Type", options: { bold: true, fontSize: 11, fontFace: "Calibri", fill: { color: theme.primary }, color: "FFFFFF", align: "center", valign: "middle" } },
      { text: "Complexity / Layer", options: { bold: true, fontSize: 11, fontFace: "Calibri", fill: { color: theme.primary }, color: "FFFFFF", align: "center", valign: "middle" } },
      { text: "Sequential Ops", options: { bold: true, fontSize: 11, fontFace: "Calibri", fill: { color: theme.primary }, color: "FFFFFF", align: "center", valign: "middle" } },
      { text: "Max Path Length", options: { bold: true, fontSize: 11, fontFace: "Calibri", fill: { color: theme.primary }, color: "FFFFFF", align: "center", valign: "middle" } },
    ],
    [
      { text: "Self-Attention", options: { fontSize: 11, fontFace: "Calibri", color: theme.primary, bold: true, align: "left", valign: "middle" } },
      { text: "O(n\u00b2 \u00b7 d)", options: { fontSize: 11, fontFace: "Calibri", color: theme.primary, align: "center", valign: "middle" } },
      { text: "O(1)", options: { fontSize: 11, fontFace: "Calibri", color: theme.primary, align: "center", valign: "middle" } },
      { text: "O(1)", options: { fontSize: 11, fontFace: "Calibri", color: theme.primary, bold: true, align: "center", valign: "middle" } },
    ],
    [
      { text: "Recurrent", options: { fontSize: 11, fontFace: "Calibri", color: "555555", align: "left", valign: "middle" } },
      { text: "O(n \u00b7 d\u00b2)", options: { fontSize: 11, fontFace: "Calibri", color: "555555", align: "center", valign: "middle" } },
      { text: "O(n)", options: { fontSize: 11, fontFace: "Calibri", color: "555555", align: "center", valign: "middle" } },
      { text: "O(n)", options: { fontSize: 11, fontFace: "Calibri", color: "555555", align: "center", valign: "middle" } },
    ],
    [
      { text: "Convolutional", options: { fontSize: 11, fontFace: "Calibri", color: "555555", align: "left", valign: "middle" } },
      { text: "O(k \u00b7 n \u00b7 d\u00b2)", options: { fontSize: 11, fontFace: "Calibri", color: "555555", align: "center", valign: "middle" } },
      { text: "O(1)", options: { fontSize: 11, fontFace: "Calibri", color: "555555", align: "center", valign: "middle" } },
      { text: "O(log_k(n))", options: { fontSize: 11, fontFace: "Calibri", color: "555555", align: "center", valign: "middle" } },
    ],
  ];

  slide.addTable(tableRows, {
    x: 0.5, y: 3.75, w: 9, h: 1.3,
    border: { pt: 0.5, color: "CCCCCC" },
    colW: [2.2, 2.5, 2.2, 2.1],
    rowH: [0.32, 0.32, 0.32, 0.32],
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("13", {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fontSize: 12, fontFace: "Calibri",
    color: "FFFFFF", bold: true,
    align: "center", valign: "middle"
  });

  return slide;
}

if (require.main === module) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  const theme = {
    primary: "003049",
    secondary: "780000",
    accent: "669bbc",
    light: "c1121f",
    bg: "fdf0d5"
  };
  createSlide(pres, theme);
  pres.writeFile({ fileName: "slide-13-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
