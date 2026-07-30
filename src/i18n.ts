export type Language = "ko" | "en";

export const languageOptions: Array<{
  code: Language;
  label: string;
  htmlLang: string;
}> = [
  { code: "ko", label: "한국어", htmlLang: "ko" },
  { code: "en", label: "영어", htmlLang: "en" },
];

type LocalizedCopy = Record<Exclude<Language, "ko">, string>;

const copy: Record<string, LocalizedCopy> = {
  "진료한장 홈": {
    en: "Jinryo Hanjang home",
  },
  "주요 메뉴": {
    en: "Main navigation",
  },
  "이용 방법": {
    en: "How it works",
  },
  "개인정보 안내": {
    en: "Privacy",
  },
  만들어보기: {
    en: "Try it",
  },
  "부모님 진료,": {
    en: "Even when you cannot",
  },
  함께: {
    en: "be there",
  },
  "못 가도": {
    en: "in person,",
  },
  준비는: {
    en: "you can prepare",
  },
  "할 수 있어요.": {
    en: "together.",
  },
  "부모님의 진료를 준비하는 가장 다정한 한 장": {
    en: "One caring page to prepare for your parent’s visit",
  },
  "부모님의 증상, 복용약, 최근 변화와 궁금한 점을 병원에서 보여줄 한 장으로 정리해드려요.": {
    en: "Bring symptoms, medications, recent changes, and questions together on one page for the clinic.",
  },
  "진료한장 만들어보기": {
    en: "Create a care brief",
  },
  "베타테스터 신청하기": {
    en: "Apply for beta testing",
  },
  "진단이나 처방 대신, 진료 전에 필요한 정보를 함께 정리해요.": {
    en: "This organizes information before a visit; it does not diagnose or prescribe.",
  },
  "부모님 병원 가시는 날,": {
    en: "When your parent has an appointment,",
  },
  "이런 생각이 든 적 있나요?": {
    en: "have you ever had these worries?",
  },
  "언제부터 아프셨는지 병원에서 잘 설명하실 수 있을까?": {
    en: "Will they be able to explain when the pain started?",
  },
  "지금 드시는 약을 정확히 알고 계실까?": {
    en: "Will they remember exactly which medicines they take?",
  },
  "물어보려고 했던 걸 깜빡하지 않으실까?": {
    en: "Will they forget what they wanted to ask?",
  },
  "내가 같이 못 가는데, 중요한 이야기가 잘 전달될까?": {
    en: "If I cannot go, will the important details be shared?",
  },
  "전에 보내주신 약봉투 사진이 카톡 어디에 있었더라?": {
    en: "Where was that medication photo in our messages?",
  },
  "진료가 다 끝난 뒤에야 물어볼 게 생각난 적이 있다.": {
    en: "I have remembered a question only after the visit ended.",
  },
  "부모님을 챙기고 싶은 마음은 크지만,": {
    en: "You want to care for your parents,",
  },
  "필요한 정보가 전화와 카카오톡, 사진과 메모에 나뉘어 있는 경우가 참 많아요.": {
    en: "but the information is often scattered across calls, messages, photos, and notes.",
  },
  "진료한장은 익숙한 방법을 바꾸는 대신, 흩어진 내용을 진료 전에 한 번에 모을 수 있게 도와드려요.": {
    en: "Jinryo Hanjang keeps your familiar routines and simply gathers the scattered details before the visit.",
  },
  "지금도 나름의 방법으로": {
    en: "You are already caring",
  },
  "잘 챙기고 있어요.": {
    en: "in your own way.",
  },
  "전화로 어디가 불편하신지 다시 여쭤봐요": {
    en: "Call again to ask what feels uncomfortable",
  },
  "카톡에서 예전에 받은 약봉투 사진을 찾아요": {
    en: "Search messages for an old medication photo",
  },
  "생각나는 질문을 메모장에 따로 적어둬요": {
    en: "Write questions in a separate note",
  },
  "함께 가는 가족에게 내용을 다시 설명해요": {
    en: "Explain everything again to the family member going along",
  },
  "진료 때마다 비슷한 준비를 반복하게 돼요": {
    en: "Repeat the same preparation for every visit",
  },
  "필요한 정보는 이미 우리에게 있어요.": {
    en: "You already have the information you need.",
  },
  "진료 전에 한 번에 보기 쉽게 정리되지 않았을 뿐이랍니다.": {
    en: "It just has not been gathered into one easy view.",
  },
  "진료한장은 이 방법을 바꾸려는 게 아니라, 흩어진 내용을 한 번에 모을 수 있게 도와드려요.": {
    en: "Jinryo Hanjang does not replace those habits; it brings their details together.",
  },
  "진료한장은 부모님의 이야기를": {
    en: "Jinryo Hanjang turns your parent’s story",
  },
  "진료에 쓸 수 있는 한 장으로 정리해요.": {
    en: "into one useful page for the visit.",
  },
  "편하게 이야기하기": {
    en: "Speak naturally",
  },
  "함께 확인하기": {
    en: "Review together",
  },
  "한 장으로 챙겨가기": {
    en: "Bring one page",
  },
  "함께 병원에 가지 못하는 날에도, 진료 준비까지 혼자 맡겨두지 않으셔도 괜찮아요.": {
    en: "Even when you cannot go along, your parent does not have to prepare alone.",
  },
  "진료 준비는 간단할수록 좋아요.": {
    en: "Preparing for a visit should feel simple.",
  },
  "편하게 말하거나 입력해요": {
    en: "Speak or type naturally",
  },
  "부모님이나 자녀가 불편한 점과 궁금한 내용을 남겨주세요.": {
    en: "A parent or child can share discomforts and questions.",
  },
  "필요한 내용끼리 정리해요": {
    en: "Sort the key details",
  },
  "증상, 시작 시점, 복용약, 최근 변화와 질문으로 나눠요.": {
    en: "Organize symptoms, timing, medications, changes, and questions.",
  },
  "자녀가 한 번 더 확인해요": {
    en: "Review it once more",
  },
  "잘못 적힌 내용이나 빠진 부분이 없는지 쉽게 보완해요.": {
    en: "Correct mistakes and add anything that is missing.",
  },
  "병원에 가져가요": {
    en: "Take it to the clinic",
  },
  "완성된 진료한장을 가족에게 보내거나 인쇄해 챙겨가요.": {
    en: "Send the finished page to family or print it for the visit.",
  },
  말하기: { en: "Tell" },
  확인하기: { en: "Review" },
  "한 장 정리": { en: "One page" },
  "병원에서 보여주기": {
    en: "Show at the clinic",
  },
  "건강정보를 다루는 방식부터 다정하고 분명하게 알려드려요.": {
    en: "We explain clearly and gently how health information is handled.",
  },
  "지금 이용하는 체험판": {
    en: "This trial",
  },
  "적어주신 내용은 이 브라우저 안에서만 머물러요.": {
    en: "What you enter stays in this browser.",
  },
  "입력한 내용은 서버에 저장하지 않아요.": {
    en: "Your entries are not saved on a server.",
  },
  "새로고침하거나 창을 닫으면 입력 내용이 사라져요.": {
    en: "Refreshing or closing the window clears the entries.",
  },
  "앞으로 출시할 정식 서비스": {
    en: "The future full service",
  },
  "일상 데이터를 모으기 전에 안전한 기준부터 준비할게요.": {
    en: "We will set clear safeguards before collecting everyday data.",
  },
  "안내 확인하고 체험판 시작하기": {
    en: "Read this and start the trial",
  },
  "진료한장 처음 만나보기 (체험판)": {
    en: "Meet Jinryo Hanjang (Trial)",
  },
  "진료한장 처음 만나보기": {
    en: "Meet Jinryo Hanjang",
  },
  "(체험판)": {
    en: "(Trial)",
  },
  "부모님의 진료 이야기를 한 장에 담아보세요.": {
    en: "Put your parent’s visit story on one page.",
  },
  "아는 만큼만 적어도 괜찮아요. 비워둔 항목은 리포트에 나타나지 않아요.": {
    en: "Share only what you know. Empty fields will not appear in the report.",
  },
  "출시되는 서비스는 지금처럼 수기로 입력하지 않고, 일상 속의 데이터를 모아서 병원 가기 전에 바로 생성해줄 거예요.": {
    en: "The full service will gather everyday data and create the page before a visit, without manual entry like this trial.",
  },
  "문장으로 편하게 이야기해 주세요.": {
    en: "Tell the story in your own words.",
  },
  "부모님의 증상과 진료 준비 이야기": {
    en: "Your parent’s symptoms and visit preparation",
  },
  "음성으로 입력하기": {
    en: "Enter by voice",
  },
  "음성 입력 멈추기": {
    en: "Stop voice input",
  },
  "AI로 항목 자동 채우기": {
    en: "Autofill with on-device AI",
  },
  "무료 AI 준비 중": {
    en: "Preparing free AI",
  },
  "이야기 정리 중": {
    en: "Organizing the story",
  },
  "입력 내용은 서버에 저장되지 않아요.": {
    en: "Your entries are not saved on a server.",
  },
  "오늘 진료에서 확인할 것": {
    en: "What to confirm today",
  },
  작성일: { en: "Date" },
  "오늘 확인받고 싶은 내용": {
    en: "What you want to confirm today",
  },
  "가장 불편한 증상": {
    en: "Most troubling symptom",
  },
  "증상 시작 시점": {
    en: "When it started",
  },
  "발생 상황": {
    en: "When it happens",
  },
  "발생 양상": {
    en: "Pattern",
  },
  "악화 요인": {
    en: "What makes it worse",
  },
  "완화 요인": {
    en: "What makes it better",
  },
  "증상 전후와 받은 진료": {
    en: "Context and care received",
  },
  "증상 발생 전후 상황": {
    en: "Context before and after",
  },
  "지금까지 받은 진료": {
    en: "Care received so far",
  },
  "약·질문·가져갈 자료": {
    en: "Medicines, questions, and materials",
  },
  "복용 중인 약과 건강보조제": {
    en: "Medicines and supplements",
  },
  "의료진께 확인할 질문": {
    en: "Questions for the care team",
  },
  "진료 시 가져갈 자료": {
    en: "Materials to bring",
  },
  "진료 타임라인": {
    en: "Visit timeline",
  },
  "시기별 사건 추가하기": {
    en: "Add a timeline event",
  },
  "꼭 확인해 주세요": {
    en: "Please note",
  },
  "본 서비스는 진단이나 처방을 제공하지 않아요. 작성한 리포트는 진료 전 정보 정리를 돕기 위한 자료예요. 의학적 판단은 반드시 의료진과 상의해 주세요.": {
    en: "This service does not diagnose or prescribe. The report only helps organize information before a visit. Please discuss medical decisions with a qualified professional.",
  },
  "진료한장 미리보기": {
    en: "Care brief preview",
  },
  "실시간 미리보기": {
    en: "Live preview",
  },
  "입력한 내용만 한 장에 보여요.": {
    en: "Only completed fields appear on the page.",
  },
  "현재 가장 불편한 증상": {
    en: "Current most troubling symptom",
  },
  "부모님의 이야기를 기다리고 있어요.": {
    en: "Waiting for your parent’s story.",
  },
  "왼쪽에서 내용을 입력하면 이곳에 한 장으로 정리돼요.": {
    en: "Enter details on the left to organize them here.",
  },
  "PDF로 저장하기 · 인쇄하기": {
    en: "Save as PDF · Print",
  },
  공유하기: { en: "Share" },
  "메일로 보내기": { en: "Send by email" },
  "이런 경험이 있다면 함께해주세요.": {
    en: "Join us if this feels familiar.",
  },
  "베타테스트는 이렇게 진행될 예정이에요.": {
    en: "Here is how beta testing will work.",
  },
  "부모님 진료를 평소 어떻게 챙기는지 간단히 알려주세요.": {
    en: "Tell us briefly how you usually prepare for your parent’s visits.",
  },
  "진료한장의 초기 화면이나 기능을 가볍게 함께 살펴봐요.": {
    en: "Take a relaxed look at the early screens and features.",
  },
  "편했던 점과 불편했던 점을 솔직하고 편하게 알려주세요.": {
    en: "Share honestly what felt easy or difficult.",
  },
  "실제로 어떤 기능이 있으면 좋을지 편하게 이야기를 나눠요.": {
    en: "Talk with us about the features you would truly find useful.",
  },
  "전문적인 의견이나 어려운 설명은 필요하지 않아요. 평소 경험을 편하게 말씀해주시면 된답니다.": {
    en: "No expert knowledge is needed. Simply share your everyday experience.",
  },
  "부모님 진료 준비,": {
    en: "Preparing for your parent’s visit,",
  },
  "한 장부터 함께 만들어볼까요?": {
    en: "shall we start with one page?",
  },
  "부모님 진료, 한 장 먼저 챙겨보기": {
    en: "Prepare one page for your parent",
  },
  "자주 묻는 질문": {
    en: "Frequently asked questions",
  },
  "진료한장은 병을 진단해주는 서비스인가요?": {
    en: "Does Jinryo Hanjang diagnose conditions?",
  },
  "부모님이 직접 사용해야 하나요?": {
    en: "Does my parent have to use it directly?",
  },
  "부모님의 건강정보를 입력해도 괜찮을까요?": {
    en: "Is it okay to enter my parent’s health information?",
  },
  "서비스는 언제 사용할 수 있나요?": {
    en: "When can I use the service?",
  },
  "서비스 이용료가 있나요?": {
    en: "Is there a fee?",
  },
  "진단·처방이 아닌 진료 전 정보 정리 서비스": {
    en: "A pre-visit information organizer, not a diagnostic or prescribing service",
  },
  "부모님이 직접 불편한 점을 말씀하시거나, 자녀가 대신 입력할 수 있어요. 꼭 정확한 문장으로 말하지 않아도 괜찮아요.": {
    en: "A parent can describe what feels uncomfortable, or a child can enter it for them. It does not need to be perfectly worded.",
  },
  "증상, 복용 중인 약, 최근 달라진 점과 궁금한 내용을 자녀가 확인하고 필요한 부분을 더할 수 있어요.": {
    en: "A child can review symptoms, current medicines, recent changes, and questions, then add what is missing.",
  },
  "병원에서 빠르게 볼 수 있도록 중요한 내용만 한 장으로 정리해 가족에게 보내거나 직접 가져갈 수 있어요.": {
    en: "Keep only the important details on one page, ready to send to family or bring to the clinic.",
  },
  "이름을 적지 않아도 증상과 복용약은 건강정보일 수 있어요. AI 정리는 기기 안에서 진행하고 외부 무료 AI로 보내지 않아요.": {
    en: "Symptoms and medicines can still be health information even without a name. AI organization happens on this device and is not sent to an external free AI service.",
  },
  "음성 입력은 브라우저 기본 기능을 사용해요. 말하기 전에는 사용 중인 브라우저의 개인정보 안내도 함께 확인해 주세요.": {
    en: "Voice input uses your browser’s built-in feature. Please review your browser’s privacy information before speaking.",
  },
  "어떤 정보를 왜 모으는지 먼저 이해하기 쉽게 알려드려요.": {
    en: "We will clearly explain what information is collected and why.",
  },
  "보관 기간과 삭제 방법, 가족과 공유하는 범위를 정해둘게요.": {
    en: "We will define retention, deletion, and the scope of family sharing.",
  },
  "정보를 볼 수 있는 사람과 접근 권한을 꼼꼼하게 나눌게요.": {
    en: "We will carefully separate who can view information and what they can access.",
  },
  "법률 검토를 마친 개인정보 처리방침을 출시 전에 공개할게요.": {
    en: "A legally reviewed privacy policy will be published before launch.",
  },
  "정식 서비스의 저장·공유 방식은 지금 체험판과 달라질 수 있어요. 민감한 건강정보를 입력하기 전에는 그때 공개되는 개인정보 처리방식을 꼭 확인해 주세요.": {
    en: "Storage and sharing in the full service may differ from this trial. Please review the published privacy practices before entering sensitive health information.",
  },
  "순서나 형식을 신경 쓰지 않아도 괜찮아요. 부모님께 들은 이야기, 약, 궁금한 점을 기억나는 대로 적어주세요.": {
    en: "Do not worry about order or format. Write down what your parent told you, their medicines, and any questions you remember.",
  },
  "마이크 버튼을 누르고 한국어로 편하게 말씀해 주세요.": {
    en: "Press the microphone button and speak naturally.",
  },
  "편하게 적어주시면 필요한 항목으로 나눠드려요.": {
    en: "Write naturally and the details will be sorted into the right fields.",
  },
  "이 서비스는 부모님이 더 쉽고 빠르게 사용하실 수 있도록 앱으로 출시될 거예요.": {
    en: "This service will be released as an app so parents can use it more easily and quickly.",
  },
  "지금 베타테스터를 모집하고 있어요.": {
    en: "We are currently looking for beta testers.",
  },
  "신청은 유료 가입이나 결제가 아니며, 참여 방법을 확인한 뒤 결정해도 괜찮아요.": {
    en: "Applying does not start a paid subscription or payment. You can decide after reviewing how participation works.",
  },
  "이 브라우저에서 미리보기를 만드는 동안만 사용돼요. 민감한 건강정보를 입력하기 전 개인정보 처리 방식을 반드시 확인해 주세요.": {
    en: "The information is used only to create this preview in your browser. Please review privacy practices before entering sensitive health information.",
  },
  "한 줄에 하나씩": {
    en: "One item per line",
  },
  "위에서부터 최대 3개 표시": {
    en: "Up to 3, starting from the top",
  },
  "증상 시작 시점은 자동으로 반영돼요. 그 밖의 변화나 진료를 시기별로 더해보세요. 같은 시기는 한 행으로 묶여요.": {
    en: "The symptom start is added automatically. Add other changes or visits by time; events from the same time are grouped in one row.",
  },
  시기: { en: "Time" },
  "있었던 일": { en: "What happened" },
  "시간의 흐름에 따라 정리했어요": {
    en: "Organized over time",
  },
  "증상과 진료의 흐름": {
    en: "Symptoms and care",
  },
  "본 자료는 진료 전 정보 정리를 위한 것으로, 진단이나 처방을 제공하지 않아요.": {
    en: "This page organizes pre-visit information and does not provide diagnosis or prescriptions.",
  },
  "인쇄 창에서 PDF로 저장할 수 있어요. 공유 버튼을 누르면 리포트 내용이 선택한 앱이나 메일 앱으로 넘어가요.": {
    en: "Save as PDF from the print dialog. Share sends the report text to the app or email service you choose.",
  },
  "부모님과 따로 살고 있어요.": {
    en: "You live separately from your parents.",
  },
  "정기적으로 병원에 다니시는 부모님이 있어요.": {
    en: "Your parent visits a clinic regularly.",
  },
  "부모님의 증상이나 복용약을 가끔 확인해요.": {
    en: "You sometimes check your parent’s symptoms or medicines.",
  },
  "직장이나 거리 문제로 매번 병원에 같이 가지는 못해요.": {
    en: "Work or distance means you cannot attend every appointment.",
  },
  "진료 전에 부모님이 무슨 말을 해야 할지 정리해본 적이 있어요.": {
    en: "You have helped organize what your parent should say before a visit.",
  },
  "약봉투 사진이나 병원 이야기를 카카오톡으로 받아본 적이 있어요.": {
    en: "You have received medication photos or hospital updates through messaging.",
  },
  "부모님 진료 준비가 조금 더 간단했으면 좋겠다고 느껴요.": {
    en: "You wish preparing for your parent’s visit could be simpler.",
  },
  "아직 완성된 서비스는 아니에요.": {
    en: "This is not a finished service yet.",
  },
  "부모님 진료를 챙겨보신 분들의 실제 경험을 들으며 더 편하고 따뜻한 방법을 만들어가고 있답니다.": {
    en: "We are shaping a warmer, easier approach by listening to people who have prepared for their parents’ visits.",
  },
  "부모님 병원 진료를 챙겨본 경험이 있다면, 진료한장이 우리 가족에게 진짜 도움이 될지 소중한 의견을 들려주세요.": {
    en: "If you have helped with a parent’s medical visits, tell us whether Jinryo Hanjang could truly help your family.",
  },
  "신청한다고 유료 서비스에 가입되거나 결제가 진행되지 않아요.": {
    en: "Applying will not create a paid subscription or charge you.",
  },
  "베타테스트 일정과 참여 방법은 신청하신 분께 안내드려요.": {
    en: "Applicants will receive the beta schedule and participation details.",
  },
  "안내 내용을 확인한 뒤 참여 여부를 결정해도 괜찮아요.": {
    en: "You can decide whether to participate after reading the details.",
  },
  "유료 가입이나 결제가 아닌 베타테스터 신청이에요.": {
    en: "This is a beta application, not a paid signup or payment.",
  },
  "아니요, 진료한장은 진단이나 처방을 해주는 곳은 아니에요. 부모님이 병원에서 전해야 할 증상과 복용약, 궁금한 내용을 미리 쉽게 정리하도록 돕는 서비스랍니다.": {
    en: "No. Jinryo Hanjang does not diagnose or prescribe. It helps organize symptoms, medicines, and questions your parent may need to share at the clinic.",
  },
  "부모님이 직접 말씀하실 수도 있고, 자녀가 대신 입력하거나 함께 내용을 확인할 수도 있어요. 편하신 방법을 선택하시면 된답니다.": {
    en: "A parent can speak directly, or a child can enter and review the information with them. Choose whichever feels easiest.",
  },
  "부모님의 병명이나 자세한 건강정보를 입력해야 하나요?": {
    en: "Do I need to enter a diagnosis or detailed health information?",
  },
  "신청하면 꼭 베타테스트에 참여해야 하나요?": {
    en: "Do I have to participate after applying?",
  },
  "부모님과 함께 살지 않아도 사용할 수 있나요?": {
    en: "Can I use it if I do not live with my parents?",
  },
  "현재 체험판에서는 입력한 내용이 서버에 저장되지 않아요. 리포트와 AI 정리는 사용 중인 브라우저 안에서 처리되며, 화면을 새로고침하면 입력 내용이 사라져요. 실제 출시 서비스의 저장과 공유 방식은 개인정보와 건강정보를 안전하게 관리할 수 있도록 법률 검토와 테스트 결과를 반영해 설계할 예정이에요.": {
    en: "In this trial, entries are not saved on a server. The report and AI organization run in your browser, and refreshing clears the content. Storage and sharing for the full service will be designed after legal review and testing to protect personal and health information.",
  },
  "지금 이 페이지에서 체험판을 사용해볼 수 있어요. 정식 서비스는 부모님 진료를 챙기시는 자녀분들의 진짜 불편함과 생생한 경험을 듣고, 베타테스터분들의 의견을 충분히 반영해 꼭 필요한 기능과 출시 시기를 결정할 예정이에요.": {
    en: "You can try the experience on this page now. The full service’s features and launch timing will be decided after listening to real experiences and beta feedback.",
  },
  "베타테스터 신청 단계에서는 구체적인 병명이나 진료기록을 입력하지 않으셔도 돼요. 부모님의 병원 방문 빈도와 평소 진료를 어떻게 챙기고 계신지 정도만 간단히 여쭤보고 있어요.": {
    en: "The beta application does not require a specific diagnosis or medical records. We only ask briefly how often your parent visits a clinic and how you usually help prepare.",
  },
  "아니요, 부담 갖지 않으셔도 괜찮아요. 신청해주시면 일정과 참여 방법을 먼저 안내해 드릴 테니, 내용을 천천히 확인하시고 편하게 결정해 주세요.": {
    en: "No. There is no obligation. We will share the schedule and participation details first, and you can decide comfortably after reviewing them.",
  },
  "지금은 서비스가 정말 필요한지, 어떻게 쓰면 편할지 확인하는 베타테스트 단계라서 정식 서비스의 요금이나 결제 방식은 아직 정해지지 않았어요. 현재 체험판과 베타테스터 신청은 무료이며 결제가 진행되지 않아요.": {
    en: "We are still testing whether the service is needed and how it should work, so pricing for the full service has not been decided. This trial and beta application are free and do not charge you.",
  },
  "네, 맞아요. 부모님과 따로 살면서 전화나 카카오톡으로 마음 졸이며 진료를 챙기고 계신 자녀분들을 가장 먼저 생각하며 만들고 있답니다.": {
    en: "Yes. We are designing this first for adult children who live apart and worry while helping through calls and messages.",
  },
  "부모님의 진료를 준비하는 가장 다정한 한 장, 진료한장": {
    en: "Jinryo Hanjang, one caring page for your parent’s visit",
  },
  "진료에 쓸 수 있는": {
    en: "into",
  },
  "한 장": {
    en: "one useful page",
  },
  "으로 정리해요.": {
    en: "for the visit.",
  },
  "예: 엄마가 지난주 월요일부터 앉았다 일어날 때 어지럽다고 하셨어요. 하루에 서너 번 정도이고 잠깐 앉아서 쉬면 괜찮아진대요. 아침마다 혈압약을 드시고 있고, 이번 진료에서는 약과 어지럼증이 관련 있는지 물어보고 싶어요. 약봉투와 최근 혈압 메모를 가져가려고 해요.": {
    en: "Example: Mom has felt dizzy when standing up since last Monday. It happens three or four times a day and improves after sitting briefly. She takes blood pressure medicine every morning. We want to ask whether the medicine could be related to the dizziness, and we plan to bring her medication packet and recent blood pressure notes.",
  },
  "예: 최근 어지럼증의 원인과 복용약 조정이 필요한지 확인하고 싶어요.": {
    en: "Example: I want to ask about the recent dizziness and whether her medication needs to be adjusted.",
  },
  "예: 일어날 때 어지럽고 중심을 잡기 어려워요.": {
    en: "Example: She feels dizzy and has trouble keeping her balance when standing up.",
  },
  "예: 지난주 월요일부터": {
    en: "Example: Since last Monday",
  },
  "예: 앉았다 일어날 때": {
    en: "Example: When standing up from a chair",
  },
  "예: 하루 서너 번, 수초간": {
    en: "Example: Three or four times a day, for a few seconds",
  },
  "예: 식사를 거른 날": {
    en: "Example: On days when she skips a meal",
  },
  "예: 잠시 앉아서 쉬면 나아짐": {
    en: "Example: Improves after sitting and resting briefly",
  },
  "예: 증상 전날 잠을 설쳤고, 이후 식사량이 줄었어요.": {
    en: "Example: She slept poorly the night before the symptoms started and has eaten less since then.",
  },
  "예: 동네 의원에서 혈압을 확인했고 경과를 지켜보기로 했어요.": {
    en: "Example: A local clinic checked her blood pressure and advised us to monitor her symptoms.",
  },
  "예: 혈압약 — 아침 식후 오메가3 — 저녁 식후": {
    en: "Example: Blood pressure medicine — after breakfast\nOmega-3 — after dinner",
  },
  "예: 이 증상과 현재 약이 관련 있을까요? 추가 검사가 필요할까요?": {
    en: "Example: Could this symptom be related to her current medicine?\nDoes she need any additional tests?",
  },
  "예: 복용약 봉투 최근 혈압 측정 메모": {
    en: "Example: Medication packets\nRecent blood pressure notes",
  },
  "예: 지난달": {
    en: "Example: Last month",
  },
  "같은 시기의 사건은 줄을 바꿔 적어주세요.": {
    en: "Put events from the same period on separate lines.",
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
  return (["en"] as const).some(
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
};
