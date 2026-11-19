# FormosaStudio (`FORM`) — Phase 2 Pre-Implementation Touchpoint A Panel Report (`FORM-DEP-TPA-002`)

* **Document ID:** `FORM-DEP-TPA-002`
* **Version:** `1.0.0`
* **Date:** `2026-11-13`
* **Phase:** Phase 2 — Adaptive $i + 1$ Reader, Spoken/Written Register Bridge & "Taiwan in 10 Minutes a Day" Survival Studio
* **Traces To:** `FORM-BOE-002`, `FORM-REQ-0006`, `FORM-REQ-0007`, `FORM-REQ-0008`, `FORM-REQ-0009`, `FORM-REQ-0010`, `FORM-REQ-0011`, `FORM-REQ-0005`, `FORM-REQ-0021`, `FORM-DEP-UX-001`
* **Panel Verdict:** **`PASS` (Approved for Phase 2 Construction — `DEP-01`, `DEP-03`, `DEP-04` Unanimous Concurrence)**

---

## 1. Trigger Table Evaluation (`Pattern 13`, `Pattern 17`)

| Role ID | Domain Expert Role | Phase 2 Touchpoint A Status | Verdict |
| :--- | :--- | :--- | :--- |
| **`DEP-01`** | Taiwanese Mandarin (`zh-TW`) & TOCFL Computational Linguist | **Triggered** (8 graded stories `Novice 1–Band B2`, `< 50 ms` FMM passage segmentation, 16 `口語 <-> 書面語` pairs, 8 `語助詞` & 10 Hokkien `臺語` loanwords) | **PASS** |
| **`DEP-02`** | Acoustic DSP & Wacom Stylus Hardware Engineer | **Deferred to Phase 3** (Advisory pointer check: `>= 44×44 px` Wacom tap targets on `點菜單` quantity steppers) | **N/A (Advisory)** |
| **`DEP-03`** | SLA & "Taiwan in 10 Minutes a Day" Survival Pedagogist | **Triggered** ($i + 1$ comprehensibility zones `90–98%`, cloze distractor design, 6 survival sticky-label modules, 12 Swiss-Army-Knife frames, `點菜單` missions, 5-category Listening Gym) | **PASS** |
| **`DEP-04`** | UI/UX & Accessibility Designer (`Guide 008`) | **Triggered — Mandatory Standing Co-Lead (`FORM-LL-007`)** (Enforces `uiPrimitives.tsx`, `<RubyText>`, `studioContextBus.ts` handoffs, and Printable Sticky-Label Sheet mode) | **PASS** |

---

## 2. Binding Phase 2 Design Specifications

1. **8 Taiwan-Set Graded Stories (`src/data/gradedStoriesData.ts` — `FORM-REQ-0006`):**
   - Multi-paragraph stories spanning TOCFL `Novice 1` through `Band B · Level 2 (高階級)` set in Taipei breakfast shops, MRT stations, Shida musical garbage truck routes, Tainan HSR trips, Taipei apartment hunting, Hualien/Taroko cycling, Hsinchu tech interviews, and night-market cultural preservation.
   - Live comprehensibility calculation (`analyzePassageComprehensibility` in `src/lib/readingEngine.ts`):
     $$\text{knownPct} = \text{round}\!\left(100 \times \frac{N_{\text{Known (Lv.2+)}} + 0.5 \cdot N_{\text{Familiar (Lv.1)}}}{N_{\text{TotalWords}}}\right)$$
     classified into `Optimal i+1 Zone (90%–98%)`, `Fluent Review Zone (> 98%)`, or `Intensive Scaffolding Zone (< 90%)`.
2. **Custom Traditional Chinese Text Importer & Cloze Generator (`src/lib/readingEngine.ts` — `FORM-REQ-0007`):**
   - Single-pass linear FMM tokenization (`< 50 ms` for passages up to `2,000` characters) and deterministic 4-choice sentence cloze drill generation from target $i + 1$ words.
3. **16 Spoken vs. Written Taiwan Register Bridge Pairs (`src/data/gradedStoriesData.ts` — `FORM-REQ-0008`):**
   - Covers 16 core `口語 <-> 書面語` pairs (`可是/然而`, `還有/此外`, `因為…所以…/由於…因此…`, `不但/不僅`, `這時候/此時`, `常常/往往`, `覺得/認為`, `差不多/大致`, `馬上/立即`, `很多/許多`, `跟/與`, `幫忙/協助`, `如果/倘若`, `比方說/例如`, `特別/尤其`, `到最後/最終`) with interactive conversion drills.
4. **Taiwan in 10 Minutes a Day — 6 Sticky-Label Modules & 12 Swiss-Army-Knife Frames (`src/data/taiwanSurvivalData.ts` — `FORM-REQ-0009`):**
   - 6 themed 10-minute modules (Home/AC/Trash, Breakfast/Bento, 7-Eleven/FamilyMart & Discounts, MRT/HSR/Taxi, Clinic/Pharmacy/Allergy, Street/Door Signs), 12 plug-and-play survival sentence frames, and a `🖨️ Printable Sticky-Label Sheet Mode`.
5. **Interactive Taiwanese Laminated Paper Tick-Menu (`點菜單`) & Pragmatics (`src/components/TickMenuAndPragmatics.tsx` — `FORM-REQ-0010`):**
   - Real-world dining missions (e.g., *"Dine-in Table 5: 1 Large Braised Beef Noodle Mild Spicy, 1 Cucumber Side Dish, 2 Iced Soy Milks — NT$250"*), Wacom-friendly `>= 44×44 px` quantity steppers, 8 Taiwanese sentence-final particles (`啦, 喔, 耶, 欸, 齁, 囉, 嘛, 吧`), and 10 everyday Hokkien (`臺語`) expressions (`歹勢, 阿公/阿嬤, 頭家, 龜毛, 麻吉, 落漆, 鬱卒, 凍蒜, 買單, 黑輪`).
6. **5-Category Taiwan Functional Listening Gym (`src/lib/listeningGymEngine.ts` — `FORM-REQ-0011`):**
   - Randomized & seeded drills across (1) NT$ prices & `萬` (`10,000`), (2) `打折` discount math (`八折 = 20% off`), (3) ROC `民國` dates (`Year - 1911`), (4) `09XX` mobile numbers & `統一發票` 3-digit endings, and (5) `段/巷/弄/號/樓` addresses.
