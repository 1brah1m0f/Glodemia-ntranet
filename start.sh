#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  glodemia_runtime="${XDG_DATA_HOME:-$HOME/.local/share}/glodemia-node/bin"
  if [[ -x "$glodemia_runtime/node" ]]; then
    export PATH="$glodemia_runtime:$PATH"
  else
    echo "Node.js 22.12+ is required. Install Node, then run npm install and npm run dev."
    exit 1
  fi
fi
if [[ ! -d node_modules ]]; then npm ci; fi
exec npm run dev -- --port 5173 "$@"
