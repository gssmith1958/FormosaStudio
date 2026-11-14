# Lessons Learned & Framework Improvement Request Register (`FORM-LL-001`)

```yaml
id: FORM-LL-001-REG
type: KnowledgeRegister
title: FormosaStudio (n=3 Pure R2) Prototype Retrospective Lessons Learned and ASEF FIR Register
status: Active
version: 1.0.0
project: FORM
owner: Principal Engineer
created_date: 2026-11-13
updated_date: 2026-11-13
framework_reference: "Volume 4 §17, Volume 4 §18, Guide 001 §38 (§38.1 Project-Qualified FIRs) & §39A, Guide 006 Patterns 9 & 10"
traces_to:
  - FORM-TAILOR-001
```

---

## 1. Phase 0 Prototype Retrospective Lessons Learned from `Chinese2` (`FORM-LL-001`..`005`)

```yaml
id: FORM-LL-001
type: LessonLearned
title: Un-Governed Prototype Development Without Mechanical LOC Ceilings Produced 8 Files Between 1,003 and 1,689 LOC
status: Approved
version: 1.0.0
phase_discovered: Phase 0 (Chinese2 Prototype Retrospective)
category: Structural Modularity (Guide 002 §2 & Guide 006 Pattern 12)
disposition: Mitigated by FORM-REQ-0005 and 08-Automation/check_structural_scaffolding.py
created_date: 2026-11-13
description: "In the un-governed `/home/gssmith/Programming/Chinese2` prototype (17,228 LOC across 26 files), the absence of a mechanical per-file LOC ceiling allowed 8 files to exceed 1,000 LOC (`curriculum.ts` 1,689 LOC, `ZhuyinMatchGame.tsx` 1,480 LOC, `VocabularyWorkbenchTab.tsx` 1,353 LOC, `LessonPlayer.tsx` 1,303 LOC, `zhuyinEngine.ts` 1,234 LOC, `DaqianTypingTeacher.tsx` 1,182 LOC, `pimsleurData.ts` 1,162 LOC, `App.tsx` 1,003 LOC), confirming that monolith accretion occurs in TypeScript/React projects just as it did in FDSS's Python codebase."
preventive_action: "Wired `08-Automation/check_structural_scaffolding.py` at Phase 0 initiation to enforce a 600-LOC soft warning and an 800-LOC hard block across all `.ts` and `.tsx` source files in `FormosaStudio`."
```

```yaml
id: FORM-LL-002
type: LessonLearned
title: Character-by-Character Zhuyin Lookup Silently Mis-Annotates Taiwanese Polyphones (破音字) and Cross-Strait Pronunciations (兩岸異讀字)
status: Approved
version: 1.0.0
phase_discovered: Phase 0 (Chinese2 Prototype Retrospective)
category: Domain Correctness (Guide 006 Pattern 13)
disposition: Mitigated by FORM-REQ-0001, FORM-REQ-0002, and FORM-DEC-001
created_date: 2026-11-13
description: "Without a Computational Linguist (`DEP-01`) Touchpoint A review, `Chinese2`'s `zhuyinEngine.ts` implemented `annotateTraditionalText()` as a character-by-character lookup against a static ~220-character single-reading dictionary (`CHAR_ZHUYIN_DICT`), causing systematic mis-annotations on polyphones (`長大` annotated as `ㄔㄤˊ ㄉㄚˋ` instead of `ㄓㄤˇ ㄉㄚˋ`; `還錢` as `ㄏㄞˊ` instead of `ㄏㄨㄢˊ`; `銀行` as `ㄒㄧㄥˊ` instead of `ㄏㄤˊ`) and omitting Taiwan MOE standard pronunciations (`和` = `ㄏㄢˋ`, `垃圾` = `ㄌㄜˋ ㄙㄜˋ`)."
preventive_action: "Specified Forward Maximum-Matching (FMM) word tokenization and Taiwan MOE standard pronunciation lexicons in `FORM-REQ-0001` and `FORM-REQ-0002`."
```

```yaml
id: FORM-LL-003
type: LessonLearned
title: Relying on Browser Cloud SpeechRecognition Breaks Offline Linux Usage and Ignores Mandarin Pitch Contours (F0)
status: Approved
version: 1.0.0
phase_discovered: Phase 0 (Chinese2 Prototype Retrospective)
category: Architecture & Hardware Integration
disposition: Mitigated by FORM-REQ-0015, FORM-REQ-0016, and FORM-DEC-002
created_date: 2026-11-13
description: "`Chinese2`'s `SpeakingStudioTab.tsx` relied solely on `window.webkitSpeechRecognition`, which is unavailable offline or on Firefox/WebKit Linux desktops and only checks character transcript overlap without measuring vocal pitch ($F_0$) or tone contours."
preventive_action: "Designed a 100% offline WebAudio time-domain autocorrelation/YIN pitch-contour ($F_0$) extractor (`pitchTracker.ts`) mapped to speaker-normalized Chao 1–5 tone curves (`FORM-DEC-002`)."
```

```yaml
id: FORM-LL-004
type: LessonLearned
title: Un-Governed Curriculum Data Left Volumes 2–6 of Contemporary Chinese as Partial 1-to-4 Lesson Stubs Despite Full Source PDFs in Assets
status: Approved
version: 1.0.0
phase_discovered: Phase 0 (Chinese2 Prototype Retrospective)
category: Epistemic Honesty & Scope Completeness (Standing Rule 1)
disposition: Mitigated by FORM-REQ-0003 and FORM-REQ-0006..0011
created_date: 2026-11-13
description: "Although `Chinese2/assets/` contained all 6 Volumes and 6 Workbooks of *A Course in Contemporary Chinese*, `contemporaryChineseData.ts` silently populated all 15 lessons only for Volume 1, dropping to 4 lessons in Volume 2, 2 in Volume 3, and 1 stub lesson each in Volumes 4–6, and only 2 hardcoded stories in `GrammarAndReadingTab.tsx`."
preventive_action: "Mandated full Volumes 1–6 lesson coverage (`FORM-REQ-0003`), TOCFL A1–B2 adaptive `i+1` stories + custom text import (`FORM-REQ-0006`..`0008`), and the 'Taiwan in 10 Minutes a Day' practical survival track (`FORM-REQ-0009`..`0011`)."
```

```yaml
id: FORM-LL-005
type: LessonLearned
title: Omitting Hardware Stylus (PointerEvent) and Stroke-Order Practice Leaves Orthographic Memory Underserved
status: Approved
version: 1.0.0
phase_discovered: Phase 0 (Chinese2 Prototype Retrospective)
category: Capability & Hardware Ergonomics
disposition: Mitigated by FORM-REQ-0012, FORM-REQ-0013, FORM-REQ-0014, and FORM-DEC-003
created_date: 2026-11-13
description: "`Chinese2` trained recognition and DaQian keyboard typing, but had zero support for the user's attached Wacom pen tablet or Taiwan MOE standard stroke order (`國字標準字體筆順`) and semantic-phonetic (`形聲字`) character composition."
preventive_action: "Added the Wacom Stylus (`PointerEvent` pressure + coalesced sampling + eraser nib) Calligraphy & Taiwan MOE Vector Stroke-Order Studio (`FORM-REQ-0012`..`0014`)."
```

---

## 2. ASEF `R2` Framework Execution Lessons Learned & Candidate FIRs

```yaml
id: FORM-LL-006
type: LessonLearned
title: ASEF Guide 002 §3 Lists R3 Artifacts Under 'Included (Mandatory)' Without Defining a Canonical R1/R2 Consolidated Artifact Profile
status: Approved
version: 1.0.0
phase_discovered: Phase 0.1 (Pure-R2 Tailoring Initiation)
category: Framework Tailoring Ergonomics (Guide 002)
disposition: Mitigated in FORM-TAILOR-001 §3/§6 and promoted to FORM-FIR-001
created_date: 2026-11-13
description: "When initiating `FormosaStudio` as a Pure-`R2` project (`n = 3`), `ASEF Guide 002 Tailoring.md` (§Engineering Rigor Levels) defines `R2` as 'Light documentation, Informal reviews, Git + Markdown', but §3 ('Included / Excluded Artifacts') lists 'Full traceability, AI Session Records, Knowledge Packages, Lessons Learned' under 'Included (Mandatory)' without specifying how an `R2` project consolidates governance documents (e.g., folding the 9 Engineering Gates into 4 milestone baselines and consolidating Planning/Context/Architecture into 6–8 compact Markdown registers)."
preventive_action: "Defined the explicit 4-gate folded `R2` disposition and consolidated document set in `FORM-TAILOR-001`, and drafted `FORM FIR-001` (`FORM-FIR-001`) to codify the `R1`/`R2` Starter Profile in `ASEF Guide 002`."
```

```yaml
id: FORM-FIR-001
type: FrameworkImprovementRequest
project_qualified_citation: "FORM FIR-001"
title: Add Explicit R1 (Prototype-to-Baseline Graduation) and R2 (Consolidated 4-Gate Personal Tool) Starter Profiles to ASEF Guide 002
status: Proposed
version: 1.0.0
originating_lesson: FORM-LL-006
target_documents:
  - ASEF Guide 002 Tailoring.md
created_date: 2026-11-13
updated_date: 2026-11-13
problem_statement: "`ASEF Guide 002` defines `R1` and `R2` in the summary table, but its template (§3–§6) only illustrates `R3` mandatory artifacts, leaving a developer starting an `R1` or `R2` project without a concrete low-ceremony consolidation pattern or an `R1 -> R2` prototype graduation checklist."
proposed_change: "Add a 'Canonical R1 & R2 Tailoring Profiles (Consolidated Artifacts & 4-Gate Folding)' subsection and an 'R1 Prototype-to-R2 Graduation Pattern' to `ASEF Guide 002`, grounded in `FormosaStudio` (`n = 3`)."
```
