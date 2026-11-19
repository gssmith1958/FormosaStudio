# ASEF `n = 3` (`Pure R2`) Empirical Validation Scorecard (`FORM-EVAL-001`)

```yaml
id: FORM-EVAL-001
type: KnowledgePackage
title: Empirical Evaluation of ASEF on FormosaStudio (n=3 Pure-R2 Prototype Graduation & TypeScript/Wacom/DSP Execution)
status: Active
version: 1.0.0
project: FORM
owner: Principal Engineer
created_date: 2026-11-13
updated_date: 2026-11-19
traces_to:
  - FORM-TAILOR-001
  - FORM-LL-001
  - FORM-LL-006
  - FORM-LL-007
```

---

## 1. Cross-Project Empirical Comparison (`n = 1` FDSS vs. `n = 2` VeilCrypt vs. `n = 3` FormosaStudio)

| Dimension | `n = 1` (`FDSS`) | `n = 2` (`VeilCrypt`) | `n = 3` (`FormosaStudio`) |
| :--- | :--- | :--- | :--- |
| **Domain** | Personal Finance & Statutory Tax Law | Applied Cryptography & Blind Steganography | **Taiwanese Mandarin (`zh-TW`) NLP, Wacom Stylus Calligraphy, WebAudio $F_0$ Pitch DSP & SLA Pedagogy** |
| **Language / Tech Stack** | Python + MariaDB + Neo4j + PyQt6 | Python + SQLite/JSON + PyNaCl/NumPy + PyQt6 | **TypeScript 5.6 + React 18 + Vite 5 + Tailwind CSS + W3C PointerEvent + WebAudio API** |
| **Tailored Rigor Level** | Uniform `R3` | `R3 Core / R2.5 CLI-UI` | **Pure `R2` (Personal Tool) graduated from `R1` Prototype (`Chinese2`)** |
| **Gate Structure** | 9 Gates | 9 Gates (`Gate 4` folded into `3`) | **4 Folded Milestone Gates (`FORM-BSL-001`..`004`)** |
| **Per-File Structural Ceiling** | None (`main_window.py` = `12,631` LOC) | `600` warn / `1,000` block (max `564` LOC) | **`600` warn / `800` block** (remediating 8 files in `Chinese2` that reached `1,003–1,689` LOC) |

---

## 2. Live Phase-by-Phase Tracking

| Milestone | Status | Key Empirical Findings |
| :--- | :--- | :--- |
| **Phase 0 (`Gate 1` & `Gate 2/3/4/5`)** | **Complete (`2026-11-13`)** | Prototype retrospective on `Chinese2` surfaced 6 high-impact defects (`FORM-LL-001`..`005`, `007`, including piece-part UI accretion glued together under 3 competing navigation layers); `DEP-04` commissioned at Phase 0 (`FORM-DEP-UX-001`) to establish a single-row 6-Studio Shell, Phase 1 Shared UI Primitive Kit (`uiPrimitives.tsx`), and Cross-Studio Context Handoff Bus (`FORM-DEC-004`, `FORM-REQ-0021`). All 11 PEW directories, 23 requirements (`FORM-REQ-0001`..`0023`), and 4 mechanical governance scripts initialized with `0` errors. |
| **Phase 1 (Linguistic Core, Polyphones, Full Vols. 1–6, Shared UI Kit & Admin Manager)** | **Complete (`2026-11-13`)** | Delivered 15 modular TypeScript/React files (all `< 600` LOC, max `599` LOC) covering FMM 26-pair polyphone disambiguator (`100%` accuracy), 12 Taiwan MOE `兩岸異讀字` & tone sandhi engine, 61 complete NTNU *Contemporary Chinese* lessons (Vols. 1–6) + 19 Pimsleur units, FSRS-Lite progress store, `uiPrimitives.tsx` (`WCAG_TONE_PALETTE` `>= 9.3:1`), `studioContextBus.ts`, and 3-step `ResourceAdminModal.tsx` with Pattern 21 live cache invalidation. Verified by Touchpoint A (`FORM-DEP-TPA-001`), Touchpoint B (`FORM-DEP-TPB-001`), and `12/12` automated tests (`FORM-AISR-001`). |
| **Phase 2 (Adaptive `i+1` Reader & "Taiwan in 10 Minutes a Day" Survival)** | **Complete (`2026-11-13`)** | Delivered 8 modular files (`<= 591` LOC, `0` warnings) covering 8 Taiwan-set graded stories (`Novice 1–Band B2`), `< 50 ms` FMM custom text importer & 4-choice cloze generator, 16 `口語 <-> 書面語` Register Bridge pairs, 6 "Taiwan in 10 Minutes a Day" Sticky-Label modules + Printable Sheet mode, 12 Swiss-Army-Knife frames, interactive `點菜單` simulator, 8 `語助詞` + 10 Hokkien `臺語` expressions, and 5-category Functional Listening Gym (`FORM-AISR-002`). |
| **Phase 3 (Wacom Stylus MOE Stroke Studio & Offline WebAudio $F_0$ Pitch Coach)** | **Complete (`2026-11-14`)** | Delivered 8 modular files (`<= 578` LOC, `0` warnings) covering W3C `PointerEvent` Wacom pressure/coalesced/eraser/palm-rejection canvas (`WacomCalligraphyStudio.tsx`), 20-character Taiwan MOE Standard Vector Stroke-Order grader (`裡, 為, 骨, 黃, 國, 臺, 灣, 麵, 捷, 運, 請, 謝` across `描紅 / 臨摹 / 聽寫默寫`), 10-series `形聲字` Workbench (`46` Traditional characters), 100% offline WebAudio YIN CMNDF $F_0$ pitch extractor (`< 3.0 Hz` error) + Dual-Curve Chao `1–5` Visualizer + "Replay My Voice vs. Native Speaker", 8 Spoken Tone Sandhi drills, 10 `ㄓㄔㄕㄖ vs ㄗㄘㄙ` minimal pairs, and modularized 8-Stage DaQian Typing Dojo + 5-World Skill Tree + 3-Stage Match Arena (`FORM-AISR-003`). |
| **Phase 4 (`Gate 6/7` & `Gate 8/9` Release)** | **Complete (`2026-11-19`)** | Delivered Studio 1 (`TodayAndCurriculumHub.tsx`, `580` LOC), Global Omnibar + Collapsible Context Dock + In-App Help/Manual Drawer (`ShellDrawersAndModals.tsx`, `522` LOC), Unified 6-Studio Shell (`App.tsx`, `305` LOC), standalone User's Manual (`FORM-MAN-001`), and `v1.0.0` Release Notes (`FORM-REL-001`). Independent 4-role Domain Expert Panel Touchpoint B review (`FORM-DEP-TPB-004`) caught **6 concrete functional, DSP, pedagogical, and UX defects** prior to release (`ReturnBreadcrumbBar` dismiss teleportation, `recordWordPractice` `charMastery` sync for Adaptive Zhuyin fading, `📖 Open in Reader` `modeHint` mismatch, Omnibar MOE/polyphone search gap, live-mic `setInterval` leak, and Studio 6 `.json` file export/restore + Daily Flow accuracy), all remediated and verified across **`41/41` automated tests**, clean `tsc -b && vite build`, **`36` source files totaling `14,631` LOC (`max = 599` LOC, `0` warnings, `0` errors)**, **`23/23` requirements `Verified`**, and `FORM-BSL-003` + `FORM-BSL-004` promoted to **`Approved`**. |
