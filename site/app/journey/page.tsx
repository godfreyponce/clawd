import type { Metadata } from "next";
import FaceCanvas from "@/components/FaceCanvas";
import Screen from "@/components/Screen";

export const metadata: Metadata = {
  title: "The build journey",
  description:
    "Designing the faces, the redesigns, and the flashing saga — problem, root cause, fix.",
};

type Entry = {
  date: string;
  cat: "Design" | "Firmware" | "Debugging";
  title: string;
  body?: string;
  cause?: string;
  fix?: string;
};

const feed: Entry[] = [
  {
    date: "Jun 15",
    cat: "Design",
    title: "A crab that lives on your desk",
    body:
      "Two black eyes on Mandarin orange, an autonomous idle loop, a WiFi controller, and serial commands — all non-blocking so nothing ever freezes. This was the foundation everything else bolted onto.",
  },
  {
    date: "Jun 16",
    cat: "Design",
    title: "Three working faces, one winner, then a rethink",
    body:
      "We mocked up three working faces as live HTML — Steady Focus, Determined, and Heads-Down — and picked Heads-Down with its half-lidded eyes and a sweeping bar. Later it was redesigned again into the Typing face: the crab types out what it's thinking, one character at a time, with a blinking cursor.",
  },
  {
    date: "Jun 18",
    cat: "Firmware",
    title: "Give it a moment to celebrate",
    body:
      "Finishing used to snap straight back to plain eyes. Now done plays a brief happy beat — bright eyes, a blocky smile, and twinkling sparkles — before settling into idle.",
  },
  {
    date: "Jun 19",
    cat: "Debugging",
    title: "“No serial data received” when flashing",
    cause:
      "A marginal USB-C cable, made worse by power-cycling the board mid-handshake. It showed up as the board barely being detected, dropped transfers, and serial-noise errors.",
    fix:
      "Use a known-good data cable straight into the Mac and leave it plugged in. The identical esptool command that failed dozens of times worked instantly on a good cable. Suspect the cable first.",
  },
  {
    date: "Jun 19",
    cat: "Debugging",
    title: "Serial dead after a “successful” flash",
    cause:
      "Compiled with the bare FQBN, whose default is USB CDC On Boot = Disabled — so Serial went to the UART pins, not USB. The face and WiFi still worked, which hid the break.",
    fix:
      "Always compile with esp32:esp32:esp32c3:CDCOnBoot=cdc so Serial lives on USB.",
  },
  {
    date: "Jun 19",
    cat: "Debugging",
    title: "Port detection returned garbage",
    cause:
      "ls /dev/cu.usbmodem* under a nullglob shell: with no match the glob vanishes and ls lists the current directory instead, handing esptool a nonsense port.",
    fix:
      "Use find /dev -maxdepth 1 -name 'cu.usbmodem*', and always re-detect — the port name shuffles between usbmodem101 and usbmodem1101.",
  },
  {
    date: "Jun 20",
    cat: "Design",
    title: "Its own intro",
    body:
      "Renamed the splash to just “Clawd”, added a little mascot crab that hops across the screen, kept the Anthropic logo reveal, and made the WiFi info flash briefly before dropping straight into idle.",
  },
  {
    date: "Jun 20",
    cat: "Design",
    title: "A bouncier notify",
    body:
      "The attention state used to be a static open mouth. Now the whole face gently bobs up and down while it waits for you — motion that's hard to miss out of the corner of your eye.",
  },
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] tracking-[0.1em] uppercase text-accent border border-accent/35 rounded-full px-2.5 py-0.5">
      {children}
    </span>
  );
}

export default function Journey() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-16 pb-24">
      <div className="text-[11px] tracking-[0.2em] uppercase text-mut mb-3">Build journey</div>
      <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight mb-5 text-balance">
        The making of <span className="text-accent italic">Clawd</span>
      </h1>
      <p className="text-lg text-mut leading-relaxed max-w-prose mb-12 text-pretty">
        How a crab face became a session-aware desk companion — the design calls, the redesigns,
        and the flashing saga that ate an afternoon. Here are the two faces we landed on, live:
      </p>

      <div className="flex flex-wrap gap-8 mb-16">
        {(["working", "done"] as const).map((m) => (
          <figure key={m} className="flex flex-col items-center gap-3">
            <Screen>
              <FaceCanvas mode={m} size={160} />
            </Screen>
            <figcaption className="font-serif text-base">{m}</figcaption>
          </figure>
        ))}
      </div>

      <ol className="relative">
        {feed.map((e, i) => (
          <li key={i} className="relative pl-9 pb-12 last:pb-0">
            {i < feed.length - 1 && (
              <span
                aria-hidden
                className="absolute left-[6px] top-3 bottom-0 border-l border-dashed border-line"
              />
            )}
            <span
              aria-hidden
              className="absolute left-0 top-0.5 text-accent text-base leading-none"
            >
              ✕
            </span>
            <div className="flex items-center gap-3 mb-2.5">
              <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-mut">
                {e.date}, 2026
              </span>
              <Pill>{e.cat}</Pill>
            </div>
            <h3 className="font-serif text-xl md:text-2xl font-semibold mb-2.5">{e.title}</h3>
            {e.body && (
              <p className="text-mut leading-relaxed max-w-prose text-pretty">{e.body}</p>
            )}
            {e.cause && (
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 max-w-prose mt-1">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.12em] text-mut mb-1.5">
                    Root cause
                  </div>
                  <p className="text-sm text-mut leading-relaxed">{e.cause}</p>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.12em] text-accent mb-1.5">
                    Fix
                  </div>
                  <p className="text-sm text-ink/90 leading-relaxed">{e.fix}</p>
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-14 border-t border-line pt-8 max-w-prose">
        <p className="text-mut leading-relaxed text-pretty">
          <span className="font-serif text-ink font-semibold">The takeaway:</span> the board is
          never bricked — a C3 always recovers — and almost every &ldquo;it won&apos;t flash&rdquo;
          symptom traced back to one cheap USB-C cable. Good cable, CDC on boot, leave it plugged in.
        </p>
      </div>
    </div>
  );
}
