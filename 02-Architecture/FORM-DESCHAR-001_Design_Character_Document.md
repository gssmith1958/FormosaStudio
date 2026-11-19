# Design Character Document (`FORM-DESCHAR-001`)

```yaml
id: FORM-DESCHAR-001
type: DesignCharacterDocument
title: FormosaStudio Design Character Document — Taipei Night-Slate & Wacom Calligraphy Ergonomics
status: Approved
version: 1.0.0
project: FORM
owner: Principal Engineer
created_date: 2026-11-13
updated_date: 2026-11-13
framework_reference: "ASEF Guide 008 v0.9.1 Part 2, Guide 007 §1"
traces_to:
  - FORM-TAILOR-001
  - FORM-REQ-0018
```

---

## 1. Design Character Elicitation Summary (`Guide 008 Part 2`)

* **Positive References (Emulate):**
  1. **Taiwan Ministry of Education (`教育部國語小字典` & NTNU *Contemporary Chinese*) Typography:** Crisp, generous Traditional Chinese (`Noto Sans TC` / `Noto Serif TC`) glyphs with authentic right-hand vertical Zhuyin (`直式注音`) and properly positioned tone marks (`ˊ ˇ ˋ` beside the column, neutral dot `˙` centered at the top).
  2. **Procreate / Krita Wacom Pen Canvas Ergonomics:** Unobstructed drawing area (`九宮格` 9-square calligraphy grid), large `>= 44×44 px` stylus-friendly action buttons, instant left/right-handed toolbar docking so the user's drawing hand never covers controls, and live pen-pressure feedback.
  3. **Bilingual Books' *Chinese in 10 Minutes a Day*:** High-contrast visual "Sticky Labels," zero academic jargon, and realistic physical artifacts (Taiwanese breakfast/bento paper tick-menus `點菜單`, MRT exit signs, 7-Eleven receipts).
* **Negative References (Avoid):**
  1. **Sprawling Tab Bars (`FDSS` 35-tab anti-pattern):** Hard ceiling of **`<= 8` top-level workspace tabs**, with related sub-tools grouped cleanly inside each studio.
  2. **Hover-Dependent Micro-Controls:** Impossible to use comfortably while holding a Wacom stylus.
  3. **Low-Contrast Red/Amber Badges on Dark Slate (`VEIL-LL-009` `#EF4444` trap):** All text and tone badges must use WCAG 2.1 AA-verified foreground/background pairs (`>= 4.5:1`).

---

## 2. Five Core Design Principles (`30-Second Reference`)

1. **Authentic Taiwan Orthography First:** Every Chinese sentence renders with genuine Taiwanese vertical Zhuyin (`RubyText`) that fades adaptively (`100% -> 45% -> Hover-Peeking`) as character mastery rises from `Lv.0` to `Lv.3`.
2. **Pen-in-Hand Ergonomics (Wacom First):** In the Wacom Calligraphy Studio and Paper Tick-Menu (`點菜單`) simulator, every control is operable with a single stylus tap (`>= 44×44 px`), the toolbar flips between left and right edges in 1 click, and flipping the Wacom pen to the eraser nib undoes the last stroke without reaching for the mouse.
3. **Guided 10-Minute Daily Flow, Deep On-Demand Workbenches:** *Today's Study Hub* presents a zero-decision 3-card daily routine (*10-Min Taiwan Survival -> Adaptive Reading -> Wacom/Pitch Practice*), while the top menu and `Ctrl+K` Omnibar provide instant access to deep workbenches.
4. **Visual & Acoustic Truth Over Black-Box Scores:** Instead of a vague "72% pronunciation" number, show the learner's **actual spoken $F_0$ pitch curve** overlaid on the target Chao tone contour, and show their **actual Wacom ink strokes** overlaid on the Taiwan MOE standard glyph.
5. **Verified WCAG 2.1 AA Night-Slate Palette:** Deep slate surfaces (`#020617` / `#0F172A`) paired with high-luminance semantic tokens:
   * Tone 1 (`55`): `#38BDF8` (`8.5:1` on `#0F172A`)
   * Tone 2 (`35`): `#34D399` (`8.9:1` on `#0F172A`)
   * Tone 3 (`214`): `#FBBF24` (`10.4:1` on `#0F172A`)
   * Tone 4 (`51`): `#FCA5A5` / `#F87171` (`6.8:1` on `#0F172A` — avoiding pure `#EF4444` which fails AA at `4.43:1`)
   * Tone 5 (`Neutral`): `#C084FC` (`7.4:1` on `#0F172A`)

---

## 3. End-to-End Cohesive Studio Architecture & Anti-Silo Contract (`FORM-DEP-UX-001` & `FORM-REQ-0021`)

To remediate the "piece-part and glued-together" feel of `Chinese2` (`FORM-LL-007`), `FormosaStudio` enforces three structural UI/UX invariants from **Phase 1 through Phase 4**:

1. **Single-Row Fixed 6-Studio Shell (Zero Double-Chrome, Zero Disappearing Tabs):**
   * Eliminates `Chinese2`'s competing 4-dropdown `AppMenuBar` + 12-closable-tab `WorkspaceTabBar` + nested sub-tab bars.
   * Replaces them with **6 permanent, predictable Top-Level Studios**:
     1. `Today & Daily Flow` (`今日學習` — featuring the **Inline 10-Minute Daily Flow Runner** that steps through *Survival → Reading/Vocab → Wacom/Pitch* without tab-jumping)
     2. `10-Min Taiwan` (`臺灣生存` — Sticky Labels, Wacom/Mouse `點菜單` Simulator, `語助詞`/`臺語`, Functional Listening Gym)
     3. `Reader & Grammar` (`閱讀語法` — TOCFL A1–B2 Adaptive `i+1` Reader, Custom Text Importer & Cloze, `口語/書面語` Bridge)
     4. `Wacom Calligraphy` (`書法筆順` — `PointerEvent` Pressure/Eraser `九宮格` Canvas, Taiwan MOE Stroke Order, `形聲字` Builder)
     5. `Speaking & Pitch` (`發音聲調` — Offline WebAudio $F_0$ Pitch-Contour Visualizer, Tone Sandhi & `ㄓㄔㄕㄖ vs ㄗㄘㄙ` Coach)
     6. `Vocab, SRS & Dojo` (`詞彙與大千` — TOCFL Word Bank, FSRS-Lite Queue, 8-Stage DaQian Typing Dojo & 3-Stage Match Arena)
2. **Phase 1 Shared UI Primitive Kit (`src/components/uiPrimitives.tsx`):**
   * Built in **Phase 1** before any feature studios in Phases 2–3 so every studio uses identical `<StudioHeaderBanner>`, `<StudioModeSwitcher>`, `<StylusButton>` (`>= 44×44 px`), `<HandednessToggle>`, `<ToneBadge>` (`WCAG_TONE_PALETTE`), `<ReturnBreadcrumbBar>`, and `<CrossStudioActionPills>`.
3. **Cross-Studio Context Handoff Bus (`src/lib/studioContextBus.ts`):**
   * Clicking any word, character, or sentence in *any* studio populates the persistent **Right Context & Quick-Practice Dock** and exposes 1-click **`[✒️ Write on Wacom]`**, **`[🎤 Coach Pitch ($F_0$)]`**, **`[📖 Open in Reader]`**, and **`[🧠 Boost in SRS]`** actions that deep-link into the target studio pre-loaded with that item and a 1-click **`← Return to [Source Studio]`** breadcrumb banner.
