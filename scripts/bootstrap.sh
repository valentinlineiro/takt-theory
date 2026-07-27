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

echo "[+] Installing npm dependencies..."
npm install

# Check / Provision Lean 4 installation
if command -v lake >/dev/null 2>&1; then
    LAKE_VER=$(lake --version)
    echo "[+] Lean 4 (lake) detected: ${LAKE_VER}"
else
    echo "[!] Lean 4 (lake) not found. Attempting automatic elan toolchain setup..."
    if ! command -v elan >/dev/null 2>&1; then
        echo "[+] Downloading elan installer..."
        curl https://raw.githubusercontent.com/leanprover/elan/master/elan-init.sh -sSf | sh -s -- -y --default-toolchain leanprover/lean4:v4.32.0
        # Source elan env for current session if available
        if [ -f "$HOME/.elan/env" ]; then
            source "$HOME/.elan/env"
        fi
    fi
    
    if command -v lake >/dev/null 2>&1; then
        LAKE_VER=$(lake --version)
        echo "[+] Lean 4 (lake) successfully provisioned: ${LAKE_VER}"
    else
        echo "[!] ERROR: Lean 4 (lake) is required. Please add ~/.elan/bin to your PATH or run: source ~/.elan/env" >&2
        exit 1
    fi
fi

echo "[+] Pre-building Lean 4 formal codebase..."
(cd takt-formal && lake build)

echo "============================================================"
echo " Bootstrap complete! Environment is ready for verification."
echo " Run ./scripts/verify.sh to execute zero-contact verification."
echo "============================================================"
