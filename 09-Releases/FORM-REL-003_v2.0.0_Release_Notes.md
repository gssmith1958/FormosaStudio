# FormosaStudio (`FORM`) `v2.0.0` Release Notes (`FORM-REL-003`)

```yaml
id: FORM-REL-003
type: ValidationOutput
title: FormosaStudio v2.0.0 Release Notes — 5-Section Menu, Unified Stages 0–5 Syllabus, 5 Taiwan Arrival Scenarios, Standalone Administration & iPad mini 6 Overhaul
status: Approved
version: 2.0.0
project: FORM
owner: Principal Engineer
created_date: 2026-11-25
updated_date: 2026-11-25
framework_reference: "Volume 4 §14, Guide 002 §6, Guide 008 v0.9.4"
traces_to:
  - FORM-PLAN-001
  - FORM-TAILOR-001
  - FORM-DESCHAR-001
  - FORM-DEC-005
```

---

## 1. Release Overview (`v2.0.0` — Milestone A)

Approved under **`FORM-ECR-001`** and **`FORM-DEC-005`**, **`FormosaStudio v2.0.0`** resolves real-world navigation friction, unifies learning progression into a clear syllabus aligned to **TOCFL Level 4 / CEFR B2 (Classic HSK 5 Equivalent)**, expands onboarding to **5 real-life Taiwan arrival scenarios**, moves material management and settings into a **standalone Administration workspace**, and overhauls **iPad mini 6 Safari audio & responsive layout**.

## 2. Highlights

1. **5-Section Expandable Accordion Navigation (`Alt+1..5`):**
   - Clean, collapsible sections: **1. Today’s Session**, **2. Course Syllabus (`Stages 0–5`)**, **3. Practice Labs (`5` labs)**, **4. Reference & Help**, and **5. Administration** (standalone).
   - Auto-collapses at `<= 1180 px` (including **iPad mini 6** `1133×744` landscape & `744×1133` portrait) when entering Calligraphy or Speaking labs, with an **always-visible `☰ Menu`** button whenever collapsed.
2. **Unified Course Syllabus (`Stages 0–5` · Option A Layout):**
   - Consolidates Pimsleur, NTNU *Contemporary Chinese*, Taiwan Survival, Strokes, Custom Packs, and integrated **5-Question Stage Checkpoints (`>= 80%`)** under each stage (retiring the duplicate standalone 5-World Skill Tree).
   - Unambiguous dual badges clarify Taiwan's official **TOCFL** levels alongside **CEFR** and **Classic HSK 5** equivalence; Stages 4–5 carry a transparent `v2.0 Core Seed` banner ahead of Milestone B (`v2.1`).
3. **Syllabus-Adaptive Today’s 10-Min Session:**
   - Dynamically adapts to your active syllabus stage (`~70%` current stage + `~30%` spiral review), supports contextual **Peek Ahead** with training wheels preserved, and requires genuine Step 2 audio/recall & Step 3 DaQian/Wacom interaction before granting FSRS credit.
4. **Stage 0.5 Expanded to 5 Real-Life Taiwan Arrival Scenarios:**
   - *1. Taipei Café & Boba*, *2. 7-Eleven / FamilyMart Checkout*, *3. Taipei MRT & Directions*, *4. Night Market & Noodle Stall*, and *5. Restroom & Asking for Help* — audio-first, authentic Taiwan Mandarin (`捷運`/`洗手間`/`載具`/`老闆`), `>= 3/5` unlocks Stage 1, `5/5` awards *Taipei Arrival Ready*.
5. **Standalone Administration Workspace (`Alt+5`):**
   - Full Create/Edit/Delete CRUD for **Pimsleur Units**, **NTNU Lessons**, and **Custom Taiwan Scenarios** bound to `Stages 0–5`, with clean dynamic lexicon rebuild on delete.
   - **1-Click iPad/Desktop Audio, Voice & Mic Self-Test** (reports live sample rate, codec, `zh-TW` voices, and YIN `ms/frame` latency).
   - **Unified Desktop ↔ iPad JSON Backup & Transfer** bundling FSRS mastery + custom packs in one file.
6. **iPad mini 6 Safari Audio & Ergonomics:**
   - Shared `audioSessionManager.ts` + 2× anti-aliased YIN (`< 3.0 Hz` error at `48 kHz` and `44.1 kHz`), Safari `audio/mp4` recording & WebAudio replay, synchronous `AudioContext` unlock, `voiceschanged` caching, and compact calligraphy canvas sizing.

## 3. Deferred to Milestone B (`v2.1`)
- Expanded 2,500+ word TOCFL Band A/B lexicon & top 50 Taiwanese `成語` idioms, 400–600 char B2 Taiwan essays, and timed TOCFL Level 1–4 (HSK 5 equivalent) Mock Assessment.
