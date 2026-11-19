# FormosaStudio (`FORM`) `v1.2.0` Release Notes (`FORM-REL-002`)

```yaml
id: FORM-REL-002
type: ValidationOutput
title: FormosaStudio v1.2.0 Release Notes — Warm Paper HMI, Real Hardware Verification & Day-1 Novice Learner Launchpad
status: Approved
version: 1.2.0
project: FORM
owner: Principal Engineer
created_date: 2026-11-19
updated_date: 2026-11-19
framework_reference: "Volume 4 §14, Guide 002 §6, Guide 008 v0.9.1"
traces_to:
  - FORM-PLAN-001
  - FORM-TAILOR-001
  - FORM-DESCHAR-001
  - FORM-LL-001
```

---

## 1. Release Overview (`v1.2.0`)

Following live post-`v1.0.0` testing with real microphone/Wacom hardware and a pedagogical review from a Day-1 native English speaker's perspective, **`v1.2.0`** delivers a comprehensive **HMI redesign**, **real-hardware acoustic & stroke-geometry fixes**, and a full **Day-1 Novice Learner Launchpad (`Stage 0`)**, while capturing two ASEF Framework Improvement Requests (`FORM FIR-002` and `FORM FIR-003`).

---

## 2. Highlights & Delivered Improvements

### A. Warm Paper Light + Calm Dark HMI Redesign (`FORM-DESCHAR-001` v2.0.0)
- Replaced high-density dark neon chrome with a **Warm Paper Light (`#F7F4EE`)** default theme and a **Calm Dark (`#13161A`)** toggle.
- Unified navigation into a **Left Sidebar Rail** (which swaps cleanly to the right side in Left-Handed Wacom mode), with a live **Today's 10-Min Progress Ring** and a **6-Stage Overall Learning Pathway**.
- Fixed horizontal header layout overflow across all studios via clean stacked `StudioHeaderBanner` headers and readable `15–16px` typography.

### B. Real-Hardware Acoustic & Wacom Calligraphy Fixes
- **Live Tone Pitch Coach (`SpeakingPitchStudio.tsx`):** Added real `MediaRecorder` voice capture + real-voice replay (`Audio(recordedAudioUrl)`), automatic `AudioContext.resume()`, 45 ms live YIN $F_0$ capture (`0.004` RMS floor), and a live microphone input meter.
- **Exact Offline Stroke Geometry (`moeStrokeVectorData.json`):** Replaced hand-estimated stroke vectors with exact offline Traditional Chinese SVG brushstroke polygons and multi-point centerlines (`AnimCJK ZhHant` + `MakeMeAHanzi`) for all 20 Wacom characters (`Path2D` silhouettes + active stroke highlight + exact `Demo Next MOE Stroke`).
- **Easy-First Ordering:** Reordered the Wacom character bank so 2–5 stroke fundamentals (`人, 大, 日, 中, 木, 水, 心, 永`) appear first for Stage 0/1 learners.

### C. Day-1 Novice Learner Pedagogy (`Stage 0` & Interactive Lessons — `FORM-LL-009`)
- **Stage 0: Start From Zero (`Stage0BeginnerLaunchpad.tsx`, `BasicStrokePracticePad.tsx`, `stage0BeginnerData.ts`):**
  - **0.1 Tone Ear Boot Camp:** Plain-English pitch analogies, 2 Day-1 spoken sandhi rules (`你好`, `不`), and an 8-item audio-only tone ear quiz (Normal + Slow `0.65×`).
  - **0.2 Zhuyin (`ㄅㄆㄇㄈ`) Sound Map & Family-Linked Syllable Blender:** All 37 Zhuyin symbols in 6 families with intuitive English sound cues (`ㄅ` → `b in "Boy"`, `ㄉ` → `d in "Dog"`, `ㄍ` → `g in "Go"`) and a dynamic Syllable Blender tailored to each selected Zhuyin family.
  - **0.3 English → Mandarin Grammar Survival Map:** 5 high-leverage word-order rules plus an interactive Tap-the-Tiles Sentence Builder.
  - **0.4 Basic Strokes & Character Logic 101:** Interactive **8-Stroke Practice Pad** (animated `Start → arrow` guide + live direction grading for mouse/touch/Wacom), 6 stroke-order rules, 1-click Wacom starter links, 5-radical building-block legend, and an instructive Radical Logic Check revealing `<RubyText>` + Zhuyin + Pinyin + audio + family examples.
  - **0.5 First 10 Taipei Survival Phrases & Mini Café Roleplay.**
- **Tone-Marked Hanyu Pinyin Training Wheels (`zhuyinTypes.ts`):** Added a standards-compliant Zhuyin → tone-marked Hanyu Pinyin converter (`duì`, `bù`, `qǐ`, `wǒ`, `zhōng`, `lǜ`, etc.), defaulting to `Pinyin: ON` with a 1-click sidebar toggle.
- **Interactive Taiwanized Pimsleur & NTNU Lessons (`CurriculumExplorers.tsx`):** Replaced all Mainland terms (`普通話` → `中文`, `一點兒` → `一點`, `人民幣` → `臺幣`) across Units 1–19 (`0` Mainland leakage), added a **4-Second Timed Anticipation Recall Drill** with Hide-Text + Normal/Slow audio, and added Quick Lesson Checks + Add All to FSRS Queue for NTNU lessons.
- **Practical Day-1 Taiwan Survival (`taiwanSurvivalData.ts`, `TaiwanSurvivalStudio.tsx`):** Rebuilt the 6 Survival Modules around real Day-1 needs—**1. Bathrooms & Asking for Help (`請問洗手間在哪裡？`)**, **2. Prices & Paying (`請問這個多少錢？`)**, **3. Directions, MRT & Taxis (`請問去…怎麼走？`)**, **4. Food, Night Markets & Boba**, **5. 7-Eleven, Hotels & Door Signs**, and **6. Allergies, Pharmacy, Clinic & Emergency Numbers (`110 / 119 / 1990`)**.

### D. ASEF Empirical Validation & Process Feedback
- Logged `FORM-LL-008` / `FORM FIR-002` (live browser screenshot visual verification in `Guide 008`) and `FORM-LL-009` / `FORM FIR-003` (`Touchpoint 0` pre-baseline domain challenge, cold-start novice journey, and anti-tautology test rules) in `05-Knowledge/FORM-LL-001_Lessons_Learned_and_FIR_Register.md`.

---

## 3. Verification Evidence
- `npm test`: **41 / 41 PASS** (including Stage 0, exact tone-marked Hanyu Pinyin, family-matched Syllable Blends, zero Mainland leakage, and Day-1 Taiwan Survival checks).
- `npm run build`: **PASS** (`tsc -b && vite build`, 0 errors).
- `python3 08-Automation/check_structural_scaffolding.py`: **PASS** (`0` errors, `0` warnings; all source files `<= 600` LOC).
- `python3 08-Automation/sync_traceability_graph.py --check`: **PASS**.
- `python3 08-Automation/test_governance_adversarial.py`: **6 / 6 OK**.
- Live browser visual verification (`http://localhost:5175/`): **0 console errors**.
