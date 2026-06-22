"use client";
import { useEffect, useRef } from "react";

export type FaceMode = "idle" | "working" | "notify" | "done";

const ORANGE = "#ff6a13", BLACK = "#000000", WHITE = "#ffffff";
const W = 240, H = 240, EYE_W = 30, EYE_H = 60, GAP = 120, OY = 40;
const LX = (W - (EYE_W * 2 + GAP)) / 2, RX = LX + EYE_W + GAP, EY = (H - EYE_H) / 2 - OY;
const MX = W / 2, MY = 155;
const PHRASES = ["thinking...", "pondering...", "on it!", "brewing...", "almost there", "let me see..."];

/** Device-accurate Clyde face, ported from the firmware's draw routines. */
export default function FaceCanvas({
  mode = "idle",
  size = 240,
  className = "",
}: { mode?: FaceMode; size?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ratio = window.devicePixelRatio || 1;
    cv.width = W * ratio;
    cv.height = H * ratio;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.scale(ratio, ratio);

    let raf = 0, t0 = 0;
    let blinkUntil = 0, nextBlink = 1500 + Math.random() * 3000;
    let glanceUntil = 0, glanceDir = 0, nextGlance = 3000 + Math.random() * 3000;
    let phrase = 0, chars = 0, tickAt = 300, curOn = true, curAt = 450;

    const base = (c: string) => { ctx.fillStyle = c; ctx.fillRect(0, 0, W, H); };
    const eyes = (blink: boolean, lid = 0, ox = 0) => {
      ctx.fillStyle = BLACK;
      const lx = LX + ox, rx = RX + ox;
      if (blink) {
        ctx.fillRect(lx, EY + EYE_H / 2 - 3, EYE_W, 6);
        ctx.fillRect(rx, EY + EYE_H / 2 - 3, EYE_W, 6);
        return;
      }
      const cut = EYE_H * lid;
      ctx.fillRect(lx, EY + cut, EYE_W, EYE_H - cut);
      ctx.fillRect(rx, EY + cut, EYE_W, EYE_H - cut);
    };
    const openMouth = () => {
      ctx.fillStyle = BLACK; ctx.fillRect(MX - 20, MY - 9, 40, 40);
      ctx.fillStyle = ORANGE; ctx.fillRect(MX - 8, MY + 3, 16, 16);
    };
    const smile = (cx: number, cyTop: number, width: number, amp: number) => {
      ctx.fillStyle = BLACK; const n = 11, r = 4;
      for (let i = 0; i < n; i++) {
        const u = i / (n - 1);
        const x = cx - width / 2 + u * width;
        const y = cyTop + Math.sin(u * Math.PI) * amp;
        ctx.fillRect(Math.round(x) - r, Math.round(y) - r, 2 * r, 2 * r);
      }
    };
    const sparkle = (x: number, y: number, s: number) => {
      ctx.fillStyle = WHITE; ctx.fillRect(x - 1, y - s, 3, 2 * s); ctx.fillRect(x - s, y - 1, 2 * s, 3);
    };
    const typeLine = (str: string, n: number, cursor: boolean) => {
      ctx.fillStyle = ORANGE; ctx.fillRect(0, 138, W, 24);
      const len = str.length;
      let startX = Math.round((W - len * 12) / 2);
      if (startX < 4) startX = 4;
      ctx.fillStyle = BLACK;
      ctx.font = 'bold 20px "Courier New", monospace';
      ctx.textBaseline = "top"; ctx.textAlign = "left";
      ctx.fillText(str.slice(0, n), startX, 140);
      if (cursor) ctx.fillRect(startX + n * 12, 140, 10, 16);
    };

    const draw = (t: number) => {
      if (t > nextBlink && t > blinkUntil) { blinkUntil = t + 130; nextBlink = t + 2600 + Math.random() * 4000; }
      const blinking = t < blinkUntil;

      if (mode === "idle") {
        if (t > nextGlance && t > glanceUntil) {
          glanceUntil = t + 500; glanceDir = Math.random() < 0.5 ? -16 : 16;
          nextGlance = t + 3500 + Math.random() * 3500;
        }
        base(ORANGE); eyes(blinking, 0, t < glanceUntil ? glanceDir : 0);
      } else if (mode === "notify") {
        base(ORANGE); eyes(blinking); openMouth();
      } else if (mode === "working") {
        base(ORANGE); eyes(false);
        if (t > curAt) { curOn = !curOn; curAt = t + 450; }
        if (t > tickAt) {
          const len = PHRASES[phrase].length;
          if (chars < len) { chars++; tickAt = t + (chars === len ? 1400 : 110); }
          else { phrase = (phrase + 1) % PHRASES.length; chars = 0; tickAt = t + 350; }
        }
        typeLine(PHRASES[phrase], chars, curOn);
      } else if (mode === "done") {
        base(ORANGE);
        const cyc = t % 3800;
        if (cyc < 2200) {
          eyes(false); smile(MX, 150, 80, 16);
          if (Math.floor(cyc / 180) % 2 === 0) { sparkle(202, 50, 5); sparkle(38, 58, 4); }
        } else {
          eyes(blinking);
        }
      }
    };

    const loop = (ts: number) => {
      if (!t0) t0 = ts;
      draw(ts - t0);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      style={{ width: size, height: size, display: "block" }}
      className={className}
    />
  );
}
