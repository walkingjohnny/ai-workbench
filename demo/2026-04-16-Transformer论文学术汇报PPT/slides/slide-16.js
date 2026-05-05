// slide-16.js — Machine Translation Results (Table 2 from paper + Chart)
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  subtype: 'data-visualization',
  index: 16,
  title: 'Machine Translation Results'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Title
  slide.addText("Machine Translation Results (WMT 2014)", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 26, fontFace: "Georgia",
    color: theme.primary, bold: true, align: "left",
    margin: 0
  });

  // === Left: Bar chart (EN-DE BLEU scores) ===
  slide.addChart(pres.charts.BAR, [
    {
      name: "EN-DE BLEU",
      labels: ["ByteNet", "GNMT+RL", "ConvS2S", "MoE", "Transformer\n(base)", "Transformer\n(big)"],
      values: [23.75, 24.6, 25.16, 26.03, 27.3, 28.4]
    }
  ], {
    x: 0.4, y: 1.05, w: 5.0, h: 3.2,
    barDir: "col",
    showTitle: true,
    title: "English-to-German BLEU Scores",
    titleFontFace: "Georgia",
    titleFontSize: 12,
    titleColor: theme.primary,
    chartColors: ["AAAAAA", "AAAAAA", "AAAAAA", "AAAAAA", theme.accent, theme.secondary],
    chartArea: { fill: { color: "FFFFFF" }, roundedCorners: true },
    catAxisLabelColor: theme.primary,
    catAxisLabelFontSize: 8,
    valAxisLabelColor: "888888",
    valGridLine: { color: "E2E8F0", size: 0.5 },
    catGridLine: { style: "none" },
    showValue: true,
    dataLabelPosition: "outEnd",
    dataLabelColor: theme.primary,
    dataLabelFontSize: 9,
    showLegend: false,
    valAxisMinVal: 20,
  });

  // === Right: Key numbers and training info ===
  slide.addText("Key Results", {
    x: 5.8, y: 1.05, w: 3.7, h: 0.35,
    fontSize: 16, fontFace: "Georgia",
    color: theme.secondary, bold: true, align: "left",
    margin: 0
  });

  // EN-DE stat
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.8, y: 1.55, w: 3.7, h: 1.0,
    fill: { color: "FFFFFF" },
    shadow: { type: "outer", color: "000000", blur: 3, offset: 1, angle: 135, opacity: 0.06 }
  });
  slide.addText("28.4", {
    x: 5.8, y: 1.55, w: 1.5, h: 1.0,
    fontSize: 42, fontFace: "Georgia",
    color: theme.secondary, bold: true, align: "center", valign: "middle"
  });
  slide.addText([
    { text: "BLEU (EN-DE)", options: { breakLine: true, fontSize: 13, fontFace: "Calibri", color: theme.primary, bold: true } },
    { text: "+2.0 over previous SOTA", options: { breakLine: true, fontSize: 11, fontFace: "Calibri", color: theme.accent } },
    { text: "including ensembles", options: { fontSize: 10, fontFace: "Calibri", color: "888888" } },
  ], {
    x: 7.2, y: 1.55, w: 2.3, h: 1.0,
    valign: "middle", align: "left"
  });

  // EN-FR stat
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.8, y: 2.7, w: 3.7, h: 1.0,
    fill: { color: "FFFFFF" },
    shadow: { type: "outer", color: "000000", blur: 3, offset: 1, angle: 135, opacity: 0.06 }
  });
  slide.addText("41.8", {
    x: 5.8, y: 2.7, w: 1.5, h: 1.0,
    fontSize: 42, fontFace: "Georgia",
    color: theme.primary, bold: true, align: "center", valign: "middle"
  });
  slide.addText([
    { text: "BLEU (EN-FR)", options: { breakLine: true, fontSize: 13, fontFace: "Calibri", color: theme.primary, bold: true } },
    { text: "New single-model SOTA", options: { breakLine: true, fontSize: 11, fontFace: "Calibri", color: theme.accent } },
    { text: "< 1/4 training cost of prev. SOTA", options: { fontSize: 10, fontFace: "Calibri", color: "888888" } },
  ], {
    x: 7.2, y: 2.7, w: 2.3, h: 1.0,
    valign: "middle", align: "left"
  });

  // Training details
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.8, y: 3.85, w: 3.7, h: 0.5,
    fill: { color: theme.primary, transparency: 6 }
  });
  slide.addText("Training: 3.5 days on 8x P100 GPUs (big model)", {
    x: 5.9, y: 3.85, w: 3.5, h: 0.5,
    fontSize: 11, fontFace: "Calibri",
    color: theme.primary, align: "center", valign: "middle"
  });

  // Bottom source
  slide.addText("Source: Table 2, Vaswani et al. (2017)", {
    x: 0.5, y: 4.85, w: 9, h: 0.3,
    fontSize: 10, fontFace: "Calibri",
    color: "999999", align: "left"
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("16", {
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
  pres.writeFile({ fileName: "slide-16-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
