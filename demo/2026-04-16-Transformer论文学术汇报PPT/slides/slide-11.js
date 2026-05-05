// slide-11.js — Three Applications of Attention in the Transformer
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  subtype: 'comparison',
  index: 11,
  title: 'Applications of Attention'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Title
  slide.addText("Three Uses of Attention in the Transformer", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 26, fontFace: "Georgia",
    color: theme.primary, bold: true, align: "left",
    margin: 0
  });

  // Three cards side by side
  const cards = [
    {
      title: "Encoder\nSelf-Attention",
      color: theme.primary,
      items: [
        "Q, K, V all from encoder",
        "Each position attends to all positions in previous layer",
        "Captures full input context"
      ]
    },
    {
      title: "Decoder\nSelf-Attention",
      color: theme.secondary,
      items: [
        "Q, K, V all from decoder",
        "Masked to prevent attending to future positions",
        "Preserves auto-regressive property"
      ]
    },
    {
      title: "Encoder-Decoder\nAttention",
      color: theme.accent,
      items: [
        "Q from decoder, K and V from encoder output",
        "Every decoder position attends to all encoder positions",
        "Bridges source and target sequences"
      ]
    }
  ];

  const cardW = 2.8;
  const gap = 0.3;
  const startX = 0.5;

  cards.forEach((card, i) => {
    const x = startX + i * (cardW + gap);

    // Card background
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x, y: 1.15, w: cardW, h: 3.6,
      fill: { color: "FFFFFF" },
      shadow: { type: "outer", color: "000000", blur: 4, offset: 2, angle: 135, opacity: 0.08 }
    });

    // Card header
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x, y: 1.15, w: cardW, h: 0.75,
      fill: { color: card.color }
    });
    slide.addText(card.title, {
      x: x, y: 1.15, w: cardW, h: 0.75,
      fontSize: 13, fontFace: "Georgia",
      color: "FFFFFF", bold: true,
      align: "center", valign: "middle"
    });

    // Card bullets
    const bulletTexts = card.items.map((item, idx) => ({
      text: item,
      options: {
        bullet: true,
        breakLine: idx < card.items.length - 1,
        fontSize: 12,
        fontFace: "Calibri",
        color: theme.primary
      }
    }));

    slide.addText(bulletTexts, {
      x: x + 0.15, y: 2.1, w: cardW - 0.3, h: 2.4,
      valign: "top", align: "left",
      paraSpaceAfter: 8
    });
  });

  // Bottom note
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.85, w: 9, h: 0.5,
    fill: { color: theme.primary, transparency: 6 }
  });
  slide.addText("All three use the same Multi-Head Attention mechanism \u2014 only the source of Q, K, V differs.", {
    x: 0.7, y: 4.85, w: 8.6, h: 0.5,
    fontSize: 12, fontFace: "Calibri",
    color: theme.primary, align: "center", valign: "middle"
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("11", {
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
  pres.writeFile({ fileName: "slide-11-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
