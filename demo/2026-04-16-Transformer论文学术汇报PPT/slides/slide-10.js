// slide-10.js — Multi-Head Attention (Formula + Diagram)
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  subtype: 'mixed-media',
  index: 10,
  title: 'Multi-Head Attention'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Title
  slide.addText("Multi-Head Attention", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 28, fontFace: "Georgia",
    color: theme.primary, bold: true, align: "left",
    margin: 0
  });

  // === Left: Formulas ===

  // Main formula box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 5.0, h: 0.7,
    fill: { color: "FFFFFF" },
    line: { color: theme.accent, width: 1.5 }
  });
  slide.addText("MultiHead(Q,K,V) = Concat(head\u2081,...,head\u2088) W\u1d3c", {
    x: 0.6, y: 1.1, w: 4.8, h: 0.7,
    fontSize: 16, fontFace: "Calibri",
    color: theme.primary, bold: true,
    align: "center", valign: "middle"
  });

  // Head formula box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.95, w: 5.0, h: 0.55,
    fill: { color: "FFFFFF" },
    line: { color: theme.secondary, width: 1 }
  });
  slide.addText("head\u1d62 = Attention(Q W\u1d62\u1d60, K W\u1d62\u1d37, V W\u1d62\u1d5b)", {
    x: 0.6, y: 1.95, w: 4.8, h: 0.55,
    fontSize: 15, fontFace: "Calibri",
    color: theme.secondary, bold: true,
    align: "center", valign: "middle"
  });

  // Parameter dimensions
  slide.addText("Parameter Dimensions", {
    x: 0.5, y: 2.7, w: 5.0, h: 0.35,
    fontSize: 15, fontFace: "Georgia",
    color: theme.secondary, bold: true, align: "left",
    margin: 0
  });

  const params = [
    ["W\u1d62\u1d60", "d_model \u00d7 d_k", "512 \u00d7 64"],
    ["W\u1d62\u1d37", "d_model \u00d7 d_k", "512 \u00d7 64"],
    ["W\u1d62\u1d5b", "d_model \u00d7 d_v", "512 \u00d7 64"],
    ["W\u1d3c", "h\u00b7d_v \u00d7 d_model", "512 \u00d7 512"],
  ];

  // Simple table with rows
  params.forEach((row, i) => {
    const y = 3.15 + i * 0.37;
    const bgColor = i % 2 === 0 ? "FFFFFF" : theme.bg;

    slide.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: y, w: 5.0, h: 0.35,
      fill: { color: bgColor }
    });

    slide.addText(row[0], {
      x: 0.6, y: y, w: 1.2, h: 0.35,
      fontSize: 12, fontFace: "Calibri",
      color: theme.primary, bold: true, align: "left", valign: "middle",
      margin: 0
    });
    slide.addText(row[1], {
      x: 1.8, y: y, w: 2.0, h: 0.35,
      fontSize: 12, fontFace: "Calibri",
      color: "555555", align: "left", valign: "middle",
      margin: 0
    });
    slide.addText(row[2], {
      x: 3.8, y: y, w: 1.5, h: 0.35,
      fontSize: 12, fontFace: "Calibri",
      color: theme.accent, align: "left", valign: "middle",
      margin: 0
    });
  });

  // === Right: Diagram ===
  const rX = 5.8;

  slide.addText("Multi-Head Mechanism", {
    x: rX, y: 1.1, w: 3.8, h: 0.35,
    fontSize: 14, fontFace: "Georgia",
    color: theme.secondary, bold: true, align: "center",
    margin: 0
  });

  // Input Q, K, V at bottom
  const inputs = [
    { label: "Q", x: rX + 0.3 },
    { label: "K", x: rX + 1.4 },
    { label: "V", x: rX + 2.5 },
  ];

  inputs.forEach(inp => {
    slide.addShape(pres.shapes.RECTANGLE, {
      x: inp.x, y: 4.15, w: 0.7, h: 0.35,
      fill: { color: theme.accent }
    });
    slide.addText(inp.label, {
      x: inp.x, y: 4.15, w: 0.7, h: 0.35,
      fontSize: 13, fontFace: "Georgia",
      color: "FFFFFF", bold: true,
      align: "center", valign: "middle"
    });
  });

  // Linear projection layers
  slide.addShape(pres.shapes.RECTANGLE, {
    x: rX + 0.1, y: 3.55, w: 3.2, h: 0.35,
    fill: { color: theme.primary, transparency: 15 },
    line: { color: theme.primary, width: 0.75 }
  });
  slide.addText("Linear Projections (\u00d7 h heads)", {
    x: rX + 0.1, y: 3.55, w: 3.2, h: 0.35,
    fontSize: 10, fontFace: "Calibri",
    color: theme.primary, align: "center", valign: "middle"
  });

  // Parallel attention heads
  const headColors = [theme.accent, theme.secondary, theme.light, theme.primary];
  for (let i = 0; i < 4; i++) {
    const hx = rX + 0.2 + i * 0.8;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: hx, y: 2.85, w: 0.65, h: 0.45,
      fill: { color: headColors[i], transparency: 25 },
      line: { color: headColors[i], width: 0.75 }
    });
    slide.addText("Head " + (i + 1), {
      x: hx, y: 2.85, w: 0.65, h: 0.45,
      fontSize: 8, fontFace: "Calibri",
      color: theme.primary, align: "center", valign: "middle"
    });
  }

  // Dots for remaining heads
  slide.addText("...", {
    x: rX + 2.7, y: 2.85, w: 0.4, h: 0.45,
    fontSize: 16, fontFace: "Calibri",
    color: theme.primary, align: "center", valign: "middle"
  });

  // Concat box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: rX + 0.5, y: 2.15, w: 2.4, h: 0.4,
    fill: { color: theme.accent, transparency: 15 },
    line: { color: theme.accent, width: 1 }
  });
  slide.addText("Concat", {
    x: rX + 0.5, y: 2.15, w: 2.4, h: 0.4,
    fontSize: 12, fontFace: "Calibri",
    color: theme.primary, bold: true, align: "center", valign: "middle"
  });

  // Final linear
  slide.addShape(pres.shapes.RECTANGLE, {
    x: rX + 0.5, y: 1.55, w: 2.4, h: 0.35,
    fill: { color: theme.primary },
  });
  slide.addText("Linear (W\u1d3c)", {
    x: rX + 0.5, y: 1.55, w: 2.4, h: 0.35,
    fontSize: 11, fontFace: "Calibri",
    color: "FFFFFF", bold: true, align: "center", valign: "middle"
  });

  // Key insight box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.85, w: 9, h: 0.5,
    fill: { color: "FFFFFF" },
    line: { color: theme.accent, width: 0.5 }
  });
  slide.addText("Key Insight: h = 8 parallel heads, each with d_k = d_v = 64. Total cost \u2248 single-head attention with full d_model = 512.", {
    x: 0.7, y: 4.85, w: 8.6, h: 0.5,
    fontSize: 11, fontFace: "Calibri",
    color: theme.primary, align: "left", valign: "middle"
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("10", {
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
  pres.writeFile({ fileName: "slide-10-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
