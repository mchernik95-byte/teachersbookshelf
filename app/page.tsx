"use client";

import { useEffect, useMemo, useState } from "react";
import { courseDetails } from "./course-details";
import { cefrLabels, getCourseStage, placementTests, scorePlacement, type PlacementTrack } from "./placement-tests";

type Answers = Record<string, string | string[]>;
type Option = { value: string; label: string };
type Question = {
  id: string;
  title: string;
  hint: string;
  type: "select" | "multi";
  options: Option[];
  skippable?: boolean;
};

type Course = {
  id: string;
  title: string;
  publisher: string;
  audience: string;
  minAge: number;
  maxAge: number;
  minLevel: number;
  maxLevel: number;
  goals: string[];
  skills: string[];
  traits: string[];
  cover: string;
  description: string;
  caution: string;
  difficulty?: "accessible" | "standard" | "challenging";
};

const opt = (value: string, label: string): Option => ({ value, label });

const questions: Question[] = [
  {
    id: "general",
    title: "Нужен ли курс общего английского?",
    hint: "Выберите один вариант или пропустите эту категорию.",
    type: "select",
    skippable: true,
    options: [
      opt("child", "Общий английский для ребёнка"), opt("teen", "Общий английский для подростка"),
      opt("adult", "Общий английский для взрослого"), opt("beginner", "Английский с нуля"),
      opt("improve", "Повышение текущего уровня"), opt("speaking", "Разговорный английский"),
      opt("gaps", "Устранение пробелов"), opt("school", "Повышение школьной успеваемости"),
    ],
  },
  {
    id: "situation",
    title: "Нужен ли английский для конкретной ситуации?",
    hint: "Этот экран показывается независимо от предыдущего ответа.",
    type: "select",
    skippable: true,
    options: [
      opt("travel", "Для путешествий"), opt("relocation", "Для переезда"), opt("work", "Для работы"),
      opt("business", "Деловой английский"), opt("interview", "Для собеседования"),
      opt("communication", "Для общения с иностранцами"), opt("study_abroad", "Для учёбы за границей"),
      opt("academic", "Академический английский"), opt("professional", "Профессиональный английский"),
    ],
  },
  {
    id: "exam",
    title: "Нужна ли подготовка к экзамену?",
    hint: "Можно выбрать экзамен или пропустить вопрос.",
    type: "select",
    skippable: true,
    options: [
      opt("oge", "ОГЭ"), opt("ege", "ЕГЭ"), opt("ielts_academic", "IELTS Academic"),
      opt("ielts_general", "IELTS General Training"), opt("toefl", "TOEFL"),
      opt("b1_exam", "Cambridge B1 Preliminary"), opt("b2_exam", "Cambridge B2 First"),
      opt("c1_exam", "Cambridge C1 Advanced"), opt("c2_exam", "Cambridge C2 Proficiency"),
    ],
  },
  {
    id: "age",
    title: "Сколько лет ученику?",
    hint: "Возраст влияет на тематику, дизайн и темп курса.",
    type: "select",
    options: [
      opt("6-9", "6–9 лет"), opt("10-11", "10–11 лет"), opt("12-14", "12–14 лет"),
      opt("15-17", "15–17 лет"), opt("18-25", "18–25 лет"), opt("26-40", "26–40 лет"),
      opt("41-60", "41–60 лет"), opt("61+", "Старше 60 лет"),
    ],
  },
  {
    id: "schoolClass",
    title: "В каком классе учится ученик?",
    hint: "Если это взрослый, выберите «Не учится в школе».",
    type: "select",
    skippable: true,
    options: [
      opt("preschool", "Дошкольник"), opt("1-4", "1–4 класс"), opt("5-6", "5–6 класс"),
      opt("7-8", "7–8 класс"), opt("9", "9 класс"), opt("10", "10 класс"),
      opt("11", "11 класс"), opt("not_school", "Не учится в школе"),
    ],
  },
  {
    id: "level",
    title: "Какой сейчас уровень английского?",
    hint: "Если вы не уверены, выберите «Не знаю» — подбор всё равно продолжится.",
    type: "select",
    options: [
      opt("beginner", "Beginner — начинает с нуля"),
      opt("false_beginner", "False Beginner — изучал раньше, но многое забыл"),
      opt("a1", "A1 — Elementary"), opt("a2", "A2 — Pre-Intermediate"),
      opt("b1", "B1 — Intermediate"), opt("b2", "B2 — Upper-Intermediate"),
      opt("c1", "C1 — Advanced"), opt("c2", "C2 — Proficiency"), opt("unknown", "Не знаю свой уровень"),
    ],
  },
  {
    id: "format",
    title: "Как будут проходить занятия?",
    hint: "Выберите основной формат обучения.",
    type: "select",
    options: [
      opt("individual", "Индивидуально"), opt("mini", "В мини-группе"),
      opt("group", "В большой группе"), opt("self", "Самостоятельно"),
    ],
  },
  {
    id: "frequency",
    title: "Сколько занятий планируется в неделю?",
    hint: "Это понадобится для расчёта примерной продолжительности обучения.",
    type: "select",
    options: [opt("1", "Одно"), opt("2", "Два"), opt("3", "Три"), opt("4", "Четыре и более"), opt("unknown", "Пока неизвестно")],
  },
  {
    id: "duration",
    title: "Сколько длится одно занятие?",
    hint: "Сайт переведёт общий объём подготовки в количество занятий.",
    type: "select",
    options: [opt("45", "45 минут"), opt("60", "60 минут"), opt("90", "90 минут"), opt("unknown", "Пока неизвестно")],
  },
  {
    id: "deadline",
    title: "За какой срок необходимо достичь цели?",
    hint: "Точная дата не требуется.",
    type: "select",
    options: [opt("1-3", "1–3 месяца"), opt("3-6", "3–6 месяцев"), opt("6-12", "6–12 месяцев"), opt("unknown", "Не знаю")],
  },
  {
    id: "selfStudy",
    title: "Сколько времени остаётся на самостоятельную работу?",
    hint: "Домашняя практика заметно влияет на срок достижения цели.",
    type: "select",
    skippable: true,
    options: [
      opt("none", "Практически не будет"), opt("lt1", "До 1 часа в неделю"),
      opt("1-2", "1–2 часа в неделю"), opt("3-5", "3–5 часов в неделю"),
      opt("5plus", "Более 5 часов в неделю"), opt("unknown", "Не знаю"),
    ],
  },
  {
    id: "interests",
    title: "Что интересно ученику?",
    hint: "Можно выбрать несколько вариантов.",
    type: "multi",
    skippable: true,
    options: [
      opt("travel", "Путешествия"), opt("technology", "Технологии"), opt("games", "Игры"),
      opt("music", "Музыка"), opt("films", "Кино и сериалы"), opt("sport", "Спорт"),
      opt("animals", "Животные"), opt("science", "Наука"), opt("culture", "Культура"),
      opt("communication", "Общение"), opt("school", "Школьная жизнь"),
    ],
  },
  {
    id: "skills",
    title: "Какие навыки особенно важно развивать?",
    hint: "Выберите один или несколько приоритетов.",
    type: "multi",
    options: [
      opt("speaking", "Speaking"), opt("listening", "Listening"), opt("reading", "Reading"),
      opt("writing", "Writing"), opt("grammar", "Grammar"), opt("vocabulary", "Vocabulary"),
      opt("pronunciation", "Pronunciation"), opt("balanced", "Комплексное развитие"),
    ],
  },
  {
    id: "preferences",
    title: "Что важно в самом УМК?",
    hint: "Последний шаг — отметьте всё значимое.",
    type: "multi",
    skippable: true,
    options: [
      opt("speaking", "Много разговорной практики"), opt("grammar", "Подробная грамматика"),
      opt("games", "Игровые задания"), opt("visual", "Современный дизайн"), opt("video", "Видео"),
      opt("digital", "Цифровая платформа"), opt("tests", "Готовые тесты"),
      opt("teacher", "Подробный Teacher’s Book"), opt("exam", "Экзаменационная направленность"),
      opt("calm", "Спокойный темп"), opt("intensive", "Интенсивная программа"),
    ],
  },
];

const courses: Course[] = [
  { id:"super-minds", title:"Super Minds Second Edition", publisher:"Cambridge", audience:"Дети 6–11 лет · Pre-A1–B1", minAge:6,maxAge:11,minLevel:0,maxLevel:3, goals:["child","school","beginner"], skills:["balanced","speaking"], traits:["games","visual","video","digital"], cover:"/covers/super-minds.jpg", description:"Приключенческий курс с историями, CLIL, песнями и заданиями на мышление. Хорош для активных младших школьников.", caution:"При одном занятии в неделю материал придётся дозировать." },
  { id:"family-friends", title:"Family and Friends Second Edition", publisher:"Oxford", audience:"Дети 6–12 лет · Pre-A1–B1", minAge:6,maxAge:12,minLevel:0,maxLevel:3, goals:["child","school","gaps","beginner"], skills:["grammar","reading","writing","vocabulary","balanced"], traits:["grammar","tests","teacher","calm"], cover:"/covers/family-friends.jpg", description:"Системный курс с сильной фонетикой, грамматикой и регулярным повторением. Хорошо подходит школьникам, которым нужно подтянуть программу, но заниматься не по школьному учебнику.", caution:"Темп довольно быстрый, а для свободной разговорной практики преподавателю стоит добавлять более открытые задания." },
  { id:"kids-box", title:"Kid’s Box New Generation", publisher:"Cambridge", audience:"Дети 6–11 лет · Pre-A1–A2", minAge:6,maxAge:11,minLevel:0,maxLevel:2, goals:["child","school","speaking","communication","beginner"], skills:["speaking","listening","balanced"], traits:["speaking","games","visual","video","digital","teacher"], cover:"/covers/kids-box.jpg", description:"Разговорно-игровой курс с историями, песнями и большим количеством взаимодействия. Особенно хорош для развития уверенной устной речи.", caution:"Требует тщательной проработки каждого урока преподавателем: простого выполнения упражнений по порядку недостаточно.", difficulty:"accessible" },
  { id:"academy-stars", title:"Academy Stars Second Edition", publisher:"Macmillan", audience:"Дети 6–12 лет · Pre-A1–B1", minAge:6,maxAge:12,minLevel:0,maxLevel:3, goals:["child","school","gaps"], skills:["grammar","reading","writing","balanced"], traits:["grammar","tests","teacher","digital","intensive"], cover:"/covers/academy-stars.jpg", description:"Академичный и плотный детский курс с большими текстами, сильной грамматикой, письмом и постепенной экзаменационной подготовкой.", caution:"Не подойдёт ребёнку со слабой мотивацией, медленным усвоением материала или выраженными трудностями чтения.", difficulty:"challenging" },
  { id:"gogetter", title:"GoGetter", publisher:"Pearson", audience:"Младшие подростки 10–14 лет · Pre-A1–B1", minAge:10,maxAge:14,minLevel:0,maxLevel:3, goals:["teen","school","speaking","communication"], skills:["speaking","listening","balanced"], traits:["speaking","video","digital","visual","games","calm"], cover:"/covers/gogetter.jpg", description:"Доступный разговорный курс: много коротких диалогов, парной практики и видео, а тексты сравнительно небольшие и несложные. Хорошо снимает страх речи и мягко переводит ученика от детских пособий к подростковым.", caution:"Сильному читателю и ребёнку с развитым кругозором содержание может показаться простым; линейка заканчивается уровнем B1.", difficulty:"accessible" },
  { id:"wider-world", title:"Wider World", publisher:"Pearson", audience:"Подростки 11–16 лет · Pre-A1–B1+", minAge:11,maxAge:16,minLevel:0,maxLevel:3, goals:["teen","speaking","communication","school"], skills:["speaking","listening","reading","balanced"], traits:["video","digital","visual","intensive"], cover:"/covers/wider-world.jpg", description:"Содержательно плотнее GoGetter: тексты длиннее и сложнее, темы шире, больше страноведческого и познавательного материала. Подходит любознательному подростку с хорошей учебной базой и развитым кругозором.", caution:"Неуверенному читателю может понадобиться более медленный темп и дополнительная поддержка; для ОГЭ и ЕГЭ нужен отдельный тренажёр.", difficulty:"challenging" },
  { id:"get-involved", title:"Get Involved!", publisher:"Macmillan", audience:"Подростки 12–17 лет · A1+–B2", minAge:12,maxAge:17,minLevel:1,maxLevel:4, goals:["teen","school","speaking","communication"], skills:["speaking","reading","writing","balanced"], traits:["speaking","video","digital","visual","intensive"], cover:"/covers/get-involved.webp", description:"Современный курс для сильных и мотивированных подростков с выраженной проектной деятельностью: в каждом юните ученики исследуют реальную тему, обсуждают её и создают итоговый совместный проект. Курс развивает критическое мышление, сотрудничество и аргументированную речь.", caution:"При слабой языковой базе или низкой готовности обсуждать и работать над проектами курс может оказаться перегруженным.", difficulty:"challenging" },
  { id:"life-vision", title:"Life Vision", publisher:"Oxford", audience:"Подростки 13–18 лет · A1–C1", minAge:13,maxAge:18,minLevel:1,maxLevel:5, goals:["teen","school","academic","study_abroad","b1_exam","b2_exam","c1_exam"], skills:["reading","writing","vocabulary","grammar","balanced"], traits:["video","digital","tests","exam","intensive","teacher"], cover:"/covers/life-vision.jpg", description:"Плотный академичный курс для старших подростков: объёмные темы, системная лексика и грамматика, критическое мышление и встроенные экзаменационные стратегии. Хорош для ученика, которому нужен серьёзный рост до высоких уровней.", caution:"Для разговорного запроса без академических целей может быть избыточным; слабому ученику потребуется тщательный подбор уровня.", difficulty:"challenging" },
  { id:"primary-path", title:"Cambridge Primary Path Second Edition", publisher:"Cambridge", audience:"Дети 7–12 лет · Pre-A1–B2", minAge:7,maxAge:12,minLevel:0,maxLevel:4, goals:["child","school","communication","academic"], skills:["reading","writing","speaking","vocabulary","balanced"], traits:["video","digital","visual","teacher","intensive"], cover:"/covers/primary-path.jpg", description:"Сильный literacy-курс для младшей школы: расширенные художественные и познавательные тексты, письмо, устная аргументация, большие вопросы и творческие проекты. Развивает не только язык, но и умение рассуждать на английском.", caution:"Это более требовательный выбор, чем типичный игровой детский УМК: при слабом чтении и одном коротком уроке в неделю темп придётся снижать.", difficulty:"challenging" },
  { id:"prepare", title:"Prepare Second Edition", publisher:"Cambridge", audience:"Подростки 11–18 лет · A1–C1", minAge:11,maxAge:18,minLevel:1,maxLevel:5, goals:["teen","school","b1_exam","b2_exam","c1_exam"], skills:["balanced","grammar","writing"], traits:["exam","tests","digital","video"], cover:"/covers/prepare.jpg", description:"Долгосрочная подростковая линейка, соединяющая общий английский с подготовкой к Cambridge Qualifications.", caution:"Важно точно выбрать один из девяти уровней." },
  { id:"solutions", title:"Solutions Third Edition", publisher:"Oxford", audience:"Подростки 13–18 лет · A2–C1", minAge:13,maxAge:18,minLevel:2,maxLevel:5, goals:["teen","school","gaps","oge","ege"], skills:["grammar","vocabulary","writing"], traits:["grammar","tests","exam","teacher"], cover:"/covers/solutions.jpg", description:"Чёткий академичный курс с сильной грамматикой, лексикой и экзаменационной поддержкой.", caution:"Низкомотивированному ученику могут понадобиться дополнительные игровые материалы." },
  { id:"gateway", title:"Gateway to the World", publisher:"Macmillan", audience:"Подростки 13–19 лет · A1+–C1", minAge:13,maxAge:19,minLevel:1,maxLevel:5, goals:["teen","ege","academic","study_abroad"], skills:["grammar","writing","reading","balanced"], traits:["exam","intensive","digital","tests"], cover:"/covers/gateway.jpg", description:"Интенсивный курс для старших подростков: сильный язык, экзамены, дальнейшая учёба и навыки будущего.", caution:"Для младших или слабомотивированных подростков может быть тяжёлым." },
  { id:"english-file", title:"English File Fifth Edition", publisher:"Oxford", audience:"Взрослые и 16+ · A1–C2", minAge:16,maxAge:99,minLevel:0,maxLevel:6, goals:["adult","beginner","improve","speaking","travel","communication","relocation"], skills:["speaking","pronunciation","listening","balanced"], traits:["speaking","video","digital","visual"], cover:"/covers/english-file.jpg", description:"Разговорный курс для взрослых с сильной системой произношения, актуальными темами и полной линейкой до C2.", caution:"Для экзамена потребуется отдельный специализированный компонент." },
  { id:"speakout", title:"Speakout Third Edition", publisher:"Pearson", audience:"Взрослые и 16+ · A1–C1", minAge:16,maxAge:99,minLevel:0,maxLevel:5, goals:["adult","speaking","travel","communication","relocation"], skills:["speaking","listening","pronunciation"], traits:["speaking","video","digital","visual"], cover:"/covers/speakout-cover.jpg", description:"Коммуникативный курс с BBC Studios, разными акцентами и большим количеством реального разговорного английского.", caution:"При сильном запросе на грамматику понадобится дополнительный тренажёр." },
  { id:"empower", title:"Empower Second Edition", publisher:"Cambridge", audience:"Взрослые и 16+ · A1–C1", minAge:16,maxAge:99,minLevel:0,maxLevel:5, goals:["adult","improve","work","academic"], skills:["balanced","speaking","writing"], traits:["digital","tests","teacher","calm"], cover:"/covers/empower.jpg", description:"Сбалансированный курс с ясными целями уроков, онлайн-оцениванием и хорошо видимым прогрессом.", caution:"Для узкой профессиональной цели нужен дополнительный ESP-материал." },
  { id:"roadmap", title:"Roadmap", publisher:"Pearson", audience:"Взрослые и 16+ · A1–C2", minAge:16,maxAge:99,minLevel:1,maxLevel:6, goals:["adult","improve","work","travel","communication"], skills:["speaking","balanced","listening"], traits:["digital","speaking","teacher","calm"], cover:"/covers/roadmap.jpg", description:"Гибкий курс, который позволяет менять маршрут и выбирать глубину Reading, Writing и Listening под конкретную цель.", caution:"Множество компонентов требует осознанной настройки преподавателем." },
  { id:"business-partner", title:"Business Partner", publisher:"Pearson + Financial Times", audience:"Взрослые · A1–C1", minAge:18,maxAge:99,minLevel:1,maxLevel:5, goals:["business","work","interview","professional"], skills:["speaking","writing","vocabulary"], traits:["digital","intensive","tests"], cover:"/covers/business-partner.jpg", description:"Практический деловой английский: рабочие ситуации, презентации, переписка, проекты и employability skills.", caution:"Для чисто общего английского тематика может быть слишком деловой." },
  { id:"tourism", title:"English for International Tourism", publisher:"Pearson", audience:"Взрослые и 16+ · A2–B2", minAge:16,maxAge:99,minLevel:2,maxLevel:4, goals:["travel","professional","work"], skills:["speaking","listening","vocabulary"], traits:["speaking","visual"], cover:"/covers/tourism.jpg", description:"Специализированная линейка для туризма и hospitality с практическими профессиональными ситуациями.", caution:"Для обычной короткой поездки курс может быть избыточно профессиональным." },
  { id:"mindset", title:"Mindset for IELTS", publisher:"Cambridge", audience:"Старшие подростки и взрослые · A2–C1", minAge:16,maxAge:99,minLevel:2,maxLevel:5, goals:["ielts_academic","ielts_general","study_abroad","academic"], skills:["writing","reading","listening","speaking"], traits:["exam","digital","tests","intensive"], cover:"/covers/mindset.jpg", description:"Четыре уровня IELTS-подготовки: от Foundation A2 до целевого Band 7.5, с онлайн-модулями по всем навыкам.", caution:"При слабой общей базе параллельно может потребоваться General English." },
  { id:"complete-preliminary", title:"Complete Preliminary", publisher:"Cambridge", audience:"Подростки и взрослые · B1", minAge:13,maxAge:99,minLevel:3,maxLevel:3, goals:["b1_exam"], skills:["balanced","writing","grammar"], traits:["exam","tests","digital"], cover:"/covers/complete-preliminary.jpg", description:"Полный языковой и экзаменационный курс подготовки к Cambridge B1 Preliminary.", caution:"Не заменяет тренажёр ОГЭ." },
  { id:"compact-first", title:"Compact First Third Edition", publisher:"Cambridge", audience:"Старшие подростки и взрослые · B2", minAge:15,maxAge:99,minLevel:3,maxLevel:4, goals:["b2_exam"], skills:["grammar","writing","balanced"], traits:["exam","tests","intensive"], cover:"/covers/compact-first.jpg", description:"Компактная интенсивная подготовка к B2 First с пошаговыми стратегиями и экзаменационной лексикой.", caution:"Ученику ниже уверенного B1+ будет слишком сложно." },
  { id:"complete-advanced", title:"Complete Advanced Third Edition", publisher:"Cambridge", audience:"Старшие подростки и взрослые · C1", minAge:16,maxAge:99,minLevel:4,maxLevel:5, goals:["c1_exam","academic","study_abroad"], skills:["writing","reading","grammar","balanced"], traits:["exam","tests","digital","intensive"], cover:"/covers/complete-advanced.jpg", description:"Развёрнутый курс C1 Advanced, который одновременно развивает продвинутый язык и экзаменационные стратегии.", caution:"Требует уверенного уровня B2." },
  { id:"objective-proficiency", title:"Objective Proficiency", publisher:"Cambridge", audience:"Взрослые и 17+ · C2", minAge:17,maxAge:99,minLevel:5,maxLevel:6, goals:["c2_exam","academic","improve"], skills:["writing","reading","vocabulary","grammar"], traits:["exam","tests","intensive"], cover:"/covers/objective-proficiency.jpg", description:"Авторитетный курс C2 Proficiency: сложная лексика, типичные проблемные зоны и глубокая экзаменационная подготовка.", caution:"Издание нужно дополнять актуальными официальными practice tests." },
  { id:"oge-2026", title:"ОГЭ-2026: 20 типовых вариантов", publisher:"Национальное образование", audience:"9 класс · актуальный формат", minAge:14,maxAge:16,minLevel:2,maxLevel:3, goals:["oge"], skills:["balanced","writing","grammar"], traits:["exam","tests","intensive"], cover:"/covers/oge-2026.jpg", description:"Тренажёр полного формата ОГЭ с ответами и критериями. Используется вместе с основным языковым курсом.", caution:"Не является полноценным УМК и должен обновляться ежегодно." },
  { id:"ege-2026", title:"ЕГЭ-2026: типовые варианты", publisher:"Национальное образование", audience:"10–11 класс · актуальный формат", minAge:16,maxAge:18,minLevel:3,maxLevel:5, goals:["ege"], skills:["balanced","writing","grammar"], traits:["exam","tests","intensive"], cover:"/covers/ege-2026.jpg", description:"Актуальный тренажёр ЕГЭ для диагностики, контроля времени и регулярных пробных работ.", caution:"Должен дополнять, а не заменять основной языковой курс." },
];

const heroCovers = [courses[12], courses[14], courses[16], courses[21]];
const goldDust = [
  [5, 15, 0], [11, 72, 1.1], [17, 38, 2.4], [24, 88, .7], [31, 9, 1.8],
  [38, 63, 3.1], [45, 24, .4], [52, 82, 2], [59, 12, 2.8], [65, 54, 1.4],
  [72, 92, .2], [78, 31, 2.2], [84, 69, 1], [90, 18, 3.4], [95, 79, 1.7],
  [8, 48, 2.7], [21, 59, 1.5], [35, 94, 3.6], [48, 43, .9], [61, 76, 2.5],
  [75, 7, 1.2], [88, 47, 3], [97, 34, .5],
] as const;
const levelIndex: Record<string, number> = { beginner:0, false_beginner:1, a1:1, a2:2, b1:3, b2:4, c1:5, c2:6 };

function ageFrom(value: string) {
  const map: Record<string, number> = { "6-9":8, "10-11":11, "12-14":13, "15-17":16, "18-25":21, "26-40":33, "41-60":50, "61+":65 };
  return map[value] ?? 18;
}

function getLabel(questionId: string, value: string) {
  return questions.find(q => q.id === questionId)?.options.find(o => o.value === value)?.label ?? value;
}

function scoreCourse(course: Course, answers: Answers) {
  let score = 20;
  const age = ageFrom(String(answers.age ?? "18-25"));
  const level = levelIndex[String(answers.level)] ?? 2;
  if (age >= course.minAge && age <= course.maxAge) score += 28;
  else score -= Math.min(18, Math.abs(age - Math.max(course.minAge, Math.min(age, course.maxAge))));
  if (level >= course.minLevel && level <= course.maxLevel) score += 22;
  else score -= Math.abs(level - Math.max(course.minLevel, Math.min(level, course.maxLevel))) * 7;
  [answers.general, answers.situation, answers.exam].filter(Boolean).forEach(goal => {
    if (course.goals.includes(String(goal))) score += 24;
  });
  (answers.skills as string[] ?? []).forEach(skill => { if (course.skills.includes(skill)) score += 4; });
  (answers.preferences as string[] ?? []).forEach(trait => { if (course.traits.includes(trait)) score += 3; });
  const preferences = answers.preferences as string[] ?? [];
  const skills = answers.skills as string[] ?? [];
  if (course.difficulty === "challenging") {
    if (preferences.includes("intensive")) score += 10;
    if (preferences.includes("calm")) score -= 8;
    if (level >= 3) score += 5;
    if (skills.includes("reading")) score += 5;
    if (skills.includes("writing")) score += 3;
  }
  if (course.difficulty === "accessible") {
    if (preferences.includes("calm")) score += 8;
    if (preferences.includes("intensive")) score -= 6;
    if (level <= 1) score += 5;
    if (skills.includes("speaking")) score += 4;
  }
  if (answers.general === "school" && course.id === "family-friends") score += 12;
  if (answers.schoolClass === "1-4" && course.id === "family-friends") score += 7;
  if (answers.general === "speaking" && course.id === "kids-box") score += 10;
  if (answers.schoolClass === "1-4" && course.id === "academy-stars" && preferences.includes("intensive")) score += 6;
  if (answers.schoolClass === "9" && course.goals.includes("oge")) score += 16;
  if ((answers.schoolClass === "10" || answers.schoolClass === "11") && course.goals.includes("ege")) score += 12;
  return score;
}

function workload(answers: Answers) {
  const exam = String(answers.exam ?? "");
  const situation = String(answers.situation ?? "");
  const general = String(answers.general ?? "");
  let range = "100–160";
  if (exam === "oge") range = "120–180";
  else if (exam === "ege") range = "180–260";
  else if (exam.startsWith("ielts") || exam === "toefl") range = "160–240";
  else if (exam === "b1_exam") range = "80–120";
  else if (exam === "b2_exam") range = "100–150";
  else if (exam === "c1_exam") range = "130–190";
  else if (exam === "c2_exam") range = "160–220";
  else if (situation === "travel") range = "24–40";
  else if (situation === "interview") range = "16–30";
  else if (["work","business","professional"].includes(situation)) range = "100–180";
  else if (["study_abroad","academic"].includes(situation)) range = "140–220";
  else if (general === "beginner") range = "90–140";

  const deadline = String(answers.deadline ?? "unknown");
  const lessons = deadline === "1-3" ? 3 : deadline === "3-6" ? 2 : 2;
  const duration = answers.duration === "45" ? "60 минут" : answers.duration === "90" ? "90 минут" : "60 минут";
  const independent = exam ? "3–5 часов" : situation === "travel" ? "1–2 часа" : "2–3 часа";
  return { range, lessons, duration, independent };
}

function CourseCover({ course }: { course: Course }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="cover-fallback" role="img" aria-label={`Обложка ${course.title}`}>
        <span>{course.publisher}</span>
        <strong>{course.title}</strong>
        <small>{course.audience.split("·")[1]?.trim() ?? "English course"}</small>
      </div>
    );
  }

  return <img src={course.cover} alt={`Обложка ${course.title}`} onError={() => setFailed(true)} />;
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ interests:[], skills:[], preferences:[] });
  const [resultMode, setResultMode] = useState(false);
  const [detailCourse, setDetailCourse] = useState<Course | null>(null);
  const [placementCourse, setPlacementCourse] = useState<Course | null>(null);
  const [placementStep, setPlacementStep] = useState(0);
  const [placementAnswers, setPlacementAnswers] = useState<Record<string, number>>({});
  const [placementFinished, setPlacementFinished] = useState(false);
  const question = questions[step];

  useEffect(() => {
    document.body.style.overflow = open || placementCourse ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open, placementCourse]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (placementCourse) setPlacementCourse(null);
      else if (detailCourse) setDetailCourse(null);
      else if (open) setOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [detailCourse, open, placementCourse]);

  const recommendations = useMemo(() => courses
    .map(course => ({ course, score: scoreCourse(course, answers) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2), [answers]);

  const selected = answers[question?.id];
  const canContinue = question?.type === "multi" ? Array.isArray(selected) && selected.length > 0 : Boolean(selected);

  const start = () => { setOpen(true); setStep(0); setResultMode(false); };
  const close = () => { setDetailCourse(null); setOpen(false); };
  const reset = () => { setDetailCourse(null); setAnswers({ interests:[], skills:[], preferences:[] }); setStep(0); setResultMode(false); };
  const next = () => step === questions.length - 1 ? setResultMode(true) : setStep(s => s + 1);
  const skip = () => {
    setAnswers(prev => ({ ...prev, [question.id]: question.type === "multi" ? [] : "" }));
    next();
  };
  const toggle = (value: string) => {
    const current = Array.isArray(answers[question.id]) ? answers[question.id] as string[] : [];
    setAnswers(prev => ({ ...prev, [question.id]: current.includes(value) ? current.filter(v => v !== value) : [...current, value] }));
  };
  const load = workload(answers);
  const studentAge = ageFrom(String(answers.age ?? "18-25"));
  const placementTrack: PlacementTrack = studentAge <= 11 ? "kids" : studentAge <= 17 ? "teens" : "adults";
  const placementTest = placementTests[placementTrack];
  const placementQuestion = placementTest.questions[placementStep];
  const placementResult = scorePlacement(placementTrack, placementAnswers);
  const courseStage = placementCourse ? getCourseStage(placementCourse.id, placementResult.level, placementCourse.minLevel, placementCourse.maxLevel) : null;
  const beginPlacement = (course: Course) => {
    setDetailCourse(null);
    setPlacementCourse(course);
    setPlacementStep(0);
    setPlacementAnswers({});
    setPlacementFinished(false);
  };
  const nextPlacement = () => {
    if (placementStep === placementTest.questions.length - 1) setPlacementFinished(true);
    else setPlacementStep(current => current + 1);
  };

  return (
    <main className="site-shell">
      <div className="paper-texture" aria-hidden="true" />
      <div className="gold-dust" aria-hidden="true">
        {goldDust.map(([left, top, delay], index) => (
          <i key={index} style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${delay}s` }} />
        ))}
      </div>
      <section className="hero" id="top">
        <header className="topbar">
          <a className="brand" href="#top" aria-label="Teachers Book Shelf — на главную">Teachers Book Shelf</a>
        </header>
        <div className="hero-collage" aria-hidden="true">
          <img className="vintage-accessories" src="/unified-vintage-background.png" alt="" />
          {heroCovers.map((course, index) => (
            <div className={`editorial-cover editorial-cover-${index + 1}`} key={course.id}><CourseCover course={course} /></div>
          ))}
        </div>

        <div className="hero-paper">
          <div className="hero-copy">
            <h1>Найдите учебник,<br />который подходит<br /><em>именно вам</em></h1>
            <p className="lead">Ответьте на несколько вопросов — и получите два подходящих УМК с объяснением выбора.</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={start}>Подобрать УМК</button>
              <span className="duration">2–3 минуты</span>
            </div>
          </div>
        </div>
        <footer className="footer"><span>▱&nbsp;&nbsp;Без регистрации и сбора данных</span></footer>
      </section>

      {open && (
        <div className="modal-backdrop" role="presentation">
          <section className={`wizard ${resultMode ? "wizard-result" : ""}`} role="dialog" aria-modal="true" aria-labelledby="wizard-title">
            <button className="modal-close" onClick={close} aria-label="Закрыть">×</button>
            {!resultMode ? (
              <>
                <div className="wizard-head">
                  <div className="progress-copy"><span>Шаг {step + 1} из {questions.length}</span><span>{Math.round(((step + 1) / questions.length) * 100)}%</span></div>
                  <div className="progress-track"><span style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
                </div>
                <div className="wizard-body">
                  <p className="modal-kicker">Персональный подбор</p>
                  <h2 id="wizard-title">{question.title}</h2>
                  <p className="question-hint">{question.hint}</p>
                  {question.type === "select" ? (
                    <label className="select-wrap">
                      <span className="sr-only">Выберите вариант</span>
                      <select value={String(answers[question.id] ?? "")} onChange={e => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}>
                        <option value="">Выберите из списка</option>
                        {question.options.map(item => <option value={item.value} key={item.value}>{item.label}</option>)}
                      </select>
                    </label>
                  ) : (
                    <div className="chip-grid">
                      {question.options.map(item => {
                        const active = Array.isArray(answers[question.id]) && (answers[question.id] as string[]).includes(item.value);
                        return <button key={item.value} className={`choice-chip ${active ? "active" : ""}`} onClick={() => toggle(item.value)}>{active && <span>✓</span>}{item.label}</button>;
                      })}
                    </div>
                  )}
                </div>
                <div className="wizard-actions">
                  <button className="text-button" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>← Назад</button>
                  <div className="action-right">
                    {question.skippable && <button className="skip-button" onClick={skip}>Пропустить</button>}
                    <button className="next-button" onClick={next} disabled={!canContinue}>Далее <span>→</span></button>
                  </div>
                </div>
              </>
            ) : (
              <div className="results">
                <div className="results-intro">
                  <p className="modal-kicker">Подбор завершён</p>
                  <h2 id="wizard-title">Ваши рекомендации готовы</h2>
                  <p>{getLabel("age", String(answers.age ?? ""))} · {getLabel("level", String(answers.level ?? ""))} · {getLabel("format", String(answers.format ?? ""))}</p>
                </div>
                <div className="recommendation-grid">
                  {recommendations.map(({ course, score }, index) => {
                    const percent = Math.max(70, Math.min(96, Math.round(64 + score / 3)));
                    return (
                      <article className={`recommendation-card ${index === 0 ? "best" : ""}`} key={course.id}>
                        <div className="book-thumb"><CourseCover course={course} /></div>
                        <div className="book-info">
                          <div className="book-topline"><span>{index === 0 ? "Лучший выбор" : "Альтернатива"}</span><strong>{percent}%</strong></div>
                          <h3>{course.title}</h3>
                          <p className="publisher">{course.publisher} · {course.audience}</p>
                          <p>{course.description}</p>
                          <div className="caution"><strong>Учтите:</strong> {course.caution}</div>
                          <div className="card-actions">
                            <button className="level-test-button" onClick={() => beginPlacement(course)}>Определить уровень курса</button>
                            <button className="detail-link" onClick={() => setDetailCourse(course)}>Подробнее о курсе и комплекте <span>→</span></button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
                <section className="workload-card">
                  <div><span>Ориентировочный объём</span><strong>{load.range} часов</strong></div>
                  <div><span>Рекомендуемый режим</span><strong>{load.lessons} занятия в неделю</strong></div>
                  <div><span>Продолжительность</span><strong>{load.duration}</strong></div>
                  <div><span>Самостоятельная работа</span><strong>{load.independent} в неделю</strong></div>
                </section>
                <p className="result-note">Расчёт ориентировочный: скорость зависит от стартового уровня, регулярности и качества самостоятельной практики.</p>
                <div className="results-actions">
                  <button className="text-button" onClick={() => { setResultMode(false); setStep(questions.length - 1); }}>← Изменить ответы</button>
                  <button className="next-button" onClick={reset}>Пройти заново</button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
      {detailCourse && courseDetails[detailCourse.id] && (
        <div className="detail-backdrop" role="presentation" onMouseDown={() => setDetailCourse(null)}>
          <section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={event => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setDetailCourse(null)} aria-label="Закрыть подробное описание">×</button>
            <div className="detail-heading">
              <div className="detail-cover"><CourseCover course={detailCourse} /></div>
              <div>
                <p className="modal-kicker">Подробно об УМК</p>
                <h2 id="detail-title">{detailCourse.title}</h2>
                <p className="detail-meta">{detailCourse.publisher} · {detailCourse.audience}</p>
                <p className="detail-positioning">{courseDetails[detailCourse.id].positioning}</p>
              </div>
            </div>
            <div className="fit-grid">
              <div className="fit-card fit-good"><span>Подойдёт</span><p>{courseDetails[detailCourse.id].bestFor}</p></div>
              <div className="fit-card fit-bad"><span>Не подойдёт</span><p>{courseDetails[detailCourse.id].avoidIf}</p></div>
              <div className="fit-card fit-teacher"><span>Нагрузка на преподавателя</span><p>{courseDetails[detailCourse.id].teacherWork}</p></div>
            </div>
            <div className="components-section">
              <div className="components-title"><p className="modal-kicker">Состав комплекта</p><h3>Что входит в УМК</h3></div>
              <div className="components-grid">
                <DetailList title="Для ученика" items={courseDetails[detailCourse.id].studentKit} />
                <DetailList title="Для преподавателя" items={courseDetails[detailCourse.id].teacherKit} />
                <DetailList title="Аудио и видео" items={courseDetails[detailCourse.id].media} />
                <DetailList title="Дополнительные материалы" items={courseDetails[detailCourse.id].extras} />
              </div>
            </div>
            <div className="availability-note"><strong>Важно о комплектации:</strong> {courseDetails[detailCourse.id].availability}</div>
            <div className="detail-footer">
              <button className="level-test-button" onClick={() => beginPlacement(detailCourse)}>Определить подходящий уровень</button>
              {courseDetails[detailCourse.id].source && <a href={courseDetails[detailCourse.id].source} target="_blank" rel="noreferrer">Официальная страница ↗</a>}
            </div>
          </section>
        </div>
      )}
      {placementCourse && (
        <div className="placement-backdrop" role="presentation">
          <section className="placement-modal" role="dialog" aria-modal="true" aria-labelledby="placement-title">
            <button className="modal-close" onClick={() => setPlacementCourse(null)} aria-label="Закрыть тест">×</button>
            {!placementFinished ? (
              <>
                <div className="placement-head">
                  <div>
                    <p className="modal-kicker">Универсальная диагностика · {placementTest.age}</p>
                    <h2 id="placement-title">Уровень для {placementCourse.title}</h2>
                  </div>
                  <span>{placementStep + 1}/{placementTest.questions.length}</span>
                </div>
                <div className="progress-track placement-progress"><span style={{ width: `${((placementStep + 1) / placementTest.questions.length) * 100}%` }} /></div>
                <div className="placement-body">
                  <p className="placement-prompt">{placementQuestion.prompt}</p>
                  {placementQuestion.context && <div className="placement-context">{placementQuestion.context}</div>}
                  <div className="answer-list">
                    {placementQuestion.options.map((option, index) => (
                      <button
                        key={option}
                        className={placementAnswers[placementQuestion.id] === index ? "selected" : ""}
                        onClick={() => setPlacementAnswers(current => ({ ...current, [placementQuestion.id]: index }))}
                      ><span>{String.fromCharCode(65 + index)}</span>{option}</button>
                    ))}
                  </div>
                </div>
                <div className="placement-actions">
                  <button className="text-button" disabled={placementStep === 0} onClick={() => setPlacementStep(current => Math.max(0, current - 1))}>← Назад</button>
                  <button className="skip-button" onClick={nextPlacement}>Не знаю</button>
                  <button className="next-button" disabled={placementAnswers[placementQuestion.id] === undefined} onClick={nextPlacement}>
                    {placementStep === placementTest.questions.length - 1 ? "Получить результат" : "Далее"} <span>→</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="placement-result">
                <p className="modal-kicker">Результат диагностики</p>
                <div className="result-level"><span>Предварительный уровень</span><strong>{placementResult.cefr}</strong><small>{placementResult.correct} из {placementResult.max} правильных ответов</small></div>
                <h2 id="placement-title">Рекомендуем<br /><em>{placementCourse.title}: {courseStage?.stage}</em></h2>
                {courseStage?.outside && placementResult.level < placementCourse.minLevel && (
                  <p className="range-warning">Для начала этой линейки требуется уровень не ниже {cefrLabels[placementCourse.minLevel]}. Сначала рекомендуем укрепить языковую базу.</p>
                )}
                {courseStage?.outside && placementResult.level > placementCourse.maxLevel && (
                  <p className="range-warning">Результат выше верхней ступени этой линейки. Стоит рассмотреть более сложный курс.</p>
                )}
                <div className="diagnostic-note"><strong>Важно:</strong> это общий результат универсальной авторской диагностики, а не сертификат и не официальный тест издательства. Для точного выбора уровня требуется комплексная оценка знаний ученика преподавателем, включая устную речь, письмо и аудирование.</div>
                <div className="placement-result-actions">
                  <button className="text-button" onClick={() => { setPlacementStep(0); setPlacementAnswers({}); setPlacementFinished(false); }}>Пройти ещё раз</button>
                  <button className="next-button" onClick={() => setPlacementCourse(null)}>Вернуться к рекомендациям</button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="component-card">
      <h4>{title}</h4>
      <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
    </section>
  );
}
