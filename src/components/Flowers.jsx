// Daisy-like flowers that grow up from the bottom of the greeting page.
const COLORS = [
  ["#f8b3c1", "#e8608a"],
  ["#cdb8ec", "#9d7fd1"],
  ["#fff6ec", "#f3dca6"],
  ["#f4a9ba", "#d6405f"]
];

export default function FlowerRow({ n = 9 }) {
  const items = Array.from({ length: n }, (_, i) => ({
    x: 30 + i * (940 / (n - 1)),
    h: 70 + ((i * 53) % 7) * 16,
    col: COLORS[i % COLORS.length],
    d: (i * 0.18) % 1.6,
    sc: 0.8 + ((i * 29) % 5) / 10
  }));
  return (
    <svg className="flowers" viewBox="0 0 1000 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      {items.map((f, i) => (
        <g key={i} transform={`translate(${f.x} 260) scale(${f.sc})`}>
          <g className="grow" style={{ animationDelay: `${0.6 + f.d}s` }}>
            <g className="sway" style={{ animationDelay: `-${i * 0.6}s` }}>
              <path d={`M0 0C-6 -${f.h * 0.4} 6 -${f.h * 0.7} 0 -${f.h}`} fill="none" stroke="#7aa688" strokeWidth="3.5" strokeLinecap="round" />
              <path d={`M0 -${f.h * 0.35}C-22 -${f.h * 0.45} -30 -${f.h * 0.33} -32 -${f.h * 0.22} -14 -${f.h * 0.2} -4 -${f.h * 0.25} 0 -${f.h * 0.35}Z`} fill="#8cb89a" />
              <g transform={`translate(0 -${f.h})`}>
                {[0, 72, 144, 216, 288].map((a) => (
                  <ellipse key={a} cx="0" cy="-13" rx="8" ry="14" transform={`rotate(${a})`} fill={f.col[0]} stroke={f.col[1]} strokeWidth=".8" />
                ))}
                <circle r="6" fill="#e8c987" />
              </g>
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}
