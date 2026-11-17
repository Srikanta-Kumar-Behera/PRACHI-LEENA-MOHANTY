// Vector roses used by the loader, the gift bouquet and the proposal garden.
// Colours come from palettes: [main, shadow, highlight].

export const PALETTES = [
  ["#d6405f", "#9e1b3a", "#f08aa0"],
  ["#e8607c", "#a8203f", "#f8b3c1"],
  ["#b8123a", "#6e0d26", "#e8607c"],
  ["#c1193f", "#7d1030", "#f07a96"],
  ["#b84a8a", "#7a2a66", "#e6a0cf"]
];

/** A rose bloom to place inside an <svg>. (x, y) is the centre. */
export function RoseShape({ x = 50, y = 50, size = 100, pal = PALETTES[0] }) {
  const [c1, c2, c3] = pal;
  const k = size / 100;
  return (
    <g transform={`translate(${x - size / 2} ${y - size / 2}) scale(${k})`}>
      <circle cx="50" cy="52" r="44" fill={c2} />
      <path d="M50 10C78 10 94 36 88 60 82 84 58 94 40 88 16 80 6 52 20 30 28 18 38 10 50 10Z" fill={c1} />
      <path d="M50 22C70 22 82 40 78 58 74 76 56 84 42 78 26 72 20 52 30 38 36 28 42 22 50 22Z" fill={c3} opacity="0.92" />
      <path d="M50 34C64 34 72 46 68 58 64 70 52 74 42 68 32 62 32 48 40 41 43 37 46 34 50 34Z" fill={c1} />
      <path d="M50 44C58 44 62 52 58 58 54 64 46 64 43 58 40 52 44 46 50 44Z" fill={c2} />
      <path d="M30 40C40 30 60 30 70 40M26 58C34 74 66 74 74 58M50 34C56 40 54 48 48 50" stroke="rgba(255,255,255,.35)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function Rose({ size = 60, pal, className }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <RoseShape x={50} y={50} size={100} pal={pal} />
    </svg>
  );
}

/** A row of swaying red roses along a dark hill. Used on the proposal page. */
export function RoseGarden({ n = 11, className = "" }) {
  const items = Array.from({ length: n }, (_, i) => ({
    x: 40 + i * (1120 / (n - 1)),
    sc: 0.8 + ((i * 37) % 10) / 12,
    y: 318 - (i % 4) * 6,
    pal: PALETTES[i % PALETTES.length],
    d: (i * 0.7) % 4
  }));
  return (
    <svg className={`garden ${className}`} viewBox="0 0 1200 340" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a1840" />
          <stop offset="1" stopColor="#1b0820" />
        </linearGradient>
      </defs>
      <path d="M0 340V300C200 270 400 312 600 292 800 272 1000 306 1200 286V340Z" fill="url(#soil)" />
      {items.map((it, i) => (
        <g key={i} transform={`translate(${it.x} ${it.y}) scale(${it.sc})`}>
          <g className="sway" style={{ animationDelay: `-${it.d}s` }}>
            <path d="M0 0C-5 -40 6 -80 0 -124" fill="none" stroke="#6f9a7c" strokeWidth="4" strokeLinecap="round" />
            <path d="M-1 -40C-26 -52 -38 -40 -42 -26 -22 -22 -8 -28 -1 -40Z" fill="#7aa688" />
            <path d="M1 -72C26 -86 40 -74 44 -60 24 -54 8 -60 1 -72Z" fill="#6f9a7c" />
            <RoseShape x={0} y={-128} size={64} pal={it.pal} />
          </g>
        </g>
      ))}
    </svg>
  );
}

/** A wrapped bouquet whose roses pop in one after another. */
export function Bouquet({ className = "" }) {
  const roses = [
    { x: 150, y: 72, s: 74, p: 0, d: 0.1 },
    { x: 92, y: 108, s: 64, p: 1, d: 0.3 },
    { x: 208, y: 108, s: 64, p: 2, d: 0.5 },
    { x: 56, y: 152, s: 54, p: 3, d: 0.7 },
    { x: 244, y: 152, s: 54, p: 4, d: 0.9 },
    { x: 150, y: 132, s: 60, p: 3, d: 0.2 }
  ];
  return (
    <svg className={`bouquet ${className}`} viewBox="0 0 300 380" aria-hidden="true">
      <defs>
        <linearGradient id="wrap" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff3e6" />
          <stop offset="1" stopColor="#f4c9d6" />
        </linearGradient>
      </defs>
      {roses.map((r, i) => (
        <path key={`s${i}`} d={`M150 300Q${(150 + r.x) / 2} ${(300 + r.y) / 2} ${r.x} ${r.y + r.s / 2 - 6}`} stroke="#6f9a7c" strokeWidth="5" fill="none" strokeLinecap="round" />
      ))}
      <path d="M110 190C86 180 74 196 70 210 98 214 108 206 110 190Z" fill="#7aa688" />
      <path d="M190 190C214 180 226 196 230 210 202 214 192 206 190 190Z" fill="#6f9a7c" />
      {roses.map((r, i) => (
        <g key={`r${i}`} className="pop" style={{ animationDelay: `${r.d}s` }}>
          <RoseShape x={r.x} y={r.y} size={r.s} pal={PALETTES[r.p]} />
        </g>
      ))}
      <path d="M66 214L234 214L170 360Q150 374 130 360Z" fill="url(#wrap)" />
      <path d="M66 214L150 250L234 214" fill="none" stroke="rgba(214,64,95,.35)" strokeWidth="2" />
      <path d="M150 250L130 360" stroke="rgba(214,64,95,.25)" strokeWidth="2" />
      <path d="M150 262C130 238 104 246 108 264 112 280 140 274 150 262Z" fill="#d6405f" />
      <path d="M150 262C170 238 196 246 192 264 188 280 160 274 150 262Z" fill="#e8607c" />
      <circle cx="150" cy="264" r="9" fill="#b8123a" />
    </svg>
  );
}
