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
1. **Phase 0 (`Gates 1 & 2/3/4/5`):** Prototype Retrospective (`FORM-LL-001`..`005`), `R2` Tailoring (`FORM-TAILOR-001`), Requirements Baseline (`FORM-REQ-001`..`FORM-REQ-0020`), Design Character (`FORM-DESCHAR-001`), Live Environment Audit & Architecture (`FORM-ARCH-001`), and Governance Automation (`08-Automation/`).
2. **Phase 1:** Context-Aware `zh-TW` Word Tokenizer (`FMM`), Polyphone (`破音字`) & Taiwan MOE Pronunciation (`兩岸異讀字`) Engine, *Contemporary Chinese* Vols. 1–6 Curriculum Completion, FSRS-Lite Scheduler, and Modular Refactoring (`<= 800` LOC ceiling).
3. **Phase 2:** Adaptive `i + 1` Graded Reader, Custom Text Importer, Spoken-vs.-Written (`口語/書面語`) Register Bridge, and **"Taiwan in 10 Minutes a Day"** Practical English-Speaker Survival Track (Sticky Labels, Paper Tick-Menus `點菜單`, `打折` Discount Math, `民國` Dates, Addresses, Clinic/Pharmacy Survival, and Functional Listening Gym).
4. **Phase 3:** Native **Wacom Stylus (`PointerEvent`) Calligraphy & Taiwan MOE Stroke-Order Studio** (`e.pressure`, `getCoalescedEvents()`, Eraser/Barrel Buttons, Vector Stroke Grading, `形聲字` Radical-Phonetic Builder) and **Offline WebAudio Pitch-Contour ($F_0$) & Pronunciation Coach** (Autocorrelation/YIN $F_0$ Curve Overlay + Tone Sandhi & Retroflex/Sibilant Discrimination).
5. **Phase 4 (`Gates 6/7 & 8/9`):** Full Verification & Golden Scenario Validation (`FORM-VAL-001`..`005`), Production Build, and `n = 3` (`R2`) Empirical Evaluation (`FORM-EVAL-001`).

---

## 2. Configuration Management Plan (`Volume 8`)

* **Baseline Control:** Tracked in `04-Implementation/FORM-BSL-001_Baseline_Register.md` across 4 folded `R2` milestone baselines (`FORM-BSL-001`..`004`).
* **Mechanical Invariants:** Enforced via `08-Automation/check_structural_scaffolding.py` and `08-Automation/sync_traceability_graph.py --check`.

---

## 3. Documentation Plan (`Volume 4 §6.4` & `Guide 007 §3`)

* **User & Hardware Setup Documentation:** Delivered in `README.md` (covering Wacom tablet setup under Linux Chromium/Firefox, microphone permissions for offline WebAudio $F_0$ pitch tracking, and the 10-Minute Daily Survival routine).
* **Maintainer & Architecture Documentation:** Delivered in `02-Architecture/FORM-ARCH-001_Architecture_and_Decisions.md`.

---

## 4. AI Collaboration Plan (`Volume 6 §6.4` & `Pattern 15`)

* **Primary AI Agent:** Google Antigravity operating under `AGENTS.md` / `GEMINI.md`.
* **Authority Hierarchy (`Pattern 15 Principle 3`):** Canonical ASEF Repository → Approved Project Baselines (`FORM-TAILOR-001`, `FORM-REQ-001`, `FORM-ARCH-001`) → Mechanical Checks (`08-Automation/`) → AI Session Records (`FORM-AISR-*`) → Domain Expert Advisory Reviews (`Tier 5`).
* **Periodic Aggregate-Level Re-Review (`Pattern 20`):** Triggered at `aggregate_review_counter == 3` (Phase 3 completion) to audit cumulative navigation density (`<= 8` tabs) and cross-module state cohesion.
* **Shared-Concept Consumer Propagation Check (`Pattern 21`):** Executed at every Touchpoint B review whenever a shared TypeScript interface, dictionary, or progress store function is modified.
