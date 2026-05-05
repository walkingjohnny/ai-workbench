// slide-17.js — Model Variations & Ablation Study (Table 3)
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  subtype: 'data-visualization',
  index: 17,
  title: 'Model Variations & Ablation'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Title
  slide.addText("Ablation Study: What Matters?", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 26, fontFace: "Georgia",
    color: theme.primary, bold: true, align: "left",
    margin: 0
  });

  // === Left: Key findings ===
  const findings = [
    {
      title: "Number of Heads",
      detail: "h=8 is optimal. Single-head: -0.9 BLEU. Too many heads (32): quality drops.",
      icon: "A"
    },
    {
      title: "Attention Key Size",
      detail: "Reducing d_k hurts quality. Compatibility function matters.",
      icon: "B"
    },
    {
      title: "Model Size",
      detail: "Bigger models are better: d_model 1024 \u2192 +0.2 BLEU.",
      icon: "C"
    },
    {
      title: "Dropout",
      detail: "Dropout (0.1) is essential for avoiding overfitting.",
      icon: "D"
    },
    {
      title: "Positional Encoding",
      detail: "Sinusoidal \u2248 learned embeddings. Sinusoidal chosen for extrapolation.",
      icon: "E"
    },
  ];

  findings.forEach((f, i) => {
    const y = 1.15 + i * 0.72;

    // Icon circle
    slide.addShape(pres.shapes.OVAL, {
      x: 0.5, y: y + 0.05, w: 0.36, h: 0.36,
      fill: { color: theme.secondary }
    });
    slide.addText(f.icon, {
      x: 0.5, y: y + 0.05, w: 0.36, h: 0.36,
      fontSize: 12, fontFace: "Georgia",
      color: "FFFFFF", bold: true,
      align: "center", valign: "middle"
    });

    // Title
    slide.addText(f.title, {
      x: 1.05, y: y, w: 3.5, h: 0.28,
      fontSize: 14, fontFace: "Georgia",
      color: theme.primary, bold: true, align: "left",
      margin: 0
    });

    // Detail
    slide.addText(f.detail, {
      x: 1.05, y: y + 0.28, w: 3.8, h: 0.38,
      fontSize: 11, fontFace: "Calibri",
      color: "555555", align: "left",
      margin: 0
    });
  });

  // === Right: Simplified Table 3 ===
  slide.addText("Selected Results (Table 3)", {
    x: 5.3, y: 1.05, w: 4.2, h: 0.35,
    fontSize: 14, fontFace: "Georgia",
    color: theme.secondary, bold: true, align: "left",
    margin: 0
  });

  const tableRows = [
    [
      { text: "Model", options: { bold: true, fontSize: 10, fontFace: "Calibri", fill: { color: theme.primary }, color: "FFFFFF", align: "center", valign: "middle" } },
      { text: "h", options: { bold: true, fontSize: 10, fontFace: "Calibri", fill: { color: theme.primary }, color: "FFFFFF", align: "center", valign: "middle" } },
      { text: "d_k", options: { bold: true, fontSize: 10, fontFace: "Calibri", fill: { color: theme.primary }, color: "FFFFFF", align: "center", valign: "middle" } },
      { text: "BLEU", options: { bold: true, fontSize: 10, fontFace: "Calibri", fill: { color: theme.primary }, color: "FFFFFF", align: "center", valign: "middle" } },
    ],
    [
      { text: "Base", options: { fontSize: 10, fontFace: "Calibri", color: theme.primary, bold: true, align: "center", valign: "middle" } },
      { text: "8", options: { fontSize: 10, fontFace: "Calibri", color: theme.primary, align: "center", valign: "middle" } },
      { text: "64", options: { fontSize: 10, fontFace: "Calibri", color: theme.primary, align: "center", valign: "middle" } },
      { text: "25.8", options: { fontSize: 10, fontFace: "Calibri", color: theme.primary, bold: true, align: "center", valign: "middle" } },
    ],
    [
      { text: "(A) 1 head", options: { fontSize: 10, fontFace: "Calibri", color: "666666", align: "center", valign: "middle" } },
      { text: "1", options: { fontSize: 10, fontFace: "Calibri", color: "666666", align: "center", valign: "middle" } },
      { text: "512", options: { fontSize: 10, fontFace: "Calibri", color: "666666", align: "center", valign: "middle" } },
      { text: "24.9", options: { fontSize: 10, fontFace: "Calibri", color: theme.light, align: "center", valign: "middle" } },
    ],
    [
      { text: "(A) 16 heads", options: { fontSize: 10, fontFace: "Calibri", color: "666666", align: "center", valign: "middle" } },
      { text: "16", options: { fontSize: 10, fontFace: "Calibri", color: "666666", align: "center", valign: "middle" } },
      { text: "32", options: { fontSize: 10, fontFace: "Calibri", color: "666666", align: "center", valign: "middle" } },
      { text: "25.8", options: { fontSize: 10, fontFace: "Calibri", color: "666666", align: "center", valign: "middle" } },
    ],
    [
      { text: "(A) 32 heads", options: { fontSize: 10, fontFace: "Calibri", color: "666666", align: "center", valign: "middle" } },
      { text: "32", options: { fontSize: 10, fontFace: "Calibri", color: "666666", align: "center", valign: "middle" } },
      { text: "16", options: { fontSize: 10, fontFace: "Calibri", color: "666666", align: "center", valign: "middle" } },
      { text: "25.4", options: { fontSize: 10, fontFace: "Calibri", color: theme.light, align: "center", valign: "middle" } },
    ],
    [
      { text: "(C) d_model=256", options: { fontSize: 10, fontFace: "Calibri", color: "666666", align: "center", valign: "middle" } },
      { text: "8", options: { fontSize: 10, fontFace: "Calibri", color: "666666", align: "center", valign: "middle" } },
      { text: "32", options: { fontSize: 10, fontFace: "Calibri", color: "666666", align: "center", valign: "middle" } },
      { text: "24.5", options: { fontSize: 10, fontFace: "Calibri", color: theme.light, align: "center", valign: "middle" } },
    ],
    [
      { text: "(C) d_model=1024", options: { fontSize: 10, fontFace: "Calibri", color: "666666", align: "center", valign: "middle" } },
      { text: "16", options: { fontSize: 10, fontFace: "Calibri", color: "666666", align: "center", valign: "middle" } },
      { text: "128", options: { fontSize: 10, fontFace: "Calibri", color: "666666", align: "center", valign: "middle" } },
      { text: "26.0", options: { fontSize: 10, fontFace: "Calibri", color: theme.accent, bold: true, align: "center", valign: "middle" } },
    ],
    [
      { text: "Big", options: { fontSize: 10, fontFace: "Calibri", color: theme.secondary, bold: true, align: "center", valign: "middle" } },
      { text: "16", options: { fontSize: 10, fontFace: "Calibri", color: theme.secondary, align: "center", valign: "middle" } },
      { text: "-", options: { fontSize: 10, fontFace: "Calibri", color: theme.secondary, align: "center", valign: "middle" } },
      { text: "26.4", options: { fontSize: 10, fontFace: "Calibri", color: theme.secondary, bold: true, align: "center", valign: "middle" } },
    ],
  ];

  slide.addTable(tableRows, {
    x: 5.3, y: 1.5, w: 4.2, h: 2.8,
    border: { pt: 0.5, color: "CCCCCC" },
    colW: [1.4, 0.6, 0.7, 0.7],
    rowH: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
  });

  // Bottom takeaway
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.85, w: 9, h: 0.5,
    fill: { color: "FFFFFF" },
    line: { color: theme.accent, width: 0.5 }
  });
  slide.addText("Takeaway: Model size, attention head count, and regularization all significantly impact performance.", {
    x: 0.7, y: 4.85, w: 8.6, h: 0.5,
    fontSize: 12, fontFace: "Calibri",
    color: theme.primary, align: "left", valign: "middle"
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("17", {
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
  pres.writeFile({ fileName: "slide-17-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
