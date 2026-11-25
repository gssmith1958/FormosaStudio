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
updated_date: 2026-11-25
framework_reference: "Volume 4 §17, Volume 4 §18, Guide 001 §38 (§38.1 Project-Qualified FIRs) & §39A, Guide 006 Patterns 9 & 10"
traces_to:
  - FORM-TAILOR-001
```

---

## 1. Phase 0 Prototype Retrospective Lessons Learned from `Chinese2` (`FORM-LL-001`..`005`, `007`)

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

```yaml
id: FORM-LL-007
type: LessonLearned
title: Piece-Part Feature Accretion Glued Together Under Competing Navigation Layers Produced a Clunky, Siloed User Experience in Chinese2
status: Approved
version: 1.0.0
phase_discovered: Phase 0 (Chinese2 Prototype Retrospective — Principal Engineer & DEP-04 UX Audit)
category: End-to-End UI/UX Coherence & Information Architecture (ASEF Guide 008 & Pattern 20)
disposition: Mitigated by FORM-DEC-004, FORM-REQ-0018, FORM-REQ-0021, and Mandatory Phase 1-4 DEP-04 Co-Leadership
created_date: 2026-11-13
description: "Because `Chinese2` was developed in isolated piece parts and glued together over successive sessions without active end-to-end UI/UX governance (`DEP-04`), it accumulated three severe UX anti-patterns: (1) triple-stacked navigation chrome (`AppMenuBar.tsx` with 4 dropdown menus stacked above `WorkspaceTabBar.tsx` with 12 closable tab types stacked above per-tab sub-tab bars), (2) dead-end studio silos where clicking a word or step in `TodayStudyHub`, `GrammarAndReadingTab`, or `TaiwanSurvivalTab` could not pass context (`activeWord`, `activeCharacter`, `returnBreadcrumb`) to Speaking or Writing practice, and (3) inconsistent ad-hoc visual components and sub-44px hit targets across files."
preventive_action: "Mandated `DEP-04` (UI/UX & Accessibility Designer) as a Standing Co-Lead at Touchpoint A and Touchpoint B of every phase (Phases 1–4); established a single-row 6-Studio Shell, Phase 1 Shared UI Primitive Kit (`src/components/uiPrimitives.tsx`), and Cross-Studio Context Handoff Bus (`src/lib/studioContextBus.ts`) with 1-click Return Breadcrumbs in `FORM-DEC-004` and `FORM-REQ-0021`; and added mechanical verification of `DEP-04` phase sign-off in `08-Automation/check_structural_scaffolding.py`."
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
status: Rejected
version: 1.1.0
originating_lesson: FORM-LL-006
target_documents:
  - ASEF Guide 002 Tailoring.md
created_date: 2026-11-13
updated_date: 2026-11-25
problem_statement: "`ASEF Guide 002` defines `R1` and `R2` in the summary table, but its template (§3–§6) only illustrates `R3` mandatory artifacts, leaving a developer starting an `R1` or `R2` project without a concrete low-ceremony consolidation pattern or an `R1 -> R2` prototype graduation checklist."
proposed_change: "Add a 'Canonical R1 & R2 Tailoring Profiles (Consolidated Artifacts & 4-Gate Folding)' subsection and an 'R1 Prototype-to-R2 Graduation Pattern' to `ASEF Guide 002`, grounded in `FormosaStudio` (`n = 3`)."
adversarial_counter_review: "ASEF Framework Repository FIR_Counter_Review_Log.md (2026-11-25, cold-context Reviewer 1, subagent c6d8004d)"
counter_review_disposition: "Rejected (Superseded by ASEF Roadmap P0.3 — Guide 002 v0.9.8-0.9.9 already incorporates R1/R2 low-ceremony consolidation and R1->R2 graduation; residual 4-gate/6-8-register canon rejected as n=1 project-local and contradictory to low-ceremony R2 norm; Principal Engineer approved 2026-11-25)."
```

```yaml
id: FORM-LL-008
type: LessonLearned
title: Static Source-Code UI/UX Audits Cannot Substitute for Live Rendered Browser Visual & HMI Inspection
status: Approved
version: 1.0.0
phase_discovered: Phase 4 Post-Release User Visual Review (v1.0.0 -> v1.1.0 HMI Redesign)
category: Human-Machine Interface & Visual Verification (ASEF Guide 008)
disposition: Mitigated in FormosaStudio v1.1.0 Warm Paper Light + Calm Dark Left-Rail Redesign & Browser Screenshot Audit; promoted to FORM-FIR-002
created_date: 2026-11-19
description: "Although `DEP-04` (UI/UX & Accessibility Designer) audited all TypeScript/JSX components statically during Phases 1–4 and verified WCAG numeric contrast constants, >= 44px button styles, and LOC budgets, neither the builder nor `DEP-04` inspected rendered browser screenshots before `v1.0.0`. First-hand visual review immediately revealed harsh neon dark-slate color slabs, cramped 10–12px body text, multi-row top-chrome clutter, and missing daily/overall learning pathway progress feedback. Subsequently running live browser screenshot inspection caught 6 real rendered defects (invisible text in light-mode callouts, dark Wacom canvas leak, sidebar truncation, tab wrapping, and React DOM nesting warnings) that static review missed."
preventive_action: "Redesigned FormosaStudio (`v1.1.0`) with a Warm Paper Light + Calm Dark semantic token system, clean Left Sidebar Rail, modern 15–16px typography scale, Today's 10-Min Progress Ring, and 6-Stage Overall Learning Pathway, and verified every studio visually via live browser screenshots before sign-off. Promoted to `FORM FIR-002`."
```

```yaml
id: FORM-FIR-002
type: FrameworkImprovementRequest
project_qualified_citation: "FORM FIR-002"
title: Mandate Live Rendered Visual & HMI Screenshot Verification in ASEF Guide 008 Touchpoint B Reviews
status: Approved with Modification
version: 1.1.0
originating_lesson: FORM-LL-008
target_documents:
  - ASEF Guide 008 Usability and Design Quality.md
created_date: 2026-11-19
updated_date: 2026-11-25
problem_statement: "`ASEF Guide 008` defines usability and accessibility thresholds, but does not mechanically require inspecting live rendered screenshots of interactive GUI/web applications during `DEP-04` Touchpoint B sign-off, allowing visually unpleasant palettes, cramped typography, and missing user-journey progress cues to pass static code inspection."
proposed_change: "Add a mandatory 'Live Rendered Visual & HMI Inspection Gate' checklist to `ASEF Guide 008` requiring live browser/GUI screenshot review of primary user workflows, visual hierarchy, typography readability, color restraint, and explicit daily/overall progress feedback before any GUI Touchpoint B or Gate 6/7 sign-off."
adversarial_counter_review: "ASEF Framework Repository FIR_Counter_Review_Log.md (2026-11-25, cold-context Reviewer 1, subagent c6d8004d)"
counter_review_disposition: "Approved with Modification -> Incorporated in ASEF Guide 008 v0.9.4 (fixed target filename, removed project-local DEP-04/daily-progress/Gate 6-7 phrasing, added rigor-scaled static-inspection non-sufficiency rule for visual/GUI Touchpoint B with CLI/non-visual exemptions and headless PE handoff; Principal Engineer approved 2026-11-25)."
```

```yaml
id: FORM-LL-009
type: LessonLearned
title: Prototype Anchoring Bias, Late Domain-Expert Discovery & Tautological Verification in Folded-Gate R2 Left Day-1 Novice Onboarding Missing
status: Approved
version: 1.0.0
phase_discovered: Phase 4 Post-Release Pedagogical Audit (v1.1.0 -> v1.2.0 Stage 0 Novice Launchpad)
category: Scoping, ConOps Elicitation & Verification Integrity (Volume 4 §5, Guide 002, Pattern 13)
disposition: Mitigated in FormosaStudio v1.2.0 (Stage 0 Beginner Launchpad, Pinyin+Zhuyin Bridge, Taiwanized Pimsleur, Easy-First SVG Strokes, Interactive Recall Lessons); promoted to FORM-FIR-003
created_date: 2026-11-19
description: "Across FormosaStudio (n=3 Pure R2), four post-release user findings traced to systemic scoping/verification blind spots: (1) Prototype Anchoring Bias in R1->R2 graduation focused Phase 0 ConOps on remediating technical defects from Chinese2 rather than modeling the Day-0/Day-1 novice user's starting state (zero Zhuyin, zero tone ear, zero stroke literacy); (2) Domain Experts (DEP-01, DEP-03) were commissioned at Implementation Touchpoint A (after requirements were baselined) rather than challenging ConOps/Requirements at Gate 1; (3) Tautological automated tests passed synthetic sine waves and self-referential hand-typed stroke coordinates while real microphone capture and rendered stroke alignment failed; and (4) Folding Gates 2–5 skipped a lightweight human visual/journey alignment checkpoint prior to construction."
preventive_action: "Add a mandatory Cold-Start Persona Journey check, a pre-baseline Domain Challenge (Touchpoint 0), a ban on tautological self-referential test fixtures, and a brief Stakeholder Visual & Journey Alignment checkpoint before Phase 1 construction—even under folded R2 gates. Promoted to `FORM FIR-003`."
```

```yaml
id: FORM-FIR-003
type: FrameworkImprovementRequest
project_qualified_citation: "FORM FIR-003"
title: Add Touchpoint 0 Pre-Baseline Domain Challenge, Cold-Start Persona Journey & Anti-Tautology Verification Rules to Volume 4, Guide 002 & Guide 006
status: Approved with Modification
version: 1.1.0
originating_lesson: FORM-LL-009
target_documents:
  - Volume 4 — Engineering Process.md
  - Volume 6 — AI Collaboration Architecture.md
  - ASEF Guide 002 Tailoring.md
created_date: 2026-11-19
updated_date: 2026-11-25
problem_statement: "Commissioning Domain Expert Panels only at Implementation Touchpoint A/B checks compliance against already-frozen requirements, allowing R1->R2 prototype anchoring bias to omit Day-0/Day-1 user prerequisites and allowing tautological synthetic tests to pass broken real-hardware/UI workflows."
proposed_change: "Introduce 'Touchpoint 0 (Pre-Baseline Domain & Cold-Start Challenge)' at Gate 1/2 before freezing requirements, require a 5-minute Stakeholder Visual & User-Journey Alignment Checkpoint before Phase 1 even in folded R2 gates, and prohibit tautological test fixtures where tests validate geometry/signals against the same hand-authored constants used by the renderer."
adversarial_counter_review: "ASEF Framework Repository FIR_Counter_Review_Log.md (2026-11-25, cold-context Reviewer 2, subagent fa189cd9)"
counter_review_disposition: "Approved with Modification -> Incorporated in ASEF Guide 002 v0.9.11, Volume 4 v0.9.18, and Volume 6 v0.9.19 (rejected Touchpoint 0, mandatory R2 5-min checkpoint, and new Guide 006 pattern; kept 3 zero-ceremony clarifications: Prototype Anchoring Bias warning in Guide 002, pre-baseline Touchpoint A timing clarification in Volume 6 §14.3.2 & Volume 4 §7.8, and shared-constant/hardware-validation clarification in Volume 4 §12.7; Principal Engineer approved 2026-11-25)."
```

```yaml
id: FORM-LL-010
type: LessonLearned
title: Presenting Single-Author AI Proposals Before Specialist Review Forces the Decision Maker to Police Team Alignment and Hides Dissenting Opinions
status: Approved
version: 1.0.0
phase_discovered: Post-v1.3.0 ECR & v2.0.0->v2.1.0 UI/UX Design Review
category: Domain Expert Governance & Decision Hygiene (Volume 6 §14.3, Guide 006 Pattern 15 & 17)
disposition: Mitigated in FormosaStudio GEMINI.md (Standing Rule 3 Pre-Decision Specialist Review & Dissent Mandate) and promoted to FORM-FIR-004
created_date: 2026-11-25
description: "Twice during post-release evolution of FormosaStudio (once on FORM-ECR-001 Milestone A scope and again on the v2.1.0 Crisp Neutral Studio UI/UX overhaul), the AI drafted a single-author recommendation and asked the Principal Engineer (decision maker) for approval before convening the triggered Domain Expert Panel roles. Both times the PE had to explicitly ask 'Does the team agree?', and both times convening the independent specialists immediately uncovered concrete defects and legitimate dissents (e.g., 12 ECR conditions; Dark Mode 2.49:1 primary-button contrast fail; RubyText 11px Zhuyin collapse; DEP-02 Wacom 38px sidebar dissent; 2 missing dark-slate files). ASEF Volume 6 §14.3.2/§14.3.4 pins Touchpoint A to 'before Application Construction' and 'before BOE approval', leaving interactive design/ECR proposals unprotected and providing no dissent-preservation obligation."
preventive_action: "Codified in FormosaStudio GEMINI.md Rule 3: every substantive recommendation presented to the decision maker MUST first undergo triggered Specialist Panel review and include a structured Specialist Team View with per-role verdicts and explicit dissenting opinions preserved verbatim. Promoted to `FORM FIR-004`."
```

```yaml
id: FORM-FIR-004
type: FrameworkImprovementRequest
project_qualified_citation: "FORM FIR-004"
title: Mandate Pre-Decision Multi-Specialist Review and Explicit Dissent Preservation in Decision-Bearing AI Proposals (Volume 6 §14.3 & Guide 006)
status: Proposed
version: 1.0.0
originating_lesson: FORM-LL-010
target_documents:
  - Volume 6 — AI Collaboration Architecture.md
  - ASEF Guide 006 AI Collaboration Patterns.md
created_date: 2026-11-25
updated_date: 2026-11-25
problem_statement: "Volume 6 §14.3.2 (Touchpoint A) and §14.3.4 (Trigger-Table Coverage) bind Domain Expert consultation to 'before Application Construction' and 'before BOE approval', leaving substantive mid-project proposals (ECRs, architecture trade-offs, UI/UX redesigns, pedagogical pivots) presented as unreviewed single-author AI recommendations. Furthermore, §14.3.3 defines subagent authority positioning without prohibiting AI synthesis from averaging away or omitting specialist dissents before human decision-making."
proposed_change: "Add a zero-ceremony clause to Volume 6 §14.3.2 (and cross-reference in Guide 006 Pattern 15/17): (1) Any substantive technical, domain, hardware, or UI/UX recommendation requiring Principal Engineer / decision-maker approval MUST be pre-reviewed by the relevant triggered Domain Expert Panel roles prior to presentation; and (2) the decision brief MUST include a structured Specialist Team View displaying each role's verdict (Approve / Approve with Conditions / Object) and explicitly preserving any dissenting opinions and unresolved trade-offs rather than flattening them into a single-voice summary."
```
