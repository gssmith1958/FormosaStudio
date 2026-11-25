# FormosaStudio (`FORM`) `v2.1.0` Release Notes (`FORM-REL-004`)

```yaml
id: FORM-REL-004
type: ValidationOutput
title: FormosaStudio v2.1.0 Release Notes — Crisp Neutral Studio UI/UX Design System Overhaul & FORM FIR-004 Governance
status: Approved
version: 2.1.0
project: FORM
owner: Principal Engineer
created_date: 2026-11-25
updated_date: 2026-11-25
framework_reference: "Volume 4 §14, Volume 6 §14.3, Guide 008 v0.9.4"
traces_to:
  - FORM-DESCHAR-001
  - FORM-DEC-005
  - FORM-LL-010
```

---

## 1. Highlights (`v2.1.0` — Crisp Neutral Studio UI/UX Overhaul)

1. **Crisp Neutral Studio Palette & Verified WCAG 2.1 AA Contrast (Light + Dark):**
   - Replaced Warm Paper beige and 244 legacy dark-slate seams across all 8 studios/modals with one unified neutral system (`#FAFAFA` / `#FFFFFF` / `#F4F4F5` Light; `#0F1115` / `#161920` / `#1C2029` Dark) and hairline `1px` dividers.
   - Fixed dark-mode primary button contrast (`#041412` on `#14B8A6` = `> 7.5:1`), deepened Light Tone 3 to `#92400E` (`7.09:1` on white, `6.37:1` on amber tint), tightened Dark Tone 3 to `#FBBF24`, and verified all Light + Dark text and 5 tones programmatically (`>= 4.5:1`).
2. **Automatic System Theme Sync (`prefers-color-scheme`) & Zero-FOUC iPadOS Launch:**
   - Defaults to **Match System** (`Auto`), syncing live with Ubuntu Desktop and iPadOS Dark/Light appearance, with a pre-hydration `<script>` and dynamic `<meta name="theme-color">` in `index.html` to eliminate white launch flashes on iPad mini 6 PWA.
   - Preserves soft rice paper (`#FCFBF7`) on the Light Wacom/Apple Pencil calligraphy canvas (`#161920` Dark).
3. **Restored Modern Typography & Crisp Vertical Zhuyin:**
   - Removed the legacy `.text-xs`/`.text-sm` CSS overrides that flattened visual hierarchy, decoupled `RubyText.tsx` onto explicit readable Zhuyin sizes (`12px / 13px / 14.5px / 16px`, `leading-[1.15]`), added Ubuntu offline `'Noto Sans CJK TC'`, and dropped unused `Noto Serif TC`.
4. **Antigravity-Style Flush Sidebar Rail & `lucide-react` Monoline Icons:**
   - Flattened boxed sidebar cards into a clean flush rail (`40px` fine-pointer desktop rows, `>= 44px` on touch/iPad mini 6 and all footer/toolbar controls), replaced emojis/Unicode chrome with tree-shaken `lucide-react` vector icons, fixed `h-14` (`56px`) topbar height, and collapsed duplicate Stage 0 CTAs into one clear primary action above the fold.
5. **Process Governance (`FORM-LL-010` & `FORM FIR-004`):**
   - Codified the Pre-Decision Specialist Review & Explicit Dissent Mandate in `GEMINI.md` and logged candidate ASEF `FORM FIR-004` in `05-Knowledge/FORM-LL-001_Lessons_Learned_and_FIR_Register.md`.
