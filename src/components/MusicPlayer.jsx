import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { audio } from "../lib/audio.js";

// Small round play/pause button. Music begins only after the first click on
// the welcome page; the visitor's choice is remembered on this device.
export default function MusicPlayer() {
  const [on, setOn] = useState(audio.musicOn);
  useEffect(() => audio.subscribe(setOn), []);
  return (
    <button
      type="button"
      className={`music ${on ? "playing" : ""}`}
      aria-pressed={on}
      aria-label={on ? "Pause music" : "Play music"}
      onClick={() => audio.toggleMusic()}
    >
      {on ? <Volume2 size={20} /> : <VolumeX size={20} />}
      {on && (
        <span className="eq" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      )}
    </button>
  );
}
