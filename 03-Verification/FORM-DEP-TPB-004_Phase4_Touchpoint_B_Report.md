---
id: FORM-DEP-TPB-004
type: VerificationReport
title: FormosaStudio — Phase 4 Domain Expert Panel Touchpoint B Audit, Pattern 21 Consumer Propagation & Gate 6/7–8/9 Release Sign-Off
status: Approved
version: 1.0.0
created: 2026-11-19
owner: GSS
parent_ids:
  - FORM-DEP-TPA-004
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

# FormosaStudio (`FORM`) — Phase 4 Touchpoint B Audit & Release Sign-Off (`FORM-DEP-TPB-004`)

- **Review Type:** Post-Implementation Domain Expert Panel Verification & Gate 6/7–8/9 Release Audit (`Touchpoint B` — `Pattern 13`, `Pattern 17`, `Pattern 20`, & `Pattern 21`)
- **Triggered Panel Members (All 4 Roles Active — Independent Subagent Review + Principal Engineer Remediation):**
  - **`DEP-01`:** Taiwanese Mandarin & TOCFL Computational Linguist
  - **`DEP-02`:** Acoustic DSP & Wacom Stylus Hardware Engineer
  - **`DEP-03`:** SLA & "Taiwan in 10 Minutes a Day" Survival Pedagogist
  - **`DEP-04`:** UI/UX & Accessibility Designer (**Mandatory Standing Co-Lead** per `FORM-LL-007` & `FORM-DEP-UX-001`)
- **Final Automated Verification & Build Evidence:**
  - `41/41` cumulative automated tests passing (`12` Phase 1 + `8` Phase 2 + `12` Phase 3 + `9` Phase 4 & Golden Scenarios `FORM-VAL-001`..`005`).
  - `npm run build` (`tsc -b && vite build`): `PASS` (`0` TypeScript errors, `61` modules bundled to `dist/`).
  - `08-Automation/check_structural_scaffolding.py`: `PASS` (`0` errors, `0` warnings; `36` source files, `14,631` total LOC, max file `599` LOC strictly `<= 600` soft ceiling and `<= 800` hard ceiling).

---

## 1. Touchpoint B Independent Audit Findings & Verified Remediations

An independent Tier-5 Domain Expert Panel review (`DEP-01`..`DEP-04`) initially issued a **`CONDITIONAL PASS`** after identifying 6 concrete functional, DSP, pedagogical, and UX defects across Phase 4 and cross-studio integration. Every finding was remediated and regression-tested prior to Gate 6/7 sign-off:

| # | Panel Role | Severity | Finding Identified During Touchpoint B | Verified Remediation |
| :---: | :--- | :---: | :--- | :--- |
| **1** | `DEP-04` | **High** | `ReturnBreadcrumbBar` `onDismiss` called `clearStudioHandoff()`, which reset `activeStudio: 'hub'` and teleported users out of Studios 2–6 back to Studio 1. | Added `dismissStudioHandoff()` in [studioContextBus.ts](file:///home/gssmith/Programming/FormosaStudio/07-Configuration/Source/src/lib/studioContextBus.ts) preserving `activeStudio`/`focusedItem`, wired in [App.tsx](file:///home/gssmith/Programming/FormosaStudio/07-Configuration/Source/src/App.tsx), and verified in [phase4.test.ts](file:///home/gssmith/Programming/FormosaStudio/07-Configuration/Source/src/tests/phase4.test.ts). |
| **2** | `DEP-03` | **High** | `recordWordPractice()` in `progressStore.ts` only updated `charMastery` when `entry.chars` was explicitly passed, preventing Adaptive Zhuyin Fading from updating after practice in Studios 1, 2, 5, and 6 (`FORM-REQ-0020`). | Updated `recordWordPractice()` in [progressStore.ts](file:///home/gssmith/Programming/FormosaStudio/07-Configuration/Source/src/lib/progressStore.ts) to auto-derive constituent CJK characters + aligned Zhuyin syllables whenever `entry.chars` is omitted; verified in `phase4.test.ts`. |
| **3** | `DEP-04` | **High** | `CrossStudioActionPills` dispatched `modeHint: 'custom_text'` while `ReadingGrammarStudio.tsx` checked `'custom_cloze'` without subscribing to `subscribeStudioBus`, and did not re-memoize on `adminRevision`. | Aligned `modeHint` to `'custom_cloze'` in [uiPrimitives.tsx](file:///home/gssmith/Programming/FormosaStudio/07-Configuration/Source/src/components/uiPrimitives.tsx), subscribed [ReadingGrammarStudio.tsx](file:///home/gssmith/Programming/FormosaStudio/07-Configuration/Source/src/components/ReadingGrammarStudio.tsx) to `subscribeStudioBus`, and threaded `adminRevision` from `App.tsx`. |
| **4** | `DEP-01` | **Medium** | `GlobalOmnibarModal` did not search `TAIWAN_MOE_PRONUNCIATIONS` or `POLYPHONE_PAIRS`, and `phase4.test.ts` `FORM-VAL-001` omitted assertions for `很長`, `還有`, `不行`, and conjunctive `和 = ㄏㄢˋ`. | Added live `TAIWAN_MOE_PRONUNCIATIONS` (`兩岸異讀字`) & `POLYPHONE_PAIRS` (`破音字`) search sections to [ShellDrawersAndModals.tsx](file:///home/gssmith/Programming/FormosaStudio/07-Configuration/Source/src/components/ShellDrawersAndModals.tsx) and completed all `FORM-VAL-001` assertions in `phase4.test.ts`. |
| **5** | `DEP-02` | **Medium** | `SpeakingPitchStudio.tsx` created a 65 ms live-mic `setInterval` without storing its ID in a ref or clearing it on stop/unmount, and `App.tsx` did not mirror `SideContextReferenceDock` in Left-Handed mode. | Added `intervalRef` cleanup on stop/unmount in [SpeakingPitchStudio.tsx](file:///home/gssmith/Programming/FormosaStudio/07-Configuration/Source/src/components/SpeakingPitchStudio.tsx), mirrored `SideContextReferenceDock` (`xl:flex-row-reverse`) in `App.tsx`, and added Linux `xsetwacom`/`libinput` + `localhost` mic notes to [FORM-MAN-001](file:///home/gssmith/Programming/FormosaStudio/09-Releases/FORM-MAN-001_FormosaStudio_User_Manual.md). |
| **6** | `DEP-03` & `DEP-04` | **Medium** | Daily Flow Step 3 fabricated 95% `strokeMastery` without canvas drawing; Step 2 inserted full sentences into `wordMastery`; Studio 6 FSRS backup lacked `.json` file download + file-restore input; DaQian keyboard listener leaked when modals were open; `FORM-MAN-001` had minor label drift. | Switched Step 3 to `recordCharacterPractice` and Step 2 to unit vocabulary in [TodayAndCurriculumHub.tsx](file:///home/gssmith/Programming/FormosaStudio/07-Configuration/Source/src/components/TodayAndCurriculumHub.tsx); added `.json` download, `<input type="file">` restore, `[role="dialog"]` key guard, and full Band A/B filters in [VocabSrsDojoStudio.tsx](file:///home/gssmith/Programming/FormosaStudio/07-Configuration/Source/src/components/VocabSrsDojoStudio.tsx); added `role="dialog" aria-modal="true"` to all 3 modals and aligned `FORM-MAN-001`. |

---

## 2. Final Per-Role Verification Verdicts (`PASS`)

- **`DEP-01` (Taiwanese Mandarin & TOCFL Computational Linguist): `PASS`**
  - Verified 100% alignment of the 12 Taiwan MOE `兩岸異讀字`, 26 Polyphone (`破音字`) pairs, Spoken Tone Sandhi rules (`3+3`, `3+3+3`, Taiwanese `半上 [21]`, `不`, `一`), 6 TOCFL bands (`Novice 1`–`Band B2`), and 41-key DaQian layout across code, Omnibar, Help Drawer, and `FORM-MAN-001`.
- **`DEP-02` (Acoustic DSP & Wacom Stylus Hardware Engineer): `PASS`**
  - Verified W3C `PointerEvent` pressure tapering, coalesced sampling, eraser nib undo, palm rejection, Left/Right-Handed layout persistence & dock mirroring, leak-free offline WebAudio YIN $F_0$ mic capture (`< 3.0 Hz` error), and headless-safe `zh-TW` TTS synthesis.
- **`DEP-03` (SLA & "Taiwan in 10 Minutes a Day" Survival Pedagogist): `PASS`**
  - Verified non-blocking Inline 10-Minute Daily Flow Runner, Pimsleur Units 1–19+ and NTNU Vols. 1–6 (61+ lessons) live integration, authentic cross-studio `charMastery`/`wordMastery`/`strokeMastery` FSRS updates, and file-based JSON backup/restore.
- **`DEP-04` (UI/UX & Accessibility Designer — Mandatory Co-Lead): `PASS`**
  - Verified Guide 008 compliance: strictly `6` permanent top-level studios (`<= 8` ceiling), `<= 2` clicks / `1` shortcut (`Alt+1..6`, `Ctrl+K`, `?`/`F1`), `>= 44×44 px` stylus hit targets, WCAG 2.1 AA contrast (`>= 9.3:1` tone tokens on `#0F172A`), ARIA modal roles, and non-destructive `ReturnBreadcrumbBar` dismiss/return flows.

---

## 3. Pattern 21 Shared-Concept Consumer Propagation Check (`PASS`)

- **`curriculumAdminStore.ts` (`adminRevision` & `subscribeCurriculumAdminChanges`):** Verified live propagation from `App.tsx` across `TodayAndCurriculumHub.tsx`, `ReadingGrammarStudio.tsx`, `VocabSrsDojoStudio.tsx`, `GlobalOmnibarModal`, and `vocabularyCatalog.ts`.
- **`progressStore.ts` (`UserProgressState`):** Verified single lifted state in `App.tsx` updating `charMastery` (Adaptive Zhuyin Fading), `wordMastery` ($i+1$ Reader & FSRS Due Queue), `strokeMastery`, `handedness`, XP, and Streak live across all 6 studios.
- **`studioContextBus.ts` (`dispatchStudioHandoff`, `popReturnHandoff`, `dismissStudioHandoff`):** Verified clean bidirectional handoff and non-destructive breadcrumb dismissal across Studios 1–6.

---

## 4. Sign-Off
- **`DEP-01` (Taiwanese Mandarin & TOCFL Computational Linguist):** `PASS`
- **`DEP-02` (Acoustic DSP & Wacom Stylus Hardware Engineer):** `PASS`
- **`DEP-03` (SLA & Survival Pedagogist):** `PASS`
- **`DEP-04` (UI/UX & Accessibility Co-Lead):** `PASS`
