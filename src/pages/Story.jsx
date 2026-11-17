import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Heart, MessageCircle, Sparkles, Star } from "lucide-react";
import Photo from "../components/Photo.jsx";
import { audio } from "../lib/audio.js";
import { config } from "../config.js";

const ICONS = { sparkles: Sparkles, message: MessageCircle, heart: Heart, star: Star };
const HUES = [340, 290, 20, 320];

function StoryCard({ item, index, open, onToggle }) {
  const tilt = useRef(null);
  const Icon = ICONS[item.icon] || Heart;

  // Gentle 3D tilt that follows the mouse (touch screens skip it).
  const move = (e) => {
    if (e.pointerType === "touch" || !tilt.current) return;
    const r = tilt.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tilt.current.style.setProperty("--ry", `${px * 10}deg`);
    tilt.current.style.setProperty("--rx", `${-py * 10}deg`);
  };
  const leave = () => {
    if (!tilt.current) return;
    tilt.current.style.setProperty("--ry", "0deg");
    tilt.current.style.setProperty("--rx", "0deg");
  };

  return (
    <li className="si">
      <span className="si-node" aria-hidden="true" />
      <div className="sc-wrap" onPointerMove={move} onPointerLeave={leave}>
        <div className="sc-tilt" ref={tilt}>
          <motion.div
            className="sc clickable"
            role="button"
            tabIndex={0}
            aria-pressed={open}
            aria-label={`${item.title}. ${open ? "Close" : "Open"} this memory`}
            onClick={onToggle}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggle();
              }
            }}
            animate={{ rotateY: open ? 180 : 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="sc-face sc-front glass">
              <div className="sc-ico">
                <Icon size={30} />
              </div>
              <p className="kicker">{item.kicker}</p>
              <h3 className="display">{item.title}</h3>
              <p className="tap">Tap to open</p>
            </div>
            <div className="sc-face sc-back">
              <Photo src={item.photo} label={item.title} hue={HUES[index % HUES.length]} alt={item.title} className="sc-photo" />
              <div className="sc-text">
                <p className="date">{item.date}</p>
                <h3 className="display">{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </li>
  );
}

// PAGE 3 · The story behind us
// A horizontal timeline. Each card flips open on click or tap.
export default function Story({ next }) {
  const s = config.story;
  const [open, setOpen] = useState(() => s.items.map(() => false));
  const track = useRef(null);
  const count = open.filter(Boolean).length;

  const toggle = (i) => {
    audio.sfx.tap();
    setOpen((o) => o.map((v, k) => (k === i ? !v : v)));
  };
  const scroll = (dir) => track.current && track.current.scrollBy({ left: dir * 340, behavior: "smooth" });

  return (
    <div className="page story">
      <div className="inner wide">
        <p className="eyebrow">Chapter by chapter</p>
        <h1 className="display page-title">{s.title}</h1>
        <p className="hint">
          {s.hint} · {count} of {s.items.length} opened
        </p>
        <div className="story-wrap">
          <button type="button" className="arrow arrow-l" aria-label="Previous memory" onClick={() => scroll(-1)}>
            <ChevronLeft />
          </button>
          <ol className="story-track" ref={track}>
            {s.items.map((item, i) => (
              <StoryCard key={item.title} item={item} index={i} open={open[i]} onToggle={() => toggle(i)} />
            ))}
          </ol>
          <button type="button" className="arrow arrow-r" aria-label="Next memory" onClick={() => scroll(1)}>
            <ChevronRight />
          </button>
        </div>
        <motion.button
          type="button"
          className={`btn ${count === s.items.length ? "btn-pulse" : ""}`}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            audio.sfx.tap();
            next();
          }}
        >
          {s.button} <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  );
}
