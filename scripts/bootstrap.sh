#!/usr/bin/env bash
set -euo pipefail

echo "============================================================"
echo " TAKT Research Program — Zero-Contact Environment Bootstrap"
echo "============================================================"

# Check Node.js installation
if command -v node >/dev/null 2>&1; then
    NODE_VER=$(node -v)
    echo "[+] Node.js detected: ${NODE_VER}"
else
    echo "[!] ERROR: Node.js is required but not installed." >&2
    exit 1
fi

# Check Lean 4 installation
if command -v lake >/dev/null 2>&1; then
    LAKE_VER=$(lake --version)
    echo "[+] Lean 4 (lake) detected: ${LAKE_VER}"
else
    echo "[!] ERROR: Lean 4 (lake) is required but not installed." >&2
    exit 1
fi

echo "[+] Installing npm dependencies..."
npm install --silent

echo "[+] Pre-building Lean 4 formal codebase..."
(cd takt-formal && lake build)

echo "============================================================"
echo " Bootstrap complete! Environment is ready for verification."
echo " Run ./scripts/verify.sh to execute zero-contact verification."
echo "============================================================"
