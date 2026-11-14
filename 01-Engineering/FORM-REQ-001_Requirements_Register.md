# Requirements Register (`FORM-REQ-001`)

```yaml
id: FORM-REQ-0001
type: Requirement
title: Forward Maximum-Matching (FMM) Word Tokenizer & Polyphone (破音字) Disambiguation Engine
status: Approved
version: 1.0.0
phase: Phase 1
category: Functional
priority: Mandatory
description: "The system shall segment Traditional Chinese text using a Forward Maximum-Matching (FMM) word tokenizer (up to 6-character compounds) prior to character fallback so multi-character polyphones (破音字) receive their contextually correct Zhuyin reading."
acceptance_criteria:
  - "Correctly disambiguates at least 25 core Taiwanese Mandarin polyphone pairs in automated tests, including 長 (長大 ㄓㄤˇ vs 很長 ㄔㄤˊ), 還 (還錢 ㄏㄨㄢˊ vs 還有 ㄏㄞˊ), 行 (銀行 ㄏㄤˊ vs 不行 ㄒㄧㄥˊ), 得 (覺得 ㄉㄜˊ vs 得去 ㄉㄟˇ vs 跑得快 ㄉㄜ˙), 樂 (音樂 ㄩㄝˋ vs 快樂 ㄌㄜˋ), 會 (會計 ㄎㄨㄞˋ vs 開會 ㄏㄨㄟˋ), 數 (數學 ㄕㄨˋ vs 數一數 ㄕㄨˇ), 著 (看著 ㄓㄜ˙ vs 睡著 ㄓㄠˊ), 重 (重要 ㄓㄨㄥˋ vs 重新 ㄔㄨㄥˊ), and 便 (便宜 ㄆㄧㄢˊ vs 方便 ㄅㄧㄢˋ)."
traces_to:
  - FORM-CAP-001
```

```yaml
id: FORM-REQ-0002
type: Requirement
title: Taiwan Ministry of Education (教育部) Standard Pronunciation & Tone Sandhi Engine
status: Approved
version: 1.0.0
phase: Phase 1
category: Functional
priority: Mandatory
description: "The linguistic engine shall enforce Taiwan Ministry of Education (MOE) standard pronunciations (兩岸異讀字) and automatically detect and display spoken vs. written Zhuyin for 3rd-tone chains, 不 (ㄅㄨˋ), and 一 (ㄧ) tone sandhi."
acceptance_criteria:
  - "Annotates Taiwan MOE pronunciations accurately for 垃圾 (ㄌㄜˋ ㄙㄜˋ), 星期 (ㄒㄧㄥ ㄑㄧˊ), 研究 (ㄧㄢˊ ㄐㄧㄡˋ), 企業 (ㄑㄧˋ ㄧㄝˋ), 法國 (ㄈㄚˋ ㄍㄨㄛˊ), 液體 (ㄧㄝˋ ㄊㄧˇ), 微糖 (ㄨㄟˊ ㄊㄤˊ), and conjunctive 和 (ㄏㄢˋ in 我和你 / 我和家人)."
  - "Detects 2-syllable and 3-syllable 3rd-tone sandhi (e.g., 我很好 -> ㄨㄛˇ ㄏㄣˊ ㄏㄠˇ), 不 before 4th tone (ㄅㄨˊ), and 一 before 4th tone (ㄧˊ) vs. 1st/2nd/3rd tones (ㄧˋ)."
traces_to:
  - FORM-CAP-001
```

```yaml
id: FORM-REQ-0003
type: Requirement
title: Complete Contemporary Chinese (Volumes 1–6) & Pimsleur (Units 1–19) Curriculum Database
status: Approved
version: 1.0.0
phase: Phase 1
category: Functional
priority: Mandatory
description: "The curriculum database shall include comprehensive lesson progressions, grammar patterns, cultural notes, and TOCFL Band Novice 1 through Band C1 vocabulary across all 6 volumes of NTNU's A Course in Contemporary Chinese and Pimsleur Mandarin I Units 1–19."
acceptance_criteria:
  - "Every volume (Volumes 1–6) in contemporaryChineseData contains at least 8–15 structured lessons (remediating the 1-lesson stubs in Volumes 4–6 of Chinese2)."
  - "Vocabulary catalog covers TOCFL Bands Novice 1, Novice 2, Band A1, Band A2, Band B1, and Band B2."
traces_to:
  - FORM-CAP-002
```

```yaml
id: FORM-REQ-0004
type: Requirement
title: FSRS-Lite Stability/Difficulty Scheduler & Portable JSON Backup/Restore
status: Approved
version: 1.0.0
phase: Phase 1
category: Functional
priority: Mandatory
description: "The progress store shall schedule character, word, and stroke-writing reviews using an adaptive stability/difficulty interval multiplier and provide 1-click JSON export and validated JSON import."
acceptance_criteria:
  - "Tracks separate mastery records for reading/recognition, vocabulary recall, and Wacom character writing."
  - "Exports complete UserProgressState to a timestamped JSON file and restores state losslessly with schema validation."
traces_to:
  - FORM-CAP-002
```

```yaml
id: FORM-REQ-0005
type: Requirement
title: Modular Core & Data Decomposition Under 800 LOC Ceiling
status: Approved
version: 1.0.0
phase: Phase 1
category: Maintainability
priority: Mandatory
description: "All linguistic engines, curriculum datasets, and UI components ported or refactored from the Chinese2 prototype shall be decomposed into modular TypeScript files strictly under the 800 LOC hard ceiling."
acceptance_criteria:
  - "08-Automation/check_structural_scaffolding.py reports 0 files > 800 LOC across 07-Configuration/Source/src/."
traces_to:
  - FORM-CAP-001
  - FORM-CAP-002
```

```yaml
id: FORM-REQ-0006
type: Requirement
title: Adaptive i+1 Graded Reader Across TOCFL Bands A1–B2
status: Approved
version: 1.0.0
phase: Phase 2
category: Functional
priority: Mandatory
description: "The Reading Studio shall provide at least 8 multi-paragraph Taiwan-set graded stories spanning TOCFL Novice through Band B2, computing live Known (Lv.2+), Familiar (Lv.1), and Target i+1 (Unseen) word percentages against the learner's progress store."
acceptance_criteria:
  - "Displays a live Comprehensibility Badge (e.g., 92% Known — Optimal i+1 Zone) for every story."
  - "Clicking any segmented word opens its contextual Zhuyin, Taiwan MOE note, tone sandhi breakdown, and 1-click 'Add to Study Queue / Practice on Wacom' action."
traces_to:
  - FORM-CAP-003
```

```yaml
id: FORM-REQ-0007
type: Requirement
title: Custom Traditional Chinese Text Importer & Instant Cloze Generator
status: Approved
version: 1.0.0
phase: Phase 2
category: Functional
priority: Mandatory
description: "The Reading Studio shall allow the user to paste or load any custom Traditional Chinese text (Taiwanese news, messages, menus, textbook passages), automatically segment and annotate it with contextual Zhuyin, compute its i+1 score, and generate interactive sentence cloze drills from its sentences."
acceptance_criteria:
  - "Segments custom pasted text using the FMM polyphone tokenizer in < 50 ms for passages up to 2,000 characters."
  - "Generates playable multiple-choice clozes from target i+1 words in the pasted passage."
traces_to:
  - FORM-CAP-003
```

```yaml
id: FORM-REQ-0008
type: Requirement
title: Spoken vs. Written Taiwan Register Bridge (口語 vs. 書面語)
status: Approved
version: 1.0.0
phase: Phase 2
category: Functional
priority: Mandatory
description: "The Grammar & Reading Studio shall include a dedicated Spoken (口語) vs. Formal Written (書面語) Register Bridge mapping everyday Taiwanese spoken connectors and verbs to their formal newspaper/signage equivalents with interactive register-conversion drills."
acceptance_criteria:
  - "Covers at least 15 core 口語 <-> 書面語 pairs (e.g., 可是/然而, 還有/此外, 因為…所以…/由於…因此…, 不但/不僅, 這時候/此時, 常常/往往, 覺得/認為, 差不多/大致)."
traces_to:
  - FORM-CAP-003
```

```yaml
id: FORM-REQ-0009
type: Requirement
title: Taiwan in 10 Minutes a Day — Bite-Sized Visual Survival Modules & Sticky Labels
status: Approved
version: 1.0.0
phase: Phase 2
category: Functional
priority: Mandatory
description: "The system shall provide a structured 'Taiwan in 10 Minutes a Day' practical survival track tailored for native English speakers, featuring interactive visual Household/Environment Sticky Labels, the 12 'Swiss-Army-Knife' survival sentence frames, and Taiwan street/shop sign decoders."
acceptance_criteria:
  - "Includes at least 6 themed 10-minute modules: (1) Home, AC Remote & Trash/Recycling Sticky Labels, (2) Taiwanese Breakfast (早餐店) & Bento (便當) Ordering, (3) 7-Eleven/FamilyMart Checkout & Discount Math (八折 = 20% off), (4) MRT, HSR, YouBike & Taxi Addresses, (5) Clinic (診所), Pharmacy (藥局) & Food Allergy Cards, and (6) Everyday Street & Door Signs (推/拉, 內用/外帶, 營業中, 博愛座)."
  - "Provides a printable/viewable Sticky-Label Card sheet mode with large Traditional characters, vertical Zhuyin, and English cues."
traces_to:
  - FORM-CAP-004
```

```yaml
id: FORM-REQ-0010
type: Requirement
title: Interactive Taiwanese Paper Tick-Menu (點菜單) Simulator & Taiwanese Pragmatics (語助詞 & 臺語)
status: Approved
version: 1.0.0
phase: Phase 2
category: Functional
priority: Mandatory
description: "The survival studio shall include an interactive Taiwanese laminated paper tick-menu (點菜單) simulator (mountable with mouse or Wacom pen) and a Taiwanese Spoken Pragmatics lab covering sentence-final particles (語助詞) and everyday Hokkien (臺語) loanwords."
acceptance_criteria:
  - "Allows fulfilling real-world dining orders (e.g., 'Dine-in table 5: 1 large beef noodle mild spicy, 1 cucumber side dish, 2 soy milks') by marking quantities on an authentic Taiwanese 點菜單 and verifying the NT$ bill total."
  - "Covers at least 8 Taiwanese sentence-final particles (啦, 喔, 耶, 欸, 齁, 囉, 嘛, 吧) and 10 everyday Hokkien-in-Mandarin expressions (歹勢, 阿公/阿嬤, 頭家, 龜毛, 麻吉, 落漆, 鬱卒, 凍蒜, 買單, 黑輪)."
traces_to:
  - FORM-CAP-004
```

```yaml
id: FORM-REQ-0011
type: Requirement
title: Taiwan Functional Listening Gym (NT$ Prices, 民國 Dates, Addresses & Receipts)
status: Approved
version: 1.0.0
phase: Phase 2
category: Functional
priority: Mandatory
description: "The system shall provide a Functional Listening Reflex Gym training rapid auditory comprehension of spoken Taiwanese NT$ prices,打折 discounts, ROC 民國 calendar dates (Year - 1911), Taiwan mobile phone numbers (09XX-XXX-XXX), Uniform Invoice (統一發票) 3-digit endings, and 段/巷/弄/號/樓 addresses."
acceptance_criteria:
  - "Generates randomized audio-first drills across all 5 categories and validates numeric/structured user input with instant explanation of萬 (10,000), 折 (discount folds), and 民國 year conversion."
traces_to:
  - FORM-CAP-004
```

```yaml
id: FORM-REQ-0012
type: Requirement
title: Wacom Stylus (PointerEvent) Calligraphy Canvas with Pressure, Coalesced Sampling & Eraser Support
status: Approved
version: 1.0.0
phase: Phase 3
category: Functional
priority: Mandatory
description: "The Wacom Calligraphy Studio shall capture W3C PointerEvent input ('pen', 'mouse', 'touch') with live stylus pressure mapping (e.pressure -> dynamic stroke width), high-frequency coalesced event sampling (getCoalescedEvents()), pen-only palm-rejection toggle, and hardware Wacom eraser nib / barrel button shortcuts."
acceptance_criteria:
  - "Renders variable-width tapered ink strokes driven by PointerEvent.pressure (0.0..1.0) on traditional Taiwanese 九宮格 (9-square) and 田字格 grids."
  - "Detects Wacom eraser nib (buttons === 32 or button === 5) to automatically undo/erase strokes, and supports a Left-Handed / Right-Handed toolbar layout toggle."
traces_to:
  - FORM-CAP-005
```

```yaml
id: FORM-REQ-0013
type: Requirement
title: Taiwan MOE Standard Vector Stroke-Order Grading Engine (國字標準字體筆順)
status: Approved
version: 1.0.0
phase: Phase 3
category: Functional
priority: Mandatory
description: "The stroke-order engine shall evaluate user-drawn Wacom strokes against Taiwan Ministry of Education (MOE) standard stroke sequences across Guided Trace (描紅), Audio/Zhuyin Dictation Recall (聽寫默寫), and Freehand Overlay Comparison (臨摹) modes."
acceptance_criteria:
  - "Grades each stroke on start-point proximity, direction vector angle (cosine similarity / delta trajectory), and sequential stroke order across a curated bank of core Traditional characters (including Taiwan MOE standard forms such as 裡, 為, 骨, 黃, 國, 臺, 灣, 麵, 捷, 運, 請, 謝)."
  - "Provides immediate visual feedback on out-of-order or reversed-direction strokes and updates character writing mastery in FSRS."
traces_to:
  - FORM-CAP-005
```

```yaml
id: FORM-REQ-0014
type: Requirement
title: Semantic-Phonetic (形聲字) Radical & Sound-Component Workbench
status: Approved
version: 1.0.0
phase: Phase 3
category: Functional
priority: Mandatory
description: "The Character Studio shall include a Semantic-Phonetic (形聲字) Workbench linking semantic radicals (部首: 氵, 言, 食, 扌, 心, 辵) with phonetic sound components (聲符: 青, 馬, 巴, 包, 方, 交, 寺) so learners can write and compare whole character families on the Wacom canvas."
acceptance_criteria:
  - "Covers at least 10 high-yield phonetic series (40+ Traditional characters), displaying how the radical shifts meaning while the phonetic component preserves or systematically relates the Zhuyin rhyme/initial."
traces_to:
  - FORM-CAP-005
```

```yaml
id: FORM-REQ-0015
type: Requirement
title: Offline WebAudio Autocorrelation / YIN Pitch-Contour (F0) Extractor
status: Approved
version: 1.0.0
phase: Phase 3
category: Functional
priority: Mandatory
description: "The Speaking Studio shall include a 100% offline Web Audio API time-domain pitch-contour (F0) extractor using normalized autocorrelation / YIN within the human vocal range (75–450 Hz), converting spoken pitch into Speaker-Normalized Chao 5-Level Tone values (1.0–5.0)."
acceptance_criteria:
  - "Extracts F0 pitch frames from Float32Array audio buffers with < 3 Hz error on synthetic/reference test waveforms (Tone 1 flat 55, Tone 2 rising 35, Tone 3 dipping 214, Tone 4 falling 51, Tone 5 neutral)."
  - "Operates 100% offline in Linux browsers without requiring cloud webkitSpeechRecognition."
traces_to:
  - FORM-CAP-006
```

```yaml
id: FORM-REQ-0016
type: Requirement
title: Live Dual-Curve Pitch-Contour Visualizer, Tone Sandhi & Retroflex/Sibilant Coach
status: Approved
version: 1.0.0
phase: Phase 3
category: Functional
priority: Mandatory
description: "The Speaking Studio shall overlay the learner's captured F0 pitch contour directly onto the native target tone/sandhi curve, compute a quantitative Tone Contour Match Score (0–100%), provide instant self-recording playback comparison, and include targeted Taiwanese retroflex (ㄓㄔㄕㄖ) vs. flat sibilant (ㄗㄘㄙ) minimal-pair drills."
acceptance_criteria:
  - "Renders target Chao pitch curves alongside the learner's recorded pitch trajectory and computes a deterministic contour correlation score."
  - "Provides 1-click 'Replay My Voice vs. Native Speaker' audio playback."
traces_to:
  - FORM-CAP-006
```

```yaml
id: FORM-REQ-0017
type: Requirement
title: Preserved & Modularized DaQian 8-Stage Typing Dojo, Skill Tree & Match Arena
status: Approved
version: 1.0.0
phase: Phase 3
category: Functional
priority: Mandatory
description: "The system shall preserve the 8-stage Taiwan DaQian (大千式) touch-typing dojo, 5-World Skill Tree, and 3-Stage Match Arena from the Chinese2 prototype while decomposing their >1,100-LOC source files below the 800-LOC structural budget."
acceptance_criteria:
  - "All 8 DaQian typing stages, per-key error heatmaps, blind keycap modes, and Match Arena stages operate with zero regressions and <= 800 LOC per file."
traces_to:
  - FORM-CAP-002
```

```yaml
id: FORM-REQ-0018
type: Requirement
title: Ergonomic Wacom & Keyboard Usability Thresholds (ASEF Guide 008)
status: Approved
version: 1.0.0
phase: Phase 4
category: Usability
priority: Mandatory
description: "Per ASEF Guide 008 Part 1, the interface shall satisfy measurable Learnability, Efficiency, Error Recovery, and WCAG 2.1 Level AA Accessibility thresholds across keyboard and Wacom stylus interaction."
acceptance_criteria:
  - "Efficiency: Global Omnibar (Ctrl+K), Side Reference Dock, and all primary workspaces are reachable in <= 2 clicks or 1 keyboard shortcut, with <= 8 top-level workspace tabs."
  - "Wacom Ergonomics: All interactive canvas toolbar buttons have hit targets >= 44x44 px, support a 1-click Left/Right-Handed layout swap, and require zero hover-only interactions."
  - "Accessibility: All text/badge color tokens meet WCAG 2.1 Level AA contrast (>= 4.5:1 normal text, >= 3.0:1 UI components)."
traces_to:
  - FORM-CONOPS-001
```

```yaml
id: FORM-REQ-0019
type: Requirement
title: Automated Verification Suite & Mechanical Structural Governance
status: Approved
version: 1.0.0
phase: Phase 4
category: Verification
priority: Mandatory
description: "Every requirement (FORM-REQ-0001..0020) shall be verified by automated tests executed via the Node.js/TypeScript test runner and mechanical governance checks in 08-Automation/."
acceptance_criteria:
  - "100% of requirements (20/20) trace to passing automated verification tests and 08-Automation/check_structural_scaffolding.py + sync_traceability_graph.py pass with 0 errors."
traces_to:
  - FORM-CONOPS-001
```

```yaml
id: FORM-REQ-0020
type: Requirement
title: Cross-Module State Synchronization Between Reader, Wacom Studio, Survival & SRS Store
status: Approved
version: 1.0.0
phase: Phase 4
category: Functional
priority: Mandatory
description: "Practicing a character or word in the Adaptive i+1 Reader, 'Taiwan in 10 Minutes a Day' Survival Track, Wacom Calligraphy Studio, or Speaking Studio shall immediately update the unified FSRS progressStore and reflect in Today's Study Hub and Adaptive Zhuyin Fading across all open tabs."
acceptance_criteria:
  - "Verified by end-to-end Golden Scenarios (FORM-VAL-001..005) and Pattern 21 consumer propagation checks."
traces_to:
  - FORM-CAP-002
  - FORM-CAP-003
  - FORM-CAP-004
  - FORM-CAP-005
  - FORM-CAP-006
```
