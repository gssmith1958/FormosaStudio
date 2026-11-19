#!/usr/bin/env python3
"""
FormosaStudio — Linux Desktop Application Installer
Generates the vector Jade '臺' emblem SVG + multi-resolution PNG icons, builds the
production bundle, installs ~/.local/bin/formosa-studio, registers the GNOME
Applications menu entry (~/.local/share/applications/formosa-studio.desktop),
and places a trusted double-click icon on ~/Desktop/FormosaStudio.desktop.
"""

from __future__ import annotations

import json
import os
import shutil
import stat
import subprocess
import sys
from pathlib import Path

DESKTOP_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = DESKTOP_DIR.parent.parent
SOURCE_DIR = PROJECT_ROOT / "07-Configuration" / "Source"
VECTOR_DATA_PATH = SOURCE_DIR / "src" / "data" / "moeStrokeVectorData.json"
SVG_REPO_PATH = DESKTOP_DIR / "formosa-studio.svg"
SVG_PUBLIC_PATH = SOURCE_DIR / "public" / "icon.svg"
LAUNCHER_SRC = DESKTOP_DIR / "formosa_desktop_app.py"

HOME = Path.home()
LOCAL_BIN = HOME / ".local" / "bin"
LOCAL_APPS = HOME / ".local" / "share" / "applications"
LOCAL_ICONS = HOME / ".local" / "share" / "icons" / "hicolor"
USER_DESKTOP = HOME / "Desktop"


def generate_svg_icon() -> str:
    data = json.loads(VECTOR_DATA_PATH.read_text(encoding="utf-8"))
    tai_strokes = data["臺"]["strokes"]
    path_elements = "\n      ".join(f'<path d="{d}" />' for d in tai_strokes)

    svg = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <!-- Rounded Taiwan Jade App Tile (solid fills for universal SVG/PNG rasterizer fidelity) -->
  <rect x="24" y="24" width="464" height="464" rx="106" fill="#0F766E" />
  <!-- Subtle Deep-Jade Inner Depth & Warm Gold Seal Frame -->
  <rect x="44" y="44" width="424" height="424" rx="86" fill="#0D635C" stroke="#EAB308" stroke-opacity="0.55" stroke-width="5" />

  <!-- Authentic 14-Stroke Traditional Calligraphic '臺' (MakeMeAHanzi Arphic Traditional, Y-up) -->
  <g transform="translate(88, 404) scale(0.328, -0.328)" fill="#FAF7F0">
      {path_elements}
  </g>

  <!-- Traditional Vermilion Artist Seal Accent -->
  <rect x="382" y="378" width="44" height="44" rx="10" fill="#DC2626" />
  <circle cx="404" cy="400" r="9" fill="#FAF7F0" />
</svg>
"""
    SVG_REPO_PATH.write_text(svg, encoding="utf-8")
    SVG_PUBLIC_PATH.parent.mkdir(parents=True, exist_ok=True)
    SVG_PUBLIC_PATH.write_text(svg, encoding="utf-8")
    return svg


def render_png_icons() -> Path:
    scalable_dir = LOCAL_ICONS / "scalable" / "apps"
    scalable_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(SVG_REPO_PATH, scalable_dir / "formosa-studio.svg")

    convert_bin = shutil.which("convert")
    rsvg_bin = shutil.which("rsvg-convert")
    icon_256 = LOCAL_ICONS / "256x256" / "apps" / "formosa-studio.png"
    for size in (48, 64, 128, 256, 512):
        out_dir = LOCAL_ICONS / f"{size}x{size}" / "apps"
        out_dir.mkdir(parents=True, exist_ok=True)
        out_png = out_dir / "formosa-studio.png"
        if rsvg_bin:
            subprocess.run([rsvg_bin, "-w", str(size), "-h", str(size), str(SVG_REPO_PATH), "-o", str(out_png)], check=True)
        elif convert_bin:
            subprocess.run(
                [convert_bin, "-background", "none", "-density", "384", str(SVG_REPO_PATH), "-resize", f"{size}x{size}", str(out_png)],
                check=True,
            )
        else:
            raise RuntimeError("Neither rsvg-convert nor ImageMagick convert is available to render PNG icons.")

    # Save a copy in the repo Desktop folder for reference/preview
    shutil.copy2(icon_256, DESKTOP_DIR / "formosa-studio-256.png")
    return icon_256


def build_production_bundle() -> None:
    print("Building FormosaStudio production bundle...")
    subprocess.run(["npm", "run", "build"], cwd=str(SOURCE_DIR), check=True)


def install_launcher() -> Path:
    LOCAL_BIN.mkdir(parents=True, exist_ok=True)
    os.chmod(LAUNCHER_SRC, os.stat(LAUNCHER_SRC).st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
    target = LOCAL_BIN / "formosa-studio"
    if target.exists() or target.is_symlink():
        target.unlink()
    target.symlink_to(LAUNCHER_SRC)
    return target


def write_desktop_entry(launcher_bin: Path, icon_png: Path) -> tuple[Path, Path | None]:
    desktop_content = f"""[Desktop Entry]
Version=1.0
Type=Application
Name=FormosaStudio
GenericName=Taiwanese Mandarin & Zhuyin Studio
Comment=Offline-first Taiwanese Traditional Chinese (正體字), Zhuyin (注音), Wacom Calligraphy & Tone Pitch Coach
Exec={launcher_bin}
Icon={icon_png}
Terminal=false
StartupNotify=true
StartupWMClass=FormosaStudio
Categories=Education;Languages;
Keywords=Chinese;Mandarin;Taiwan;Zhuyin;Bopomofo;TOCFL;Wacom;Calligraphy;
Actions=Today;Survival;Calligraphy;Speaking;

[Desktop Action Today]
Name=Today & Start From Zero
Exec={launcher_bin} --studio=hub

[Desktop Action Survival]
Name=10-Min Taiwan Survival
Exec={launcher_bin} --studio=survival

[Desktop Action Calligraphy]
Name=Wacom Calligraphy & Strokes
Exec={launcher_bin} --studio=calligraphy

[Desktop Action Speaking]
Name=Live Tone Pitch Coach
Exec={launcher_bin} --studio=speaking
"""
    LOCAL_APPS.mkdir(parents=True, exist_ok=True)
    app_desktop_file = LOCAL_APPS / "formosa-studio.desktop"
    app_desktop_file.write_text(desktop_content, encoding="utf-8")
    os.chmod(app_desktop_file, 0o755)

    desktop_shortcut: Path | None = None
    if USER_DESKTOP.is_dir():
        desktop_shortcut = USER_DESKTOP / "FormosaStudio.desktop"
        desktop_shortcut.write_text(desktop_content, encoding="utf-8")
        os.chmod(desktop_shortcut, 0o755)
        gio = shutil.which("gio")
        if gio:
            subprocess.run([gio, "set", str(desktop_shortcut), "metadata::trusted", "true"], check=False)

    # Refresh desktop database and icon cache
    if shutil.which("update-desktop-database"):
        subprocess.run(["update-desktop-database", str(LOCAL_APPS)], check=False)
    if shutil.which("gtk-update-icon-cache"):
        subprocess.run(["gtk-update-icon-cache", "-f", "-t", str(LOCAL_ICONS)], check=False)

    return app_desktop_file, desktop_shortcut


def main() -> int:
    print("1/4 Generating FormosaStudio Jade '臺' vector & PNG icons...")
    generate_svg_icon()
    icon_png = render_png_icons()
    print(f"    Icons installed to {LOCAL_ICONS} (256px: {icon_png})")

    print("2/4 Building compiled production app bundle (dist/)...")
    build_production_bundle()

    print("3/4 Installing desktop launcher executable (~/.local/bin/formosa-studio)...")
    launcher_bin = install_launcher()

    print("4/4 Registering Applications menu entry & Desktop shortcut...")
    app_entry, desktop_shortcut = write_desktop_entry(launcher_bin, icon_png)
    print(f"    Applications menu: {app_entry}")
    if desktop_shortcut:
        print(f"    Desktop shortcut:  {desktop_shortcut}")
    print("\nFormosaStudio desktop installation complete!")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
