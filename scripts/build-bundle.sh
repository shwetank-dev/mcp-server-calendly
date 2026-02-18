#!/usr/bin/env bash
set -euo pipefail

# Local MCPB bundle build script
# Run via: make bundle

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

VERSION=$(jq -r '.version' manifest.json)
NAME=$(jq -r '.name' manifest.json | sed 's/@//' | sed 's/\//-/')
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)
[ "$ARCH" = "x86_64" ] && ARCH="amd64"
[ "$ARCH" = "aarch64" ] && ARCH="arm64"

OUTPUT="${NAME}-${VERSION}-${OS}-${ARCH}.mcpb"

echo "Building bundle: $OUTPUT"
rm -f "$OUTPUT"
echo "Staging files (respecting .mcpbignore)..."

# Stage into a temp dir so zip doesn't need --exclude-from support
STAGING=$(mktemp -d)
trap "rm -rf '$STAGING'" EXIT

rsync -a \
  --exclude-from=.mcpbignore \
  --exclude="*.mcpb" \
  --exclude=".git" \
  . "$STAGING/"

# Pack as zip (mpak expects zip format)
(cd "$STAGING" && zip -r "$PROJECT_DIR/$OUTPUT" . -q)

echo "Bundle created: $OUTPUT ($(du -h "$OUTPUT" | cut -f1))"
