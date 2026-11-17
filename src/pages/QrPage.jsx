import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy, Download, Printer, TriangleAlert } from "lucide-react";
import { config } from "../config.js";
import { store } from "../lib/storage.js";

// QR PAGE · open the site at  /#/qr
// Builds a QR code for the real, public address of the site (never localhost),
// with a small heart in the middle. Error correction is level H, so the heart
// does not stop phones from scanning it.

const LOCAL = /^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)|\.local$/;
const isLocalHost = (h) => LOCAL.test(h);

function detectUrl() {
  if (config.siteUrl) return config.siteUrl;
  const { hostname, origin, pathname } = window.location;
  return isLocalHost(hostname) ? "" : origin + pathname;
}

function heartPath(c, cx, cy, s) {
  c.beginPath();
  c.moveTo(cx, cy + s * 0.9);
  c.bezierCurveTo(cx - s * 2.2, cy - s * 0.3, cx - s * 1.1, cy - s * 1.9, cx, cy - s * 0.7);
  c.bezierCurveTo(cx + s * 1.1, cy - s * 1.9, cx + s * 2.2, cy - s * 0.3, cx, cy + s * 0.9);
  c.fill();
}

async function paint(canvas, text, size) {
  await QRCode.toCanvas(canvas, text, { errorCorrectionLevel: "H", margin: 2, width: size, color: { dark: "#2a1030", light: "#ffffff" } });
  const c = canvas.getContext("2d");
  const r = size * 0.07; // the logo covers about 4% of the code
  c.fillStyle = "#ffffff";
  c.beginPath();
  c.arc(size / 2, size / 2, r * 1.55, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "#d6405f";
  heartPath(c, size / 2, size / 2, r * 0.78);
}

export default function QrPage() {
  const [url, setUrl] = useState(() => detectUrl() || store.get("qrUrl", ""));
  const [draft, setDraft] = useState(url);
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);
  const cv = useRef(null);
  const input = useRef(null);

  const valid = /^https?:\/\/\S+$/i.test(url);
  const local = useMemo(() => {
    try {
      return isLocalHost(new URL(url).hostname);
    } catch {
      return false;
    }
  }, [url]);

  useEffect(() => {
    if (!valid || !cv.current) return undefined;
    let alive = true;
    paint(cv.current, url, 640)
      .then(() => {
        if (alive && cv.current) {
          cv.current.style.width = "100%";
          cv.current.style.height = "auto";
          setStatus("");
        }
      })
      .catch(() => setStatus("Could not create the QR code. Check the link."));
    return () => {
      alive = false;
    };
  }, [url, valid]);

  const apply = (e) => {
    e.preventDefault();
    let v = draft.trim();
    if (v && !/^https?:\/\//i.test(v)) v = "https://" + v;
    setUrl(v);
    setDraft(v);
    store.set("qrUrl", v);
  };

  const download = async () => {
    if (!valid) return;
    const big = document.createElement("canvas");
    await paint(big, url, 2000); // high-resolution PNG
    big.toBlob((blob) => {
      if (!blob) return;
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = "shreya-surprise-qr.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(href), 4000);
    }, "image/png");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      if (input.current) {
        input.current.focus();
        input.current.select();
      }
      setStatus("Select the link above and copy it.");
    }
  };

  return (
    <div className="stage">
      <div className="page qr">
        <div className="inner">
          <div className="qr-card glass">
            <div className="qr-print">
              <h1 className="display qr-title">{config.qr.title}</h1>
              <div className="qr-frame">{valid ? <canvas ref={cv} aria-label={`QR code for ${url}`} /> : <p className="qr-empty">Add your website link below to create the QR code.</p>}</div>
              {valid && <p className="qr-url">{url}</p>}
            </div>

            {local && (
              <p className="qr-warn" role="alert">
                <TriangleAlert size={16} /> This link only works on this computer. Deploy the site first, then paste the public link below.
              </p>
            )}

            <div className="qr-actions qr-noprint">
              <button type="button" className="btn" onClick={download} disabled={!valid}>
                <Download size={16} /> Download QR Code
              </button>
              <button type="button" className="btn btn-ghost" onClick={copy} disabled={!valid}>
                {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy Website Link"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => window.print()} disabled={!valid}>
                <Printer size={16} /> Print
              </button>
            </div>

            <form className="qr-form qr-noprint" onSubmit={apply}>
              <label htmlFor="qr-link">Website link</label>
              <div className="qr-row">
                <input id="qr-link" ref={input} type="url" inputMode="url" placeholder="https://your-site.vercel.app" value={draft} onChange={(e) => setDraft(e.target.value)} />
                <button type="submit" className="btn btn-ghost">
                  Update
                </button>
              </div>
              <small>On the live site this fills in automatically. Before printing, scan the code with a phone camera to check that it opens the surprise.</small>
              {status && <small role="status">{status}</small>}
            </form>

            <a className="qr-back qr-noprint" href="#/">
              Open the experience
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
