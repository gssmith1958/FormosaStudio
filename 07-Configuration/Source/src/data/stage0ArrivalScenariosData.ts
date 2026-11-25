/**
 * FormosaStudio (FORM) — Stage 0.5 Five Authentic Real-Life Taiwan Arrival Scenarios
 * Audio-first, shuffled-option dialogues covering Taipei Café, 7-Eleven/FamilyMart, MRT & Directions,
 * Night Market/Noodle Stall, and Restroom & Asking for Help (zero Mainland lexical leakage).
 * Traces to: FORM-ECR-001, FORM-WF-004, PED-3
 */

export interface ArrivalScenarioOption {
  text: string;
  zhuyin: string;
  pinyin: string;
  en: string;
}

export interface ArrivalScenarioTurn {
  speakerRole: string;
  clerkZh: string;
  clerkZhuyin: string;
  clerkPinyin: string;
  clerkEn: string;
  options: ArrivalScenarioOption[];
  correctIdx: number;
}

export interface ArrivalScenario {
  id: string;
  order: number;
  titleEn: string;
  titleZh: string;
  settingTag: string;
  culturalCue: string;
  turns: ArrivalScenarioTurn[];
}

export const STAGE0_ARRIVAL_SCENARIOS: ArrivalScenario[] = [
  {
    id: 'taipei-cafe',
    order: 1,
    titleEn: 'Taipei Café & Boba Shop',
    titleZh: '臺北咖啡與手搖飲',
    settingTag: 'Drinks & Ordering',
    culturalCue: 'In Taiwan drink shops, clerks almost always ask sugar/ice preference (微糖去冰 = 30% sugar, no ice) and whether you need a NT$1–2 bag (需要袋子嗎？).',
    turns: [
      {
        speakerRole: 'Barista',
        clerkZh: '你好！請問要點什麼？',
        clerkZhuyin: 'ㄋㄧˇ ㄏㄠˇ！ㄑㄧㄥˇ ㄨㄣˋ ㄧㄠˋ ㄉㄧㄢˇ ㄕㄜˊ ˙ㄇㄜ？',
        clerkPinyin: 'Nǐ hǎo! Qǐngwèn yào diǎn shénme?',
        clerkEn: 'Hello! What would you like to order?',
        options: [
          { text: '再見！', zhuyin: 'ㄗㄞˋ ㄐㄧㄢˋ', pinyin: 'Zàijiàn!', en: 'Goodbye!' },
          { text: '我要一杯烏龍茶，微糖去冰，謝謝。', zhuyin: 'ㄨㄛˇ ㄧㄠˋ ㄧˋ ㄅㄟ ㄨ ㄌㄨㄥˊ ㄔㄚˊ，ㄨㄟˊ ㄊㄤˊ ㄑㄩˋ ㄅㄧㄥ，ㄒㄧㄝˋ ˙ㄒㄧㄝ', pinyin: 'Wǒ yào yì bēi wūlóngchá, wéitáng qùbīng, xièxie.', en: 'I want a cup of oolong tea, slight sugar no ice, thanks.' },
          { text: '聽不懂。', zhuyin: 'ㄊㄧㄥ ㄅㄨˋ ㄉㄨㄥˇ', pinyin: 'Tīng bù dǒng.', en: 'I don’t understand.' },
        ],
        correctIdx: 1,
      },
      {
        speakerRole: 'Barista',
        clerkZh: '好，一共五十塊。',
        clerkZhuyin: 'ㄏㄠˇ，ㄧˊ ㄍㄨㄥˋ ㄨˇ ㄕˊ ㄎㄨㄞˋ。',
        clerkPinyin: 'Hǎo, yígòng wǔshí kuài.',
        clerkEn: 'Okay, that is NT$50 total.',
        options: [
          { text: '給你，謝謝！', zhuyin: 'ㄍㄟˇ ㄋㄧˇ，ㄒㄧㄝˋ ˙ㄒㄧㄝ', pinyin: 'Gěi nǐ, xièxie!', en: 'Here you go, thank you!' },
          { text: '請問洗手間在哪裡？', zhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄒㄧˇ ㄕㄡˇ ㄐㄧㄢ ㄗㄞˋ ㄋㄚˇ ㄌㄧˇ', pinyin: 'Qǐngwèn xǐshǒujiān zài nǎlǐ?', en: 'Where is the restroom?' },
          { text: '不要辣。', zhuyin: 'ㄅㄨˊ ㄧㄠˋ ㄌㄚˋ', pinyin: 'Búyào là.', en: 'Not spicy.' },
        ],
        correctIdx: 0,
      },
      {
        speakerRole: 'Barista',
        clerkZh: '需要袋子嗎？',
        clerkZhuyin: 'ㄒㄩ ㄧㄠˋ ㄉㄞˋ ˙ㄗ ˙ㄇㄚ？',
        clerkPinyin: 'Xūyào dàizi ma?',
        clerkEn: 'Do you need a bag?',
        options: [
          { text: '請問？', zhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ', pinyin: 'Qǐngwèn?', en: 'May I ask?' },
          { text: '多少錢？', zhuyin: 'ㄉㄨㄛ ㄕㄠˇ ㄑㄧㄢˊ', pinyin: 'Duōshǎo qián?', en: 'How much?' },
          { text: '不用，謝謝！', zhuyin: 'ㄅㄨˊ ㄩㄥˋ，ㄒㄧㄝˋ ˙ㄒㄧㄝ', pinyin: 'Búyòng, xièxie!', en: 'No need, thanks!' },
        ],
        correctIdx: 2,
      },
    ],
  },
  {
    id: 'convenience-store',
    order: 2,
    titleEn: '7-Eleven / FamilyMart Checkout',
    titleZh: '便利商店結帳',
    settingTag: 'Everyday Errands',
    culturalCue: 'Taiwan 7-Eleven & FamilyMart clerks ask 「需要微波加熱嗎？」 (heat up your bento?) and 「需要載具嗎？」 (save your Taiwan receipt-lottery e-invoice to a phone barcode?).',
    turns: [
      {
        speakerRole: '7-Eleven Clerk',
        clerkZh: '歡迎光臨！請問這個便當需要加熱嗎？',
        clerkZhuyin: 'ㄏㄨㄢ ㄧㄥˊ ㄍㄨㄤ ㄌㄧㄣˊ！ㄑㄧㄥˇ ㄨㄣˋ ㄓㄜˋ ˙ㄍㄜ ㄅㄧㄢˋ ㄉㄤ ㄒㄩ ㄧㄠˋ ㄐㄧㄚ ㄖㄜˋ ˙ㄇㄚ？',
        clerkPinyin: 'Huānyíng guānglín! Qǐngwèn zhège biàndāng xūyào jiārè ma?',
        clerkEn: 'Welcome! Would you like this bento heated up?',
        options: [
          { text: '我要搭捷運。', zhuyin: 'ㄨㄛˇ ㄧㄠˋ ㄉㄚ ㄐㄧㄝˊ ㄩㄣˋ', pinyin: 'Wǒ yào dā jiéyùn.', en: 'I want to take the MRT.' },
          { text: '不好意思，我迷路了。', zhuyin: 'ㄅㄨˋ ㄏㄠˇ ㄧˋ ˙ㄙ，ㄨㄛˇ ㄇㄧˊ ㄌㄨˋ ˙ㄌㄜ', pinyin: 'Bù hǎo yìsi, wǒ mílù le.', en: 'Excuse me, I am lost.' },
          { text: '好，麻煩幫我加熱，謝謝。', zhuyin: 'ㄏㄠˇ，ㄇㄚˊ ㄈㄢˊ ㄅㄤ ㄨㄛˇ ㄐㄧㄚ ㄖㄜˋ，ㄒㄧㄝˋ ˙ㄒㄧㄝ', pinyin: 'Hǎo, máfan bāng wǒ jiārè, xièxie.', en: 'Yes, please heat it up for me, thanks.' },
        ],
        correctIdx: 2,
      },
      {
        speakerRole: '7-Eleven Clerk',
        clerkZh: '請問有載具或會員嗎？',
        clerkZhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄧㄡˇ ㄗㄞˋ ㄐㄩˋ ㄏㄨㄛˋ ㄏㄨㄟˋ ㄩㄢˊ ˙ㄇㄚ？',
        clerkPinyin: 'Qǐngwèn yǒu zàijù huò huìyuán ma?',
        clerkEn: 'Do you have a receipt barcode or member number?',
        options: [
          { text: '沒有，給我紙本發票就好。', zhuyin: 'ㄇㄟˊ ㄧㄡˇ，ㄍㄟˇ ㄨㄛˇ ㄓˇ ㄅㄣˇ ㄈㄚ ㄆㄧㄠˋ ㄐㄧㄡˋ ㄏㄠˇ', pinyin: 'Méiyǒu, gěi wǒ zhǐběn fāpiào jiù hǎo.', en: 'No, a paper receipt is fine.' },
          { text: '這個太辣了。', zhuyin: 'ㄓㄜˋ ˙ㄍㄜ ㄊㄞˋ ㄌㄚˋ ˙ㄌㄜ', pinyin: 'Zhège tài là le.', en: 'This is too spicy.' },
          { text: '請問幾點開門？', zhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄐㄧˇ ㄉㄧㄢˇ ㄎㄞ ㄇㄣˊ', pinyin: 'Qǐngwèn jǐ diǎn kāimén?', en: 'What time do you open?' },
        ],
        correctIdx: 0,
      },
      {
        speakerRole: '7-Eleven Clerk',
        clerkZh: '一共九十五塊，請問怎麼付款？',
        clerkZhuyin: 'ㄧˊ ㄍㄨㄥˋ ㄐㄧㄡˇ ㄕˊ ㄨˇ ㄎㄨㄞˋ，ㄑㄧㄥˇ ㄨㄣˋ ㄗㄣˇ ˙ㄇㄜ ㄈㄨˋ ㄎㄨㄢˇ？',
        clerkPinyin: 'Yígòng jiǔshíwǔ kuài, qǐngwèn zěnme fùkuǎn?',
        clerkEn: 'NT$95 total — how would you like to pay?',
        options: [
          { text: '內用，謝謝。', zhuyin: 'ㄋㄟˋ ㄩㄥˋ，ㄒㄧㄝˋ ˙ㄒㄧㄝ', pinyin: 'Nèiyòng, xièxie.', en: 'Dine in, thanks.' },
          { text: '我刷悠遊卡，謝謝。', zhuyin: 'ㄨㄛˇ ㄕㄨㄚ ㄧㄡ ㄧㄡˊ ㄎㄚˇ，ㄒㄧㄝˋ ˙ㄒㄧㄝ', pinyin: 'Wǒ shuā Yōuyóukǎ, xièxie.', en: 'I will tap my EasyCard, thanks.' },
          { text: '這裡有洗手間嗎？', zhuyin: 'ㄓㄜˋ ㄌㄧˇ ㄧㄡˇ ㄒㄧˇ ㄕㄡˇ ㄐㄧㄢ ˙ㄇㄚ', pinyin: 'Zhèlǐ yǒu xǐshǒujiān ma?', en: 'Is there a restroom here?' },
        ],
        correctIdx: 1,
      },
    ],
  },
  {
    id: 'mrt-directions',
    order: 3,
    titleEn: 'Taipei MRT & Directions',
    titleZh: '臺北捷運與問路',
    settingTag: 'Transit',
    culturalCue: 'Taiwan locals always say 「捷運」 (jiéyùn) for the metro—never 「地鐵」. Remember: no eating, drinking, or gum once you pass the yellow gate line!',
    turns: [
      {
        speakerRole: 'Station Staff',
        clerkZh: '你好！請問要去哪裡？',
        clerkZhuyin: 'ㄋㄧˇ ㄏㄠˇ！ㄑㄧㄥˇ ㄨㄣˋ ㄧㄠˋ ㄑㄩˋ ㄋㄚˇ ㄌㄧˇ？',
        clerkPinyin: 'Nǐ hǎo! Qǐngwèn yào qù nǎlǐ?',
        clerkEn: 'Hello! Where are you headed?',
        options: [
          { text: '不好意思，請問去臺北101要搭哪一條線？', zhuyin: 'ㄅㄨˋ ㄏㄠˇ ㄧˋ ˙ㄙ，ㄑㄧㄥˇ ㄨㄣˋ ㄑㄩˋ ㄊㄞˊ ㄅㄟˇ 101 ㄧㄠˋ ㄉㄚ ㄋㄚˇ ㄧˋ ㄊㄧㄠˊ ㄒㄧㄢˋ？', pinyin: 'Bù hǎo yìsi, qǐngwèn qù Táiběi 101 yào dā nǎ yì tiáo xiàn?', en: 'Excuse me, which line goes to Taipei 101?' },
          { text: '我要一杯冰咖啡。', zhuyin: 'ㄨㄛˇ ㄧㄠˋ ㄧˋ ㄅㄟ ㄅㄧㄥ ㄎㄚ ㄈㄟ', pinyin: 'Wǒ yào yì bēi bīng kāfēi.', en: 'I want an iced coffee.' },
          { text: '不用加熱，謝謝。', zhuyin: 'ㄅㄨˊ ㄩㄥˋ ㄐㄧㄚ ㄖㄜˋ，ㄒㄧㄝˋ ˙ㄒㄧㄝ', pinyin: 'Búyòng jiārè, xièxie.', en: 'No need to heat it up, thanks.' },
        ],
        correctIdx: 0,
      },
      {
        speakerRole: 'Station Staff',
        clerkZh: '搭紅線，往象山方向，坐三站就到了。',
        clerkZhuyin: 'ㄉㄚ ㄏㄨㄥˊ ㄒㄧㄢˋ，ㄨㄤˇ ㄒㄧㄤˋ ㄕㄢ ㄈㄤ ㄒㄧㄤˋ，ㄗㄨㄛˋ ㄙㄢ ㄓㄢˋ ㄐㄧㄡˋ ㄉㄠˋ ˙ㄌㄜ。',
        clerkPinyin: 'Dā hóngxiàn, wǎng Xiàngshān fāngxiàng, zuò sān zhàn jiù dào le.',
        clerkEn: 'Take the Red Line toward Xiangshan — three stops and you are there.',
        options: [
          { text: '這碗麵很好吃。', zhuyin: 'ㄓㄜˋ ㄨㄢˇ ㄇㄧㄢˋ ㄏㄣˇ ㄏㄠˇ ㄔ', pinyin: 'Zhè wǎn miàn hěn hǎochī.', en: 'This bowl of noodles is delicious.' },
          { text: '請給我發票。', zhuyin: 'ㄑㄧㄥˇ ㄍㄟˇ ㄨㄛˇ ㄈㄚ ㄆㄧㄠˋ', pinyin: 'Qǐng gěi wǒ fāpiào.', en: 'Please give me the receipt.' },
          { text: '往象山，坐三站，明白了！請問入口在哪邊？', zhuyin: 'ㄨㄤˇ ㄒㄧㄤˋ ㄕㄢ，ㄗㄨㄛˋ ㄙㄢ ㄓㄢˋ，ㄇㄧㄥˊ ㄅㄞˊ ˙ㄌㄜ！ㄑㄧㄥˇ ㄨㄣˋ ㄖㄨˋ ㄎㄡˇ ㄗㄞˋ ㄋㄚˇ ㄅㄧㄢ？', pinyin: 'Wǎng Xiàngshān, zuò sān zhàn, míngbái le! Qǐngwèn rùkǒu zài nǎbiān?', en: 'Toward Xiangshan, 3 stops, got it! Which way is the entrance?' },
        ],
        correctIdx: 2,
      },
      {
        speakerRole: 'Station Staff',
        clerkZh: '往前直走，右轉就可以刷卡進站了。',
        clerkZhuyin: 'ㄨㄤˇ ㄑㄧㄢˊ ㄓˊ ㄗㄡˇ，ㄧㄡˋ ㄓㄨㄢˇ ㄐㄧㄡˋ ㄎㄜˇ ㄧˇ ㄕㄨㄚ ㄎㄚˇ ㄐㄧㄣˋ ㄓㄢˋ ˙ㄌㄜ。',
        clerkPinyin: 'Wǎng qián zhízǒu, yòuzhuǎn jiù kěyǐ shuākǎ jìnzhàn le.',
        clerkEn: 'Walk straight ahead and turn right to tap your card through the gate.',
        options: [
          { text: '我要微糖去冰。', zhuyin: 'ㄨㄛˇ ㄧㄠˋ ㄨㄟˊ ㄊㄤˊ ㄑㄩˋ ㄅㄧㄥ', pinyin: 'Wǒ yào wéitáng qùbīng.', en: 'I want slight sugar, no ice.' },
          { text: '太感謝你了，謝謝！', zhuyin: 'ㄊㄞˋ ㄍㄢˇ ㄒㄧㄝˋ ㄋㄧˇ ˙ㄌㄜ，ㄒㄧㄝˋ ˙ㄒㄧㄝ', pinyin: 'Tài gǎnxiè nǐ le, xièxie!', en: 'Thank you so much!' },
          { text: '請問可以加湯嗎？', zhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄎㄜˇ ㄧˇ ㄐㄧㄚ ㄊㄤ ˙ㄇㄚ', pinyin: 'Qǐngwèn kěyǐ jiātāng ma?', en: 'Can I get extra soup?' },
        ],
        correctIdx: 1,
      },
    ],
  },
  {
    id: 'night-market',
    order: 4,
    titleEn: 'Night Market & Noodle Stall',
    titleZh: '夜市與小吃攤',
    settingTag: 'Street Food',
    culturalCue: 'Address street food vendors warmly as 「老闆」 (lǎobǎn, boss) or 「老闆娘」! Always specify dining mode (內用/外帶) and spice level (不要辣 / 小辣).',
    turns: [
      {
        speakerRole: 'Stall Owner (老闆)',
        clerkZh: '來喔！今天要吃什麼？內用還是外帶？',
        clerkZhuyin: 'ㄌㄞˊ ˙ㄛ！ㄐㄧㄣ ㄊㄧㄢ ㄧㄠˋ ㄔ ㄕㄜˊ ˙ㄇㄜ？ㄋㄟˋ ㄩㄥˋ ㄏㄞˊ ㄕˋ ㄨㄞˋ ㄉㄞˋ？',
        clerkPinyin: 'Lái o! Jīntiān yào chī shénme? Nèiyòng háishì wàidài?',
        clerkEn: 'Step right up! What are you having today? Dine in or takeout?',
        options: [
          { text: '請問捷運怎麼走？', zhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄐㄧㄝˊ ㄩㄣˋ ㄗㄣˇ ˙ㄇㄜ ㄗㄡˇ', pinyin: 'Qǐngwèn jiéyùn zěnme zǒu?', en: 'How do I walk to the MRT?' },
          { text: '老闆，我要一碗牛肉麵，內用。', zhuyin: 'ㄌㄠˇ ㄅㄢˇ，ㄨㄛˇ ㄧㄠˋ ㄧˋ ㄨㄢˇ ㄋㄧㄡˊ ㄖㄡˋ ㄇㄧㄢˋ，ㄋㄟˋ ㄩㄥˋ。', pinyin: 'Lǎobǎn, wǒ yào yì wǎn niúròumiàn, nèiyòng.', en: 'Boss, I want a bowl of beef noodle soup, dine in.' },
          { text: '我刷悠遊卡。', zhuyin: 'ㄨㄛˇ ㄕㄨㄚ ㄧㄡ ㄧㄡˊ ㄎㄚˇ', pinyin: 'Wǒ shuā Yōuyóukǎ.', en: 'I tap my EasyCard.' },
        ],
        correctIdx: 1,
      },
      {
        speakerRole: 'Stall Owner (老闆)',
        clerkZh: '好，一碗牛肉麵！要不要加辣？',
        clerkZhuyin: 'ㄏㄠˇ，ㄧˋ ㄨㄢˇ ㄋㄧㄡˊ ㄖㄡˋ ㄇㄧㄢˋ！ㄧㄠˋ ㄅㄨˊ ㄧㄠˋ ㄐㄧㄚ ㄌㄚˋ？',
        clerkPinyin: 'Hǎo, yì wǎn niúròumiàn! Yào bú yào jiālā?',
        clerkEn: 'Got it, one beef noodle soup! Do you want chili added?',
        options: [
          { text: '請慢一點說。', zhuyin: 'ㄑㄧㄥˇ ㄇㄢˋ ㄧˋ ㄉㄧㄢˇ ㄕㄨㄛ', pinyin: 'Qǐng màn yìdiǎn shuō.', en: 'Please speak a bit slower.' },
          { text: '往象山方向。', zhuyin: 'ㄨㄤˇ ㄒㄧㄤˋ ㄕㄢ ㄈㄤ ㄒㄧㄤˋ', pinyin: 'Wǎng Xiàngshān fāngxiàng.', en: 'Toward Xiangshan.' },
          { text: '小辣就好，謝謝老闆！', zhuyin: 'ㄒㄧㄠˇ ㄌㄚˋ ㄐㄧㄡˋ ㄏㄠˇ，ㄒㄧㄝˋ ˙ㄒㄧㄝ ㄌㄠˇ ㄅㄢˇ', pinyin: 'Xiǎolà jiù hǎo, xièxie lǎobǎn!', en: 'Mild spice is great, thank you boss!' },
        ],
        correctIdx: 2,
      },
      {
        speakerRole: 'Stall Owner (老闆)',
        clerkZh: '一共一百五十塊，先找位子坐喔！',
        clerkZhuyin: 'ㄧˊ ㄍㄨㄥˋ ㄧˋ ㄅㄞˇ ㄨˇ ㄕˊ ㄎㄨㄞˋ，ㄒㄧㄢ ㄓㄠˇ ㄨㄟˋ ˙ㄗ ㄗㄨㄛˋ ˙ㄛ！',
        clerkPinyin: 'Yígòng yìbǎi wǔshí kuài, xiān zhǎo wèizi zuò o!',
        clerkEn: 'NT$150 total — go grab a seat first!',
        options: [
          { text: '好，給你一百五十塊，謝謝！', zhuyin: 'ㄏㄠˇ，ㄍㄟˇ ㄋㄧˇ ㄧˋ ㄅㄞˇ ㄨˇ ㄕˊ ㄎㄨㄞˋ，ㄒㄧㄝˋ ˙ㄒㄧㄝ', pinyin: 'Hǎo, gěi nǐ yìbǎi wǔshí kuài, xièxie!', en: 'Okay, here is NT$150, thank you!' },
          { text: '不用袋子。', zhuyin: 'ㄅㄨˊ ㄩㄥˋ ㄉㄞˋ ˙ㄗ', pinyin: 'Búyòng dàizi.', en: 'No bag needed.' },
          { text: '我沒有載具。', zhuyin: 'ㄨㄛˇ ㄇㄟˊ ㄧㄡˇ ㄗㄞˋ ㄐㄩˋ', pinyin: 'Wǒ méiyǒu zàijù.', en: 'I do not have a barcode.' },
        ],
        correctIdx: 0,
      },
    ],
  },
  {
    id: 'restroom-help',
    order: 5,
    titleEn: 'Restroom & Asking for Help',
    titleZh: '洗手間與請求協助',
    settingTag: 'Essential Politeness',
    culturalCue: '「不好意思」 (bù hǎo yìsi) is Taiwan’s #1 warm social lubricant — use it before asking strangers for directions, the restroom (洗手間), or asking someone to slow down (請慢一點).',
    turns: [
      {
        speakerRole: 'Friendly Local',
        clerkZh: '嗨，請問需要幫忙嗎？',
        clerkZhuyin: 'ㄏㄞ，ㄑㄧㄥˇ ㄨㄣˋ ㄒㄩ ㄧㄠˋ ㄅㄤ ㄇㄤˊ ˙ㄇㄚ？',
        clerkPinyin: 'Hāi, qǐngwèn xūyào bāngmáng ma?',
        clerkEn: 'Hi, do you need any help?',
        options: [
          { text: '我要外帶。', zhuyin: 'ㄨㄛˇ ㄧㄠˋ ㄨㄞˋ ㄉㄞˋ', pinyin: 'Wǒ yào wàidài.', en: 'I want takeout.' },
          { text: '一共五十塊。', zhuyin: 'ㄧˊ ㄍㄨㄥˋ ㄨˇ ㄕˊ ㄎㄨㄞˋ', pinyin: 'Yígòng wǔshí kuài.', en: 'NT$50 total.' },
          { text: '不好意思，請問這附近有洗手間嗎？', zhuyin: 'ㄅㄨˋ ㄏㄠˇ ㄧˋ ˙ㄙ，ㄑㄧㄥˇ ㄨㄣˋ ㄓㄜˋ ㄈㄨˋ ㄐㄧㄣˋ ㄧㄡˇ ㄒㄧˇ ㄕㄡˇ ㄐㄧㄢ ˙ㄇㄚ？', pinyin: 'Bù hǎo yìsi, qǐngwèn zhè fùjìn yǒu xǐshǒujiān ma?', en: 'Excuse me, is there a restroom nearby?' },
        ],
        correctIdx: 2,
      },
      {
        speakerRole: 'Friendly Local',
        clerkZh: '有喔，就在前面捷運站裡面二號出口旁邊。',
        clerkZhuyin: 'ㄧㄡˇ ˙ㄛ，ㄐㄧㄡˋ ㄗㄞˋ ㄑㄧㄢˊ ㄇㄧㄢˋ ㄐㄧㄝˊ ㄩㄣˋ ㄓㄢˋ ㄌㄧˇ ㄇㄧㄢˋ ㄦˋ ㄏㄠˋ ㄔㄨ ㄎㄡˇ ㄆㄤˊ ㄅㄧㄢ。',
        clerkPinyin: 'Yǒu o, jiù zài qiánmiàn jiéyùnzhàn lǐmiàn èrhào chūkǒu pángbiān.',
        clerkEn: 'Yes! Right inside the MRT station ahead, next to Exit 2.',
        options: [
          { text: '老闆，不要辣。', zhuyin: 'ㄌㄠˇ ㄅㄢˇ，ㄅㄨˊ ㄧㄠˋ ㄌㄚˋ', pinyin: 'Lǎobǎn, búyào là.', en: 'Boss, no spice.' },
          { text: '不好意思，我聽不太懂，可以說慢一點嗎？', zhuyin: 'ㄅㄨˋ ㄏㄠˇ ㄧˋ ˙ㄙ，ㄨㄛˇ ㄊㄧㄥ ㄅㄨˊ ㄊㄞˋ ㄉㄨㄥˇ，ㄎㄜˇ ㄧˇ ㄕㄨㄛ ㄇㄢˋ ㄧˋ ㄉㄧㄢˇ ˙ㄇㄚ？', pinyin: 'Bù hǎo yìsi, wǒ tīng bú tài dǒng, kěyǐ shuō màn yìdiǎn ma?', en: 'Sorry, I didn’t quite catch that — could you speak a bit slower?' },
          { text: '我要一杯烏龍茶。', zhuyin: 'ㄨㄛˇ ㄧㄠˋ ㄧˋ ㄅㄟ ㄨ ㄌㄨㄥˊ ㄔㄚˊ', pinyin: 'Wǒ yào yì bēi wūlóngchá.', en: 'I want a cup of oolong tea.' },
        ],
        correctIdx: 1,
      },
      {
        speakerRole: 'Friendly Local',
        clerkZh: '沒問題！前面捷運站，二號出口旁邊就是洗手間。',
        clerkZhuyin: 'ㄇㄟˊ ㄨㄣˋ ㄊㄧˊ！ㄑㄧㄢˊ ㄇㄧㄢˋ ㄐㄧㄝˊ ㄩㄣˋ ㄓㄢˋ，ㄦˋ ㄏㄠˋ ㄔㄨ ㄎㄡˇ ㄆㄤˊ ㄅㄧㄢ ㄐㄧㄡˋ ㄕˋ ㄒㄧˇ ㄕㄡˇ ㄐㄧㄢ。',
        clerkPinyin: 'Méi wèntí! Qiánmiàn jiéyùnzhàn, èrhào chūkǒu pángbiān jiùshì xǐshǒujiān.',
        clerkEn: 'No problem! MRT station ahead, right next to Exit 2 is the restroom.',
        options: [
          { text: '聽懂了！謝謝你，你人真好！', zhuyin: 'ㄊㄧㄥ ㄉㄨㄥˇ ˙ㄌㄜ！ㄒㄧㄝˋ ˙ㄒㄧㄝ ㄋㄧˇ，ㄋㄧˇ ㄖㄣˊ ㄓㄣ ㄏㄠˇ', pinyin: 'Tīng dǒng le! Xièxie nǐ, nǐ rén zhēn hǎo!', en: 'Got it! Thank you, you are so kind!' },
          { text: '多少錢？', zhuyin: 'ㄉㄨㄛ ㄕㄠˇ ㄑㄧㄢˊ', pinyin: 'Duōshǎo qián?', en: 'How much?' },
          { text: '需要加熱。', zhuyin: 'ㄒㄩ ㄧㄠˋ ㄐㄧㄚ ㄖㄜˋ', pinyin: 'Xūyào jiārè.', en: 'Needs heating.' },
        ],
        correctIdx: 0,
      },
    ],
  },
];
