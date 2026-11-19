/**
 * FormosaStudio (FORM) — Phase 2 Graded Stories (TOCFL Novice 1 – Band B2) & Spoken/Written Register Bridge
 * Traces to: FORM-REQ-0006, FORM-REQ-0008, FORM-REQ-0005, FORM-DEP-TPA-002
 */

import { TocflBand } from './vocabularyCatalog.ts';

export interface StoryParagraph {
  traditional: string;
  english: string;
}

export interface StoryComprehensionQuestion {
  id: string;
  questionTraditional: string;
  questionEnglish: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GradedStory {
  id: string;
  titleTraditional: string;
  titleEnglish: string;
  tocflBand: TocflBand;
  cefr: 'A1' | 'A2' | 'B1' | 'B2';
  locationTag: string;
  culturalSummary: string;
  keyPolyphones: { word: string; zhuyin: string; note: string }[];
  paragraphs: StoryParagraph[];
  questions: StoryComprehensionQuestion[];
}

export interface RegisterBridgePair {
  id: string;
  spoken: string;
  spokenZhuyin: string;
  written: string;
  writtenZhuyin: string;
  english: string;
  category: 'connector' | 'verb' | 'adverb' | 'preposition';
  spokenSentence: string;
  writtenSentence: string;
  sentenceEnglish: string;
  drillPromptTraditional: string; // Contains ____ where written/spoken target goes
  drillTargetRegister: 'written' | 'spoken';
  drillOptions: string[];
  drillAnswer: string;
}

/**
 * 8 Multi-Paragraph Taiwan-Set Graded Stories spanning TOCFL Novice 1 through Band B2 (FORM-REQ-0006).
 */
export const GRADED_STORIES: GradedStory[] = [
  {
    id: 'story-01-breakfast-shop',
    titleTraditional: '臺北早餐店的第一天',
    titleEnglish: 'First Morning at a Taipei Breakfast Shop',
    tocflBand: 'Novice 1 (準備一級)',
    cefr: 'A1',
    locationTag: '大安區 · 傳統早餐店 (Daan District Breakfast Shop)',
    culturalSummary: 'Taiwanese breakfast shops (早餐店) serve fresh egg crepes (蛋餅) and soy milk (豆漿) with customizable sweetness (微糖/半糖/無糖).',
    keyPolyphones: [
      { word: '好吃', zhuyin: 'ㄏㄠˇ ㄔ', note: '好 is 3rd tone (ㄏㄠˇ) meaning good/delicious.' },
      { word: '微糖', zhuyin: 'ㄨㄟˊ ㄊㄤˊ', note: 'Taiwan MOE standard: 微 is 2nd tone (ㄨㄟˊ).' },
    ],
    paragraphs: [
      {
        traditional: '今天早上天氣很好。我和朋友一起去臺北街頭的早餐店吃早餐。老闆很熱情地問我們：「早安！請問今天要內用還是外帶？」',
        english: 'The weather is great this morning. My friend and I went to a Taipei street breakfast shop together. The boss warmly asked us: "Good morning! For here or to go today?"',
      },
      {
        traditional: '我點了一份起司蛋餅和一杯溫豆漿。因為我不喜歡太甜，所以我跟老闆說：「我的豆漿要微糖，謝謝！」朋友點了燒餅油條和冰紅茶。',
        english: 'I ordered a cheese egg crepe and a cup of warm soy milk. Because I do not like it too sweet, I told the boss: "Quarter-sugar for my soy milk, thank you!" My friend ordered baked flatbread with fried dough stick and iced black tea.',
      },
      {
        traditional: '熱騰騰的蛋餅非常好吃，一共只要九十五塊錢。在臺灣吃早餐既方便又便宜！',
        english: 'The piping-hot egg crepe was delicious, and the total was only NT$95. Eating breakfast in Taiwan is both convenient and inexpensive!',
      },
    ],
    questions: [
      {
        id: 's1-q1',
        questionTraditional: '作者點了什麼飲料？甜度是什麼？',
        questionEnglish: 'What drink did the author order, and at what sweetness?',
        options: ['微糖溫豆漿', '全糖冰奶茶', '無糖熱咖啡', '半糖冰紅茶'],
        correctIndex: 0,
        explanation: '作者點了一杯溫豆漿，並且跟老闆說要「微糖」（ㄨㄟˊ ㄊㄤˊ）。',
      },
    ],
  },
  {
    id: 'story-02-mrt-easycard',
    titleTraditional: '捷運站旁的珍珠奶茶與悠遊卡',
    titleEnglish: 'Boba & EasyCard by the Taipei MRT Station',
    tocflBand: 'Novice 2 (準備二級)',
    cefr: 'A1',
    locationTag: '中山捷運站 (Zhongshan MRT Station)',
    culturalSummary: 'The EasyCard (悠遊卡) pays for MRT rides, buses, YouBikes, and drinks at beverage shops across Taiwan.',
    keyPolyphones: [
      { word: '銀行', zhuyin: 'ㄧㄣˊ ㄏㄤˊ', note: '行 in 銀行 is ㄏㄤˊ (háng).' },
      { word: '還有', zhuyin: 'ㄏㄞˊ ㄧㄡˇ', note: '還 meaning "still/also" is ㄏㄞˊ (hái).' },
    ],
    paragraphs: [
      {
        traditional: '下午三點，我先去捷運站旁邊的銀行換錢，然後去買臺灣最有名的珍珠奶茶。店員問我：「請問甜度冰塊要怎麼調整？」',
        english: 'At 3 PM, I first went to the bank next to the MRT station to exchange money, and then went to buy Taiwan’s most famous boba milk tea. The clerk asked me: "How would you like to adjust sweetness and ice?"',
      },
      {
        traditional: '我回答：「我要一杯珍珠奶茶，半糖少冰。請問可以刷悠遊卡嗎？」店員笑著說：「可以！請把悠遊卡放在機器上面。」',
        english: 'I answered: "I would like one boba milk tea, half-sugar less-ice. May I pay by EasyCard?" The clerk smiled and said: "Yes! Please place your EasyCard on the reader."',
      },
      {
        traditional: '我的悠遊卡裡面還有三百塊錢，逼一聲就付好了。接著我就坐捷運去淡水看夕陽。',
        english: 'My EasyCard still had NT$300 inside; with a single beep it was paid. Next I took the MRT to Tamsui to watch the sunset.',
      },
    ],
    questions: [
      {
        id: 's2-q1',
        questionTraditional: '作者用什麼方式付珍珠奶茶的錢？',
        questionEnglish: 'How did the author pay for the boba milk tea?',
        options: ['刷悠遊卡', '付美金現金', '使用支票', '去銀行匯款'],
        correctIndex: 0,
        explanation: '作者把悠遊卡放在機器上，「逼」一聲就付好錢了。',
      },
    ],
  },
  {
    id: 'story-03-musical-trash-truck',
    titleTraditional: '師大巷口的黃色垃圾車',
    titleEnglish: 'Chasing the Musical Garbage Truck in Shida',
    tocflBand: 'Band A · Level 1 (入門級)',
    cefr: 'A2',
    locationTag: '師大夜市巷口 (Shida Night Market Alley)',
    culturalSummary: 'In Taiwan, yellow municipal garbage trucks play Beethoven’s "Für Elise" or "A Maiden’s Prayer" to signal neighbors to bring out sorted trash.',
    keyPolyphones: [
      { word: '音樂', zhuyin: 'ㄧㄣ ㄩㄝˋ', note: '樂 in 音樂 is ㄩㄝˋ (yuè); in 快樂 it is ㄌㄜˋ (lè).' },
      { word: '垃圾', zhuyin: 'ㄌㄜˋ ㄙㄜˋ', note: 'Taiwan MOE standard pronunciation: ㄌㄜˋ ㄙㄜˋ (lèsè).' },
    ],
    paragraphs: [
      {
        traditional: '剛搬來臺北的時候，每天晚上七點半，我都會聽到巷口傳來古典鋼琴音樂。我本來以為是賣冰淇淋的車子，覺得非常好奇。',
        english: 'When I first moved to Taipei, every evening at 7:30 PM I would hear classical piano music coming from the alley entrance. I originally thought it was an ice-cream truck and felt very curious.',
      },
      {
        traditional: '房東太太笑著告訴我：「那不是冰淇淋車啦！那是臺灣的黃色垃圾車。聽到《給愛麗絲》的音樂，大家就會拿著垃圾袋出來倒垃圾。」',
        english: 'My landlady laughed and told me: "That is not an ice-cream truck! That is Taiwan’s yellow garbage truck. When people hear the music of Für Elise, everyone brings out their trash bags to dump the trash."',
      },
      {
        traditional: '除了一般垃圾以外，星期一和星期五還有白色的資源回收車。邻居們一邊等垃圾車一邊聊天，街道也因此保持得非常乾淨。',
        english: 'Besides general trash, on Mondays and Fridays there is also a white recycling truck. Neighbors chat while waiting for the garbage truck, and the streets stay remarkably clean as a result.',
      },
    ],
    questions: [
      {
        id: 's3-q1',
        questionTraditional: '在臺灣，聽到《給愛麗絲》的音樂代表什麼車來了？',
        questionEnglish: 'In Taiwan, hearing "Für Elise" indicates what vehicle has arrived?',
        options: ['黃色垃圾車', '冰淇淋餐車', '消防救護車', '郵局快遞車'],
        correctIndex: 0,
        explanation: '臺灣的黃色垃圾車會播放《給愛麗絲》或《少女的祈禱》提醒居民倒垃圾。',
      },
    ],
  },
  {
    id: 'story-04-tainan-hsr',
    titleTraditional: '搭高鐵去臺南吃牛肉麵',
    titleEnglish: 'Taking the High Speed Rail to Tainan',
    tocflBand: 'Band A · Level 2 (基礎級)',
    cefr: 'A2',
    locationTag: '臺北車站 → 臺南高鐵站 (Taipei to Tainan HSR)',
    culturalSummary: 'Taiwan High Speed Rail (高鐵) connects Taipei to Tainan in under 100 minutes, where southern hospitality (好客) and beef soup await.',
    keyPolyphones: [
      { word: '好客', zhuyin: 'ㄏㄠˋ ㄎㄜˋ', note: '好 meaning "fond of" is 4th tone (ㄏㄠˋ).' },
      { word: '切水果', zhuyin: 'ㄑㄧㄝ ㄕㄨㄟˇ ㄍㄨㄛˇ', note: '切 meaning "to slice" is 1st tone (ㄑㄧㄝ).' },
    ],
    paragraphs: [
      {
        traditional: '這個週末放假，我和在臺南長大的同學一起買了兩張高鐵票去南部旅行。從臺北坐高鐵到臺南，不到兩個小時就到了。',
        english: 'On holiday this weekend, my classmate who grew up in Tainan and I bought two HSR tickets to travel south. Taking the HSR from Taipei to Tainan took less than two hours.',
      },
      {
        traditional: '同學的父母非常好客，不但帶我們去百年老店吃紅燒牛肉麵，回家以後還切了一大盤新鮮的芒果和蓮霧請我們吃。',
        english: 'My classmate’s parents were very hospitable; not only did they take us to a century-old shop for braised beef noodles, after returning home they also sliced a huge platter of fresh mangoes and wax apples for us.',
      },
      {
        traditional: '更幸運的是，我們買牛肉麵拿到的統一發票，後來對獎的時候發現末三碼中獎了，真是一趟難忘的旅程！',
        english: 'Even luckier, the Uniform Invoice receipt we got from buying beef noodles later matched the last 3 digits in the lottery draw—truly an unforgettable trip!',
      },
    ],
    questions: [
      {
        id: 's4-q1',
        questionTraditional: '「同學的父母非常好客」當中，「好客」的「好」讀音是什麼？',
        questionEnglish: 'In "好客" (hospitable), how is 好 pronounced?',
        options: ['ㄏㄠˋ (4th tone)', 'ㄏㄠˇ (3rd tone)', 'ㄏㄠˊ (2nd tone)', 'ㄏㄠ (1st tone)'],
        correctIndex: 0,
        explanation: '「好客」表示喜歡招待客人，「好」讀作四聲 ㄏㄠˋ。',
      },
    ],
  },
  {
    id: 'story-05-apartment-typhoon',
    titleTraditional: '在臺北租套房與颱風假',
    titleEnglish: 'Apartment Hunting & Typhoon Day Off in Taipei',
    tocflBand: 'Band B · Level 1 (進階級)',
    cefr: 'B1',
    locationTag: '公館大學商圈 (Gongguan University District)',
    culturalSummary: 'Taiwanese leases often quote rent with utility rules and "two months deposit, one month rent" (押二付一), and municipal governments announce typhoon days off (颱風假).',
    keyPolyphones: [
      { word: '研究', zhuyin: 'ㄧㄢˊ ㄐㄧㄡˋ', note: 'Taiwan MOE standard: 究 is 4th tone (ㄐㄧㄡˋ).' },
      { word: '睡著', zhuyin: 'ㄕㄨㄟˋ ㄓㄠˊ', note: '著 meaning "fall asleep" is 2nd tone (ㄓㄠˊ).' },
    ],
    paragraphs: [
      {
        traditional: '考上研究所之後，我開始在學校附近找房子。看了五間公寓以後，我終於租到一間採光很好、離捷運站只有五分鐘的獨立套房。',
        english: 'After being admitted to graduate school, I started looking for housing near campus. After viewing five apartments, I finally rented a well-lit studio apartment only five minutes from the MRT.',
      },
      {
        traditional: '搬進去的第一個星期，正好遇到強烈颱風來襲。晚上十點，臺北市政府宣布隔天停班停課，也就是大家常說的「颱風假」。',
        english: 'During the first week after moving in, a strong typhoon happened to strike. At 10 PM, the Taipei City Government announced work and classes were suspended the next day—what everyone calls a "typhoon holiday."',
      },
      {
        traditional: '我原本擔心外面的風雨聲太大會睡不著，沒想到新房間的氣密窗效果很好，我聽著音樂很快就睡著了。',
        english: 'I originally worried the wind and rain outside would be too loud to fall asleep, but the new room’s airtight windows worked so well that I fell asleep quickly while listening to music.',
      },
    ],
    questions: [
      {
        id: 's5-q1',
        questionTraditional: '當政府宣布「停班停課」時，臺灣人通常稱為什麼假？',
        questionEnglish: 'When the government announces suspension of work and classes due to a storm, what do Taiwanese call it?',
        options: ['颱風假', '端午連假', '中秋連假', '特休年假'],
        correctIndex: 0,
        explanation: '因颱風來襲而宣布停止上班上課，在臺灣稱為「颱風假」（ㄊㄞˊ ㄈㄥ ㄐㄧㄚˋ）。',
      },
    ],
  },
  {
    id: 'story-06-east-coast-cycling',
    titleTraditional: '騎腳踏車環島：花蓮與太魯閣',
    titleEnglish: 'Cycling Around Taiwan: Hualien & Taroko Gorge',
    tocflBand: 'Band B · Level 1 (進階級)',
    cefr: 'B1',
    locationTag: '花蓮 · 太魯閣國家公園 (Hualien & Taroko)',
    culturalSummary: 'Cycling around the island (騎腳踏車環島) is a rite of passage in Taiwan, supported by convenience stores and police stations offering water and tire pumps.',
    keyPolyphones: [
      { word: '危險', zhuyin: 'ㄨㄟˊ ㄒㄧㄢˇ', note: 'Taiwan MOE standard: 危 is 2nd tone (ㄨㄟˊ).' },
      { word: '親切', zhuyin: 'ㄑㄧㄣ ㄑㄧㄝˋ', note: '切 in 親切/一切 is 4th tone (ㄑㄧㄝˋ).' },
    ],
    paragraphs: [
      {
        traditional: '騎腳踏車環島是許多人在臺灣最想完成的夢想。今年春天，我和幾位朋友決定從臺北出發，順時針騎往東海岸的花蓮與臺東。',
        english: 'Cycling around the island is a dream many people in Taiwan want to fulfill. This spring, several friends and I decided to depart from Taipei and ride clockwise toward Hualien and Taitung on the east coast.',
      },
      {
        traditional: '經過蘇花公路與太魯閣的時候，雖然山路比較陡峭，有些路段看起來有點危險，但是太平洋的風景美得讓人捨不得離開，我們停下來照相了好幾次。',
        english: 'While passing the Suhua Highway and Taroko Gorge, although the mountain roads were steep and some sections looked a bit dangerous, the Pacific Ocean scenery was so breathtaking we stopped to take photos several times.',
      },
      {
        traditional: '沿途小鎮的居民都非常親切，每當我們在便利商店休息時，總有人替我們加油打氣。這種濃厚的人情味，正是臺灣最迷人的傳統。',
        english: 'Residents of the small towns along the way were remarkably cordial; whenever we rested at a convenience store, people cheered us on. This deep human warmth is Taiwan’s most charming tradition.',
      },
    ],
    questions: [
      {
        id: 's6-q1',
        questionTraditional: '文章中提到臺灣最迷人的傳統是什麼？',
        questionEnglish: 'According to the passage, what is Taiwan’s most charming tradition?',
        options: ['濃厚的人情味與親切感', '高昂的物價', '寒冷的冬天氣候', '複雜的交通規則'],
        correctIndex: 0,
        explanation: '沿途居民非常親切、替騎士加油，展現了臺灣濃厚的「人情味」。',
      },
    ],
  },
  {
    id: 'story-07-hsinchu-enterprise',
    titleTraditional: '新竹科技企業的面試與自傳',
    titleEnglish: 'Job Interview & Autobiography at a Hsinchu Tech Enterprise',
    tocflBand: 'Band B · Level 2 (高階級)',
    cefr: 'B2',
    locationTag: '新竹科學園區 (Hsinchu Science Park)',
    culturalSummary: 'Hsinchu Science Park is the heart of Taiwan’s semiconductor and hardware industry; Taiwanese job applications often include a formal Chinese autobiography (自傳).',
    keyPolyphones: [
      { word: '企業', zhuyin: 'ㄑㄧˋ ㄧㄝˋ', note: 'Taiwan MOE standard: 企 is 4th tone (ㄑㄧˋ).' },
      { word: '自傳', zhuyin: 'ㄗˋ ㄓㄨㄢˋ', note: '傳 meaning biography is 4th tone (ㄓㄨㄢˋ).' },
      { word: '會計', zhuyin: 'ㄎㄨㄞˋ ㄐㄧˋ', note: '會 in 會計 is ㄎㄨㄞˋ (kuài).' },
    ],
    paragraphs: [
      {
        traditional: '從研究所畢業以前，我向新竹科學園區的幾家跨國科技企業投遞了履歷與中文自傳。為了準備面試，我重新整理了自己的研究專案與實習經驗。',
        english: 'Before graduating from graduate school, I submitted my resume and Chinese autobiography to several multinational tech enterprises in Hsinchu Science Park. To prepare for the interview, I reorganized my research projects and internship experience.',
      },
      {
        traditional: '面試當天，部門主管與會計部門的經理共同出席。主管不僅詢問了我的專業技術，更特別強調團隊合作與跨文化溝通在企業裡的重要性。',
        english: 'On the day of the interview, the department director and the manager of the accounting division attended together. The director not only asked about my technical skills, but especially emphasized the importance of teamwork and cross-cultural communication in the enterprise.',
      },
      {
        traditional: '我用流利的中文回答了他們的問題，並且分享了自己在臺灣生活的收穫。一個星期之後，我順利收到了錄取通知書！',
        english: 'I answered their questions in fluent Chinese and shared what I had gained from living in Taiwan. One week later, I successfully received the offer letter!',
      },
    ],
    questions: [
      {
        id: 's7-q1',
        questionTraditional: '在臺灣教育部標準音中，「企業」與「自傳」的正確注音為何？',
        questionEnglish: 'In Taiwan MOE standard pronunciation, what are the correct Zhuyin readings for 企業 and 自傳?',
        options: ['ㄑㄧˋ ㄧㄝˋ 與 ㄗˋ ㄓㄨㄢˋ', 'ㄑㄧˇ ㄧㄝˋ 與 ㄗˋ ㄔㄨㄢˊ', 'ㄑㄧˋ ㄧㄝˋ 與 ㄗˋ ㄔㄨㄢˊ', 'ㄑㄧˇ ㄧㄝˋ 與 ㄗˋ ㄓㄨㄢˋ'],
        correctIndex: 0,
        explanation: '臺灣標準音中，「企業」讀作 ㄑㄧˋ ㄧㄝˋ（四聲），「自傳」的傳讀作 ㄓㄨㄢˋ（四聲）。',
      },
    ],
  },
  {
    id: 'story-08-urban-renewal-culture',
    titleTraditional: '都市更新、傳統夜市與文化記憶',
    titleEnglish: 'Urban Renewal, Traditional Night Markets & Cultural Memory',
    tocflBand: 'Band B · Level 2 (高階級)',
    cefr: 'B2',
    locationTag: '大稻埕與老城區 (Dadaocheng & Historic Taipei)',
    culturalSummary: 'Dadaocheng (大稻埕) in Taipei exemplifies how historic tea houses and night markets adapt to modern urban renewal while preserving cultural heritage.',
    keyPolyphones: [
      { word: '都市', zhuyin: 'ㄉㄨ ㄕˋ', note: '都 meaning metropolis is 1st tone (ㄉㄨ).' },
      { word: '了解', zhuyin: 'ㄌㄧㄠˇ ㄐㄧㄝˇ', note: '了 meaning understand is 3rd tone (ㄌㄧㄠˇ).' },
      { word: '行業', zhuyin: 'ㄏㄤˊ ㄧㄝˋ', note: '行 meaning profession is 2nd tone (ㄏㄤˊ).' },
    ],
    paragraphs: [
      {
        traditional: '隨著現代都市的快速發展，如何在推動都市更新的同時保留傳統街區的文化記憶，已成為臺灣社會普遍關注的重要議題。',
        english: 'With the rapid development of modern metropolises, how to preserve the cultural memory of traditional neighborhoods while promoting urban renewal has become an important issue widely discussed in Taiwanese society.',
      },
      {
        traditional: '以臺北的大稻埕為例，許多年輕創業者與傳統行業的老師傅攜手合作，將百年歷史的紅磚老屋改造成結合茶館、書店與文創設計的空間。',
        english: 'Taking Taipei’s Dadaocheng as an example, many young entrepreneurs and master craftsmen from traditional industries have joined hands to transform century-old red-brick houses into spaces combining tea houses, bookstores, and creative design.',
      },
      {
        traditional: '透過這樣的創新模式，外國旅客與年輕一代不僅能深入了解臺灣的歷史知識，也能讓傳統文化在現代生活中繼續成長。',
        english: 'Through such an innovative model, international travelers and the younger generation can not only deeply understand Taiwan’s historical knowledge, but also allow traditional culture to continue growing in modern life.',
      },
    ],
    questions: [
      {
        id: 's8-q1',
        questionTraditional: '大稻埕的年輕創業者如何讓百年紅磚老屋獲得新生？',
        questionEnglish: 'How did young entrepreneurs in Dadaocheng revitalize century-old red-brick houses?',
        options: [
          '與傳統行業老師傅合作，結合茶館、書店與文創空間',
          '全部拆除改建為大型工廠',
          '禁止外國旅客進入參觀',
          '改為純粹的政府辦公大樓',
        ],
        correctIndex: 0,
        explanation: '文章指出年輕創業者與傳統行業老師傅攜手合作，將老屋改造為結合茶館、書店與文創設計的空間。',
      },
    ],
  },
];

/**
 * 16 Core Spoken (口語) vs. Formal Written (書面語) Taiwan Register Bridge Pairs (FORM-REQ-0008).
 */
export const REGISTER_BRIDGE_PAIRS: RegisterBridgePair[] = [
  {
    id: 'reg-01-keshi-raner', spoken: '可是', spokenZhuyin: 'ㄎㄜˇ ㄕˋ', written: '然而', writtenZhuyin: 'ㄖㄢˊ ㄦˊ',
    english: 'but / however', category: 'connector',
    spokenSentence: '這家店很遠，可是東西很好吃。', writtenSentence: '此店距離較遠，然而餐點品質極佳。',
    sentenceEnglish: 'This shop is far away; however, the food is excellent.',
    drillPromptTraditional: '這項計畫成本頗高，____長期效益十分可觀。', drillTargetRegister: 'written',
    drillOptions: ['然而', '還有', '此時', '大致'], drillAnswer: '然而',
  },
  {
    id: 'reg-02-haiyou-ciwai', spoken: '還有', spokenZhuyin: 'ㄏㄞˊ ㄧㄡˇ', written: '此外', writtenZhuyin: 'ㄘˇ ㄨㄞˋ',
    english: 'in addition / furthermore', category: 'connector',
    spokenSentence: '這裡可以坐捷運，還有很多公車。', writtenSentence: '此處可搭乘捷運；此外，亦有多線公車行經。',
    sentenceEnglish: 'You can take the MRT here; furthermore, many bus lines pass through.',
    drillPromptTraditional: '本館提供免費導覽；____，週末亦舉辦文化講座。', drillTargetRegister: 'written',
    drillOptions: ['此外', '然而', '認為', '往往'], drillAnswer: '此外',
  },
  {
    id: 'reg-03-yinwei-youyu', spoken: '因為…所以…', spokenZhuyin: 'ㄧㄣ ㄨㄟˋ…ㄙㄨㄛˇ ㄧˇ…', written: '由於…因此…', writtenZhuyin: 'ㄧㄡˊ ㄩˊ…ㄧㄣ ㄘˇ…',
    english: 'because… therefore…', category: 'connector',
    spokenSentence: '因為颱風來了，所以今天停班停課。', writtenSentence: '由於強烈颱風來襲，因此今日停止上班上課。',
    sentenceEnglish: 'Due to the approaching severe typhoon, work and classes are suspended today.',
    drillPromptTraditional: '____山區連日大雨，____部分步道暫時封閉。', drillTargetRegister: 'written',
    drillOptions: ['由於…因此…', '可是…還有…', '不僅…而且…', '倘若…立即…'], drillAnswer: '由於…因此…',
  },
  {
    id: 'reg-04-budan-bujin', spoken: '不但', spokenZhuyin: 'ㄅㄨˊ ㄉㄢˋ', written: '不僅', writtenZhuyin: 'ㄅㄨˋ ㄐㄧㄣˇ',
    english: 'not only', category: 'connector',
    spokenSentence: '悠遊卡不但能坐車，還能買東西。', writtenSentence: '悠遊卡不僅可搭乘大眾運輸，亦可用於小額消費。',
    sentenceEnglish: 'EasyCard can not only be used for transit, but also for small purchases.',
    drillPromptTraditional: '這項技術____提升了效率，更降低了能源消耗。', drillTargetRegister: 'written',
    drillOptions: ['不僅', '然而', '大致', '此時'], drillAnswer: '不僅',
  },
  {
    id: 'reg-05-zheshihou-cishi', spoken: '這時候', spokenZhuyin: 'ㄓㄜˋ ㄕˊ ㄏㄡˋ', written: '此時', writtenZhuyin: 'ㄘˇ ㄕˊ',
    english: 'at this moment / at this time', category: 'adverb',
    spokenSentence: '這時候請不要打開車門。', writtenSentence: '列車行進間，此時請勿開啟車門。',
    sentenceEnglish: 'While the train is moving, please do not open the doors at this time.',
    drillPromptTraditional: '雙方談判陷入僵局，____亟需第三方出面協調。', drillTargetRegister: 'written',
    drillOptions: ['此時', '往往', '此外', '協助'], drillAnswer: '此時',
  },
  {
    id: 'reg-06-changchang-wangwang', spoken: '常常', spokenZhuyin: 'ㄔㄤˊ ㄔㄤˊ', written: '往往', writtenZhuyin: 'ㄨㄤˇ ㄨㄤˇ',
    english: 'often / frequently (in given conditions)', category: 'adverb',
    spokenSentence: '假日的夜市常常有很多人。', writtenSentence: '每逢週末假日，知名夜市往往人潮擁擠。',
    sentenceEnglish: 'Every weekend holiday, famous night markets are often crowded.',
    drillPromptTraditional: '缺乏事前規劃的專案，最終____難以如期完成。', drillTargetRegister: 'written',
    drillOptions: ['往往', '立即', '此時', '不僅'], drillAnswer: '往往',
  },
  {
    id: 'reg-07-juede-renwei', spoken: '覺得', spokenZhuyin: 'ㄐㄩㄝˊ ㄉㄜˊ', written: '認為', writtenZhuyin: 'ㄖㄣˋ ㄨㄟˊ',
    english: 'feel / think / hold the view that', category: 'verb',
    spokenSentence: '大家都覺得這個方法很棒。', writtenSentence: '多數專家學者皆認為此方案相當可行。',
    sentenceEnglish: 'Most experts and scholars consider this proposal highly feasible.',
    drillPromptTraditional: '研究團隊____，保存傳統建築有助於地方文化發展。', drillTargetRegister: 'written',
    drillOptions: ['認為', '協助', '立即', '大致'], drillAnswer: '認為',
  },
  {
    id: 'reg-08-chabuduo-dazhi', spoken: '差不多', spokenZhuyin: 'ㄔㄚ ㄅㄨˋ ㄉㄨㄛ', written: '大致', writtenZhuyin: 'ㄉㄚˋ ㄓˋ',
    english: 'roughly / approximately / on the whole', category: 'adverb',
    spokenSentence: '我們的準備工作已經差不多完成了。', writtenSentence: '相關籌備工作目前已大致完成。',
    sentenceEnglish: 'Relevant preparatory work has now been roughly completed.',
    drillPromptTraditional: '經過三個月的整修，高鐵新站體工程已____就緒。', drillTargetRegister: 'written',
    drillOptions: ['大致', '然而', '往往', '尤其'], drillAnswer: '大致',
  },
  {
    id: 'reg-09-mashang-liji', spoken: '馬上', spokenZhuyin: 'ㄇㄚˇ ㄕㄤˋ', written: '立即', writtenZhuyin: 'ㄌㄧˋ ㄐㄧˊ',
    english: 'immediately / right away', category: 'adverb',
    spokenSentence: '看到地震警報，我們馬上躲到桌子下面。', writtenSentence: '接獲地震警報後，全體人員應立即採取掩護。',
    sentenceEnglish: 'Upon receiving the earthquake alert, all personnel should immediately take cover.',
    drillPromptTraditional: '若發現可疑包裹，請____通報捷運站務人員。', drillTargetRegister: 'written',
    drillOptions: ['立即', '往往', '大致', '此外'], drillAnswer: '立即',
  },
  {
    id: 'reg-10-henduo-xuduo', spoken: '很多', spokenZhuyin: 'ㄏㄣˇ ㄉㄨㄛ', written: '許多', writtenZhuyin: 'ㄒㄩˇ ㄉㄨㄛ',
    english: 'many / numerous', category: 'adverb',
    spokenSentence: '臺灣有很多好吃的水果。', writtenSentence: '臺灣出產許多品質優良的熱帶水果。',
    sentenceEnglish: 'Taiwan produces many high-quality tropical fruits.',
    drillPromptTraditional: '近年來有____外國旅客專程來臺體驗環島自行車道。', drillTargetRegister: 'written',
    drillOptions: ['許多', '立即', '此時', '然而'], drillAnswer: '許多',
  },
  {
    id: 'reg-11-gen-yu', spoken: '跟', spokenZhuyin: 'ㄍㄣ', written: '與', writtenZhuyin: 'ㄩˇ',
    english: 'with / and', category: 'preposition',
    spokenSentence: '這個計畫需要學校跟企業一起合作。', writtenSentence: '本計畫需由學術機構與民間企業共同推動。',
    sentenceEnglish: 'This project requires joint promotion by academic institutions and private enterprises.',
    drillPromptTraditional: '環境保護____經濟發展之間必須取得平衡。', drillTargetRegister: 'written',
    drillOptions: ['與', '及至', '然而', '往往'], drillAnswer: '與',
  },
  {
    id: 'reg-12-bangmang-xiezhu', spoken: '幫忙', spokenZhuyin: 'ㄅㄤ ㄇㄤˊ', written: '協助', writtenZhuyin: 'ㄒㄧㄝˊ ㄓㄨˋ',
    english: 'to help / assist', category: 'verb',
    spokenSentence: '謝謝你幫忙我解決這個問題。', writtenSentence: '感謝貴單位協助本中心處理相關事宜。',
    sentenceEnglish: 'Thank you to your agency for assisting our center in handling the matter.',
    drillPromptTraditional: '如有行動不便之旅客，站務人員將主動提供____。', drillTargetRegister: 'written',
    drillOptions: ['協助', '認為', '此外', '大致'], drillAnswer: '協助',
  },
  {
    id: 'reg-13-ruguo-tangruo', spoken: '如果', spokenZhuyin: 'ㄖㄨˊ ㄍㄨㄛˇ', written: '倘若 / 若', writtenZhuyin: 'ㄊㄤˇ ㄖㄨㄛˋ',
    english: 'if / in the event that', category: 'connector',
    spokenSentence: '如果明天下雨，活動就改到室內。', writtenSentence: '倘若明日降雨，本活動將移至室內舉行。',
    sentenceEnglish: 'In the event of rain tomorrow, this event will be moved indoors.',
    drillPromptTraditional: '____逾時未完成報到手續，將視同放棄參賽資格。', drillTargetRegister: 'written',
    drillOptions: ['倘若', '然而', '此外', '不僅'], drillAnswer: '倘若',
  },
  {
    id: 'reg-14-bifangshuo-liru', spoken: '比方說', spokenZhuyin: 'ㄅㄧˇ ㄈㄤ ㄕㄨㄛ', written: '例如', writtenZhuyin: 'ㄌㄧˋ ㄖㄨˊ',
    english: 'for example / for instance', category: 'connector',
    spokenSentence: '臺北有很多夜市，比方說饒河夜市和寧夏夜市。', writtenSentence: '臺北市擁有眾多知名觀光夜市，例如饒河夜市與寧夏夜市。',
    sentenceEnglish: 'Taipei City has many famous tourist night markets, for example Raohe and Ningxia.',
    drillPromptTraditional: '臺灣東部擁有豐富的自然景觀，____太魯閣峽谷與清水斷崖。', drillTargetRegister: 'written',
    drillOptions: ['例如', '然而', '此時', '立即'], drillAnswer: '例如',
  },
  {
    id: 'reg-15-tebie-youqi', spoken: '特別', spokenZhuyin: 'ㄊㄜˋ ㄅㄧㄝˊ', written: '尤其', writtenZhuyin: 'ㄧㄡˊ ㄑㄧˊ',
    english: 'especially / particularly', category: 'adverb',
    spokenSentence: '夏天來臺灣要注意防曬，特別是中午的時候。', writtenSentence: '夏季訪臺應注意防曬與補充水分，尤其是正午時段。',
    sentenceEnglish: 'Visiting Taiwan in summer requires sun protection and hydration, especially at midday.',
    drillPromptTraditional: '流利掌握破音字與變調規則，____有助於提升口語自然度。', drillTargetRegister: 'written',
    drillOptions: ['尤其', '大致', '此外', '倘若'], drillAnswer: '尤其',
  },
  {
    id: 'reg-16-daozuihou-zuizhong', spoken: '到最後', spokenZhuyin: 'ㄉㄠˋ ㄗㄨㄟˋ ㄏㄡˋ', written: '最終', writtenZhuyin: 'ㄗㄨㄟˋ ㄓㄨㄥ',
    english: 'in the end / ultimately', category: 'adverb',
    spokenSentence: '經過三次討論，大家到最後決定去臺南。', writtenSentence: '歷經三次會議協商，委員會最終決議採納甲案。',
    sentenceEnglish: 'After three consultation meetings, the committee ultimately resolved to adopt Plan A.',
    drillPromptTraditional: '經過長達五年的研發測試，該團隊____成功突破技術瓶頸。', drillTargetRegister: 'written',
    drillOptions: ['最終', '此時', '例如', '認為'], drillAnswer: '最終',
  },
];
