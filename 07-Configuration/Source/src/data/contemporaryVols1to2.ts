/**
 * FormosaStudio (FORM) — NTNU A Course in Contemporary Chinese (當代中文課程) Volumes 1 & 2 (Complete Lessons)
 * Volume 1: 15 Complete Lessons (CEFR A1 · TOCFL Novice 1–2)
 * Volume 2: 12 Complete Lessons (CEFR A2 · TOCFL Band A1)
 * Traces to: FORM-REQ-0003, FORM-REQ-0005, FORM-LL-004
 */

export interface ContemporaryLessonOverview {
  lesson: number;
  titleTraditional: string;
  titleZhuyin: string;
  titleEnglish: string;
  topic: string;
  grammarPoints: string[];
  culturalNote?: string;
  keyVocab?: { traditional: string; zhuyin: string; pinyin: string; english: string }[];
  sampleSentence: {
    traditional: string;
    zhuyin: string;
    english: string;
  };
}

export interface ContemporaryVolumeOverview {
  volume: number;
  titleTraditional: string;
  titleEnglish: string;
  cefrRange: string;
  tocflBand: string;
  focus: string;
  lessons: ContemporaryLessonOverview[];
}

export const CONTEMPORARY_VOLS_1_TO_2: ContemporaryVolumeOverview[] = [
  {
    volume: 1,
    titleTraditional: '當代中文課程 第一冊 (Volume 1)',
    titleEnglish: 'A Course in Contemporary Chinese — Volume 1 & Workbook 1',
    cefrRange: 'CEFR A1 · Novice',
    tocflBand: 'Novice 1–2 (準備級)',
    focus: 'Daily conversation, greetings, family, food, shopping, locations, time, transportation, renting, weather, and health in Taipei.',
    lessons: [
      {
        lesson: 1,
        titleTraditional: '第一課：歡迎你來臺灣！',
        titleZhuyin: 'ㄏㄨㄢ ㄧㄥˊ ㄋㄧˇ ㄌㄞˊ ㄊㄞˊ ㄨㄢ',
        titleEnglish: 'Welcome to Taiwan!',
        topic: '自我介紹 Introducing Myself',
        grammarPoints: ['A-not-A Questions (是不是 / 要不要)', 'Questions with 嗎 ma', 'Negation with 不 bù', 'State Verb Modifier 很 hěn', 'Contrastive 呢 ne'],
        culturalNote: 'Taiwanese Tea Culture (烏龍茶) & Tone Sandhi for 3rd Tone and 不.',
        keyVocab: [
          { traditional: '歡迎', zhuyin: 'ㄏㄨㄢ ㄧㄥˊ', pinyin: 'huānyíng', english: 'welcome' },
          { traditional: '臺灣', zhuyin: 'ㄊㄞˊ ㄨㄢ', pinyin: 'Táiwān', english: 'Taiwan' },
          { traditional: '請問', zhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ', pinyin: 'qǐngwèn', english: 'may I ask' },
        ],
        sampleSentence: { traditional: '請問你是陳月美小姐嗎？歡迎你們來臺灣！', zhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄋㄧˇ ㄕˋ ㄔㄣˊ ㄩㄝˋ ㄇㄟˇ ㄒㄧㄠˇ ㄐㄧㄝˇ ㄇㄚ˙ ㄏㄨㄢ ㄧㄥˊ ㄋㄧˇ ㄇㄣˊ ㄌㄞˊ ㄊㄞˊ ㄨㄢ', english: 'Excuse me, are you Miss Chen Yuemei? Welcome to Taiwan!' },
      },
      {
        lesson: 2,
        titleTraditional: '第二課：我的家人',
        titleZhuyin: 'ㄨㄛˇ ㄉㄜ˙ ㄐㄧㄚ ㄖㄣˊ',
        titleEnglish: 'My Family',
        topic: '家人 Family Members',
        grammarPoints: ['Possessive 的 de', 'Possessive 有 yǒu', 'Totality Adverb 都 dōu', 'Measure Words 個 ge and 張 zhāng'],
        culturalNote: 'Family Central to Taiwanese Culture & Tone Sandhi for 一 (ㄧ).',
        keyVocab: [
          { traditional: '家人', zhuyin: 'ㄐㄧㄚ ㄖㄣˊ', pinyin: 'jiārén', english: 'family members' },
          { traditional: '照片', zhuyin: 'ㄓㄠˋ ㄆㄧㄢˋ', pinyin: 'zhàopiàn', english: 'photograph' },
          { traditional: '姐姐', zhuyin: 'ㄐㄧㄝˇ ㄐㄧㄝ˙', pinyin: 'jiějie', english: 'older sister' },
        ],
        sampleSentence: { traditional: '我家有五個人，我和家人都很喜歡臺灣。', zhuyin: 'ㄨㄛˇ ㄐㄧㄚ ㄧㄡˇ ㄨˇ ㄍㄜ˙ ㄖㄣˊ ㄨㄛˇ ㄏㄢˋ ㄐㄧㄚ ㄖㄣˊ ㄉㄡ ㄏㄣˇ ㄒㄧˇ ㄏㄨㄢ ㄊㄞˊ ㄨㄢ', english: 'There are five people in my family, and my family and I all like Taiwan.' },
      },
      {
        lesson: 3,
        titleTraditional: '第三課：週末做什麼？',
        titleZhuyin: 'ㄓㄡ ㄇㄛˋ ㄗㄨㄛˋ ㄕㄜˊ ㄇㄜ˙',
        titleEnglish: 'What Are You Doing Over the Weekend?',
        topic: '嗜好與休閒 Hobbies & Weekend',
        grammarPoints: ['Placement of Time Words', 'Serial Verbs with 去 qù', 'Topic-Comment Sentences', 'Suggestions with 吧 ba'],
        culturalNote: 'Indoor Shrimp Fishing (釣蝦) in Taiwan & Character Components.',
        keyVocab: [
          { traditional: '週末', zhuyin: 'ㄓㄡ ㄇㄛˋ', pinyin: 'zhōumò', english: 'weekend' },
          { traditional: '電影', zhuyin: 'ㄉㄧㄢˋ ㄧㄥˇ', pinyin: 'diànyǐng', english: 'movie' },
          { traditional: '音樂', zhuyin: 'ㄧㄣ ㄩㄝˋ', pinyin: 'yīnyuè', english: 'music' },
        ],
        sampleSentence: { traditional: '週末我們一起去看電影、聽音樂，好吧？', zhuyin: 'ㄓㄡ ㄇㄛˋ ㄨㄛˇ ㄇㄣˊ ㄧˋ ㄑㄧˇ ㄑㄩˋ ㄎㄢˋ ㄉㄧㄢˋ ㄧㄥˇ ㄊㄧㄥ ㄧㄣ ㄩㄝˋ ㄏㄠˇ ㄅㄚ˙', english: 'Let’s go watch a movie and listen to music together this weekend, okay?' },
      },
      {
        lesson: 4,
        titleTraditional: '第四課：請問一共多少錢？',
        titleZhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄧˊ ㄍㄨㄥˋ ㄉㄨㄛ ㄕㄠˇ ㄑㄧㄢˊ',
        titleEnglish: 'Excuse Me, How Much Does That Cost in Total?',
        topic: '購物 Shopping & Prices',
        grammarPoints: ['Classifiers 塊 kuài, 杯 bēi, 支 zhī, 種 zhǒng', 'Preposition 幫 bāng', '太 tài … 了 le', 'Capability 能 néng'],
        culturalNote: '24-Hour Convenience Stores in Taiwan (便利商店 / 超商) & Uniform Invoices (統一發票).',
        keyVocab: [
          { traditional: '一共', zhuyin: 'ㄧˊ ㄍㄨㄥˋ', pinyin: 'yígòng', english: 'altogether / in total' },
          { traditional: '便宜', zhuyin: 'ㄆㄧㄢˊ ㄧˊ', pinyin: 'piányí', english: 'cheap / inexpensive' },
          { traditional: '手機', zhuyin: 'ㄕㄡˇ ㄐㄧ', pinyin: 'shǒujī', english: 'mobile phone' },
        ],
        sampleSentence: { traditional: '這支手機太貴了，請問那支便宜一點嗎？', zhuyin: 'ㄓㄜˋ ㄓ ㄕㄡˇ ㄐㄧ ㄊㄞˋ ㄍㄨㄟˋ ㄌㄜ˙ ㄑㄧㄥˇ ㄨㄣˋ ㄋㄚˋ ㄓ ㄆㄧㄢˊ ㄧˊ ㄧˋ ㄉㄧㄢˇ ㄇㄚ˙', english: 'This cellphone is too expensive; is that one a bit cheaper?' },
      },
      {
        lesson: 5,
        titleTraditional: '第五課：牛肉麵真好吃',
        titleZhuyin: 'ㄋㄧㄡˊ ㄖㄡˋ ㄇㄧㄢˋ ㄓㄣ ㄏㄠˇ ㄔ',
        titleEnglish: 'Beef Noodles Are Really Delicious',
        topic: '飲食 Food and Drink',
        grammarPoints: ['有一點 yǒu yìdiǎn (slightly)', 'Complement Marker 得 de', 'Acquired Skills 會 huì', 'Destination Marker 到 dào'],
        culturalNote: 'Night Market Street Vendors in Taiwan (夜市小吃) & Soup Dumplings (小籠包).',
        keyVocab: [
          { traditional: '牛肉麵', zhuyin: 'ㄋㄧㄡˊ ㄖㄡˋ ㄇㄧㄢˋ', pinyin: 'niúròumiàn', english: 'beef noodle soup' },
          { traditional: '小籠包', zhuyin: 'ㄒㄧㄠˇ ㄌㄨㄥˊ ㄅㄠ', pinyin: 'xiǎolóngbāo', english: 'soup dumplings' },
          { traditional: '微糖', zhuyin: 'ㄨㄟˊ ㄊㄤˊ', pinyin: 'wéitáng', english: 'quarter sugar (Taiwan MOE)' },
        ],
        sampleSentence: { traditional: '臺灣的牛肉麵真好吃，再來一杯微糖珍珠奶茶。', zhuyin: 'ㄊㄞˊ ㄨㄢ ㄉㄜ˙ ㄋㄧㄡˊ ㄖㄡˋ ㄇㄧㄢˋ ㄓㄣ ㄏㄠˇ ㄔ ㄗㄞˋ ㄌㄞˊ ㄧˋ ㄅㄟ ㄨㄟˊ ㄊㄤˊ ㄓㄣ ㄓㄨ ㄋㄞˇ ㄔㄚˊ', english: 'Taiwan beef noodles are delicious; bring another quarter-sweet boba milk tea.' },
      },
      {
        lesson: 6,
        titleTraditional: '第六課：他們學校在山上',
        titleZhuyin: 'ㄊㄚ ㄇㄣˊ ㄒㄩㄝˊ ㄒㄧㄠˋ ㄗㄞˋ ㄕㄢ ㄕㄤˋ',
        titleEnglish: 'Their School Is Up in the Mountains',
        topic: '位置與方向 Locations & Positions',
        grammarPoints: ['Locative Marker 在 zài', 'Existential 有 yǒu', 'Reduplication V(一)V', 'Location of an Activity'],
        culturalNote: 'Lucky Numbers (六, 八) & The Six Categories of Chinese Characters (六書).',
        keyVocab: [
          { traditional: '附近', zhuyin: 'ㄈㄨˋ ㄐㄧㄣˋ', pinyin: 'fùjìn', english: 'nearby / vicinity' },
          { traditional: '捷運站', zhuyin: 'ㄐㄧㄝˊ ㄩㄣˋ ㄓㄢˋ', pinyin: 'jiéyùnzhàn', english: 'MRT station' },
          { traditional: '銀行', zhuyin: 'ㄧㄣˊ ㄏㄤˊ', pinyin: 'yínháng', english: 'bank' },
        ],
        sampleSentence: { traditional: '捷運站附近有一家銀行和便利商店。', zhuyin: 'ㄐㄧㄝˊ ㄩㄣˋ ㄓㄢˋ ㄈㄨˋ ㄐㄧㄣˋ ㄧㄡˇ ㄧˋ ㄐㄧㄚ ㄧㄣˊ ㄏㄤˊ ㄏㄢˋ ㄅㄧㄢˋ ㄌㄧˋ ㄕㄤ ㄉㄧㄢˋ', english: 'Near the MRT station there is a bank and a convenience store.' },
      },
      {
        lesson: 7,
        titleTraditional: '第七課：早上九點去KTV',
        titleZhuyin: 'ㄗㄠˇ ㄕㄤˋ ㄐㄧㄡˇ ㄉㄧㄢˇ ㄑㄩˋ KTV',
        titleEnglish: 'Going to KTV at 9 AM',
        topic: '時間與日常作息 Time & Daily Routines',
        grammarPoints: ['Clock Time (點 / 分 / 半 / 刻)', 'From…To… (從…到…)', 'Before/After (以前 / 以後)', 'Modal 得 děi (must)'],
        culturalNote: '24-Hour KTV Culture in Taiwan & Morning Student Discounts.',
        keyVocab: [
          { traditional: '早上', zhuyin: 'ㄗㄠˇ ㄕㄤˋ', pinyin: 'zǎoshàng', english: 'morning' },
          { traditional: '睡覺', zhuyin: 'ㄕㄨㄟˋ ㄐㄧㄠˋ', pinyin: 'shuìjiào', english: 'to sleep' },
          { traditional: '得去', zhuyin: 'ㄉㄟˇ ㄑㄩˋ', pinyin: 'děi qù', english: 'must go' },
        ],
        sampleSentence: { traditional: '我明天早上八點得去學校上課。', zhuyin: 'ㄨㄛˇ ㄇㄧㄥˊ ㄊㄧㄢ ㄗㄠˇ ㄕㄤˋ ㄅㄚ ㄉㄧㄢˇ ㄉㄟˇ ㄑㄩˋ ㄒㄩㄝˊ ㄒㄧㄠˋ ㄕㄤˋ ㄎㄜˋ', english: 'I have to go to school for class at 8 AM tomorrow.' },
      },
      {
        lesson: 8,
        titleTraditional: '第八課：坐火車去臺南',
        titleZhuyin: 'ㄗㄨㄛˋ ㄏㄨㄛˇ ㄔㄜ ㄑㄩˋ ㄊㄞˊ ㄋㄢˊ',
        titleEnglish: 'Taking the Train to Tainan',
        topic: '交通與旅遊 Transportation & Travel',
        grammarPoints: ['Choice Conjunction 還是 háishì vs. 或者 huòzhě', 'Duration of Action', 'Going by Vehicle (坐捷運 / 搭高鐵)', '需要 xūyào'],
        culturalNote: 'Taiwan High Speed Rail (高鐵), TRA (臺鐵), and EasyCard (悠遊卡).',
        keyVocab: [
          { traditional: '高鐵', zhuyin: 'ㄍㄠ ㄊㄧㄝˇ', pinyin: 'gāotiě', english: 'High Speed Rail (HSR)' },
          { traditional: '悠遊卡', zhuyin: 'ㄧㄡ ㄧㄡˊ ㄎㄚˇ', pinyin: 'Yōuyóukǎ', english: 'EasyCard' },
          { traditional: '還是', zhuyin: 'ㄏㄞˊ ㄕˋ', pinyin: 'háishì', english: 'or (in questions)' },
        ],
        sampleSentence: { traditional: '你要坐高鐵還是坐火車去臺南旅行？', zhuyin: 'ㄋㄧˇ ㄧㄠˋ ㄗㄨㄛˋ ㄍㄠ ㄊㄧㄝˇ ㄏㄞˊ ㄕˋ ㄗㄨㄛˋ ㄏㄨㄛˇ ㄔㄜ ㄑㄩˋ ㄊㄞˊ ㄋㄢˊ ㄌㄩˇ ㄒㄧㄥˊ', english: 'Are you taking the HSR or the train to travel to Tainan?' },
      },
      {
        lesson: 9,
        titleTraditional: '第九課：放假去哪裡玩？',
        titleZhuyin: 'ㄈㄤˋ ㄐㄧㄚˋ ㄑㄩˋ ㄋㄚˇ ㄌㄧˇ ㄨㄢˊ',
        titleEnglish: 'Where Are You Going for the Holiday?',
        topic: '放假與休閒 Holidays & Vacation Plans',
        grammarPoints: ['Completed Action 了 le', 'Experiential 過 guo', 'Conditional 如果…就…', '時候 shíhòu Time Clauses'],
        culturalNote: 'Hualien Taroko Gorge (太魯閣) & Sun Moon Lake (日月潭).',
        keyVocab: [
          { traditional: '放假', zhuyin: 'ㄈㄤˋ ㄐㄧㄚˋ', pinyin: 'fàngjià', english: 'to have a holiday' },
          { traditional: '假期', zhuyin: 'ㄐㄧㄚˋ ㄑㄧˊ', pinyin: 'jiàqí', english: 'vacation period' },
          { traditional: '照相', zhuyin: 'ㄓㄠˋ ㄒㄧㄤˋ', pinyin: 'zhàoxiàng', english: 'take photos' },
        ],
        sampleSentence: { traditional: '這個星期五放假，我們去花蓮照相吧！', zhuyin: 'ㄓㄜˋ ㄍㄜ˙ ㄒㄧㄥ ㄑㄧˊ ㄨˇ ㄈㄤˋ ㄐㄧㄚˋ ㄨㄛˇ ㄇㄣˊ ㄑㄩˋ ㄏㄨㄚ ㄌㄧㄢˊ ㄓㄠˋ ㄒㄧㄤˋ ㄅㄚ˙', english: 'This Friday is a holiday; let’s go to Hualien and take photos!' },
      },
      {
        lesson: 10,
        titleTraditional: '第十課：臺灣的水果很好吃',
        titleZhuyin: 'ㄊㄞˊ ㄨㄢ ㄉㄜ˙ ㄕㄨㄟˇ ㄍㄨㄛˇ ㄏㄣˇ ㄏㄠˇ ㄔ',
        titleEnglish: 'Taiwanese Fruit Is Very Delicious',
        topic: '水果與比較 Comparisons & Seasons',
        grammarPoints: ['Comparison with 比 bǐ', '更 gèng and 最 zuì', '不但…而且… (not only…but also…)', '跟…一樣 (same as)'],
        culturalNote: 'Taiwan as the "Kingdom of Fruits" (芒果, 蓮霧, 芭樂, 鳳梨).',
        keyVocab: [
          { traditional: '水果', zhuyin: 'ㄕㄨㄟˇ ㄍㄨㄛˇ', pinyin: 'shuǐguǒ', english: 'fruit' },
          { traditional: '切水果', zhuyin: 'ㄑㄧㄝ ㄕㄨㄟˇ ㄍㄨㄛˇ', pinyin: 'qiē shuǐguǒ', english: 'slice fruit' },
          { traditional: '好吃', zhuyin: 'ㄏㄠˇ ㄔ', pinyin: 'hǎochī', english: 'delicious' },
        ],
        sampleSentence: { traditional: '臺灣的芒果不但很甜，而且比蘋果更好吃。', zhuyin: 'ㄊㄞˊ ㄨㄢ ㄉㄜ˙ ㄇㄤˊ ㄍㄨㄛˇ ㄅㄨˊ ㄉㄢˋ ㄏㄣˇ ㄊㄧㄢˊ ㄦˊ ㄑㄧㄝˇ ㄅㄧˇ ㄆㄧㄥˊ ㄍㄨㄛˇ ㄍㄥˋ ㄏㄠˇ ㄔ', english: 'Taiwan mangoes are not only sweet, but even tastier than apples.' },
      },
      {
        lesson: 11,
        titleTraditional: '第十一課：我要租房子',
        titleZhuyin: 'ㄨㄛˇ ㄧㄠˋ ㄗㄨ ㄈㄤˊ ㄗ˙',
        titleEnglish: 'I Want to Rent an Apartment',
        topic: '租屋與居住 Renting & Housing',
        grammarPoints: ['Directional Complements (上來 / 下去)', 'Existential Verb + 著 zhe', '離 lí (distance from)', '房租與押金'],
        culturalNote: 'Renting a Studio (套房) vs. Shared Apartment (雅房) near Taipei Universities.',
        keyVocab: [
          { traditional: '乾淨', zhuyin: 'ㄍㄢ ㄐㄧㄥˋ', pinyin: 'gānjìng', english: 'clean' },
          { traditional: '方便', zhuyin: 'ㄈㄤ ㄅㄧㄢˋ', pinyin: 'fāngbiàn', english: 'convenient' },
          { traditional: '研究', zhuyin: 'ㄧㄢˊ ㄐㄧㄡˋ', pinyin: 'yánjiù', english: 'research / study' },
        ],
        sampleSentence: { traditional: '這間房間很乾淨，離研究所跟捷運站都很近。', zhuyin: 'ㄓㄜˋ ㄐㄧㄢ ㄈㄤˊ ㄐㄧㄢ ㄏㄣˇ ㄍㄢ ㄐㄧㄥˋ ㄌㄧˊ ㄧㄢˊ ㄐㄧㄡˋ ㄙㄨㄛˇ ㄍㄣ ㄐㄧㄝˊ ㄩㄣˋ ㄓㄢˋ ㄉㄡ ㄏㄣˇ ㄐㄧㄣˋ', english: 'This room is clean and close to both the graduate institute and the MRT.' },
      },
      {
        lesson: 12,
        titleTraditional: '第十二課：你在臺灣學多久中文？',
        titleZhuyin: 'ㄋㄧˇ ㄗㄞˋ ㄊㄞˊ ㄨㄢ ㄒㄩㄝˊ ㄉㄨㄛ ㄐㄧㄡˇ ㄓㄨㄥ ㄨㄣˊ',
        titleEnglish: 'How Long Will You Study Chinese in Taiwan?',
        topic: '留學計畫 Study Plans & Duration',
        grammarPoints: ['Duration of Non-Action (多久)', '為 wèi / 為了 wèile (in order to)', '先…再… (first…then…)', '快…了 (about to)'],
        culturalNote: 'NTNU Mandarin Training Center (師大國語教學中心) & Scholarship Programs.',
        keyVocab: [
          { traditional: '教書', zhuyin: 'ㄐㄧㄠ ㄕㄨ', pinyin: 'jiāoshū', english: 'teach school' },
          { traditional: '教育', zhuyin: 'ㄐㄧㄠˋ ㄩˋ', pinyin: 'jiàoyù', english: 'education' },
          { traditional: '會計', zhuyin: 'ㄎㄨㄞˋ ㄐㄧˋ', pinyin: 'kuàijì', english: 'accounting' },
        ],
        sampleSentence: { traditional: '我先在臺灣學一年中文，以後想教書或做會計。', zhuyin: 'ㄨㄛˇ ㄒㄧㄢ ㄗㄞˋ ㄊㄞˊ ㄨㄢ ㄒㄩㄝˊ ㄧˋ ㄋㄧㄢˊ ㄓㄨㄥ ㄨㄣˊ ㄧˇ ㄏㄡˋ ㄒㄧㄤˇ ㄐㄧㄠ ㄕㄨ ㄏㄨㄛˋ ㄗㄨㄛˋ ㄎㄨㄞˋ ㄐㄧˋ', english: 'I will first study Chinese in Taiwan for a year, and later teach or work in accounting.' },
      },
      {
        lesson: 13,
        titleTraditional: '第十三課：生日快樂',
        titleZhuyin: 'ㄕㄥ ㄖˋ ㄎㄨㄞˋ ㄌㄜˋ',
        titleEnglish: 'Happy Birthday',
        topic: '送禮與慶祝 Gifts & Celebrations',
        grammarPoints: ['是…的 shì…de Focus Construction', '把 bǎ Disposal Construction', '給 gěi as Dative Marker', '一…就… (as soon as)'],
        culturalNote: 'Birthday Pork Knuckle Noodles (豬腳麵線) & Gift Etiquette in Taiwan.',
        keyVocab: [
          { traditional: '快樂', zhuyin: 'ㄎㄨㄞˋ ㄌㄜˋ', pinyin: 'kuàilè', english: 'happy' },
          { traditional: '還書', zhuyin: 'ㄏㄨㄢˊ ㄕㄨ', pinyin: 'huánshū', english: 'return a book' },
          { traditional: '長輩', zhuyin: 'ㄓㄤˇ ㄅㄟˋ', pinyin: 'zhǎngbèi', english: 'elders' },
        ],
        sampleSentence: { traditional: '我把借來的書還給圖書館以後，就去幫長輩慶生。', zhuyin: 'ㄨㄛˇ ㄅㄚˇ ㄐㄧㄝˋ ㄌㄞˊ ㄉㄜ˙ ㄕㄨ ㄏㄨㄢˊ ㄍㄟˇ ㄊㄨˊ ㄕㄨ ㄍㄨㄢˇ ㄧˇ ㄏㄡˋ ㄐㄧㄡˋ ㄑㄩˋ ㄅㄤ ㄓㄤˇ ㄅㄟˋ ㄑㄧㄥˋ ㄕㄥ', english: 'After returning the borrowed books to the library, I went to celebrate my elder’s birthday.' },
      },
      {
        lesson: 14,
        titleTraditional: '第十四課：天氣這麼冷！',
        titleZhuyin: 'ㄊㄧㄢ ㄑㄧˋ ㄓㄜˋ ㄇㄜ˙ ㄌㄥˇ',
        titleEnglish: 'The Weather Is So Cold!',
        topic: '天氣與季節 Weather & Typhoons',
        grammarPoints: ['Change of State 了 le', '越來越… (more and more)', '又…又… (both A and B)', '比起來 (compared with)'],
        culturalNote: 'Subtropical Taiwan Winters, Plum Rain (梅雨), and Typhoon Days Off (颱風假).',
        keyVocab: [
          { traditional: '空氣', zhuyin: 'ㄎㄨㄥ ㄑㄧˋ', pinyin: 'kōngqì', english: 'air' },
          { traditional: '颱風假', zhuyin: 'ㄊㄞˊ ㄈㄥ ㄐㄧㄚˋ', pinyin: 'táifēngjià', english: 'typhoon day off' },
          { traditional: '暖和', zhuyin: 'ㄋㄨㄢˇ ㄏㄨㄛ˙', pinyin: 'nuǎnhuo', english: 'warm and cozy' },
        ],
        sampleSentence: { traditional: '臺北冬常常下雨，台南的天氣比較暖和。', zhuyin: 'ㄊㄞˊ ㄅㄟˇ ㄉㄨㄥ ㄊㄧㄢ ㄔㄤˊ ㄔㄤˊ ㄒㄧㄚˋ ㄩˇ ㄊㄞˊ ㄋㄢˊ ㄉㄜ˙ ㄊㄧㄢ ㄑㄧˋ ㄅㄧˇ ㄐㄧㄠˋ ㄋㄨㄢˇ ㄏㄨㄛ˙', english: 'Taipei winters are often rainy; Tainan weather is warmer.' },
      },
      {
        lesson: 15,
        titleTraditional: '第十五課：我很不舒服',
        titleZhuyin: 'ㄨㄛˇ ㄏㄣˇ ㄅㄨˋ ㄕㄨ ㄈㄨ˙',
        titleEnglish: 'I Feel Very Unwell',
        topic: '看病與健保 Seeing a Doctor & NHI Clinic',
        grammarPoints: ['Potential Complements (睡不著 / 吃不下)', '多 / 少 + Verb (take more rest)', '別 bié Imperative', 'Reduplicated Adjectives'],
        culturalNote: 'Taiwan National Health Insurance (全民健保卡) & Neighborhood Clinics (診所).',
        keyVocab: [
          { traditional: '診所', zhuyin: 'ㄓㄣˇ ㄙㄨㄛˇ', pinyin: 'zhěnsuǒ', english: 'clinic' },
          { traditional: '睡著', zhuyin: 'ㄕㄨㄟˋ ㄓㄠˊ', pinyin: 'shuìzháo', english: 'fall asleep' },
          { traditional: '著急', zhuyin: 'ㄓㄠˊ ㄐㄧˊ', pinyin: 'zháojí', english: 'anxious / worried' },
        ],
        sampleSentence: { traditional: '昨天晚上我發燒睡不著，早上趕快去診所看醫生。', zhuyin: 'ㄗㄨㄛˊ ㄊㄧㄢ ㄨㄢˇ ㄕㄤˋ ㄨㄛˇ ㄈㄚ ㄕㄠ ㄕㄨㄟˋ ㄅㄨˋ ㄓㄠˊ ㄗㄠˇ ㄕㄤˋ ㄍㄢˇ ㄎㄨㄞˋ ㄑㄩˋ ㄓㄣˇ ㄙㄨㄛˇ ㄎㄢˋ ㄧ ㄕㄥ', english: 'Last night I had a fever and couldn’t fall asleep, so I went to a clinic this morning.' },
      },
    ],
  },
  {
    volume: 2,
    titleTraditional: '當代中文課程 第二冊 (Volume 2)',
    titleEnglish: 'A Course in Contemporary Chinese — Volume 2 & Workbook 2',
    cefrRange: 'CEFR A2 · Basic',
    tocflBand: 'Band A · Level 1 (入門級)',
    focus: 'Directions, MRT transit, part-time work, Taiwanese weddings, night markets, garbage trucks, kung fu, dumplings, and Lunar New Year.',
    lessons: [
      {
        lesson: 1,
        titleTraditional: '第一課：請問到師大怎麼走？',
        titleZhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄉㄠˋ ㄕ ㄉㄚˋ ㄗㄜˇ ㄇㄜ˙ ㄗㄡˇ',
        titleEnglish: 'Excuse Me, How Do I Get to NTNU?',
        topic: '問路與方向 Asking Directions & Landmarks',
        grammarPoints: ['往前走 / 往右轉 (walk straight / turn right)', '一…就… (as soon as)', '對面 / 旁邊 / 中間'],
        culturalNote: 'Taipei Road Sections (段), Lanes (巷), and Alleys (弄) Addressing System.',
        sampleSentence: { traditional: '從捷運古亭站出來，往和平東路走五分鐘就到了。', zhuyin: 'ㄘㄨㄥˊ ㄐㄧㄝˊ ㄩㄣˋ ㄍㄨˇ ㄊㄧㄥˊ ㄓㄢˋ ㄔㄨ ㄌㄞˊ ㄨㄤˇ ㄏㄜˊ ㄆㄧㄥˊ ㄉㄨㄥ ㄌㄨˋ ㄗㄡˇ ㄨˇ ㄈㄣ ㄓㄨㄥ ㄐㄧㄡˋ ㄉㄠˋ ㄌㄜ˙', english: 'Exit Guting MRT Station, walk toward Heping East Road for 5 minutes and you are there.' },
      },
      {
        lesson: 2,
        titleTraditional: '第二課：還是坐捷運吧！',
        titleZhuyin: 'ㄏㄞˊ ㄕˋ ㄗㄨㄛˋ ㄐㄧㄝˊ ㄩㄣˋ ㄅㄚ˙',
        titleEnglish: 'Let’s Take the MRT Instead!',
        topic: '都市交通 Urban Commuting & YouBike',
        grammarPoints: ['與其…不如… / 還是…吧', '一面…一面…', 'Resultative Complements (趕上 / 塞車)'],
        culturalNote: 'Taipei MRT Etiquette (No food/drink past the yellow line, Priority Seats 博愛座) & YouBike.',
        sampleSentence: { traditional: '上班時間容易塞車，我們還是坐捷運比較快。', zhuyin: 'ㄕㄤˋ ㄅㄢ ㄕˊ ㄐㄧㄢ ㄖㄨㄥˊ ㄧˋ ㄙㄞ ㄔㄜ ㄨㄛˇ ㄇㄣˊ ㄏㄞˊ ㄕˋ ㄗㄨㄛˋ ㄐㄧㄝˊ ㄩㄣˋ ㄅㄧˇ ㄐㄧㄠˋ ㄎㄨㄞˋ', english: 'Traffic jams are common during rush hour; let’s take the MRT instead.' },
      },
      {
        lesson: 3,
        titleTraditional: '第三課：我想找打工',
        titleZhuyin: 'ㄨㄛˇ ㄒㄧㄤˇ ㄓㄠˇ ㄉㄚˇ ㄍㄨㄥ',
        titleEnglish: 'I Want to Find a Part-Time Job',
        topic: '打工與實習 Part-Time Work & Tutoring',
        grammarPoints: ['除了…以外，還… (besides)', '對…有興趣 (interested in)', '能幹與專長'],
        culturalNote: 'Language Exchange (語言交換) and Work Permits for International Students in Taiwan.',
        sampleSentence: { traditional: '除了教英文以外，我的專長是彈鋼琴和會計。', zhuyin: 'ㄔㄨˊ ㄌㄜ˙ ㄐㄧㄠ ㄧㄥ ㄨㄣˊ ㄧˇ ㄨㄞˋ ㄨㄛˇ ㄉㄜ˙ ㄓㄨㄢ ㄔㄤˊ ㄕˋ ㄊㄢˊ ㄍㄤ ㄑㄧㄣˊ ㄏㄢˋ ㄎㄨㄞˋ ㄐㄧˋ', english: 'Besides teaching English, my specialties are playing piano and accounting.' },
      },
      {
        lesson: 4,
        titleTraditional: '第四課：參加喜宴',
        titleZhuyin: 'ㄘㄢ ㄐㄧㄚ ㄒㄧˇ ㄧㄢˋ',
        titleEnglish: 'Attending a Taiwanese Wedding Banquet',
        topic: '婚禮與禮俗 Wedding Banquets & Red Envelopes',
        grammarPoints: ['Passive 被 bèi Construction', '連…都/也… (even)', 'Red Envelope (紅包) Etiquette'],
        culturalNote: 'Outdoor Roadside Banquets (辦桌) vs. Hotel Wedding Feasts in Taiwan.',
        sampleSentence: { traditional: '去參加台灣朋友的喜宴，別忘了準備紅包。', zhuyin: 'ㄑㄩˋ ㄘㄢ ㄐㄧㄚ ㄊㄞˊ ㄨㄢ ㄆㄥˊ ㄧㄡˇ ㄉㄜ˙ ㄒㄧˇ ㄧㄢˋ ㄅㄧㄝˊ ㄨㄤˋ ㄌㄜ˙ ㄓㄨㄣˇ ㄅㄟˋ ㄏㄨㄥˊ ㄅㄠ', english: 'When attending a Taiwanese friend’s wedding banquet, don’t forget to prepare a red envelope.' },
      },
      {
        lesson: 5,
        titleTraditional: '第五課：臺灣的夜市與美食',
        titleZhuyin: 'ㄊㄞˊ ㄨㄢ ㄉㄜ˙ ㄧㄝˋ ㄕˋ ㄩˇ ㄇㄟˇ ㄕˊ',
        titleEnglish: 'Taiwan’s Night Markets & Street Delicacies',
        topic: '夜市文化 Night Market Culture',
        grammarPoints: ['越…越… (the more…the more)', '不管…都… (no matter what)', '聞起來 / 吃起來 (sensory complements)'],
        culturalNote: 'Stinky Tofu (臭豆腐), Oyster Omelet (蚵仔煎), and Shilin/Raohe Night Markets.',
        sampleSentence: { traditional: '臭豆腐聞起來味道很重，可是吃起來又香又脆。', zhuyin: 'ㄔㄡˋ ㄉㄡˋ ㄈㄨ˙ ㄨㄣˊ ㄑㄧˇ ㄌㄞˊ ㄨㄟˋ ㄉㄠˋ ㄏㄣˇ ㄓㄨㄥˋ ㄎㄜˇ ㄕˋ ㄔ ㄑㄧˇ ㄌㄞˊ ㄧㄡˋ ㄒㄧㄤ ㄧㄡˋ ㄘㄨㄟˋ', english: 'Stinky tofu smells strong, but tastes fragrant and crispy.' },
      },
      {
        lesson: 6,
        titleTraditional: '第六課：租套房還是住校？',
        titleZhuyin: 'ㄗㄨ ㄊㄠˋ ㄈㄤˊ ㄏㄞˊ ㄕˋ ㄓㄨˋ ㄒㄧㄠˋ',
        titleEnglish: 'Renting a Suite or Living on Campus?',
        topic: '住宿選擇 Housing Tradeoffs & Utilities',
        grammarPoints: ['一方面…另一方面…', '只要…就… (as long as)', '把…弄丟 / 整理乾淨'],
        culturalNote: 'Electricity Meters (一度電) & Tenant Contracts in Taipei.',
        sampleSentence: { traditional: '只要把房間整理乾淨，住校其實很方便又省錢。', zhuyin: 'ㄓˇ ㄧㄠˋ ㄅㄚˇ ㄈㄤˊ ㄐㄧㄢ ㄓㄥˇ ㄌㄧˇ ㄍㄢ ㄐㄧㄥˋ ㄓㄨˋ ㄒㄧㄠˋ ㄑㄧˊ ㄕˊ ㄏㄣˇ ㄈㄤ ㄅㄧㄢˋ ㄧㄡˋ ㄕㄥˇ ㄑㄧㄢˊ', english: 'As long as you keep the room clean, living on campus is convenient and saves money.' },
      },
      {
        lesson: 7,
        titleTraditional: '第七課：垃圾車來了！',
        titleZhuyin: 'ㄌㄜˋ ㄙㄜˋ ㄔㄜ ㄌㄞˊ ㄌㄜ˙',
        titleEnglish: 'The Musical Garbage Truck Is Here!',
        topic: '環保與回收 Trash & Recycling in Taiwan',
        grammarPoints: ['非…不可 (must)', '順便 shùnbiàn (conveniently on the way)', '分類回收'],
        culturalNote: 'Taiwan’s Musical Yellow Garbage Trucks playing "Für Elise" & "A Maiden’s Prayer" (`垃圾 = ㄌㄜˋ ㄙㄜˋ`).',
        sampleSentence: { traditional: '聽到音樂就知道垃圾車來了，快去倒垃圾吧！', zhuyin: 'ㄊㄧㄥ ㄉㄠˋ ㄧㄣ ㄩㄝˋ ㄐㄧㄡˋ ㄓ ㄉㄠˋ ㄌㄜˋ ㄙㄜˋ ㄔㄜ ㄌㄞˊ ㄌㄜ˙ ㄎㄨㄞˋ ㄑㄩˋ ㄉㄠˋ ㄌㄜˋ ㄙㄜˋ ㄅㄚ˙', english: 'Hearing the music tells you the garbage truck is here—hurry and take out the trash!' },
      },
      {
        lesson: 8,
        titleTraditional: '第八課：學功夫與太極拳',
        titleZhuyin: 'ㄒㄩㄝˊ ㄍㄨㄥ ㄈㄨ ㄩˇ ㄊㄞˋ ㄐㄧˊ ㄑㄩㄢˊ',
        titleEnglish: 'Learning Kung Fu & Tai Chi in the Park',
        topic: '運動與休閒 Morning Park Exercises',
        grammarPoints: ['看起來 (appears to be)', '剛開始…後來…', '一天比一天進步'],
        culturalNote: 'Early Morning Tai Chi and Badminton Groups in Taipei’s Daan Forest Park (大安森林公園).',
        sampleSentence: { traditional: '打太極拳看起來很慢，其實對身體健康很有幫助。', zhuyin: 'ㄉㄚˇ ㄊㄞˋ ㄐㄧˊ ㄑㄩㄢˊ ㄎㄢˋ ㄑㄧˇ ㄌㄞˊ ㄏㄣˇ ㄇㄢˋ ㄑㄧˊ ㄕˊ ㄉㄨㄟˋ ㄕㄣ ㄊㄧˇ ㄐㄧㄢˋ ㄎㄤ ㄏㄣˇ ㄧㄡˇ ㄅㄤ ㄓㄨˋ', english: 'Practicing Tai Chi looks slow, but is actually very helpful for health.' },
      },
      {
        lesson: 9,
        titleTraditional: '第九課：一起包水餃',
        titleZhuyin: 'ㄧˋ ㄑㄧˇ ㄅㄠ ㄕㄨㄟˇ ㄐㄧㄠˇ',
        titleEnglish: 'Making Dumplings Together',
        topic: '烹飪與聚餐 Cooking & Gathering',
        grammarPoints: ['先把…切好，再… (procedural sequence)', '夠 / 不夠', '親切又好客'],
        culturalNote: 'Taiwanese Hospitality (`好客 ㄏㄠˋ ㄎㄜˋ`) and Homemade Cabbage/Chive Dumplings.',
        sampleSentence: { traditional: '台灣朋友非常好客，週末請我們去家裡切菜、包水餃。', zhuyin: 'ㄊㄞˊ ㄨㄢ ㄆㄥˊ ㄧㄡˇ ㄈㄟ ㄔㄤˊ ㄏㄠˋ ㄎㄜˋ ㄓㄡ ㄇㄛˋ ㄑㄧㄥˇ ㄨㄛˇ ㄇㄣˊ ㄑㄩˋ ㄐㄧㄚ ㄌㄧˇ ㄑㄧㄝ ㄘㄞˋ ㄅㄠ ㄕㄨㄟˇ ㄐㄧㄠˇ', english: 'Taiwanese friends are very hospitable and invited us home to chop vegetables and wrap dumplings.' },
      },
      {
        lesson: 10,
        titleTraditional: '第十課：臺灣的風景名勝',
        titleZhuyin: 'ㄊㄞˊ ㄨㄢ ㄉㄜ˙ ㄈㄥ ㄐㄧㄥˇ ㄇㄧㄥˊ ㄕㄥˋ',
        titleEnglish: 'Taiwan’s Scenic Attractions',
        topic: '自然景觀 Alishan, Sun Moon Lake & Kenting',
        grammarPoints: ['到處都是… (everywhere is)', '值得 zhídé (worth doing)', '印象深刻'],
        culturalNote: 'Alishan Sunrise & Sea of Clouds (阿里山日出雲海) and Kenting National Park.',
        sampleSentence: { traditional: '阿里山的日出跟太魯閣的峽谷都非常值得去看一看。', zhuyin: 'ㄚ ㄌㄧˇ ㄕㄢ ㄉㄜ˙ ㄖˋ ㄔㄨ ㄍㄣ ㄊㄞˋ ㄌㄨˇ ㄍㄜˊ ㄉㄜ˙ ㄒㄧㄚˊ ㄍㄨˇ ㄉㄡ ㄈㄟ ㄔㄤˊ ㄓˊ ㄉㄜˊ ㄑㄩˋ ㄎㄢˋ ㄧˊ ㄎㄢˋ', english: 'Both the Alishan sunrise and Taroko Gorge are well worth visiting.' },
      },
      {
        lesson: 11,
        titleTraditional: '第十一課：健康與養生',
        titleZhuyin: 'ㄐㄧㄢˋ ㄎㄤ ㄩˇ ㄧㄤˇ ㄕㄥ',
        titleEnglish: 'Health & Wellness Habits',
        topic: '養生與飲食 Healthy Living & Traditional Medicine',
        grammarPoints: ['盡量 jìnliàng (as much as possible)', '少油少鹽', '為了健康著想'],
        culturalNote: 'Traditional Chinese Medicine (中醫調理) and Warm Water / Herbal Soups in Taiwan.',
        sampleSentence: { traditional: '為了身體健康，醫生建議我們少喝冰飲料、多運動。', zhuyin: 'ㄨㄟˋ ㄌㄜ˙ ㄕㄣ ㄊㄧˇ ㄐㄧㄢˋ ㄎㄤ ㄧ ㄕㄥ ㄐㄧㄢˋ ㄧˋ ㄨㄛˇ ㄇㄣˊ ㄕㄠˇ ㄏㄜ ㄅㄧㄥ ㄧㄣˇ ㄌㄧㄠˋ ㄉㄨㄛ ㄩㄣˋ ㄉㄨㄥˋ', english: 'For good health, the doctor recommends drinking fewer iced drinks and exercising more.' },
      },
      {
        lesson: 12,
        titleTraditional: '第十二課：過春節與元宵節',
        titleZhuyin: 'ㄍㄨㄛˋ ㄔㄨㄣ ㄐㄧㄝˊ ㄩˇ ㄩㄢˊ ㄒㄧㄠ ㄐㄧㄝˊ',
        titleEnglish: 'Celebrating Lunar New Year & the Lantern Festival',
        topic: '傳統節日 Traditional Festivals in Taiwan',
        grammarPoints: ['每當…的時候', '象徵 xiàngzhēng (symbolize)', '團圓飯與放天燈'],
        culturalNote: 'New Year’s Eve Reunion Dinner (年夜飯) and Pingxi Sky Lanterns (平溪放天燈).',
        sampleSentence: { traditional: '過春節的時候，全家人都會回家吃團圓飯、領紅包。', zhuyin: 'ㄍㄨㄛˋ ㄔㄨㄣ ㄐㄧㄝˊ ㄉㄜ˙ ㄕˊ ㄏㄡˋ ㄑㄩㄢˊ ㄐㄧㄚ ㄖㄣˊ ㄉㄡ ㄏㄨㄟˋ ㄏㄨㄟˊ ㄐㄧㄚ ㄔ ㄊㄨㄢˊ ㄩㄢˊ ㄈㄢˋ ㄌㄧㄥˇ ㄏㄨㄥˊ ㄅㄠ', english: 'During Lunar New Year, the whole family returns home for the reunion dinner and red envelopes.' },
      },
    ],
  },
];
