/**
 * FormosaStudio (FORM) — Phase 2 Taiwan Functional Listening Gym & Tick-Menu Order Verifier
 * Trains rapid auditory & numeric comprehension across 5 Taiwanese daily survival categories:
 * 1. NT$ Prices & 萬 (10,000) units
 * 2. 打折 Discounts (八折 = 20% off, 七五折 = 25% off)
 * 3. ROC 民國 Calendar Dates (民國 Year + 1911 = Gregorian Year)
 * 4. Taiwan Mobile Numbers (09XX-XXX-XXX) & Uniform Invoice (統一發票) 3-Digit Endings
 * 5. Taipei/Taiwan 段/巷/弄/號/樓 Street Addresses
 * Traces to: FORM-REQ-0011, FORM-REQ-0010, FORM-REQ-0005, FORM-DEP-TPA-002
 */

import {
  TICK_MENU_CATALOG,
  TickMenuOrderMission,
} from '../data/taiwanSurvivalData.ts';

export type ListeningGymCategory =
  | 'nt_prices'
  | 'discounts'
  | 'minguo_dates'
  | 'phone_invoice'
  | 'addresses';

export interface ListeningGymDrillItem {
  id: string;
  category: ListeningGymCategory;
  categoryLabel: string;
  spokenTranscriptTraditional: string;
  spokenTranscriptZhuyin: string;
  questionPrompt: string;
  inputPlaceholder: string;
  expectedCanonicalAnswer: string;
  acceptedAnswers: string[];
  multipleChoiceOptions: string[];
  conversionFormulaNote: string;
}

export interface ListeningEvaluationResult {
  isCorrect: boolean;
  normalizedUserAnswer: string;
  expectedAnswer: string;
  explanation: string;
}

export interface TickMenuSelectionState {
  diningMode: 'dine_in' | 'takeout';
  tableNumber: string;
  quantities: Record<string, number>;
  spiceNotes: Record<string, 'none' | 'mild' | 'medium'>;
}

export interface TickMenuVerificationResult {
  isCompleteMatch: boolean;
  calculatedTotalNtd: number;
  expectedTotalNtd: number;
  discrepancies: string[];
  summaryMessage: string;
}

export const LISTENING_GYM_CATEGORIES: {
  id: ListeningGymCategory;
  labelZh: string;
  labelEn: string;
  ruleSummary: string;
}[] = [
  {
    id: 'nt_prices',
    labelZh: '新臺幣與「萬」金額',
    labelEn: 'NT$ Prices & 萬 (10,000) Units',
    ruleSummary: '1 萬 (ㄨㄢˋ) = 10,000; 2 萬 4 千 5 百 = NT$24,500.',
  },
  {
    id: 'discounts',
    labelZh: '臺灣打折換算 (八折/七五折)',
    labelEn: 'Taiwan 打折 Discount Math',
    ruleSummary: '打八折 = Pay 80% (20% off); 打七五折 = Pay 75% (25% off); 打九折 = Pay 90% (10% off).',
  },
  {
    id: 'minguo_dates',
    labelZh: '民國紀年與日期 (Year - 1911)',
    labelEn: 'ROC 民國 Calendar Dates',
    ruleSummary: 'Gregorian Year = 民國 Year + 1911 (e.g., 民國 115 年 = 2026).',
  },
  {
    id: 'phone_invoice',
    labelZh: '09XX 手機與統一發票末三碼',
    labelEn: 'Mobile Numbers & Receipt Lottery',
    ruleSummary: 'Taiwan mobile phones start with 09XX-XXX-XXX; Uniform Invoices (統一發票) match the last 3 digits (末三碼).',
  },
  {
    id: 'addresses',
    labelZh: '臺灣段/巷/弄/號/樓地址',
    labelEn: 'Taiwan 段/巷/弄/號/樓 Addresses',
    ruleSummary: 'Order: 路 (Road) → 段 (Section) → 巷 (Lane) → 弄 (Alley) → 號 (No.) → 樓 (Floor).',
  },
];

const DRILL_BANK: Record<ListeningGymCategory, ListeningGymDrillItem[]> = {
  nt_prices: [
    {
      id: 'lg-price-1',
      category: 'nt_prices',
      categoryLabel: 'NT$ Prices & 萬 (10,000)',
      spokenTranscriptTraditional: '請問這樣一共是兩百八十五塊錢。',
      spokenTranscriptZhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄓㄜˋ ㄧㄤˋ ㄧˊ ㄍㄨㄥˋ ㄕˋ ㄌㄧㄤˇ ㄅㄞˇ ㄅㄚ ㄕˊ ㄨˇ ㄎㄨㄞˋ ㄑㄧㄢˊ。',
      questionPrompt: 'Enter the exact NT$ amount spoken:',
      inputPlaceholder: 'e.g. 285',
      expectedCanonicalAnswer: '285',
      acceptedAnswers: ['285', 'nt$285', 'nt285', '285元'],
      multipleChoiceOptions: ['285', '258', '185', '2,850'],
      conversionFormulaNote: '兩百 (200) + 八十 (80) + 五 (5) = NT$285.',
    },
    {
      id: 'lg-price-2',
      category: 'nt_prices',
      categoryLabel: 'NT$ Prices & 萬 (10,000)',
      spokenTranscriptTraditional: '這間臺北套房一個月的房租是兩萬四千五百元。',
      spokenTranscriptZhuyin: 'ㄓㄜˋ ㄐㄧㄢ ㄊㄞˊ ㄅㄟˇ ㄊㄠˋ ㄈㄤˊ ㄧˊ ㄍㄜ˙ ㄩㄝˋ ㄉㄜ˙ ㄈㄤˊ ㄗㄨ ㄕˋ ㄌㄧㄤˇ ㄨㄢˋ ㄙˋ ㄑㄧㄢ ㄨˇ ㄅㄞˇ ㄩㄢˊ。',
      questionPrompt: 'Enter the monthly rent in numeric NT$ (remember 1 萬 = 10,000):',
      inputPlaceholder: 'e.g. 24500',
      expectedCanonicalAnswer: '24500',
      acceptedAnswers: ['24500', '24,500', 'nt$24500', 'nt$24,500'],
      multipleChoiceOptions: ['24500', '24050', '2450', '245000'],
      conversionFormulaNote: '兩萬 (2 × 10,000 = 20,000) + 四千 (4,000) + 五百 (500) = NT$24,500.',
    },
    {
      id: 'lg-price-3',
      category: 'nt_prices',
      categoryLabel: 'NT$ Prices & 萬 (10,000)',
      spokenTranscriptTraditional: '這台筆電特價三萬六千八百塊。',
      spokenTranscriptZhuyin: 'ㄓㄜˋ ㄊㄞˊ ㄅㄧˇ ㄉㄧㄢˋ ㄊㄜˋ ㄐㄧㄚˋ ㄙㄢ ㄨㄢˋ ㄌㄧㄡˋ ㄑㄧㄢ ㄅㄚ ㄅㄞˇ ㄎㄨㄞˋ。',
      questionPrompt: 'Enter the sale price in numeric NT$:',
      inputPlaceholder: 'e.g. 36800',
      expectedCanonicalAnswer: '36800',
      acceptedAnswers: ['36800', '36,800', 'nt$36800'],
      multipleChoiceOptions: ['36800', '30680', '3680', '63800'],
      conversionFormulaNote: '三萬 (30,000) + 六千 (6,000) + 八百 (800) = NT$36,800.',
    },
  ],
  discounts: [
    {
      id: 'lg-disc-1',
      category: 'discounts',
      categoryLabel: 'Taiwan 打折 Discount Math',
      spokenTranscriptTraditional: '這件外套原價一千塊，今天週年慶打八折。',
      spokenTranscriptZhuyin: 'ㄓㄜˋ ㄐㄧㄢˋ ㄨㄞˋ ㄊㄠˋ ㄩㄢˊ ㄐㄧㄚˋ ㄧˋ ㄑㄧㄢ ㄎㄨㄞˋ，ㄐㄧㄣ ㄊㄧㄢ ㄓㄡ ㄋㄧㄢˊ ㄑㄧㄥˋ ㄉㄚˇ ㄅㄚ ㄓㄜˊ。',
      questionPrompt: 'What is the final discounted price in NT$? (打八折 = 20% off / pay 80%):',
      inputPlaceholder: 'e.g. 800',
      expectedCanonicalAnswer: '800',
      acceptedAnswers: ['800', 'nt$800', '800元'],
      multipleChoiceOptions: ['800', '200', '880', '920'],
      conversionFormulaNote: '打八折 (8 folds) means you pay 80% of the original price (20% off): 1,000 × 0.80 = NT$800.',
    },
    {
      id: 'lg-disc-2',
      category: 'discounts',
      categoryLabel: 'Taiwan 打折 Discount Math',
      spokenTranscriptTraditional: '高鐵早鳥票原價兩千元，今天打七五折。',
      spokenTranscriptZhuyin: 'ㄍㄠ ㄊㄧㄝˇ ㄗㄠˇ ㄋㄧㄠˇ ㄆㄧㄠˋ ㄩㄢˊ ㄐㄧㄚˋ ㄌㄧㄤˇ ㄑㄧㄢ ㄩㄢˊ，ㄐㄧㄣ ㄊㄧㄢ ㄉㄚˇ ㄑㄧ ㄨˇ ㄓㄜˊ。',
      questionPrompt: 'What is the final price in NT$? (打七五折 = 25% off / pay 75%):',
      inputPlaceholder: 'e.g. 1500',
      expectedCanonicalAnswer: '1500',
      acceptedAnswers: ['1500', '1,500', 'nt$1500'],
      multipleChoiceOptions: ['1500', '1450', '500', '1750'],
      conversionFormulaNote: '打七五折 means you pay 75% of the price (25% off): 2,000 × 0.75 = NT$1,500.',
    },
    {
      id: 'lg-disc-3',
      category: 'discounts',
      categoryLabel: 'Taiwan 打折 Discount Math',
      spokenTranscriptTraditional: '書店買書原價五百元，會員打九折。',
      spokenTranscriptZhuyin: 'ㄕㄨ ㄉㄧㄢˋ ㄇㄞˇ ㄕㄨ ㄩㄢˊ ㄐㄧㄚˋ ㄨˇ ㄅㄞˇ ㄩㄢˊ，ㄏㄨㄟˋ ㄩㄢˊ ㄉㄚˇ ㄐㄧㄡˇ ㄓㄜˊ。',
      questionPrompt: 'What is the member price in NT$? (打九折 = 10% off / pay 90%):',
      inputPlaceholder: 'e.g. 450',
      expectedCanonicalAnswer: '450',
      acceptedAnswers: ['450', 'nt$450', '450元'],
      multipleChoiceOptions: ['450', '405', '50', '490'],
      conversionFormulaNote: '打九折 means you pay 90% (10% off): 500 × 0.90 = NT$450.',
    },
  ],
  minguo_dates: [
    {
      id: 'lg-date-1',
      category: 'minguo_dates',
      categoryLabel: 'ROC 民國 Calendar Dates',
      spokenTranscriptTraditional: '請問您的出生日期是民國八十八年十月五號嗎？',
      spokenTranscriptZhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄋㄧㄣˊ ㄉㄜ˙ ㄔㄨ ㄕㄥ ㄖˋ ㄑㄧˊ ㄕˋ ㄇㄧㄥˊ ㄍㄨㄛˊ ㄅㄚ ㄕˊ ㄅㄚ ㄋㄧㄢˊ ㄕˊ ㄩㄝˋ ㄨˇ ㄏㄠˋ ㄇㄚ˙？',
      questionPrompt: 'Convert 民國 88 年 10 月 5 號 to Gregorian YYYY-MM-DD (Year + 1911):',
      inputPlaceholder: 'e.g. 1999-10-05',
      expectedCanonicalAnswer: '1999-10-05',
      acceptedAnswers: ['1999-10-05', '1999/10/05', '1999-10-5', '1999'],
      multipleChoiceOptions: ['1999-10-05', '1988-10-05', '2000-10-05', '1998-05-10'],
      conversionFormulaNote: 'ROC 民國 Year + 1911 = Gregorian Year: 88 + 1911 = 1999 → 1999-10-05.',
    },
    {
      id: 'lg-date-2',
      category: 'minguo_dates',
      categoryLabel: 'ROC 民國 Calendar Dates',
      spokenTranscriptTraditional: '這張統一發票的期限是民國一百一十五年十一月十三日。',
      spokenTranscriptZhuyin: 'ㄓㄜˋ ㄓㄤ ㄊㄨㄥˇ ㄧ ㄈㄚ ㄆㄧㄠˋ ㄉㄜ˙ ㄑㄧˊ ㄒㄧㄢˋ ㄕˋ ㄇㄧㄥˊ ㄍㄨㄛˊ ㄧˋ ㄅㄞˇ ㄧ ㄕˊ ㄨˇ ㄋㄧㄢˊ ㄕˊ ㄧ ㄩㄝˋ ㄕˊ ㄙㄢ ㄖˋ。',
      questionPrompt: 'Convert 民國 115 年 11 月 13 日 to Gregorian YYYY-MM-DD:',
      inputPlaceholder: 'e.g. 2026-11-13',
      expectedCanonicalAnswer: '2026-11-13',
      acceptedAnswers: ['2026-11-13', '2026/11/13', '2026'],
      multipleChoiceOptions: ['2026-11-13', '2025-11-13', '2015-11-13', '2026-01-13'],
      conversionFormulaNote: '民國 115 + 1911 = 2026 → 2026-11-13.',
    },
  ],
  phone_invoice: [
    {
      id: 'lg-phone-1',
      category: 'phone_invoice',
      categoryLabel: 'Mobile Numbers & Receipt Lottery',
      spokenTranscriptTraditional: '我的手機號碼是零九一二、三四五、六七八。',
      spokenTranscriptZhuyin: 'ㄨㄛˇ ㄉㄜ˙ ㄕㄡˇ ㄐㄧ ㄏㄠˋ ㄇㄚˇ ㄕˋ ㄌㄧㄥˊ ㄐㄧㄡˇ ㄧ ㄦˋ、ㄙㄢ ㄙˋ ㄨˇ、ㄌㄧㄡˋ ㄑㄧ ㄅㄚ。',
      questionPrompt: 'Enter the 10-digit Taiwan mobile number (with or without hyphens):',
      inputPlaceholder: 'e.g. 0912-345-678',
      expectedCanonicalAnswer: '0912-345-678',
      acceptedAnswers: ['0912-345-678', '0912345678'],
      multipleChoiceOptions: ['0912-345-678', '0921-345-678', '0912-435-678', '0912-345-876'],
      conversionFormulaNote: 'Taiwan mobile numbers always begin with 09 followed by 8 digits: 0912-345-678.',
    },
    {
      id: 'lg-invoice-2',
      category: 'phone_invoice',
      categoryLabel: 'Mobile Numbers & Receipt Lottery',
      spokenTranscriptTraditional: '本期統一發票六獎的末三碼是五、八、二。',
      spokenTranscriptZhuyin: 'ㄅㄣˇ ㄑㄧˊ ㄊㄨㄥˇ ㄧ ㄈㄚ ㄆㄧㄠˋ ㄌㄧㄡˋ ㄐㄧㄤˇ ㄉㄜ˙ ㄇㄛˋ ㄙㄢ ㄇㄚˇ ㄕˋ ㄨˇ、ㄅㄚ、ㄦˋ。',
      questionPrompt: 'Enter the 3-digit Uniform Invoice (統一發票) winning ending (末三碼):',
      inputPlaceholder: 'e.g. 582',
      expectedCanonicalAnswer: '582',
      acceptedAnswers: ['582'],
      multipleChoiceOptions: ['582', '528', '852', '285'],
      conversionFormulaNote: 'Matching the last 3 digits (末三碼 582) on a Taiwan Uniform Invoice wins the NT$200 6th Prize!',
    },
  ],
  addresses: [
    {
      id: 'lg-addr-1',
      category: 'addresses',
      categoryLabel: 'Taiwan 段/巷/弄/號/樓 Addresses',
      spokenTranscriptTraditional: '請送餐到臺北市和平東路一段一百六十二號三樓。',
      spokenTranscriptZhuyin: 'ㄑㄧㄥˇ ㄙㄨㄥˋ ㄘㄢ ㄉㄠˋ ㄊㄞˊ ㄅㄟˇ ㄕˋ ㄏㄜˊ ㄆㄧㄥˊ ㄉㄨㄥ ㄌㄨˋ ㄧ ㄉㄨㄢˋ ㄧˋ ㄅㄞˇ ㄌㄧㄡˋ ㄕˊ ㄦˋ ㄏㄠˋ ㄙㄢ ㄌㄡˊ。',
      questionPrompt: 'Select or enter the structured Section (段), Number (號), and Floor (樓):',
      inputPlaceholder: 'e.g. 1段 162號 3樓',
      expectedCanonicalAnswer: '1段 162號 3樓',
      acceptedAnswers: [
        '1段 162號 3樓',
        '一段162號3樓',
        '和平東路一段162號3樓',
        '1-162-3f',
      ],
      multipleChoiceOptions: [
        '1段 162號 3樓',
        '2段 162號 3樓',
        '1段 126號 3樓',
        '1段 162號 5樓',
      ],
      conversionFormulaNote: '和平東路 (Heping E. Rd.) → 一段 (Sec. 1) → 162 號 (No. 162) → 3 樓 (3F).',
    },
    {
      id: 'lg-addr-2',
      category: 'addresses',
      categoryLabel: 'Taiwan 段/巷/弄/號/樓 Addresses',
      spokenTranscriptTraditional: '診所的地址在忠孝東路四段兩百一十六巷二十七弄五號二樓。',
      spokenTranscriptZhuyin: 'ㄓㄣˇ ㄙㄨㄛˇ ㄉㄜ˙ ㄉㄧˋ ㄓˇ ㄗㄞˋ ㄓㄨㄥ ㄒㄧㄠˋ ㄉㄨㄥ ㄌㄨˋ ㄙˋ ㄉㄨㄢˋ ㄌㄧㄤˇ ㄅㄞˇ ㄧ ㄕˊ ㄌㄧㄡˋ ㄒㄧㄤˋ ㄦˋ ㄕˊ ㄑㄧ ㄋㄨㄥˋ ㄨˇ ㄏㄠˋ ㄦˋ ㄌㄡˊ。',
      questionPrompt: 'Select or enter the Section (段), Lane (巷), Alley (弄), Number (號), and Floor (樓):',
      inputPlaceholder: 'e.g. 4段 216巷 27弄 5號 2樓',
      expectedCanonicalAnswer: '4段 216巷 27弄 5號 2樓',
      acceptedAnswers: [
        '4段 216巷 27弄 5號 2樓',
        '四段216巷27弄5號2樓',
        '忠孝東路四段216巷27弄5號2樓',
      ],
      multipleChoiceOptions: [
        '4段 216巷 27弄 5號 2樓',
        '4段 27巷 216弄 5號 2樓',
        '2段 216巷 27弄 5號 4樓',
        '4段 216巷 27弄 2號 5樓',
      ],
      conversionFormulaNote: '忠孝東路 → 四段 (Sec. 4) → 216 巷 (Lane 216) → 27 弄 (Alley 27) → 5 號 (No. 5) → 2 樓 (2F).',
    },
  ],
};

/**
 * Returns all listening drills for a category or a specific drill by index/seed (FORM-REQ-0011).
 */
export function getListeningDrillsByCategory(
  category: ListeningGymCategory
): ListeningGymDrillItem[] {
  return DRILL_BANK[category] || DRILL_BANK.nt_prices;
}

export function generateListeningDrill(
  category: ListeningGymCategory,
  seedIndex = 0
): ListeningGymDrillItem {
  const list = getListeningDrillsByCategory(category);
  return list[Math.abs(seedIndex) % list.length];
}

/**
 * Evaluates a user's numeric or structured answer against a Listening Gym drill item (FORM-REQ-0011).
 */
export function evaluateListeningAnswer(
  drill: ListeningGymDrillItem,
  userRawInput: string
): ListeningEvaluationResult {
  const cleanUser = userRawInput.trim().toLowerCase().replace(/,/g, '');
  const compactUser = cleanUser.replace(/\s+/g, '');

  const isCorrect = drill.acceptedAnswers.some((ans) => {
    const cleanAns = ans.trim().toLowerCase().replace(/,/g, '');
    return cleanUser === cleanAns || compactUser === cleanAns.replace(/\s+/g, '');
  });

  return {
    isCorrect,
    normalizedUserAnswer: userRawInput.trim(),
    expectedAnswer: drill.expectedCanonicalAnswer,
    explanation: drill.conversionFormulaNote,
  };
}

/**
 * Computes the NT$ bill total and verifies a user's Laminated Paper Tick-Menu (點菜單) order
 * against a real-world dining mission (FORM-REQ-0010).
 */
export function verifyTickMenuOrder(
  mission: TickMenuOrderMission,
  selection: TickMenuSelectionState
): TickMenuVerificationResult {
  let calculatedTotalNtd = 0;
  for (const item of TICK_MENU_CATALOG) {
    const qty = selection.quantities[item.id] || 0;
    if (qty > 0) {
      calculatedTotalNtd += qty * item.priceNtd;
    }
  }

  const discrepancies: string[] = [];

  if (selection.diningMode !== mission.diningMode) {
    discrepancies.push(
      `Expected ${mission.diningMode === 'dine_in' ? '內用 (Dine-In)' : '外帶 (Takeout)'}, but selected ${
        selection.diningMode === 'dine_in' ? '內用' : '外帶'
      }.`
    );
  }

  if (
    mission.diningMode === 'dine_in' &&
    mission.expectedTableNumber &&
    selection.tableNumber.trim() !== mission.expectedTableNumber
  ) {
    discrepancies.push(
      `Expected Table Number (桌號) ${mission.expectedTableNumber}, but entered "${
        selection.tableNumber || 'blank'
      }".`
    );
  }

  const expectedMap = new Map<string, { quantity: number; spiceNote?: string }>();
  for (const exp of mission.expectedItems) {
    expectedMap.set(exp.itemId, { quantity: exp.quantity, spiceNote: exp.spiceNote });
  }

  for (const item of TICK_MENU_CATALOG) {
    const actualQty = selection.quantities[item.id] || 0;
    const exp = expectedMap.get(item.id);
    const expQty = exp?.quantity || 0;

    if (actualQty !== expQty) {
      discrepancies.push(
        `${item.traditional}: expected quantity ${expQty}, marked ${actualQty}.`
      );
    } else if (
      expQty > 0 &&
      exp?.spiceNote &&
      (selection.spiceNotes[item.id] || 'none') !== exp.spiceNote
    ) {
      discrepancies.push(
        `${item.traditional}: expected spice "${exp.spiceNote}", selected "${
          selection.spiceNotes[item.id] || 'none'
        }".`
      );
    }
  }

  if (calculatedTotalNtd !== mission.expectedTotalNtd) {
    discrepancies.push(
      `Bill total is NT$${calculatedTotalNtd}, expected NT$${mission.expectedTotalNtd}.`
    );
  }

  const isCompleteMatch = discrepancies.length === 0;
  return {
    isCompleteMatch,
    calculatedTotalNtd,
    expectedTotalNtd: mission.expectedTotalNtd,
    discrepancies,
    summaryMessage: isCompleteMatch
      ? `Order Verified! Exact match for ${mission.title} — Total: NT$${calculatedTotalNtd}.`
      : `Please adjust your 點菜單 (${discrepancies.length} item(s) need attention).`,
  };
}
