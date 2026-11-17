import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Envelope from "../components/Envelope.jsx";
import { useTyping } from "../lib/useTyping.js";
import { audio } from "../lib/audio.js";
import { config } from "../config.js";

// PAGE 4 · Words from my heart
// Sealed envelope -> break the seal -> a handwritten letter types itself out.
export default function Letter({ next }) {
  const L = config.letter;
  const [stage, setStage] = useState("sealed"); // sealed | breaking | open

  const segments = useMemo(
    () => [
      { t: L.to, cls: "lt-to" },
      ...L.paragraphs.map((t) => ({ t, cls: "lt-p" })),
      { t: L.closing, cls: "lt-close" },
      { t: L.signature, cls: "lt-sign" }
    ],
    [L]
  );
  const flat = useMemo(() => segments.map((s) => s.t).join(""), [segments]);
  const charAt = useCallback((i) => flat.charAt(i), [flat]);
  const { n, done, skip } = useTyping({ total: flat.length, charAt, active: stage === "open", speed: 28 });

  const breakSeal = () => {
    if (stage !== "sealed") return;
    audio.unlock();
    audio.sfx.seal();
    setStage("breaking");
    window.setTimeout(() => {
      audio.sfx.open();
      setStage("open");
    }, 1500);
  };

  let remaining = n;
  const parts = segments.map((s) => {
    const shown = Math.max(0, Math.min(s.t.length, remaining));
    remaining -= shown;
    return { ...s, shown };
  });

  return (
    <div className="page letter">
      <div className="inner">
        <AnimatePresence mode="wait">
          {stage !== "open" ? (
            <motion.div key="env" className="letter-env" exit={{ opacity: 0, scale: 0.8, y: 30 }} transition={{ duration: 0.5 }}>
              <Envelope tone="cream" seal open={stage === "breaking"} sealBroken={stage === "breaking"} onClick={breakSeal} label="Break the wax seal to open the letter" />
              <p className="hint">{stage === "sealed" ? L.hint : "…"}</p>
            </motion.div>
          ) : (
            <motion.article
              key="paper"
              className="paper"
              initial={{ opacity: 0, y: 120, scale: 0.6, rotate: -4 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: -0.6 }}
              transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <div className="paper-seal" aria-hidden="true">
                ❤️
              </div>
              <div className="paper-text" aria-label="Love letter">
                {parts.map((p, i) => {
                  const caret = !done && p.shown < p.t.length && (i === 0 || parts[i - 1].shown === parts[i - 1].t.length);
                  return (
                    <p key={i} className={p.cls}>
                      <span>{p.t.slice(0, p.shown)}</span>
                      {caret && <span className="caret" aria-hidden="true" />}
                      <span className="ghost" aria-hidden="true">
                        {p.t.slice(p.shown)}
                      </span>
                    </p>
                  );
                })}
              </div>
              <div className="paper-actions">
                {!done ? (
                  <button type="button" className="btn btn-ghost" onClick={skip}>
                    Show the full letter
                  </button>
                ) : (
                  <motion.button
                    type="button"
                    className="btn"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      audio.sfx.tap();
                      next();
                    }}
                  >
                    {L.button} <ArrowRight size={18} />
                  </motion.button>
                )}
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
