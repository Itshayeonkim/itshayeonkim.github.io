/** Generates SVG <g> for hero pixel rider — run: node scripts/hero-pixel-rider.mjs */
const colors = {
  ".": null,
  O: "#ff9f43",
  o: "#d97b12",
  G: "#00a651",
  g: "#006b3f",
  L: "#7ed321",
  l: "#5aad2a",
  K: "#1a1a1a",
  W: "#ffffff",
  Y: "#ffeb3b",
  S: "#b8e986",
};

// 56×30 — side view, facing left; box back-left, cat center, scooter lime, headlight right
const rows = [
  "........................................................",
  "....GGGGGGGGGG..........................................",
  "....GGGGGGGGGG..........................................",
  "....GGGGGGGGGG..........................................",
  "....GGSSGGSSGG..........................................",
  "....GGGGGGGGGG..........................................",
  "......gggggggg..........................................",
  "......GGGGGGGG..........................................",
  "......GGOOOOGG..........................................",
  "......GOOOOOOG..........................................",
  "......GOOOOOOG..........................................",
  "......GOOOOOOG..........................................",
  "......GOOOOOOG..........................................",
  ".......OOOOOO...........................................",
  ".......OOOOOO...........................................",
  ".......OOOOOO...........................................",
  ".......OOOOOO...........................................",
  "........OOOO............................................",
  "........OOOO............................................",
  "........OOOO............................................",
  "........OOOO............................................",
  ".........OO.............................................",
  ".........OO.............................................",
  ".........OO.............................................",
  ".........OO.............................................",
  ".........OO.............................................",
  "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLYYYYYYYYYYLLLL",
  "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL",
  "..ll......ll......ll......ll......ll......ll......ll......",
  "..KK......KK......KK......KK......KK......KK......KK......",
];

const W = 56;
const padded = rows.map((r) => r.padEnd(W, ".").slice(0, W));
const rects = [];
for (let y = 0; y < padded.length; y++) {
  let x = 0;
  while (x < W) {
    const ch = padded[y][x];
    const c = colors[ch];
    if (!c) {
      x++;
      continue;
    }
    let w = 1;
    while (x + w < W && padded[y][x + w] === ch) w++;
    rects.push({ x, y, w, h: 1, fill: c });
    x += w;
  }
}

const scale = 2.45;
const H = padded.length;
const cx = W / 2;
const cy = H / 2;

let out = `<g class="hero-pixel-rider-wrap">\n`;
out += `  <g transform="translate(${-cx}, ${-cy}) scale(${scale})" pointer-events="none" aria-hidden="true">\n`;
for (const r of rects) {
  out += `    <rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${r.fill}" shape-rendering="crispEdges" />\n`;
}
out += `  </g>\n</g>\n`;
process.stdout.write(out);
