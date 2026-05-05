// slide-07.js — Encoder & Decoder Details
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  subtype: 'text',
  index: 7,
  title: 'Encoder & Decoder Stacks'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Title
  slide.addText("Encoder & Decoder Stacks", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 28, fontFace: "Georgia",
    color: theme.primary, bold: true, align: "left",
    margin: 0
  });

  // === Encoder Card ===
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 4.2, h: 3.8,
    fill: { color: "FFFFFF" },
    shadow: { type: "outer", color: "000000", blur: 4, offset: 2, angle: 135, opacity: 0.08 }
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 4.2, h: 0.45,
    fill: { color: theme.primary }
  });
  slide.addText("Encoder", {
    x: 0.5, y: 1.1, w: 4.2, h: 0.45,
    fontSize: 16, fontFace: "Georgia",
    color: "FFFFFF", bold: true, align: "center", valign: "middle"
  });

  slide.addText([
    { text: "Stack of N = 6 identical layers", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: "Calibri", color: theme.primary } },
    { text: "Each layer has 2 sub-layers:", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: "Calibri", color: theme.primary } },
    { text: "Multi-Head Self-Attention", options: { bullet: true, indentLevel: 1, breakLine: true, fontSize: 12, fontFace: "Calibri", color: "444444" } },
    { text: "Position-wise Feed-Forward Network", options: { bullet: true, indentLevel: 1, breakLine: true, fontSize: 12, fontFace: "Calibri", color: "444444" } },
    { text: "Residual connection + Layer Norm around each sub-layer", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: "Calibri", color: theme.primary } },
    { text: "Output: LayerNorm(x + Sublayer(x))", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: "Calibri", color: theme.secondary } },
    { text: "All sub-layers output d_model = 512", options: { bullet: true, fontSize: 13, fontFace: "Calibri", color: theme.primary } },
  ], {
    x: 0.7, y: 1.7, w: 3.8, h: 3.0,
    valign: "top", align: "left",
    paraSpaceAfter: 4
  });

  // === Decoder Card ===
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.1, w: 4.2, h: 3.8,
    fill: { color: "FFFFFF" },
    shadow: { type: "outer", color: "000000", blur: 4, offset: 2, angle: 135, opacity: 0.08 }
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.1, w: 4.2, h: 0.45,
    fill: { color: theme.secondary }
  });
  slide.addText("Decoder", {
    x: 5.3, y: 1.1, w: 4.2, h: 0.45,
    fontSize: 16, fontFace: "Georgia",
    color: "FFFFFF", bold: true, align: "center", valign: "middle"
  });

  slide.addText([
    { text: "Also N = 6 identical layers", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: "Calibri", color: theme.primary } },
    { text: "Each layer has 3 sub-layers:", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: "Calibri", color: theme.primary } },
    { text: "Masked Multi-Head Self-Attention", options: { bullet: true, indentLevel: 1, breakLine: true, fontSize: 12, fontFace: "Calibri", color: "444444" } },
    { text: "Encoder-Decoder Attention", options: { bullet: true, indentLevel: 1, breakLine: true, fontSize: 12, fontFace: "Calibri", color: "444444" } },
    { text: "Position-wise FFN", options: { bullet: true, indentLevel: 1, breakLine: true, fontSize: 12, fontFace: "Calibri", color: "444444" } },
    { text: "Masking prevents attending to future positions (auto-regressive)", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: "Calibri", color: theme.secondary } },
    { text: "Same residual + LayerNorm pattern", options: { bullet: true, fontSize: 13, fontFace: "Calibri", color: theme.primary } },
  ], {
    x: 5.5, y: 1.7, w: 3.8, h: 3.0,
    valign: "top", align: "left",
    paraSpaceAfter: 4
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("7", {
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
  pres.writeFile({ fileName: "slide-07-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
