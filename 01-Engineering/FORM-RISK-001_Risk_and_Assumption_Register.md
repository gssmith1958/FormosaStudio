# Risk & Assumption Register (`FORM-RISK-001`)

```yaml
id: FORM-RISK-001
type: Risk
title: Monolithic Source File Accretion Inherited from Chinese2 Prototype
status: Approved
version: 1.0.0
probability: High
impact: Medium
description: "In the un-governed Chinese2 prototype, 8 source files grew past 1,000 LOC (up to 1,689 LOC in curriculum.ts and 1,480 LOC in ZhuyinMatchGame.tsx), making maintenance and testing difficult."
mitigated_by:
  - FORM-REQ-0005
  - FORM-REQ-0019
```

```yaml
id: FORM-RISK-002
type: Risk
title: Character-by-Character Zhuyin Lookup Mis-Annotates Taiwanese Polyphones (破音字) and Cross-Strait Pronunciations (兩岸異讀字)
status: Approved
version: 1.0.0
probability: High
impact: High
description: "Chinese2's annotateTraditionalText() maps single characters to a single static reading, mis-annotating common words like 長大 (ㄓㄤˇ vs ㄔㄤˊ), 還錢 (ㄏㄨㄢˊ vs ㄏㄞˊ), 銀行 (ㄏㄤˊ vs ㄒㄧㄥˊ), and conjunctive 和 (Taiwan ㄏㄢˋ vs Mainland ㄏㄜˊ)."
mitigated_by:
  - FORM-REQ-0001
  - FORM-REQ-0002
```

```yaml
id: FORM-RISK-003
type: Risk
title: Browser Web Speech Recognition API Failure on Linux Desktops Leaves Pronunciation Studio Unusable
status: Approved
version: 1.0.0
probability: High
impact: High
description: "window.webkitSpeechRecognition requires cloud connectivity, is absent in Firefox/WebKit on Linux, and only returns text transcripts without measuring actual Mandarin pitch contours (F0)."
mitigated_by:
  - FORM-REQ-0015
  - FORM-REQ-0016
```

```yaml
id: FORM-RISK-004
type: Risk
title: Wacom Stylus Input Treated as Low-Frequency Mouse Drag Without Pressure, Eraser, or Palm Rejection
status: Approved
version: 1.0.0
probability: Medium
impact: High
description: "Using standard mouse events instead of W3C PointerEvent loses Wacom pen pressure (e.pressure), coalesced 200Hz sampling (getCoalescedEvents()), eraser nib detection, and pen-only palm rejection."
mitigated_by:
  - FORM-REQ-0012
  - FORM-REQ-0013
```

```yaml
id: FORM-RISK-005
type: Risk
title: English-Speaker Confusion Over Taiwanese Discount Math (八折 = 20% Off) and ROC Calendar Years (民國)
status: Approved
version: 1.0.0
probability: Medium
impact: Medium
description: "Native English speakers routinely misread Taiwanese discounts (interpreting 八折 as 80% off instead of 20% off), 萬 (10,000) number groupings, and 民國 calendar dates on Taiwanese receipts and signage."
mitigated_by:
  - FORM-REQ-0009
  - FORM-REQ-0011
```

---

## 2. Assumptions (`Volume 4 §5.5`)

```yaml
id: FORM-ASM-001
type: Assumption
title: Linux Desktop Browser Exposes W3C PointerEvent for Attached Wacom Tablet
status: Approved
version: 1.0.0
description: "Chromium and Firefox on Linux with libinput/xf86-input-wacom expose PointerEvent with pointerType='pen', pressure (0.0..1.0), tiltX/tiltY, and buttons=32 (eraser) to HTML5 Canvas elements."
traces_to:
  - FORM-PROJ-001
```

```yaml
id: FORM-ASM-002
type: Assumption
title: Web Audio API AnalyserNode Supports Offline Time-Domain Pitch Extraction
status: Approved
version: 1.0.0
description: "Standard navigator.mediaDevices.getUserMedia({ audio: true }) + AudioContext AnalyserNode provides float32 time-domain buffers at 44.1/48 kHz sufficient for 80–450 Hz human voice F0 autocorrelation without external cloud APIs."
traces_to:
  - FORM-PROJ-001
```
