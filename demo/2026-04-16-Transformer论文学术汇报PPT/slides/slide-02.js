// slide-02.js — Table of Contents
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'toc',
  index: 2,
  title: 'Outline'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Title
  slide.addText("Outline", {
    x: 0.6, y: 0.3, w: 8, h: 0.7,
    fontSize: 36, fontFace: "Georgia",
    color: theme.primary, bold: true, align: "left"
  });

  // Divider line under title
  slide.addShape(pres.shapes.LINE, {
    x: 0.6, y: 1.05, w: 2.5, h: 0,
    line: { color: theme.light, width: 2 }
  });

  const sections = [
    { num: "01", title: "Background & Motivation", desc: "RNN limitations and the need for parallelism" },
    { num: "02", title: "Model Architecture", desc: "Encoder-decoder structure and key components" },
    { num: "03", title: "Attention Mechanism", desc: "Scaled Dot-Product and Multi-Head Attention" },
    { num: "04", title: "Key Components & Code", desc: "FFN, positional encoding, and implementation" },
    { num: "05", title: "Experiments & Results", desc: "Machine translation benchmarks and ablations" },
    { num: "06", title: "Conclusion & Discussion", desc: "Key takeaways and future directions" },
  ];

  const startY = 1.4;
  const rowH = 0.62;

  sections.forEach((s, i) => {
    const y = startY + i * rowH;

    // Number circle
    slide.addShape(pres.shapes.OVAL, {
      x: 0.6, y: y + 0.05, w: 0.42, h: 0.42,
      fill: { color: theme.primary }
    });
    slide.addText(s.num, {
      x: 0.6, y: y + 0.05, w: 0.42, h: 0.42,
      fontSize: 14, fontFace: "Georgia",
      color: "FFFFFF", bold: true,
      align: "center", valign: "middle"
    });

    // Section title
    slide.addText(s.title, {
      x: 1.25, y: y, w: 5, h: 0.3,
      fontSize: 18, fontFace: "Georgia",
      color: theme.primary, bold: true, align: "left",
      margin: 0
    });

    // Section description
    slide.addText(s.desc, {
      x: 1.25, y: y + 0.3, w: 5, h: 0.25,
      fontSize: 12, fontFace: "Calibri",
      color: theme.accent, align: "left",
      margin: 0
    });
  });

  // Right side decorative block
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 7.5, y: 1.2, w: 2.1, h: 3.8,
    fill: { color: theme.primary, transparency: 8 }
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("2", {
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
  pres.writeFile({ fileName: "slide-02-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
