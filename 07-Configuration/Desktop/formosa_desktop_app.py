#!/usr/bin/env python3
"""
FormosaStudio — Native Desktop Application Launcher (Linux / Ubuntu GNOME)
Serves the compiled production bundle (dist/) over a dedicated local loopback origin
(http://127.0.0.1:41755) for permanent localStorage persistence, WebAudio/MediaRecorder
microphone support, zh-TW speechSynthesis, and full Wacom PointerEvent pressure/eraser
support—then launches a clean standalone application window with zero terminal or browser chrome.
"""

from __future__ import annotations

import argparse
import functools
import http.server
import os
import shutil
import socket
import socketserver
import subprocess
import sys
import threading
import time
import urllib.parse
from pathlib import Path

APP_HOST = "127.0.0.1"
APP_PORT = 41755
APP_WM_CLASS = "FormosaStudio"

# Resolve workspace dist/ cleanly even when invoked via symlink or ~/.local/bin wrapper
DEFAULT_PROJECT_ROOT = Path("/home/gssmith/Programming/FormosaStudio")
PROFILE_DIR = Path.home() / ".local" / "share" / "formosa-studio" / "profile"


def find_dist_dir() -> Path:
    env_root = os.environ.get("FORMOSA_STUDIO_ROOT")
    candidates = []
    if env_root:
        candidates.append(Path(env_root) / "07-Configuration" / "Source" / "dist")
    script_parent = Path(__file__).resolve().parent
    candidates.append(script_parent.parent / "Source" / "dist")
    candidates.append(DEFAULT_PROJECT_ROOT / "07-Configuration" / "Source" / "dist")
    for cand in candidates:
        if (cand / "index.html").is_file():
            return cand
    return candidates[-1]


def is_port_open(host: str, port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.35)
        return s.connect_ex((host, port)) == 0


class QuietStaticHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args: object) -> None:  # noqa: A002
        return

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


class ReusableThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    allow_reuse_address = True
    daemon_threads = True


def start_embedded_server(dist_dir: Path) -> ReusableThreadingHTTPServer:
    handler = functools.partial(QuietStaticHandler, directory=str(dist_dir))
    server = ReusableThreadingHTTPServer((APP_HOST, APP_PORT), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server


def find_chromium_binary() -> str | None:
    for binary in (
        "google-chrome",
        "google-chrome-stable",
        "chromium",
        "chromium-browser",
        "brave-browser",
    ):
        found = shutil.which(binary)
        if found:
            return found
    return None


def main() -> int:
    parser = argparse.ArgumentParser(description="Launch FormosaStudio Desktop Application")
    parser.add_argument(
        "--studio",
        choices=["hub", "survival", "reader", "calligraphy", "speaking", "dojo"],
        default=None,
        help="Optional studio to open directly",
    )
    args, _ = parser.parse_known_args()

    dist_dir = find_dist_dir()
    if not (dist_dir / "index.html").is_file():
        source_dir = dist_dir.parent
        if (source_dir / "package.json").is_file():
            subprocess.run(["npm", "run", "build"], cwd=str(source_dir), check=True)
        else:
            sys.stderr.write(f"FormosaStudio production bundle not found at {dist_dir}\n")
            return 1

    server: ReusableThreadingHTTPServer | None = None
    if not is_port_open(APP_HOST, APP_PORT):
        server = start_embedded_server(dist_dir)
        for _ in range(30):
            if is_port_open(APP_HOST, APP_PORT):
                break
            time.sleep(0.05)

    url = f"http://{APP_HOST}:{APP_PORT}/"
    if args.studio:
        url += "?" + urllib.parse.urlencode({"studio": args.studio})

    chromium = find_chromium_binary()
    PROFILE_DIR.mkdir(parents=True, exist_ok=True)

    try:
        if chromium:
            cmd = [
                chromium,
                f"--app={url}",
                f"--user-data-dir={PROFILE_DIR}",
                f"--class={APP_WM_CLASS}",
                "--window-size=1380,880",
                "--no-first-run",
                "--no-default-browser-check",
                "--disable-features=TranslateUI",
            ]
            proc = subprocess.Popen(
                cmd,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            # Keep embedded HTTP server alive cleanly until the app window closes
            if server is not None:
                proc.wait()
        else:
            subprocess.Popen(["xdg-open", url], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if server is not None:
                # Stay alive for fallback browser session
                while True:
                    time.sleep(60)
    finally:
        if server is not None:
            server.shutdown()
            server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
