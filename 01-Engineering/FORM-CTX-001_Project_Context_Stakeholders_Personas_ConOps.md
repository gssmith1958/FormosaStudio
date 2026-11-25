# Project Context, Stakeholders, Personas, ConOps, Capabilities & Workflows (`FORM-CTX-001`)

```yaml
id: FORM-PROJ-001
type: Project
title: FormosaStudio — Taiwan-Based Traditional Chinese (zh-TW) Language Training System
status: Approved
version: 1.0.0
project: FORM
owner: Principal Engineer
created_date: 2026-11-13
updated_date: 2026-11-13
rigor_level: R2
domain: "Computational Linguistics (zh-TW), Acoustic Pitch Signal Processing, Wacom Stylus Calligraphy & Second-Language Acquisition"
```

---

## 1. Stakeholders & Personas (`Volume 4 §5.2–§5.4`)

```yaml
id: FORM-STK-001
type: Stakeholder
title: Principal Engineer & Primary Learner (Native English Speaker Mastering Taiwanese Mandarin)
status: Approved
version: 1.0.0
role: Accountable Decision Maker & Daily End User
traces_to:
  - FORM-PROJ-001
```

```yaml
id: FORM-PER-001
type: Persona
title: Adult Native English Speaker Training for Real-World Taiwan Fluency & Literacy
status: Approved
version: 1.0.0
description: "Uses a Linux desktop workstation with an attached Wacom pen tablet and microphone. Wants authentic Taiwanese Mandarin (臺灣國語, vertical Zhuyin ㄅㄆㄇㄈ, Traditional characters 正體字, DaQian touch-typing, Wacom stroke-order writing, offline acoustic pitch feedback, and '10 Minutes a Day' Taiwan survival skills) without Mainland Beijingisms or >1,000-LOC unmaintainable prototype code."
traces_to:
  - FORM-STK-001
```

---

## 2. Operational Concept (`ConOps` — `Volume 4 §5.4`)

```yaml
id: FORM-CONOPS-001
type: OperationalConcept
title: FormosaStudio Integrated Daily Taiwanese Mandarin Workstation ConOps
status: Approved
version: 1.0.0
description: "FormosaStudio operates locally in the browser on Linux with zero cloud account dependencies. The learner follows a guided 10-to-20 minute daily loop across 4 integrated modalities: (1) 'Taiwan in 10 Minutes a Day' practical survival & functional listening (sticky labels, paper tick-menus 點菜單, NT$ prices, 民國 dates, MRT/clinic survival), (2) Adaptive i+1 Graded Reading with word-segmented polyphone (破音字) and Taiwan MOE (兩岸異讀字) Zhuyin fading, (3) Wacom Stylus Calligraphy & MOE Stroke-Order tracing/dictation on 九宮格 grids, and (4) Offline WebAudio F0 Pitch-Contour & Tone Sandhi speaking practice."
traces_to:
  - FORM-PROJ-001
  - FORM-PER-001
```

---

## 3. Capability Model (`Volume 4 §5.5`)

```yaml
id: FORM-CAP-001
type: Capability
title: Context-Aware Taiwan MOE Linguistic & Polyphone (破音字) Engine
status: Approved
version: 1.0.0
description: "Forward maximum-matching (FMM) word segmentation resolving polyphones (長大 vs 很長, 還錢 vs 還有, 銀行 vs 不行, 覺得 vs 得去), Taiwan MOE cross-strait pronunciations (和=ㄏㄢˋ, 垃圾=ㄌㄜˋ ㄙㄜˋ, 星期=ㄒㄧㄥ ㄑㄧˊ, 研究=ㄧㄢˊ ㄐㄧㄡˋ), and 3rd-tone/不/一 tone sandhi."
traces_to:
  - FORM-CONOPS-001
```

```yaml
id: FORM-CAP-002
type: Capability
title: Complete Contemporary Chinese (Vols. 1–6) & Pimsleur (Units 1–19) Curriculum + FSRS-Lite Store
status: Approved
version: 1.0.0
description: "Full lesson, grammar, and TOCFL Band A1–C1 vocabulary progression with stability/difficulty FSRS-lite spaced repetition and 1-click JSON backup/restore."
traces_to:
  - FORM-CONOPS-001
```

```yaml
id: FORM-CAP-003
type: Capability
title: Adaptive i+1 Graded Reader, Custom Text Studio & 口語/書面語 Register Bridge
status: Approved
version: 1.0.0
description: "Multi-level Taiwan graded stories plus paste-any-text studio computing live Known/Familiar/Target (i+1) percentages against the learner's mastery store, paired with spoken-to-written register mapping."
traces_to:
  - FORM-CONOPS-001
```

```yaml
id: FORM-CAP-004
type: Capability
title: Taiwan in 10 Minutes a Day Practical English-Speaker Survival & Functional Listening Gym
status: Approved
version: 1.0.0
description: "Bite-sized 10-minute survival modules covering visual household sticky labels, interactive Taiwanese paper tick-menus (點菜單), 12 Swiss-Army-Knife survival sentence frames, 打折 discount math, 民國 dates, 段/巷/弄/號 addresses, 語助詞 particles, everyday Hokkien (臺語) loanwords, and rapid listening drills."
traces_to:
  - FORM-CONOPS-001
```

```yaml
id: FORM-CAP-005
type: Capability
title: Wacom Stylus (PointerEvent) Calligraphy & Taiwan MOE Stroke-Order Studio
status: Approved
version: 1.0.0
description: "Hardware-accelerated HTML5 Canvas utilizing W3C PointerEvent pen pressure (e.pressure), coalesced high-rate sampling (getCoalescedEvents()), pen-only palm rejection, Wacom eraser/barrel button shortcuts, Taiwan MOE vector stroke-order grading, and 形聲字 radical-phonetic compounding."
traces_to:
  - FORM-CONOPS-001
```

```yaml
id: FORM-CAP-006
type: Capability
title: Offline WebAudio F0 Pitch-Contour Visualizer & Pronunciation Coach
status: Approved
version: 1.0.0
description: "Real-time microphone autocorrelation/YIN fundamental frequency (F0) pitch extraction plotted in Hz and Chao 1–5 tone levels directly over native reference contours, scoring Tone 1–5 and sandhi contour correlation 100% offline."
traces_to:
  - FORM-CONOPS-001
```

---

## 4. Primary User Workflows (`Volume 4 §5.5` — Updated `v2.0.0` via `FORM-ECR-001`)

```yaml
id: FORM-WF-001
type: Workflow
title: Real-World Taiwan Survival, Paper Tick-Menu (點菜單) & Functional Listening Workflow
status: Approved
version: 2.0.0
description: "Learner drills practical Day-1 Taiwan survival cards (Bathrooms & Help, Prices & Paying, Directions/MRT/Taxis, Food & Boba, 7-Eleven & Hotels, Allergies & Emergencies), completes a blank laminated paper tick-menu (點菜單), practices 語助詞 (with 4-item context check) & 臺語 loanwords, and trains rapid 5-category listening reflex (NT$萬, 打折, 民國 dates, 09XX/發票, 段/巷/弄 addresses)."
traces_to:
  - FORM-CAP-004
```

```yaml
id: FORM-WF-002
type: Workflow
title: Adaptive i+1 Reading, Custom Text Cloze & 口語/書面語 Register Bridge Workflow
status: Approved
version: 2.0.0
description: "Learner reads a graded Taiwan story (English hidden by default) or pastes any Taiwanese Traditional article (< 50 ms FMM segmentation), sees live % Known & adaptive Zhuyin fading, disambiguates Taiwan MOE polyphones (破音字), completes hidden-source Cloze drills and un-leaked 口語 ↔ 書面語 Register Bridge drills, and queues unknown words into FSRS."
traces_to:
  - FORM-CAP-001
  - FORM-CAP-003
```

```yaml
id: FORM-WF-003
type: Workflow
title: Wacom & Apple Pencil MOE Stroke-Order, Calligraphy & 形聲字 Workflow
status: Approved
version: 2.0.0
description: "Learner selects a starter or MOE character (auto-collapsed sidebar on iPad mini 6 landscape for full Apple Pencil room) -> traces, freehands, or writes from dictation on 九宮格 grids using live stylus pressure/eraser -> engine grades against exact offline Taiwan MOE stroke vectors (visual Demo grants zero fake mastery) -> explores 形聲字 radical-phonetic families."
traces_to:
  - FORM-CAP-005
```

```yaml
id: FORM-WF-004
type: Workflow
title: iPad-Smooth Offline Acoustic Tone, Sandhi & Minimal-Pair Coaching Workflow
status: Approved
version: 2.0.0
description: "Learner records live speech offline on Ubuntu Linux Chrome or iPad mini 6 Safari via unified audioSessionManager (2x anti-aliased YIN < 5 ms/frame, audio/mp4 on Safari, serialized speaker/mic handoff) -> sees live Chao 1–5 pitch contour vs target (empty until recorded; Simulate is preview-only) -> replays My Voice vs Native -> practices truly randomized ㄓㄔㄕㄖ vs ㄗㄘㄙ minimal pairs with mic comparison."
traces_to:
  - FORM-CAP-006
```

```yaml
id: FORM-WF-005
type: Workflow
title: Stage 0 Cold-Start Foundation & 5 Real-Life Taiwan Arrival Scenarios Workflow
status: Approved
version: 2.0.0
description: "Absolute-beginner English speaker completes 5 verified micro-modules: (0.1) Unified Tone Ear & Voice Lab (mic pitch ribbon + blind 10-item check + Quiet-Room fallback), (0.2) 37-Symbol Zhuyin Map + family Syllable Blender + blind Audio->Zhuyin check, (0.3) Grammar Survival Map + 3/4 Sentence Builder, (0.4) Interactive 8-Stroke Practice Pad (6/8) + unseen Radical Logic Check, and (0.5) First 10 Taipei Phrases + 5 real-life Taiwan arrival scenarios (Café/Boba, 7-Eleven, MRT/Directions, Night Market, Restroom/Help; >=3/5 gate)."
traces_to:
  - FORM-CAP-002
  - FORM-CAP-004
  - FORM-CAP-005
  - FORM-CAP-006
```

```yaml
id: FORM-WF-006
type: Workflow
title: Syllabus-Adaptive 10-Minute Daily Guided Session Workflow
status: Approved
version: 2.0.0
description: "Learner opens Today's Adaptive Session (calm single-focus view) -> completes 3 daily steps dynamically scoped to their current Syllabus Stage (~70% current stage + ~30% spiral review of earlier stages, with Stage 1 spiraling Stage 0 foundations, genuine Step 2/3 interaction required for FSRS credit, and contextual Peek-Ahead with training wheels)."
traces_to:
  - FORM-CAP-002
  - FORM-CAP-004
```

```yaml
id: FORM-WF-007
type: Workflow
title: Linear Course Syllabus Progression (Stages 0–5 · Zero to TOCFL Level 4 / HSK 5 Equivalent) Workflow
status: Approved
version: 2.0.0
description: "Learner navigates one authoritative expandable Course Syllabus (Stages 0–5 mapped unambiguously to TOCFL Level 1 A1 through Level 4 Band B2 / Classic HSK 5 Equivalent) -> uses Option A stage layout (single Recommended Next CTA + expandable Pimsleur, NTNU, Survival, and Character/Story tracks) -> completes verified Pimsleur Recall (>=75%), shuffled NTNU checks, and 5-question Stage Checkpoints (>=80%, consolidating the legacy 5-World Skill Tree)."
traces_to:
  - FORM-CAP-002
```

```yaml
id: FORM-WF-008
type: Workflow
title: Unified Vocab Bank, FSRS Queue, DaQian Touch-Typing & Shuffled Match Arena Workflow
status: Approved
version: 2.0.0
description: "Learner clears FSRS flashcards (with inline Listen audio), filters the TOCFL Novice 1–B2 Word Bank, practices 8-stage Taiwan DaQian touch-typing (Hint Key excluded from WPM/FSRS mastery), and drills the independently shuffled 3-Stage Match Arena."
traces_to:
  - FORM-CAP-002
```

```yaml
id: FORM-WF-009
type: Workflow
title: Standalone Administration, Custom Material CRUD, Audio Self-Test & Desktop-iPad Continuity Workflow
status: Approved
version: 2.0.0
description: "Learner opens standalone Administration to Create/Edit/Delete custom Pimsleur units, NTNU lessons, and Custom Taiwan Scenarios/Flashcards (with targetStage 0..5 binding and clean DYNAMIC_LEXICON rebuild), tune hardware/UI preferences, run a 1-click iPad/Desktop Audio, Voice & Mic Self-Test, and export/import unified Desktop <-> iPad JSON backups including custom packs."
traces_to:
  - FORM-CAP-002
```
