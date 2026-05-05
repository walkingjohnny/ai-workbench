// slide-14.js — Code Example: Self-Attention Implementation (PyTorch-style Pseudocode)
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'content',
  subtype: 'text',
  index: 14,
  title: 'Code: Scaled Dot-Product Attention'
};

function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  // Title
  slide.addText("Code: Self-Attention (PyTorch Pseudocode)", {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 26, fontFace: "Georgia",
    color: theme.primary, bold: true, align: "left",
    margin: 0
  });

  // === Left: Scaled Dot-Product Attention ===
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 4.5, h: 3.7,
    fill: { color: "1E1E1E" }
  });

  // Code title
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 4.5, h: 0.35,
    fill: { color: "333333" }
  });
  slide.addText("scaled_dot_product_attention.py", {
    x: 0.6, y: 1.1, w: 4.3, h: 0.35,
    fontSize: 10, fontFace: "Consolas",
    color: "AAAAAA", align: "left", valign: "middle"
  });

  const codeLeft = [
    { text: "import torch", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "569CD6" } },
    { text: "import torch.nn.functional as F", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "569CD6" } },
    { text: "import math", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "569CD6" } },
    { text: "", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "def attention(Q, K, V, mask=None):", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "DCDCAA" } },
    { text: '    """Scaled Dot-Product Attention"""', options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "6A9955" } },
    { text: "    d_k = Q.size(-1)", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "    # Step 1: QK^T / sqrt(d_k)", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "6A9955" } },
    { text: "    scores = torch.matmul(Q, K.T)", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "    scores = scores / math.sqrt(d_k)", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "    # Step 2: Optional mask", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "6A9955" } },
    { text: "    if mask is not None:", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "C586C0" } },
    { text: "        scores = scores.masked_fill(", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "            mask == 0, float('-inf'))", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "    # Step 3: Softmax + matmul V", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "6A9955" } },
    { text: "    weights = F.softmax(scores, -1)", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "    return torch.matmul(weights, V)", options: { fontSize: 9, fontFace: "Consolas", color: "C586C0" } },
  ];

  slide.addText(codeLeft, {
    x: 0.6, y: 1.5, w: 4.3, h: 3.2,
    valign: "top", align: "left",
    lineSpacingMultiple: 1.0
  });

  // === Right: Multi-Head Attention ===
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.1, w: 4.2, h: 3.7,
    fill: { color: "1E1E1E" }
  });

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.1, w: 4.2, h: 0.35,
    fill: { color: "333333" }
  });
  slide.addText("multi_head_attention.py", {
    x: 5.4, y: 1.1, w: 4.0, h: 0.35,
    fontSize: 10, fontFace: "Consolas",
    color: "AAAAAA", align: "left", valign: "middle"
  });

  const codeRight = [
    { text: "class MultiHeadAttention(nn.Module):", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "4EC9B0" } },
    { text: "  def __init__(self, d_model, h):", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "DCDCAA" } },
    { text: "    super().__init__()", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "    self.d_k = d_model // h", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "    self.h = h", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "    # Projection matrices", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "6A9955" } },
    { text: "    self.W_q = nn.Linear(d_model,", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "                         d_model)", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "    self.W_k = nn.Linear(d_model,", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "                         d_model)", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "    self.W_v = nn.Linear(d_model,", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "                         d_model)", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "    self.W_o = nn.Linear(d_model,", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "                         d_model)", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "D4D4D4" } },
    { text: "  def forward(self, Q, K, V):", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "DCDCAA" } },
    { text: "    # Project & split into heads", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "6A9955" } },
    { text: "    # Parallel attention + concat", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "6A9955" } },
    { text: "    # Final projection W_o", options: { breakLine: true, fontSize: 9, fontFace: "Consolas", color: "6A9955" } },
    { text: "    return self.W_o(output)", options: { fontSize: 9, fontFace: "Consolas", color: "C586C0" } },
  ];

  slide.addText(codeRight, {
    x: 5.4, y: 1.5, w: 4.0, h: 3.2,
    valign: "top", align: "left",
    lineSpacingMultiple: 1.0
  });

  // Page number badge
  slide.addShape(pres.shapes.OVAL, {
    x: 9.3, y: 5.1, w: 0.4, h: 0.4,
    fill: { color: theme.accent }
  });
  slide.addText("14", {
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
  pres.writeFile({ fileName: "slide-14-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
