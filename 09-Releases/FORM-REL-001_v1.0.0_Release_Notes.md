# FormosaStudio (`FORM`) `v1.0.0` Release Notes & Closure Record (`FORM-REL-001`)

```yaml
id: FORM-REL-001
type: ValidationOutput
title: FormosaStudio v1.0.0 Production Release Notes & Gate 8/9 Project Closure Record
status: Approved
version: 1.0.0
project: FORM
owner: Principal Engineer
created_date: 2026-11-19
updated_date: 2026-11-19
framework_reference: "Volume 4 §14, Volume 4 §15, Guide 002 §6, Guide 007 §12"
traces_to:
  - FORM-PLAN-001
  - FORM-TAILOR-001
  - FORM-VER-001
```

---

## 1. Release Overview (`v1.0.0` — `Gate 8/9` Approved)

**FormosaStudio (`寶島華語正體與注音全能工坊`) `v1.0.0`** is the production release graduated from the exploratory `Chinese2` (`R1`) prototype under **ASEF Pure `R2`** (`n = 3` empirical validation). It delivers a 100% offline-capable Taiwanese Traditional Chinese (`正體字`) & Ministry of Education (`教育部`) vertical Bopomofo (`注音符號`) workstation unified into a single-row **6-Studio Shell**.

### Quick Launch & Verification Commands
```bash
cd 07-Configuration/Source
npm run dev      # Start local Vite dev server (http://localhost:5173 — unlocks WebAudio mic)
npm test         # Execute all 41 automated tests across Phases 1–4 & Golden Scenarios
npm run build    # Run strict TypeScript check (tsc -b) + Vite production bundle (dist/)
```

---

## 2. Delivered 6-Studio Capabilities

1. **Studio 1 — 今日學習 (`Today & Curriculum Hub` · `Alt+1`):** Inline 10-Minute Daily Flow Runner, Pimsleur Taiwanese Mandarin Phase 1 (Units 1–19 + Custom Admin Units), NTNU *A Course in Contemporary Chinese* (`當代中文課程`) Volumes 1–6 (61 Lessons + Custom Admin Lessons), and live TOCFL Novice 1 – Band B2 Readiness Dashboard.
2. **Studio 2 — 臺灣生存 (`10-Min Taiwan Survival` · `Alt+2`):** 6 Visual Sticky-Label Household Modules with Printable Sheet Mode, 12 Swiss-Army-Knife survival sentence frames, interactive Taiwanese Paper Tick-Menu (`點菜單`) simulator, 8 Taiwanese sentence-final particles (`語助詞`) + 10 Hokkien (`臺語`) expressions, and 5-Category Functional Listening Gym (NT$萬, `打折`, `民國` dates, `09XX`/Uniform Invoices, `段/巷/弄` addresses).
3. **Studio 3 — 閱讀語法 (`Reader & Grammar` · `Alt+3`):** 8 multi-paragraph Taiwan-set graded stories (`Novice 1`–`Band B2`) with live `$i+1$` Comprehensibility scoring, `< 50 ms` Custom Traditional Chinese Text Importer & Instant 4-Choice Cloze Generator, and 16 Spoken (`口語`) vs. Written (`書面語`) Taiwan Register Bridge drills.
4. **Studio 4 — 書法筆順 (`Wacom Calligraphy` · `Alt+4`):** W3C `PointerEvent` Wacom stylus canvas (`2.5–14.0 px` pressure tapering, `getCoalescedEvents()`, eraser nib / barrel button undo, Pen-Only Palm Rejection, Left/Right-Handed docking swap), 20-character Taiwan MOE Standard Vector Stroke-Order Grader (`裡, 為, 骨, 黃, 國, 臺, 灣, 麵, 捷, 運, 請, 謝` across `描紅 / 臨摹 / 聽寫默寫` with `逆筆` detection), and 10-Series Semantic-Phonetic (`形聲字`) Workbench (`46` Traditional characters).
5. **Studio 5 — 發音聲調 (`Speaking & Pitch Lab` · `Alt+5`):** 100% offline WebAudio time-domain YIN CMNDF $F_0$ pitch extractor (`75–450 Hz`, `< 3.0 Hz` error), Speaker-Normalized Chao `1.0–5.0` Dual-Curve Visualizer, 1-click **"Replay My Voice vs. Native Speaker"**, 8 Spoken Taiwanese Tone Sandhi phrases, and 10 Retroflex (`ㄓㄔㄕㄖ`) vs. Flat Sibilant (`ㄗㄘㄙ`) minimal pairs.
6. **Studio 6 — 詞彙與大千 (`Vocab, SRS & Dojo` · `Alt+6`):** 8-Stage Taiwan DaQian (`大千式`) Touch-Typing Dojo (`41` keys, per-key error heatmap, blind-keycap mode), FSRS-Lite due review flashcards + `.json` file export/restore (`formosa-progress-v2`), TOCFL Band A/B Word Bank, 5-World Skill Tree (`20` nodes), and 3-Stage Match Arena.
7. **Global Productivity & Documentation (`Ctrl+K`, `⚙️ Resource Admin`, `📌 Context Dock`, `?`/`F1`):** Multi-script Global Omnibar searching vocabulary, `兩岸異讀字`, `破音字`, and MOE stroke characters; 3-step Curriculum & Resource Admin Manager with Pattern 21 live propagation; Collapsible Side Reference Dock; and both standalone ([FORM-MAN-001](file:///home/gssmith/Programming/FormosaStudio/09-Releases/FORM-MAN-001_FormosaStudio_User_Manual.md)) and in-app interactive User's Manuals.

---

## 3. Prototype Graduation Impact (`Chinese2` `R1` → `FormosaStudio` `v1.0.0` `R2`)

| Engineering Metric | `Chinese2` (`R1` Prototype) | `FormosaStudio` `v1.0.0` (`R2`) |
| :--- | :---: | :---: |
| **Source Files Exceeding `800` LOC** | `8` files (`1,003–1,689` LOC) | **`0` files** (`36` files, max `599` LOC, `0` warnings) |
| **Polyphone (`破音字`) & MOE `兩岸異讀字` Engine** | Single-char lookup (mis-annotated) | **FMM Word Tokenizer (`26` polyphone pairs `100%`, `12` MOE readings + sandhi)** |
| **NTNU *Contemporary Chinese* Coverage** | Stubs in Vols. 2–6 (`1–4` lessons) | **All `6` Volumes (`61` complete lessons + Admin importer)** |
| **Wacom Stylus & MOE Stroke Grading** | None | **W3C `PointerEvent` + `20` MOE Vector Characters + `形聲字` Workbench** |
| **Speaking Pronunciation Feedback** | Cloud `webkitSpeechRecognition` only | **100% Offline WebAudio YIN $F_0$ (`< 3 Hz` error) + Dual-Curve Chao `1–5`** |
| **Top-Level Navigation Architecture** | 3 competing chrome layers (`12` tabs) | **Single-Row `6` Permanent Studios + Return Breadcrumb + Omnibar (`Ctrl+K`)** |
| **Automated Verification & Requirements** | `0` tests / ad-hoc scope | **`41/41` tests PASS · `23/23` Requirements Verified · `5/5` Golden Scenarios PASS** |

---

## 4. Gate 8/9 Closure & Baseline Approval
- **`FORM-BSL-003` (`Gate 6/7`):** `Approved` (`1.0.0`, `2026-11-19`)
- **`FORM-BSL-004` (`Gate 8/9`):** `Approved` (`1.0.0`, `2026-11-19`)
- **Empirical Knowledge Package:** [FORM-EVAL-001_ASEF_N3_R2_Empirical_Scorecard.md](file:///home/gssmith/Programming/FormosaStudio/05-Knowledge/FORM-EVAL-001_ASEF_N3_R2_Empirical_Scorecard.md) & [FORM-LL-001_Lessons_Learned_and_FIR_Register.md](file:///home/gssmith/Programming/FormosaStudio/05-Knowledge/FORM-LL-001_Lessons_Learned_and_FIR_Register.md) (`FORM FIR-001`).
