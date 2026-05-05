// slide-18.js — Summary / Closing Page
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'summary',
  index: 18,
  title: 'Conclusion & Discussion'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Title
  slide.addText("Conclusion & Discussion", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 30, fontFace: "Georgia",
    color: theme.primary, bold: true, align: "left",
    margin: 0
  });

  // === Left: Key Takeaways ===
  slide.addText("Key Takeaways", {
    x: 0.5, y: 1.1, w: 4.5, h: 0.35,
    fontSize: 18, fontFace: "Georgia",
    color: theme.secondary, bold: true, align: "left",
    margin: 0
  });

  const takeaways = [
    "First sequence transduction model based entirely on attention (no RNN, no CNN)",
    "Achieves new SOTA on EN-DE (28.4) and EN-FR (41.8) translation",
    "Trains significantly faster: 3.5 days on 8 GPUs vs. weeks for competitors",
    "Multi-Head Attention captures diverse patterns at constant path length O(1)",
    "Generalizes to other tasks (English constituency parsing: 92.7 F1)",
  ];

  takeaways.forEach((t, i) => {
    const y = 1.6 + i * 0.58;

    // Checkmark circle
    slide.addShape(pres.shapes.OVAL, {
      x: 0.5, y: y + 0.02, w: 0.3, h: 0.3,
      fill: { color: theme.accent }
    });
    slide.addText("\u2713", {
      x: 0.5, y: y + 0.02, w: 0.3, h: 0.3,
      fontSize: 14, fontFace: "Calibri",
      color: "FFFFFF", bold: true,
      align: "center", valign: "middle"
    });

    slide.addText(t, {
      x: 0.95, y: y, w: 4.0, h: 0.5,
      fontSize: 12, fontFace: "Calibri",
      color: theme.primary, align: "left", valign: "top",
      margin: 0
    });
  });

  // === Right: Impact & Future ===
  slide.addText("Impact & Legacy", {
    x: 5.5, y: 1.1, w: 4, h: 0.35,
    fontSize: 18, fontFace: "Georgia",
    color: theme.secondary, bold: true, align: "left",
    margin: 0
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.5, y: 1.6, w: 4, h: 2.2,
    fill: { color: "FFFFFF" },
    shadow: { type: "outer", color: "000000", blur: 4, offset: 2, angle: 135, opacity: 0.08 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.5, y: 1.6, w: 0.08, h: 2.2,
    fill: { color: theme.light }
  });

  slide.addText([
    { text: "Foundation for modern NLP", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: "Calibri", color: theme.primary } },
    { text: "BERT, GPT, T5, ViT all built on Transformers", options: { indentLevel: 1, bullet: true, breakLine: true, fontSize: 11, fontFace: "Calibri", color: "666666" } },
    { text: "Extended beyond text", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: "Calibri", color: theme.primary } },
    { text: "Vision, speech, multimodal, protein folding", options: { indentLevel: 1, bullet: true, breakLine: true, fontSize: 11, fontFace: "Calibri", color: "666666" } },
    { text: "Efficient attention as ongoing research", options: { bullet: true, breakLine: true, fontSize: 12, fontFace: "Calibri", color: theme.primary } },
    { text: "Sparse, linear, local attention variants", options: { indentLevel: 1, bullet: true, fontSize: 11, fontFace: "Calibri", color: "666666" } },
  ], {
    x: 5.8, y: 1.7, w: 3.5, h: 2.0,
    valign: "top", align: "left",
    paraSpaceAfter: 3
  });

  // References
  slide.addText("Reference", {
    x: 5.5, y: 4.0, w: 4, h: 0.3,
    fontSize: 14, fontFace: "Georgia",
    color: theme.secondary, bold: true, align: "left",
    margin: 0
  });
  slide.addText("Vaswani et al., \"Attention Is All You Need\", NeurIPS 2017. Code: github.com/tensorflow/tensor2tensor", {
    x: 5.5, y: 4.3, w: 4, h: 0.5,
    fontSize: 10, fontFace: "Calibri",
    color: "888888", align: "left",
    margin: 0
  });

  // Thank you / Q&A
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.65, w: 4.5, h: 0.7,
    fill: { color: theme.primary }
  });
  slide.addText("Thank You  \u2014  Questions?", {
    x: 0.5, y: 4.65, w: 4.5, h: 0.7,
    fontSize: 22, fontFace: "Georgia",
    color: "FFFFFF", bold: true,
    align: "center", valign: "middle"
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("18", {
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
  pres.writeFile({ fileName: "slide-18-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
