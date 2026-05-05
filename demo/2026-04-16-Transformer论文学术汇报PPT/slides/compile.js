// compile.js — Assemble all slides into final PPTX
const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'Academic Presentation';
pres.title = 'Attention Is All You Need - Paper Presentation';

// Vintage & Academic color palette (#4)
const theme = {
  primary: "003049",    // Deep blue - titles, primary text
  secondary: "780000",  // Deep red - accents, emphasis
  accent: "669bbc",     // Steel blue - highlights
  light: "c1121f",      // Bright red - decorative accents
  bg: "fdf0d5"          // Warm cream - background
};

const TOTAL_SLIDES = 18;

for (let i = 1; i <= TOTAL_SLIDES; i++) {
  const num = String(i).padStart(2, '0');
  const slideModule = require(`./slide-${num}.js`);
  slideModule.createSlide(pres, theme);
}

pres.writeFile({ fileName: './output/Transformer-Paper-Presentation.pptx' })
  .then(() => {
    console.log('SUCCESS: Transformer-Paper-Presentation.pptx created in output/');
  })
  .catch(err => {
    console.error('ERROR:', err);
    process.exit(1);
  });
