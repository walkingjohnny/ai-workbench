// slide-01.js — Cover Page
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'cover',
  index: 1,
  title: 'Attention Is All You Need'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.primary };

  // Decorative top bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.08,
    fill: { color: theme.light }
  });

  // Decorative left accent block
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.2, w: 0.1, h: 2.8,
    fill: { color: theme.accent }
  });

  // Main title
  slide.addText("Attention Is All You Need", {
    x: 0.9, y: 1.2, w: 8.5, h: 1.4,
    fontSize: 44, fontFace: "Georgia",
    color: "FFFFFF", bold: true, align: "left",
    fit: "shrink"
  });

  // Subtitle
  slide.addText("A Paper Presentation on the Transformer Architecture", {
    x: 0.9, y: 2.6, w: 8.5, h: 0.5,
    fontSize: 18, fontFace: "Calibri",
    color: theme.accent, align: "left"
  });

  // Divider line
  slide.addShape(pres.shapes.LINE, {
    x: 0.9, y: 3.3, w: 4, h: 0,
    line: { color: theme.accent, width: 1.5 }
  });

  // Authors
  slide.addText("Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez, Kaiser, Polosukhin", {
    x: 0.9, y: 3.5, w: 8.5, h: 0.4,
    fontSize: 14, fontFace: "Calibri",
    color: theme.accent, align: "left"
  });

  // Venue and year
  slide.addText("NeurIPS 2017 (NIPS)  |  Google Brain / Google Research", {
    x: 0.9, y: 3.95, w: 8.5, h: 0.35,
    fontSize: 12, fontFace: "Calibri",
    color: theme.accent, align: "left"
  });

  // Bottom decorative bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.3, w: 10, h: 0.325,
    fill: { color: theme.secondary }
  });

  // Date
  slide.addText("Academic Presentation  |  2026", {
    x: 0.9, y: 4.6, w: 4, h: 0.35,
    fontSize: 11, fontFace: "Calibri",
    color: theme.accent, align: "left"
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
  pres.writeFile({ fileName: "slide-01-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
