#!/bin/bash
# Arbitrate Clyde's face across concurrent Claude Code sessions (cmux tabs).
# Usage (Claude Code hook): clyde-hook.sh working|notify|done|end
# Without this, a Stop in one tab clears the working face another tab just set.
EVENT="${1:-done}"
DIR="${TMPDIR:-/tmp}/clyde-sessions"
FACE="$DIR/.face"
POKE="$HOME/Developer/clydeMochi/poke.sh"
mkdir -p "$DIR" || exit 0

# Session id comes from the hook payload on stdin; don't block on a manual run.
SID=""
[ -t 0 ] || SID=$(jq -r '.session_id // empty' 2>/dev/null)
SID="${SID:-manual-$PPID}"

case "$EVENT" in
  working) printf 'working' > "$DIR/$SID" ;;
  # Only a mid-turn session (marker present) is really blocked on you. Claude also
  # fires Notification ~60s after a turn ends as an idle nag -- honouring that would
  # pin Clyde on the bounce face forever, since Stop already cleared the marker.
  notify)  [ -f "$DIR/$SID" ] && printf 'notify' > "$DIR/$SID" ;;
  done|end) rm -f "$DIR/$SID" ;;
esac

# Sessions that died without firing Stop/SessionEnd would pin Clyde on `working`.
find "$DIR" -type f ! -name '.face' -mmin +60 -delete 2>/dev/null

want=done
for f in "$DIR"/*; do            # leading-dot .face is skipped by the glob
  [ -f "$f" ] || continue
  [ "$(cat "$f")" = "notify" ] && { want=notify; break; }
  want=working
done

[ "$(cat "$FACE" 2>/dev/null)" = "$want" ] && exit 0   # no redundant serial writes
printf '%s' "$want" > "$FACE"
exec "$POKE" "$want"
