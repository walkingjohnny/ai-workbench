// slide-04.js — Background & Motivation Content
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  subtype: 'comparison',
  index: 4,
  title: 'The Problem with Sequential Models'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Title
  slide.addText("The Problem with Sequential Models", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 30, fontFace: "Georgia",
    color: theme.primary, bold: true, align: "left",
    margin: 0
  });

  // Left column: RNN Limitations
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.15, w: 4.2, h: 3.5,
    fill: { color: "FFFFFF" },
    shadow: { type: "outer", color: "000000", blur: 4, offset: 2, angle: 135, opacity: 0.08 }
  });
  // Left accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.15, w: 0.08, h: 3.5,
    fill: { color: theme.light }
  });

  slide.addText("RNN / LSTM Limitations", {
    x: 0.85, y: 1.25, w: 3.7, h: 0.4,
    fontSize: 16, fontFace: "Georgia",
    color: theme.secondary, bold: true, align: "left",
    margin: 0
  });

  slide.addText([
    { text: "Sequential computation", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: "Calibri", color: theme.primary } },
    { text: "h(t) depends on h(t-1) \u2014 cannot parallelize", options: { indentLevel: 1, bullet: true, breakLine: true, fontSize: 11, fontFace: "Calibri", color: "555555" } },
    { text: "Long-range dependency problem", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: "Calibri", color: theme.primary } },
    { text: "Signal must traverse O(n) steps", options: { indentLevel: 1, bullet: true, breakLine: true, fontSize: 11, fontFace: "Calibri", color: "555555" } },
    { text: "Memory bottleneck at long sequences", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: "Calibri", color: theme.primary } },
    { text: "Limits batch size for training", options: { indentLevel: 1, bullet: true, fontSize: 11, fontFace: "Calibri", color: "555555" } },
  ], {
    x: 0.85, y: 1.75, w: 3.7, h: 2.7,
    valign: "top", align: "left",
    paraSpaceAfter: 4
  });

  // Right column: Transformer Advantages
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.15, w: 4.2, h: 3.5,
    fill: { color: "FFFFFF" },
    shadow: { type: "outer", color: "000000", blur: 4, offset: 2, angle: 135, opacity: 0.08 }
  });
  // Right accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.15, w: 0.08, h: 3.5,
    fill: { color: theme.accent }
  });

  slide.addText("Transformer Solution", {
    x: 5.65, y: 1.25, w: 3.7, h: 0.4,
    fontSize: 16, fontFace: "Georgia",
    color: theme.primary, bold: true, align: "left",
    margin: 0
  });

  slide.addText([
    { text: "Fully parallelizable", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: "Calibri", color: theme.primary } },
    { text: "No recurrence \u2014 all positions computed at once", options: { indentLevel: 1, bullet: true, breakLine: true, fontSize: 11, fontFace: "Calibri", color: "555555" } },
    { text: "Constant path length O(1)", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: "Calibri", color: theme.primary } },
    { text: "Self-attention connects all positions directly", options: { indentLevel: 1, bullet: true, breakLine: true, fontSize: 11, fontFace: "Calibri", color: "555555" } },
    { text: "Based solely on attention", options: { bullet: true, breakLine: true, fontSize: 13, fontFace: "Calibri", color: theme.primary } },
    { text: "No RNN, no convolution needed", options: { indentLevel: 1, bullet: true, fontSize: 11, fontFace: "Calibri", color: "555555" } },
  ], {
    x: 5.65, y: 1.75, w: 3.7, h: 2.7,
    valign: "top", align: "left",
    paraSpaceAfter: 4
  });

  // Bottom key result callout
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.85, w: 9, h: 0.5,
    fill: { color: theme.primary, transparency: 6 }
  });
  slide.addText("Key Result: 28.4 BLEU (EN-DE), 41.8 BLEU (EN-FR) \u2014 trained in 3.5 days on 8 GPUs", {
    x: 0.7, y: 4.85, w: 8.6, h: 0.5,
    fontSize: 13, fontFace: "Calibri",
    color: theme.primary, align: "center", valign: "middle"
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("4", {
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
  pres.writeFile({ fileName: "slide-04-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
