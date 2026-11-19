---
id: FORM-BOE-004
type: GovernancePolicy
title: FormosaStudio — Phase 4 Basis of Estimate (Unified 6-Studio Shell, Today & Curriculum Hub, User's Manual FORM-MAN-001 & Gate 6/7/8/9 Release)
status: Approved
version: 1.0.0
created: 2026-11-14
owner: GSS
parent_ids:
  - FORM-ROAD-001
  - FORM-REQ-0018
  - FORM-REQ-0019
  - FORM-REQ-0020
  - FORM-REQ-0021
  - FORM-REQ-0022
  - FORM-REQ-0023
  - FORM-VER-001
  - FORM-DEP-UX-001
---

# FormosaStudio (`FORM`) — Phase 4 Basis of Estimate (`FORM-BOE-004`)

## 1. Phase 4 Scope & Objectives (`Pattern 12` & `Guide 002 §2`)

Phase 4 completes the end-to-end integration, verification, user documentation, and release closure (`Gate 6/7` and `Gate 8/9`) of **FormosaStudio (`FORM`)**:

1. **Studio 1: Today, Inline 10-Min Daily Flow Runner & Full Curriculum Hub (`TodayAndCurriculumHub.tsx`):**
   - Replaces the predecessor prototype's intrusive full-screen wizard with an **Inline 10-Minute Daily Flow Runner** (`Step 1: FSRS & Polyphone Warmup` -> `Step 2: Pimsleur & Taiwan Survival Dialogue` -> `Step 3: Wacom Stroke & DaQian Reflex`).
   - Integrates the complete **Pimsleur Taiwanese Mandarin Phase 1 (Units 1–19 + Custom Admin Units)** interactive lesson player and **NTNU *A Course in Contemporary Chinese* (`當代中文課程`) Volumes 1–6 (61 Lessons + Custom Admin Lessons)** explorer with TOCFL Novice 1 – Band B2 readiness metrics.
2. **Global Omnibar (`Ctrl+K`), Collapsible Context Reference Dock & In-App Help/Manual Drawer (`?` / `F1`) (`ShellDrawersAndModals.tsx`):**
   - Provides `<= 2`-click / `1`-shortcut access to any studio, vocabulary item, polyphone rule, or MOE character (`FORM-REQ-0018`).
   - Renders the collapsible Side Reference Dock synchronized with `studioContextBus.ts` and the interactive in-app Help & User's Manual Drawer (`FORM-REQ-0023`).
3. **Unified 6-Studio Application Shell (`App.tsx` & `main.tsx`):**
   - Unifies all 6 permanent studios (`hub`, `survival`, `reader`, `calligraphy`, `speaking`, `dojo`), `<ReturnBreadcrumbBar>`, `ResourceAdminModal`, `zh-TW` TTS voice synthesis, and global keyboard shortcuts (`Alt+1..6`, `Ctrl+K`, `F1`/`?`).
4. **Comprehensive Standalone User's Manual (`09-Releases/FORM-MAN-001_FormosaStudio_User_Manual.md`) (`FORM-REQ-0023`):**
   - Covers daily 10-minute study workflows, Linux Wacom stylus setup & ergonomics, offline WebAudio $F_0$ microphone calibration, Taiwan DaQian (`大千式`) keyboard map, Taiwan MOE orthography & tone sandhi reference, step-by-step Resource Admin ingestion templates (`.docx`, `.txt`, `.csv`, `.json`), and FSRS JSON backup/restore.
5. **Automated End-to-End Verification & Golden Scenario Validation (`phase4.test.ts`, `FORM-VER-RPT-001`, `FORM-REL-001`):**
   - Executes automated tests for all 23 requirements (`FORM-REQ-0001`..`0023`) and all 5 Golden Scenarios (`FORM-VAL-001`..`005`), verifies `npm run build` (`tsc -b && vite build`), and promotes `FORM-BSL-003` (`Gate 6/7`) and `FORM-BSL-004` (`Gate 8/9`) to `Approved`.

---

## 2. Per-File LOC Allocation & Complexity Budget (`Pattern 12`)

Every Phase 4 source file in `07-Configuration/Source/src/` is budgeted strictly below the **`600` LOC soft warning** and **`800` LOC hard mechanical block**:

| Planned File Path | Allocated Requirements | Target LOC | Soft / Hard Ceiling | Responsibility |
| :--- | :--- | :---: | :---: | :--- |
| `src/components/TodayAndCurriculumHub.tsx` | `FORM-REQ-0003`, `FORM-REQ-0018`, `FORM-REQ-0020`, `FORM-REQ-0021`, `FORM-REQ-0022` | `~490` LOC | `600 / 800` | Studio 1 (`今日學習`) with Inline 10-Min Daily Flow Runner, Pimsleur Units 1–19+ Player, NTNU Contemporary Chinese Vols. 1–6+ Explorer, and TOCFL Readiness Dashboard. |
| `src/components/ShellDrawersAndModals.tsx` | `FORM-REQ-0018`, `FORM-REQ-0020`, `FORM-REQ-0021`, `FORM-REQ-0023` | `~440` LOC | `600 / 800` | Global Omnibar (`Ctrl+K`), Collapsible Side Reference Dock (synchronized with `studioContextBus.ts`), and In-App Interactive Help & User's Manual Drawer (`?` / `F1`). |
| `src/App.tsx` | `FORM-REQ-0018`, `FORM-REQ-0020`, `FORM-REQ-0021`, `FORM-REQ-0022`, `FORM-REQ-0023` | `~350` LOC | `600 / 800` | Unified 6-Studio Application Shell, Top Navigation Bar (`<= 6` permanent studios), `<ReturnBreadcrumbBar>`, `ResourceAdminModal` integration, and `zh-TW` TTS controller. |
| `src/main.tsx` | `FORM-REQ-0019`, `FORM-REQ-0021` | `~20` LOC | `600 / 800` | React 18 root mount point for Vite production build. |
| `src/tests/phase4.test.ts` | `FORM-REQ-0018`, `FORM-REQ-0019`, `FORM-REQ-0020`, `FORM-REQ-0023`, `FORM-VAL-001`..`005` | `~340` LOC | `600 / 800` | End-to-End Golden Scenarios (`FORM-VAL-001`..`005`), Guide 008 usability/accessibility verification, cross-studio state synchronization, and 23/23 requirement coverage audit. |

---

## 3. Domain Expert Panel Trigger Evaluation (`Pattern 13`, `Pattern 17`, `Pattern 20`, `Pattern 21`)

All **4 Domain Expert Panel roles** are triggered in Phase 4 (`Gate 6/7` and `Gate 8/9` Release Review):
- **`DEP-01` (Taiwanese Mandarin & TOCFL Computational Linguist):** Verifies end-to-end Taiwan MOE Zhuyin, polyphone (`破音字`), sandhi, and TOCFL Novice 1 – Band B2 accuracy across Studio 1, the Global Omnibar, the Side Reference Dock, and the User's Manual (`FORM-MAN-001`).
- **`DEP-02` (Acoustic DSP & Wacom Stylus Hardware Engineer):** Verifies Wacom stylus ergonomics, Left/Right-Handed layout persistence, and Linux WebAudio / Wacom setup instructions in `FORM-MAN-001` and the in-app Help Drawer.
- **`DEP-03` (SLA & "Taiwan in 10 Minutes a Day" Survival Pedagogist):** Verifies the Inline 10-Minute Daily Flow Runner, Pimsleur 1–19 + NTNU Vols. 1–6 curriculum integration, and cross-studio FSRS synchronization (`FORM-REQ-0020`).
- **`DEP-04` (UI/UX & Accessibility Designer — Mandatory Co-Lead):** Co-leads Phase 4 Touchpoint A & Touchpoint B, verifying ASEF Guide 008 usability thresholds (`<= 2` clicks / `1` shortcut, `<= 6` permanent top-level studios, `>= 44×44 px` stylus hit targets, WCAG 2.1 AA contrast `>= 4.5:1`, and 1-click Return Breadcrumb navigation).
