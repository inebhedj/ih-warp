#!/bin/sh


set -eu

FG="#ff1744"   # draw color
BG="#263238"   # background color
SRC="safari-pinned-tab.svg"

# starting in script's directory
cd "$(dirname "$0")"

# ImageMagick 7 (magick) or 6 (convert)
if command -v magick >/dev/null 2>&1; then
  IM=magick
elif command -v convert >/dev/null 2>&1; then
  IM=convert
else
  echo "Imagemagick not found (magick)." >&2
  exit 1
fi

[ -f "$SRC" ] || { echo "No $SRC exist in this directory." >&2; exit 1; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

for s in 16 32 48 64 180 192 512; do
  sed -E 's/ (width|height)="[^"]*"//g; s/<svg /<svg width="'"$s"'" height="'"$s"'" fill="'"$FG"'" /' "$SRC" > "$TMP/$s.svg"
  "$IM" -background "$BG" -density 96 "$TMP/$s.svg" -flatten "PNG32:favicon-${s}x${s}.png"
done

cp favicon-180x180.png apple-touch-icon.png

"$IM" favicon-16x16.png favicon-32x32.png favicon-48x48.png favicon.ico

ls -1 apple-touch-icon.png favicon-*.png favicon.ico

