# FormosaStudio (`FORM`) — Comprehensive User's Manual & Reference Guide (`FORM-MAN-001`)

```yaml
id: FORM-MAN-001
type: ValidationOutput
title: FormosaStudio v2.0.0 Comprehensive User's Manual & Taiwan MOE Linguistic Reference Guide
status: Approved
version: 2.0.0
project: FORM
owner: Principal Engineer
created_date: 2026-11-14
updated_date: 2026-11-25
framework_reference: "Volume 4 §11.6, Volume 4 §14, Guide 007 §12, Guide 008 v0.9.4, FORM-REQ-0023"
traces_to:
  - FORM-REQ-0023
  - FORM-REQ-0018
  - FORM-REQ-0021
  - FORM-REQ-0022
```

---

## 1. Quick-Start & v2.0 5-Section Expandable Accordion Navigation

**FormosaStudio (`寶島華語正體與注音全能工坊`)** is an offline-first, Wacom/Apple Pencil and acoustic-DSP workstation designed specifically for mastering **Taiwanese Traditional Chinese (`正體字`)** and **Taiwan Ministry of Education (`教育部`) vertical Bopomofo (`注音符號`)** from **Pre-A1 Foundations through TOCFL Level 4 / CEFR B2 (Classic HSK 5 Equivalent)**.

### 1.1 The 5 Top-Level Menu Sections (`Alt+1` through `Alt+5`)

Every tool in FormosaStudio v2.0 is organized inside a modern **5-Section Expandable Accordion Menu** (which auto-collapses on iPad mini 6 `<= 1180 px` when entering calligraphy or tone labs and is always reopenable via `☰ Menu`):

| Shortcut | Menu Section | Core Capabilities |
| :---: | :--- | :--- |
| **`Alt+1`** | **1. Today’s Session (`今日學習`)** | **Syllabus-Adaptive 10-Minute Daily Session** dynamically tuned to your active stage (`~70%` current stage + `~30%` spiral review), contextual **Peek Ahead**, and genuine Step 2 audio/recall + Step 3 DaQian/Wacom verification before FSRS credit. |
| **`Alt+2`** | **2. Course Syllabus (`課程大綱`)** | Expandable linear progression across **Stages 0–5 (`Pre-A1 → TOCFL Level 4 / Band B2 / Classic HSK 5 Equiv.`)**. **Stage 0** delivers Tone Lab, 37 Zhuyin, Grammar, 8 Basic Strokes, and **5 Real-Life Taiwan Arrival Scenarios** (*Taipei Café, 7-Eleven, MRT, Night Market, Restroom/Help*). **Stages 1–5** use a single **`Continue Recommended Next`** CTA, expandable Pimsleur/NTNU/Survival/Custom tracks, and an integrated 5-question **Stage Checkpoint (`>= 80%`)**. |
| **`Alt+3`** | **3. Practice Labs (`專項練習室`)** | Expandable quick access to all 5 specialized labs: **Taiwan Survival** (Tick-Menu `點菜單`, Particles/Hokkien, Listening Gym), **Reader & Grammar** (Adaptive `i+1` Stories & Register Bridge), **Wacom Strokes** (MOE Calligraphy & `形聲字`), **Speaking & Pitch** (Offline YIN F0 & Sandhi), and **Vocab & DaQian** (8-Stage Typing Dojo, FSRS Queue, Word Bank, Shuffled Match Arena). |
| **`Alt+4`** | **4. Reference & Help (`參考與手冊`)** | **Global Omnibar (`Ctrl+K`)**, live **Word Inspector Dock**, and this **User's Manual (`?`)**. |
| **`Alt+5`** | **5. Administration (`系統與教材管理`)** | Standalone workspace for **Create/Edit/Delete Custom Lesson Packs** (Pimsleur, NTNU, or Custom Scenarios bound to Stages 0–5), **1-Click Audio, Voice & iPad Self-Test**, **Unified Desktop ↔ iPad JSON Backup & Transfer** (bundling progress + custom packs), and **Preferences & Hardware**. |

### 1.2 Global Keyboard Shortcuts & Cross-Studio Navigation

- **`Ctrl+K` (or `Cmd+K`):** Opens the **Global Omnibar** from anywhere to search Traditional Hanzi, Zhuyin (`ㄅㄆㄇ`), Pinyin, English glosses, Polyphones (`破音字`), or MOE Stroke Characters.
- **`?` or `F1`:** Opens the **In-App Interactive Help & Manual Drawer**.
- **`Esc`:** Closes any open modal or drawer.
- **Cross-Studio Deep-Link Pills & Return Breadcrumb:** Clicking **`✒️ Write on Wacom`**, **`🎤 Coach Pitch (F0)`**, **`📖 Open in Reader`**, or **`🧠 Boost in FSRS`** on any word immediately jumps to that studio with the target pre-loaded and displays a green **`← Return to [Origin Studio]`** breadcrumb bar at the top of the screen.

---

## 2. Recommended Daily 10-Minute Study Workflow

1. **Minutes 0–3 (Step 1 — FSRS & Polyphone Warmup):**
   - In **Studio 1 (`Alt+1`)**, review your due FSRS cards in the **Inline 10-Minute Daily Flow Runner**. Rate each card (`1 Again`, `2 Hard`, `3 Good`, `4 Easy`) to update its Stability ($S$) and Difficulty ($D$).
2. **Minutes 3–7 (Step 2 — Pimsleur & Taiwan Survival Shadowing):**
   - Listen to the daily Pimsleur or Taiwan Survival prompt, shadow it aloud, and click **`🎤 Open in F0 Pitch Lab`** if you want to inspect your pitch contour on the Chao `1–5` graph.
3. **Minutes 7–10 (Step 3 — Taiwan MOE Stroke & DaQian Keystroke Reflex):**
   - Review the daily Taiwan MOE character (`裡, 為, 骨, 黃, 臺, 灣, 麵, 捷, 運, 請, 謝`), trace it on the Wacom `九宮格` canvas (`Alt+4`), or type its DaQian keysequence in the Dojo (`Alt+6`).

---

## 3. Linux Wacom Stylus & Offline WebAudio $F_0$ Calibration Guide

### 3.1 Wacom Tablet Configuration on Linux (X11 / Wayland)
- **Stylus Pressure & Coalesced Sampling:** Studio 4 (`Alt+4`) automatically reads `PointerEvent.pressure` (`0.0–1.0`) and `event.getCoalescedEvents()` to render smooth 200 Hz calligraphy strokes from `2.5 px` (hairline tip) to `14.0 px` (full press).
- **Wacom Eraser Nib & Barrel Button Undo:** Flipping your Wacom pen to the **eraser nib** (`pointerType === 'eraser'` or `buttons === 32`) or pressing the **upper barrel button** (`button === 5`) on the canvas automatically undoes the most recent stroke.
- **Pen-Only Palm Rejection (`🛡️ Pen-Only Palm Rejection: ON`):** Toggle this button in Studio 4's header banner to ignore capacitive finger/palm touches (`pointerType === 'touch'`) while resting your hand on a touch+EMR display.
- **Left-Handed vs. Right-Handed Toolbar Docking (`✋ Right-Handed / Left-Handed Dock`):** Click this toggle in the global header or Studio 4 banner to swap the horizontal layout (`Canvas Left / Controls Right` vs. `Controls Left / Canvas Right`) and mirror the collapsible Side Context Dock so your drawing arm never covers action buttons.
- **Linux Driver Verification:** On X11, verify tablet detection with `xsetwacom --list devices`; on Wayland, confirm `libinput list-devices` lists the Wacom Pen stylus.

### 3.2 Offline WebAudio YIN $F_0$ Microphone Calibration (`Studio 5 · Alt+5`)
- **100% Offline Processing:** Pitch detection runs entirely inside your local browser via time-domain YIN Cumulative Mean Normalized Difference Function (`CMNDF`) with 3-point parabolic lag interpolation (`75–450 Hz`, `< 3.0 Hz` error). Zero audio ever leaves your machine.
- **Browser Secure-Context Requirement:** Linux Chromium/Firefox browsers require serving FormosaStudio from `http://localhost` (e.g. `npm run dev` / `npm run preview`) or `https://` to unlock `navigator.mediaDevices.getUserMedia({ audio: true })`.
- **Voice Range Calibration:**
  - Click **`🎙️ Low Voice (95–220 Hz)`** for typical baritone/tenor/low vocal ranges.
  - Click **`🎙️ High Voice (145–330 Hz)`** for typical alto/soprano/high vocal ranges.
- **Self-Monitoring Loop:** After recording, click **`🔁 Replay My Voice vs. Native Speaker`** to hear your captured audio immediately followed by the native reference contour.

---

## 4. Taiwan Ministry of Education (`教育部國語`) Linguistic Reference

### 4.1 Cross-Strait Standard Pronunciations (`兩岸異讀字`)

FormosaStudio strictly enforces authentic **Taiwan MOE (`教育部重編國語辭典修訂本`)** pronunciations:

| Traditional Word | Taiwan MOE Zhuyin | Taiwan Pinyin | Mainland Pinyin | Meaning & Taiwan Usage Note |
| :--- | :--- | :--- | :--- | :--- |
| **垃圾** | `ㄌㄜˋ ㄙㄜˋ` | `lèsè` | `lājī` | Trash / garbage (`垃圾車 ㄌㄜˋ ㄙㄜˋ ㄔㄜ`, `倒垃圾`) |
| **星期** | `ㄒㄧㄥ ㄑㄧˊ` | `xīngqí` | `xīngqī` | Week (`期` is Rising Tone 2 `ㄑㄧˊ` in Taiwan) |
| **研究** | `ㄧㄢˊ ㄐㄧㄡˋ` | `yánjiù` | `yánjiū` | Research (`究` is Falling Tone 4 `ㄐㄧㄡˋ` in Taiwan) |
| **企業** | `ㄑㄧˋ ㄧㄝˋ` | `qìyè` | `qǐyè` | Enterprise (`企` is Falling Tone 4 `ㄑㄧˋ` in Taiwan) |
| **法國** | `ㄈㄚˋ ㄍㄨㄛˊ` | `Fàguó` | `Fǎguó` | France (`法` in `法國/法文` is Tone 4 `ㄈㄚˋ` in Taiwan MOE) |
| **液體** | `ㄧㄝˋ ㄊㄧˇ` | `yètǐ` | `yètǐ / yìtǐ` | Liquid (`液` is strictly `ㄧㄝˋ` in Taiwan MOE) |
| **微糖** | `ㄨㄟˊ ㄊㄤˊ` | `wéitáng` | `wēitáng` | 30% sugar (`微` is Rising Tone 2 `ㄨㄟˊ` in Taiwan) |
| **和 (連詞)** | `ㄏㄢˋ` | `hàn` | `hé` | "And / with" (`我和你 ㄨㄛˇ ㄏㄢˋ ㄋㄧˇ` in everyday Taiwan speech) |
| **角色** | `ㄐㄧㄠˇ ㄙㄜˋ` | `jiǎosè` | `juésè` | Role / character (`角` is `ㄐㄧㄠˇ` in Taiwan MOE) |
| **蝸牛** | `ㄍㄨㄚ ㄋㄧㄡˊ` | `guāniú` | `wōniú` | Snail (`蝸` is `ㄍㄨㄚ` in Taiwan MOE) |
| **危險** | `ㄨㄟˊ ㄒㄧㄢˇ` | `wéixiǎn` | `wēixiǎn` | Dangerous (`危` is Rising Tone 2 `ㄨㄟˊ` in Taiwan) |
| **知識** | `ㄓ ㄕˋ` | `zhīshì` | `zhīshi` | Knowledge (`識` retains full Tone 4 `ㄕˋ` in Taiwan) |

### 4.2 Spoken Taiwanese Tone Sandhi Rules (`連讀變調`)
1. **Two Consecutive 3rd Tones (`3 + 3 → 2 + 3`):** `你好 (ㄋㄧˇ ㄏㄠˇ)` is spoken as **`ㄋㄧˊ ㄏㄠˇ`**, where the final `好` is realized as a natural Taiwanese **low-dipping half-third (`半上 [21]`)** rather than rising all the way to `[214]`.
2. **Three Consecutive 3rd Tones (`3 + 3 + 3 → 2 + 2 + 3`):** `展覽館 (ㄓㄢˇ ㄌㄢˇ ㄍㄨㄢˇ)` is spoken as **`ㄓㄢˊ ㄌㄢˊ ㄍㄨㄢˇ`**.
3. **`不` (`ㄅㄨˋ`) Sandhi:** Shifts to Rising Tone 2 (**`ㄅㄨˊ`**) before a 4th-tone syllable (`不要 → ㄅㄨˊ ㄧㄠˋ`, `不錯 → ㄅㄨˊ ㄘㄨㄛˋ`), remaining `ㄅㄨˋ` before Tones 1, 2, and 3 (`不好意思 → ㄅㄨˋ ㄏㄠˇ ㄧˋ ˙ㄙ`).
4. **`一` (`ㄧ`) Sandhi:** Shifts to Rising Tone 2 (**`ㄧˊ`**) before Tone 4 (`一個 → ㄧˊ ˙ㄍㄜ`, `一樣 → ㄧˊ ㄧㄤˋ`), shifts to Falling Tone 4 (**`ㄧˋ`**) before Tones 1, 2, and 3 (`一天 → ㄧˋ ㄊㄧㄢ`, `一杯 → ㄧˋ ㄅㄟ`), and stays High Flat **`ㄧ`** in ordinals/numbers (`第一 → ㄉㄧˋ ㄧ`).

### 4.3 Taiwan DaQian (`大千式`) Standard Keyboard Map

Every syllable is typed in strict order: **`Initial (聲母) → Medial (介音 ㄧ/ㄨ/ㄩ) → Rhyme (韻母) → Tone Key`**:
- **Tone Keys:** **`Space` = Tone 1 (`ˉ`)**, **`6` = Tone 2 (`ˊ`)**, **`3` = Tone 3 (`ˇ`)**, **`4` = Tone 4 (`ˋ`)**, **`7` = Neutral Tone (`˙`)**.
- **Left-Hand Initials:** `1/Q/A/Z` (`ㄅㄆㄇㄈ`), `2/W/S/X` (`ㄉㄊㄋㄌ`), `E/D/C` (`ㄍㄎㄏ`), `R/F/V` (`ㄐㄑㄒ`), `5/T/G/B` (`ㄓㄔㄕㄖ`).
- **Right-Hand Initials & Medials:** `Y/H/N` (`ㄗㄘㄙ`), `U/J/M` (`ㄧㄨㄩ`).
- **Right-Hand Rhymes:** `8/I/K/,` (`ㄚㄛㄜㄝ`), `9/O/L/.` (`ㄞㄟㄠㄡ`), `0` / `P` / `;` / `/` (`ㄢㄣㄤㄥ`), `-` (`ㄦ`).

---

## 5. Adding Custom Pimsleur & NTNU Materials (`⚙️ Resource Admin`)

Click **`⚙️ Resource Admin`** in the top header to open the **3-Step Guided Curriculum Importer**:
1. **Step 1 (Select Source & Upload/Paste):**
   - Choose **`🎧 Pimsleur Unit Pack`** (e.g., Units 20–30, Levels II–V) or **`📘 NTNU Contemporary Lesson`** (Volumes 1–6 supplemental lessons & workbooks).
   - Upload a `.docx`, `.txt`, `.csv`, or `.json` file, or paste pipe-delimited lines:
     ```text
     銀行 | bank | ㄧㄣˊ ㄏㄤˊ | vocab
     還錢 | repay money | ㄏㄨㄢˊ ㄑㄧㄢˊ | vocab
     請問銀行在哪裡？我去銀行還錢。 | Excuse me, where is the bank? I am going to the bank to repay money. | | dialogue
     ```
2. **Step 2 (Taiwan MOE Zhuyin & Polyphone Preview/Edit):**
   - Any line with blank Zhuyin is **automatically segmented and annotated** by the Taiwan MOE Forward Maximum-Matching (`FMM`) polyphone tokenizer (`銀行 -> ㄧㄣˊ ㄏㄤˊ`, `還錢 -> ㄏㄨㄢˊ ㄑㄧㄢˊ`). You can fine-tune any reading interactively before publishing.
3. **Step 3 (Publish & Export Portable JSON Packs):**
   - Click **`✓ Publish to All 6 Studios`** to propagate your new unit/lesson live across all 6 studios (`Today & Curriculum Hub`, `TOCFL Word Bank`, `FSRS Queue`, `Adaptive i+1 Reader`, `Speaking Lab`, and `DaQian Dojo`).

---

## 6. FSRS-Lite Progress Backup & Restore (`Studio 6 · Alt+6`)

In **Studio 6 (`詞彙與大千`) → `FSRS 智慧記憶複習`**, click **`📤 Export Progress JSON`** to download a schema-validated (`formosa-progress-v2`) JSON snapshot containing your XP, Streak, Stage 0 completion state, FSRS character/word/stroke Stability ($S$) and Difficulty ($D$) records, Wacom handedness, and Skill Tree crowns, or click **`📥 Restore JSON File`** to import a saved backup file.

---

## 7. Installing & Running FormosaStudio on Linux Desktop & iPad (GitHub Pages PWA)

FormosaStudio runs as both a **native-feeling Linux Desktop Application** (with zero terminal windows) and an **installable iPad / iPhone Web App (PWA)** hosted over HTTPS on GitHub Pages.

### 7.1 Linux Desktop Application (Ubuntu GNOME / Freedesktop)
- **Launching:** Click the **Taiwan Jade `臺` FormosaStudio** icon on your Desktop (`~/Desktop/FormosaStudio.desktop`) or press `Super`, search **FormosaStudio**, and optionally right-click → **Pin to Dash**.
- **Right-Click Quick-Launch Actions:** Right-clicking the GNOME dock/app icon lets you jump directly into *Today & Start From Zero*, *10-Min Taiwan Survival*, *Wacom Calligraphy & Strokes*, or *Live Tone Pitch Coach*.
- **How It Works Under the Hood:**
  - The launcher (`07-Configuration/Desktop/formosa_desktop_app.py`, symlinked at `~/.local/bin/formosa-studio`) serves the compiled production bundle (`07-Configuration/Source/dist/`) on a dedicated private loopback port (`http://127.0.0.1:41755`) so it never conflicts with other local apps (such as `localhost:5173`).
  - It opens in a clean standalone app window (`StartupWMClass=FormosaStudio`) with its own isolated profile (`~/.local/share/formosa-studio/profile`) so microphone permissions, `zh-TW` voices, Wacom pressure/eraser, and FSRS progress persist automatically.
  - Closing the FormosaStudio window automatically shuts down the embedded local HTTP server—no stray background processes remain.
- **Reinstalling or Updating After Local Code Edits:**
  ```bash
  python3 07-Configuration/Desktop/install_desktop_app.py
  ```
  This regenerates the Jade `臺` SVG/PNG icons, rebuilds `dist/`, and refreshes the GNOME application entry and Desktop shortcut.

### 7.2 iPad & iPhone Installation via GitHub Pages (Anywhere Access + Offline PWA)
- **Live HTTPS URL:** **https://gssmith1958.github.io/FormosaStudio/**
- **Install on Your iPad Home Screen (3 Taps):**
  1. Open **Safari** on your iPad (or iPhone) and navigate to **https://gssmith1958.github.io/FormosaStudio/**.
  2. Tap the **Share** button (square with upward arrow) in Safari's toolbar.
  3. Tap **Add to Home Screen** → **Add**.
- **Full Native iPad Capabilities:**
  - Opens full-screen with the **Taiwan Jade `臺`** Home-Screen icon (`apple-touch-icon.png`).
  - **Apple Pencil:** Full pressure-sensitive drawing on **Wacom Calligraphy & Strokes (`Alt+4`)** and the **Stage 0 8-Stroke Practice Pad**.
  - **Microphone:** Trusted HTTPS unlocks iPad microphone recording & real-voice replay in **Speaking & Pitch Lab (`Alt+5`)**.
  - **Taiwanese Audio:** Uses iPadOS's built-in `zh-TW` voices (such as *Meijia*).
  - **Offline Caching:** Once loaded online, the built-in Service Worker (`sw.js`) caches the app so you can keep studying on flights or the Taipei MRT with no internet connection.
- **Automatic Cloud Updates:** Every push to `main` automatically runs the 41-test verification suite, builds `dist/`, and deploys the updated app to GitHub Pages via `.github/workflows/deploy-pages.yml` (requires the repository to remain Public on GitHub's Free plan).

### 7.3 Moving Progress Between Desktop & iPad
Your study progress stays **100% private** on each device's local storage (`localStorage`)—nothing personal is ever uploaded to GitHub. To copy progress between your Ubuntu Desktop and your iPad:
1. On the source device, open **Studio 6 (`Vocab & DaQian`) → `FSRS 智慧記憶複習`** and tap **`📤 Export Progress JSON`** (save to iCloud Drive, email, or USB).
2. On the target device, open the same screen and tap **`📥 Restore JSON File`** to load your saved snapshot.
