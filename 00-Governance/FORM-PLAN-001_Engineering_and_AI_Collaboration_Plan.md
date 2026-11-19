# Consolidated Engineering, Configuration Management, Documentation & AI Collaboration Plan (`FORM-PLAN-001`)

```yaml
id: FORM-PLAN-001
type: EngineeringPlan
title: FormosaStudio R2 Consolidated Engineering, CM, Documentation and AI Collaboration Plan
status: Approved
version: 1.0.0
project: FORM
owner: Principal Engineer
created_date: 2026-11-13
updated_date: 2026-11-13
framework_reference: "Volume 4 §6.4, Volume 6 §6.4, Volume 8, Guide 007 §3"
traces_to:
  - FORM-TAILOR-001
```

---

## 1. Engineering & Lifecycle Approach (`Volume 4 §6.4`)

`FormosaStudio` (`FORM`) follows an iterative 5-phase `R2` engineering lifecycle graduating the un-governed `/home/gssmith/Programming/Chinese2` (`17,228` LOC) prototype into a modular, verified, hardware-integrated Taiwanese Mandarin training workstation:
1. **Phase 0 (`Gates 1 & 2/3/4/5`):** Prototype Retrospective (`FORM-LL-001`..`005`, `007`), End-to-End UI/UX Forensic Diagnostic & Cohesive Shell Prescription (`FORM-DEP-UX-001`), `R2` Tailoring (`FORM-TAILOR-001`), Requirements Baseline (`FORM-REQ-0001`..`FORM-REQ-0021`), Design Character (`FORM-DESCHAR-001`), Live Environment Audit & Architecture (`FORM-ARCH-001`), and Governance Automation (`08-Automation/`).
2. **Phase 1:** Shared Design System Primitives (`src/components/uiPrimitives.tsx`), Cross-Studio Context Handoff Bus (`src/lib/studioContextBus.ts`), Context-Aware `zh-TW` Word Tokenizer (`FMM`), Polyphone (`破音字`) & Taiwan MOE Pronunciation (`兩岸異讀字`) Engine, *Contemporary Chinese* Vols. 1–6 Curriculum Completion, FSRS-Lite Scheduler, and Modular Refactoring (`<= 800` LOC ceiling), co-governed by `DEP-04` with First-Milestone UI Calibration (`Guide 008`).
3. **Phase 2:** Adaptive `i + 1` Graded Reader, Custom Text Importer, Spoken-vs.-Written (`口語/書面語`) Register Bridge, and **"Taiwan in 10 Minutes a Day"** Practical English-Speaker Survival Track (Sticky Labels, Paper Tick-Menus `點菜單`, `打折` Discount Math, `民國` Dates, Addresses, Clinic/Pharmacy Survival, and Functional Listening Gym)—all constructed atop `uiPrimitives.tsx` and `studioContextBus.ts` under active `DEP-04` Touchpoint A/B review.
4. **Phase 3:** Native **Wacom Stylus (`PointerEvent`) Calligraphy & Taiwan MOE Stroke-Order Studio** (`e.pressure`, `getCoalescedEvents()`, Eraser/Barrel Buttons, Vector Stroke Grading, `形聲字` Radical-Phonetic Builder), **Offline WebAudio Pitch-Contour ($F_0$) & Pronunciation Coach** (Autocorrelation/YIN $F_0$ Curve Overlay + Tone Sandhi & Retroflex/Sibilant Discrimination), and restyled DaQian/Match modules using `uiPrimitives.tsx`, culminating in a **Pattern 20 Aggregate UI/UX Re-Review** by `DEP-04`.
5. **Phase 4 (`Gates 6/7 & 8/9`):** Unified 6-Studio Application Shell, Inline 10-Minute Daily Flow Runner, Full Verification & Golden Scenario Validation (`FORM-VAL-001`..`005`), Production Build, and `n = 3` (`R2`) Empirical Evaluation (`FORM-EVAL-001`).

---

## 2. Configuration Management Plan (`Volume 8`)

* **Baseline Control:** Tracked in `04-Implementation/FORM-BSL-001_Baseline_Register.md` across 4 folded `R2` milestone baselines (`FORM-BSL-001`..`004`).
* **Mechanical Invariants:** Enforced via `08-Automation/check_structural_scaffolding.py` and `08-Automation/sync_traceability_graph.py --check`.

---

## 3. Documentation Plan (`Volume 4 §6.4`, `Volume 4 §11.6`, `Volume 4 §14` & `Guide 007 §3 / §12`)

Even at `R2` (Personal Tool), streamlining internal governance ceremony must never come at the expense of **User Operational Documentation (`Volume 4 §11.6`)**. Because `FormosaStudio` integrates Wacom stylus hardware, offline WebAudio DSP pitch coaching, Taiwan DaQian touch-typing, and a Curriculum & Resource Admin Manager across 6 studios, a dedicated User's Manual is a mandatory deliverable (`FORM-REQ-0023`):
* **Standalone Comprehensive User's Manual (`09-Releases/FORM-MAN-001_FormosaStudio_User_Manual.md`):** Authored incrementally across Phases 1–3 and audited against the as-delivered system at `Gate 6/7` (`Guide 007 §12`). Covers:
  1. **Quick-Start & The 10-Minute Daily Study Loop** (how to use `Today & Daily Flow` and the Cross-Studio Context Handoff Bus).
  2. **Studio-by-Studio Operational Guide** (all 6 studios, Adaptive Zhuyin Fading `Lv.0 -> Lv.3`, `i + 1` reading, and `點菜單` paper menu simulation).
  3. **Wacom Stylus & Linux Hardware Guide** (`PointerEvent` pressure curves, Wacom eraser nib undo, barrel buttons, palm rejection, Left/Right-Handed toolbar docking, and `描紅 / 聽寫默寫 / 臨摹` stroke-order grading).
  4. **Offline WebAudio $F_0$ Pitch-Contour & Tone Sandhi Guide** (Linux PipeWire/PulseAudio microphone setup, speaker vocal-range calibration, reading Chao 1–5 tone curves, and `ㄓㄔㄕㄖ vs ㄗㄘㄙ` drills).
  5. **Curriculum & Resource Admin Manual (`FORM-REQ-0022`) & Data Portability (`FORM-REQ-0004`):** Exact step-by-step instructions and `.docx` / `.txt` / `.csv` / `.json` schemas for adding new Pimsleur units (`Units 20–30`, `Levels II–V`) and NTNU *Contemporary Chinese* lessons/workbooks, plus JSON backup/restore.
* **In-App Interactive Help & Quick-Reference Drawer (`?` / `F1` in Global Header HUD):** Built into the application shell so the user can inspect keyboard maps, Wacom shortcuts, and import templates without leaving their active studio.
* **Maintainer & Architecture Documentation:** Delivered in `02-Architecture/FORM-ARCH-001_Architecture_and_Decisions.md` and `README.md`.

---

## 4. AI Collaboration Plan (`Volume 6 §6.4` & `Pattern 15`)

* **Primary AI Agent:** Google Antigravity operating under `AGENTS.md` / `GEMINI.md`.
* **Authority Hierarchy (`Pattern 15 Principle 3`):** Canonical ASEF Repository → Approved Project Baselines (`FORM-TAILOR-001`, `FORM-REQ-001`, `FORM-ARCH-001`) → Mechanical Checks (`08-Automation/`) → AI Session Records (`FORM-AISR-*`) → Domain Expert Advisory Reviews (`Tier 5`).
* **Periodic Aggregate-Level Re-Review (`Pattern 20`):** Triggered at `aggregate_review_counter == 3` (Phase 3 completion) to audit cumulative navigation density (`<= 6` permanent studios under the `<= 8` ceiling) and cross-module state cohesion.
* **Shared-Concept Consumer Propagation Check (`Pattern 21`):** Executed at every Touchpoint B review whenever a shared TypeScript interface, dictionary, or progress store function is modified.
* **Standing End-to-End UI/UX Co-Leadership (`DEP-04` Anti-Silo Mandate — `FORM-LL-007` & `FORM-DEP-UX-001`):** To prevent the "piece-part and glued-together" UX observed in `Chinese2`, `DEP-04` (UI/UX & Accessibility Designer) is a mandatory participant at **both Touchpoint A and Touchpoint B of every phase (Phases 1–4)**, enforced mechanically by `08-Automation/check_structural_scaffolding.py`.
