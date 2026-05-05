// slide-09.js — Scaled Dot-Product Attention (Formula + Diagram)
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  subtype: 'mixed-media',
  index: 9,
  title: 'Scaled Dot-Product Attention'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Title
  slide.addText("Scaled Dot-Product Attention", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 28, fontFace: "Georgia",
    color: theme.primary, bold: true, align: "left",
    margin: 0
  });

  // === Left: Formula and explanation ===

  // Formula box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 5.3, h: 1.0,
    fill: { color: "FFFFFF" },
    line: { color: theme.accent, width: 1.5 }
  });
  slide.addText("Attention(Q, K, V) = softmax( QK\u1d40 / \u221Ad_k ) V", {
    x: 0.7, y: 1.15, w: 4.9, h: 0.9,
    fontSize: 20, fontFace: "Calibri",
    color: theme.primary, bold: true, align: "center", valign: "middle"
  });

  // Step-by-step breakdown
  slide.addText("Step-by-Step Derivation", {
    x: 0.5, y: 2.3, w: 5.3, h: 0.35,
    fontSize: 16, fontFace: "Georgia",
    color: theme.secondary, bold: true, align: "left",
    margin: 0
  });

  // Process flow with numbered steps
  const steps = [
    { num: "1", text: "Compute dot products: QK\u1d40 \u2208 R^(n\u00d7n)" },
    { num: "2", text: "Scale by 1/\u221Ad_k to prevent large gradients" },
    { num: "3", text: "Apply softmax to get attention weights" },
    { num: "4", text: "Multiply weights by V for output" },
  ];

  steps.forEach((s, i) => {
    const y = 2.8 + i * 0.5;

    // Number circle
    slide.addShape(pres.shapes.OVAL, {
      x: 0.6, y: y + 0.02, w: 0.3, h: 0.3,
      fill: { color: theme.accent }
    });
    slide.addText(s.num, {
      x: 0.6, y: y + 0.02, w: 0.3, h: 0.3,
      fontSize: 11, fontFace: "Calibri",
      color: "FFFFFF", bold: true,
      align: "center", valign: "middle"
    });

    slide.addText(s.text, {
      x: 1.05, y: y, w: 4.5, h: 0.35,
      fontSize: 13, fontFace: "Calibri",
      color: theme.primary, align: "left", valign: "middle",
      margin: 0
    });
  });

  // === Right: Diagram ===
  const dX = 6.2;

  slide.addText("Computation Flow", {
    x: dX, y: 1.1, w: 3.3, h: 0.35,
    fontSize: 14, fontFace: "Georgia",
    color: theme.secondary, bold: true, align: "center",
    margin: 0
  });

  // Input boxes (Q, K, V)
  const inputBoxes = [
    { label: "Q", x: dX + 0.2 },
    { label: "K", x: dX + 1.3 },
    { label: "V", x: dX + 2.4 },
  ];

  inputBoxes.forEach(b => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: b.x, y: 4.1, w: 0.7, h: 0.4,
      fill: { color: theme.accent }
    });
    slide.addText(b.label, {
      x: b.x, y: 4.1, w: 0.7, h: 0.4,
      fontSize: 14, fontFace: "Georgia",
      color: "FFFFFF", bold: true,
      align: "center", valign: "middle"
    });
  });

  // MatMul box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: dX + 0.4, y: 3.45, w: 1.3, h: 0.4,
    fill: { color: theme.primary, transparency: 15 },
    line: { color: theme.primary, width: 1 }
  });
  slide.addText("MatMul", {
    x: dX + 0.4, y: 3.45, w: 1.3, h: 0.4,
    fontSize: 11, fontFace: "Calibri",
    color: theme.primary, align: "center", valign: "middle"
  });

  // Scale box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: dX + 0.4, y: 2.85, w: 1.3, h: 0.35,
    fill: { color: theme.light, transparency: 25 },
    line: { color: theme.light, width: 1 }
  });
  slide.addText("Scale (1/\u221Ad_k)", {
    x: dX + 0.4, y: 2.85, w: 1.3, h: 0.35,
    fontSize: 10, fontFace: "Calibri",
    color: theme.secondary, align: "center", valign: "middle"
  });

  // Softmax box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: dX + 0.4, y: 2.3, w: 1.3, h: 0.35,
    fill: { color: theme.accent, transparency: 20 },
    line: { color: theme.accent, width: 1 }
  });
  slide.addText("Softmax", {
    x: dX + 0.4, y: 2.3, w: 1.3, h: 0.35,
    fontSize: 11, fontFace: "Calibri",
    color: theme.primary, align: "center", valign: "middle"
  });

  // Final MatMul (with V)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: dX + 0.8, y: 1.7, w: 1.5, h: 0.4,
    fill: { color: theme.primary, transparency: 15 },
    line: { color: theme.primary, width: 1 }
  });
  slide.addText("MatMul (with V)", {
    x: dX + 0.8, y: 1.7, w: 1.5, h: 0.4,
    fontSize: 11, fontFace: "Calibri",
    color: theme.primary, align: "center", valign: "middle"
  });

  // Arrows
  const arrows = [
    { x: dX + 1.05, y1: 3.95, y2: 3.85 },
    { x: dX + 1.05, y1: 3.35, y2: 3.2 },
    { x: dX + 1.05, y1: 2.75, y2: 2.65 },
    { x: dX + 1.55, y1: 2.2, y2: 2.1 },
  ];
  arrows.forEach(a => {
    slide.addText("\u2191", {
      x: a.x, y: a.y2, w: 0.2, h: 0.2,
      fontSize: 12, fontFace: "Calibri",
      color: theme.primary, align: "center"
    });
  });

  // Why scaling? note
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.85, w: 9, h: 0.5,
    fill: { color: "FFFFFF" },
    line: { color: theme.secondary, width: 0.5 }
  });
  slide.addText("Why scale? For large d_k, dot products grow large \u2192 softmax saturates \u2192 vanishing gradients. Scaling by 1/\u221Ad_k stabilizes training.", {
    x: 0.7, y: 4.85, w: 8.6, h: 0.5,
    fontSize: 11, fontFace: "Calibri",
    color: theme.primary, align: "left", valign: "middle"
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("9", {
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
  pres.writeFile({ fileName: "slide-09-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
