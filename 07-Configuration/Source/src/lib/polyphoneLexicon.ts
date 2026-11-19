/**
 * FormosaStudio (FORM) — Taiwan MOE (教育部) Lexicon, 26 Core Polyphone (破音字) Pairs & Character Dictionary
 * Traces to: FORM-REQ-0001, FORM-REQ-0002, FORM-REQ-0005, FORM-DEC-001
 */

export interface PolyphonePairSpec {
  id: string;
  char: string;
  readings: {
    zhuyin: string;
    pinyin: string;
    meaning: string;
    examples: { word: string; zhuyin: string; english: string }[];
  }[];
}

export interface TaiwanMoeEntry {
  word: string;
  taiwanZhuyin: string;
  taiwanPinyin: string;
  mainlandPinyin: string;
  english: string;
  moeNote: string;
}

/**
 * 26 Core Taiwanese Mandarin Polyphone (破音字) Pairs verified by DEP-01 (FORM-REQ-0001)
 */
export const POLYPHONE_PAIRS: PolyphonePairSpec[] = [
  {
    id: 'poly-01-zhang-chang',
    char: '長',
    readings: [
      { zhuyin: 'ㄓㄤˇ', pinyin: 'zhǎng', meaning: 'to grow / elder / chief', examples: [{ word: '長大', zhuyin: 'ㄓㄤˇ ㄉㄚˋ', english: 'grow up' }, { word: '市長', zhuyin: 'ㄕˋ ㄓㄤˇ', english: 'mayor' }] },
      { zhuyin: 'ㄔㄤˊ', pinyin: 'cháng', meaning: 'long (length / duration)', examples: [{ word: '很長', zhuyin: 'ㄏㄣˇ ㄔㄤˊ', english: 'very long' }, { word: '長安街', zhuyin: 'ㄔㄤˊ ㄢ ㄐㄧㄝ', english: "Chang'an St." }] },
    ],
  },
  {
    id: 'poly-02-huan-hai',
    char: '還',
    readings: [
      { zhuyin: 'ㄏㄨㄢˊ', pinyin: 'huán', meaning: 'to return / pay back', examples: [{ word: '還錢', zhuyin: 'ㄏㄨㄢˊ ㄑㄧㄢˊ', english: 'repay money' }, { word: '還書', zhuyin: 'ㄏㄨㄢˊ ㄕㄨ', english: 'return a book' }] },
      { zhuyin: 'ㄏㄞˊ', pinyin: 'hái', meaning: 'still / also / or', examples: [{ word: '還有', zhuyin: 'ㄏㄞˊ ㄧㄡˇ', english: 'still have / also' }, { word: '還是', zhuyin: 'ㄏㄞˊ ㄕˋ', english: 'or / still' }] },
    ],
  },
  {
    id: 'poly-03-hang-xing',
    char: '行',
    readings: [
      { zhuyin: 'ㄏㄤˊ', pinyin: 'háng', meaning: 'bank / profession / row', examples: [{ word: '銀行', zhuyin: 'ㄧㄣˊ ㄏㄤˊ', english: 'bank' }, { word: '行業', zhuyin: 'ㄏㄤˊ ㄧㄝˋ', english: 'industry' }] },
      { zhuyin: 'ㄒㄧㄥˊ', pinyin: 'xíng', meaning: 'okay / travel / walk', examples: [{ word: '不行', zhuyin: 'ㄅㄨˋ ㄒㄧㄥˊ', english: 'not okay' }, { word: '旅行', zhuyin: 'ㄌㄩˇ ㄒㄧㄥˊ', english: 'travel' }] },
    ],
  },
  {
    id: 'poly-04-de-dei',
    char: '得',
    readings: [
      { zhuyin: 'ㄉㄜˊ', pinyin: 'dé', meaning: 'to obtain / feel (覺得)', examples: [{ word: '覺得', zhuyin: 'ㄐㄩㄝˊ ㄉㄜˊ', english: 'feel / think' }, { word: '得到', zhuyin: 'ㄉㄜˊ ㄉㄠˋ', english: 'obtain' }] },
      { zhuyin: 'ㄉㄟˇ', pinyin: 'děi', meaning: 'must / have to', examples: [{ word: '得去', zhuyin: 'ㄉㄟˇ ㄑㄩˋ', english: 'must go' }, { word: '得要', zhuyin: 'ㄉㄟˇ ㄧㄠˋ', english: 'must / require' }] },
      { zhuyin: 'ㄉㄜ˙', pinyin: 'de', meaning: 'verbal degree particle', examples: [{ word: '跑得快', zhuyin: 'ㄆㄠˇ ㄉㄜ˙ ㄎㄨㄞˋ', english: 'run fast' }, { word: '懂得', zhuyin: 'ㄉㄨㄥˇ ㄉㄜ˙', english: 'understand' }] },
    ],
  },
  {
    id: 'poly-05-yue-le',
    char: '樂',
    readings: [
      { zhuyin: 'ㄩㄝˋ', pinyin: 'yuè', meaning: 'music', examples: [{ word: '音樂', zhuyin: 'ㄧㄣ ㄩㄝˋ', english: 'music' }, { word: '樂器', zhuyin: 'ㄩㄝˋ ㄑㄧˋ', english: 'instrument' }] },
      { zhuyin: 'ㄌㄜˋ', pinyin: 'lè', meaning: 'happy / joy', examples: [{ word: '快樂', zhuyin: 'ㄎㄨㄞˋ ㄌㄜˋ', english: 'happy' }, { word: '可樂', zhuyin: 'ㄎㄜˇ ㄌㄜˋ', english: 'cola' }] },
    ],
  },
  {
    id: 'poly-06-kuai-hui',
    char: '會',
    readings: [
      { zhuyin: 'ㄎㄨㄞˋ', pinyin: 'kuài', meaning: 'accounting', examples: [{ word: '會計', zhuyin: 'ㄎㄨㄞˋ ㄐㄧˋ', english: 'accounting' }, { word: '會計師', zhuyin: 'ㄎㄨㄞˋ ㄐㄧˋ ㄕ', english: 'accountant' }] },
      { zhuyin: 'ㄏㄨㄟˋ', pinyin: 'huì', meaning: 'can / meeting / will', examples: [{ word: '開會', zhuyin: 'ㄎㄞ ㄏㄨㄟˋ', english: 'attend a meeting' }, { word: '學會', zhuyin: 'ㄒㄩㄝˊ ㄏㄨㄟˋ', english: 'master a skill' }] },
    ],
  },
  {
    id: 'poly-07-shu',
    char: '數',
    readings: [
      { zhuyin: 'ㄕㄨˋ', pinyin: 'shù', meaning: 'number / math', examples: [{ word: '數學', zhuyin: 'ㄕㄨˋ ㄒㄩㄝˊ', english: 'mathematics' }, { word: '數字', zhuyin: 'ㄕㄨˋ ㄗˋ', english: 'number' }] },
      { zhuyin: 'ㄕㄨˇ', pinyin: 'shǔ', meaning: 'to count', examples: [{ word: '數一數', zhuyin: 'ㄕㄨˇ ㄧ ㄕㄨˇ', english: 'count them' }, { word: '倒數', zhuyin: 'ㄉㄠˋ ㄕㄨˇ', english: 'countdown' }] },
    ],
  },
  {
    id: 'poly-08-zhe-zhao',
    char: '著',
    readings: [
      { zhuyin: 'ㄓㄜ˙', pinyin: 'zhe', meaning: 'continuous aspect particle', examples: [{ word: '看著', zhuyin: 'ㄎㄢˋ ㄓㄜ˙', english: 'looking at' }, { word: '走著', zhuyin: 'ㄗㄡˇ ㄓㄜ˙', english: 'walking' }] },
      { zhuyin: 'ㄓㄠˊ', pinyin: 'zháo', meaning: 'succeed / fall asleep / anxious', examples: [{ word: '睡著', zhuyin: 'ㄕㄨㄟˋ ㄓㄠˊ', english: 'fall asleep' }, { word: '著急', zhuyin: 'ㄓㄠˊ ㄐㄧˊ', english: 'anxious' }] },
    ],
  },
  {
    id: 'poly-09-zhong-chong',
    char: '重',
    readings: [
      { zhuyin: 'ㄓㄨㄥˋ', pinyin: 'zhòng', meaning: 'heavy / important', examples: [{ word: '重要', zhuyin: 'ㄓㄨㄥˋ ㄧㄠˋ', english: 'important' }, { word: '體重', zhuyin: 'ㄊㄧˇ ㄓㄨㄥˋ', english: 'body weight' }] },
      { zhuyin: 'ㄔㄨㄥˊ', pinyin: 'chóng', meaning: 'again / repeat', examples: [{ word: '重新', zhuyin: 'ㄔㄨㄥˊ ㄒㄧㄣ', english: 'anew / again' }, { word: '重複', zhuyin: 'ㄔㄨㄥˊ ㄈㄨˋ', english: 'repeat' }] },
    ],
  },
  {
    id: 'poly-10-pian-bian',
    char: '便',
    readings: [
      { zhuyin: 'ㄆㄧㄢˊ', pinyin: 'pián', meaning: 'inexpensive (便宜)', examples: [{ word: '便宜', zhuyin: 'ㄆㄧㄢˊ ㄧˊ', english: 'cheap / inexpensive' }] },
      { zhuyin: 'ㄅㄧㄢˋ', pinyin: 'biàn', meaning: 'convenient / bento', examples: [{ word: '方便', zhuyin: 'ㄈㄤ ㄅㄧㄢˋ', english: 'convenient' }, { word: '便當', zhuyin: 'ㄅㄧㄢˋ ㄉㄤ', english: 'Taiwanese bento' }] },
    ],
  },
  {
    id: 'poly-11-han-he',
    char: '和',
    readings: [
      { zhuyin: 'ㄏㄢˋ', pinyin: 'hàn', meaning: 'and / with (Taiwan MOE standard)', examples: [{ word: '我和你', zhuyin: 'ㄨㄛˇ ㄏㄢˋ ㄋㄧˇ', english: 'you and I' }, { word: '我和家人', zhuyin: 'ㄨㄛˇ ㄏㄢˋ ㄐㄧㄚ ㄖㄣˊ', english: 'my family and I' }] },
      { zhuyin: 'ㄏㄜˊ', pinyin: 'hé', meaning: 'peace / gentle', examples: [{ word: '和平', zhuyin: 'ㄏㄜˊ ㄆㄧㄥˊ', english: 'peace' }, { word: '溫和', zhuyin: 'ㄨㄣ ㄏㄜˊ', english: 'mild / gentle' }] },
    ],
  },
  {
    id: 'poly-12-jue-jiao',
    char: '覺',
    readings: [
      { zhuyin: 'ㄐㄩㄝˊ', pinyin: 'jué', meaning: 'to sense / feel', examples: [{ word: '發覺', zhuyin: 'ㄈㄚ ㄐㄩㄝˊ', english: 'realize / detect' }, { word: '感覺', zhuyin: 'ㄍㄢˇ ㄐㄩㄝˊ', english: 'feeling' }] },
      { zhuyin: 'ㄐㄧㄠˋ', pinyin: 'jiào', meaning: 'sleep', examples: [{ word: '睡覺', zhuyin: 'ㄕㄨㄟˋ ㄐㄧㄠˋ', english: 'sleep' }, { word: '午覺', zhuyin: 'ㄨˇ ㄐㄧㄠˋ', english: 'afternoon nap' }] },
    ],
  },
  {
    id: 'poly-13-liao-le',
    char: '了',
    readings: [
      { zhuyin: 'ㄌㄧㄠˇ', pinyin: 'liǎo', meaning: 'understand / finish', examples: [{ word: '了解', zhuyin: 'ㄌㄧㄠˇ ㄐㄧㄝˇ', english: 'understand' }, { word: '受不了', zhuyin: 'ㄕㄡˋ ㄅㄨˋ ㄌㄧㄠˇ', english: 'cannot stand it' }] },
      { zhuyin: 'ㄌㄜ˙', pinyin: 'le', meaning: 'aspect / change-of-state particle', examples: [{ word: '吃了', zhuyin: 'ㄔ ㄌㄜ˙', english: 'ate' }, { word: '到了', zhuyin: 'ㄉㄠˋ ㄌㄜ˙', english: 'arrived' }] },
    ],
  },
  {
    id: 'poly-14-shao',
    char: '少',
    readings: [
      { zhuyin: 'ㄕㄠˇ', pinyin: 'shǎo', meaning: 'few / little', examples: [{ word: '少數', zhuyin: 'ㄕㄠˇ ㄕㄨˋ', english: 'minority / few' }, { word: '多少', zhuyin: 'ㄉㄨㄛ ㄕㄠˇ', english: 'how much' }] },
      { zhuyin: 'ㄕㄠˋ', pinyin: 'shào', meaning: 'young / youth', examples: [{ word: '少年', zhuyin: 'ㄕㄠˋ ㄋㄧㄢˊ', english: 'youth / teenager' }, { word: '少女', zhuyin: 'ㄕㄠˋ ㄋㄩˇ', english: 'young girl' }] },
    ],
  },
  {
    id: 'poly-15-hao',
    char: '好',
    readings: [
      { zhuyin: 'ㄏㄠˋ', pinyin: 'hào', meaning: 'fond of / hobby', examples: [{ word: '好客', zhuyin: 'ㄏㄠˋ ㄎㄜˋ', english: 'hospitable' }, { word: '好奇', zhuyin: 'ㄏㄠˋ ㄑㄧˊ', english: 'curious' }] },
      { zhuyin: 'ㄏㄠˇ', pinyin: 'hǎo', meaning: 'good / well', examples: [{ word: '很好', zhuyin: 'ㄏㄣˇ ㄏㄠˇ', english: 'very good' }, { word: '好吃', zhuyin: 'ㄏㄠˇ ㄔ', english: 'delicious' }] },
    ],
  },
  {
    id: 'poly-16-chuan-zhuan',
    char: '傳',
    readings: [
      { zhuyin: 'ㄔㄨㄢˊ', pinyin: 'chuán', meaning: 'pass on / transmit', examples: [{ word: '傳奇', zhuyin: 'ㄔㄨㄢˊ ㄑㄧˊ', english: 'legend' }, { word: '傳統', zhuyin: 'ㄔㄨㄢˊ ㄊㄨㄥˇ', english: 'tradition' }] },
      { zhuyin: 'ㄓㄨㄢˋ', pinyin: 'zhuàn', meaning: 'biography', examples: [{ word: '自傳', zhuyin: 'ㄗˋ ㄓㄨㄢˋ', english: 'autobiography' }, { word: '傳記', zhuyin: 'ㄓㄨㄢˋ ㄐㄧˋ', english: 'biography' }] },
    ],
  },
  {
    id: 'poly-17-jia',
    char: '假',
    readings: [
      { zhuyin: 'ㄐㄧㄚˋ', pinyin: 'jià', meaning: 'holiday / vacation', examples: [{ word: '假期', zhuyin: 'ㄐㄧㄚˋ ㄑㄧˊ', english: 'vacation period' }, { word: '放假', zhuyin: 'ㄈㄤˋ ㄐㄧㄚˋ', english: 'on holiday' }] },
      { zhuyin: 'ㄐㄧㄚˇ', pinyin: 'jiǎ', meaning: 'false / fake', examples: [{ word: '真假', zhuyin: 'ㄓㄣ ㄐㄧㄚˇ', english: 'true or false' }, { word: '假裝', zhuyin: 'ㄐㄧㄚˇ ㄓㄨㄤ', english: 'pretend' }] },
    ],
  },
  {
    id: 'poly-18-tan-dan',
    char: '彈',
    readings: [
      { zhuyin: 'ㄊㄢˊ', pinyin: 'tán', meaning: 'pluck / play instrument / elastic', examples: [{ word: '彈琴', zhuyin: 'ㄊㄢˊ ㄑㄧㄣˊ', english: 'play piano' }, { word: '彈性', zhuyin: 'ㄊㄢˊ ㄒㄧㄥˋ', english: 'elasticity / flexibility' }] },
      { zhuyin: 'ㄉㄢˋ', pinyin: 'dàn', meaning: 'bullet / bomb', examples: [{ word: '子彈', zhuyin: 'ㄗˇ ㄉㄢˋ', english: 'bullet' }, { word: '炸彈', zhuyin: 'ㄓㄚˋ ㄉㄢˋ', english: 'bomb' }] },
    ],
  },
  {
    id: 'poly-19-gan-qian',
    char: '乾',
    readings: [
      { zhuyin: 'ㄍㄢ', pinyin: 'gān', meaning: 'dry / clean', examples: [{ word: '乾淨', zhuyin: 'ㄍㄢ ㄐㄧㄥˋ', english: 'clean' }, { word: '餅乾', zhuyin: 'ㄅㄧㄥˇ ㄍㄢ', english: 'biscuit / cracker' }] },
      { zhuyin: 'ㄑㄧㄢˊ', pinyin: 'qián', meaning: 'heaven / trigram Qian', examples: [{ word: '乾坤', zhuyin: 'ㄑㄧㄢˊ ㄎㄨㄣ', english: 'heaven and earth' }] },
    ],
  },
  {
    id: 'poly-20-jiao',
    char: '教',
    readings: [
      { zhuyin: 'ㄐㄧㄠ', pinyin: 'jiāo', meaning: 'to teach (verbal)', examples: [{ word: '教書', zhuyin: 'ㄐㄧㄠ ㄕㄨ', english: 'teach school' }, { word: '教中文', zhuyin: 'ㄐㄧㄠ ㄓㄨㄥ ㄨㄣˊ', english: 'teach Chinese' }] },
      { zhuyin: 'ㄐㄧㄠˋ', pinyin: 'jiào', meaning: 'education / classroom / religion', examples: [{ word: '教育', zhuyin: 'ㄐㄧㄠˋ ㄩˋ', english: 'education' }, { word: '教室', zhuyin: 'ㄐㄧㄠˋ ㄕˋ', english: 'classroom' }] },
    ],
  },
  {
    id: 'poly-21-du-dou',
    char: '都',
    readings: [
      { zhuyin: 'ㄉㄨ', pinyin: 'dū', meaning: 'capital / metropolis', examples: [{ word: '首都', zhuyin: 'ㄕㄡˇ ㄉㄨ', english: 'capital city' }, { word: '都市', zhuyin: 'ㄉㄨ ㄕˋ', english: 'metropolis' }] },
      { zhuyin: 'ㄉㄡ', pinyin: 'dōu', meaning: 'all / both', examples: [{ word: '都好', zhuyin: 'ㄉㄡ ㄏㄠˇ', english: 'all good' }, { word: '都是', zhuyin: 'ㄉㄡ ㄕˋ', english: 'all are' }] },
    ],
  },
  {
    id: 'poly-22-zhong',
    char: '種',
    readings: [
      { zhuyin: 'ㄓㄨㄥˋ', pinyin: 'zhòng', meaning: 'to plant / cultivate', examples: [{ word: '種花', zhuyin: 'ㄓㄨㄥˋ ㄏㄨㄚ', english: 'plant flowers' }, { word: '種菜', zhuyin: 'ㄓㄨㄥˋ ㄘㄞˋ', english: 'grow vegetables' }] },
      { zhuyin: 'ㄓㄨㄥˇ', pinyin: 'zhǒng', meaning: 'seed / kind / type', examples: [{ word: '種子', zhuyin: 'ㄓㄨㄥˇ ㄗ˙', english: 'seed' }, { word: '各種', zhuyin: 'ㄍㄜˋ ㄓㄨㄥˇ', english: 'various kinds' }] },
    ],
  },
  {
    id: 'poly-23-xiang',
    char: '相',
    readings: [
      { zhuyin: 'ㄒㄧㄤˋ', pinyin: 'xiàng', meaning: 'appearance / photo', examples: [{ word: '相片', zhuyin: 'ㄒㄧㄤˋ ㄆㄧㄢˋ', english: 'photograph' }, { word: '照相', zhuyin: 'ㄓㄠˋ ㄒㄧㄤˋ', english: 'take a photo' }] },
      { zhuyin: 'ㄒㄧㄤ', pinyin: 'xiāng', meaning: 'mutual / each other', examples: [{ word: '相信', zhuyin: 'ㄒㄧㄤ ㄒㄧㄣˋ', english: 'believe' }, { word: '互相', zhuyin: 'ㄏㄨˋ ㄒㄧㄤ', english: 'mutually' }] },
    ],
  },
  {
    id: 'poly-24-kong',
    char: '空',
    readings: [
      { zhuyin: 'ㄎㄨㄥˋ', pinyin: 'kòng', meaning: 'free time / blank space', examples: [{ word: '空閒', zhuyin: 'ㄎㄨㄥˋ ㄒㄧㄢˊ', english: 'leisure / free time' }, { word: '有空', zhuyin: 'ㄧㄡˇ ㄎㄨㄥˋ', english: 'have free time' }] },
      { zhuyin: 'ㄎㄨㄥ', pinyin: 'kōng', meaning: 'sky / air / empty', examples: [{ word: '空氣', zhuyin: 'ㄎㄨㄥ ㄑㄧˋ', english: 'air' }, { word: '天空', zhuyin: 'ㄊㄧㄢ ㄎㄨㄥ', english: 'sky' }] },
    ],
  },
  {
    id: 'poly-25-qie',
    char: '切',
    readings: [
      { zhuyin: 'ㄑㄧㄝ', pinyin: 'qiē', meaning: 'to cut / slice', examples: [{ word: '切菜', zhuyin: 'ㄑㄧㄝ ㄘㄞˋ', english: 'cut vegetables' }, { word: '切水果', zhuyin: 'ㄑㄧㄝ ㄕㄨㄟˇ ㄍㄨㄛˇ', english: 'slice fruit' }] },
      { zhuyin: 'ㄑㄧㄝˋ', pinyin: 'qiè', meaning: 'cordial / eager / all', examples: [{ word: '親切', zhuyin: 'ㄑㄧㄣ ㄑㄧㄝˋ', english: 'kind / cordial' }, { word: '一切', zhuyin: 'ㄧˊ ㄑㄧㄝˋ', english: 'everything' }] },
    ],
  },
  {
    id: 'poly-26-fa',
    char: '發',
    readings: [
      { zhuyin: 'ㄈㄚ', pinyin: 'fā', meaning: 'emit / issue / discover', examples: [{ word: '發票', zhuyin: 'ㄈㄚ ㄆㄧㄠˋ', english: 'receipt / invoice' }, { word: '發現', zhuyin: 'ㄈㄚ ㄒㄧㄢˋ', english: 'discover' }] },
      { zhuyin: 'ㄈㄚˇ', pinyin: 'fǎ', meaning: 'hair (in 頭髮)', examples: [{ word: '頭髮', zhuyin: 'ㄊㄡˊ ㄈㄚˇ', english: 'hair (Taiwan MOE)' }] },
    ],
  },
];

export const POLYPHONE_CHARS = new Set(POLYPHONE_PAIRS.map((p) => p.char));

/**
 * Taiwan Ministry of Education (教育部) Cross-Strait Standard Pronunciations (兩岸異讀字) (FORM-REQ-0002)
 */
export const TAIWAN_MOE_PRONUNCIATIONS: Record<string, TaiwanMoeEntry> = {
  垃圾: { word: '垃圾', taiwanZhuyin: 'ㄌㄜˋ ㄙㄜˋ', taiwanPinyin: 'lèsè', mainlandPinyin: 'lājī', english: 'trash / garbage', moeNote: 'Universal Taiwan MOE standard (垃圾車 ㄌㄜˋ ㄙㄜˋ ㄔㄜ, 倒垃圾).' },
  星期: { word: '星期', taiwanZhuyin: 'ㄒㄧㄥ ㄑㄧˊ', taiwanPinyin: 'xīngqí', mainlandPinyin: 'xīngqī', english: 'week', moeNote: '期 is 2nd tone (ㄑㄧˊ) in Taiwan MOE standard (星期一..星期日).' },
  研究: { word: '研究', taiwanZhuyin: 'ㄧㄢˊ ㄐㄧㄡˋ', taiwanPinyin: 'yánjiù', mainlandPinyin: 'yánjiū', english: 'research / study', moeNote: '究 is 4th tone (ㄐㄧㄡˋ) in Taiwan MOE standard (研究所).' },
  企業: { word: '企業', taiwanZhuyin: 'ㄑㄧˋ ㄧㄝˋ', taiwanPinyin: 'qìyè', mainlandPinyin: 'qǐyè', english: 'enterprise / corporation', moeNote: '企 is 4th tone (ㄑㄧˋ) in Taiwan MOE standard.' },
  法國: { word: '法國', taiwanZhuyin: 'ㄈㄚˋ ㄍㄨㄛˊ', taiwanPinyin: 'Fàguó', mainlandPinyin: 'Fǎguó', english: 'France', moeNote: '法 in 法國/法文 is 4th tone (ㄈㄚˋ) in traditional Taiwan MOE standard.' },
  液體: { word: '液體', taiwanZhuyin: 'ㄧㄝˋ ㄊㄧˇ', taiwanPinyin: 'yètǐ', mainlandPinyin: 'yètǐ (spoken yì)', english: 'liquid', moeNote: 'Taiwan MOE standard pronunciation is ㄧㄝˋ ㄊㄧˇ.' },
  微糖: { word: '微糖', taiwanZhuyin: 'ㄨㄟˊ ㄊㄤˊ', taiwanPinyin: 'wéitáng', mainlandPinyin: 'wēitáng', english: 'quarter-sweet (tea order)', moeNote: '微 is 2nd tone (ㄨㄟˊ) in Taiwan MOE standard (微笑 ㄨㄟˊ ㄒㄧㄠˋ).' },
  和: { word: '和', taiwanZhuyin: 'ㄏㄢˋ', taiwanPinyin: 'hàn', mainlandPinyin: 'hé', english: 'and / with', moeNote: 'In Taiwan Mandarin, conjunctive 和 ("A and B") is pronounced ㄏㄢˋ (hàn).' },
  角色: { word: '角色', taiwanZhuyin: 'ㄐㄧㄠˇ ㄙㄜˋ', taiwanPinyin: 'jiǎosè', mainlandPinyin: 'juésè', english: 'role / character', moeNote: 'Taiwan MOE standard reading is ㄐㄧㄠˇ ㄙㄜˋ.' },
  蝸牛: { word: '蝸牛', taiwanZhuyin: 'ㄍㄨㄚ ㄋㄧㄡˊ', taiwanPinyin: 'guāniú', mainlandPinyin: 'wōniú', english: 'snail', moeNote: 'Taiwan MOE standard reading is ㄍㄨㄚ ㄋㄧㄡˊ.' },
  危險: { word: '危險', taiwanZhuyin: 'ㄨㄟˊ ㄒㄧㄢˇ', taiwanPinyin: 'wéixiǎn', mainlandPinyin: 'wēixiǎn', english: 'dangerous', moeNote: '危 is 2nd tone (ㄨㄟˊ) in Taiwan MOE standard.' },
  知識: { word: '知識', taiwanZhuyin: 'ㄓ ㄕˋ', taiwanPinyin: 'zhīshì', mainlandPinyin: 'zhīshi', english: 'knowledge', moeNote: '識 carries full 4th tone (ㄕˋ) in Taiwan.' },
};

/**
 * Word-level lexicon consulted by the Forward Maximum-Matching (FMM) tokenizer (up to 6 characters).
 */
export const WORD_ZHUYIN_LEXICON: Record<string, string> = {
  // 4-to-6 character compounds
  便利商店: 'ㄅㄧㄢˋ ㄌㄧˋ ㄕㄤ ㄉㄧㄢˋ',
  討價還價: 'ㄊㄠˇ ㄐㄧㄚˋ ㄏㄨㄢˊ ㄐㄧㄚˋ',
  不好意思: 'ㄅㄨˋ ㄏㄠˇ ㄧˋ ㄙ˙',
  統一發票: 'ㄊㄨㄥˇ ㄧ ㄈㄚ ㄆㄧㄠˋ',
  珍珠奶茶: 'ㄓㄣ ㄓㄨ ㄋㄞˇ ㄔㄚˊ',
  牛肉麵店: 'ㄋㄧㄡˊ ㄖㄡˋ ㄇㄧㄢˋ ㄉㄧㄢˋ',
  莫名其妙: 'ㄇㄛˋ ㄇㄧㄥˊ ㄑㄧˊ ㄇㄧㄠˋ',
  自由自在: 'ㄗˋ ㄧㄡˊ ㄗˋ ㄗㄞˋ',
  // 3-character compounds (including polyphones & Taiwan MOE standards)
  長安街: 'ㄔㄤˊ ㄢ ㄐㄧㄝ',
  會計師: 'ㄎㄨㄞˋ ㄐㄧˋ ㄕ',
  數一數: 'ㄕㄨˇ ㄧ ㄕㄨˇ',
  數不清: 'ㄕㄨˇ ㄅㄨˋ ㄑㄧㄥ',
  跑得快: 'ㄆㄠˇ ㄉㄜ˙ ㄎㄨㄞˋ',
  走得慢: 'ㄗㄡˇ ㄉㄜ˙ ㄇㄢˋ',
  說得好: 'ㄕㄨㄛ ㄉㄜ˙ ㄏㄠˇ',
  受不了: 'ㄕㄡˋ ㄅㄨˋ ㄌㄧㄠˇ',
  大不了: 'ㄉㄚˋ ㄅㄨˋ ㄌㄧㄠˇ',
  找不著: 'ㄓㄠˇ ㄅㄨˋ ㄓㄠˊ',
  占便宜: 'ㄓㄢˋ ㄆㄧㄢˊ ㄧˊ',
  我和你: 'ㄨㄛˇ ㄏㄢˋ ㄋㄧˇ',
  我和他: 'ㄨㄛˇ ㄏㄢˋ ㄊㄚ',
  我和她: 'ㄨㄛˇ ㄏㄢˋ ㄊㄚ',
  你和我: 'ㄋㄧˇ ㄏㄢˋ ㄨㄛˇ',
  我和家: 'ㄨㄛˇ ㄏㄢˋ ㄐㄧㄚ',
  垃圾車: 'ㄌㄜˋ ㄙㄜˋ ㄔㄜ',
  倒垃圾: 'ㄉㄠˋ ㄌㄜˋ ㄙㄜˋ',
  垃圾桶: 'ㄌㄜˋ ㄙㄜˋ ㄊㄨㄥˇ',
  星期一: 'ㄒㄧㄥ ㄑㄧˊ ㄧ',
  星期二: 'ㄒㄧㄥ ㄑㄧˊ ㄦˋ',
  星期三: 'ㄒㄧㄥ ㄑㄧˊ ㄙㄢ',
  星期四: 'ㄒㄧㄥ ㄑㄧˊ ㄙˋ',
  星期五: 'ㄒㄧㄥ ㄑㄧˊ ㄨˇ',
  星期六: 'ㄒㄧㄥ ㄑㄧˊ ㄌㄧㄡˋ',
  星期日: 'ㄒㄧㄥ ㄑㄧˊ ㄖˋ',
  星期天: 'ㄒㄧㄥ ㄑㄧˊ ㄊㄧㄢ',
  研究所: 'ㄧㄢˊ ㄐㄧㄡˋ ㄙㄨㄛˇ',
  研究員: 'ㄧㄢˊ ㄐㄧㄡˋ ㄩㄢˊ',
  企業家: 'ㄑㄧˋ ㄧㄝˋ ㄐㄧㄚ',
  法國人: 'ㄈㄚˋ ㄍㄨㄛˊ ㄖㄣˊ',
  牛肉麵: 'ㄋㄧㄡˊ ㄖㄡˋ ㄇㄧㄢˋ',
  滷肉飯: 'ㄌㄨˇ ㄖㄡˋ ㄈㄢˋ',
  小籠包: 'ㄒㄧㄠˇ ㄌㄨㄥˊ ㄅㄠ',
  悠遊卡: 'ㄧㄡ ㄧㄡˊ ㄎㄚˇ',
  捷運站: 'ㄐㄧㄝˊ ㄩㄣˋ ㄓㄢˋ',
  火車站: 'ㄏㄨㄛˇ ㄔㄜ ㄓㄢˋ',
  高鐵站: 'ㄍㄠ ㄊㄧㄝˇ ㄓㄢˋ',
  對不起: 'ㄉㄨㄟˋ ㄅㄨˋ ㄑㄧˇ',
  沒關係: 'ㄇㄟˊ ㄍㄨㄢ ㄒㄧ˙',
  不知道: 'ㄅㄨˋ ㄓ ㄉㄠˋ',
  我很好: 'ㄨㄛˇ ㄏㄣˇ ㄏㄠˇ',
  展覽館: 'ㄓㄢˇ ㄌㄢˇ ㄍㄨㄢˇ',
  教中文: 'ㄐㄧㄠ ㄓㄨㄥ ㄨㄣˊ',
  切水果: 'ㄑㄧㄝ ㄕㄨㄟˇ ㄍㄨㄛˇ',
  彈吉他: 'ㄊㄢˊ ㄐㄧˊ ㄊㄚ',
  颱風假: 'ㄊㄞˊ ㄈㄥ ㄐㄧㄚˋ',
  大都會: 'ㄉㄚˋ ㄉㄨ ㄏㄨㄟˋ',
  // 2-character polyphone & Taiwan MOE pairs
  長大: 'ㄓㄤˇ ㄉㄚˋ', 成長: 'ㄔㄥˊ ㄓㄤˇ', 市長: 'ㄕˋ ㄓㄤˇ', 社長: 'ㄕㄜˋ ㄓㄤˇ', 家長: 'ㄐㄧㄚ ㄓㄤˇ', 長輩: 'ㄓㄤˇ ㄅㄟˋ',
  很長: 'ㄏㄣˇ ㄔㄤˊ', 專長: 'ㄓㄨㄢ ㄔㄤˊ', 長途: 'ㄔㄤˊ ㄊㄨˊ', 長度: 'ㄔㄤˊ ㄉㄨˋ', 長期: 'ㄔㄤˊ ㄑㄧˊ',
  還錢: 'ㄏㄨㄢˊ ㄑㄧㄢˊ', 歸還: 'ㄍㄨㄟ ㄏㄨㄢˊ', 還書: 'ㄏㄨㄢˊ ㄕㄨ', 退還: 'ㄊㄨㄟˋ ㄏㄨㄢˊ',
  還有: 'ㄏㄞˊ ㄧㄡˇ', 還是: 'ㄏㄞˊ ㄕˋ', 還好: 'ㄏㄞˊ ㄏㄠˇ', 還沒: 'ㄏㄞˊ ㄇㄟˊ',
  銀行: 'ㄧㄣˊ ㄏㄤˊ', 行業: 'ㄏㄤˊ ㄧㄝˋ', 同行: 'ㄊㄨㄥˊ ㄏㄤˊ', 行列: 'ㄏㄤˊ ㄌㄧㄝˋ',
  不行: 'ㄅㄨˋ ㄒㄧㄥˊ', 行李: 'ㄒㄧㄥˊ ㄌㄧˇ', 行人: 'ㄒㄧㄥˊ ㄖㄣˊ', 旅行: 'ㄌㄩˇ ㄒㄧㄥˊ',
  覺得: 'ㄐㄩㄝˊ ㄉㄜˊ', 得到: 'ㄉㄜˊ ㄉㄠˋ', 值得: 'ㄓˊ ㄉㄜˊ', 難得: 'ㄋㄢˊ ㄉㄜˊ', 記得: 'ㄐㄧˋ ㄉㄜ˙', 懂得: 'ㄉㄨㄥˇ ㄉㄜ˙',
  得去: 'ㄉㄟˇ ㄑㄩˋ', 得要: 'ㄉㄟˇ ㄧㄠˋ', 非得: 'ㄈㄟ ㄉㄟˇ',
  音樂: 'ㄧㄣ ㄩㄝˋ', 樂器: 'ㄩㄝˋ ㄑㄧˋ', 樂團: 'ㄩㄝˋ ㄊㄨㄢˊ',
  快樂: 'ㄎㄨㄞˋ ㄌㄜˋ', 樂觀: 'ㄌㄜˋ ㄍㄨㄢ', 可樂: 'ㄎㄜˇ ㄌㄜˋ',
  會計: 'ㄎㄨㄞˋ ㄐㄧˋ', 開會: 'ㄎㄞ ㄏㄨㄟˋ', 不會: 'ㄅㄨˋ ㄏㄨㄟˋ', 機會: 'ㄐㄧ ㄏㄨㄟˋ', 學會: 'ㄒㄩㄝˊ ㄏㄨㄟˋ',
  數學: 'ㄕㄨˋ ㄒㄩㄝˊ', 數字: 'ㄕㄨˋ ㄗˋ', 少數: 'ㄕㄠˇ ㄕㄨˋ', 分數: 'ㄈㄣ ㄕㄨˋ', 倒數: 'ㄉㄠˋ ㄕㄨˇ',
  看著: 'ㄎㄢˋ ㄓㄜ˙', 走著: 'ㄗㄡˇ ㄓㄜ˙', 聽著: 'ㄊㄧㄥ ㄓㄜ˙', 拿著: 'ㄋㄚˊ ㄓㄜ˙',
  睡著: 'ㄕㄨㄟˋ ㄓㄠˊ', 著急: 'ㄓㄠˊ ㄐㄧˊ', 著火: 'ㄓㄠˊ ㄏㄨㄛˇ', 穿著: 'ㄔㄨㄢ ㄓㄨㄛˊ',
  重要: 'ㄓㄨㄥˋ ㄧㄠˋ', 體重: 'ㄊㄧˇ ㄓㄨㄥˋ', 嚴重: 'ㄧㄢˊ ㄓㄨㄥˋ', 尊重: 'ㄗㄨㄣ ㄓㄨㄥˋ',
  重新: 'ㄔㄨㄥˊ ㄒㄧㄣ', 重複: 'ㄔㄨㄥˊ ㄈㄨˋ', 重逢: 'ㄔㄨㄥˊ ㄈㄥˊ',
  便宜: 'ㄆㄧㄢˊ ㄧˊ', 方便: 'ㄈㄤ ㄅㄧㄢˋ', 便當: 'ㄅㄧㄢˋ ㄉㄤ', 隨便: 'ㄙㄨㄟˊ ㄅㄧㄢˋ',
  和平: 'ㄏㄜˊ ㄆㄧㄥˊ', 溫和: 'ㄨㄣ ㄏㄜˊ', 暖和: 'ㄋㄨㄢˇ ㄏㄨㄛ˙',
  發覺: 'ㄈㄚ ㄐㄩㄝˊ', 感覺: 'ㄍㄢˇ ㄐㄩㄝˊ', 自覺: 'ㄗˋ ㄐㄩㄝˊ', 睡覺: 'ㄕㄨㄟˋ ㄐㄧㄠˋ', 午覺: 'ㄨˇ ㄐㄧㄠˋ',
  了解: 'ㄌㄧㄠˇ ㄐㄧㄝˇ', 吃了: 'ㄔ ㄌㄜ˙', 到了: 'ㄉㄠˋ ㄌㄜ˙', 好了: 'ㄏㄠˇ ㄌㄜ˙', 買了: 'ㄇㄞˇ ㄌㄜ˙',
  多少: 'ㄉㄨㄛ ㄕㄠˇ', 減少: 'ㄐㄧㄢˇ ㄕㄠˇ', 少年: 'ㄕㄠˋ ㄋㄧㄢˊ', 少女: 'ㄕㄠˋ ㄋㄩˇ',
  好客: 'ㄏㄠˋ ㄎㄜˋ', 好奇: 'ㄏㄠˋ ㄑㄧˊ', 嗜好: 'ㄕˋ ㄏㄠˋ', 很好: 'ㄏㄣˇ ㄏㄠˇ', 好吃: 'ㄏㄠˇ ㄔ', 你好: 'ㄋㄧˇ ㄏㄠˇ',
  傳奇: 'ㄔㄨㄢˊ ㄑㄧˊ', 傳統: 'ㄔㄨㄢˊ ㄊㄨㄥˇ', 傳染: 'ㄔㄨㄢˊ ㄖㄢˇ', 自傳: 'ㄗˋ ㄓㄨㄢˋ', 傳記: 'ㄓㄨㄢˋ ㄐㄧˋ',
  假期: 'ㄐㄧㄚˋ ㄑㄧˊ', 放假: 'ㄈㄤˋ ㄐㄧㄚˋ', 暑假: 'ㄕㄨˇ ㄐㄧㄚˋ', 真假: 'ㄓㄣ ㄐㄧㄚˇ', 假裝: 'ㄐㄧㄚˇ ㄓㄨㄤ',
  彈琴: 'ㄊㄢˊ ㄑㄧㄣˊ', 彈性: 'ㄊㄢˊ ㄒㄧㄥˋ', 子彈: 'ㄗˇ ㄉㄢˋ', 炸彈: 'ㄓㄚˋ ㄉㄢˋ',
  乾淨: 'ㄍㄢ ㄐㄧㄥˋ', 餅乾: 'ㄅㄧㄥˇ ㄍㄢ', 乾杯: 'ㄍㄢ ㄅㄟ', 乾坤: 'ㄑㄧㄢˊ ㄎㄨㄣ', 樹幹: 'ㄕㄨˋ ㄍㄢˋ', 能幹: 'ㄋㄥˊ ㄍㄢˋ',
  教書: 'ㄐㄧㄠ ㄕㄨ', 教育: 'ㄐㄧㄠˋ ㄩˋ', 教室: 'ㄐㄧㄠˋ ㄕˋ', 教授: 'ㄐㄧㄠˋ ㄕㄡˋ',
  首都: 'ㄕㄡˇ ㄉㄨ', 都市: 'ㄉㄨ ㄕˋ', 都好: 'ㄉㄡ ㄏㄠˇ', 都是: 'ㄉㄡ ㄕˋ', 全都: 'ㄑㄩㄢˊ ㄉㄡ',
  種花: 'ㄓㄨㄥˋ ㄏㄨㄚ', 種菜: 'ㄓㄨㄥˋ ㄘㄞˋ', 種植: 'ㄓㄨㄥˋ ㄓˊ', 種子: 'ㄓㄨㄥˇ ㄗ˙', 各種: 'ㄍㄜˋ ㄓㄨㄥˇ', 種類: 'ㄓㄨㄥˇ ㄌㄟˋ',
  相片: 'ㄒㄧㄤˋ ㄆㄧㄢˋ', 照相: 'ㄓㄠˋ ㄒㄧㄤˋ', 真相: 'ㄓㄣ ㄒㄧㄤˋ', 相信: 'ㄒㄧㄤ ㄒㄧㄣˋ', 互相: 'ㄏㄨˋ ㄒㄧㄤ', 相當: 'ㄒㄧㄤ ㄉㄤ',
  空閒: 'ㄎㄨㄥˋ ㄒㄧㄢˊ', 有空: 'ㄧㄡˇ ㄎㄨㄥˋ', 空白: 'ㄎㄨㄥˋ ㄅㄞˊ', 空氣: 'ㄎㄨㄥ ㄑㄧˋ', 天空: 'ㄊㄧㄢ ㄎㄨㄥ', 空調: 'ㄎㄨㄥ ㄊㄧㄠˊ',
  切菜: 'ㄑㄧㄝ ㄘㄞˋ', 親切: 'ㄑㄧㄣ ㄑㄧㄝˋ', 一切: 'ㄧˊ ㄑㄧㄝˋ', 迫切: 'ㄆㄛˋ ㄑㄧㄝˋ',
  發票: 'ㄈㄚ ㄆㄧㄠˋ', 發現: 'ㄈㄚ ㄒㄧㄢˋ', 出發: 'ㄔㄨ ㄈㄚ', 頭髮: 'ㄊㄡˊ ㄈㄚˇ', 髮型: 'ㄈㄚˇ ㄒㄧㄥˊ',
  // Taiwan MOE 兩岸異讀字
  垃圾: 'ㄌㄜˋ ㄙㄜˋ', 星期: 'ㄒㄧㄥ ㄑㄧˊ', 研究: 'ㄧㄢˊ ㄐㄧㄡˋ', 企業: 'ㄑㄧˋ ㄧㄝˋ', 法國: 'ㄈㄚˋ ㄍㄨㄛˊ',
  法文: 'ㄈㄚˋ ㄨㄣˊ', 法律: 'ㄈㄚˇ ㄌㄩˋ', 液體: 'ㄧㄝˋ ㄊㄧˇ', 血液: 'ㄒㄧㄝˇ ㄧㄝˋ', 微糖: 'ㄨㄟˊ ㄊㄤˊ',
  微笑: 'ㄨㄟˊ ㄒㄧㄠˋ', 微風: 'ㄨㄟˊ ㄈㄥ', 角色: 'ㄐㄧㄠˇ ㄙㄜˋ', 蝸牛: 'ㄍㄨㄚ ㄋㄧㄡˊ', 危險: 'ㄨㄟˊ ㄒㄧㄢˇ',
  危機: 'ㄨㄟˊ ㄐㄧ', 知識: 'ㄓ ㄕˋ', 認識: 'ㄖㄣˋ ㄕˋ', 常識: 'ㄔㄤˊ ㄕˋ', 午餐: 'ㄨˇ ㄘㄢ', 晚餐: 'ㄨㄢˇ ㄘㄢ',
  早餐: 'ㄗㄠˇ ㄘㄢ', 台灣: 'ㄊㄞˊ ㄨㄢ', 臺灣: 'ㄊㄞˊ ㄨㄢ', 台北: 'ㄊㄞˊ ㄅㄟˇ', 臺北: 'ㄊㄞˊ ㄅㄟˇ',
  捷運: 'ㄐㄧㄝˊ ㄩㄣˋ', 夜市: 'ㄧㄝˋ ㄕˋ', 謝謝: 'ㄒㄧㄝˋ ㄒㄧㄝ˙', 先生: 'ㄒㄧㄢ ㄕㄥ', 小姐: 'ㄒㄧㄠˇ ㄐㄧㄝˇ',
  請問: 'ㄑㄧㄥˇ ㄨㄣˋ', 知道: 'ㄓ ㄉㄠˋ', 什麼: 'ㄕㄜˊ ㄇㄜ˙', 怎麼: 'ㄗㄜˇ ㄇㄜ˙', 這麼: 'ㄓㄜˋ ㄇㄜ˙',
};

/**
 * Single-character default Taiwanese Mandarin Zhuyin & Pinyin fallback dictionary.
 */
export const CHAR_ZHUYIN_DICT: Record<string, { zhuyin: string; pinyin: string; meaning?: string }> = {
  對: { zhuyin: 'ㄉㄨㄟˋ', pinyin: 'duì', meaning: 'correct / toward' }, 不: { zhuyin: 'ㄅㄨˋ', pinyin: 'bù', meaning: 'not / no' },
  起: { zhuyin: 'ㄑㄧˇ', pinyin: 'qǐ', meaning: 'to rise / up' }, 英: { zhuyin: 'ㄧㄥ', pinyin: 'yīng', meaning: 'English / hero' },
  文: { zhuyin: 'ㄨㄣˊ', pinyin: 'wén', meaning: 'language / writing' }, 會: { zhuyin: 'ㄏㄨㄟˋ', pinyin: 'huì', meaning: 'can / meeting' },
  說: { zhuyin: 'ㄕㄨㄛ', pinyin: 'shuō', meaning: 'to speak / say' }, 你: { zhuyin: 'ㄋㄧˇ', pinyin: 'nǐ', meaning: 'you' },
  嗎: { zhuyin: 'ㄇㄚ˙', pinyin: 'ma', meaning: 'question particle' }, 請: { zhuyin: 'ㄑㄧㄥˇ', pinyin: 'qǐng', meaning: 'please / invite' },
  問: { zhuyin: 'ㄨㄣˋ', pinyin: 'wèn', meaning: 'to ask' }, 我: { zhuyin: 'ㄨㄛˇ', pinyin: 'wǒ', meaning: 'I / me' },
  普: { zhuyin: 'ㄆㄨˇ', pinyin: 'pǔ', meaning: 'general' }, 通: { zhuyin: 'ㄊㄨㄥ', pinyin: 'tōng', meaning: 'common / through' },
  話: { zhuyin: 'ㄏㄨㄚˋ', pinyin: 'huà', meaning: 'speech / language' }, 一: { zhuyin: 'ㄧ', pinyin: 'yī', meaning: 'one' },
  點: { zhuyin: 'ㄉㄧㄢˇ', pinyin: 'diǎn', meaning: "o'clock / a bit / order" }, 兒: { zhuyin: 'ㄦ', pinyin: 'ér', meaning: 'retroflex suffix' },
  美: { zhuyin: 'ㄇㄟˇ', pinyin: 'měi', meaning: 'beautiful / America' }, 國: { zhuyin: 'ㄍㄨㄛˊ', pinyin: 'guó', meaning: 'country' },
  人: { zhuyin: 'ㄖㄣˊ', pinyin: 'rén', meaning: 'person' }, 是: { zhuyin: 'ㄕˋ', pinyin: 'shì', meaning: 'to be / yes' },
  中: { zhuyin: 'ㄓㄨㄥ', pinyin: 'zhōng', meaning: 'middle / Chinese' }, 呢: { zhuyin: 'ㄋㄜ˙', pinyin: 'ne', meaning: 'how about...?' },
  也: { zhuyin: 'ㄧㄝˇ', pinyin: 'yě', meaning: 'also' }, 先: { zhuyin: 'ㄒㄧㄢ', pinyin: 'xiān', meaning: 'first / Mr.' },
  生: { zhuyin: 'ㄕㄥ', pinyin: 'shēng', meaning: 'life / student' }, 好: { zhuyin: 'ㄏㄠˇ', pinyin: 'hǎo', meaning: 'good / well' },
  早: { zhuyin: 'ㄗㄠˇ', pinyin: 'zǎo', meaning: 'early / morning' }, 很: { zhuyin: 'ㄏㄣˇ', pinyin: 'hěn', meaning: 'very' },
  謝: { zhuyin: 'ㄒㄧㄝˋ', pinyin: 'xiè', meaning: 'thank' }, 小: { zhuyin: 'ㄒㄧㄠˇ', pinyin: 'xiǎo', meaning: 'small / Miss' },
  姐: { zhuyin: 'ㄐㄧㄝˇ', pinyin: 'jiě', meaning: 'older sister / Miss' }, 再: { zhuyin: 'ㄗㄞˋ', pinyin: 'zài', meaning: 'again' },
  見: { zhuyin: 'ㄐㄧㄢˋ', pinyin: 'jiàn', meaning: 'to see / meet' }, 在: { zhuyin: 'ㄗㄞˋ', pinyin: 'zài', meaning: 'at / in' },
  哪: { zhuyin: 'ㄋㄚˇ', pinyin: 'nǎ', meaning: 'which / where' }, 裡: { zhuyin: 'ㄌㄧˇ', pinyin: 'lǐ', meaning: 'inside / place' },
  這: { zhuyin: 'ㄓㄜˋ', pinyin: 'zhè', meaning: 'this' }, 那: { zhuyin: 'ㄋㄚˋ', pinyin: 'nà', meaning: 'that' },
  長: { zhuyin: 'ㄔㄤˊ', pinyin: 'cháng', meaning: 'long / grow' }, 安: { zhuyin: 'ㄢ', pinyin: 'ān', meaning: 'peace' },
  街: { zhuyin: 'ㄐㄧㄝ', pinyin: 'jiē', meaning: 'street' }, 路: { zhuyin: 'ㄌㄨˋ', pinyin: 'lù', meaning: 'road' },
  吃: { zhuyin: 'ㄔ', pinyin: 'chī', meaning: 'to eat' }, 喝: { zhuyin: 'ㄏㄜ', pinyin: 'hē', meaning: 'to drink' },
  飯: { zhuyin: 'ㄈㄢˋ', pinyin: 'fàn', meaning: 'rice / meal' }, 麵: { zhuyin: 'ㄇㄧㄢˋ', pinyin: 'miàn', meaning: 'noodles' },
  牛: { zhuyin: 'ㄋㄧㄡˊ', pinyin: 'niú', meaning: 'cattle / beef' }, 肉: { zhuyin: 'ㄖㄡˋ', pinyin: 'ròu', meaning: 'meat' },
  茶: { zhuyin: 'ㄔㄚˊ', pinyin: 'chá', meaning: 'tea' }, 水: { zhuyin: 'ㄕㄨㄟˇ', pinyin: 'shuǐ', meaning: 'water' },
  果: { zhuyin: 'ㄍㄨㄛˇ', pinyin: 'guǒ', meaning: 'fruit' }, 買: { zhuyin: 'ㄇㄞˇ', pinyin: 'mǎi', meaning: 'to buy' },
  賣: { zhuyin: 'ㄇㄞˋ', pinyin: 'mài', meaning: 'to sell' }, 錢: { zhuyin: 'ㄑㄧㄢˊ', pinyin: 'qián', meaning: 'money' },
  多: { zhuyin: 'ㄉㄨㄛ', pinyin: 'duō', meaning: 'many / much' }, 少: { zhuyin: 'ㄕㄠˇ', pinyin: 'shǎo', meaning: 'few / little' },
  塊: { zhuyin: 'ㄎㄨㄞˋ', pinyin: 'kuài', meaning: 'NT$ dollar / piece' }, 元: { zhuyin: 'ㄩㄢˊ', pinyin: 'yuán', meaning: 'NT$ dollar' },
  百: { zhuyin: 'ㄅㄞˇ', pinyin: 'bǎi', meaning: 'hundred' }, 千: { zhuyin: 'ㄑㄧㄢ', pinyin: 'qiān', meaning: 'thousand' },
  萬: { zhuyin: 'ㄨㄢˋ', pinyin: 'wàn', meaning: 'ten thousand' }, 折: { zhuyin: 'ㄓㄜˊ', pinyin: 'zhé', meaning: 'discount fold (八折=20% off)' },
  臺: { zhuyin: 'ㄊㄞˊ', pinyin: 'Tái', meaning: 'Taiwan' }, 灣: { zhuyin: 'ㄨㄢ', pinyin: 'wān', meaning: 'bay / Taiwan' },
  台: { zhuyin: 'ㄊㄞˊ', pinyin: 'Tái', meaning: 'Taiwan / platform' }, 北: { zhuyin: 'ㄅㄟˇ', pinyin: 'běi', meaning: 'north' },
  南: { zhuyin: 'ㄋㄢˊ', pinyin: 'nán', meaning: 'south' }, 東: { zhuyin: 'ㄉㄨㄥ', pinyin: 'dōng', meaning: 'east' },
  西: { zhuyin: 'ㄒㄧ', pinyin: 'xī', meaning: 'west' }, 捷: { zhuyin: 'ㄐㄧㄝˊ', pinyin: 'jié', meaning: 'MRT rapid transit' },
  運: { zhuyin: 'ㄩㄣˋ', pinyin: 'yùn', meaning: 'transport / luck' }, 站: { zhuyin: 'ㄓㄢˋ', pinyin: 'zhàn', meaning: 'station / stop' },
  車: { zhuyin: 'ㄔㄜ', pinyin: 'chē', meaning: 'vehicle / train' }, 票: { zhuyin: 'ㄆㄧㄠˋ', pinyin: 'piào', meaning: 'ticket / receipt' },
  今: { zhuyin: 'ㄐㄧㄣ', pinyin: 'jīn', meaning: 'today / now' }, 天: { zhuyin: 'ㄊㄧㄢ', pinyin: 'tiān', meaning: 'day / sky' },
  明: { zhuyin: 'ㄇㄧㄥˊ', pinyin: 'míng', meaning: 'tomorrow / bright' }, 昨: { zhuyin: 'ㄗㄨㄛˊ', pinyin: 'zuó', meaning: 'yesterday' },
  年: { zhuyin: 'ㄋㄧㄢˊ', pinyin: 'nián', meaning: 'year' }, 月: { zhuyin: 'ㄩㄝˋ', pinyin: 'yuè', meaning: 'month / moon' },
  日: { zhuyin: 'ㄖˋ', pinyin: 'rì', meaning: 'day / sun' }, 號: { zhuyin: 'ㄏㄠˋ', pinyin: 'hào', meaning: 'date / number' },
  星: { zhuyin: 'ㄒㄧㄥ', pinyin: 'xīng', meaning: 'star / week' }, 期: { zhuyin: 'ㄑㄧˊ', pinyin: 'qí', meaning: 'period (Taiwan 2nd tone)' },
  時: { zhuyin: 'ㄕˊ', pinyin: 'shí', meaning: 'time / hour' }, 候: { zhuyin: 'ㄏㄡˋ', pinyin: 'hòu', meaning: 'time (時候)' },
  分: { zhuyin: 'ㄈㄣ', pinyin: 'fēn', meaning: 'minute / cent' }, 鐘: { zhuyin: 'ㄓㄨㄥ', pinyin: 'zhōng', meaning: 'clock / bell' },
  現: { zhuyin: 'ㄒㄧㄢˋ', pinyin: 'xiàn', meaning: 'now / appear' }, 去: { zhuyin: 'ㄑㄩˋ', pinyin: 'qù', meaning: 'to go' },
  來: { zhuyin: 'ㄌㄞˊ', pinyin: 'lái', meaning: 'to come' }, 回: { zhuyin: 'ㄏㄨㄟˊ', pinyin: 'huí', meaning: 'to return' },
  想: { zhuyin: 'ㄒㄧㄤˇ', pinyin: 'xiǎng', meaning: 'would like / think' }, 要: { zhuyin: 'ㄧㄠˋ', pinyin: 'yào', meaning: 'want / need' },
  能: { zhuyin: 'ㄋㄥˊ', pinyin: 'néng', meaning: 'can / able' }, 可: { zhuyin: 'ㄎㄜˇ', pinyin: 'kě', meaning: 'can / may' },
  以: { zhuyin: 'ㄧˇ', pinyin: 'yǐ', meaning: 'can (可以)' }, 知: { zhuyin: 'ㄓ', pinyin: 'zhī', meaning: 'to know' },
  道: { zhuyin: 'ㄉㄠˋ', pinyin: 'dào', meaning: 'way / know' }, 懂: { zhuyin: 'ㄉㄨㄥˇ', pinyin: 'dǒng', meaning: 'understand' },
  看: { zhuyin: 'ㄎㄢˋ', pinyin: 'kàn', meaning: 'look / read / see' }, 聽: { zhuyin: 'ㄊㄧㄥ', pinyin: 'tīng', meaning: 'listen' },
  寫: { zhuyin: 'ㄒㄧㄝˇ', pinyin: 'xiě', meaning: 'write' }, 讀: { zhuyin: 'ㄉㄨˊ', pinyin: 'dú', meaning: 'read aloud / study' },
  學: { zhuyin: 'ㄒㄩㄝˊ', pinyin: 'xué', meaning: 'learn / study' }, 習: { zhuyin: 'ㄒㄧˊ', pinyin: 'xí', meaning: 'practice' },
  愛: { zhuyin: 'ㄞˋ', pinyin: 'ài', meaning: 'love' }, 喜: { zhuyin: 'ㄒㄧˇ', pinyin: 'xǐ', meaning: 'like / joyful' },
  歡: { zhuyin: 'ㄏㄨㄢ', pinyin: 'huān', meaning: 'like (喜歡)' }, 家: { zhuyin: 'ㄐㄧㄚ', pinyin: 'jiā', meaning: 'home / family' },
  店: { zhuyin: 'ㄉㄧㄢˋ', pinyin: 'diàn', meaning: 'shop / store' }, 館: { zhuyin: 'ㄍㄨㄢˇ', pinyin: 'guǎn', meaning: 'restaurant / hall' },
  宿: { zhuyin: 'ㄙㄨˋ', pinyin: 'sù', meaning: 'dorm / lodge' }, 舍: { zhuyin: 'ㄕㄜˋ', pinyin: 'shè', meaning: 'dormitory (宿舍)' },
  房: { zhuyin: 'ㄈㄤˊ', pinyin: 'fáng', meaning: 'room / house' }, 間: { zhuyin: 'ㄐㄧㄢ', pinyin: 'jiān', meaning: 'room / between' },
  高: { zhuyin: 'ㄍㄠ', pinyin: 'gāo', meaning: 'tall / high' }, 大: { zhuyin: 'ㄉㄚˋ', pinyin: 'dà', meaning: 'big / large' },
  熱: { zhuyin: 'ㄖㄜˋ', pinyin: 'rè', meaning: 'hot' }, 冷: { zhuyin: 'ㄌㄥˇ', pinyin: 'lěng', meaning: 'cold' },
  冰: { zhuyin: 'ㄅㄧㄥ', pinyin: 'bīng', meaning: 'ice' }, 甜: { zhuyin: 'ㄊㄧㄢˊ', pinyin: 'tián', meaning: 'sweet' },
  辣: { zhuyin: 'ㄌㄚˋ', pinyin: 'là', meaning: 'spicy' }, 鹹: { zhuyin: 'ㄒㄧㄢˊ', pinyin: 'xián', meaning: 'salty' },
  貴: { zhuyin: 'ㄍㄨㄟˋ', pinyin: 'guì', meaning: 'expensive' }, 新: { zhuyin: 'ㄒㄧㄣ', pinyin: 'xīn', meaning: 'new' },
  舊: { zhuyin: 'ㄐㄧㄡˋ', pinyin: 'jiù', meaning: 'old (things)' }, 快: { zhuyin: 'ㄎㄨㄞˋ', pinyin: 'kuài', meaning: 'fast / soon' },
  慢: { zhuyin: 'ㄇㄢˋ', pinyin: 'màn', meaning: 'slow' }, 遠: { zhuyin: 'ㄩㄢˇ', pinyin: 'yuǎn', meaning: 'far' },
  近: { zhuyin: 'ㄐㄧㄣˋ', pinyin: 'jìn', meaning: 'near' }, 左: { zhuyin: 'ㄗㄨㄛˇ', pinyin: 'zuǒ', meaning: 'left' },
  右: { zhuyin: 'ㄧㄡˋ', pinyin: 'yòu', meaning: 'right' }, 前: { zhuyin: 'ㄑㄧㄢˊ', pinyin: 'qián', meaning: 'front / ago' },
  後: { zhuyin: 'ㄏㄡˋ', pinyin: 'hòu', meaning: 'back / after' }, 上: { zhuyin: 'ㄕㄤˋ', pinyin: 'shàng', meaning: 'up / on' },
  下: { zhuyin: 'ㄒㄧㄚˋ', pinyin: 'xià', meaning: 'down / below' }, 外: { zhuyin: 'ㄨㄞˋ', pinyin: 'wài', meaning: 'outside / takeout (外帶)' },
  內: { zhuyin: 'ㄋㄟˋ', pinyin: 'nèi', meaning: 'inside / dine-in (內用)' }, 用: { zhuyin: 'ㄩㄥˋ', pinyin: 'yòng', meaning: 'use' },
  帶: { zhuyin: 'ㄉㄞˋ', pinyin: 'dài', meaning: 'bring / carry' }, 包: { zhuyin: 'ㄅㄠ', pinyin: 'bāo', meaning: 'bun / bag' },
  碗: { zhuyin: 'ㄨㄢˇ', pinyin: 'wǎn', meaning: 'bowl' }, 杯: { zhuyin: 'ㄅㄟ', pinyin: 'bēi', meaning: 'cup / glass' },
  盤: { zhuyin: 'ㄆㄢˊ', pinyin: 'pán', meaning: 'plate' }, 雙: { zhuyin: 'ㄕㄨㄤ', pinyin: 'shuāng', meaning: 'pair' },
  張: { zhuyin: 'ㄓㄤ', pinyin: 'zhāng', meaning: 'sheet / table classifier' }, 個: { zhuyin: 'ㄍㄜ˙', pinyin: 'ge', meaning: 'general classifier' },
  位: { zhuyin: 'ㄨㄟˋ', pinyin: 'wèi', meaning: 'polite person classifier' }, 本: { zhuyin: 'ㄅㄣˇ', pinyin: 'běn', meaning: 'book classifier' },
  零: { zhuyin: 'ㄌㄧㄥˊ', pinyin: 'líng', meaning: 'zero (0)' }, 二: { zhuyin: 'ㄦˋ', pinyin: 'èr', meaning: 'two (2)' },
  兩: { zhuyin: 'ㄌㄧㄤˇ', pinyin: 'liǎng', meaning: 'two (before classifier)' }, 三: { zhuyin: 'ㄙㄢ', pinyin: 'sān', meaning: 'three (3)' },
  四: { zhuyin: 'ㄙˋ', pinyin: 'sì', meaning: 'four (4)' }, 五: { zhuyin: 'ㄨˇ', pinyin: 'wǔ', meaning: 'five (5)' },
  六: { zhuyin: 'ㄌㄧㄡˋ', pinyin: 'liù', meaning: 'six (6)' }, 七: { zhuyin: 'ㄑㄧ', pinyin: 'qī', meaning: 'seven (7)' },
  八: { zhuyin: 'ㄅㄚ', pinyin: 'bā', meaning: 'eight (8)' }, 九: { zhuyin: 'ㄐㄧㄡˇ', pinyin: 'jiǔ', meaning: 'nine (9)' },
  十: { zhuyin: 'ㄕˊ', pinyin: 'shí', meaning: 'ten (10)' }, 第: { zhuyin: 'ㄉㄧˋ', pinyin: 'dì', meaning: 'ordinal prefix' },
  和: { zhuyin: 'ㄏㄢˋ', pinyin: 'hàn', meaning: 'and / with (Taiwan MOE)' }, 的: { zhuyin: 'ㄉㄜ˙', pinyin: 'de', meaning: 'possessive particle' },
  了: { zhuyin: 'ㄌㄜ˙', pinyin: 'le', meaning: 'aspect particle' }, 著: { zhuyin: 'ㄓㄜ˙', pinyin: 'zhe', meaning: 'continuous particle' },
  過: { zhuyin: 'ㄍㄨㄛˋ', pinyin: 'guò', meaning: 'experiential particle / cross' }, 吧: { zhuyin: 'ㄅㄚ˙', pinyin: 'ba', meaning: 'suggestion particle' },
  啦: { zhuyin: 'ㄌㄚ˙', pinyin: 'la', meaning: 'Taiwanese final particle' }, 喔: { zhuyin: 'ㄛ˙', pinyin: 'o', meaning: 'friendly Taiwan particle' },
  耶: { zhuyin: 'ㄧㄝ', pinyin: 'yē', meaning: 'excited Taiwan particle' }, 欸: { zhuyin: 'ㄟˇ', pinyin: 'ěi', meaning: 'hey / by the way (Taiwan)' },
  齁: { zhuyin: 'ㄏㄡ', pinyin: 'hōu', meaning: 'right? / I knew it! (Taiwan)' }, 囉: { zhuyin: 'ㄌㄨㄛ˙', pinyin: 'luo', meaning: 'then / of course (Taiwan)' },
  嘛: { zhuyin: 'ㄇㄚ˙', pinyin: 'ma', meaning: 'obviously (particle)' }, 還: { zhuyin: 'ㄏㄞˊ', pinyin: 'hái', meaning: 'still / also' },
  行: { zhuyin: 'ㄒㄧㄥˊ', pinyin: 'xíng', meaning: 'okay / walk' }, 得: { zhuyin: 'ㄉㄜ˙', pinyin: 'de', meaning: 'complement particle' },
  樂: { zhuyin: 'ㄌㄜˋ', pinyin: 'lè', meaning: 'happy' }, 數: { zhuyin: 'ㄕㄨˋ', pinyin: 'shù', meaning: 'number' },
  重: { zhuyin: 'ㄓㄨㄥˋ', pinyin: 'zhòng', meaning: 'heavy / important' }, 便: { zhuyin: 'ㄅㄧㄢˋ', pinyin: 'biàn', meaning: 'convenient' },
  覺: { zhuyin: 'ㄐㄩㄝˊ', pinyin: 'jué', meaning: 'feel' }, 傳: { zhuyin: 'ㄔㄨㄢˊ', pinyin: 'chuán', meaning: 'transmit' },
  假: { zhuyin: 'ㄐㄧㄚˋ', pinyin: 'jià', meaning: 'holiday' }, 彈: { zhuyin: 'ㄊㄢˊ', pinyin: 'tán', meaning: 'play / pluck' },
  乾: { zhuyin: 'ㄍㄢ', pinyin: 'gān', meaning: 'dry / clean' }, 幹: { zhuyin: 'ㄍㄢˋ', pinyin: 'gàn', meaning: 'trunk / do' },
  教: { zhuyin: 'ㄐㄧㄠˋ', pinyin: 'jiào', meaning: 'teach / education' }, 都: { zhuyin: 'ㄉㄡ', pinyin: 'dōu', meaning: 'all / both' },
  種: { zhuyin: 'ㄓㄨㄥˇ', pinyin: 'zhǒng', meaning: 'kind / seed' }, 相: { zhuyin: 'ㄒㄧㄤ', pinyin: 'xiāng', meaning: 'mutual' },
  空: { zhuyin: 'ㄎㄨㄥ', pinyin: 'kōng', meaning: 'sky / air' }, 切: { zhuyin: 'ㄑㄧㄝ', pinyin: 'qiē', meaning: 'cut' },
  發: { zhuyin: 'ㄈㄚ', pinyin: 'fā', meaning: 'send / issue' }, 髮: { zhuyin: 'ㄈㄚˇ', pinyin: 'fǎ', meaning: 'hair (Taiwan MOE)' },
  段: { zhuyin: 'ㄉㄨㄢˋ', pinyin: 'duàn', meaning: 'road section (段)' }, 巷: { zhuyin: 'ㄒㄧㄤˋ', pinyin: 'xiàng', meaning: 'lane / alley (巷)' },
  弄: { zhuyin: 'ㄋㄨㄥˋ', pinyin: 'nòng', meaning: 'sub-alley (弄)' }, 樓: { zhuyin: 'ㄌㄡˊ', pinyin: 'lóu', meaning: 'floor / building (樓)' },
  民: { zhuyin: 'ㄇㄧㄣˊ', pinyin: 'mín', meaning: 'people / Republic (民國)' }, 醫: { zhuyin: 'ㄧ', pinyin: 'yī', meaning: 'medical / doctor' },
  院: { zhuyin: 'ㄩㄢˋ', pinyin: 'yuàn', meaning: 'hospital / courtyard' }, 診: { zhuyin: 'ㄓㄣˇ', pinyin: 'zhěn', meaning: 'clinic (診所)' },
  所: { zhuyin: 'ㄙㄨㄛˇ', pinyin: 'suǒ', meaning: 'place / institute' }, 藥: { zhuyin: 'ㄧㄠˋ', pinyin: 'yào', meaning: 'medicine / pharmacy (藥局)' },
  局: { zhuyin: 'ㄐㄩˊ', pinyin: 'jú', meaning: 'bureau / pharmacy' }, 推: { zhuyin: 'ㄊㄨㄟ', pinyin: 'tuī', meaning: 'push' },
  拉: { zhuyin: 'ㄌㄚ', pinyin: 'lā', meaning: 'pull' }, 有: { zhuyin: 'ㄧㄡˇ', pinyin: 'yǒu', meaning: 'have' },
  沒: { zhuyin: 'ㄇㄟˊ', pinyin: 'méi', meaning: 'not have' }, 他: { zhuyin: 'ㄊㄚ', pinyin: 'tā', meaning: 'he / him' },
  她: { zhuyin: 'ㄊㄚ', pinyin: 'tā', meaning: 'she / her' }, 們: { zhuyin: 'ㄇㄣ˙', pinyin: 'men', meaning: 'plural suffix' },
};
