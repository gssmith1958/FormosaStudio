# Architecture Description, Live Environment Capability Audit & Architecture Decisions (`FORM-ARCH-001`)

```yaml
id: FORM-ARCH-001
type: ArchitectureDescription
title: FormosaStudio Modular TypeScript/React/DSP/Wacom Architecture & Live Environment Register
status: Approved
version: 1.0.0
project: FORM
owner: Principal Engineer
created_date: 2026-11-13
updated_date: 2026-11-13
framework_reference: "Volume 4 §8, Volume 4 §10, Guide 007 §2, Guide 007 §3.5, Guide 007 §6"
traces_to:
  - FORM-TAILOR-001
  - FORM-REQ-0001
  - FORM-REQ-0005
  - FORM-REQ-0012
  - FORM-REQ-0015
```

---

## 1. Live Environment & Technology Capability Audit (`Guide 007 §2`)

Confirmed live on host (`2026-11-13`) prior to locking `Gate 2/3/4/5`:

| Component | Live Verified Version | License | Empirical Capability & Quirks Recorded |
| :--- | :--- | :--- | :--- |
| **Node.js Runtime** | `v22.22.1` | MIT | Includes native `node --test` test runner and `--experimental-strip-types` / TypeScript compilation support without needing external Jest/Vitest downloads. |
| **npm Package Manager** | `9.2.0` | Artistic-2.0 | Local `node_modules` from `Chinese2` contains `react 18.3.1`, `react-dom 18.3.1`, `lucide-react 0.454.0`, `canvas-confetti 1.9.3`, `typescript 5.6.2`, `vite 5.4.10`, and `tailwindcss 3.4.14`. |
| **Python 3 (Governance)** | `Python 3.14.4` + `SQLite 3.46.1` | PSF / Public Domain | Runs `08-Automation/*.py` with zero external packages. |
| **W3C `PointerEvent` (Wacom)** | Browser Standard (`Chromium` / `Firefox` on Linux) | W3C | Exposes `pointerType` (`'pen' \| 'mouse' \| 'touch'`), `pressure` (`0.0..1.0`, defaults to `0.5` for active mouse button and `0.0..1.0` for Wacom nib), `tiltX`/`tiltY`, `buttons === 32` / `button === 5` (Wacom eraser nib), and `getCoalescedEvents()` for high-rate (`133–200 Hz`) pen path smoothing. Requires CSS `touch-action: none` on the `<canvas>` to prevent browser scroll hijacking during Wacom strokes. |
| **Web Audio API (`AudioContext`)** | Browser Standard | W3C | `AnalyserNode.getFloatTimeDomainData(Float32Array)` provides raw PCM frames at `44,100` or `48,000 Hz`. Works 100% offline for time-domain $F_0$ pitch extraction (unlike `webkitSpeechRecognition`). |

---

## 2. Modular Package & Directory Architecture (`<= 800` LOC Hard Ceiling)

To remediate the 8 monolithic files (`1,003–1,689` LOC) in `Chinese2`, `07-Configuration/Source/src/` is organized into bounded modules where **no file may exceed `600` LOC (soft warning) or `800` LOC (hard mechanical block)**:

```text
07-Configuration/Source/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── src/
│   ├── lib/
│   │   ├── zhuyinTypes.ts          # Core Zhuyin symbols, tones, DaQian key maps
│   │   ├── polyphoneLexicon.ts     # Word-level 破音字 & Taiwan MOE 兩岸異讀字 dictionary
│   │   ├── zhuyinTokenizer.ts      # Forward Maximum-Matching (FMM) tokenizer & sandhi engine
│   │   ├── pitchTracker.ts         # Offline WebAudio autocorrelation/YIN F0 pitch extractor & Chao scorer
│   │   ├── wacomStrokeEngine.ts    # PointerEvent Wacom pressure curve smoother & Taiwan MOE stroke grader
│   │   ├── progressStore.ts        # FSRS-lite scheduler + JSON export/import validation
│   │   └── audioService.ts         # zh-TW TTS + WebAudio tone synthesizer & voice recorder
│   ├── data/
│   │   ├── pimsleurUnitsA.ts       # Pimsleur Mandarin I Units 1–10
│   │   ├── pimsleurUnitsB.ts       # Pimsleur Mandarin I Units 11–19
│   │   ├── contemporaryVols1to2.ts # Contemporary Chinese Vols. 1–2 complete lessons
│   │   ├── contemporaryVols3to6.ts # Contemporary Chinese Vols. 3–6 complete lessons
│   │   ├── vocabularyCatalog.ts    # Unified TOCFL Novice 1 – Band B2 catalog builder
│   │   ├── gradedReaderData.ts     # TOCFL A1–B2 Taiwan graded stories + 口語/書面語 register pairs
│   │   ├── taiwanTenMinData.ts     # "Taiwan in 10 Minutes a Day" sticky labels, 點菜單 menus, 語助詞, 臺語
│   │   ├── strokeOrderData.ts      # Taiwan MOE standard stroke vectors & 形聲字 radical-phonetic families
│   │   └── curriculumWorlds.ts     # 5-World skill tree node definitions
│   ├── components/
│   │   ├── WacomCalligraphyTab.tsx # Wacom Stylus MOE Stroke-Order & 形聲字 Studio
│   │   ├── TaiwanTenMinTab.tsx     # "Taiwan in 10 Minutes a Day" Survival, 點菜單 & Listening Gym
│   │   ├── GrammarAndReadingTab.tsx# Adaptive i+1 Graded Reader, Custom Text Studio & Register Bridge
│   │   ├── SpeakingStudioTab.tsx   # Offline WebAudio F0 Pitch-Contour Visualizer & Pronunciation Coach
│   │   ├── VocabularyWorkbenchTab.tsx # Modularized Vocab Explorer, Flashcards, Cloze & Collocations
│   │   └── ...                     # Preserved & modularized Typing Dojo, Match Arena, Today Hub, etc.
│   └── tests/                      # Automated verification test suite (FORM-REQ-0001..0020)
```

---

## 3. Architecture Decisions (`Volume 4 §10` & `Guide 007 §3.5`)

```yaml
id: FORM-DEC-001
type: ArchitectureDecision
title: Forward Maximum-Matching (FMM) Word Tokenizer Before Character Fallback for Polyphone Disambiguation
status: Approved
version: 1.0.0
problem_statement: "Character-by-character lookup in Chinese2 mis-annotates polyphones (破音字) like 長大 (ㄓㄤˇ), 還錢 (ㄏㄨㄢˊ), 銀行 (ㄏㄤˊ), and conjunctive 和 (Taiwan ㄏㄢˋ)."
alternatives_considered:
  - "Option A: Character-by-character lookup (status quo in Chinese2 — fails on all polyphones)."
  - "Option B: External cloud NLP segmentation API (breaks offline local-first architecture)."
  - "Option C (Selected): Deterministic client-side Forward Maximum-Matching (FMM, max word length 6) backed by a curated Taiwan MOE word/polyphone lexicon + context rules for 和/得/著/了."
rationale: "Option C executes in < 5 ms for 2,000-character passages, requires zero external dependencies, and is 100% deterministic for automated testing."
traces_to:
  - FORM-REQ-0001
  - FORM-REQ-0002
```

```yaml
id: FORM-DEC-002
type: ArchitectureDecision
title: Offline Time-Domain Autocorrelation / YIN Pitch Tracking Over Cloud SpeechRecognition
status: Approved
version: 1.0.0
problem_statement: "window.webkitSpeechRecognition fails offline and on Linux browsers and ignores Mandarin pitch contours."
alternatives_considered:
  - "Option A: Rely on webkitSpeechRecognition with manual self-grade fallback (Chinese2 status quo)."
  - "Option B (Selected): Implement a pure TypeScript time-domain normalized autocorrelation / YIN fundamental frequency (F0) pitch detector operating on Float32Array PCM buffers, converting Hz to speaker-normalized log-semitone Chao 1–5 tone curves."
rationale: "Option B works 100% offline in every browser with microphone access, can be deterministically unit-tested against synthetic sine/harmonic tone waves, and teaches genuine Mandarin pitch contour control."
traces_to:
  - FORM-REQ-0015
  - FORM-REQ-0016
```

```yaml
id: FORM-DEC-003
type: ArchitectureDecision
title: Native W3C PointerEvent Engine with Coalesced Sampling and Vector Stroke Grading for Wacom Stylus
status: Approved
version: 1.0.0
problem_statement: "The user has a Wacom tablet attached to the Linux workstation; mouse-event canvases lose stylus pressure, eraser nib events, and high-frequency sampling."
alternatives_considered:
  - "Option A: Standard mouse/touch events with uniform line width."
  - "Option B (Selected): W3C PointerEvent listener reading e.pointerType, e.pressure, e.tiltX/Y, e.buttons===32 (eraser), and e.getCoalescedEvents(), paired with a normalized 0..100 bounding-box vector stroke grader against Taiwan MOE stroke median paths."
rationale: "Option B delivers native Wacom calligraphy responsiveness, hardware eraser support, and objective stroke-order verification."
traces_to:
  - FORM-REQ-0012
  - FORM-REQ-0013
```
