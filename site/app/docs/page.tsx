import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Hardware, firmware, serial commands, the WiFi controller, and the flashing procedure that works.",
};

function Section({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 mb-16">
      <div className="text-[11px] tracking-[0.2em] uppercase text-accent mb-2">{label}</div>
      <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-5">{title}</h2>
      <div className="text-[15px] text-ink/90 leading-7 space-y-4 max-w-prose">{children}</div>
    </section>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="font-mono bg-paper-2 border border-line rounded-xl p-4 text-[12.5px] text-ink overflow-x-auto leading-relaxed">
      {children}
    </pre>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return <code className="font-mono text-[0.9em] text-accent">{children}</code>;
}

const pins: [string, string][] = [
  ["SDA → GPIO10", "SPI MOSI (data)"],
  ["SCL → GPIO8", "SPI SCK (clock)"],
  ["RST → GPIO2", "reset"],
  ["DC → GPIO1", "data / command"],
  ["CS → GPIO4", "chip select"],
  ["BLK → GPIO3", "backlight"],
  ["3V3 / GND", "power"],
];

const commands: [string, string, string][] = [
  ["working", "semantic", "Plain eyes plus a typing status line. Holds (idle frozen)."],
  ["notify", "semantic", "Open mouth that gently bobs — Claude needs you. Holds."],
  ["done", "semantic", "A brief happy beat (smile and sparkles), then idle resumes."],
  ["blink / wiggle / look", "gesture", "One-off eye animations."],
  ["squish / eyes / logo", "gesture", "Squint, reset to eyes, or replay the logo."],
];

const wifi: [string, string][] = [
  ["SSID", "ClaWD-Mochi"],
  ["Password", "clawd1234"],
  ["URL", "192.168.4.1"],
];

export default function Docs() {
  return (
    <article className="mx-auto max-w-3xl px-6 pt-16 pb-24">
      <div className="text-[11px] tracking-[0.2em] uppercase text-mut mb-3">Documentation</div>
      <h1 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight mb-12">
        How Clawd works
      </h1>

      <Section id="overview" label="01" title="Overview">
        <p>
          Clawd is a desk companion: an <strong className="font-medium">ESP32-C3 Super Mini</strong>{" "}
          driving a <strong className="font-medium">1.54&quot; 240×240 ST7789</strong> display, showing
          a crab&apos;s face. It runs an autonomous idle loop, hosts a WiFi web controller, and listens
          on USB serial for one-word commands. Claude Code hooks send those commands, so the face
          mirrors your coding session in real time.
        </p>
      </Section>

      <Section id="hardware" label="02" title="Hardware and wiring">
        <p>
          Everything is on hardware SPI. The C3&apos;s USB port re-enumerates on reset, so the serial
          device name shuffles between boots.
        </p>
        <div className="not-prose rounded-xl border border-line overflow-hidden">
          {pins.map(([pin, note], i) => (
            <div
              key={pin}
              className={`flex justify-between px-4 py-3 text-sm ${i % 2 ? "bg-paper-2" : "bg-transparent"}`}
            >
              <span className="font-mono text-accent">{pin}</span>
              <span className="text-mut">{note}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="firmware" label="03" title="Firmware and the face">
        <p>
          A single Arduino sketch (<Mono>clawd_mochi.ino</Mono>) draws the face — two black eyes on a
          Mandarin-orange background — and runs everything non-blocking from <Mono>loop()</Mono> via{" "}
          <Mono>millis()</Mono>, so WiFi and serial stay responsive during animations.
        </p>
        <p>
          A posed mouth (the <Mono>working</Mono> and <Mono>notify</Mono> states) freezes the idle
          loop; <Mono>done</Mono> clears it and idle resumes.
        </p>
      </Section>

      <Section id="commands" label="04" title="Serial commands">
        <p>
          Send a single word terminated by a newline over USB serial (115200). The board echoes{" "}
          <Mono>ok: &lt;cmd&gt;</Mono>.
        </p>
        <div className="not-prose rounded-xl border border-line divide-y divide-line">
          {commands.map(([cmd, kind, desc]) => (
            <div key={cmd} className="px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-accent text-[15px]">{cmd}</span>
                <span className="text-[10px] tracking-[0.12em] uppercase text-mut border border-line px-1.5 py-0.5">
                  {kind}
                </span>
              </div>
              <div className="text-sm text-mut mt-1.5">{desc}</div>
            </div>
          ))}
        </div>
        <p>
          On the Mac, <Mono>poke.sh</Mono> auto-detects the port and echoes a word to it; the Claude
          Code hooks call it on <Mono>UserPromptSubmit</Mono> → working, <Mono>Notification</Mono> →
          notify, and <Mono>Stop</Mono> → done.
        </p>
      </Section>

      <Section id="web" label="05" title="WiFi web controller">
        <p>The board hosts an access point and serves a phone controller — no app needed.</p>
        <div className="not-prose grid grid-cols-3 gap-3">
          {wifi.map(([k, v]) => (
            <div key={k} className="rounded-xl border border-line p-3.5 text-center">
              <div className="text-[10px] tracking-[0.12em] uppercase text-mut mb-1.5">{k}</div>
              <div className="font-mono text-accent text-sm">{v}</div>
            </div>
          ))}
        </div>
        <p>
          It controls views, animation speed, the backlight, a live terminal view, and a
          draw-on-screen canvas.
        </p>
      </Section>

      <Section id="flashing" label="06" title="Flashing — the procedure that works">
        <p>
          The BOOT button is sealed in the case, so flashing relies on esptool&apos;s software USB
          reset — which works reliably{" "}
          <strong className="font-medium">only over a solid data cable plugged straight into the Mac</strong>
          . Two rules: compile with <Mono>CDCOnBoot=cdc</Mono>, and leave the board plugged in.
        </p>
        <Code>{`# 1) compile (CDC on boot = enabled is REQUIRED for serial)
arduino-cli compile \\
  --fqbn "esp32:esp32:esp32c3:CDCOnBoot=cdc" \\
  --output-dir /tmp/clawd_build \\
  ~/Developer/clawdMochi/clawd-mochi/clawd_mochi

# 2) flash the full image — keep it plugged in, don't power-cycle
PORT=$(find /dev -maxdepth 1 -name 'cu.usbmodem*' | head -1)
esptool --chip esp32c3 --port "$PORT" \\
  --before usb-reset --after hard-reset \\
  write-flash -z 0x0 /tmp/clawd_build/clawd_mochi.ino.merged.bin
# success = "Hash of data verified."  (~7 seconds)`}</Code>
        <p>
          If you see <Mono>No serial data received</Mono>, it&apos;s almost always the cable — swap to
          a known-good data cable and retry; don&apos;t start unplugging mid-attempt. See the{" "}
          <a
            href="/journey"
            className="text-accent underline underline-offset-4 decoration-accent/40 hover:decoration-accent transition"
          >
            build journey
          </a>{" "}
          for the full story.
        </p>
      </Section>
    </article>
  );
}
