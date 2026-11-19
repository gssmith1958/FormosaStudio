# Domain Expert Advisory Report (`FORM-DEP-UX-001`) — End-to-End UI/UX Diagnostic & Cohesive Studio Architecture

* **Role:** `DEP-04` — UI/UX & Accessibility Designer (`ASEF Guide 008 v0.9.1`, Tier 5 Advisory Domain Expert per `Volume 6 §14.3.3`)
* **Subagent Session Reference:** `dd7bd53d-996e-4cb8-a802-18c5586b02f7`
* **Review Scope:** Forensic UX diagnostic of predecessor prototype (`/home/gssmith/Programming/Chinese2`) "piece-part and glued-together" friction points, and end-to-end UI/UX architecture & phase gate governance for `FormosaStudio` (`Phases 1–4`).
* **Date:** `2026-11-13`
* **Principal Engineer Disposition:** **Accepted in Full (`Approved`)** — Promoted to `FORM-LL-007`, `FORM-RISK-006`, `FORM-DEC-004`, `FORM-REQ-0021` (Phase 1 Foundation), and mechanical enforcement in `08-Automation/check_structural_scaffolding.py`.

---

## 1. Forensic UX Diagnostic of `Chinese2` ("Piece-Parts Glued Together")

Direct inspection of `/home/gssmith/Programming/Chinese2/src/` identified three structural root causes behind why the prototype felt clunky and fragmented in daily use:

1. **Competing Triple-Layer Navigation Chrome (`AppMenuBar.tsx` + `WorkspaceTabBar.tsx` + Sub-Tab Bars):**
   * `App.tsx:445–482` stacked two competing navigation bars in the sticky header: a 4-dropdown desktop menu bar (`AppMenuBar.tsx:112–471`: `Curriculum`, `Vocabulary`, `Practice & Labs`, `View`) directly above a dynamic browser-style closable tab strip (`WorkspaceTabBar.tsx:20–32`) with **12 distinct tab types** (`today_hub`, `skill_tree`, `vocab_workbench`, `taiwan_survival`, `grammar_reading`, `speaking_studio`, `typing_dojo`, `zhuyin_lab`, `match_game`, `compendium`, `srs_vault`, `lesson_player`).
   * Inside individual tabs, a **third horizontal sub-tab bar** was rendered (`VocabularyWorkbenchTab` 5 sub-tabs, `TaiwanSurvivalTab` 4 sub-tabs, `GrammarAndReadingTab` 3 sub-tabs, `SkillTree` 6 world filter buttons).
   * Closing a tab removed the studio from the workspace until the user hunted through dropdown menus or `Ctrl+K` to re-open it.
2. **Siloed Studios & Dead-End Workflows ("Open in New Tab" Context Drops):**
   * `TodayStudyHub.tsx:96–233` presented a "3-Step Daily Routine", but clicking Step 1, Step 2, or Step 3 simply opened or switched to separate tabs (`vocab_workbench`, `lesson_player`, `speaking_studio`) with **zero shared session state or word/sentence handoff**.
   * Clicking a word or character in one studio could not launch Wacom character writing or $F_0$ pitch coaching on that item and return to the reading/survival context.
3. **Ad-Hoc Per-Tab Visual Primitives & Sub-44px Hit Targets:**
   * Each `1,000–1,689` LOC tab reinvented its own headers, cards, mode pills, and small `16–22 px` buttons (`WorkspaceTabBar.tsx:120`, `App.tsx:679`), violating `FORM-DESCHAR-001` Wacom stylus ergonomics (`>= 44×44 px` hit targets).

---

## 2. End-to-End Architectural Prescription for `FormosaStudio` (`FORM-DEC-004` & `FORM-REQ-0021`)

1. **Single-Row Fixed 6-Studio Navigation Shell (`<= 6` Permanent Studios, Zero Closable-Tab Anxiety):**
   * Replace `Chinese2`'s 4 dropdown menus + 12 closable tabs with **6 permanent, predictable top-level studios** (`<= 8` ceiling per `FORM-REQ-0018`):
     1. **`Today & Daily Flow` (`今日學習`):** Includes the **Inline 10-Minute Daily Flow Runner** (stepping continuously through *Survival Warmup → Adaptive Reading/Vocab → Wacom Stroke / $F_0$ Pitch Practice* inside one unified stage without tab-juggling) plus the Curriculum & Readiness Dashboard.
     2. **`10-Min Taiwan` (`臺灣生存`):** Sticky Labels, Interactive Wacom/Mouse Paper Tick-Menu (`點菜單`) Simulator, Spoken Pragmatics (`語助詞` / `臺語`), and Functional Listening Gym (`NT$`, `打折`, `民國` dates, addresses).
     3. **`Reader & Grammar` (`閱讀語法`):** Adaptive `i + 1` Graded Stories, Custom Text Importer & Instant Cloze, `口語/書面語` Register Bridge, and *Contemporary Chinese* Vols. 1–6 Grammar.
     4. **`Wacom Calligraphy` (`書法筆順`):** W3C `PointerEvent` Stylus Pressure/Eraser `九宮格` Studio, Taiwan MOE Vector Stroke-Order Grader, and `形聲字` Radical-Phonetic Workbench.
     5. **`Speaking & Pitch` (`發音聲調`):** Offline WebAudio $F_0$ Pitch-Contour Visualizer, Tone Sandhi & Retroflex/Sibilant (`ㄓㄔㄕㄖ vs ㄗㄘㄙ`) Coach, and `ㄅㄆㄇㄈ` Audio Chart.
     6. **`Vocab, SRS & Dojo` (`詞彙與大千`):** Unified TOCFL Word Bank, FSRS-Lite Review Queue, 8-Stage DaQian Typing Dojo, and 3-Stage Match Arena.
2. **Phase 1 Shared UI Primitive Kit (`src/components/uiPrimitives.tsx`):**
   * Constructed in **Phase 1** before any Phase 2–3 feature studios so every screen shares identical typography, WCAG 2.1 AA tone colors (`WCAG_TONE_PALETTE`), `<StudioHeaderBanner>`, `<StudioModeSwitcher>`, `<StylusButton>` (`>= 44×44 px`), `<HandednessToggle>`, `<ReturnBreadcrumbBar>`, and `<CrossStudioActionPills>`.
3. **Cross-Studio Context Handoff Bus (`src/lib/studioContextBus.ts`):**
   * Clicking any word, character, or phrase anywhere in the app populates the persistent **Right Context & Quick-Practice Dock** and provides 1-click **`[✒️ Write on Wacom]`**, **`[🎤 Coach Pitch ($F_0$)]`**, **`[📖 Open in Reader]`**, and **`[🧠 Boost in SRS]`** handoffs with a persistent **`← Return to [Source Studio]`** breadcrumb bar.

---

## 3. Mandatory `DEP-04` Governance Across All Four Phases (`Phases 1–4`)

| Phase | Mandatory `DEP-04` Touchpoint A (Pre-Code) | Mandatory `DEP-04` Touchpoint B (Post-Code & Pattern 21) |
| :--- | :--- | :--- |
| **Phase 1** | Approve `uiPrimitives.tsx`, `studioContextBus.ts`, 6-Studio Shell layout, and `RubyText` sandhi/fading ergonomics. | Verify `uiPrimitives.tsx` (`>= 44×44 px` targets, WCAG AA tone palette), lossless UI preference persistence in `progressStore.ts`, and **First-Milestone `FORM-DESCHAR-001` Calibration (`Guide 008`)**. |
| **Phase 2** | Approve `Reader & Grammar` and `10-Min Taiwan` (`點菜單` Wacom/mouse ergonomics, zero nested sub-tab clutter, 1-click handoff pills). | Audit end-to-end Reading -> Inspector -> Handoff flow and `点菜单` 44px touch targets; verify `Pattern 21` progress synchronization. |
| **Phase 3** | Approve `Wacom Calligraphy` (left/right-handed dock swap, eraser nib undo, `九宮格` pressure canvas), `Speaking & Pitch` dual-curve $F_0$ overlay, and restyled DaQian/Match modules. | Execute **Pattern 20 Aggregate UI/UX Re-Review** across all 6 studios: verify breadcrumb return flows (`Reader <-> Wacom <-> Pitch`) and visual uniformity across legacy & new modules. |
| **Phase 4** | Approve Unified 10-Minute Daily Flow Runner and Golden Scenario UX scripts (`FORM-VAL-001`..`005`). | Sign off on `Gate 6/7` (`FORM-BSL-003`) usability verification (`FORM-REQ-0018`, `FORM-REQ-0020`, `FORM-REQ-0021`) and full accessibility/ergonomic audit. |
