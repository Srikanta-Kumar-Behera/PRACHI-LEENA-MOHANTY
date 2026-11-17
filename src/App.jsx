import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Sky from "./components/Sky.jsx";
import Loader from "./components/Loader.jsx";
import { FxProvider } from "./components/Fx.jsx";
import CustomCursor from "./components/CustomCursor.jsx";
import MusicPlayer from "./components/MusicPlayer.jsx";
import ProgressNav from "./components/ProgressNav.jsx";

import Welcome from "./pages/Welcome.jsx";
import Greeting from "./pages/Greeting.jsx";
import Story from "./pages/Story.jsx";
import Letter from "./pages/Letter.jsx";
import Memories from "./pages/Memories.jsx";
import Gift from "./pages/Gift.jsx";
import Proposal from "./pages/Proposal.jsx";
import Final from "./pages/Final.jsx";
import QrPage from "./pages/QrPage.jsx";

import { store } from "./lib/storage.js";

// Each page gets its own sky (`scene`: how many stars, hearts, petals,
// butterflies and golden dust) and its own entrance (`v`).
const PAGES = [
  { key: "welcome", label: "The Envelope", C: Welcome, v: "zoom", scene: { stars: 1.3, hearts: 1, dust: 0.6 } },
  { key: "greeting", label: "A Little Message", C: Greeting, v: "rise", scene: { stars: 0.6, hearts: 0.6, flies: 1, dust: 1 } },
  { key: "story", label: "The Story Behind Us", C: Story, v: "slide", scene: { stars: 0.8, hearts: 0.5, dust: 1.2 } },
  { key: "letter", label: "Words From My Heart", C: Letter, v: "fade", scene: { stars: 0.5, petals: 1.4, dust: 0.6 } },
  { key: "memories", label: "A World Of Memories", C: Memories, v: "slide", scene: { stars: 0.6, hearts: 1.2, flies: 0.6 } },
  { key: "gift", label: "A Little Surprise", C: Gift, v: "zoom", scene: { stars: 1, hearts: 0.6, dust: 1.6 } },
  { key: "proposal", label: "The Grand Proposal", C: Proposal, v: "iris", scene: { stars: 1.6, petals: 1.6, dust: 1.4, hearts: 0.5 } },
  { key: "final", label: "The Final Surprise", C: Final, v: "fade", scene: { stars: 1, hearts: 1.4, dust: 1 } }
];
const QR_SCENE = { stars: 1, hearts: 1, dust: 1 };
const LABELS = PAGES.map((p) => p.label);

// Page entrances. No blur filters here: they are heavy on phones.
const VARIANTS = {
  zoom: { initial: { opacity: 0, scale: 1.1 }, animate: { opacity: 1, scale: 1, transition: { duration: 1 } }, exit: { opacity: 0, scale: 0.94, transition: { duration: 0.55 } } },
  rise: { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0, transition: { duration: 0.9 } }, exit: { opacity: 0, y: -60, transition: { duration: 0.5 } } },
  slide: { initial: { opacity: 0, x: 90 }, animate: { opacity: 1, x: 0, transition: { duration: 0.8 } }, exit: { opacity: 0, x: -90, transition: { duration: 0.5 } } },
  fade: { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration: 1 } }, exit: { opacity: 0, transition: { duration: 0.6 } } },
  iris: {
    initial: { clipPath: "circle(0% at 50% 55%)" },
    animate: { clipPath: "circle(150% at 50% 55%)", transition: { duration: 1.3, ease: [0.65, 0, 0.25, 1] } },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  }
};

const readIsQr = () => window.location.hash.replace(/\/$/, "") === "#/qr";

export default function App() {
  const [isQr, setIsQr] = useState(readIsQr);
  const [ready, setReady] = useState(readIsQr); // the QR page skips the loader
  const [page, setPage] = useState(0);
  const [max, setMax] = useState(() => Math.min(store.get("max", 0), PAGES.length - 1));
  const pageRef = useRef(0);
  pageRef.current = page;

  useEffect(() => {
    const onHash = () => setIsQr(readIsQr());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    store.set("max", max);
  }, [max]);

  const onLoaded = useCallback(() => setReady(true), []);
  const go = useCallback((n) => {
    const t = Math.max(0, Math.min(PAGES.length - 1, n));
    setPage(t);
    setMax((m) => Math.max(m, t));
  }, []);
  const next = useCallback(() => go(pageRef.current + 1), [go]);
  const replay = useCallback(() => {
    setMax(0);
    setPage(0);
  }, []);

  const cur = PAGES[page];

  return (
    <FxProvider>
      <Sky scene={isQr ? QR_SCENE : cur.scene} />

      <AnimatePresence>{!ready && <Loader key="loader" onDone={onLoaded} />}</AnimatePresence>

      {ready && isQr && <QrPage />}

      {ready && !isQr && (
        <>
          <AnimatePresence mode="wait">
            <motion.div key={cur.key} className="stage" variants={VARIANTS[cur.v]} initial="initial" animate="animate" exit="exit">
              <cur.C next={next} go={go} replay={replay} />
            </motion.div>
          </AnimatePresence>
          <ProgressNav labels={LABELS} page={page} max={max} go={go} />
        </>
      )}

      {ready && <MusicPlayer />}
      <CustomCursor />
    </FxProvider>
  );
}
