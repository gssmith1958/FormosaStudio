# Design Character Document (`FORM-DESCHAR-001`)

```yaml
id: FORM-DESCHAR-001
type: DesignCharacterDocument
title: FormosaStudio Design Character Document — Syllabus-First Warm Paper & Calm Dark HMI for Linux Desktop & iPad mini 6 (v2.1.0)
status: Approved
version: 2.1.0
project: FORM
owner: Principal Engineer
created_date: 2026-11-13
updated_date: 2026-11-25
framework_reference: "ASEF Guide 008 v0.9.4, Guide 007 §1, FORM-LL-008, FORM-LL-009"
traces_to:
  - FORM-TAILOR-001
  - FORM-REQ-0018
```

---

## 1. Design Character Summary (`Guide 008 Part 2` — Updated `v2.1.0` per `FORM-ECR-001`)

* **Positive References (Emulate):**
  1. **Warm Paper Stationery & Modern Desktop/iPad Studios:** Calm rice-paper off-white canvas (`#F7F4EE`), crisp elevated paper cards (`#FFFFFF`), deep sumi-ink text (`#1C1917`), disciplined **Taiwanese Jade (`#0F766E`)** primary accent, and an optional **Calm Studio Dark (`#13161A`)** toggle—using semantic CSS tokens (`fs-card`, `fs-subtle-box`, `var(--fs-*)`) across every surface so no dark-slate slabs appear in Light Paper mode.
  2. **5-Section Expandable Accordion Navigation:** One unified, syllabus-first menu (*Today's Adaptive Session · Course Syllabus Stages 0–5 · Practice Labs · Reference & Help · Standalone Administration*) that expands where the learner is working, collapses distractions, and keeps daily study completely separate from administration.
  3. **True Desktop + iPad mini 6 Dual-Device Ergonomics:** Tuned both for Linux Desktop + Wacom (`>= 1280 px`) and **iPad mini 6** (`744 × 1133` CSS px portrait / `1133 × 744` CSS px landscape + Apple Pencil 2)—with automatic drawer collapse at `<= 1180 px`, an always-reachable `☰ Menu` toggle whenever collapsed, compact landscape canvas heights (`<= 420 px`) so drawing + action buttons fit without scrolling, and `sm:` (`640 px`) 2-column portrait card grids.
* **Negative References (Avoid):**
  1. **Competing Progress Maps & Duplicate Chrome:** Never show duplicate Skill Trees, duplicate JSON Backup panels, or nested 4-layer tab strips.
  2. **Static-Only UI Audits & Unverified Fake Credit:** Every GUI change must be verified via live rendered screenshots (`Guide 008 v0.9.4`), and demo/simulate/hint buttons never write real mastery credit.

---

## 2. Five Core Design Principles (`30-Second Reference`)

1. **Authentic Taiwan Orthography & Non-Destructive Adaptive Fading:** Vertical Zhuyin (`RubyText`) pairs with tone-marked Hanyu Pinyin training wheels in Stages 0–1, transitions to Zhuyin-primary in Stages 2–3, and uses per-character **Adaptive Fading** in Stages 4–5 (fading mastered `Lv.2/3` characters to bare Traditional Hanzi while keeping Zhuyin visible on brand-new `Lv.0/1` words).
2. **Pen-in-Hand Ergonomics (Wacom + Apple Pencil 2):** Every interactive control is `>= 44 × 44 px`; Left/Right-Handed docking swaps both desktop sidebar and iPad drawer side cleanly; eraser nib undoes strokes; drawing canvases auto-collapse the sidebar on iPad (`<= 1180 px`).
3. **Syllabus-First Daily Focus:** *Today's Adaptive Session* presents one calm daily workspace dynamically pulling ~70% current-stage drills + ~30% spiral review (with contextual Peek-Ahead), while *Course Syllabus* owns the full **Stages 0–5 (`Pre-A1 → TOCFL Level 4 / CEFR B2 / Classic HSK 5 Equiv.`)** map.
4. **Visual & Acoustic Truth Across Linux & iPadOS:** Show live spoken pitch curves (using iPad-safe 2× anti-aliased YIN `< 5 ms/frame` and Safari `audio/mp4` replay) and exact offline Taiwan MOE SVG brushstroke silhouettes (`moeStrokeVectorData.json`).
5. **Verified WCAG 2.1 AA Semantic Token System (Light Paper & Calm Dark):** All 5 tone colors (`--fs-tone-1`..`5`) and surfaces (`--fs-bg`, `--fs-surface`, `--fs-subtle`, `--fs-text`, `--fs-accent`) maintain `>= 4.5:1` contrast in both Warm Paper Light (`#F7F4EE`) and Calm Studio Dark (`#13161A`).

---

## 3. Cohesive 5-Section Shell & Anti-Silo Contract (`FORM-DEC-005` & `FORM-REQ-0021`)

1. **5 Permanent Top-Level Expandable Menu Sections (`<= 8` Ceiling):**
   1. **Today's Adaptive Session** — Dynamic 3-step 10-minute loop tailored to active Syllabus Stage + contextual Peek-Ahead.
   2. **Course Syllabus (`Stages 0–5`)** — Expandable tree (`Stage 0 Foundations` + `Stages 1–5` mapped to `TOCFL Level 1 A1 → Level 4 B2 / HSK 5 Equiv.`), each using Option A layout (*1 Recommended Next CTA + expandable Pimsleur, NTNU, Survival, Strokes/Stories & 5-question Stage Checkpoint*).
   3. **Practice Labs** — On-demand focused labs (*Speaking & Pitch · Wacom/Pencil Writing · Reading & Register · Survival & Listening · Vocab, FSRS, DaQian & Match Arena*).
   4. **Reference & Help** — Global `Ctrl+K` Omnibar, Taiwan MOE Pronunciation/Sandhi Guide, and In-App User's Manual.
   5. **Administration** *(Standalone)* — Lesson Material CRUD (*Create/Edit/Delete* Pimsleur units, NTNU lessons, and Custom Taiwan Scenarios/Flashcards with `targetStage`), Progress Backup & Desktop↔iPad Transfer (including custom packs), Hardware/UI Preferences, and 1-click **iPad/Desktop Audio, Voice & Mic Self-Test**.
2. **Shared UI Primitive Kit (`src/components/uiPrimitives.tsx`)** and **Cross-Studio Context Bus (`src/lib/studioContextBus.ts`)** preserve 1-click cross-lab deep links and contextual return breadcrumbs across all views.
