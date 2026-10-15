export const copy = (az, en) => ({ az, en });
export const demoDate = "2026-10-15";
export const teachers = [
  {
    id: "t1",
    name: "Nigar Əliyeva",
    initials: "NƏ",
    email: "nigar@example.com",
    subject: "IELTS / TOEFL",
  },
  {
    id: "t2",
    name: "Elvin Kərimov",
    initials: "EK",
    email: "elvin@example.com",
    subject: "SAT",
  },
  {
    id: "t3",
    name: "Aysel Səfərova",
    initials: "AS",
    email: "aysel@example.com",
    subject: "General English / Duolingo",
  },
];
export const groups = [
  {
    id: "g1",
    name: "IELTS B2 Evening",
    program: "IELTS",
    teacher: "t1",
    room: "01",
    days: copy("B.e. · Çər. · Cümə", "Mon · Wed · Fri"),
    time: "18:00–19:30",
    fee: 480,
    color: "primary",
  },
  {
    id: "g2",
    name: "SAT October",
    program: "SAT",
    teacher: "t2",
    room: "02",
    days: copy("Ç.a. · C.a.", "Tue · Thu"),
    time: "16:00–17:30",
    fee: 650,
    color: "dark",
  },
  {
    id: "g3",
    name: "English B1 Morning",
    program: "General English",
    teacher: "t3",
    room: "03",
    days: copy("B.e. · Çər.", "Mon · Wed"),
    time: "10:00–11:30",
    fee: 320,
    color: "light",
  },
  {
    id: "g4",
    name: "TOEFL Advanced",
    program: "TOEFL",
    teacher: "t1",
    room: "01",
    days: copy("Ç.a. · C.a.", "Tue · Thu"),
    time: "14:00–15:30",
    fee: 520,
    color: "medium",
  },
  {
    id: "g5",
    name: "Duolingo Intensive",
    program: "Duolingo",
    teacher: "t3",
    room: "04",
    days: copy("Şənbə", "Saturday"),
    time: "11:00–12:30",
    fee: 280,
    color: "pale",
  },
];
const names = [
  "Aylin Məmmədova",
  "Murad Həsənov",
  "Leyla Rəhimova",
  "Ömər İsmayılov",
  "Zəhra Abbasova",
  "Rauf Hüseynov",
  "Nərmin Qasımova",
  "Əli Səlimov",
  "Fidan Vəliyeva",
  "Kənan İbrahimov",
  "Dəniz Rüstəmova",
  "Tunar Əhmədov",
  "İnci Səmədova",
  "Emil Cəfərov",
  "Səbinə Ağayeva",
  "Orxan Nəsirov",
  "Ləman Rzayeva",
  "Yusif Quliyev",
];
export const seedStudents = names.map((name, i) => ({
  id: `ST-${241 + i}`,
  name,
  group: ["g1", "g2", "g3", "g4", "g1", "g5"][i % 6],
  email: `student${i + 1}@example.com`,
  attendance: [96, 92, 83, 100, 94, 88, 97, 90, 78][i % 9],
  progress: [72, 64, 58, 85, 79, 61, 88, 68, 52][i % 9],
  status: i === 2 ? "pending" : "active",
  joined: `2026-10-${String((i % 14) + 1).padStart(2, "0")}`,
  paid: i !== 2 && i !== 8,
}));
export const seedResources = [
  {
    id: "r1",
    group: "g1",
    title: copy(
      "Writing Task 2: güclü arqument qur",
      "Writing Task 2: build a strong argument",
    ),
    description: copy(
      "Esse planı, əsas fikir və nümunələrlə fikrini inkişaf etdir.",
      "Develop your ideas with a clear outline, a central argument, and examples.",
    ),
    kind: copy("Dərs qeydləri", "Lesson notes"),
    minutes: 8,
    sections: [
      {
        title: copy("Bir fikirdən başla", "Start with one idea"),
        body: copy(
          "Əvvəlcə mövqeyini bir cümlə ilə yaz. Hər abzasda bir arqument irəli sür və onu konkret nümunə ilə dəstəklə.",
          "Write your position in one sentence first. Develop one argument per paragraph and support it with a specific example.",
        ),
      },
      {
        title: copy("Esse strukturu", "Essay structure"),
        body: copy(
          "Girişdə mövzunu təqdim et. Əsas hissədə iki arqumenti izah et. Nəticədə yeni fikir əlavə etmədən mövqeyini yekunlaşdır.",
          "Introduce the topic, develop two arguments in the body, and restate your position in the conclusion without adding new ideas.",
        ),
      },
      {
        title: copy("Özün yoxla", "Try it yourself"),
        body: copy(
          "“Online learning makes education more accessible.” Mövzu haqqında 250–280 söz yaz. Plan qurmağa beş dəqiqə ayır.",
          "Write 250–280 words about “Online learning makes education more accessible.” Spend five minutes planning before you start.",
        ),
      },
    ],
  },
  {
    id: "r2",
    group: "g1",
    title: copy("Reading: əsas fikri tap", "Reading: find the main idea"),
    description: copy(
      "Skimming və scanning üsulları ilə daha məqsədli oxu.",
      "Read with purpose using skimming and scanning techniques.",
    ),
    kind: copy("Məşq materialı", "Practice sheet"),
    minutes: 6,
    sections: [
      {
        title: copy("Skimming", "Skimming"),
        body: copy(
          "Başlığı, giriş abzasını və hər abzasın ilk cümləsini oxu. Mətnin hansı suala cavab verdiyini bir cümlə ilə yaz.",
          "Read the title, introduction, and first sentence of each paragraph. Summarize the question the text answers in one sentence.",
        ),
      },
      {
        title: copy("Scanning", "Scanning"),
        body: copy(
          "Ad, tarix və açar söz kimi konkret məlumatları axtar. Suallarda sinonimlərin işlənə biləcəyini nəzərə al.",
          "Look for specific information such as names, dates, and keywords. Remember that questions may use synonyms.",
        ),
      },
    ],
  },
  {
    id: "r3",
    group: "g1",
    title: copy(
      "Speaking: cavabını genişləndir",
      "Speaking: expand your answer",
    ),
    description: copy(
      "Fikir → səbəb → nümunə. Daha aydın danışmaq üçün sadə struktur.",
      "Idea → reason → example. A simple framework for speaking clearly.",
    ),
    kind: copy("Praktik bələdçi", "Practice guide"),
    minutes: 5,
    sections: [
      {
        title: copy("Fikir, səbəb və nümunə", "Idea, reason, and example"),
        body: copy(
          "Sevdiyin bir yer haqqında danış. Haradadır? Niyə xoşuna gəlir? Son dəfə orada nə etdin? Cavabına bir xatirə əlavə et.",
          "Describe a place you enjoy visiting. Where is it? Why do you like it? What did you do there last time? Include a personal memory.",
        ),
      },
    ],
  },
  {
    id: "r4",
    group: "g2",
    title: copy("Cəbr: xətti tənliklər", "Algebra: linear equations"),
    description: copy(
      "Həll addımları, nümunələr və cavabların yoxlanması.",
      "Step-by-step solutions, examples, and checking your answers.",
    ),
    kind: copy("Dərs qeydləri", "Lesson notes"),
    minutes: 10,
    sections: [
      {
        title: copy("Həll et və yoxla", "Solve and check"),
        body: copy(
          "3x + 7 = 22. Hər iki tərəfdən 7 çıx: 3x = 15. Sonra 3-ə böl: x = 5. Yoxla: 3 × 5 + 7 = 22.",
          "3x + 7 = 22. Subtract 7 from each side: 3x = 15. Divide by 3: x = 5. Check: 3 × 5 + 7 = 22.",
        ),
      },
    ],
  },
  {
    id: "r5",
    group: "g4",
    title: copy(
      "Listening: effektiv qeyd apar",
      "Listening: take effective notes",
    ),
    description: copy(
      "Əsas mövzunu, səbəb və nəticələri qeyd etmək üçün şablon.",
      "A template for capturing the main topic, causes, and effects.",
    ),
    kind: copy("Yoxlama siyahısı", "Checklist"),
    minutes: 5,
    sections: [
      {
        title: copy("Qeydlərini təşkil et", "Organize your notes"),
        body: copy(
          "Səhifəni üç hissəyə ayır: mövzu, əsas fikirlər və nümunələr. Tam cümlələr əvəzinə açar sözlərdən istifadə et.",
          "Divide the page into three sections: topic, main ideas, and examples. Use keywords instead of full sentences.",
        ),
      },
    ],
  },
  {
    id: "r6",
    group: "g3",
    title: copy(
      "Gündəlik danışıq: özünü təqdim et",
      "Everyday speaking: introduce yourself",
    ),
    description: copy(
      "Özün haqqında rahat danışmaq üçün başlanğıc məşqlər.",
      "Starter exercises to talk about yourself with confidence.",
    ),
    kind: copy("Məşq materialı", "Practice sheet"),
    minutes: 7,
    sections: [
      {
        title: copy("Üç cümlə ilə başla", "Start with three sentences"),
        body: copy(
          "Nə ilə məşğulsan, nələri sevirsən və nə öyrənmək istəyirsən? Hər cavaba bir səbəb və nümunə əlavə et.",
          "What do you do, what do you enjoy, and what would you like to learn? Add a reason and an example to each answer.",
        ),
      },
    ],
  },
];
export const assignments = [
  {
    id: "a1",
    group: "g1",
    title: copy(
      "Writing Task 2: onlayn təhsil",
      "Writing Task 2: online learning",
    ),
    description: copy(
      "Onlayn təhsilin əlçatanlığı haqqında 250–280 sözlük esse yaz. İki arqument və konkret nümunələrdən istifadə et.",
      "Write a 250–280 word essay on access to online education. Use two arguments and specific examples.",
    ),
    due: "2026-10-16",
    resource: "r1",
  },
  {
    id: "a2",
    group: "g1",
    title: copy(
      "Reading: əsas fikirlərin xülasəsi",
      "Reading: summarize the main ideas",
    ),
    description: copy(
      "Bir məqalə seç. Üç əsas fikir və hər fikri dəstəkləyən bir cümlə yaz.",
      "Choose an article. Identify three main ideas and a supporting sentence for each.",
    ),
    due: "2026-10-19",
    resource: "r2",
  },
  {
    id: "a3",
    group: "g2",
    title: copy("Xətti tənliklər məşqi", "Linear equations practice"),
    description: copy(
      "2x − 4 = 14, 5x + 3 = 28 və 4(x − 2) = 20 tənliklərini həll et. Addımlarını göstər.",
      "Solve 2x − 4 = 14, 5x + 3 = 28, and 4(x − 2) = 20. Show your steps.",
    ),
    due: "2026-10-17",
    resource: "r4",
  },
];
export const seedSubmissions = [
  {
    id: "s1",
    student: "ST-245",
    assignment: "a1",
    answer:
      "Online learning makes education accessible to people who cannot travel to a classroom. Flexible schedules allow learners to study alongside work. For example, recorded lessons can be reviewed in the evening. However, learners still need reliable access to technology and support from teachers.",
    status: "submitted",
    score: null,
    feedback: "",
  },
  {
    id: "s2",
    student: "ST-247",
    assignment: "a1",
    answer:
      "Online education connects students with teachers from different places. A student in a small town can join a class without relocating. The main challenge is staying focused. A clear study plan and regular feedback can help learners make progress.",
    status: "graded",
    score: 86,
    feedback:
      "Clear structure and relevant examples. Try developing your second argument further.",
  },
];
