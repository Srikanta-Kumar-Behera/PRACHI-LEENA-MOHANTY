import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import { RoseGarden } from "../components/Roses.jsx";
import { useFx } from "../components/Fx.jsx";
import { audio } from "../lib/audio.js";
import { graphemes } from "../lib/text.js";
import { config } from "../config.js";

// How long each stage stays on screen before the next one begins (ms).
// Tapping anywhere skips ahead, so nobody is ever stuck waiting.
const HOLD = [3800, 7600, 4400, 3600];

function RingBox({ open }) {
  return (
    <div className="ring-box" aria-hidden="true">
      <div className="rb-glow" />
      <motion.div className="rb-lid" initial={false} animate={{ rotateX: open ? -115 : 0 }} transition={{ delay: 0.6, duration: 1.1, ease: [0.2, 0.7, 0.2, 1] }} />
      <div className="rb-base" />
      <motion.div className="rb-ring" initial={{ y: 40, opacity: 0 }} animate={open ? { y: -34, opacity: 1 } : {}} transition={{ delay: 1.3, duration: 1.1, ease: "easeOut" }}>
        <svg viewBox="0 0 80 96" width="74">
          <ellipse cx="40" cy="68" rx="23" ry="23" fill="none" stroke="#e8c987" strokeWidth="6" />
          <ellipse cx="40" cy="68" rx="23" ry="23" fill="none" stroke="#fff3cf" strokeWidth="1.5" opacity=".7" />
          <path d="M27 30L40 12L53 30L40 46Z" fill="#f4fbff" stroke="#bfe0f2" strokeWidth="1.5" />
          <path d="M27 30H53M40 12V46M33 21L40 30L47 21" stroke="#bfe0f2" strokeWidth="1" fill="none" />
        </svg>
        <span className="rb-spark a" />
        <span className="rb-spark b" />
        <span className="rb-spark c" />
      </motion.div>
    </div>
  );
}

// PAGE 7 · The grand proposal
// Stages: 0 her name · 1 the message · 2 the ring box opens · 3 the question · 4 the answers
export default function Proposal({ next }) {
  const P = config.proposal;
  const fx = useFx();
  const [stage, setStage] = useState(0);
  const [answer, setAnswer] = useState(null); // null | "yes" | "moment"

  useEffect(() => {
    if (stage >= 4 || answer) return undefined;
    const id = window.setTimeout(() => setStage((s) => s + 1), HOLD[stage]);
    return () => window.clearTimeout(id);
  }, [stage, answer]);

  useEffect(() => {
    if (stage !== 2) return undefined;
    const id = window.setTimeout(() => audio.sfx.ring(), 1000);
    return () => window.clearTimeout(id);
  }, [stage]);

  const advance = () => setStage((s) => (s < 4 ? s + 1 : s));
  const sayYes = () => {
    audio.unlock();
    audio.sfx.yes();
    fx.celebrate();
    setAnswer("yes");
  };
  const needMoment = () => {
    audio.sfx.tap();
    setAnswer("moment");
  };

  const nameChars = graphemes(P.name);
  const words = P.paragraph.split(" ");

  return (
    <div className="page proposal" onClick={advance}>
      <div className="moon" aria-hidden="true" />
      <RoseGarden />

      <div className="inner">
        <AnimatePresence mode="wait">
          {stage === 0 && (
            <motion.h1 key="name" className="display p-name glow-text" aria-label={P.name} exit={{ opacity: 0, filter: "blur(12px)" }} transition={{ duration: 0.6 }}>
              {nameChars.map((ch, i) => (
                <motion.span
                  key={i}
                  className="p-char"
                  aria-hidden="true"
                  initial={{ opacity: 0, y: 40, scale: 1.6, filter: "blur(14px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  transition={{ delay: 0.4 + i * 0.16, duration: 1 }}
                >
                  {ch === " " ? " " : ch}
                </motion.span>
              ))}
            </motion.h1>
          )}

          {stage === 1 && (
            <motion.p key="para" className="p-para" exit={{ opacity: 0, filter: "blur(10px)" }} transition={{ duration: 0.6 }}>
              {words.map((w, i) => (
                <motion.span
                  key={i}
                  className="p-word"
                  initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.3 + i * 0.13, duration: 0.7 }}
                >
                  {w}{" "}
                </motion.span>
              ))}
            </motion.p>
          )}

          {stage >= 2 && (
            <motion.div key="ask" className="p-ask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
              <RingBox open />
              {stage >= 3 && (
                <motion.h2
                  className="p-question"
                  initial={{ opacity: 0, letterSpacing: "0.5em", filter: "blur(14px)" }}
                  animate={{ opacity: 1, letterSpacing: "0.06em", filter: "blur(0px)" }}
                  transition={{ duration: 2.2, ease: "easeOut" }}
                >
                  {P.question}
                </motion.h2>
              )}
              {stage >= 4 && !answer && (
                <motion.div className="p-buttons" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} onClick={(e) => e.stopPropagation()}>
                  <button type="button" className="btn btn-big" onClick={sayYes}>
                    {P.yes}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={needMoment}>
                    {P.moment}
                  </button>
                </motion.div>
              )}
              <AnimatePresence>
                {answer === "moment" && (
                  <motion.div className="glass p-moment" initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} onClick={(e) => e.stopPropagation()}>
                    <p>{P.momentMessage}</p>
                    <button type="button" className="btn btn-ghost" onClick={() => setAnswer(null)}>
                      <RotateCcw size={16} /> {P.momentBack}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
        {stage < 4 && !answer && <p className="skip">Tap anywhere to continue</p>}
      </div>

      <AnimatePresence>
        {answer === "yes" && (
          <motion.div className="yes-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} onClick={(e) => e.stopPropagation()}>
            <RoseGarden className="yes-garden" />
            {[8, 22, 70, 86, 48].map((x, i) => (
              <span key={x} className="yes-heart" style={{ left: `${x}%`, animationDelay: `${i * 0.7}s`, "--s": `${22 + (i % 3) * 10}px` }}>
                ❤
              </span>
            ))}
            <div className="yes-msg">
              <motion.h1 className="display glow-text" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 1.4, ease: "easeOut" }}>
                {P.yesTitle}
              </motion.h1>
              <motion.p className="lead" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 1.2 }}>
                {P.yesSub}
              </motion.p>
              <motion.div className="yes-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6, duration: 1 }}>
                <button type="button" className="btn btn-ghost" onClick={() => { audio.sfx.yes(); fx.celebrate(); }}>
                  Celebrate again
                </button>
                <button type="button" className="btn" onClick={next}>
                  {P.yesButton} <ArrowRight size={18} />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
