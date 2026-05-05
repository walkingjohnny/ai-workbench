// slide-03.js — Section Divider: Background & Motivation
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'section-divider',
  index: 3,
  title: 'Background & Motivation'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.primary };

  // Large section number
  slide.addText("01", {
    x: 0.6, y: 0.8, w: 3, h: 2,
    fontSize: 96, fontFace: "Georgia",
    color: theme.accent, bold: true, align: "left",
    margin: 0
  });

  // Section title
  slide.addText("Background &\nMotivation", {
    x: 0.6, y: 2.6, w: 6, h: 1.2,
    fontSize: 40, fontFace: "Georgia",
    color: "FFFFFF", bold: true, align: "left",
    margin: 0
  });

  // Intro text
  slide.addText("Why move beyond recurrence and convolution?", {
    x: 0.6, y: 3.9, w: 6, h: 0.4,
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
  slide.addText("3", {
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
  pres.writeFile({ fileName: "slide-03-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
