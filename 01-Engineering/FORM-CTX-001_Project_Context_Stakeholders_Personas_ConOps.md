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

## 4. Primary User Workflows (`Volume 4 §5.5`)

```yaml
id: FORM-WF-001
type: Workflow
title: 10-Minute Daily Taiwan Survival & Paper Menu (點菜單) Workflow
status: Approved
version: 1.0.0
description: "Learner opens Today's Hub -> launches the daily 'Taiwan in 10 Minutes a Day' survival module -> reviews 6 visual sticky labels & 2 power frames -> completes an interactive Wacom/click Taiwanese breakfast or beef-noodle paper tick-menu (點菜單) and rapid NT$/民國 listening check."
traces_to:
  - FORM-CAP-004
```

```yaml
id: FORM-WF-002
type: Workflow
title: Adaptive i+1 Reading & Polyphone Inspection Workflow
status: Approved
version: 1.0.0
description: "Learner selects a graded story or pastes a Taiwanese article -> engine segments words via FMM, applies contextual polyphone (破音字) and Taiwan MOE Zhuyin, computes the i+1 comprehensibility badge (e.g., 92% Known), fades mastered character Zhuyin, and queues clicked unknown words into FSRS."
traces_to:
  - FORM-CAP-001
  - FORM-CAP-003
```

```yaml
id: FORM-WF-003
type: Workflow
title: Wacom Stylus MOE Stroke-Order & Dictation Workflow
status: Approved
version: 1.0.0
description: "Learner selects a character or vocabulary word -> writes strokes with the Wacom pen on the 九宮格 grid using live pressure sensitivity -> engine validates stroke count, start point, and direction vector against Taiwan MOE standard stroke order -> flipping to the Wacom eraser undoes mistakes."
traces_to:
  - FORM-CAP-005
```

```yaml
id: FORM-WF-004
type: Workflow
title: Offline WebAudio F0 Pitch-Contour Shadowing Workflow
status: Approved
version: 1.0.0
description: "Learner plays a Taiwanese sentence -> speaks into the microphone -> WebAudio pitch tracker extracts the live F0 contour, normalizes it to the speaker's vocal range (Chao 1–5 scale), overlays it on the target tone/sandhi curve, and scores tone-contour accuracy offline."
traces_to:
  - FORM-CAP-006
```
