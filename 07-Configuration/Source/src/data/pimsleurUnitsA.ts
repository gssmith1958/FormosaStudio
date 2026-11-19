/**
 * FormosaStudio (FORM) — Pimsleur Mandarin I Units 1–10 (Taiwanese Traditional & Zhuyin Edition)
 * Traces to: FORM-REQ-0003, FORM-REQ-0005
 */
export interface PimsleurVocabItem {
  english: string;
  traditional: string;
  simplified: string;
  zhuyin: string;
  pinyin: string;
}

export interface PimsleurDialogueItem {
  english: string;
  traditional: string;
  simplified: string;
  zhuyin: string;
  pinyin: string;
}

export interface PimsleurUnitData {
  unit: number;
  title: string;
  subtitle: string;
  vocab: PimsleurVocabItem[];
  dialogues: PimsleurDialogueItem[];
}


export const PIMSLEUR_UNITS_A: PimsleurUnitData[] = [
  {
    unit: 1,
    title: 'Unit 1: Excuse Me, Do You Speak Mandarin?',
    subtitle: 'Polite openings, languages (英文 / 普通話), and nationalities',
    vocab: [
      { english: 'Excuse me / sorry', traditional: '對不起', simplified: '对不起', zhuyin: 'ㄉㄨㄟˋ ㄅㄨˋ ㄑㄧˇ', pinyin: 'duìbuqǐ' },
      { english: 'English', traditional: '英文', simplified: '英文', zhuyin: 'ㄧㄥ ㄨㄣˊ', pinyin: 'Yīngwén' },
      { english: 'Can / able to / know how to', traditional: '會', simplified: '会', zhuyin: 'ㄏㄨㄟˋ', pinyin: 'huì' },
      { english: 'Speak, to', traditional: '說', simplified: '说', zhuyin: 'ㄕㄨㄛ', pinyin: 'shuō' },
      { english: 'You', traditional: '你', simplified: '你', zhuyin: 'ㄋㄧˇ', pinyin: 'nǐ' },
      { english: 'No / not', traditional: '不', simplified: '不', zhuyin: 'ㄅㄨˋ', pinyin: 'bù' },
      { english: 'Question particle', traditional: '嗎', simplified: '吗', zhuyin: 'ㄇㄚ˙', pinyin: 'ma' },
      { english: 'May I ask', traditional: '請問', simplified: '请问', zhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ', pinyin: 'qǐngwèn' },
      { english: 'I / me', traditional: '我', simplified: '我', zhuyin: 'ㄨㄛˇ', pinyin: 'wǒ' },
      { english: 'Common Mandarin / Common language', traditional: '普通話', simplified: '普通话', zhuyin: 'ㄆㄨˇ ㄊㄨㄥ ㄏㄨㄚˋ', pinyin: 'pǔtōnghuà' },
      { english: 'A little / some', traditional: '一點兒', simplified: '一点儿', zhuyin: 'ㄧˋ ㄉㄧㄢˇ ㄦ', pinyin: 'yìdiǎnr' },
      { english: 'America', traditional: '美國', simplified: '美国', zhuyin: 'ㄇㄟˇ ㄍㄨㄛˊ', pinyin: 'Měiguó' },
      { english: 'People / person', traditional: '人', simplified: '人', zhuyin: 'ㄖㄣˊ', pinyin: 'rén' },
      { english: '(To be) am / is / are', traditional: '是', simplified: '是', zhuyin: 'ㄕˋ', pinyin: 'shì' },
    ],
    dialogues: [
      {
        english: 'Excuse me. Please let me ask, can you speak English?',
        traditional: '對不起。請問，你會說英文嗎？',
        simplified: '对不起。请问，你会说英文吗？',
        zhuyin: 'ㄉㄨㄟˋ ㄅㄨˋ ㄑㄧˇ ㄑㄧㄥˇ ㄨㄣˋ ㄋㄧˇ ㄏㄨㄟˋ ㄕㄨㄛ ㄧㄥ ㄨㄣˊ ㄇㄚ˙',
        pinyin: 'Duìbuqǐ. Qǐngwèn, nǐ huì shuō Yīngwén ma?',
      },
      {
        english: "No. I can't speak English.",
        traditional: '不會。我不會說英文。',
        simplified: '不会。我不会说英文。',
        zhuyin: 'ㄅㄨˋ ㄏㄨㄟˋ ㄨㄛˇ ㄅㄨˋ ㄏㄨㄟˋ ㄕㄨㄛ ㄧㄥ ㄨㄣˊ',
        pinyin: 'Bú huì. Wǒ bú huì shuō Yīngwén.',
      },
      {
        english: 'I can speak a little Mandarin.',
        traditional: '我會說一點兒普通話。',
        simplified: '我会说一点儿普通话。',
        zhuyin: 'ㄨㄛˇ ㄏㄨㄟˋ ㄕㄨㄛ ㄧˋ ㄉㄧㄢˇ ㄦ ㄆㄨˇ ㄊㄨㄥ ㄏㄨㄚˋ',
        pinyin: 'Wǒ huì shuō yìdiǎnr pǔtōnghuà.',
      },
      {
        english: 'Are you American?',
        traditional: '你是美國人嗎？',
        simplified: '你是美国人吗？',
        zhuyin: 'ㄋㄧˇ ㄕˋ ㄇㄟˇ ㄍㄨㄛˊ ㄖㄣˊ ㄇㄚ˙',
        pinyin: 'Nǐ shì Měiguó rén ma?',
      },
      {
        english: 'Yes. I am American.',
        traditional: '是。我是美國人。',
        simplified: '是。我是美国人。',
        zhuyin: 'ㄕˋ ㄨㄛˇ ㄕˋ ㄇㄟˇ ㄍㄨㄛˊ ㄖㄣˊ',
        pinyin: 'Shì. Wǒ shì Měiguó rén.',
      },
    ],
  },
  {
    unit: 2,
    title: 'Unit 2: Greetings, Thanks & Goodbye',
    subtitle: '你好嗎, 謝謝, 很, 的, and 再見',
    vocab: [
      { english: 'Good / well', traditional: '好', simplified: '好', zhuyin: 'ㄏㄠˇ', pinyin: 'hǎo' },
      { english: '(de) - used to describe action / possession', traditional: '的', simplified: '的', zhuyin: 'ㄉㄜ˙', pinyin: 'de' },
      { english: 'Hello', traditional: '你好', simplified: '你好', zhuyin: 'ㄋㄧˇ ㄏㄠˇ', pinyin: 'nǐ hǎo' },
      { english: 'How are you?', traditional: '你好嗎？', simplified: '你好吗？', zhuyin: 'ㄋㄧˇ ㄏㄠˇ ㄇㄚ˙', pinyin: 'Nǐ hǎo ma?' },
      { english: 'Thanks', traditional: '謝謝', simplified: '谢谢', zhuyin: 'ㄒㄧㄝˋ ㄒㄧㄝ˙', pinyin: 'xièxie' },
      { english: 'Very', traditional: '很', simplified: '很', zhuyin: 'ㄏㄣˇ', pinyin: 'hěn' },
      { english: 'Goodbye', traditional: '再見', simplified: '再见', zhuyin: 'ㄗㄞˋ ㄐㄧㄢˋ', pinyin: 'zàijiàn' },
    ],
    dialogues: [
      {
        english: 'Excuse me. Can you speak Mandarin?',
        traditional: '對不起。請問，你會說普通話嗎？',
        simplified: '对不起。请问，你会说普通话吗？',
        zhuyin: 'ㄉㄨㄟˋ ㄅㄨˋ ㄑㄧˇ ㄑㄧㄥˇ ㄨㄣˋ ㄋㄧˇ ㄏㄨㄟˋ ㄕㄨㄛ ㄆㄨˇ ㄊㄨㄥ ㄏㄨㄚˋ ㄇㄚ˙',
        pinyin: 'Duìbuqǐ. Qǐngwèn, nǐ huì shuō pǔtōnghuà ma?',
      },
      {
        english: 'I can speak a little.',
        traditional: '我會說一點兒。',
        simplified: '我会说一点儿。',
        zhuyin: 'ㄨㄛˇ ㄏㄨㄟˋ ㄕㄨㄛ ㄧˋ ㄉㄧㄢˇ ㄦ',
        pinyin: 'Wǒ huì shuō yìdiǎnr.',
      },
      {
        english: 'Are you American?',
        traditional: '你是美國人嗎？',
        simplified: '你是美国人吗？',
        zhuyin: 'ㄋㄧˇ ㄕˋ ㄇㄟˇ ㄍㄨㄛˊ ㄖㄣˊ ㄇㄚ˙',
        pinyin: 'Nǐ shì Měiguó rén ma?',
      },
      {
        english: 'Yes. Can you speak English?',
        traditional: '是。你會說英文嗎？',
        simplified: '是。你会说英文吗？',
        zhuyin: 'ㄕˋ ㄋㄧˇ ㄏㄨㄟˋ ㄕㄨㄛ ㄧㄥ ㄨㄣˊ ㄇㄚ˙',
        pinyin: 'Shì. Nǐ huì shuō Yīngwén ma?',
      },
      {
        english: "No. I can't speak English.",
        traditional: '不會。我不會說英文。',
        simplified: '不会。我不会说英文。',
        zhuyin: 'ㄅㄨˋ ㄏㄨㄟˋ ㄨㄛˇ ㄅㄨˋ ㄏㄨㄟˋ ㄕㄨㄛ ㄧㄥ ㄨㄣˊ',
        pinyin: 'Bú huì. Wǒ bú huì shuō Yīngwén.',
      },
    ],
  },
  {
    unit: 3,
    title: 'Unit 3: Speaking Well & Contrastive Questions',
    subtitle: '可是 (but), 中國 (China), 呢 (and you?), and 說得很好',
    vocab: [
      { english: 'But', traditional: '可是', simplified: '可是', zhuyin: 'ㄎㄜˇ ㄕˋ', pinyin: 'kěshì' },
      { english: 'China', traditional: '中國', simplified: '中国', zhuyin: 'ㄓㄨㄥ ㄍㄨㄛˊ', pinyin: 'Zhōngguó' },
      { english: '(ne) - how about...', traditional: '呢', simplified: '呢', zhuyin: 'ㄋㄜ˙', pinyin: 'ne' },
    ],
    dialogues: [
      {
        english: 'Hello.',
        traditional: '你好。',
        simplified: '你好。',
        zhuyin: 'ㄋㄧˇ ㄏㄠˇ',
        pinyin: 'Nǐ hǎo.',
      },
      {
        english: 'Can you speak Mandarin?',
        traditional: '你會說普通話嗎？',
        simplified: '你会说普通话吗？',
        zhuyin: 'ㄋㄧˇ ㄏㄨㄟˋ ㄕㄨㄛ ㄆㄨˇ ㄊㄨㄥ ㄏㄨㄚˋ ㄇㄚ˙',
        pinyin: 'Nǐ huì shuō pǔtōnghuà ma?',
      },
      {
        english: "I can speak a little. I don't speak it well.",
        traditional: '我會說一點兒。我說得不好。',
        simplified: '我会说一点儿。我说得不好。',
        zhuyin: 'ㄨㄛˇ ㄏㄨㄟˋ ㄕㄨㄛ ㄧˋ ㄉㄧㄢˇ ㄦ ㄨㄛˇ ㄕㄨㄛ ㄉㄜ˙ ㄅㄨˋ ㄏㄠˇ',
        pinyin: 'Wǒ huì shuō yìdiǎnr. Wǒ shuō de bù hǎo.',
      },
      {
        english: 'Are you American?',
        traditional: '你是美國人嗎？',
        simplified: '你是美国人吗？',
        zhuyin: 'ㄋㄧˇ ㄕˋ ㄇㄟˇ ㄍㄨㄛˊ ㄖㄣˊ ㄇㄚ˙',
        pinyin: 'Nǐ shì Měiguó rén ma?',
      },
      {
        english: 'Yes. But you speak Mandarin very well.',
        traditional: '是。可是你普通話說得很好。',
        simplified: '是。可是你普通话说得很好。',
        zhuyin: 'ㄕˋ ㄎㄜˇ ㄕˋ ㄋㄧˇ ㄆㄨˇ ㄊㄨㄥ ㄏㄨㄚˋ ㄕㄨㄛ ㄉㄜ˙ ㄏㄣˇ ㄏㄠˇ',
        pinyin: 'Shì. Kěshì nǐ pǔtōnghuà shuō de hěn hǎo.',
      },
    ],
  },
  {
    unit: 4,
    title: 'Unit 4: Understanding & Asking Locations',
    subtitle: '明白, 什麼, 學院路, 長安街, 在哪兒, 這兒 / 那兒',
    vocab: [
      { english: 'Understand (the situation)', traditional: '明白', simplified: '明白', zhuyin: 'ㄇㄧㄥˊ ㄅㄞˊ', pinyin: 'míngbai' },
      { english: 'What', traditional: '什麼', simplified: '什么', zhuyin: 'ㄕㄜˊ ㄇㄜ˙', pinyin: 'shénme' },
      { english: 'College', traditional: '學院', simplified: '学院', zhuyin: 'ㄒㄩㄝˊ ㄩㄢˋ', pinyin: 'xuéyuàn' },
      { english: 'Road', traditional: '路', simplified: '路', zhuyin: 'ㄌㄨˋ', pinyin: 'lù' },
      { english: 'Where', traditional: '哪兒', simplified: '哪儿', zhuyin: 'ㄋㄚˇ ㄦ', pinyin: 'nǎr' },
      { english: 'Located / at / in', traditional: '在', simplified: '在', zhuyin: 'ㄗㄞˋ', pinyin: 'zài' },
      { english: 'Street', traditional: '街', simplified: '街', zhuyin: 'ㄐㄧㄝ', pinyin: 'jiē' },
      { english: 'Long Peace Street', traditional: '長安街', simplified: '长安街', zhuyin: 'ㄔㄤˊ ㄢ ㄐㄧㄝ', pinyin: "Cháng'ān Jiē" },
      { english: 'Here', traditional: '這兒', simplified: '这儿', zhuyin: 'ㄓㄜˋ ㄦ', pinyin: 'zhèr' },
      { english: 'There', traditional: '那兒', simplified: '那儿', zhuyin: 'ㄋㄚˋ ㄦ', pinyin: 'nàr' },
    ],
    dialogues: [
      {
        english: 'Excuse me. Please let me ask, are you Chinese?',
        traditional: '對不起。請問，你是中國人嗎？',
        simplified: '对不起。请问，你是中国人吗？',
        zhuyin: 'ㄉㄨㄟˋ ㄅㄨˋ ㄑㄧˇ ㄑㄧㄥˇ ㄨㄣˋ ㄋㄧˇ ㄕˋ ㄓㄨㄥ ㄍㄨㄛˊ ㄖㄣˊ ㄇㄚ˙',
        pinyin: 'Duìbuqǐ. Qǐngwèn, nǐ shì Zhōngguó rén ma?',
      },
      {
        english: 'Yes. I am Chinese. And you?',
        traditional: '是。我是中國人。你呢？',
        simplified: '是。我是中国人。你呢？',
        zhuyin: 'ㄕˋ ㄨㄛˇ ㄕˋ ㄓㄨㄥ ㄍㄨㄛˊ ㄖㄣˊ ㄋㄧˇ ㄋㄜ˙',
        pinyin: 'Shì. Wǒ shì Zhōngguó rén. Nǐ ne?',
      },
      {
        english: 'I am American.',
        traditional: '我是美國人。',
        simplified: '我是美国人。',
        zhuyin: 'ㄨㄛˇ ㄕˋ ㄇㄟˇ ㄍㄨㄛˊ ㄖㄣˊ',
        pinyin: 'Wǒ shì Měiguó rén.',
      },
      {
        english: 'But you speak Mandarin.',
        traditional: '可是你會說普通話。',
        simplified: '可是你会说普通话。',
        zhuyin: 'ㄎㄜˇ ㄕˋ ㄋㄧˇ ㄏㄨㄟˋ ㄕㄨㄛ ㄆㄨˇ ㄊㄨㄥ ㄏㄨㄚˋ',
        pinyin: 'Kěshì nǐ huì shuō pǔtōnghuà.',
      },
      {
        english: "I can speak a little. I don't speak well.",
        traditional: '我會說一點兒。我說得不好。',
        simplified: '我会说一点儿。我说得不好。',
        zhuyin: 'ㄨㄛˇ ㄏㄨㄟˋ ㄕㄨㄛ ㄧˋ ㄉㄧㄢˇ ㄦ ㄨㄛˇ ㄕㄨㄛ ㄉㄜ˙ ㄅㄨˋ ㄏㄠˇ',
        pinyin: 'Wǒ huì shuō yìdiǎnr. Wǒ shuō de bù hǎo.',
      },
      {
        english: 'You speak Mandarin very well.',
        traditional: '你普通話說得很好。',
        simplified: '你普通话说得很好。',
        zhuyin: 'ㄋㄧˇ ㄆㄨˇ ㄊㄨㄥ ㄏㄨㄚˋ ㄕㄨㄛ ㄉㄜ˙ ㄏㄣˇ ㄏㄠˇ',
        pinyin: 'Nǐ pǔtōnghuà shuō de hěn hǎo.',
      },
      {
        english: 'Thank you.',
        traditional: '謝謝你。',
        simplified: '谢谢你。',
        zhuyin: 'ㄒㄧㄝˋ ㄒㄧㄝ˙ ㄋㄧˇ',
        pinyin: 'Xièxie nǐ.',
      },
    ],
  },
  {
    unit: 5,
    title: 'Unit 5: Street Directions & Eating / Drinking',
    subtitle: '知道, 想, 吃, 喝, 一點兒東西',
    vocab: [
      { english: 'Know, to', traditional: '知道', simplified: '知道', zhuyin: 'ㄓ ㄉㄠˋ', pinyin: 'zhīdao' },
      { english: 'Would like / miss, to', traditional: '想', simplified: '想', zhuyin: 'ㄒㄧㄤˇ', pinyin: 'xiǎng' },
      { english: 'Eat, to', traditional: '吃', simplified: '吃', zhuyin: 'ㄔ', pinyin: 'chī' },
      { english: 'Something / a little thing', traditional: '一點兒東西', simplified: '一点儿东西', zhuyin: 'ㄧˋ ㄉㄧㄢˇ ㄦ ㄉㄨㄥ ㄒㄧ', pinyin: 'yìdiǎnr dōngxi' },
      { english: 'Thing / anything', traditional: '東西', simplified: '东西', zhuyin: 'ㄉㄨㄥ ㄒㄧ', pinyin: 'dōngxi' },
      { english: 'Drink, to', traditional: '喝', simplified: '喝', zhuyin: 'ㄏㄜ', pinyin: 'hē' },
    ],
    dialogues: [
      {
        english: 'Excuse me. Please let me ask, where is College Road?',
        traditional: '對不起。請問，學院路在哪兒？',
        simplified: '对不起。请问，学院路在哪儿？',
        zhuyin: 'ㄉㄨㄟˋ ㄅㄨˋ ㄑㄧˇ ㄑㄧㄥˇ ㄨㄣˋ ㄒㄩㄝˊ ㄩㄢˋ ㄌㄨˋ ㄗㄞˋ ㄋㄚˇ ㄦ',
        pinyin: 'Duìbuqǐ. Qǐngwèn, xuéyuàn lù zài nǎr?',
      },
      {
        english: 'Over there.',
        traditional: '在那兒。',
        simplified: '在那儿。',
        zhuyin: 'ㄗㄞˋ ㄋㄚˋ ㄦ',
        pinyin: 'Zài nàr.',
      },
      {
        english: 'Where is Long Peace Street? Is it over here?',
        traditional: '長安街呢？在這兒嗎？',
        simplified: '长安街呢？在这儿吗？',
        zhuyin: 'ㄔㄤˊ ㄢ ㄐㄧㄝ ㄋㄜ˙ ㄗㄞˋ ㄓㄜˋ ㄦ ㄇㄚ˙',
        pinyin: "Cháng'ān jiē ne? Zài zhèr ma?",
      },
      {
        english: "Yes. It's over here.",
        traditional: '是。是在這兒。',
        simplified: '是。是在这儿。',
        zhuyin: 'ㄕˋ ㄕˋ ㄗㄞˋ ㄓㄜˋ ㄦ',
        pinyin: 'Shì. Shì zài zhèr.',
      },
      {
        english: 'Can you speak English?',
        traditional: '你會說英文嗎？',
        simplified: '你会说英文吗？',
        zhuyin: 'ㄋㄧˇ ㄏㄨㄟˋ ㄕㄨㄛ ㄧㄥ ㄨㄣˊ ㄇㄚ˙',
        pinyin: 'Nǐ huì shuō Yīngwén ma?',
      },
      {
        english: "No. I can't speak English. Goodbye.",
        traditional: '不會。我不會說英文。再見。',
        simplified: '不会。我不会说英文。再见。',
        zhuyin: 'ㄅㄨˋ ㄏㄨㄟˋ ㄨㄛˇ ㄅㄨˋ ㄏㄨㄟˋ ㄕㄨㄛ ㄧㄥ ㄨㄣˊ ㄗㄞˋ ㄐㄧㄢˋ',
        pinyin: 'Bú huì. Wǒ bú huì shuō Yīngwén. Zàijiàn.',
      },
    ],
  },
  {
    unit: 6,
    title: 'Unit 6: Buying Things & Going Places',
    subtitle: '也, 去, 我那兒, 什麼時候, 現在, 過一會兒',
    vocab: [
      { english: 'Also / too', traditional: '也', simplified: '也', zhuyin: 'ㄧㄝˇ', pinyin: 'yě' },
      { english: 'To go', traditional: '去', simplified: '去', zhuyin: 'ㄑㄩˋ', pinyin: 'qù' },
      { english: 'My place / over there (at my place)', traditional: '我那兒', simplified: '我那儿', zhuyin: 'ㄨㄛˇ ㄋㄚˋ ㄦ', pinyin: 'wǒ nàr' },
      { english: 'When?', traditional: '什麼時候', simplified: '什么时候', zhuyin: 'ㄕㄜˊ ㄇㄜ˙ ㄕˊ ㄏㄡˋ', pinyin: 'shénme shíhou' },
      { english: 'Now', traditional: '現在', simplified: '现在', zhuyin: 'ㄒㄧㄢˋ ㄗㄞˋ', pinyin: 'xiànzài' },
      { english: 'Later / a little later', traditional: '過一會兒', simplified: '过一会儿', zhuyin: 'ㄍㄨㄛˋ ㄧˋ ㄏㄨㄟˇ ㄦ', pinyin: 'guò yìhuǐr' },
    ],
    dialogues: [
      {
        english: 'Hello. I would like to buy something. How about you?',
        traditional: '你好。我想買一點兒東西。你呢？',
        simplified: '你好。我想买一点儿东西。你呢？',
        zhuyin: 'ㄋㄧˇ ㄏㄠˇ ㄨㄛˇ ㄒㄧㄤˇ ㄇㄞˇ ㄧˋ ㄉㄧㄢˇ ㄦ ㄉㄨㄥ ㄒㄧ ㄋㄧˇ ㄋㄜ˙',
        pinyin: 'Nǐ hǎo. Wǒ xiǎng mǎi yìdiǎnr dōngxi. Nǐ ne?',
      },
      {
        english: 'I also want to buy a little something.',
        traditional: '我也想買一點兒東西。',
        simplified: '我也想买一点儿东西。',
        zhuyin: 'ㄨㄛˇ ㄧㄝˇ ㄒㄧㄤˇ ㄇㄞˇ ㄧˋ ㄉㄧㄢˇ ㄦ ㄉㄨㄥ ㄒㄧ',
        pinyin: 'Wǒ yě xiǎng mǎi yìdiǎnr dōngxi.',
      },
      {
        english: 'Would you like to drink something?',
        traditional: '你想喝一點兒東西嗎？',
        simplified: '你想喝一点儿东西吗？',
        zhuyin: 'ㄋㄧˇ ㄒㄧㄤˇ ㄏㄜ ㄧˋ ㄉㄧㄢˇ ㄦ ㄉㄨㄥ ㄒㄧ ㄇㄚ˙',
        pinyin: 'Nǐ xiǎng hē yìdiǎnr dōngxi ma?',
      },
      {
        english: 'Yes. I would like to drink something.',
        traditional: '想，我想喝一點兒東西。',
        simplified: '想，我想喝一点儿东西。',
        zhuyin: 'ㄒㄧㄤˇ ㄨㄛˇ ㄒㄧㄤˇ ㄏㄜ ㄧˋ ㄉㄧㄢˇ ㄦ ㄉㄨㄥ ㄒㄧ',
        pinyin: 'Xiǎng, wǒ xiǎng hē yìdiǎnr dōngxi.',
      },
      {
        english: 'Where would you like to go to drink?',
        traditional: '你想去哪兒喝？',
        simplified: '你想去哪儿喝？',
        zhuyin: 'ㄋㄧˇ ㄒㄧㄤˇ ㄑㄩˋ ㄋㄚˇ ㄦ ㄏㄜ',
        pinyin: 'Nǐ xiǎng qù nǎr hē?',
      },
      {
        english: 'Go to Long Peace Street.',
        traditional: '去長安街。',
        simplified: '去长安街。',
        zhuyin: 'ㄑㄩˋ ㄔㄤˊ ㄢ ㄐㄧㄝ',
        pinyin: "Qù Cháng'ān Jiē.",
      },
    ],
  },
  {
    unit: 7,
    title: 'Unit 7: Cafes, Tea, Beer & Restaurants',
    subtitle: '咖啡廳, 茶, 啤酒, 飯店, and deciding when/where to eat',
    vocab: [
      { english: 'When?', traditional: '什麼時候', simplified: '什么时候', zhuyin: 'ㄕㄜˊ ㄇㄜ˙ ㄕˊ ㄏㄡˋ', pinyin: 'shénme shíhou' },
      { english: 'Now', traditional: '現在', simplified: '现在', zhuyin: 'ㄒㄧㄢˋ ㄗㄞˋ', pinyin: 'xiànzài' },
      { english: 'Later / a little later', traditional: '過一會兒', simplified: '过一会儿', zhuyin: 'ㄍㄨㄛˋ ㄧˋ ㄏㄨㄟˇ ㄦ', pinyin: 'guò yìhuǐr' },
      { english: 'Cafe', traditional: '咖啡廳', simplified: '咖啡厅', zhuyin: 'ㄎㄚ ㄈㄟ ㄊㄧㄥ', pinyin: 'kāfēitīng' },
      { english: 'Tea', traditional: '茶', simplified: '茶', zhuyin: 'ㄔㄚˊ', pinyin: 'chá' },
      { english: 'Beer', traditional: '啤酒', simplified: '啤酒', zhuyin: 'ㄆㄧˊ ㄐㄧㄡˇ', pinyin: 'píjiǔ' },
      { english: 'Restaurant', traditional: '飯店', simplified: '饭店', zhuyin: 'ㄈㄢˋ ㄉㄧㄢˋ', pinyin: 'fàndiàn' },
    ],
    dialogues: [
      {
        english: 'When would you like to eat? Now?',
        traditional: '你想什麼時候吃？現在嗎？',
        simplified: '你想什么时候吃？现在吗？',
        zhuyin: 'ㄋㄧˇ ㄒㄧㄤˇ ㄕㄜˊ ㄇㄜ˙ ㄕˊ ㄏㄡˋ ㄔ ㄒㄧㄢˋ ㄗㄞˋ ㄇㄚ˙',
        pinyin: 'Nǐ xiǎng shénme shíhou chī? Xiànzài ma?',
      },
      {
        english: 'I would like to eat a little later, but I would like to drink something now.',
        traditional: '我想過一會兒吃，可是我想現在喝一點兒東西。',
        simplified: '我想过一会儿吃，可是我想现在喝一点儿东西。',
        zhuyin: 'ㄨㄛˇ ㄒㄧㄤˇ ㄍㄨㄛˋ ㄧˋ ㄏㄨㄟˇ ㄦ ㄔ ㄎㄜˇ ㄕˋ ㄨㄛˇ ㄒㄧㄤˇ ㄒㄧㄢˋ ㄗㄞˋ ㄏㄜ ㄧˋ ㄉㄧㄢˇ ㄦ ㄉㄨㄥ ㄒㄧ',
        pinyin: 'Wǒ xiǎng guò yìhuǐr chī, kěshì wǒ xiǎng xiànzài hē yìdiǎnr dōngxi.',
      },
      {
        english: "Where would you like to go to drink? I don't know.",
        traditional: '你想去哪兒喝？我不知道。',
        simplified: '你想去哪儿喝？我不知道。',
        zhuyin: 'ㄋㄧˇ ㄒㄧㄤˇ ㄑㄩˋ ㄋㄚˇ ㄦ ㄏㄜ ㄨㄛˇ ㄅㄨˋ ㄓ ㄉㄠˋ',
        pinyin: 'Nǐ xiǎng qù nǎr hē? Wǒ bù zhīdao.',
      },
      {
        english: 'Would you like to go to my place to drink?',
        traditional: '你想去我那兒喝嗎？',
        simplified: '你想去我那儿喝吗？',
        zhuyin: 'ㄋㄧˇ ㄒㄧㄤˇ ㄑㄩˋ ㄨㄛˇ ㄋㄚˋ ㄦ ㄏㄜ ㄇㄚ˙',
        pinyin: 'Nǐ xiǎng qù wǒ nàr hē ma?',
      },
      {
        english: 'I would like to go to the cafe to drink.',
        traditional: '我想去咖啡廳喝。',
        simplified: '我想去咖啡厅喝。',
        zhuyin: 'ㄨㄛˇ ㄒㄧㄤˇ ㄑㄩˋ ㄎㄚ ㄈㄟ ㄊㄧㄥ ㄏㄜ',
        pinyin: 'Wǒ xiǎng qù kāfēitīng hē.',
      },
    ],
  },
  {
    unit: 8,
    title: 'Unit 8: Ordering Drinks & Measure Word 杯',
    subtitle: '午飯, 還是, 跟, 誰, 一起, 要, 兩杯啤酒',
    vocab: [
      { english: 'Lunch / midday meal', traditional: '午飯', simplified: '午饭', zhuyin: 'ㄨˇ ㄈㄢˋ', pinyin: 'wǔfàn' },
      { english: 'Or', traditional: '還是', simplified: '还是', zhuyin: 'ㄏㄞˊ ㄕˋ', pinyin: 'háishi' },
      { english: 'With / along with', traditional: '跟', simplified: '跟', zhuyin: 'ㄍㄣ', pinyin: 'gēn' },
      { english: 'Whom? / Who?', traditional: '誰', simplified: '谁', zhuyin: 'ㄕㄟˊ', pinyin: 'shéi' },
      { english: 'Together', traditional: '一起', simplified: '一起', zhuyin: 'ㄧˋ ㄑㄧˇ', pinyin: 'yìqǐ' },
      { english: 'Want / to wish for / to need', traditional: '要', simplified: '要', zhuyin: 'ㄧㄠˋ', pinyin: 'yào' },
      { english: 'Two (with measure word)', traditional: '兩', simplified: '两', zhuyin: 'ㄌㄧㄤˇ', pinyin: 'liǎng' },
      { english: 'Cup / glass (measure word)', traditional: '杯', simplified: '杯', zhuyin: 'ㄅㄟ', pinyin: 'bēi' },
    ],
    dialogues: [
      {
        english: 'Ms. Wang, would you like to eat something now?',
        traditional: '王小姐，你想現在吃一點兒東西嗎？',
        simplified: '王小姐，你想现在吃一点儿东西吗？',
        zhuyin: 'ㄨㄤˊ ㄒㄧㄠˇ ㄐㄧㄝˇ ㄋㄧˇ ㄒㄧㄤˇ ㄒㄧㄢˋ ㄗㄞˋ ㄔ ㄧˋ ㄉㄧㄢˇ ㄦ ㄉㄨㄥ ㄒㄧ ㄇㄚ˙',
        pinyin: 'Wáng xiǎojiě, nǐ xiǎng xiànzài chī yìdiǎnr dōngxi ma?',
      },
      {
        english: "Thank you, Mr. Lee. I don't want to eat now, but I would like to drink something.",
        traditional: '謝謝你，李先生。我不想現在吃，可是我想喝一點兒東西。',
        simplified: '谢谢你，李先生。我不想现在吃，可是我想喝一点儿东西。',
        zhuyin: 'ㄒㄧㄝˋ ㄒㄧㄝ˙ ㄋㄧˇ ㄌㄧˇ ㄒㄧㄢ ㄕㄥ ㄨㄛˇ ㄅㄨˋ ㄒㄧㄤˇ ㄒㄧㄢˋ ㄗㄞˋ ㄔ ㄎㄜˇ ㄕˋ ㄨㄛˇ ㄒㄧㄤˇ ㄏㄜ ㄧˋ ㄉㄧㄢˇ ㄦ ㄉㄨㄥ ㄒㄧ',
        pinyin: 'Xièxie nǐ, Lǐ xiānshēng. Wǒ bù xiǎng xiànzài chī, kěshì wǒ xiǎng hē yìdiǎnr dōngxi.',
      },
      {
        english: 'Okay. What would you like to drink?',
        traditional: '好。你想喝什麼？',
        simplified: '好。你想喝什么？',
        zhuyin: 'ㄏㄠˇ ㄋㄧˇ ㄒㄧㄤˇ ㄏㄜ ㄕㄜˊ ㄇㄜ˙',
        pinyin: 'Hǎo. Nǐ xiǎng hē shénme?',
      },
      {
        english: 'A little tea, no, a little beer.',
        traditional: '一點茶，不，一點啤酒。',
        simplified: '一点茶，不，一点啤酒。',
        zhuyin: 'ㄧˋ ㄉㄧㄢˇ ㄔㄚˊ ㄅㄨˋ ㄧˋ ㄉㄧㄢˇ ㄆㄧˊ ㄐㄧㄡˇ',
        pinyin: 'Yìdiǎn chá, bù, yìdiǎn píjiǔ.',
      },
      {
        english: 'I also would like to drink something. Miss, I would like two beers.',
        traditional: '我也想喝一點兒東西。小姐，我想要兩杯啤酒。',
        simplified: '我也想喝一点儿东西。小姐，我想要两杯啤酒。',
        zhuyin: 'ㄨㄛˇ ㄧㄝˇ ㄒㄧㄤˇ ㄏㄜ ㄧˋ ㄉㄧㄢˇ ㄦ ㄉㄨㄥ ㄒㄧ ㄒㄧㄠˇ ㄐㄧㄝˇ ㄨㄛˇ ㄒㄧㄤˇ ㄧㄠˋ ㄌㄧㄤˇ ㄅㄟ ㄆㄧˊ ㄐㄧㄡˇ',
        pinyin: 'Wǒ yě xiǎng hē yìdiǎnr dōngxi. Xiǎojiě, wǒ xiǎng yào liǎng bēi píjiǔ.',
      },
    ],
  },
  {
    unit: 9,
    title: 'Unit 9: Inviting Someone to Lunch',
    subtitle: '做什麼, 吃午飯, 跟我一起吃, 北京飯店',
    vocab: [
      { english: 'Lunch / midday meal', traditional: '午飯', simplified: '午饭', zhuyin: 'ㄨˇ ㄈㄢˋ', pinyin: 'wǔfàn' },
      { english: 'Or', traditional: '還是', simplified: '还是', zhuyin: 'ㄏㄞˊ ㄕˋ', pinyin: 'háishi' },
      { english: 'With / along with', traditional: '跟', simplified: '跟', zhuyin: 'ㄍㄣ', pinyin: 'gēn' },
      { english: 'Whom? / Who?', traditional: '誰', simplified: '谁', zhuyin: 'ㄕㄟˊ', pinyin: 'shéi' },
      { english: 'Together', traditional: '一起', simplified: '一起', zhuyin: 'ㄧˋ ㄑㄧˇ', pinyin: 'yìqǐ' },
      { english: 'Want / to wish for / to need', traditional: '要', simplified: '要', zhuyin: 'ㄧㄠˋ', pinyin: 'yào' },
      { english: 'Two (measure word / items)', traditional: '兩', simplified: '两', zhuyin: 'ㄌㄧㄤˇ', pinyin: 'liǎng' },
      { english: 'Cup / glass (measure word)', traditional: '杯', simplified: '杯', zhuyin: 'ㄅㄟ', pinyin: 'bēi' },
    ],
    dialogues: [
      {
        english: 'Ms. Wang, hello.',
        traditional: '王小姐，你好。',
        simplified: '王小姐，你好。',
        zhuyin: 'ㄨㄤˊ ㄒㄧㄠˇ ㄐㄧㄝˇ ㄋㄧˇ ㄏㄠˇ',
        pinyin: 'Wáng xiǎojiě, nǐ hǎo.',
      },
      {
        english: 'Ms. Wang, what would you like to do now?',
        traditional: '王小姐，你想現在做什麼？',
        simplified: '王小姐，你想现在做什么？',
        zhuyin: 'ㄨㄤˊ ㄒㄧㄠˇ ㄐㄧㄝˇ ㄋㄧˇ ㄒㄧㄤˇ ㄒㄧㄢˋ ㄗㄞˋ ㄗㄨㄛˋ ㄕㄜˊ ㄇㄜ˙',
        pinyin: 'Wáng xiǎojiě, nǐ xiǎng xiànzài zuò shénme?',
      },
      {
        english: "I don't know. How about you?",
        traditional: '我不知道。你呢？',
        simplified: '我不知道。你呢？',
        zhuyin: 'ㄨㄛˇ ㄅㄨˋ ㄓ ㄉㄠˋ ㄋㄧˇ ㄋㄜ˙',
        pinyin: 'Wǒ bù zhīdao. Nǐ ne?',
      },
      {
        english: 'I would like to eat lunch now. Would you like to eat with me?',
        traditional: '我想現在吃午飯。你想跟我一起吃嗎？',
        simplified: '我想现在吃午饭。你想跟我一起吃吗？',
        zhuyin: 'ㄨㄛˇ ㄒㄧㄤˇ ㄒㄧㄢˋ ㄗㄞˋ ㄔ ㄨˇ ㄈㄢˋ ㄋㄧˇ ㄒㄧㄤˇ ㄍㄣ ㄨㄛˇ ㄧˋ ㄑㄧˇ ㄔ ㄇㄚ˙',
        pinyin: 'Wǒ xiǎng xiànzài chī wǔfàn. Nǐ xiǎng gēn wǒ yìqǐ chī ma?',
      },
      {
        english: 'Yes, but I would like to go to the Beijing Restaurant to eat. Okay?',
        traditional: '想，可是我想去北京飯店吃，好嗎？',
        simplified: '想，可是我想去北京饭店吃，好吗？',
        zhuyin: 'ㄒㄧㄤˇ ㄎㄜˇ ㄕˋ ㄨㄛˇ ㄒㄧㄤˇ ㄑㄩˋ ㄅㄟˇ ㄐㄧㄥ ㄈㄢˋ ㄉㄧㄢˋ ㄔ ㄏㄠˇ ㄇㄚ˙',
        pinyin: 'Xiǎng, kěshì wǒ xiǎng qù Běijīng fàndiàn chī, hǎo ma?',
      },
      {
        english: 'Okay. I also would like to go to the Beijing Restaurant to eat.',
        traditional: '好。我也想去北京飯店吃。',
        simplified: '好。我也想去北京饭店吃。',
        zhuyin: 'ㄏㄠˇ ㄨㄛˇ ㄧㄝˇ ㄒㄧㄤˇ ㄑㄩˋ ㄅㄟˇ ㄐㄧㄥ ㄈㄢˋ ㄉㄧㄢˋ ㄔ',
        pinyin: 'Hǎo. Wǒ yě xiǎng qù Běijīng fàndiàn chī.',
      },
    ],
  },
  {
    unit: 10,
    title: "Unit 10: Numbers 7–10 & O'Clock (點鐘)",
    subtitle: '七, 八, 九, 十, 點鐘, and scheduling a time',
    vocab: [
      { english: 'Seven', traditional: '七', simplified: '七', zhuyin: 'ㄑㄧ', pinyin: 'qī' },
      { english: 'Eight', traditional: '八', simplified: '八', zhuyin: 'ㄅㄚ', pinyin: 'bā' },
      { english: 'Nine', traditional: '九', simplified: '九', zhuyin: 'ㄐㄧㄡˇ', pinyin: 'jiǔ' },
      { english: 'Ten', traditional: '十', simplified: '十', zhuyin: 'ㄕˊ', pinyin: 'shí' },
      { english: "O'clock / point", traditional: '點鐘', simplified: '点钟', zhuyin: 'ㄉㄧㄢˇ ㄓㄨㄥ', pinyin: 'diǎnzhōng' },
    ],
    dialogues: [
      {
        english: 'Mr. Lee, I would like to eat a little something with you, okay?',
        traditional: '李先生，我想跟你一起吃一點兒東西，好嗎？',
        simplified: '李先生，我想跟你一起吃一点儿东西，好吗？',
        zhuyin: 'ㄌㄧˇ ㄒㄧㄢ ㄕㄥ ㄨㄛˇ ㄒㄧㄤˇ ㄍㄣ ㄋㄧˇ ㄧˋ ㄑㄧˇ ㄔ ㄧˋ ㄉㄧㄢˇ ㄦ ㄉㄨㄥ ㄒㄧ ㄏㄠˇ ㄇㄚ˙',
        pinyin: 'Lǐ xiānshēng, wǒ xiǎng gēn nǐ yìqǐ chī yìdiǎnr dōngxi, hǎo ma?',
      },
      {
        english: "Seven o'clock? Two o'clock, okay?",
        traditional: '七點鐘？兩點鐘好嗎？',
        simplified: '七点钟？两点钟好吗？',
        zhuyin: 'ㄑㄧ ㄉㄧㄢˇ ㄓㄨㄥ ㄌㄧㄤˇ ㄉㄧㄢˇ ㄓㄨㄥ ㄏㄠˇ ㄇㄚ˙',
        pinyin: 'Qī diǎnzhōng? Liǎng diǎnzhōng hǎo ma?',
      },
      {
        english: 'Not good. I would like to eat a little later.',
        traditional: '不好，我想過一會兒吃。',
        simplified: '不好，我想过一会儿吃。',
        zhuyin: 'ㄅㄨˋ ㄏㄠˇ ㄨㄛˇ ㄒㄧㄤˇ ㄍㄨㄛˋ ㄧˋ ㄏㄨㄟˇ ㄦ ㄔ',
        pinyin: 'Bù hǎo, wǒ xiǎng guò yìhuǐr chī.',
      },
      {
        english: "Eight o'clock, or nine o'clock?",
        traditional: '八點鐘還是九點鐘？',
        simplified: '八点钟还是九点钟？',
        zhuyin: 'ㄅㄚ ㄉㄧㄢˇ ㄓㄨㄥ ㄏㄞˊ ㄕˋ ㄐㄧㄡˇ ㄉㄧㄢˇ ㄓㄨㄥ',
        pinyin: 'Bā diǎnzhōng háishi jiǔ diǎnzhōng?',
      },
      {
        english: "Nine o'clock. Okay.",
        traditional: '九點鐘。好。',
        simplified: '九点钟。好。',
        zhuyin: 'ㄐㄧㄡˇ ㄉㄧㄢˇ ㄓㄨㄥ ㄏㄠˇ',
        pinyin: 'Jiǔ diǎnzhōng. Hǎo.',
      },
    ],
  },
];
