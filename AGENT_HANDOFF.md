# Clawd Mochi — Agent Handoff & Dev Log

> Read this first if you're a fresh agent/session working on Clawd Mochi.
> It captures current state, the **exact flashing procedure that works**, and the
> hard-won problem/solution log from the day we got Variant C onto the board.
> Last updated: 2026-06-20.

---

## What this is
A desk companion: an **ESP32-C3 Super Mini + ST7789 1.54" 240×240 SPI display** in a
**sealed enclosure**, showing "Clawd" the crab's face. It runs an autonomous idle loop,
hosts a WiFi AP web controller, and takes one-word serial commands over USB-C. Claude Code
hooks drive its face to mirror the user's coding-session state.

Based on github.com/yousifamanuel/clawd-mochi.

## Key paths
| Thing | Path |
|---|---|
| **Firmware sketch** (the real file) | `clawd-mochi/clawd_mochi/clawd_mochi.ino` *(nested two levels — NOT in repo root)* |
| Serial bridge | `poke.sh` (repo root) — auto-detects port, `echo`es a command word |
| Face mockups | `working_face_variants.html` (repo root) — the 3 working-face options A/B/C |
| Claude Code hooks | `~/.claude/settings.json` → `UserPromptSubmit`→`working`, `Notification`→`notify`, `Stop`→`done` |
| Bundled arduino-cli | `/Applications/Arduino IDE.app/Contents/Resources/app/lib/backend/resources/arduino-cli` |
| esptool | `~/Library/Arduino15/packages/esp32/tools/esptool_py/5.3.0/esptool` |
| ESP32 core | `esp32:esp32` **3.3.10** |

Wiring: SDA=GPIO10, SCL=GPIO8, RST=GPIO2, DC=GPIO1, CS=GPIO4, BLK=GPIO3.
This folder is **not** a git repo. The nested `clawd-mochi/` is the upstream clone (has its own `.git`).

## Current firmware state (what's on the board now — as of 2026-06-20)
- **Boot sequence**: "Clawd" splash → 🦀 **pixel-crab mascot hops across** on black (`drawClawd` +
  `drawMascotCrossing`, flicker-free: only the crab footprint repaints) → Anthropic logo (now with
  **no "Anthropic" text**) → WiFi info **~2s** → drops straight to **idle eyes** (`started=true`).
- **`working` face = "typing"**: plain eyes + a status line that types out phrases one char at a time
  with a blinking cursor (`WORK_PHRASES[]`, `drawWorkText()`, `workTypeTick()` in loop; gated on
  `faceMouth==MOUTH_FLAT`). (Replaced the earlier Variant-C heads-down/sweep-bar.)
- **`notify` face = "bounce"**: eyes + open square mouth, the **whole face gently bobs** (`drawNotifyFace(dy)`
  + `notifyMs` driver in loop, gated on `faceMouth==MOUTH_OPEN`; flicker-free in-place overwrite).
- **`done` face = "happy"**: brief eyes + blocky smile + twinkling sparkles (`animDone`, `drawSmile`,
  `drawSparkle`), then settles to idle.
- Compiled with **`CDCOnBoot=cdc`** (required, see gotcha #2). All flashed & verified on device.
- **Website**: a Next.js site at `site/` (docs + journey + live face demos), restyled to the
  **clawd.rip** warm-editorial feel (cream paper, Fraunces serif, single terracotta accent #c4633f,
  pixel-crab hero, dashed-line timeline). Run with `npm run dev` (dev server gets reaped if launched
  from the agent — run it in a normal terminal). Not deployed, not in git.

## ⚠️ Known hardware issue — flaky USB-C data link
The board's **USB-C connector has an intermittent DATA connection** (power/VBUS holds — display stays
on — but D+/D− drop, wiggle-sensitive at the board end). Cause: cracked/cold-solder on the tiny data
pads, worsened by many plug/unplug cycles. **Symptom for flashing:** the port appears/disappears and
esptool gets "No serial data received" or drops mid-write. **Fix:** new known-good cable first (Apple
USB-C charge/woven cables DO carry USB-2.0 data — fine for the C3), then if still wiggle-sensitive,
**reflow/resolder the USB-C connector pads** or swap the C3 board. Until then the serial hooks work only
intermittently; the board still runs autonomously (idle, boot anim, WiFi web controller) without data.

## Semantic serial commands (for the hooks)
`working` → flat mouth + heads-down face (holds, idle frozen) · `notify` → open mouth (holds) ·
`done` → clears mouth, idle resumes. Also gestures: `blink wiggle look squish eyes logo`.
Board echoes `ok: <cmd>`. A posed mouth (`faceMouth != MOUTH_NONE`) freezes idle; `done` clears it.
Idle stays OFF (`started=false`) until the first command after boot.

---

## ✅ FLASHING PROCEDURE THAT WORKS (do exactly this)
The board's **BOOT button is sealed inside the case** — no physical strap access. Flashing relies on
esptool's software USB reset, which works **only over a solid USB connection**. Steps:

1. **Use a known-good USB-C *data* cable**, plugged **straight into the Mac** (no hub). This is the #1 thing.
2. **Disable `poke.sh`** so the Claude Code hooks don't grab the serial port mid-flash:
   add `exit 0` as the first executable line of `poke.sh` (remove it after).
3. **Compile** with CDC enabled:
   ```
   ARDUINO_CLI="/Applications/Arduino IDE.app/Contents/Resources/app/lib/backend/resources/arduino-cli"
   "$ARDUINO_CLI" compile --fqbn "esp32:esp32:esp32c3:CDCOnBoot=cdc" \
     --output-dir /tmp/clawd_build \
     "$HOME/Developer/clawdMochi/clawd-mochi/clawd_mochi"
   ```
4. **Flash** the full image (leave the board PLUGGED IN — do NOT power-cycle):
   ```
   ESPTOOL=~/Library/Arduino15/packages/esp32/tools/esptool_py/5.3.0/esptool
   PORT=$(find /dev -maxdepth 1 -name 'cu.usbmodem*' | head -1)   # NOT `ls` — see gotcha #3
   "$ESPTOOL" --chip esp32c3 --port "$PORT" --before usb-reset --after hard-reset \
     write-flash -z 0x0 /tmp/clawd_build/clawd_mochi.ino.merged.bin
   ```
   Success = `Hash of data verified.` Takes ~7s. If "No serial data received": it's the cable/connection —
   swap cable/port and retry; do NOT start unplugging mid-attempt (that sabotages it).
5. **Restore `poke.sh`** (delete the `exit 0` line).
6. **Wait ~5s** for boot (splash→logo→WiFi), THEN `./poke.sh working` to verify the face.

The user normally flashes from Arduino IDE 2.x (board "ESP32C3 Dev Module", USB CDC On Boot = Enabled,
160MHz, 921600). The CLI path above is what an agent should use.

---

## 🐞 PROBLEM / SOLUTION LOG (today's saga — don't repeat these)

**1. `Failed uploading: No serial data received` (the big time-sink).**
Root cause: a **flaky/marginal USB-C cable+connection**, made worse by us **power-cycling the board
during the handshake**. Symptoms it caused: board "barely detected", drops mid-flash, `Invalid head of
packet (0x45)` serial-noise errors. Fix: **known-good data cable, direct to Mac, leave plugged in.** The
identical `esptool ... --before usb-reset` command that failed dozens of times succeeded instantly on a
good cable. → Lesson: suspect the cable FIRST, not the board/reset mode.

**2. Serial dead after a "successful" flash (poke.sh did nothing; face + WiFi still worked).**
Root cause: compiled with the bare FQBN `esp32:esp32:esp32c3`, whose **default is `CDCOnBoot=default`
(USB CDC On Boot = *Disabled*)**, routing `Serial` to UART0 pins instead of USB. Display/WiFi don't
depend on Serial, so it looked fine but masked the break. Fix: **always compile with
`esp32:esp32:esp32c3:CDCOnBoot=cdc`.** Verify with `arduino-cli board details --fqbn esp32:esp32:esp32c3`.

**3. Port detection returned garbage (`clawd-mochi`).**
Root cause: `ls /dev/cu.usbmodem*` under this shell's **nullglob** — when no device matches, the glob
vanishes and `ls` lists the **current directory** instead. Fix: use
`find /dev -maxdepth 1 -name 'cu.usbmodem*'`. Also: the port name **shuffles** between
`cu.usbmodem101` and `cu.usbmodem1101` across resets — always re-detect, never hardcode.

**4. Round-trip serial read failed with `operation not permitted`.**
The agent's sandboxed shell can't `exec 3<>/dev/cu.*` (open the port read-write) to read the `ok:` echo.
`poke.sh`'s `echo "$MSG" > "$PORT"` (write-only) DOES work. Fix: verify via `poke.sh` + the user eyeballing
the display, or use `dangerouslyDisableSandbox` if a programmatic read is truly needed.

**5. Command sent right after flash did nothing.**
The board was still booting (splash 1.2s → logo reveal → WiFi init, ~5s total). Send commands only after
boot completes. Also remember idle won't start until the first command (`started` gate).

**6. Buttonless reset reliability.**
esptool `usb-reset` worked when the board ran a CDC-enabled (cooperative) firmware; the bare-default
(CDC-disabled) build I briefly flashed refused it. Combined with #1, this caused a scary "won't reflash"
window. The C3 is **never bricked** — BOOT/GPIO9 always recovers — but that's sealed here, so keep CDC
enabled and use a good cable so software flashing keeps working.

---

## 🔜 Pending / next features
The user has several features planned (TBD — ask them). When adding any:
- Edit `clawd-mochi/clawd_mochi/clawd_mochi.ino`, reflash via the procedure above.
- The phone web UI is a raw-string `INDEX_HTML` PROGMEM blob inside the same `.ino` (search `INDEX_HTML`).
- New face states: follow the `working`/`notify`/`done` pattern in `handleSerialCommand()`; remember the
  idle-freeze rule (`faceMouth != MOUTH_NONE` holds the face).
- Only ONE program can hold the serial port — close Arduino Serial Monitor before using `poke.sh`/hooks.
