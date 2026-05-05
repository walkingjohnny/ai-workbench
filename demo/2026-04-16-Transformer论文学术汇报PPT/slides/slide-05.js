// slide-05.js — Section Divider: Model Architecture
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'section-divider',
  index: 5,
  title: 'Model Architecture'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.primary };

  // Large section number
  slide.addText("02", {
    x: 0.6, y: 0.8, w: 3, h: 2,
    fontSize: 96, fontFace: "Georgia",
    color: theme.accent, bold: true, align: "left",
    margin: 0
  });

  // Section title
  slide.addText("Model\nArchitecture", {
    x: 0.6, y: 2.6, w: 6, h: 1.2,
    fontSize: 40, fontFace: "Georgia",
    color: "FFFFFF", bold: true, align: "left",
    margin: 0
  });

  // Intro text
  slide.addText("The Transformer: encoder-decoder with stacked self-attention", {
    x: 0.6, y: 3.9, w: 7, h: 0.4,
    fontSize: 16, fontFace: "Calibri",
    color: theme.accent, align: "left",
    margin: 0
  });

  // Right decorative bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 9.3, y: 0.5, w: 0.12, h: 4.6,
    fill: { color: theme.light }
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("5", {
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
  pres.writeFile({ fileName: "slide-05-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
