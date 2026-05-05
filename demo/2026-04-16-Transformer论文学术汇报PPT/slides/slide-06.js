// slide-06.js — Architecture Overview (Encoder-Decoder Diagram)
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  subtype: 'mixed-media',
  index: 6,
  title: 'Architecture Overview'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Title
  slide.addText("Transformer Architecture Overview", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 28, fontFace: "Georgia",
    color: theme.primary, bold: true, align: "left",
    margin: 0
  });

  // === ENCODER (left side) ===
  const encX = 0.7;
  const encW = 3.8;

  // Encoder label
  slide.addShape(pres.shapes.RECTANGLE, {
    x: encX, y: 1.1, w: encW, h: 0.4,
    fill: { color: theme.primary }
  });
  slide.addText("ENCODER (N\u00d76)", {
    x: encX, y: 1.1, w: encW, h: 0.4,
    fontSize: 14, fontFace: "Georgia",
    color: "FFFFFF", bold: true, align: "center", valign: "middle"
  });

  // Encoder blocks (bottom to top)
  const encBlocks = [
    { label: "Input Embedding + Positional Encoding", color: theme.accent, y: 4.2 },
    { label: "Multi-Head Self-Attention", color: theme.secondary, y: 3.4 },
    { label: "Add & Layer Norm", color: "AAAAAA", y: 2.95 },
    { label: "Feed-Forward Network", color: theme.secondary, y: 2.35 },
    { label: "Add & Layer Norm", color: "AAAAAA", y: 1.9 },
  ];

  encBlocks.forEach(b => {
    const h = b.label.includes("Add") ? 0.32 : 0.42;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: encX + 0.15, y: b.y, w: encW - 0.3, h: h,
      fill: { color: b.color, transparency: 15 },
      line: { color: b.color, width: 1 }
    });
    slide.addText(b.label, {
      x: encX + 0.15, y: b.y, w: encW - 0.3, h: h,
      fontSize: 10, fontFace: "Calibri",
      color: theme.primary, align: "center", valign: "middle"
    });
  });

  // Arrows between encoder blocks
  const encArrowYs = [4.0, 3.65, 3.2, 2.75];
  encArrowYs.forEach(ay => {
    slide.addText("\u2191", {
      x: encX + encW / 2 - 0.15, y: ay, w: 0.3, h: 0.2,
      fontSize: 14, fontFace: "Calibri",
      color: theme.primary, align: "center", valign: "middle"
    });
  });

  // Nx6 bracket
  slide.addShape(pres.shapes.RECTANGLE, {
    x: encX + encW - 0.05, y: 1.9, w: 0.05, h: 2.72,
    fill: { color: theme.primary }
  });
  slide.addText("N\u00d7", {
    x: encX + encW + 0.05, y: 2.9, w: 0.4, h: 0.3,
    fontSize: 11, fontFace: "Calibri",
    color: theme.primary, bold: true, align: "left"
  });

  // === DECODER (right side) ===
  const decX = 5.5;
  const decW = 3.8;

  // Decoder label
  slide.addShape(pres.shapes.RECTANGLE, {
    x: decX, y: 1.1, w: decW, h: 0.4,
    fill: { color: theme.secondary }
  });
  slide.addText("DECODER (N\u00d76)", {
    x: decX, y: 1.1, w: decW, h: 0.4,
    fontSize: 14, fontFace: "Georgia",
    color: "FFFFFF", bold: true, align: "center", valign: "middle"
  });

  // Decoder blocks
  const decBlocks = [
    { label: "Output Embedding + Positional Encoding", color: theme.accent, y: 4.2 },
    { label: "Masked Multi-Head Self-Attention", color: theme.light, y: 3.4 },
    { label: "Add & Layer Norm", color: "AAAAAA", y: 2.95 },
    { label: "Encoder-Decoder Attention", color: theme.light, y: 2.35 },
    { label: "Add & Norm \u2192 FFN \u2192 Add & Norm", color: "AAAAAA", y: 1.9 },
  ];

  decBlocks.forEach(b => {
    const h = b.label.includes("Add") ? 0.32 : 0.42;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: decX + 0.15, y: b.y, w: decW - 0.3, h: h,
      fill: { color: b.color, transparency: 15 },
      line: { color: b.color, width: 1 }
    });
    slide.addText(b.label, {
      x: decX + 0.15, y: b.y, w: decW - 0.3, h: h,
      fontSize: 10, fontFace: "Calibri",
      color: theme.primary, align: "center", valign: "middle"
    });
  });

  // Arrows between decoder blocks
  const decArrowYs = [4.0, 3.65, 3.2, 2.75];
  decArrowYs.forEach(ay => {
    slide.addText("\u2191", {
      x: decX + decW / 2 - 0.15, y: ay, w: 0.3, h: 0.2,
      fontSize: 14, fontFace: "Calibri",
      color: theme.primary, align: "center", valign: "middle"
    });
  });

  // Nx6 bracket for decoder
  slide.addShape(pres.shapes.RECTANGLE, {
    x: decX + decW - 0.05, y: 1.9, w: 0.05, h: 2.72,
    fill: { color: theme.secondary }
  });
  slide.addText("N\u00d7", {
    x: decX + decW + 0.05, y: 2.9, w: 0.4, h: 0.3,
    fontSize: 11, fontFace: "Calibri",
    color: theme.secondary, bold: true, align: "left"
  });

  // Cross-connection arrow (encoder output to decoder)
  slide.addShape(pres.shapes.LINE, {
    x: encX + encW, y: 2.55, w: decX - encX - encW, h: 0,
    line: { color: theme.primary, width: 1.5 }
  });
  slide.addText("\u2192", {
    x: 4.7, y: 2.4, w: 0.4, h: 0.3,
    fontSize: 16, fontFace: "Calibri",
    color: theme.primary, align: "center"
  });

  // Output arrow at top of decoder
  slide.addText("Linear + Softmax \u2192 Output Probabilities", {
    x: decX, y: 1.55, w: decW, h: 0.25,
    fontSize: 9, fontFace: "Calibri",
    color: theme.secondary, align: "center"
  });

  // Key parameters box at bottom
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.85, w: 9, h: 0.5,
    fill: { color: "FFFFFF" },
    line: { color: theme.accent, width: 0.5 }
  });
  slide.addText("d_model = 512  |  N = 6 layers  |  h = 8 heads  |  d_ff = 2048  |  d_k = d_v = 64", {
    x: 0.7, y: 4.85, w: 8.6, h: 0.5,
    fontSize: 12, fontFace: "Calibri",
    color: theme.primary, align: "center", valign: "middle"
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("6", {
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
  pres.writeFile({ fileName: "slide-06-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
