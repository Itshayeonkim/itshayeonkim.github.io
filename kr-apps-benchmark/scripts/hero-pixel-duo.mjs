/** Outputs two <g> pixel sprites for hero SVG — run: node scripts/hero-pixel-duo.mjs */
const colors = {
  ".": null,
  // Grab rider
  G: "#00a651",
  g: "#006b3f",
  L: "#7ed321",
  l: "#5aad2a",
  P: "#f5d0c5",
  E: "#e8b89a",
  K: "#1a1a1a",
  W: "#ffffff",
  C: "#fff8e7",
  O: "#ff9800",
  Y: "#ffeb3b",
  S: "#b8e986",
  N: "#1a237e",
  // LEGO / mail
  y: "#ffc107",
  R: "#e53935",
  r: "#b71c1c",
  B: "#212121",
  T: "#d7ccc8",
  t: "#bcaaa4",
  w: "#fafafa",
  b: "#1565c0",
  k: "#1a1a1a",
  n: "#9e9e9e",
};

function rectsFromRows(rows, W) {
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
  return rects;
}

function emitGroup(className, rows, W, scale, cxSvg, cySvg) {
  const H = rows.length;
  const rects = rectsFromRows(rows, W);
  const cx = W / 2;
  const cy = H / 2;
  const tx = (-cx * scale).toFixed(2);
  const ty = (-cy * scale).toFixed(2);
  let s = `<g transform="translate(${cxSvg}, ${cySvg})" pointer-events="none" aria-hidden="true">\n`;
  s += `  <g class="${className}" transform="translate(${tx}, ${ty}) scale(${scale})">\n`;
  for (const r of rects) {
    s += `    <rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${r.fill}" shape-rendering="crispEdges" />\n`;
  }
  s += `  </g>\n</g>\n`;
  return s;
}

// Grab-style rider: box + white logo block, helmet, face, green jacket, scooter, cream headlight
const grabRows = [
  "................................................",
  "....GGGGGGGG....................................",
  "....GGWWWWGG....................................",
  "....GGWWWWGG....................................",
  "....GGGGGGGG....................................",
  "......GGGGGG....................................",
  "......GPPPPGG...................................",
  "......GPPEPGG...................................",
  "......GPPPPGG...................................",
  "......GGGGGGG...................................",
  "......GGGGGGG...................................",
  "......GGGGGGG...................................",
  ".......GGGGG....................................",
  ".......GGGGG....................................",
  ".......GGGGG....................................",
  ".......GGGGG....................................",
  "........GGG.....................................",
  "........GGG.....................................",
  "........GGG.....................................",
  "........GGG.....................................",
  "........NNN.....................................",
  "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL",
  "LLLLLLLLLLLLCCCCCCCCYYOOLLCCCCCCCCLLLLLLLLLLLLLL",
  "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL",
  "..ll....ll....ll....ll....ll....ll....ll....ll..",
  "..KK....KK....KK....KK....KK....KK....KK....KK..",
];

// LEGO mail carrier: cap & head, then letter/tan on dolly, figure pushing (hands on handles)
const legoRows = [
  "....................................................",
  "..............................RRRRRR................",
  ".............................RRRRRRRR...............",
  "..............................RRRRRR................",
  "..............................yyyyyyyy..............",
  "..............................yykkkkyy..............",
  "..............................yyyyyyyy..............",
  "...............................yyyyyy...............",
  "..wwwwwwwwwwwwww....................................",
  "..wbbbbbbbbbbwwr....................................",
  "..TTTTTTTTTTTTTT....................................",
  "..TTTTTTTTTTTTTT....................................",
  "..TTTTTTTTTTTTTT....................................",
  "..RRRRRRRRRRRRRRRR..................................",
  "........RRRRRRRRRRRR........RRRRRRRRRR..............",
  "........RRRRRRRRRRRR........RRRRRRRRRR..............",
  "........RRRRRRRRRRRR........RRRRRRRRRR..............",
  "........RRRRRRRRRRRR........RRRRRRRRRR..............",
  "........RRRRRRRRRRRR........RRRRRRRRRR..............",
  "........RRRRRRRRRRRR........RRRRRRRRRR..............",
  "........RRRRRRRRRRRR........yyyyyyyyRR..............",
  "........RRRRRRRRRRRR........yyyyyyyyRR..............",
  "........RRRRRRRRRRRR........RRRRRRRRRR..............",
  "........RRRRRRRRRRRR........RRRRRRRRRR..............",
  "........RRRRRRRRRRRR........RRRRRRRRRR..............",
  "........RRRRRRRRRRRR........RRRRRRRRRR..............",
  "........RRRRRRRRRRRR........BBBBBBBBBBBBBBBB........",
  "........RRRRRRRRRRRR........BBBBBBBBBBBBBBBB........",
  "........RRRRRRRRRRRR........BBBBBBBBBBBBBBBB........",
  "........RRRRRRRRRRRR........BBBBBBBBBBBBBBBB........",
  "........kk........kk........kk....kk....kk..........",
];

const Wg = 48;
const Wl = 52;

const scale = 2.15;
// Positions below isometric stack (bottom ~330); centered left / right half
const out = `<!-- Pixel duo: Grab rider + LEGO with hand truck & package — below containers -->\n${emitGroup("hero-pixel-grab-rider", grabRows, Wg, scale, 102, 412)}${emitGroup("hero-pixel-lego-mail", legoRows, Wl, scale, 224, 416)}`;
process.stdout.write(out);
