import Link from "next/link";
import FaceCanvas, { type FaceMode } from "@/components/FaceCanvas";
import { Mascot } from "@/components/brand";
import Screen from "@/components/Screen";

const states: { mode: FaceMode; label: string; note: string }[] = [
  { mode: "idle", label: "idle", note: "blinks and glances on its own" },
  { mode: "working", label: "working", note: "types out what it's thinking" },
  { mode: "notify", label: "notify", note: "bobs when it needs you" },
  { mode: "done", label: "done", note: "a happy beat when you finish" },
];

const specs: { h: string; b: string }[] = [
  {
    h: "The hardware",
    b: 'An ESP32-C3 Super Mini driving a 1.54" 240×240 ST7789 display, tucked into a sealed case on your desk.',
  },
  {
    h: "Driven by hooks",
    b: "Claude Code hooks push working, notify, and done to the board over USB serial, so the face tracks your session in real time.",
  },
  {
    h: "Self-contained",
    b: "It hosts its own WiFi web controller and runs an autonomous idle loop — no companion app, nothing to install.",
  },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pt-16 md:pt-24 pb-20">
        <div className="grid md:grid-cols-[1.25fr_1fr] gap-12 items-center">
          <div>
            <p className="text-xs tracking-[0.22em] uppercase text-mut mb-6">
              A desk companion · built with Claude Code
            </p>
            <h1 className="font-serif font-semibold tracking-tight text-5xl md:text-6xl leading-[1.04] text-balance">
              A crab that <span className="text-accent italic">mirrors</span> your
              Claude&nbsp;Code sessions.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-mut max-w-prose text-pretty">
              Clawd lives on an ESP32-C3 with a tiny 240×240 screen. It focuses while
              you work, taps when it needs you, and celebrates when you&apos;re done.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-full bg-accent text-white px-6 py-3 text-sm font-medium transition-colors duration-200 hover:bg-[#b1593a] active:scale-[0.98]"
              >
                Read the docs →
              </Link>
              <Link
                href="/journey"
                className="inline-flex items-center rounded-full border border-line px-6 py-3 text-sm transition-colors duration-200 hover:border-ink"
              >
                The build journey
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <Mascot size={300} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold">Four faces, live</h2>
          <span className="text-sm text-mut">rendered from the firmware&apos;s own draw code</span>
        </header>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {states.map((s) => (
            <figure key={s.mode} className="flex flex-col items-center gap-5">
              <Screen>
                <FaceCanvas mode={s.mode} size={150} />
              </Screen>
              <figcaption className="text-center">
                <div className="font-serif text-lg">{s.label}</div>
                <div className="text-sm text-mut mt-0.5">{s.note}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <dl className="border-t border-line">
          {specs.map((s) => (
            <div
              key={s.h}
              className="grid md:grid-cols-[240px_1fr] gap-x-10 py-7 border-b border-line"
            >
              <dt className="font-serif text-xl mb-2 md:mb-0">{s.h}</dt>
              <dd className="text-mut leading-relaxed max-w-prose text-pretty">{s.b}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
