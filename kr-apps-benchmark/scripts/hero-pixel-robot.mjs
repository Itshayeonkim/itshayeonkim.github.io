/** Isometric LEGO-style delivery robot — run: node scripts/hero-pixel-robot.mjs */
const colors = {
  ".": null,
  Y: "#ffeb3b",
  y: "#fbc02d",
  G: "#b0bec5",
  g: "#90a4ae",
  W: "#fafafa",
  w: "#ffffff",
  K: "#212121",
  k: "#424242",
  n: "#37474f",
  O: "#cfd8dc",
  S: "#9e9e9e",
};

// 46×36 — front-right isometric-ish block robot (yellow top, grey mid, white base, eyes, wheels, sensor)
const rows = [
  "..............................................",
  "..........................KK..................",
  "..........................OO..................",
  "..............YYYYYYYYYYYYYYYYYY..............",
  "..............YYYYYYYYYYYYYYYYYY..............",
  "..............yyyyyyyyyyyyyyyyyy..............",
  "..............YYYYYYYYYYYYYYYYYY..............",
  "..............YYYYYYYYYYYYYYYYYY..............",
  "..............GGGGGGGGGGGGGGGGGG..............",
  "..............GGGGGGGGGGGGGGGGGG..............",
  "..............GGGGGGGGGGGGGGGGGG..............",
  "..............GGGGGGGGGGGGGGGGGG..............",
  "..............WWWWWWWWWWWWWWWWWW..............",
  "..............WWWWKKKKKKKKWWWWWW..............",
  "..............WWWKKwwwwKKKKWWWWW..............",
  "..............WWWKKwwwwKKKKWWWWW..............",
  "..............WWWWKKKKKKKKWWWWWW..............",
  "..............WWWWWWWWWWWWWWWWWW..............",
  "..............WWWWGGGGGGGGWWWWWW..............",
  "..............WWWWGGGGGGGGWWWWWW..............",
  "..............WWWWWWWWWWWWWWWWWW..............",
  "..............WWWWWWWWWWWWWWWWWW..............",
  "..............WWWWWWWWWWWWWWWWWW..............",
  "..............WWWWWWWWWWWWWWWWWW..............",
  "..............WWWWWWWWWWWWWWWWWW..............",
  "..............WWWWWWWWWWWWWWWWWW..............",
  "..............WWWWWWWWWWWWWWWWWW..............",
  ".............kk................kk.............",
  ".............kk................kk.............",
  ".............nn................nn.............",
  ".............nn................nn.............",
  ".............nn................nn.............",
  ".............nn................nn.............",
  "..............................................",
  "..............................................",
  "..............................................",
  "..............................................",
];

const W = 46;
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

const scale = 2.85;
const H = padded.length;
const cx = W / 2;
const cy = H / 2;
const tx = (-cx * scale).toFixed(2);
const ty = (-cy * scale).toFixed(2);

let out = `<g class="hero-pixel-robot-run" pointer-events="none" aria-hidden="true">\n`;
out += `  <g transform="translate(${tx}, ${ty}) scale(${scale})">\n`;
for (const r of rects) {
  out += `    <rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${r.fill}" shape-rendering="crispEdges" />\n`;
}
out += `  </g>\n</g>\n`;
process.stdout.write(out);
