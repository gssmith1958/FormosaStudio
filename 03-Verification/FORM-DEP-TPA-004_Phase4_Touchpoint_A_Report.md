---
id: FORM-DEP-TPA-004
type: VerificationReport
title: FormosaStudio — Phase 4 Domain Expert Panel Touchpoint A Design Review Report
status: Approved
version: 1.0.0
created: 2026-11-14
owner: GSS
parent_ids:
  - FORM-BOE-004
  - FORM-REQ-0018
  - FORM-REQ-0019
  - FORM-REQ-0020
  - FORM-REQ-0021
  - FORM-REQ-0022
  - FORM-REQ-0023
  - FORM-VER-001
  - FORM-DEP-UX-001
---

# FormosaStudio (`FORM`) — Phase 4 Touchpoint A Design Review Report (`FORM-DEP-TPA-004`)

- **Review Type:** Pre-Implementation Domain Expert Panel Design Review (`Touchpoint A` — `Pattern 13`, `Pattern 17`, `Pattern 20`, & `Pattern 21`)
- **Triggered Panel Members (All 4 Roles Active):**
  - **`DEP-01`:** Taiwanese Mandarin & TOCFL Computational Linguist
  - **`DEP-02`:** Acoustic DSP & Wacom Stylus Hardware Engineer
  - **`DEP-03`:** SLA & "Taiwan in 10 Minutes a Day" Survival Pedagogist
  - **`DEP-04`:** UI/UX & Accessibility Designer (**Mandatory Standing Co-Lead** per `FORM-LL-007` & `FORM-DEP-UX-001`)

---

## 1. `DEP-01` Linguistic & Orthographic Pre-Implementation Requirements

1. **Studio 1 Curriculum Explorer (`TodayAndCurriculumHub.tsx`) (`FORM-REQ-0003`, `FORM-REQ-0022`):**
   - Must dynamically merge Pimsleur Units 1–19 + Custom Admin Pimsleur Units (`getCustomPimsleurUnits()`) and NTNU *A Course in Contemporary Chinese* Volumes 1–6 (61 Lessons) + Custom Admin Lessons (`mergeCustomContemporaryVolumes()`).
   - Must display a live **TOCFL Readiness Breakdown** across `Novice 1`, `Novice 2`, `Level 1 (Band A1)`, `Level 2 (Band A2)`, `Level 3 (Band B1)`, and `Level 4 (Band B2)`.
2. **Global Omnibar (`Ctrl+K`) Multi-Script Linguistic Search (`ShellDrawersAndModals.tsx`) (`FORM-REQ-0018`):**
   - Searches simultaneously across Traditional Hanzi, Taiwan MOE Zhuyin, Pinyin, English glosses, Polyphone (`破音字`) & `兩岸異讀字` notes, MOE Stroke Characters, and Studio jump shortcuts (`Alt+1..6`).
3. **Taiwan MOE Linguistic Reference Tables in `09-Releases/FORM-MAN-001_FormosaStudio_User_Manual.md` (`FORM-REQ-0023`):**
   - Documents the 12 core Taiwan MOE (`兩岸異讀字`) standard readings, Spoken Taiwanese Tone Sandhi rules (`3+3 -> 2+3`, `3+3+3`, Taiwanese `Half-3 [21]`, `不`, `一`), and the 41-key Taiwan DaQian (`大千式`) keyboard map.

---

## 2. `DEP-02` Hardware & Acoustic DSP Pre-Implementation Requirements

1. **Global Shell Hardware Controls & `zh-TW` TTS Synthesis (`App.tsx`):**
   - Surfaces `<HandednessToggle>` and Adaptive Zhuyin mode (`adaptive` / `always` / `hover_only`) in the Global Header HUD.
   - Provides offline-resilient `zh-TW` TTS synthesis (`window.speechSynthesis` prioritizing `zh-TW` / Taiwan voices) with safe fallback in headless Node.js test environments.
2. **Linux Wacom & WebAudio Calibration Instructions in `FORM-MAN-001` (`FORM-REQ-0023`):**
   - Documents Linux X11/Wayland Wacom stylus setup (`PointerEvent.pressure`, eraser `buttons === 32` / `button === 5`, Pen-Only Palm Rejection, Left/Right-Handed Canvas Docking) and offline WebAudio YIN $F_0$ microphone calibration (`95–220 Hz` vs. `145–330 Hz`).

---

## 3. `DEP-03` SLA & Survival Pedagogy Pre-Implementation Requirements

1. **Inline 10-Minute Daily Flow Runner (`TodayAndCurriculumHub.tsx`) (`FORM-REQ-0020`, `FORM-REQ-0021`):**
   - Embeds an inline 3-step guided daily session directly inside Studio 1 (`Step 1: FSRS & Polyphone Warmup` -> `Step 2: Pimsleur & Survival Dialogue` -> `Step 3: Taiwan MOE Stroke & DaQian Reflex`) with zero disruptive modal takeovers.
2. **End-to-End Cross-Module FSRS State Synchronization (`FORM-REQ-0020`):**
   - Practicing items in any studio immediately updates the shared `UserProgressState` (`progressStore.ts`), reflecting live across Studio 1's Hub, Studio 3's $i+1$ Comprehensibility meter, and `<RubyText>` scaffolding.

---

## 4. `DEP-04` UI/UX Co-Leadership & ASEF Guide 008 Pre-Implementation Requirements (`FORM-DEP-UX-001`)

1. **Unified Single-Row 6-Studio Navigation Shell (`App.tsx`) (`FORM-REQ-0018`, `FORM-REQ-0021`):**
   - Strictly `6` permanent top-level studios (`<= 8` ceiling) reachable via `1` click or `Alt+1..6`, `Ctrl+K` Global Omnibar, `F1`/`?` Help & Manual Drawer, `⚙️ Resource Admin` modal, Collapsible Side Reference Dock, and `<ReturnBreadcrumbBar>`.
2. **Mechanical LOC Compliance (`Pattern 12`):**
   - All Phase 4 files (`TodayAndCurriculumHub.tsx`, `ShellDrawersAndModals.tsx`, `App.tsx`, `main.tsx`, `phase4.test.ts`) must remain strictly `<= 600` LOC (`0` warnings, `0` errors).

---

## 5. Sign-Off
- **`DEP-01` (Taiwanese Mandarin & TOCFL Computational Linguist):** Approved
- **`DEP-02` (Acoustic DSP & Wacom Stylus Hardware Engineer):** Approved
- **`DEP-03` (SLA & Survival Pedagogist):** Approved
- **`DEP-04` (UI/UX & Accessibility Co-Lead):** Approved
