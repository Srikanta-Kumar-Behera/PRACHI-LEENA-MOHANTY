// Persistent progress dots. Pages already visited can be revisited; pages
// ahead stay locked so the surprise is never spoiled.
export default function ProgressNav({ labels, page, max, go }) {
  const pct = labels.length > 1 ? (page / (labels.length - 1)) * 100 : 0;
  return (
    <nav className="pnav" aria-label="Story progress">
      <div className="pnav-track" aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </div>
      <ol>
        {labels.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              className={i === page ? "on" : i <= max ? "seen" : ""}
              disabled={i > max}
              onClick={() => go(i)}
              aria-label={`${label}, page ${i + 1} of ${labels.length}`}
              aria-current={i === page ? "step" : undefined}
            >
              <span className="tip">{label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
