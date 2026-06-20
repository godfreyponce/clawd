#!/bin/bash
# Send a one-word command to the Clawd Mochi over USB-C.
# Usage: poke.sh notify
MSG="${1:-notify}"

# Auto-detect the board's port (name shuffles between boots)
PORT=$(ls /dev/cu.usbmodem* 2>/dev/null | head -n 1)
[ -z "$PORT" ] && exit 0   # board not plugged in → do nothing, never error

# Open the port without triggering a reset, then send the command
stty -f "$PORT" 115200 2>/dev/null
echo "$MSG" > "$PORT"
