/**
 * FormosaStudio (FORM) — Phase 2 "Taiwan in 10 Minutes a Day" Survival Modules, Sticky Labels,
 * 12 Swiss-Army-Knife Frames, Laminated Paper Tick-Menu (點菜單) & Taiwanese Pragmatics (語助詞 & 臺語)
 * Traces to: FORM-REQ-0009, FORM-REQ-0010, FORM-REQ-0005, FORM-DEP-TPA-002
 */

export interface StickyLabelItem {
  id: string;
  traditional: string;
  zhuyin: string;
  pinyin: string;
  english: string;
  placementHint: string;
  usageTip: string;
}

export interface SurvivalTenMinModule {
  id: string;
  moduleNumber: number;
  titleTraditional: string;
  titleEnglish: string;
  subtitle: string;
  estimatedMinutes: 10;
  keyTakeaway: string;
  labels: StickyLabelItem[];
}

export interface SwissArmySentenceFrame {
  id: string;
  frameNumber: number;
  patternTraditional: string;
  patternZhuyin: string;
  englishTemplate: string;
  scenarioTag: string;
  exampleTraditional: string;
  exampleZhuyin: string;
  exampleEnglish: string;
}

export interface TickMenuItemSpec {
  id: string;
  category: 'noodles_mains' | 'dumplings_rice' | 'side_dishes' | 'drinks_soups';
  categoryLabel: string;
  traditional: string;
  zhuyin: string;
  english: string;
  priceNtd: number;
  allowSpice?: boolean;
}

export interface TickMenuOrderMission {
  id: string;
  missionNumber: number;
  title: string;
  customerBriefEnglish: string;
  customerBriefTraditional: string;
  diningMode: 'dine_in' | 'takeout';
  expectedTableNumber?: string;
  expectedItems: { itemId: string; quantity: number; spiceNote?: 'none' | 'mild' | 'medium' }[];
  expectedTotalNtd: number;
}

export interface TaiwanFinalParticleSpec {
  id: string;
  particle: string;
  zhuyin: string;
  pinyin: string;
  nuance: string;
  taiwanContext: string;
  exampleTraditional: string;
  exampleZhuyin: string;
  exampleEnglish: string;
}

export interface HokkienLoanwordSpec {
  id: string;
  traditional: string;
  mandarinZhuyin: string;
  tailoRomanization: string;
  english: string;
  usageContext: string;
  exampleTraditional: string;
  exampleZhuyin: string;
  exampleEnglish: string;
}

/**
 * 6 Themed "Taiwan in 10 Minutes a Day" Visual Survival Modules & Sticky Labels (FORM-REQ-0009).
 */
export const SURVIVAL_MODULES: SurvivalTenMinModule[] = [
  {
    id: 'mod-1-home-ac-trash',
    moduleNumber: 1,
    titleTraditional: '居家冷氣遙控器與垃圾分類',
    titleEnglish: 'Home, AC Remote & Musical Trash Sorting',
    subtitle: 'Decode your apartment AC remote and Taiwan’s 3-stream evening trash routine.',
    estimatedMinutes: 10,
    keyTakeaway: 'Taiwanese apartments rely on Dehumidify (除濕) in humid winters/springs and strict 3-way waste sorting (一般垃圾 / 資源回收 / 廚餘).',
    labels: [
      { id: 'lbl-1-1', traditional: '冷氣 / 除濕', zhuyin: 'ㄌㄥˇ ㄑㄧˋ / ㄔㄨˊ ㄕ', pinyin: 'lěngqì / chúshī', english: 'Cool AC / Dehumidify', placementHint: 'Stick on AC Remote Control', usageTip: 'Press 除濕 on rainy Taipei days to prevent mold.' },
      { id: 'lbl-1-2', traditional: '風量 / 定時', zhuyin: 'ㄈㄥ ㄌㄧㄤˋ / ㄉㄧㄥˋ ㄕˊ', pinyin: 'fēngliàng / dìngshí', english: 'Fan Speed / Timer', placementHint: 'Stick on AC Remote Control', usageTip: 'Set 定時 so the AC turns off automatically at dawn.' },
      { id: 'lbl-1-3', traditional: '一般垃圾', zhuyin: 'ㄧ ㄅㄢ ㄌㄜˋ ㄙㄜˋ', pinyin: 'yībān lèsè', english: 'General Non-Recyclable Trash', placementHint: 'Stick on Main Trash Bin', usageTip: 'Requires official municipal paid trash bags in Taipei/New Taipei.' },
      { id: 'lbl-1-4', traditional: '資源回收', zhuyin: 'ㄗ ㄩㄢˊ ㄏㄨㄟˊ ㄕㄡ', pinyin: 'zīyuán huíshōu', english: 'Recyclables (Paper/Plastic/Cans)', placementHint: 'Stick on Recycling Bin', usageTip: 'Handed to the white recycling truck following the yellow garbage truck.' },
      { id: 'lbl-1-5', traditional: '廚餘', zhuyin: 'ㄔㄨˊ ㄩˊ', pinyin: 'chúyú', english: 'Food Scraps / Compost', placementHint: 'Stick on Kitchen Counter Caddy', usageTip: 'Poured into the blue/red barrels on the back of the yellow garbage truck.' },
    ],
  },
  {
    id: 'mod-2-breakfast-bento',
    moduleNumber: 2,
    titleTraditional: '臺灣早餐店與便當點餐',
    titleEnglish: 'Taiwanese Breakfast Shop (早餐店) & Bento (便當) Ordering',
    subtitle: 'Order egg crepes, soy milk, and 3-side-dish bentos like a local.',
    estimatedMinutes: 10,
    keyTakeaway: 'At a 便當店, you pick 1 main meat (主菜) and point to 3–4 vegetable side dishes (配菜); at a 早餐店, specify 冰/溫/熱 for drinks.',
    labels: [
      { id: 'lbl-2-1', traditional: '起司蛋餅', zhuyin: 'ㄑㄧˇ ㄙ ㄉㄢˋ ㄅㄧㄥˇ', pinyin: 'qǐsī dànbǐng', english: 'Cheese Egg Crepe Roll', placementHint: 'Breakfast Card / Fridge', usageTip: 'Add 醬油膏 (savory soy paste) or 辣椒 (chili).' },
      { id: 'lbl-2-2', traditional: '燒餅油條', zhuyin: 'ㄕㄠ ㄅㄧㄥˇ ㄧㄡˊ ㄊㄧㄠˊ', pinyin: 'shāobǐng yóutiáo', english: 'Sesame Flatbread & Fried Cruller', placementHint: 'Breakfast Card', usageTip: 'Classic pairing with 鹹豆漿 (savory soy milk) or 溫豆漿.' },
      { id: 'lbl-2-3', traditional: '微糖溫豆漿', zhuyin: 'ㄨㄟˊ ㄊㄤˊ ㄨㄣ ㄉㄡˋ ㄐㄧㄤ', pinyin: 'wéitáng wēn dòujiāng', english: 'Quarter-Sugar Warm Soy Milk', placementHint: 'Beverage Order Card', usageTip: 'Taiwan MOE standard: 微 is pronounced 2nd tone (ㄨㄟˊ).' },
      { id: 'lbl-2-4', traditional: '排骨便當', zhuyin: 'ㄆㄞˊ ㄍㄨˇ ㄅㄧㄢˋ ㄉㄤ', pinyin: 'páigǔ biàndāng', english: 'Fried Pork Chop Bento Box', placementHint: 'Lunch Bento Card', usageTip: 'Comes with rice and 3–4 choisiest side dishes (三樣配菜).' },
      { id: 'lbl-2-5', traditional: '半糖少冰', zhuyin: 'ㄅㄢˋ ㄊㄤˊ ㄕㄠˇ ㄅㄧㄥ', pinyin: 'bàntáng shǎobīng', english: 'Half-Sugar, Less Ice', placementHint: 'Boba Tea Wallet Card', usageTip: 'Also use 去冰 (no ice) or 無糖 (unsweetened).' },
    ],
  },
  {
    id: 'mod-3-convenience-discounts',
    moduleNumber: 3,
    titleTraditional: '便利商店結帳與打折算法',
    titleEnglish: '7-Eleven / FamilyMart Checkout & Discount Math (打折)',
    subtitle: 'Survive the rapid-fire 3-second convenience store checkout questions and decode 八折.',
    estimatedMinutes: 10,
    keyTakeaway: 'In Chinese, 打八折 means you PAY 80% (20% off), and 打七五折 means you PAY 75% (25% off)!',
    labels: [
      { id: 'lbl-3-1', traditional: '載具 / 刷條碼', zhuyin: 'ㄗㄞˋ ㄐㄩˋ / ㄕㄨㄚ ㄊㄧㄠˊ ㄇㄚˇ', pinyin: 'zàijù / shuā tiáomǎ', english: 'Cloud Invoice Barcode', placementHint: 'Phone Case / Wallet', usageTip: 'Say「存載具」to save your receipt to your phone instead of paper.' },
      { id: 'lbl-3-2', traditional: '需要袋子嗎？', zhuyin: 'ㄒㄩ ㄧㄠˋ ㄉㄞˋ ㄗ˙ ㄇㄚ˙', pinyin: 'xūyào dàizi ma', english: 'Do you need a shopping bag?', placementHint: 'Checkout Counter Cue', usageTip: 'Reply「不用，謝謝」(No thanks) or「要一個小袋子」.' },
      { id: 'lbl-3-3', traditional: '打八折 (20% Off)', zhuyin: 'ㄉㄚˇ ㄅㄚ ㄓㄜˊ', pinyin: 'dǎ bā zhé', english: 'Pay 80% = 20% Discount', placementHint: 'Shopping Math Card', usageTip: 'NT$1,000 at 八折 = NT$800; 七五折 = 25% off (pay 75%).' },
      { id: 'lbl-3-4', traditional: '買一送一', zhuyin: 'ㄇㄞˇ ㄧ ㄙㄨㄥˋ ㄧ', pinyin: 'mǎi yī sòng yī', english: 'Buy One Get One Free (BOGO)', placementHint: 'Supermarket Shelf Tag', usageTip: '第二件六折 means the 2nd item is 40% off (pay 60%).' },
      { id: 'lbl-3-5', traditional: '請問有會員嗎？', zhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄧㄡˇ ㄏㄨㄟˋ ㄩㄢˊ ㄇㄚ˙', pinyin: 'qǐngwèn yǒu huìyuán ma', english: 'Are you a store member?', placementHint: 'Checkout Counter Cue', usageTip: 'Give your 09XX phone number or say「沒有，直接結帳」.' },
    ],
  },
  {
    id: 'mod-4-mrt-hsr-taxi',
    moduleNumber: 4,
    titleTraditional: '捷運、高鐵與計程車地址',
    titleEnglish: 'MRT, HSR, YouBike & Taxi (小黃) Addresses',
    subtitle: 'Navigate Priority Seats, Non-Reserved HSR cars, and Taipei’s 段/巷/弄 address grid.',
    estimatedMinutes: 10,
    keyTakeaway: 'Taiwanese addresses funnel from biggest to smallest: 市 (City) → 區 (District) → 路/街 (Road) → 段 (Section) → 巷 (Lane) → 弄 (Alley) → 號 (Number) → 樓 (Floor).',
    labels: [
      { id: 'lbl-4-1', traditional: '博愛座', zhuyin: 'ㄅㄛˊ ㄞˋ ㄗㄨㄛˋ', pinyin: 'bó’ài zuò', english: 'Priority Seat (Dark Blue MRT Seat)', placementHint: 'Transit Etiquette Card', usageTip: 'Reserved for seniors, pregnant riders, and anyone injured or unwell.' },
      { id: 'lbl-4-2', traditional: '請勿飲食', zhuyin: 'ㄑㄧㄥˇ ㄨˋ ㄧㄣˇ ㄕˊ', pinyin: 'qǐng wù yǐnshí', english: 'No Eating or Drinking (MRT)', placementHint: 'MRT Gate Warning', usageTip: 'Strictly enforced after crossing the yellow fare line (includes water/gum).' },
      { id: 'lbl-4-3', traditional: '自由座 / 對號座', zhuyin: 'ㄗˋ ㄧㄡˊ ㄗㄨㄛˋ / ㄉㄨㄟˋ ㄏㄠˋ ㄗㄨㄛˋ', pinyin: 'zìyóuzuò / duìhàozuò', english: 'Non-Reserved / Reserved Seat (HSR)', placementHint: 'HSR Ticket Wallet', usageTip: 'HSR Cars 10–12 are typically 自由座 (unreserved).' },
      { id: 'lbl-4-4', traditional: '段 · 巷 · 弄 · 號 · 樓', zhuyin: 'ㄉㄨㄢˋ · ㄒㄧㄤˋ · ㄋㄨㄥˋ · ㄏㄠˋ · ㄌㄡˊ', pinyin: 'duàn · xiàng · nòng · hào · lóu', english: 'Section · Lane · Alley · No. · Floor', placementHint: 'Address Decoder Card', usageTip: 'Example: 和平東路一段 162 號 3 樓.' },
      { id: 'lbl-4-5', traditional: '請在前面巷口停車', zhuyin: 'ㄑㄧㄥˇ ㄗㄞˋ ㄑㄧㄢˊ ㄇㄧㄢˋ ㄒㄧㄤˋ ㄎㄡˇ ㄊㄧㄥˊ ㄔㄜ', pinyin: 'qǐng zài qiánmiàn xiàngkǒu tíngchē', english: 'Please stop at the alley ahead', placementHint: 'Taxi (小黃) Rider Card', usageTip: 'Essential phrase when riding a yellow taxi.' },
    ],
  },
  {
    id: 'mod-5-clinic-pharmacy',
    moduleNumber: 5,
    titleTraditional: '診所掛號、藥局與食物過敏卡',
    titleEnglish: 'Clinic (診所), Pharmacy (藥局) & Food Allergy Cards',
    subtitle: 'Register at a neighborhood clinic with your NHI card and communicate food allergies clearly.',
    estimatedMinutes: 10,
    keyTakeaway: 'Bring your 全民健保卡 (NHI Card) and ARC/Passport to any neighborhood 診所; say「我要掛號」at the counter.',
    labels: [
      { id: 'lbl-5-1', traditional: '全民健保卡 / 掛號', zhuyin: 'ㄑㄩㄢˊ ㄇㄧㄣˊ ㄐㄧㄢˋ ㄅㄠˇ ㄎㄚˇ / ㄍㄨㄚˋ ㄏㄠˋ', pinyin: 'jiànbǎokǎ / guàhào', english: 'NHI Health Card / Clinic Registration', placementHint: 'Wallet Health Slot', usageTip: 'Say「你好，我第一次來，我要掛號」at the clinic desk.' },
      { id: 'lbl-5-2', traditional: '我對花生與海鮮過敏', zhuyin: 'ㄨㄛˇ ㄉㄨㄟˋ ㄏㄨㄚ ㄕㄥ ㄩˇ ㄏㄞˇ ㄒㄧㄢ ㄍㄨㄛˋ ㄇㄧㄣˇ', pinyin: 'wǒ duì huāshēng yǔ hǎixiān guòmǐn', english: 'I am allergic to peanuts and seafood', placementHint: 'Dining Emergency Card', usageTip: 'Show this card directly to restaurant staff.' },
      { id: 'lbl-5-3', traditional: '請不要加香菜或味精', zhuyin: 'ㄑㄧㄥˇ ㄅㄨˊ ㄧㄠˋ ㄐㄧㄚ ㄒㄧㄤ ㄘㄞˋ ㄏㄨㄛˋ ㄨㄟˋ ㄐㄧㄥ', pinyin: 'qǐng búyào jiā xiāngcài huò wèijīng', english: 'No cilantro or MSG, please', placementHint: 'Night Market Card', usageTip: '香菜 (cilantro) is added to many Taiwanese snacks unless you ask.' },
      { id: 'lbl-5-4', traditional: '三餐飯後吃一包', zhuyin: 'ㄙㄢ ㄘㄢ ㄈㄢˋ ㄏㄡˋ ㄔ ㄧˋ ㄅㄠ', pinyin: 'sāncān fànhòu chī yì bāo', english: 'Take 1 packet after each of 3 meals', placementHint: 'Medicine Bag Decoder', usageTip: '睡前 = before bed; 空腹 = on an empty stomach.' },
    ],
  },
  {
    id: 'mod-6-street-signs',
    moduleNumber: 6,
    titleTraditional: '臺灣街頭與店門口標示解碼',
    titleEnglish: 'Everyday Street & Shop Door Signs Decoder',
    subtitle: 'Never pull a Push door or walk into a closed restaurant again.',
    estimatedMinutes: 10,
    keyTakeaway: 'Look for 推 (Push) vs. 拉 (Pull) on glass doors, and 內用 (Dine-in) vs. 外帶 (Takeout) at restaurant entrances.',
    labels: [
      { id: 'lbl-6-1', traditional: '推 (Push) / 拉 (Pull)', zhuyin: 'ㄊㄨㄟ / ㄌㄚ', pinyin: 'tuī / lā', english: 'Push / Pull Door Sign', placementHint: 'Glass Door Handle', usageTip: '推 has 手 + 隹 (push forward); 拉 has 手 + 立 (pull back).' },
      { id: 'lbl-6-2', traditional: '內用 / 外帶', zhuyin: 'ㄋㄟˋ ㄩㄥˋ / ㄨㄞˋ ㄉㄞˋ', pinyin: 'nèiyòng / wàidài', english: 'Dine-In / Takeout', placementHint: 'Restaurant Counter Sign', usageTip: '內用 vaak means grab a menu, find a table number, then pay.' },
      { id: 'lbl-6-3', traditional: '營業中 / 準備中', zhuyin: 'ㄧㄥˊ ㄧㄝˋ ㄓㄨㄥ / ㄓㄨㄣˇ ㄅㄟˋ ㄓㄨㄥ', pinyin: 'yíngyèzhōng / zhǔnbèizhōng', english: 'Open for Business / Closed (Prepping)', placementHint: 'Shop Front Door Sign', usageTip: '公休 (ㄍㄨㄥ ㄒㄧㄡ) means closed for the shop’s weekly day off.' },
      { id: 'lbl-6-4', traditional: '請先結帳 / 叫號取餐', zhuyin: 'ㄑㄧㄥˇ ㄒㄧㄢ ㄐㄧㄝˊ ㄓㄤˋ / ㄐㄧㄠˋ ㄏㄠˋ ㄑㄩˇ ㄘㄢ', pinyin: 'qǐng xiān jiézhàng / jiàohào qǔcān', english: 'Please Pay First / Pick Up by Number', placementHint: 'Cashier Counter Sign', usageTip: 'Watch the LED screen for your receipt number.' },
    ],
  },
];

/**
 * 12 "Swiss-Army-Knife" Survival Sentence Frames for Immediate Daily Use in Taiwan (FORM-REQ-0009).
 */
export const SWISS_ARMY_FRAMES: SwissArmySentenceFrame[] = [
  { id: 'sak-01', frameNumber: 1, patternTraditional: '不好意思，請問 [地點] 在哪裡？', patternZhuyin: 'ㄅㄨˋ ㄏㄠˇ ㄧˋ ㄙ˙，ㄑㄧㄥˇ ㄨㄣˋ […] ㄗㄞˋ ㄋㄚˇ ㄌㄧˇ？', englishTemplate: 'Excuse me, where is [Place]?', scenarioTag: 'Directions & Transit', exampleTraditional: '不好意思，請問捷運站在哪裡？', exampleZhuyin: 'ㄅㄨˋ ㄏㄠˇ ㄧˋ ㄙ˙，ㄑㄧㄥˇ ㄨㄣˋ ㄐㄧㄝˊ ㄩㄣˋ ㄓㄢˋ ㄗㄞˋ ㄋㄚˇ ㄌㄧˇ？', exampleEnglish: 'Excuse me, where is the MRT station?' },
  { id: 'sak-02', frameNumber: 2, patternTraditional: '我要一個 [餐點]，[內用 / 外帶]。', patternZhuyin: 'ㄨㄛˇ ㄧㄠˋ ㄧˊ ㄍㄜ˙ […]，[ㄋㄟˋ ㄩㄥˋ / ㄨㄞˋ ㄉㄞˋ]。', englishTemplate: 'I would like one [Item], [for here / to go].', scenarioTag: 'Dining & Breakfast', exampleTraditional: '我要一個起司蛋餅，外帶。', exampleZhuyin: 'ㄨㄛˇ ㄧㄠˋ ㄧˊ ㄍㄜ˙ ㄑㄧˇ ㄙ ㄉㄢˋ ㄅㄧㄥˇ，ㄨㄞˋ ㄉㄞˋ。', exampleEnglish: 'I would like one cheese egg crepe, to go.' },
  { id: 'sak-03', frameNumber: 3, patternTraditional: '請幫我做 [微糖 / 半糖] [少冰 / 去冰]。', patternZhuyin: 'ㄑㄧㄥˇ ㄅㄤ ㄨㄛˇ ㄗㄨㄛˋ [ㄨㄟˊ ㄊㄤˊ / ㄅㄢˋ ㄊㄤˊ] [ㄕㄠˇ ㄅㄧㄥ / ㄑㄩˋ ㄅㄧㄥ]。', englishTemplate: 'Please make it [quarter/half sugar] and [less/no ice].', scenarioTag: 'Tea & Boba Shops', exampleTraditional: '請幫我做微糖去冰，謝謝。', exampleZhuyin: 'ㄑㄧㄥˇ ㄅㄤ ㄨㄛˇ ㄗㄨㄛˋ ㄨㄟˊ ㄊㄤˊ ㄑㄩˋ ㄅㄧㄥ，ㄒㄧㄝˋ ㄒㄧㄝ˙。', exampleEnglish: 'Please make it quarter-sugar with no ice, thank you.' },
  { id: 'sak-04', frameNumber: 4, patternTraditional: '請問這樣一共多少錢？', patternZhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄓㄜˋ ㄧㄤˋ ㄧˊ ㄍㄨㄥˋ ㄉㄨㄛ ㄕㄠˇ ㄑㄧㄢˊ？', englishTemplate: 'How much is this altogether?', scenarioTag: 'Shopping & Night Markets', exampleTraditional: '老闆，請問這樣一共多少錢？', exampleZhuyin: 'ㄌㄠˇ ㄅㄢˇ，ㄑㄧㄥˇ ㄨㄣˋ ㄓㄜˋ ㄧㄤˋ ㄧˊ ㄍㄨㄥˋ ㄉㄨㄛ ㄕㄠˇ ㄑㄧㄢˊ？', exampleEnglish: 'Boss, how much is this altogether?' },
  { id: 'sak-05', frameNumber: 5, patternTraditional: '請問可以刷悠遊卡或用載具嗎？', patternZhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄎㄜˇ ㄧˇ ㄕㄨㄚ ㄧㄡ ㄧㄡˊ ㄎㄚˇ ㄏㄨㄛˋ ㄩㄥˋ ㄗㄞˋ ㄐㄩˋ ㄇㄚ˙？', englishTemplate: 'Can I pay by EasyCard or use a cloud invoice barcode?', scenarioTag: 'Checkout & Payment', exampleTraditional: '請問可以刷悠遊卡嗎？發票存載具。', exampleZhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄎㄜˇ ㄧˇ ㄕㄨㄚ ㄧㄡ ㄧㄡˊ ㄎㄚˇ ㄇㄚ˙？ㄈㄚ ㄆㄧㄠˋ ㄘㄨㄣˊ ㄗㄞˋ ㄐㄩˋ。', exampleEnglish: 'Can I pay with EasyCard? Save the receipt to my cloud barcode.' },
  { id: 'sak-06', frameNumber: 6, patternTraditional: '謝謝，不用袋子，我有自己帶。', patternZhuyin: 'ㄒㄧㄝˋ ㄒㄧㄝ˙，ㄅㄨˊ ㄩㄥˋ ㄉㄞˋ ㄗ˙，ㄨㄛˇ ㄧㄡˇ ㄗˋ ㄐㄧˇ ㄉㄞˋ。', englishTemplate: 'Thank you, no bag needed—I brought my own.', scenarioTag: '7-Eleven / FamilyMart', exampleTraditional: '謝謝，不用袋子，我直接拿就可以了。', exampleZhuyin: 'ㄒㄧㄝˋ ㄒㄧㄝ˙，ㄅㄨˊ ㄩㄥˋ ㄉㄞˋ ㄗ˙，ㄨㄛˇ ㄓˊ ㄐㄧㄝ ㄋㄚˊ ㄐㄧㄡˋ ㄎㄜˇ ㄧˇ ㄌㄜ˙。', exampleEnglish: 'Thanks, no bag needed, I can just carry it.' },
  { id: 'sak-07', frameNumber: 7, patternTraditional: '我對 [食材] 過敏，請不要加。', patternZhuyin: 'ㄨㄛˇ ㄉㄨㄟˋ […] ㄍㄨㄛˋ ㄇㄧㄣˇ，ㄑㄧㄥˇ ㄅㄨˊ ㄧㄠˋ ㄐㄧㄚ。', englishTemplate: 'I am allergic to [Ingredient], please do not add it.', scenarioTag: 'Food Safety & Dietary', exampleTraditional: '我對花生過敏，請不要加花生粉。', exampleZhuyin: 'ㄨㄛˇ ㄉㄨㄟˋ ㄏㄨㄚ ㄕㄥ ㄍㄨㄛˋ ㄇㄧㄣˇ，ㄑㄧㄥˇ ㄅㄨˊ ㄧㄠˋ ㄐㄧㄚ ㄏㄨㄚ ㄕㄥ ㄈㄣˇ。', exampleEnglish: 'I am allergic to peanuts; please do not add peanut powder.' },
  { id: 'sak-08', frameNumber: 8, patternTraditional: '司機先生，請在前面 [地點] 讓我下車。', patternZhuyin: 'ㄙ ㄐㄧ ㄒㄧㄢ ㄕㄥ，ㄑㄧㄥˇ ㄗㄞˋ ㄑㄧㄢˊ ㄇㄧㄢˋ […] ㄖㄤˋ ㄨㄛˇ ㄒㄧㄚˋ ㄔㄜ。', englishTemplate: 'Driver, please let me off at [Spot] up ahead.', scenarioTag: 'Taxi (小黃)', exampleTraditional: '司機先生，請在前面巷口讓我下車。', exampleZhuyin: 'ㄙ ㄐㄧ ㄒㄧㄢ ㄕㄥ，ㄑㄧㄥˇ ㄗㄞˋ ㄑㄧㄢˊ ㄇㄧㄢˋ ㄒㄧㄤˋ ㄎㄡˇ ㄖㄤˋ ㄨㄛˇ ㄒㄧㄚˋ ㄔㄜ。', exampleEnglish: 'Driver, please let me off at the alley entrance ahead.' },
  { id: 'sak-09', frameNumber: 9, patternTraditional: '你好，我有健保卡，我要掛號看醫生。', patternZhuyin: 'ㄋㄧˇ ㄏㄠˇ，ㄨㄛˇ ㄧㄡˇ ㄐㄧㄢˋ ㄅㄠˇ ㄎㄚˇ，ㄨㄛˇ ㄧㄠˋ ㄍㄨㄚˋ ㄏㄠˋ ㄎㄢˋ ㄧ ㄕㄥ。', englishTemplate: 'Hello, I have my NHI card and would like to register to see the doctor.', scenarioTag: 'Clinic & Healthcare', exampleTraditional: '你好，我喉嚨痛，我要掛號看診。', exampleZhuyin: 'ㄋㄧˇ ㄏㄠˇ，ㄨㄛˇ ㄏㄡˊ ㄌㄨㄥˊ ㄊㄨㄥˋ，ㄨㄛˇ ㄧㄠˋ ㄍㄨㄚˋ ㄏㄠˋ ㄎㄢˋ ㄓㄣˇ。', exampleEnglish: 'Hello, I have a sore throat and would like to register for a consultation.' },
  { id: 'sak-10', frameNumber: 10, patternTraditional: '請問這個現在有打折嗎？', patternZhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄓㄜˋ ㄍㄜ˙ ㄒㄧㄢˋ ㄗㄞˋ ㄧㄡˇ ㄉㄚˇ ㄓㄜˊ ㄇㄚ˙？', englishTemplate: 'Is there a discount on this right now?', scenarioTag: 'Department Store / Market', exampleTraditional: '請問買兩件有打八折嗎？', exampleZhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄇㄞˇ ㄌㄧㄤˇ ㄐㄧㄢˋ ㄧㄡˇ ㄉㄚˇ ㄅㄚ ㄓㄜˊ ㄇㄚ˙？', exampleEnglish: 'Is there a 20% discount (八折) if I buy two?' },
  { id: 'sak-11', frameNumber: 11, patternTraditional: '請問到 [目的地] 要在幾號月台搭車？', patternZhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄉㄠˋ […] ㄧㄠˋ ㄗㄞˋ ㄐㄧˇ ㄏㄠˋ ㄩㄝˋ ㄊㄞˊ ㄉㄚ ㄔㄜ？', englishTemplate: 'Which platform should I take to get to [Destination]?', scenarioTag: 'TRA / HSR / MRT', exampleTraditional: '請問到臺南要在幾號月台搭高鐵？', exampleZhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄉㄠˋ ㄊㄞˊ ㄋㄢˊ ㄧㄠˋ ㄗㄞˋ ㄐㄧˇ ㄏㄠˋ ㄩㄝˋ ㄊㄞˊ ㄉㄚ ㄍㄠ ㄊㄧㄝˇ？', exampleEnglish: 'Which platform do I take for the HSR to Tainan?' },
  { id: 'sak-12', frameNumber: 12, patternTraditional: '不好意思，我的中文還在學，可以講慢一點嗎？', patternZhuyin: 'ㄅㄨˋ ㄏㄠˇ ㄧˋ ㄙ˙，ㄨㄛˇ ㄉㄜ˙ ㄓㄨㄥ ㄨㄣˊ ㄏㄞˊ ㄗㄞˋ ㄒㄩㄝˊ，ㄎㄜˇ ㄧˇ ㄐㄧㄤˇ ㄇㄢˋ ㄧˋ ㄉㄧㄢˇ ㄇㄚ˙？', englishTemplate: 'Sorry, I am still learning Chinese—could you speak a little slower?', scenarioTag: 'Clarification & Repair', exampleTraditional: '不好意思，可以請你再說一次嗎？', exampleZhuyin: 'ㄅㄨˋ ㄏㄠˇ ㄧˋ ㄙ˙，ㄎㄜˇ ㄧˇ ㄑㄧㄥˇ ㄋㄧˇ ㄗㄞˋ ㄕㄨㄛ ㄧˊ ㄘˋ ㄇㄚ˙？', exampleEnglish: 'Excuse me, could you please say that one more time?' },
];

/**
 * Authentic Taiwanese Laminated Paper Tick-Menu (點菜單) Catalog & Real-World Missions (FORM-REQ-0010).
 */
export const TICK_MENU_CATALOG: TickMenuItemSpec[] = [
  { id: 'tm-beef-lg', category: 'noodles_mains', categoryLabel: '麵類主食 (Noodles)', traditional: '紅燒牛肉麵 (大)', zhuyin: 'ㄏㄨㄥˊ ㄕㄠ ㄋㄧㄡˊ ㄖㄡˋ ㄇㄧㄢˋ (ㄉㄚˋ)', english: 'Braised Beef Noodle Soup (Large)', priceNtd: 160, allowSpice: true },
  { id: 'tm-beef-sm', category: 'noodles_mains', categoryLabel: '麵類主食 (Noodles)', traditional: '紅燒牛肉麵 (小)', zhuyin: 'ㄏㄨㄥˊ ㄕㄠ ㄋㄧㄡˊ ㄖㄡˋ ㄇㄧㄢˋ (ㄒㄧㄠˇ)', english: 'Braised Beef Noodle Soup (Small)', priceNtd: 140, allowSpice: true },
  { id: 'tm-zhajiang', category: 'noodles_mains', categoryLabel: '麵類主食 (Noodles)', traditional: '古早味炸醬麵', zhuyin: 'ㄍㄨˇ ㄗㄠˇ ㄨㄟˋ ㄓㄚˊ ㄐㄧㄤˋ ㄇㄧㄢˋ', english: 'Old-Style Zha Jiang Dry Noodles', priceNtd: 75, allowSpice: true },
  { id: 'tm-dumplings', category: 'dumplings_rice', categoryLabel: '水餃飯類 (Dumplings & Rice)', traditional: '手工高麗菜水餃 (10顆)', zhuyin: 'ㄕㄡˇ ㄍㄨㄥ ㄍㄠ ㄌㄧˋ ㄘㄞˋ ㄕㄨㄟˇ ㄐㄧㄠˇ', english: 'Handmade Cabbage Dumplings (10 pcs)', priceNtd: 80, allowSpice: false },
  { id: 'tm-luroufan', category: 'dumplings_rice', categoryLabel: '水餃飯類 (Dumplings & Rice)', traditional: '招牌滷肉飯', zhuyin: 'ㄓㄠ ㄆㄞˊ ㄌㄨˇ ㄖㄡˋ ㄈㄢˋ', english: 'Signature Braised Pork Rice', priceNtd: 45, allowSpice: false },
  { id: 'tm-cucumber', category: 'side_dishes', categoryLabel: '精緻小菜 (Cold & Braised Sides)', traditional: '涼拌小黃瓜', zhuyin: 'ㄌㄧㄤˊ ㄅㄢˋ ㄒㄧㄠˇ ㄏㄨㄤˊ ㄍㄨㄚ', english: 'Chilled Garlic Cucumber Side Dish', priceNtd: 40, allowSpice: false },
  { id: 'tm-tofu-egg', category: 'side_dishes', categoryLabel: '精緻小菜 (Cold & Braised Sides)', traditional: '滷蛋豆干拼盤', zhuyin: 'ㄌㄨˇ ㄉㄢˋ ㄉㄡˋ ㄍㄢ ㄆㄧㄣ ㄆㄢˊ', english: 'Braised Egg & Dried Tofu Platter', priceNtd: 35, allowSpice: false },
  { id: 'tm-soymilk', category: 'drinks_soups', categoryLabel: '湯品飲料 (Soups & Drinks)', traditional: '非基改冰豆漿', zhuyin: 'ㄈㄟ ㄐㄧ ㄍㄞˇ ㄅㄧㄥ ㄉㄡˋ ㄐㄧㄤ', english: 'Chilled Non-GMO Soy Milk', priceNtd: 25, allowSpice: false },
  { id: 'tm-hot-sour-soup', category: 'drinks_soups', categoryLabel: '湯品飲料 (Soups & Drinks)', traditional: '招牌酸辣湯', zhuyin: 'ㄓㄠ ㄆㄞˊ ㄙㄨㄢ ㄌㄚˋ ㄊㄤ', english: 'House Hot & Sour Soup', priceNtd: 45, allowSpice: false },
];

export const TICK_MENU_MISSIONS: TickMenuOrderMission[] = [
  {
    id: 'mission-1-table5-beef',
    missionNumber: 1,
    title: 'Mission 1: Dine-in Table 5 Beef Noodle & Sides',
    customerBriefEnglish: 'Dine-in at Table 5: Order 1 Large Braised Beef Noodle (mild spicy), 1 Chilled Cucumber side dish, and 2 Chilled Soy Milks. (Expected Total: NT$250)',
    customerBriefTraditional: '內用第 5 桌：點一碗紅燒牛肉麵（大、小辣）、一盤涼拌小黃瓜、兩杯冰豆漿。（總計：250 元）',
    diningMode: 'dine_in',
    expectedTableNumber: '5',
    expectedItems: [
      { itemId: 'tm-beef-lg', quantity: 1, spiceNote: 'mild' },
      { itemId: 'tm-cucumber', quantity: 1 },
      { itemId: 'tm-soymilk', quantity: 2 },
    ],
    expectedTotalNtd: 250,
  },
  {
    id: 'mission-2-takeout-dumplings',
    missionNumber: 2,
    title: 'Mission 2: Quick Takeout Dumplings & Luroufan Dinner',
    customerBriefEnglish: 'Takeout Order: 1 order of Handmade Cabbage Dumplings (10 pcs), 1 Signature Braised Pork Rice, 1 Braised Egg & Tofu Platter, and 1 Hot & Sour Soup. (Expected Total: NT$205)',
    customerBriefTraditional: '外帶：一份手工高麗菜水餃、一碗招牌滷肉飯、一盤滷蛋豆干拼盤、一碗酸辣湯。（總計：205 元）',
    diningMode: 'takeout',
    expectedItems: [
      { itemId: 'tm-dumplings', quantity: 1 },
      { itemId: 'tm-luroufan', quantity: 1 },
      { itemId: 'tm-tofu-egg', quantity: 1 },
      { itemId: 'tm-hot-sour-soup', quantity: 1 },
    ],
    expectedTotalNtd: 205,
  },
  {
    id: 'mission-3-table8-friends',
    missionNumber: 3,
    title: 'Mission 3: Table 8 Lunch with Classmate',
    customerBriefEnglish: 'Dine-in at Table 8: 1 Small Braised Beef Noodle, 1 Old-Style Zha Jiang Dry Noodles, and 1 Chilled Cucumber side dish. (Expected Total: NT$255)',
    customerBriefTraditional: '內用第 8 桌：一碗紅燒牛肉麵（小）、一碗古早味炸醬麵、一盤涼拌小黃瓜。（總計：255 元）',
    diningMode: 'dine_in',
    expectedTableNumber: '8',
    expectedItems: [
      { itemId: 'tm-beef-sm', quantity: 1 },
      { itemId: 'tm-zhajiang', quantity: 1 },
      { itemId: 'tm-cucumber', quantity: 1 },
    ],
    expectedTotalNtd: 255,
  },
];

/**
 * 8 Core Taiwanese Sentence-Final Particles (語助詞) (FORM-REQ-0010).
 */
export const TAIWAN_PARTICLES: TaiwanFinalParticleSpec[] = [
  { id: 'pt-la', particle: '啦', zhuyin: 'ㄌㄚ˙', pinyin: 'la', nuance: 'Friendly finality / softening refusal or impatience', taiwanContext: 'Turns a blunt statement ("好" / "不用") into warm Taiwanese rapport ("好啦！" / "不用啦！").', exampleTraditional: '好啦！沒關係啦，下次再請我就好！', exampleZhuyin: 'ㄏㄠˇ ㄌㄚ˙！ㄇㄟˊ ㄍㄨㄢ ㄒㄧ˙ ㄌㄚ˙，ㄒㄧㄚˋ ㄘˋ ㄗㄞˋ ㄑㄧㄥˇ ㄨㄛˇ ㄐㄧㄡˋ ㄏㄠˇ！', exampleEnglish: 'Alright then! No worries at all, just treat me next time!' },
  { id: 'pt-o', particle: '喔', zhuyin: 'ㄛ˙', pinyin: 'o', nuance: 'Warm reminder / gentle warning / realization', taiwanContext: 'Heard constantly from shopkeepers ("小心燙喔！" Careful, it is hot!).', exampleTraditional: '湯很燙，喝的時候要小心喔！', exampleZhuyin: 'ㄊㄤ ㄏㄣˇ ㄊㄤˋ，ㄏㄜ ㄉㄜ˙ ㄕˊ ㄏㄡˋ ㄧㄠˋ ㄒㄧㄠˇ ㄒㄧㄣ ㄛ˙！', exampleEnglish: 'The soup is very hot—be careful when drinking it!' },
  { id: 'pt-ye', particle: '耶', zhuyin: 'ㄧㄝ', pinyin: 'yē', nuance: 'Pleasant surprise / lively discovery', taiwanContext: 'Expresses genuine enthusiasm when discovering good food or news.', exampleTraditional: '這家巷口的小籠包真的超好吃耶！', exampleZhuyin: 'ㄓㄜˋ ㄐㄧㄚ ㄒㄧㄤˋ ㄎㄡˇ ㄉㄜ˙ ㄒㄧㄠˇ ㄌㄨㄥˊ ㄅㄠ ㄓㄣ ㄉㄜ˙ ㄔㄠ ㄏㄠˇ ㄔ ㄧㄝ！', exampleEnglish: 'The soup dumplings at this alley corner are seriously delicious!' },
  { id: 'pt-ei', particle: '欸', zhuyin: 'ㄟˇ', pinyin: 'ěi', nuance: 'Casual "Hey!" / "By the way" attention starter', taiwanContext: 'Used at the start of a sentence among friends to introduce a new idea.', exampleTraditional: '欸，今天晚上我們去逛饒河夜市好不好？', exampleZhuyin: 'ㄟˇ，ㄐㄧㄣ ㄊㄧㄢ ㄨㄢˇ ㄕㄤˋ ㄨㄛˇ ㄇㄣ˙ ㄑㄩˋ ㄍㄨㄤˋ ㄖㄠˊ ㄏㄜˊ ㄧㄝˋ ㄕˋ ㄏㄠˇ ㄅㄨˋ ㄏㄠˇ？', exampleEnglish: 'Hey, how about we go stroll Raohe Night Market tonight?' },
  { id: 'pt-hou', particle: '齁', zhuyin: 'ㄏㄡ', pinyin: 'hōu', nuance: 'Seeking shared agreement / "Right?" / "I knew it!"', taiwanContext: 'Borrowed from Taiwanese Hokkien (honn), inviting the listener to nod along.', exampleTraditional: '臺北夏天的下午很容易下大雨齁？', exampleZhuyin: 'ㄊㄞˊ ㄅㄟˇ ㄒㄧㄚˋ ㄊㄧㄢ ㄉㄜ˙ ㄒㄧㄚˋ ㄨˇ ㄏㄣˇ ㄖㄨㄥˊ ㄧˋ ㄒㄧㄚˋ ㄉㄚˋ ㄩˇ ㄏㄡ？', exampleEnglish: 'Summer afternoons in Taipei get heavy rain so easily, right?' },
  { id: 'pt-luo', particle: '囉', zhuyin: 'ㄌㄨㄛ˙', pinyin: 'luo', nuance: 'Upbeat transition / "Here we go!" / "That settles it"', taiwanContext: 'Signals cheerful completion or departure ("我們先走囉！").', exampleTraditional: '餐點都齊了，那我們就開動囉！', exampleZhuyin: 'ㄘㄢ ㄉㄧㄢˇ ㄉㄡ ㄑㄧˊ ㄌㄜ˙，ㄋㄚˋ ㄨㄛˇ ㄇㄣ˙ ㄐㄧㄡˋ ㄎㄞ ㄉㄨㄥˋ ㄌㄨㄛ˙！', exampleEnglish: 'All the dishes are here, so let’s dig in!' },
  { id: 'pt-ma', particle: '嘛', zhuyin: 'ㄇㄚ˙', pinyin: 'ma', nuance: 'Stating the obvious / gentle coaxing', taiwanContext: 'Softens a request or reminds someone of an obvious reason.', exampleTraditional: '別生氣嘛，他也不是故意的。', exampleZhuyin: 'ㄅㄧㄝˊ ㄕㄥ ㄑㄧˋ ㄇㄚ˙，ㄊㄚ ㄧㄝˇ ㄅㄨˊ ㄕˋ ㄍㄨˋ ㄧˋ ㄉㄜ˙。', exampleEnglish: 'Come on, don’t be mad—he didn’t mean to do it.' },
  { id: 'pt-ba', particle: '吧', zhuyin: 'ㄅㄚ˙', pinyin: 'ba', nuance: 'Polite suggestion / softened supposition', taiwanContext: 'Makes proposals collaborative rather than bossy.', exampleTraditional: '外面好像快下雨了，我們還是搭捷運去吧！', exampleZhuyin: 'ㄨㄞˋ ㄇㄧㄢˋ ㄏㄠˇ ㄒㄧㄤˋ ㄎㄨㄞˋ ㄒㄧㄚˋ ㄩˇ ㄌㄜ˙，ㄨㄛˇ ㄇㄣ˙ ㄏㄞˊ ㄕˋ ㄉㄚ ㄐㄧㄝˊ ㄩㄣˋ ㄑㄩˋ ㄅㄚ˙！', exampleEnglish: 'It looks like it’s about to rain outside—let’s take the MRT instead!' },
];

/**
 * 10 Everyday Hokkien-in-Mandarin (臺語) Expressions Used Daily Across Taiwan (FORM-REQ-0010).
 */
export const HOKKIEN_EXPRESSIONS: HokkienLoanwordSpec[] = [
  { id: 'hk-01-paise', traditional: '歹勢', mandarinZhuyin: 'ㄆㄞˇ ㄙㄟˋ', tailoRomanization: 'pháinn-sè', english: 'Excuse me / Sorry to trouble you!', usageContext: 'Universal Taiwanese politeness expression used alongside 不好意思.', exampleTraditional: '歹勢，借過一下喔！', exampleZhuyin: 'ㄆㄞˇ ㄙㄟˋ，ㄐㄧㄝˋ ㄍㄨㄛˋ ㄧˊ ㄒㄧㄚˋ ㄛ˙！', exampleEnglish: 'Excuse me (pháinn-sè), coming through for a second!' },
  { id: 'hk-02-agong-ama', traditional: '阿公 / 阿嬤', mandarinZhuyin: 'ㄚ ㄍㄨㄥ / ㄚ ㄇㄚˋ', tailoRomanization: 'a-kong / a-má', english: 'Grandpa / Grandma', usageContext: 'Standard warm family terms for grandparents across Taiwan.', exampleTraditional: '週末我要回臺南看阿公和阿嬤。', exampleZhuyin: 'ㄓㄨㄛ ㄇㄛˋ ㄨㄛˇ ㄧㄠˋ ㄏㄨㄟˊ ㄊㄞˊ ㄋㄢˊ ㄎㄢˋ ㄚ ㄍㄨㄥ ㄏㄢˋ ㄚ ㄇㄚˋ。', exampleEnglish: 'This weekend I am going back to Tainan to visit Grandpa and Grandma.' },
  { id: 'hk-03-tauke', traditional: '頭家', mandarinZhuyin: 'ㄊㄠˊ ㄍㄟ', tailoRomanization: 'thâu-ke', english: 'Boss / Shop Owner', usageContext: 'Friendly way to address a traditional market vendor or small restaurant owner.', exampleTraditional: '頭家，這盤滷味多少錢？', exampleZhuyin: 'ㄊㄠˊ ㄍㄟ，ㄓㄜˋ ㄆㄢˊ ㄌㄨˇ ㄨㄟˋ ㄉㄨㄛ ㄕㄠˇ ㄑㄧㄢˊ？', exampleEnglish: 'Boss, how much is this plate of braised snacks?' },
  { id: 'hk-04-kumo', traditional: '龜毛', mandarinZhuyin: 'ㄍㄨㄟ ㄇㄠˊ', tailoRomanization: 'ku-mo', english: 'Finicky / Nitpicky / Perfectionist', usageContext: 'Describes someone overly fussy about tiny details.', exampleTraditional: '他泡咖啡很龜毛，水溫一定要剛好九十度。', exampleZhuyin: 'ㄊㄚ ㄆㄠˋ ㄎㄚ ㄈㄟ ㄏㄣˇ ㄍㄨㄟ ㄇㄠˊ，ㄕㄨㄟˇ ㄨㄣ ㄧˊ ㄉㄧㄥˋ ㄧㄠˋ ㄍㄤ ㄏㄠˇ ㄐㄧㄡˇ ㄕˊ ㄉㄨˋ。', exampleEnglish: 'He is super particular about brewing coffee—the water must be exactly 90°C.' },
  { id: 'hk-05-maji', traditional: '麻吉', mandarinZhuyin: 'ㄇㄚˊ ㄐㄧˊ', tailoRomanization: 'mâ-tsit', english: 'Best Buddy / Close Pal (like sticky mochi)', usageContext: 'Describes two friends who stick together effortlessly.', exampleTraditional: '我們從大學時代就是最好的麻吉。', exampleZhuyin: 'ㄨㄛˇ ㄇㄣ˙ ㄘㄨㄥˊ ㄉㄚˋ ㄒㄩㄝˊ ㄕˊ ㄉㄞˋ ㄐㄧㄡˋ ㄕˋ ㄗㄨㄟˋ ㄏㄠˇ ㄉㄜ˙ ㄇㄚˊ ㄐㄧˊ。', exampleEnglish: 'We have been best buddies since our university days.' },
  { id: 'hk-06-laoqia', traditional: '落漆', mandarinZhuyin: 'ㄌㄠˋ ㄑㄧ', tailoRomanization: 'làu-tshat', english: 'Peeling paint → Botched / Clumsy / Epic Fail', usageContext: 'Used humorously when a performance or plan goes awkwardly wrong.', exampleTraditional: '原本想耍帥，結果跌倒真是太落漆了！', exampleZhuyin: 'ㄩㄢˊ ㄅㄣˇ ㄒㄧㄤˇ ㄕㄨㄚˇ ㄕㄨㄞˋ，ㄐㄧㄝˊ ㄍㄨㄛˇ ㄉㄧㄝˊ ㄉㄠˇ ㄓㄣ ㄕˋ ㄊㄞˋ ㄌㄠˋ ㄑㄧ ㄌㄜ˙！', exampleEnglish: 'I tried to act cool, so tripping over was such an epic fail!' },
  { id: 'hk-07-yuzu', traditional: '鬱卒', mandarinZhuyin: 'ㄩˋ ㄗㄨˊ', tailoRomanization: 'ut-tsut', english: 'Pent-up / Gloomy / Frustrated', usageContext: 'Expresses feeling down or stifled after a rough day.', exampleTraditional: '連下一整個星期的雨，心情難免有點鬱卒。', exampleZhuyin: 'ㄌㄧㄢˊ ㄒㄧㄚˋ ㄧˋ ㄓㄥˇ ㄍㄜ˙ ㄒㄧㄥ ㄑㄧˊ ㄉㄜ˙ ㄩˇ，ㄒㄧㄣ ㄑㄧㄥˊ ㄋㄢˊ ㄇㄧㄢˇ ㄧㄡˇ ㄉㄧㄢˇ ㄩˋ ㄗㄨˊ。', exampleEnglish: 'After a whole week of non-stop rain, it’s hard not to feel a bit gloomy.' },
  { id: 'hk-08-dongsuan', traditional: '凍蒜', mandarinZhuyin: 'ㄉㄨㄥˋ ㄙㄨㄢˋ', tailoRomanization: 'tòng-suàn', english: 'Get Elected! (當選) / Victory Chant', usageContext: 'Iconic Taiwanese rally and competition cheer (also explains garlic 蒜頭 charms).', exampleTraditional: '造勢晚會上大家高喊「凍蒜！凍蒜！」', exampleZhuyin: 'ㄗㄠˋ ㄕˋ ㄨㄢˇ ㄏㄨㄟˋ ㄕㄤˋ ㄉㄚˋ ㄐㄧㄚ ㄍㄠ ㄏㄢˇ「ㄉㄨㄥˋ ㄙㄨㄢˋ！ㄉㄨㄥˋ ㄙㄨㄢˋ！」', exampleEnglish: 'At the campaign rally everyone chanted "Tòng-suàn (Win the election)!"' },
  { id: 'hk-09-maidan', traditional: '買單', mandarinZhuyin: 'ㄇㄞˇ ㄉㄢ', tailoRomanization: 'mǎidān /結帳', english: 'Check, please! / Settle the bill', usageContext: 'Used with a writing gesture in the air to ask for the restaurant check.', exampleTraditional: '服務生，不好意思，我們要買單！', exampleZhuyin: 'ㄈㄨˊ ㄨˋ ㄕㄥ，ㄅㄨˋ ㄏㄠˇ ㄧˋ ㄙ˙，ㄨㄛˇ ㄇㄣ˙ ㄧㄠˋ ㄇㄞˇ ㄉㄢ！', exampleEnglish: 'Excuse me, server—we would like the check, please!' },
  { id: 'hk-10-olen', traditional: '黑輪', mandarinZhuyin: 'ㄛ ㄌㄨㄣˊ', tailoRomanization: 'o-lián', english: 'Taiwanese Oden / Fishcake Skewer', usageContext: 'Taiwanese Hokkien adaptation of Japanese oden, sold at night markets and 7-Eleven.', exampleTraditional: '冬天晚上吃一碗熱呼呼的關東煮黑輪最棒了。', exampleZhuyin: 'ㄉㄨㄥ ㄊㄧㄢ ㄨㄢˇ ㄕㄤˋ ㄔ ㄧˋ ㄨㄢˇ ㄖㄜˋ ㄏㄨ ㄏㄨ ㄉㄜ˙ ㄍㄨㄢ ㄉㄨㄥ ㄓㄨˇ ㄛ ㄌㄨㄣˊ ㄗㄨㄟˋ ㄅㄤˋ ㄌㄜ˙。', exampleEnglish: 'Eating a piping-hot bowl of oden fishcake on a winter night is the best.' },
];
