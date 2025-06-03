// js/data/quizContent.js

// 定義五種主要特質的代號，方便後續使用
export const TRAIT_A = 'A'; // 情感的修辭學 (思辨抽離)
export const TRAIT_B = 'B'; // 日常的溫度 (情感共鳴 - 日常)
export const TRAIT_C = 'C'; // 城市觀察手記 (人文觀察 - 距離感)
export const TRAIT_D = 'D'; // 破碎與重生 (自我敘事 - 療癒與堅韌)
export const TRAIT_E = 'E'; // 夜空的螢火 (即興演出 - 自由與探索)

// 根據 Results.md 分析出的各主要特質對應的次要特質及其權重
// 主要特質得分為 1.0, 次要1為 0.3, 次要2為 0.2
const scoreMappings = {
  [TRAIT_A]: { main: TRAIT_A, secondary1: TRAIT_C, secondary2: TRAIT_D },
  [TRAIT_B]: { main: TRAIT_B, secondary1: TRAIT_E, secondary2: TRAIT_D },
  [TRAIT_C]: { main: TRAIT_C, secondary1: TRAIT_B, secondary2: TRAIT_A },
  [TRAIT_D]: { main: TRAIT_D, secondary1: TRAIT_B, secondary2: TRAIT_A },
  [TRAIT_E]: { main: TRAIT_E, secondary1: TRAIT_B, secondary2: TRAIT_D },
};

// Helper function to generate score object
function getScores(mainTraitKey) {
  const mapping = scoreMappings[mainTraitKey];
  const scores = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  scores[mapping.main] = 1.0;
  scores[mapping.secondary1] = 0.3;
  scores[mapping.secondary2] = 0.2;
  return scores;
}

export const quizQuestions = [
  {
    id: 'Q1',
    questionText: '如常的夜，窗前落了封未署名的信箋。你打開查看，發現是一間書店的邀請函，你不禁開始想象這是一間什麼樣的書店呢？',
    options: [
      { text: '光影交織的高樓書店 — 既能安靜閱讀，又能俯瞰街景的人來人往', scores: getScores(TRAIT_C) },
      { text: '舊日燭光的古典書店 — 每本書都被精心分類，空氣中墨香飄渺', scores: getScores(TRAIT_A) },
      { text: '漂泊不定的流動書車 — 居無定點停在城市不同的角落，充滿驚喜', scores: getScores(TRAIT_E) },
      { text: '溫暖明亮的小書店 — 窗台上擺滿植物，牆上掛著手寫的書籍推薦', scores: getScores(TRAIT_B) },
      { text: '改建自廢棄工廠的藝術書店 — 瓦礫斑駁的牆面被巧妙修復成書架', scores: getScores(TRAIT_D) },
    ],
  },
  {
    id: 'Q2',
    questionText: '思緒恍惚間時間凝滯，窗外的城市褪色，想象中的書店縈繞周身。你的視線開始在書架間游移，每一座座書架都似乎在向你訴說不同的故事：',
    options: [
      { text: '旅行筆記與冒險故事，充滿未知與可能性的篇章', scores: getScores(TRAIT_E) },
      { text: '城市觀察與人文隨筆，那些既親近又保持距離的故事', scores: getScores(TRAIT_C) },
      { text: '日記與隨筆書信，記錄著平凡生活中的動人時刻', scores: getScores(TRAIT_B) },
      { text: '心靈療癒及生命探討，關於如何在破碎中找到新生', scores: getScores(TRAIT_D) },
      { text: '哲學思考與文學評論，那裡的書籍探討愛的本質與意義', scores: getScores(TRAIT_A) },
    ],
  },
  {
    id: 'Q3',
    questionText: '書店交織著翻動書頁聲與呼吸的聲音，某個角落，一壺茶的香氣蜿蜒而來。溫熱的霧氣喚醒沉睡的記憶碎片。你為自己斟上一杯，是哪種滋味最能安撫今夜的心緒？',
    options: [
      { text: '帶著花香的茉莉綠茶，溫暖而令人安心', scores: getScores(TRAIT_B) },
      { text: '久經歲月沉澱的普洱，苦澀中帶著深沉的甘甜', scores: getScores(TRAIT_D) },
      { text: '千回百轉的焙香烏龍，層層解構的味覺哲學', scores: getScores(TRAIT_A) },
      { text: '混合著各種花果香氣的花草茶，每一口都是未知的邂逅', scores: getScores(TRAIT_E) },
      { text: '半發酵的青茶，在紅茶與綠茶之間達成微妙平衡', scores: getScores(TRAIT_C) },
    ],
  },
  {
    id: 'Q4',
    questionText: '茶香漫入肺葉，思緒開始沉靜下來。靜謐中，隱約有音樂聲在書架間流淌著，彷彿是書店正在低聲哼唱一首關於時間的歌謠：',
    options: [
      { text: 'Alternative 與 R&B 混搭的電子樂，跨界融合的音樂實驗', scores: getScores(TRAIT_E) },
      { text: '後搖滾樂隊的概念專輯，多層次編曲下隱藏的複雜情感宇宙', scores: getScores(TRAIT_A) },
      { text: 'Lo-Fi 慵懶都市的背景節奏，既是陪伴又保持著若即若離', scores: getScores(TRAIT_C) },
      { text: 'Indie 民謠，溫柔的嗓音與吉他，唱著日常生活中的小確幸', scores: getScores(TRAIT_B) },
      { text: '重金屬的撕心裂肺，是真實赤裸情感的吶喊與療癒', scores: getScores(TRAIT_D) },
    ],
  },
  {
    id: 'Q5',
    questionText: '音符如夜雨輕敲著窗櫺，在心海激起千層漣漪。游走間，一本書閃爍著微光，像是星辰落入掌心，吸引了你的目光。你伸手取下、翻開第一頁，寫著：',
    options: [
      { text: '唯有經歷破碎，才能重新拼湊出更完整的自己', scores: getScores(TRAIT_D) },
      { text: '生活中最平凡的時刻，往往隱藏著最動人的詩歌', scores: getScores(TRAIT_B) },
      { text: '每一段關係都是一次旅行，重要的不是終點，而是沿途風景', scores: getScores(TRAIT_E) },
      { text: '保持距離，才能看清全景；靠近一點，才能感受溫度', scores: getScores(TRAIT_C) },
      { text: '愛是一種需要被解讀的語言，而我們都是彼此的解碼器', scores: getScores(TRAIT_A) },
    ],
  },
  {
    id: 'Q6',
    questionText: '這句話如鑰匙轉動了心門，塵封已久的情感如雪融般流淌。你想在某處靜靜閱讀這本與靈魂共振的書，書店的每個角落都在無聲邀約，哪裡最能容納此刻的你？',
    options: [
      { text: '有些磨損但很舒適的皮沙發', scores: getScores(TRAIT_D) },
      { text: '可以隨意調整位置的懶人沙發，今天想坐這裡、明天換那裡', scores: getScores(TRAIT_E) },
      { text: '古典書桌前的高背椅，可以專注閱讀並做筆記', scores: getScores(TRAIT_A) },
      { text: '可以看到書店全景，卻又有私密感的隱秘角落', scores: getScores(TRAIT_C) },
      { text: '靠窗的軟墊沙發，伴著月光灑在書頁上的感覺很好', scores: getScores(TRAIT_B) },
    ],
  },
  {
    id: 'Q7',
    questionText: '坐下的瞬間，彷彿找到靈魂久違的棲息地。閱讀間抬眼，牆上懸掛的畫作似乎也在閱讀著你。不同的畫框中流動著各自的情感，其中一幅無聲地召喚你的注視：',
    options: [
      { text: '城市夜景的攝影作品，燈火與黑暗形成鮮明對比', scores: getScores(TRAIT_C) },
      { text: '沒有框架的水彩畫，色彩在紙上自由流動，界限模糊', scores: getScores(TRAIT_E) },
      { text: '捕捉日常生活瞬間的溫暖插畫，充滿細節與情感', scores: getScores(TRAIT_B) },
      { text: '文字與圖像交織的抽象畫，需要駐足思考才能理解其中含義', scores: getScores(TRAIT_A) },
      { text: '金繕的修復藝術，破碎的瓷器被金線重新連接，卻更顯珍貴', scores: getScores(TRAIT_D) },
    ],
  },
  {
    id: 'Q8',
    questionText: '翻閱了許多書頁，你感到思緒也需要片刻休息。站起身，伸了個懶腰，你發現角落有一扇半掩的門，透出夜色與花香的氣息。循著好奇走近，推門而出，月光灑落在：',
    options: [
      { text: '種滿四季花卉的角落，記錄下花朵綻放的細微變化', scores: getScores(TRAIT_B) },
      { text: '有裂痕但被藤蔓美化的老石桌旁，感受歲月的痕跡', scores: getScores(TRAIT_D) },
      { text: '蜿蜒交錯的花園小徑上，引著你的目光跟著跳動', scores: getScores(TRAIT_E) },
      { text: '鋪著棋盤的石桌上，錯落在棋桌上的光影如同人生的無限可能', scores: getScores(TRAIT_A) },
      { text: '玻璃溫室花房的邊緣，透明與實體的交界處，散發著清冷卻又溫暖', scores: getScores(TRAIT_C) },
    ],
  },
  {
    id: 'Q9', // 決勝問題
    questionText: '微風中傳來交談的碎片，原來門後的神秘地帶有著一群人正在進行「愛的語言」讀書會。他們的討論輕輕觸碰你的心弦，你加入了大家的對話：',
    options: [
      { text: '關於愛情中的詞語選擇，如何影響彼此的理解與連結', scores: getScores(TRAIT_A), optionId: 'Q9_A' },
      { text: '在親密關係中保持適當距離的藝術與平衡', scores: getScores(TRAIT_C), optionId: 'Q9_C' },
      { text: '愛情需要不斷探索與創新，避免陷入固定模式', scores: getScores(TRAIT_E), optionId: 'Q9_E' },
      { text: '經歷心碎後如何重新學習去愛與被愛', scores: getScores(TRAIT_D), optionId: 'Q9_D' },
      { text: '如何通過日常的小儀式表達愛，不必依賴言語', scores: getScores(TRAIT_B), optionId: 'Q9_B' },
    ],
  },
  {
    id: 'Q10',
    questionText: '夜色深沉、星河低垂，是時候該離開了。一本留言簿在月光下等待著你的觸碰。他是承載了夜裡來過書店人們的心事、是現代愛情的容器、是一本：',
    options: [
      { text: '環形活頁留言薄，每頁都能任意調換位置，也能隨時添加新的樣張', scores: getScores(TRAIT_E) },
      { text: '手工布面留言本，每頁底部都有一個小口袋可以存放照片或紀念物', scores: getScores(TRAIT_B) },
      { text: '老舊皮革的筆記本，上面的劃痕與污漬都被保留著，充滿著歷經歲月', scores: getScores(TRAIT_D) },
      { text: '雙面留言卡片冊，正面可以記錄今天的收穫、背面寫下自己的感受', scores: getScores(TRAIT_C) },
      { text: '如現代社交平臺的留言系統，大家可以張貼自己、也可以到別人的分享下留言', scores: getScores(TRAIT_A) },
    ],
  },
  {
    id: 'Q11',
    questionText: '當你寫下最後一個字，書店的影像逐漸消散，夜晚的奇遇原來就是一場夢境。意識重新連結回到了現實世界，是什麼最先換回了你的感官？',
    options: [
      { text: '窗外傳來嚶嚶鳥鳴，那是你從未聽過的旋律', scores: getScores(TRAIT_E) },
      { text: '透進房間的陽光灑落在你的手臂上，和廚房傳來的咖啡香', scores: getScores(TRAIT_B) },
      { text: '枕邊的手機震動，是一位久未聯繫的老朋友發來的問候訊息', scores: getScores(TRAIT_D) },
      { text: '城市車水馬龍的聲響，既熟悉又陌生', scores: getScores(TRAIT_C) },
      { text: '書桌上鬧鐘分秒不差的滴嗒聲，規律而精準的節奏迴盪進腦中', scores: getScores(TRAIT_A) },
    ],
  },
];

export const quizResults = {
  [TRAIT_A]: {
    title: '《情感的修辭學》',
    subtitle: '愛是一種語言，而你是它最優雅的詮釋者',
    description: '你總是站在情感的邊緣，以一種近乎學術的態度觀察愛情的流動。在你的世界裡，每一段關係都是一篇等待解析的文本，每一次心動都值得被反覆推敲。你不輕易沉溺，卻在字句間找到最深的共鳴；你看似冷靜，實則在靈魂深處記錄著每一個微小的情感波動。愛對你而言不僅是感受，更是一種需要被理解的語言：你用理性編織情感的網，卻常在意料之外的瞬間被自己的情感擊中。',
    bookTraits: {
      [TRAIT_A]: 5, // 思辨抽離
      [TRAIT_B]: 1, // 情感共鳴
      [TRAIT_C]: 3, // 人文觀察
      [TRAIT_D]: 2, // 自我敘事
      [TRAIT_E]: 1, // 即興演出
    },
    similarBooks: [
      '《城市觀察手記》- 同樣細膩地觀察愛情，卻比你更願意沉浸其中',
      '《日常的溫度》- 在日常的細節裡尋找意義，但比你更偏向感性',
    ],
    complementaryPerspectives: [
      '《破碎與重生》- 勇於直面情感的創傷，而你偏好在理性的距離中觀察',
      '《夜空的螢火》- 隨性而自由的愛情探險家，與你的思辨結構形成美麗對比',
    ],
  },
  [TRAIT_B]: {
    title: '《日常的溫度》',
    subtitle: '日常、如常就是未完成的情書，隨手可得，卻珍貴如金',
    description: '你的愛情如同一摞輕盈的往返書信，隨性而真誠，不加修飾卻句句動人。生活中的小事在你手中都能變成愛的證明：一杯準時泡好的茶、一条深夜傳來的訊息、一個無意間的對視。你不需要宏大的表白，因為你懂得愛最真實的樣子藏在日常的縫隙中。即使在最平凡的時刻，你也能發現愛情的奇妙脈動，像是在微光中記錄下整個宇宙的溫柔密碼。',
    bookTraits: {
      [TRAIT_B]: 4, // 情感共鳴
      [TRAIT_E]: 4, // 即興演出
      [TRAIT_D]: 3, // 自我敘事
      [TRAIT_C]: 2, // 人文觀察
      [TRAIT_A]: 1, // 思辨抽離
    },
    similarBooks: [
      '《夜空的螢火》- 同樣珍視當下的美好，卻比你更加結構化',
      '《破碎與重生》- 在深刻的情感體驗中尋找意義，但你更加輕盈靈動',
    ],
    complementaryPerspectives: [
      '《情感的修辭學》- 在思辨的高塔中觀察愛情，而你則沉浸其中',
      '《城市觀察手記》- 保持著觀察者的距離，而你選擇全然投入',
    ],
  },
  [TRAIT_C]: {
    title: '《城市觀察手記》',
    subtitle: '在喧囂與寂靜的交界處，你收集著無人聽見的心事',
    description: '你的靈魂棲息在城市的邊緣，既融入人群，又保持著一定的距離。你善於聆聽別人的故事，卻很少訴說自己的感受；你能輕易走進他人的情感世界，卻總在最後一刻輕輕退後。愛對你而言是一種奇妙的平衡藝術：既親密又保持距離、既投入又略帶觀察。你的情感如同夜晚的路燈，不刺眼卻足以照亮前行的道路，溫柔而持久，像是時間凝固成的琥珀。',
    bookTraits: {
      [TRAIT_B]: 5, // 情感共鳴
      [TRAIT_C]: 5, // 人文觀察
      [TRAIT_A]: 3, // 思辨抽離
      [TRAIT_D]: 2, // 自我敘事
      [TRAIT_E]: 2, // 即興演出
    },
    similarBooks: [
      '《情感的修辭學》- 同樣善於觀察與分析，但你更願意親近情感',
      '《日常的溫度》- 同樣珍視生活中的細節，但你更傾向沉思',
    ],
    complementaryPerspectives: [
      '《破碎與重生》- 直接面對情感的傷痕，而你選擇在安全距離觀察',
      '《夜空的螢火》- 追尋自由與變化，而你更珍視穩定與深度',
    ],
  },
  [TRAIT_D]: {
    title: '《破碎與重生》',
    subtitle: '每一道裂痕都是光照進來的路徑、每一次碎裂都是重組的開始',
    description: '你的心曾經破碎，卻從未停止愛的勇氣。那些傷痕並未使你封閉自己，反而成為了你理解他人的橋樑。你相信真正的連結發生在脆弱與真實的交匯處，因此你不懼怕展示自己的不完美。愛對你而言是一種修復的藝術——不是回到從前，而是創造全新的自我。你的情感如同金繕修復的陶器，因為破碎而更加珍貴，那些金色的痕跡訴說著你的堅韌與溫柔。',
    bookTraits: {
      [TRAIT_D]: 5, // 自我敘事
      [TRAIT_B]: 4, // 情感共鳴
      [TRAIT_A]: 2, // 思辨抽離
      [TRAIT_C]: 2, // 人文觀察
      [TRAIT_E]: 2, // 即興演出
    },
    similarBooks: [
      '《城市觀察手記》- 同樣深刻地感受情感的波動，但你選擇直面而非觀望',
      '《夜空的螢火》- 同樣熱愛自由與探索，但你在傷痕中尋找意義',
    ],
    // Note: In your markdown, D's complementary was "有距離才有美感", I've used the titles.
    complementaryPerspectives: [
      '《情感的修辭學》- 在思辨的距離中分析愛情，而你選擇沉浸其中',
      '《日常的溫度》- 在日常細節中尋找溫暖，而你在破碎中發現美麗',
    ],
  },
  [TRAIT_E]: {
    title: '《夜空的螢火》',
    subtitle: '每一次閃爍都是一場冒險，短暫卻足以照亮整個夜晚',
    description: '你的愛情如同夜空中的螢火，不求永恆，只在乎當下的真實與美麗。你相信情感應該是自由的，像風一樣不可捉摸卻能帶來驚喜。每一段關係對你而言都是一次探索——探索他人的內心，也探索自己未知的可能。你不執著於結果，而是珍視過程中的每一次心動與成長。你的情感輕盈卻不淺薄，如同螢火蟲的光，短暫卻能在黑暗中留下永恆的印記。',
    bookTraits: {
      [TRAIT_E]: 5, // 即興演出
      [TRAIT_B]: 3, // 情感共鳴
      [TRAIT_D]: 3, // 自我敘事
      [TRAIT_A]: 2, // 思辨抽離
      [TRAIT_C]: 2, // 人文觀察
    },
    similarBooks: [
      '《破碎與重生》- 同樣勇於冒險，但你更加輕盈與自由',
      '《日常的溫度》- 同樣珍視當下的美好，但你更願意擁抱變化',
    ],
    complementaryPerspectives: [
      '《情感的修辭學》- 在理性的框架中解析愛情，而你追求感性的流動',
      '《城市觀察手記》- 以觀察者姿態保持距離，而你選擇全然投入',
    ],
  },
  SPECIAL_RESULT: { // 特殊結果的代號
    title: '《靈魂圖書管理員》',
    subtitle: '你不只是閱讀者，更是連結靈魂的橋樑',
    description: '你是那位在書架間穿梭的神秘守護者，能夠理解每一本情感之書的語言。在《靈魂藏書閣》中，你既是訪客也是主人，能夠欣賞每一種情感表達的獨特之美。\n\n你的心靈如同這座藏書閣本身，容納著各種可能性。你既擁有思考的深度、也有感受的敏銳；既觀察他人、也善於敘述自己；既珍視日常的細節、也熱愛自由的探索。正是如此這樣的多面性，你能夠成為不同靈魂之間的翻譯者和橋樑。\n\n在情感的世界裡，你不被單一的模式所定義。你知道愛有時需要理性的解析、有時需要感性的表達；有時需要保持距離、有時需要勇敢面對傷痕，有時又需要自由地探索未知。這種包容不同可能性的特質，使你成為珍貴的情感連結者。',
    bookTraits: { // 均衡的特質
      [TRAIT_A]: 3,
      [TRAIT_B]: 3,
      [TRAIT_C]: 3,
      [TRAIT_D]: 3,
      [TRAIT_E]: 3,
    },
    // 特殊結果的 "與你相似又互補的書籍" 比較特殊，這裡我直接引用了您的描述
    similarAndComplementaryBooks: '你是一位不只閱讀書籍，更連結書籍與讀者的守護者。你能感知每一本書的獨特氣質，也能理解每一位讀者的心靈需求。因為理解多種情感語言，你常成為朋友中的情感顧問，幫助他們翻譯自己難以表達的心聲。\n\n《破碎與重生》- 同樣勇於冒險，但你更加輕盈與自由\n《日常的溫度》- 同樣珍視當下的美好，但你更願意擁抱變化\n《情感的修辭學》- 在理性的框架中解析愛情，而你追求感性的流動\n《城市觀察手記》- 以觀察者姿態保持距離，而你選擇全然投入\n《夜空的螢火》- 同樣熱愛自由與探索，但你在傷痕中尋找意義',
  },
};

// Q9 選項的唯一標識符，用於決勝局判斷
// (在 quizQuestions 的 Q9 中已為每個選項添加了 optionId)
// 例如，如果用戶在Q9選擇了第二個選項 (主要特質是C)，
// 我們會在主邏輯中記錄下 'Q9_C' 或類似的標識。
// 決勝時，我們會查找這個標識，然後應用 getScores(TRAIT_C) 來加分。

/**
 * 注意事項：
 * 1. Q9 選項中添加了 `optionId`，這是為了在決勝局時能明確識別用戶選擇了 Q9 的哪個原始主要特質。
 * 2. Results 的文本我已從您的 Markdown 檔案複製過來。
 * 3. `scoreMappings` 和 `getScores` 輔助函式用於簡化和標準化計分對象的生成。
 * 4. `SPECIAL_RESULT` 作為特殊結果的鍵名。
 */