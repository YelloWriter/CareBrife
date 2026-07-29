export type Language = "ko" | "en" | "ja" | "zh";

export const languageOptions: Array<{
  code: Language;
  label: string;
  htmlLang: string;
}> = [
  { code: "ko", label: "한국어", htmlLang: "ko" },
  { code: "en", label: "영어", htmlLang: "en" },
  { code: "ja", label: "일본어", htmlLang: "ja" },
  { code: "zh", label: "중국어", htmlLang: "zh-CN" },
];

type LocalizedCopy = Record<Exclude<Language, "ko">, string>;

const copy: Record<string, LocalizedCopy> = {
  "진료한장 홈": {
    en: "Jinryo Hanjang home",
    ja: "診療一枚 ホーム",
    zh: "诊疗一页首页",
  },
  "주요 메뉴": {
    en: "Main navigation",
    ja: "メインメニュー",
    zh: "主菜单",
  },
  "이용 방법": {
    en: "How it works",
    ja: "使い方",
    zh: "使用方法",
  },
  "개인정보 안내": {
    en: "Privacy",
    ja: "プライバシー",
    zh: "隐私说明",
  },
  만들어보기: {
    en: "Try it",
    ja: "作ってみる",
    zh: "开始制作",
  },
  "부모님 진료,": {
    en: "Even when you cannot",
    ja: "ご両親の診療に、",
    zh: "父母就诊时，",
  },
  함께: {
    en: "be there",
    ja: "一緒に",
    zh: "一起",
  },
  "못 가도": {
    en: "in person,",
    ja: "行けなくても",
    zh: "去不了，",
  },
  준비는: {
    en: "you can prepare",
    ja: "準備は",
    zh: "准备仍然可以",
  },
  "할 수 있어요.": {
    en: "together.",
    ja: "できます。",
    zh: "一起完成。",
  },
  "부모님의 진료를 준비하는 가장 다정한 한 장": {
    en: "One caring page to prepare for your parent’s visit",
    ja: "ご両親の診療を準備する、いちばんやさしい一枚",
    zh: "为父母就诊准备的最贴心一页",
  },
  "부모님의 증상, 복용약, 최근 변화와 궁금한 점을 병원에서 보여줄 한 장으로 정리해드려요.": {
    en: "Bring symptoms, medications, recent changes, and questions together on one page for the clinic.",
    ja: "症状、服用中の薬、最近の変化、聞きたいことを、病院で見せられる一枚にまとめます。",
    zh: "把症状、用药、近期变化和想问的问题整理成一页，方便在医院查看。",
  },
  "진료한장 만들어보기": {
    en: "Create a care brief",
    ja: "診療一枚を作ってみる",
    zh: "制作诊疗一页",
  },
  "베타테스터 신청하기": {
    en: "Apply for beta testing",
    ja: "ベータテスターに応募",
    zh: "申请成为内测用户",
  },
  "진단이나 처방 대신, 진료 전에 필요한 정보를 함께 정리해요.": {
    en: "This organizes information before a visit; it does not diagnose or prescribe.",
    ja: "診断や処方ではなく、診療前に必要な情報を一緒に整理します。",
    zh: "不提供诊断或处方，只帮助整理就诊前需要的信息。",
  },
  "부모님 병원 가시는 날,": {
    en: "When your parent has an appointment,",
    ja: "ご両親が病院へ行く日、",
    zh: "父母去医院的那天，",
  },
  "이런 생각이 든 적 있나요?": {
    en: "have you ever had these worries?",
    ja: "こんな心配をしたことはありませんか？",
    zh: "你是否也有过这些担心？",
  },
  "언제부터 아프셨는지 병원에서 잘 설명하실 수 있을까?": {
    en: "Will they be able to explain when the pain started?",
    ja: "いつからつらいのか、病院できちんと説明できるかな？",
    zh: "他们能在医院说清楚是从什么时候开始不舒服的吗？",
  },
  "지금 드시는 약을 정확히 알고 계실까?": {
    en: "Will they remember exactly which medicines they take?",
    ja: "今飲んでいる薬を正確に覚えているかな？",
    zh: "他们清楚自己现在正在吃哪些药吗？",
  },
  "물어보려고 했던 걸 깜빡하지 않으실까?": {
    en: "Will they forget what they wanted to ask?",
    ja: "聞こうと思っていたことを忘れないかな？",
    zh: "他们会不会忘记原本想问的问题？",
  },
  "내가 같이 못 가는데, 중요한 이야기가 잘 전달될까?": {
    en: "If I cannot go, will the important details be shared?",
    ja: "私が一緒に行けなくても、大事なことは伝わるかな？",
    zh: "如果我不能陪同，重要的信息能传达清楚吗？",
  },
  "전에 보내주신 약봉투 사진이 카톡 어디에 있었더라?": {
    en: "Where was that medication photo in our messages?",
    ja: "前に送ってもらった薬袋の写真、どこにあったかな？",
    zh: "之前发来的药袋照片在聊天记录的哪里来着？",
  },
  "진료가 다 끝난 뒤에야 물어볼 게 생각난 적이 있다.": {
    en: "I have remembered a question only after the visit ended.",
    ja: "診療が終わってから、聞きたいことを思い出したことがある。",
    zh: "我曾在看诊结束后才想起还有问题没问。",
  },
  "부모님을 챙기고 싶은 마음은 크지만,": {
    en: "You want to care for your parents,",
    ja: "ご両親を気にかける気持ちは大きくても、",
    zh: "虽然很想照顾好父母，",
  },
  "필요한 정보가 전화와 카카오톡, 사진과 메모에 나뉘어 있는 경우가 참 많아요.": {
    en: "but the information is often scattered across calls, messages, photos, and notes.",
    ja: "必要な情報が電話やメッセージ、写真、メモに散らばっていることがよくあります。",
    zh: "但需要的信息常常散落在电话、聊天、照片和备忘录里。",
  },
  "진료한장은 익숙한 방법을 바꾸는 대신, 흩어진 내용을 진료 전에 한 번에 모을 수 있게 도와드려요.": {
    en: "Jinryo Hanjang keeps your familiar routines and simply gathers the scattered details before the visit.",
    ja: "診療一枚は、慣れた方法を変えず、散らばった内容を診療前にまとめられるようお手伝いします。",
    zh: "诊疗一页不改变熟悉的方式，只帮助你在就诊前把分散的信息集中起来。",
  },
  "지금도 나름의 방법으로": {
    en: "You are already caring",
    ja: "今もそれぞれの方法で",
    zh: "现在也在用自己的方式",
  },
  "잘 챙기고 있어요.": {
    en: "in your own way.",
    ja: "きちんと準備しています。",
    zh: "认真地做着准备。",
  },
  "전화로 어디가 불편하신지 다시 여쭤봐요": {
    en: "Call again to ask what feels uncomfortable",
    ja: "電話でどこがつらいか聞き直します",
    zh: "打电话再问一遍哪里不舒服",
  },
  "카톡에서 예전에 받은 약봉투 사진을 찾아요": {
    en: "Search messages for an old medication photo",
    ja: "以前もらった薬袋の写真をメッセージから探します",
    zh: "在聊天记录里寻找以前的药袋照片",
  },
  "생각나는 질문을 메모장에 따로 적어둬요": {
    en: "Write questions in a separate note",
    ja: "思いついた質問を別のメモに書きます",
    zh: "把想到的问题另记在备忘录里",
  },
  "함께 가는 가족에게 내용을 다시 설명해요": {
    en: "Explain everything again to the family member going along",
    ja: "付き添う家族に内容をもう一度説明します",
    zh: "再向陪同就诊的家人说明一遍",
  },
  "진료 때마다 비슷한 준비를 반복하게 돼요": {
    en: "Repeat the same preparation for every visit",
    ja: "診療のたびに同じような準備を繰り返します",
    zh: "每次就诊都重复相似的准备",
  },
  "필요한 정보는 이미 우리에게 있어요.": {
    en: "You already have the information you need.",
    ja: "必要な情報は、すでに手元にあります。",
    zh: "需要的信息其实已经在我们手中。",
  },
  "진료 전에 한 번에 보기 쉽게 정리되지 않았을 뿐이랍니다.": {
    en: "It just has not been gathered into one easy view.",
    ja: "診療前に見やすく一つにまとまっていないだけです。",
    zh: "只是还没有在就诊前被整理成一目了然的形式。",
  },
  "진료한장은 이 방법을 바꾸려는 게 아니라, 흩어진 내용을 한 번에 모을 수 있게 도와드려요.": {
    en: "Jinryo Hanjang does not replace those habits; it brings their details together.",
    ja: "診療一枚はその方法を変えるのではなく、散らばった内容を一つに集めるお手伝いをします。",
    zh: "诊疗一页不是要改变这些习惯，而是帮助把分散的信息集中起来。",
  },
  "진료한장은 부모님의 이야기를": {
    en: "Jinryo Hanjang turns your parent’s story",
    ja: "診療一枚は、ご両親のお話を",
    zh: "诊疗一页把父母的故事",
  },
  "진료에 쓸 수 있는 한 장으로 정리해요.": {
    en: "into one useful page for the visit.",
    ja: "診療で使える一枚にまとめます。",
    zh: "整理成就诊时可用的一页。",
  },
  "편하게 이야기하기": {
    en: "Speak naturally",
    ja: "気軽に話す",
    zh: "轻松讲述",
  },
  "함께 확인하기": {
    en: "Review together",
    ja: "一緒に確認する",
    zh: "一起确认",
  },
  "한 장으로 챙겨가기": {
    en: "Bring one page",
    ja: "一枚にまとめて持っていく",
    zh: "带上一页",
  },
  "함께 병원에 가지 못하는 날에도, 진료 준비까지 혼자 맡겨두지 않으셔도 괜찮아요.": {
    en: "Even when you cannot go along, your parent does not have to prepare alone.",
    ja: "一緒に病院へ行けない日も、診療の準備まで一人に任せなくて大丈夫です。",
    zh: "即使不能陪同去医院，也不必让父母独自承担就诊准备。",
  },
  "진료 준비는 간단할수록 좋아요.": {
    en: "Preparing for a visit should feel simple.",
    ja: "診療の準備は、シンプルなほど安心です。",
    zh: "就诊准备越简单越好。",
  },
  "편하게 말하거나 입력해요": {
    en: "Speak or type naturally",
    ja: "気軽に話す・入力する",
    zh: "轻松说出或输入",
  },
  "부모님이나 자녀가 불편한 점과 궁금한 내용을 남겨주세요.": {
    en: "A parent or child can share discomforts and questions.",
    ja: "ご両親またはお子さまが、不調や気になることを残します。",
    zh: "父母或子女可以留下不适和疑问。",
  },
  "필요한 내용끼리 정리해요": {
    en: "Sort the key details",
    ja: "必要な内容を整理する",
    zh: "整理所需信息",
  },
  "증상, 시작 시점, 복용약, 최근 변화와 질문으로 나눠요.": {
    en: "Organize symptoms, timing, medications, changes, and questions.",
    ja: "症状、始まった時期、服用薬、最近の変化、質問に分けます。",
    zh: "按症状、开始时间、用药、近期变化和问题分类。",
  },
  "자녀가 한 번 더 확인해요": {
    en: "Review it once more",
    ja: "お子さまがもう一度確認する",
    zh: "子女再确认一次",
  },
  "잘못 적힌 내용이나 빠진 부분이 없는지 쉽게 보완해요.": {
    en: "Correct mistakes and add anything that is missing.",
    ja: "間違いや抜けている部分を簡単に補います。",
    zh: "轻松修正错误并补充遗漏。",
  },
  "병원에 가져가요": {
    en: "Take it to the clinic",
    ja: "病院へ持っていく",
    zh: "带去医院",
  },
  "완성된 진료한장을 가족에게 보내거나 인쇄해 챙겨가요.": {
    en: "Send the finished page to family or print it for the visit.",
    ja: "完成した一枚を家族に送るか、印刷して持っていきます。",
    zh: "把完成的一页发给家人，或打印后带去就诊。",
  },
  말하기: { en: "Tell", ja: "話す", zh: "讲述" },
  확인하기: { en: "Review", ja: "確認", zh: "确认" },
  "한 장 정리": { en: "One page", ja: "一枚に整理", zh: "整理成一页" },
  "병원에서 보여주기": {
    en: "Show at the clinic",
    ja: "病院で見せる",
    zh: "在医院出示",
  },
  "건강정보를 다루는 방식부터 다정하고 분명하게 알려드려요.": {
    en: "We explain clearly and gently how health information is handled.",
    ja: "健康情報の扱い方から、やさしく明確にお伝えします。",
    zh: "我们会温和而清楚地说明如何处理健康信息。",
  },
  "지금 이용하는 체험판": {
    en: "This trial",
    ja: "現在の体験版",
    zh: "当前体验版",
  },
  "적어주신 내용은 이 브라우저 안에서만 머물러요.": {
    en: "What you enter stays in this browser.",
    ja: "入力した内容は、このブラウザ内だけに残ります。",
    zh: "你输入的内容只保留在当前浏览器中。",
  },
  "입력한 내용은 서버에 저장하지 않아요.": {
    en: "Your entries are not saved on a server.",
    ja: "入力内容はサーバーに保存しません。",
    zh: "输入内容不会保存到服务器。",
  },
  "새로고침하거나 창을 닫으면 입력 내용이 사라져요.": {
    en: "Refreshing or closing the window clears the entries.",
    ja: "再読み込みやウィンドウを閉じると、入力内容は消えます。",
    zh: "刷新或关闭窗口后，输入内容会消失。",
  },
  "앞으로 출시할 정식 서비스": {
    en: "The future full service",
    ja: "今後リリースする正式版",
    zh: "未来正式服务",
  },
  "일상 데이터를 모으기 전에 안전한 기준부터 준비할게요.": {
    en: "We will set clear safeguards before collecting everyday data.",
    ja: "日常データを集める前に、安全な基準を整えます。",
    zh: "在收集日常数据前，我们会先建立清晰的安全标准。",
  },
  "안내 확인하고 체험판 시작하기": {
    en: "Read this and start the trial",
    ja: "案内を確認して体験版を始める",
    zh: "确认说明并开始体验",
  },
  "진료한장 처음 만나보기 (체험판)": {
    en: "Meet Jinryo Hanjang (Trial)",
    ja: "診療一枚を初めて使う（体験版）",
    zh: "初次体验诊疗一页（体验版）",
  },
  "진료한장 처음 만나보기": {
    en: "Meet Jinryo Hanjang",
    ja: "診療一枚を初めて使う",
    zh: "初次体验诊疗一页",
  },
  "(체험판)": {
    en: "(Trial)",
    ja: "（体験版）",
    zh: "（体验版）",
  },
  "부모님의 진료 이야기를 한 장에 담아보세요.": {
    en: "Put your parent’s visit story on one page.",
    ja: "ご両親の診療のお話を一枚にまとめてみましょう。",
    zh: "把父母的就诊故事整理在一页中。",
  },
  "아는 만큼만 적어도 괜찮아요. 비워둔 항목은 리포트에 나타나지 않아요.": {
    en: "Share only what you know. Empty fields will not appear in the report.",
    ja: "分かる範囲だけで大丈夫です。空欄はレポートに表示されません。",
    zh: "只填写你知道的内容即可。留空的项目不会出现在报告中。",
  },
  "출시되는 서비스는 지금처럼 수기로 입력하지 않고, 일상 속의 데이터를 모아서 병원 가기 전에 바로 생성해줄 거예요.": {
    en: "The full service will gather everyday data and create the page before a visit, without manual entry like this trial.",
    ja: "正式版では今のような手入力ではなく、日常のデータを集め、病院へ行く前にすぐ作成できるようになります。",
    zh: "正式服务无需像现在这样手动输入，而会汇集日常数据，在去医院前直接生成。",
  },
  "문장으로 편하게 이야기해 주세요.": {
    en: "Tell the story in your own words.",
    ja: "文章で気軽にお話しください。",
    zh: "请用自然的句子轻松讲述。",
  },
  "부모님의 증상과 진료 준비 이야기": {
    en: "Your parent’s symptoms and visit preparation",
    ja: "ご両親の症状と診療準備のお話",
    zh: "父母的症状与就诊准备情况",
  },
  "음성으로 입력하기": {
    en: "Enter by voice",
    ja: "音声で入力",
    zh: "语音输入",
  },
  "음성 입력 멈추기": {
    en: "Stop voice input",
    ja: "音声入力を停止",
    zh: "停止语音输入",
  },
  "AI로 항목 자동 채우기": {
    en: "Autofill with on-device AI",
    ja: "AIで項目を自動入力",
    zh: "用设备端 AI 自动填写",
  },
  "무료 AI 준비 중": {
    en: "Preparing free AI",
    ja: "無料AIを準備中",
    zh: "正在准备免费 AI",
  },
  "이야기 정리 중": {
    en: "Organizing the story",
    ja: "お話を整理中",
    zh: "正在整理内容",
  },
  "입력 내용은 서버에 저장되지 않아요.": {
    en: "Your entries are not saved on a server.",
    ja: "入力内容はサーバーに保存されません。",
    zh: "输入内容不会保存到服务器。",
  },
  "오늘 진료에서 확인할 것": {
    en: "What to confirm today",
    ja: "今日の診療で確認すること",
    zh: "今天就诊要确认的内容",
  },
  작성일: { en: "Date", ja: "作成日", zh: "填写日期" },
  "오늘 확인받고 싶은 내용": {
    en: "What you want to confirm today",
    ja: "今日確認したいこと",
    zh: "今天想确认的内容",
  },
  "가장 불편한 증상": {
    en: "Most troubling symptom",
    ja: "いちばんつらい症状",
    zh: "目前最困扰的症状",
  },
  "증상 시작 시점": {
    en: "When it started",
    ja: "症状が始まった時期",
    zh: "症状开始时间",
  },
  "발생 상황": {
    en: "When it happens",
    ja: "起こる状況",
    zh: "发生情境",
  },
  "발생 양상": {
    en: "Pattern",
    ja: "起こり方",
    zh: "发生规律",
  },
  "악화 요인": {
    en: "What makes it worse",
    ja: "悪化する要因",
    zh: "加重因素",
  },
  "완화 요인": {
    en: "What makes it better",
    ja: "和らぐ要因",
    zh: "缓解因素",
  },
  "증상 전후와 받은 진료": {
    en: "Context and care received",
    ja: "症状の前後と受けた診療",
    zh: "症状前后与已接受的诊疗",
  },
  "증상 발생 전후 상황": {
    en: "Context before and after",
    ja: "症状発生前後の状況",
    zh: "症状发生前后情况",
  },
  "지금까지 받은 진료": {
    en: "Care received so far",
    ja: "これまでに受けた診療",
    zh: "目前已接受的诊疗",
  },
  "약·질문·가져갈 자료": {
    en: "Medicines, questions, and materials",
    ja: "薬・質問・持参する資料",
    zh: "药物、问题与携带资料",
  },
  "복용 중인 약과 건강보조제": {
    en: "Medicines and supplements",
    ja: "服用中の薬と健康補助食品",
    zh: "正在服用的药物与保健品",
  },
  "의료진께 확인할 질문": {
    en: "Questions for the care team",
    ja: "医療スタッフに確認する質問",
    zh: "想向医护人员确认的问题",
  },
  "진료 시 가져갈 자료": {
    en: "Materials to bring",
    ja: "診療時に持参する資料",
    zh: "就诊时携带的资料",
  },
  "진료 타임라인": {
    en: "Visit timeline",
    ja: "診療タイムライン",
    zh: "就诊时间线",
  },
  "시기별 사건 추가하기": {
    en: "Add a timeline event",
    ja: "時期ごとの出来事を追加",
    zh: "添加时间线事件",
  },
  "꼭 확인해 주세요": {
    en: "Please note",
    ja: "ご確認ください",
    zh: "请确认",
  },
  "본 서비스는 진단이나 처방을 제공하지 않아요. 작성한 리포트는 진료 전 정보 정리를 돕기 위한 자료예요. 의학적 판단은 반드시 의료진과 상의해 주세요.": {
    en: "This service does not diagnose or prescribe. The report only helps organize information before a visit. Please discuss medical decisions with a qualified professional.",
    ja: "本サービスは診断や処方を行いません。レポートは診療前の情報整理を助ける資料です。医学的な判断は必ず医療スタッフにご相談ください。",
    zh: "本服务不提供诊断或处方。报告仅用于帮助整理就诊前信息。医疗判断请务必咨询专业医护人员。",
  },
  "진료한장 미리보기": {
    en: "Care brief preview",
    ja: "診療一枚プレビュー",
    zh: "诊疗一页预览",
  },
  "실시간 미리보기": {
    en: "Live preview",
    ja: "リアルタイムプレビュー",
    zh: "实时预览",
  },
  "입력한 내용만 한 장에 보여요.": {
    en: "Only completed fields appear on the page.",
    ja: "入力した内容だけが一枚に表示されます。",
    zh: "一页中只会显示已填写的内容。",
  },
  "현재 가장 불편한 증상": {
    en: "Current most troubling symptom",
    ja: "現在いちばんつらい症状",
    zh: "当前最困扰的症状",
  },
  "부모님의 이야기를 기다리고 있어요.": {
    en: "Waiting for your parent’s story.",
    ja: "ご両親のお話を待っています。",
    zh: "正在等待父母的故事。",
  },
  "왼쪽에서 내용을 입력하면 이곳에 한 장으로 정리돼요.": {
    en: "Enter details on the left to organize them here.",
    ja: "左側に入力すると、ここに一枚で整理されます。",
    zh: "在左侧输入内容后，会在这里整理成一页。",
  },
  "PDF로 저장하기 · 인쇄하기": {
    en: "Save as PDF · Print",
    ja: "PDF保存・印刷",
    zh: "保存为 PDF · 打印",
  },
  공유하기: { en: "Share", ja: "共有", zh: "分享" },
  "메일로 보내기": { en: "Send by email", ja: "メールで送る", zh: "邮件发送" },
  "이런 경험이 있다면 함께해주세요.": {
    en: "Join us if this feels familiar.",
    ja: "こんな経験があれば、ぜひご一緒ください。",
    zh: "如果你有这些经历，欢迎加入我们。",
  },
  "베타테스트는 이렇게 진행될 예정이에요.": {
    en: "Here is how beta testing will work.",
    ja: "ベータテストはこのように進む予定です。",
    zh: "内测计划将按以下方式进行。",
  },
  "부모님 진료를 평소 어떻게 챙기는지 간단히 알려주세요.": {
    en: "Tell us briefly how you usually prepare for your parent’s visits.",
    ja: "普段どのようにご両親の診療を準備しているか、簡単に教えてください。",
    zh: "请简单告诉我们你平时如何为父母准备就诊。",
  },
  "진료한장의 초기 화면이나 기능을 가볍게 함께 살펴봐요.": {
    en: "Take a relaxed look at the early screens and features.",
    ja: "診療一枚の初期画面や機能を気軽に一緒に見てみます。",
    zh: "轻松体验诊疗一页的初期界面和功能。",
  },
  "편했던 점과 불편했던 점을 솔직하고 편하게 알려주세요.": {
    en: "Share honestly what felt easy or difficult.",
    ja: "便利だった点、不便だった点を率直に気軽に教えてください。",
    zh: "请坦率、轻松地告诉我们哪些地方方便或不便。",
  },
  "실제로 어떤 기능이 있으면 좋을지 편하게 이야기를 나눠요.": {
    en: "Talk with us about the features you would truly find useful.",
    ja: "実際にどんな機能があるとよいか、気軽にお話しします。",
    zh: "轻松聊聊你真正希望有哪些功能。",
  },
  "전문적인 의견이나 어려운 설명은 필요하지 않아요. 평소 경험을 편하게 말씀해주시면 된답니다.": {
    en: "No expert knowledge is needed. Simply share your everyday experience.",
    ja: "専門的な意見や難しい説明は必要ありません。普段の経験を気軽にお聞かせください。",
    zh: "不需要专业意见或复杂说明，只需轻松分享平时的经历。",
  },
  "부모님 진료 준비,": {
    en: "Preparing for your parent’s visit,",
    ja: "ご両親の診療準備を、",
    zh: "父母的就诊准备，",
  },
  "한 장부터 함께 만들어볼까요?": {
    en: "shall we start with one page?",
    ja: "まず一枚から一緒に作りませんか？",
    zh: "要不要从一页开始一起做？",
  },
  "부모님 진료, 한 장 먼저 챙겨보기": {
    en: "Prepare one page for your parent",
    ja: "ご両親の診療を一枚から準備",
    zh: "先为父母准备一页",
  },
  "자주 묻는 질문": {
    en: "Frequently asked questions",
    ja: "よくある質問",
    zh: "常见问题",
  },
  "진료한장은 병을 진단해주는 서비스인가요?": {
    en: "Does Jinryo Hanjang diagnose conditions?",
    ja: "診療一枚は病気を診断するサービスですか？",
    zh: "诊疗一页会诊断疾病吗？",
  },
  "부모님이 직접 사용해야 하나요?": {
    en: "Does my parent have to use it directly?",
    ja: "両親本人が使う必要がありますか？",
    zh: "必须由父母本人使用吗？",
  },
  "부모님의 건강정보를 입력해도 괜찮을까요?": {
    en: "Is it okay to enter my parent’s health information?",
    ja: "両親の健康情報を入力しても大丈夫ですか？",
    zh: "可以输入父母的健康信息吗？",
  },
  "서비스는 언제 사용할 수 있나요?": {
    en: "When can I use the service?",
    ja: "サービスはいつ利用できますか？",
    zh: "什么时候可以使用服务？",
  },
  "서비스 이용료가 있나요?": {
    en: "Is there a fee?",
    ja: "利用料金はかかりますか？",
    zh: "服务收费吗？",
  },
  "진단·처방이 아닌 진료 전 정보 정리 서비스": {
    en: "A pre-visit information organizer, not a diagnostic or prescribing service",
    ja: "診断・処方ではなく、診療前の情報整理サービス",
    zh: "就诊前信息整理服务，不提供诊断或处方",
  },
  "부모님이 직접 불편한 점을 말씀하시거나, 자녀가 대신 입력할 수 있어요. 꼭 정확한 문장으로 말하지 않아도 괜찮아요.": {
    en: "A parent can describe what feels uncomfortable, or a child can enter it for them. It does not need to be perfectly worded.",
    ja: "ご両親が不調を直接話しても、お子さまが代わりに入力しても大丈夫です。正確な文章でなくてもかまいません。",
    zh: "父母可以直接说出不适，也可以由子女代为输入，不必使用完全准确的句子。",
  },
  "증상, 복용 중인 약, 최근 달라진 점과 궁금한 내용을 자녀가 확인하고 필요한 부분을 더할 수 있어요.": {
    en: "A child can review symptoms, current medicines, recent changes, and questions, then add what is missing.",
    ja: "症状、服用中の薬、最近の変化、聞きたいことをお子さまが確認し、必要な内容を補えます。",
    zh: "子女可以确认症状、正在服用的药物、近期变化和疑问，并补充所需内容。",
  },
  "병원에서 빠르게 볼 수 있도록 중요한 내용만 한 장으로 정리해 가족에게 보내거나 직접 가져갈 수 있어요.": {
    en: "Keep only the important details on one page, ready to send to family or bring to the clinic.",
    ja: "病院ですぐ確認できるよう大切な内容だけを一枚にまとめ、家族に送るか持参できます。",
    zh: "只把重要内容整理成一页，方便发给家人或直接带到医院。",
  },
  "이름을 적지 않아도 증상과 복용약은 건강정보일 수 있어요. AI 정리는 기기 안에서 진행하고 외부 무료 AI로 보내지 않아요.": {
    en: "Symptoms and medicines can still be health information even without a name. AI organization happens on this device and is not sent to an external free AI service.",
    ja: "名前を書かなくても、症状や服用薬は健康情報にあたる場合があります。AI整理は端末内で行い、外部の無料AIには送りません。",
    zh: "即使不填写姓名，症状和用药也可能属于健康信息。AI 整理在设备内完成，不会发送给外部免费 AI。",
  },
  "음성 입력은 브라우저 기본 기능을 사용해요. 말하기 전에는 사용 중인 브라우저의 개인정보 안내도 함께 확인해 주세요.": {
    en: "Voice input uses your browser’s built-in feature. Please review your browser’s privacy information before speaking.",
    ja: "音声入力はブラウザの標準機能を使います。話す前に、利用中のブラウザのプライバシー案内もご確認ください。",
    zh: "语音输入使用浏览器内置功能。开始说话前，请同时查看所用浏览器的隐私说明。",
  },
  "어떤 정보를 왜 모으는지 먼저 이해하기 쉽게 알려드려요.": {
    en: "We will clearly explain what information is collected and why.",
    ja: "どの情報をなぜ集めるのか、まず分かりやすくお伝えします。",
    zh: "我们会先清楚说明收集哪些信息以及原因。",
  },
  "보관 기간과 삭제 방법, 가족과 공유하는 범위를 정해둘게요.": {
    en: "We will define retention, deletion, and the scope of family sharing.",
    ja: "保存期間、削除方法、家族と共有する範囲を定めます。",
    zh: "我们会明确保存期限、删除方式和与家人共享的范围。",
  },
  "정보를 볼 수 있는 사람과 접근 권한을 꼼꼼하게 나눌게요.": {
    en: "We will carefully separate who can view information and what they can access.",
    ja: "情報を見られる人とアクセス権限を丁寧に分けます。",
    zh: "我们会谨慎区分谁可以查看信息以及相应权限。",
  },
  "법률 검토를 마친 개인정보 처리방침을 출시 전에 공개할게요.": {
    en: "A legally reviewed privacy policy will be published before launch.",
    ja: "法的確認を終えたプライバシーポリシーをリリース前に公開します。",
    zh: "正式发布前会公开经过法律审查的隐私政策。",
  },
  "정식 서비스의 저장·공유 방식은 지금 체험판과 달라질 수 있어요. 민감한 건강정보를 입력하기 전에는 그때 공개되는 개인정보 처리방식을 꼭 확인해 주세요.": {
    en: "Storage and sharing in the full service may differ from this trial. Please review the published privacy practices before entering sensitive health information.",
    ja: "正式版の保存・共有方法は現在の体験版と異なる場合があります。機微な健康情報を入力する前に、その時点で公開される取扱方法を必ずご確認ください。",
    zh: "正式服务的保存与共享方式可能与当前体验版不同。输入敏感健康信息前，请务必查看届时公开的隐私处理方式。",
  },
  "순서나 형식을 신경 쓰지 않아도 괜찮아요. 부모님께 들은 이야기, 약, 궁금한 점을 기억나는 대로 적어주세요.": {
    en: "Do not worry about order or format. Write down what your parent told you, their medicines, and any questions you remember.",
    ja: "順番や形式は気にしなくて大丈夫です。ご両親から聞いたこと、薬、気になることを思い出すままに書いてください。",
    zh: "不用在意顺序或格式，请按记忆写下父母讲过的情况、药物和疑问。",
  },
  "마이크 버튼을 누르고 한국어로 편하게 말씀해 주세요.": {
    en: "Press the microphone button and speak naturally.",
    ja: "マイクボタンを押して、気軽にお話しください。",
    zh: "点击麦克风按钮后自然地说话即可。",
  },
  "편하게 적어주시면 필요한 항목으로 나눠드려요.": {
    en: "Write naturally and the details will be sorted into the right fields.",
    ja: "気軽に書くと、必要な項目に分けて整理します。",
    zh: "自然填写后，内容会被整理到相应项目中。",
  },
  "이 서비스는 부모님이 더 쉽고 빠르게 사용하실 수 있도록 앱으로 출시될 거예요.": {
    en: "This service will be released as an app so parents can use it more easily and quickly.",
    ja: "ご両親がもっと簡単に使えるよう、アプリとしてリリースする予定です。",
    zh: "这项服务将以应用形式发布，让父母使用起来更简单快捷。",
  },
  "지금 베타테스터를 모집하고 있어요.": {
    en: "We are currently looking for beta testers.",
    ja: "現在、ベータテスターを募集しています。",
    zh: "目前正在招募内测用户。",
  },
  "신청은 유료 가입이나 결제가 아니며, 참여 방법을 확인한 뒤 결정해도 괜찮아요.": {
    en: "Applying does not start a paid subscription or payment. You can decide after reviewing how participation works.",
    ja: "応募は有料登録や決済ではありません。参加方法を確認してから決めても大丈夫です。",
    zh: "申请不代表付费注册或付款，你可以了解参与方式后再决定。",
  },
  "이 브라우저에서 미리보기를 만드는 동안만 사용돼요. 민감한 건강정보를 입력하기 전 개인정보 처리 방식을 반드시 확인해 주세요.": {
    en: "The information is used only to create this preview in your browser. Please review privacy practices before entering sensitive health information.",
    ja: "このブラウザでプレビューを作る間だけ使用します。機微な健康情報を入力する前に、取扱方法を必ずご確認ください。",
    zh: "这些信息仅用于在当前浏览器中生成预览。输入敏感健康信息前，请务必确认隐私处理方式。",
  },
  "한 줄에 하나씩": {
    en: "One item per line",
    ja: "1行に1つ",
    zh: "每行一项",
  },
  "위에서부터 최대 3개 표시": {
    en: "Up to 3, starting from the top",
    ja: "上から最大3つ表示",
    zh: "从上到下最多显示 3 项",
  },
  "증상 시작 시점은 자동으로 반영돼요. 그 밖의 변화나 진료를 시기별로 더해보세요. 같은 시기는 한 행으로 묶여요.": {
    en: "The symptom start is added automatically. Add other changes or visits by time; events from the same time are grouped in one row.",
    ja: "症状の開始時期は自動で反映されます。ほかの変化や診療を時期ごとに追加してください。同じ時期は一行にまとめます。",
    zh: "症状开始时间会自动显示。请按时间补充其他变化或诊疗；同一时期的事件会合并为一行。",
  },
  시기: { en: "Time", ja: "時期", zh: "时期" },
  "있었던 일": { en: "What happened", ja: "あったこと", zh: "发生的事情" },
  "시간의 흐름에 따라 정리했어요": {
    en: "Organized over time",
    ja: "時間の流れに沿って整理しました",
    zh: "按时间顺序整理",
  },
  "증상과 진료의 흐름": {
    en: "Symptoms and care",
    ja: "症状と診療の流れ",
    zh: "症状与诊疗过程",
  },
  "본 자료는 진료 전 정보 정리를 위한 것으로, 진단이나 처방을 제공하지 않아요.": {
    en: "This page organizes pre-visit information and does not provide diagnosis or prescriptions.",
    ja: "本資料は診療前の情報整理を目的とし、診断や処方は行いません。",
    zh: "本资料用于整理就诊前信息，不提供诊断或处方。",
  },
  "인쇄 창에서 PDF로 저장할 수 있어요. 공유 버튼을 누르면 리포트 내용이 선택한 앱이나 메일 앱으로 넘어가요.": {
    en: "Save as PDF from the print dialog. Share sends the report text to the app or email service you choose.",
    ja: "印刷画面からPDFとして保存できます。共有ボタンを押すと、レポート内容が選んだアプリやメールアプリに渡ります。",
    zh: "可在打印窗口中保存为 PDF。点击分享后，报告内容会发送到你选择的应用或邮件应用。",
  },
  "부모님과 따로 살고 있어요.": {
    en: "You live separately from your parents.",
    ja: "ご両親と別に暮らしています。",
    zh: "你与父母分开居住。",
  },
  "정기적으로 병원에 다니시는 부모님이 있어요.": {
    en: "Your parent visits a clinic regularly.",
    ja: "定期的に通院しているご両親がいます。",
    zh: "你的父母需要定期去医院。",
  },
  "부모님의 증상이나 복용약을 가끔 확인해요.": {
    en: "You sometimes check your parent’s symptoms or medicines.",
    ja: "ご両親の症状や服用薬を時々確認します。",
    zh: "你有时会确认父母的症状或用药。",
  },
  "직장이나 거리 문제로 매번 병원에 같이 가지는 못해요.": {
    en: "Work or distance means you cannot attend every appointment.",
    ja: "仕事や距離の都合で、毎回付き添うことはできません。",
    zh: "因为工作或距离问题，无法每次都陪同就诊。",
  },
  "진료 전에 부모님이 무슨 말을 해야 할지 정리해본 적이 있어요.": {
    en: "You have helped organize what your parent should say before a visit.",
    ja: "診療前に、ご両親が何を話すか整理したことがあります。",
    zh: "你曾在就诊前帮父母整理要说的内容。",
  },
  "약봉투 사진이나 병원 이야기를 카카오톡으로 받아본 적이 있어요.": {
    en: "You have received medication photos or hospital updates through messaging.",
    ja: "薬袋の写真や病院の話をメッセージで受け取ったことがあります。",
    zh: "你曾通过聊天软件收到药袋照片或医院情况。",
  },
  "부모님 진료 준비가 조금 더 간단했으면 좋겠다고 느껴요.": {
    en: "You wish preparing for your parent’s visit could be simpler.",
    ja: "ご両親の診療準備がもう少し簡単ならと思います。",
    zh: "你希望父母的就诊准备能更简单一些。",
  },
  "아직 완성된 서비스는 아니에요.": {
    en: "This is not a finished service yet.",
    ja: "まだ完成したサービスではありません。",
    zh: "这项服务目前还未完成。",
  },
  "부모님 진료를 챙겨보신 분들의 실제 경험을 들으며 더 편하고 따뜻한 방법을 만들어가고 있답니다.": {
    en: "We are shaping a warmer, easier approach by listening to people who have prepared for their parents’ visits.",
    ja: "ご両親の診療を支えてきた方々の実際の経験を聞きながら、もっと便利でやさしい方法を作っています。",
    zh: "我们正倾听有过父母就诊准备经历的人，打造更方便、更温暖的方法。",
  },
  "부모님 병원 진료를 챙겨본 경험이 있다면, 진료한장이 우리 가족에게 진짜 도움이 될지 소중한 의견을 들려주세요.": {
    en: "If you have helped with a parent’s medical visits, tell us whether Jinryo Hanjang could truly help your family.",
    ja: "ご両親の診療を支えた経験があれば、診療一枚がご家族の助けになるか、ぜひご意見をお聞かせください。",
    zh: "如果你有过帮助父母就诊的经历，请告诉我们诊疗一页是否真的能帮助你的家庭。",
  },
  "신청한다고 유료 서비스에 가입되거나 결제가 진행되지 않아요.": {
    en: "Applying will not create a paid subscription or charge you.",
    ja: "応募しても有料サービスへの登録や決済は行われません。",
    zh: "申请不会开通付费服务，也不会产生扣款。",
  },
  "베타테스트 일정과 참여 방법은 신청하신 분께 안내드려요.": {
    en: "Applicants will receive the beta schedule and participation details.",
    ja: "ベータテストの日程と参加方法は、応募した方にご案内します。",
    zh: "我们会向申请者说明内测时间和参与方式。",
  },
  "안내 내용을 확인한 뒤 참여 여부를 결정해도 괜찮아요.": {
    en: "You can decide whether to participate after reading the details.",
    ja: "案内を確認してから参加するか決めて大丈夫です。",
    zh: "查看说明后再决定是否参与也可以。",
  },
  "유료 가입이나 결제가 아닌 베타테스터 신청이에요.": {
    en: "This is a beta application, not a paid signup or payment.",
    ja: "有料登録や決済ではなく、ベータテスターへの応募です。",
    zh: "这是内测申请，不是付费注册或付款。",
  },
  "아니요, 진료한장은 진단이나 처방을 해주는 곳은 아니에요. 부모님이 병원에서 전해야 할 증상과 복용약, 궁금한 내용을 미리 쉽게 정리하도록 돕는 서비스랍니다.": {
    en: "No. Jinryo Hanjang does not diagnose or prescribe. It helps organize symptoms, medicines, and questions your parent may need to share at the clinic.",
    ja: "いいえ。診療一枚は診断や処方を行いません。病院で伝える症状、服用薬、質問を事前に分かりやすく整理するお手伝いをします。",
    zh: "不会。诊疗一页不提供诊断或处方，只帮助提前整理父母在医院需要说明的症状、用药和疑问。",
  },
  "부모님이 직접 말씀하실 수도 있고, 자녀가 대신 입력하거나 함께 내용을 확인할 수도 있어요. 편하신 방법을 선택하시면 된답니다.": {
    en: "A parent can speak directly, or a child can enter and review the information with them. Choose whichever feels easiest.",
    ja: "ご両親が直接話しても、お子さまが代わりに入力したり一緒に確認したりしても大丈夫です。使いやすい方法を選べます。",
    zh: "父母可以直接讲述，也可以由子女代为输入或一起确认，选择最方便的方式即可。",
  },
  "부모님의 병명이나 자세한 건강정보를 입력해야 하나요?": {
    en: "Do I need to enter a diagnosis or detailed health information?",
    ja: "病名や詳しい健康情報を入力する必要がありますか？",
    zh: "需要输入父母的病名或详细健康信息吗？",
  },
  "신청하면 꼭 베타테스트에 참여해야 하나요?": {
    en: "Do I have to participate after applying?",
    ja: "応募したら必ずベータテストに参加する必要がありますか？",
    zh: "申请后必须参加内测吗？",
  },
  "부모님과 함께 살지 않아도 사용할 수 있나요?": {
    en: "Can I use it if I do not live with my parents?",
    ja: "両親と同居していなくても使えますか？",
    zh: "不和父母同住也可以使用吗？",
  },
  "현재 체험판에서는 입력한 내용이 서버에 저장되지 않아요. 리포트와 AI 정리는 사용 중인 브라우저 안에서 처리되며, 화면을 새로고침하면 입력 내용이 사라져요. 실제 출시 서비스의 저장과 공유 방식은 개인정보와 건강정보를 안전하게 관리할 수 있도록 법률 검토와 테스트 결과를 반영해 설계할 예정이에요.": {
    en: "In this trial, entries are not saved on a server. The report and AI organization run in your browser, and refreshing clears the content. Storage and sharing for the full service will be designed after legal review and testing to protect personal and health information.",
    ja: "現在の体験版では入力内容をサーバーに保存しません。レポートとAI整理はブラウザ内で処理され、再読み込みすると内容は消えます。正式版の保存・共有方法は、個人情報と健康情報を安全に管理できるよう、法的確認とテスト結果を反映して設計する予定です。",
    zh: "当前体验版不会把输入内容保存到服务器。报告和 AI 整理在浏览器内完成，刷新页面后内容会消失。正式服务的保存与共享方式将结合法律审查和测试结果进行设计，以安全管理个人与健康信息。",
  },
  "지금 이 페이지에서 체험판을 사용해볼 수 있어요. 정식 서비스는 부모님 진료를 챙기시는 자녀분들의 진짜 불편함과 생생한 경험을 듣고, 베타테스터분들의 의견을 충분히 반영해 꼭 필요한 기능과 출시 시기를 결정할 예정이에요.": {
    en: "You can try the experience on this page now. The full service’s features and launch timing will be decided after listening to real experiences and beta feedback.",
    ja: "今このページで体験版をお試しいただけます。正式版の機能とリリース時期は、ご両親の診療を支える方の実際の悩みやベータテスターの意見を十分に反映して決める予定です。",
    zh: "现在即可在本页面体验。正式服务会充分听取子女的真实困扰和内测反馈，再决定必要功能与发布时间。",
  },
  "베타테스터 신청 단계에서는 구체적인 병명이나 진료기록을 입력하지 않으셔도 돼요. 부모님의 병원 방문 빈도와 평소 진료를 어떻게 챙기고 계신지 정도만 간단히 여쭤보고 있어요.": {
    en: "The beta application does not require a specific diagnosis or medical records. We only ask briefly how often your parent visits a clinic and how you usually help prepare.",
    ja: "ベータテスター応募時に、具体的な病名や診療記録を入力する必要はありません。通院頻度や普段どのように診療を支えているかを簡単に伺います。",
    zh: "申请内测时无需填写具体病名或诊疗记录。我们只会简单了解父母的就诊频率，以及你平时如何帮助准备。",
  },
  "아니요, 부담 갖지 않으셔도 괜찮아요. 신청해주시면 일정과 참여 방법을 먼저 안내해 드릴 테니, 내용을 천천히 확인하시고 편하게 결정해 주세요.": {
    en: "No. There is no obligation. We will share the schedule and participation details first, and you can decide comfortably after reviewing them.",
    ja: "いいえ、負担に感じなくて大丈夫です。日程と参加方法を先にご案内しますので、内容をゆっくり確認してから決めてください。",
    zh: "不必，申请后没有参与义务。我们会先说明时间和参与方式，你可以慢慢了解后再决定。",
  },
  "지금은 서비스가 정말 필요한지, 어떻게 쓰면 편할지 확인하는 베타테스트 단계라서 정식 서비스의 요금이나 결제 방식은 아직 정해지지 않았어요. 현재 체험판과 베타테스터 신청은 무료이며 결제가 진행되지 않아요.": {
    en: "We are still testing whether the service is needed and how it should work, so pricing for the full service has not been decided. This trial and beta application are free and do not charge you.",
    ja: "現在はサービスの必要性と使いやすい形を確認するベータ段階のため、正式版の料金や決済方法はまだ決まっていません。体験版とベータテスター応募は無料で、決済は行われません。",
    zh: "目前仍处于验证服务需求和易用方式的内测阶段，正式服务的价格和支付方式尚未确定。当前体验版和内测申请免费，不会产生扣款。",
  },
  "네, 맞아요. 부모님과 따로 살면서 전화나 카카오톡으로 마음 졸이며 진료를 챙기고 계신 자녀분들을 가장 먼저 생각하며 만들고 있답니다.": {
    en: "Yes. We are designing this first for adult children who live apart and worry while helping through calls and messages.",
    ja: "はい。ご両親と別に暮らし、電話やメッセージで心配しながら診療を支えるお子さまをまず思い浮かべて作っています。",
    zh: "可以。我们最先想到的，正是那些与父母分开居住、通过电话和聊天牵挂并协助就诊的子女。",
  },
  "부모님의 진료를 준비하는 가장 다정한 한 장, 진료한장": {
    en: "Jinryo Hanjang, one caring page for your parent’s visit",
    ja: "ご両親の診療を準備する、いちばんやさしい一枚「診療一枚」",
    zh: "为父母就诊准备的最贴心一页，诊疗一页",
  },
};

export const normalizeInterfaceText = (value: string) =>
  value.replace(/\s+/g, " ").trim();

export const translateInterfaceText = (
  value: string,
  language: Language,
) => {
  if (language === "ko") return value;
  return copy[normalizeInterfaceText(value)]?.[language] ?? value;
};

export const isInterfaceTextVariant = (original: string, current: string) => {
  const normalizedCurrent = normalizeInterfaceText(current);
  if (normalizeInterfaceText(original) === normalizedCurrent) return true;
  return (["en", "ja", "zh"] as const).some(
    (language) =>
      normalizeInterfaceText(translateInterfaceText(original, language)) ===
      normalizedCurrent,
  );
};

export const pageMetadata: Record<
  Language,
  { title: string; description: string }
> = {
  ko: {
    title: "진료한장 | 부모님 진료 준비를 한 장에",
    description:
      "부모님의 증상, 복용약, 최근 변화와 질문을 병원에서 보여줄 한 장으로 정리해보세요.",
  },
  en: {
    title: "Jinryo Hanjang | One caring page for a parent’s visit",
    description:
      "Organize a parent’s symptoms, medicines, recent changes, and questions on one page for the clinic.",
  },
  ja: {
    title: "診療一枚 | ご両親の診療準備を一枚に",
    description:
      "ご両親の症状、服用薬、最近の変化、質問を、病院で見せられる一枚にまとめます。",
  },
  zh: {
    title: "诊疗一页 | 把父母的就诊准备整理成一页",
    description:
      "把父母的症状、用药、近期变化和问题整理成一页，方便在医院查看。",
  },
};
