export type PlacementTrack = "kids" | "teens" | "adults";

export type PlacementQuestion = {
  id: string;
  prompt: string;
  context?: string;
  options: string[];
  answer: number;
};

export const placementTests: Record<PlacementTrack, { title: string; age: string; questions: PlacementQuestion[] }> = {
  kids: {
    title: "Диагностика для детей",
    age: "6–11 лет",
    questions: [
      { id:"k1", prompt:"Choose the correct word.", context:"This is my ___. She is my mother’s sister.", options:["aunt","uncle","cousin","grandfather"], answer:0 },
      { id:"k2", prompt:"Choose the correct answer.", context:"— What colour is the sun? — It is ___.", options:["yellow","seven","happy","small"], answer:0 },
      { id:"k3", prompt:"Complete the sentence.", context:"I ___ nine years old.", options:["am","is","are","be"], answer:0 },
      { id:"k4", prompt:"Choose the correct form.", context:"Tom ___ a blue school bag.", options:["have got","has got","got have","is got"], answer:1 },
      { id:"k5", prompt:"Choose the correct answer.", context:"___ you swim? — Yes, I can.", options:["Are","Do","Can","Have"], answer:2 },
      { id:"k6", prompt:"Complete the sentence.", context:"There ___ two books on the desk.", options:["is","are","am","be"], answer:1 },
      { id:"k7", prompt:"Choose the correct form.", context:"My brother usually ___ football after school.", options:["play","plays","is playing","played"], answer:1 },
      { id:"k8", prompt:"What is happening now?", context:"Look! The baby ___ with the cat.", options:["plays","played","is playing","play"], answer:2 },
      { id:"k9", prompt:"Choose the correct answer.", context:"We didn’t go to the park ___ it was raining.", options:["but","because","so","or"], answer:1 },
      { id:"k10", prompt:"Read and answer.", context:"Mia feeds her rabbit before breakfast. Then she walks to school with Ben. Who does Mia go to school with?", options:["Her rabbit","Ben","Her mother","Nobody"], answer:1 },
      { id:"k11", prompt:"Choose the correct form.", context:"Last Saturday we ___ a science museum.", options:["visit","visits","visited","are visiting"], answer:2 },
      { id:"k12", prompt:"Complete the sentence.", context:"This puzzle is ___ than the first one.", options:["difficult","more difficult","most difficult","the difficult"], answer:1 },
      { id:"k13", prompt:"Choose the correct answer.", context:"I’ve never ___ a horse, but I’d like to try.", options:["ride","rode","ridden","riding"], answer:2 },
      { id:"k14", prompt:"Read and choose the best answer.", context:"Leo wanted to build a bird house. He measured the wood twice before cutting it because he didn’t want to waste any. Why did Leo measure the wood twice?", options:["The wood was too heavy","He wanted to be accurate","He disliked the bird house","He had no tools"], answer:1 },
      { id:"k15", prompt:"Choose the correct form.", context:"If we finish early, we ___ a board game.", options:["play","played","will play","have played"], answer:2 },
    ],
  },
  teens: {
    title: "Диагностика для подростков",
    age: "12–17 лет",
    questions: [
      { id:"t1", prompt:"Choose the correct form.", context:"My best friend ___ near our school.", options:["live","lives","is live","living"], answer:1 },
      { id:"t2", prompt:"Complete the question.", context:"How often ___ you use social media?", options:["are","have","do","does"], answer:2 },
      { id:"t3", prompt:"Choose the best word.", context:"I was tired, ___ I went to bed early.", options:["because","but","so","although"], answer:2 },
      { id:"t4", prompt:"Choose the correct form.", context:"We ___ this film last weekend.", options:["see","have seen","saw","are seeing"], answer:2 },
      { id:"t5", prompt:"Complete the sentence.", context:"This app is much ___ to use than the old one.", options:["easy","easier","easiest","more easy"], answer:1 },
      { id:"t6", prompt:"Choose the correct answer.", context:"I’ve known Emma ___ primary school.", options:["for","since","during","from"], answer:1 },
      { id:"t7", prompt:"Read and answer.", context:"The school library used to close at four. After students completed a survey, it began staying open until six twice a week. What caused the change?", options:["A new librarian","A student survey","An examination","A public holiday"], answer:1 },
      { id:"t8", prompt:"Choose the correct form.", context:"When I arrived, they ___ basketball for nearly an hour.", options:["played","were playing","had been playing","have played"], answer:2 },
      { id:"t9", prompt:"Complete the sentence.", context:"You ___ have told me earlier; I could have helped.", options:["should","must","can","will"], answer:0 },
      { id:"t10", prompt:"Choose the best option.", context:"The teacher suggested ___ the presentation in pairs.", options:["prepare","to prepare","preparing","prepared"], answer:2 },
      { id:"t11", prompt:"Choose the correct answer.", context:"If I ___ more confident, I would join the debate club.", options:["am","were","have been","will be"], answer:1 },
      { id:"t12", prompt:"Read and infer.", context:"Nina deleted the first paragraph of her article. It contained several impressive facts, but none of them supported her main argument. Why did she remove it?", options:["It was too short","It was irrelevant","It was informal","It was copied"], answer:1 },
      { id:"t13", prompt:"Choose the correct form.", context:"The competition, ___ takes place every spring, attracts teams from twelve countries.", options:["that","what","which","where"], answer:2 },
      { id:"t14", prompt:"Choose the closest meaning.", context:"The new rule is likely to discourage students from leaving projects until the last minute.", options:["force students to cancel projects","make procrastination less attractive","allow students more time","reduce the number of projects"], answer:1 },
      { id:"t15", prompt:"Complete the sentence.", context:"Hardly ___ the announcement when questions began appearing online.", options:["they had posted","had they posted","they posted","did they posting"], answer:1 },
      { id:"t16", prompt:"Choose the best phrase.", context:"The evidence is not conclusive; ___, it raises an important question.", options:["nevertheless","therefore","for instance","in contrast to"], answer:0 },
      { id:"t17", prompt:"Choose the correct form.", context:"By next June, the team ___ on the project for two years.", options:["will work","will have been working","has worked","would work"], answer:1 },
      { id:"t18", prompt:"Read and infer the writer’s attitude.", context:"The proposal is ambitious, perhaps excessively so, yet dismissing it before the trial would be equally unwise.", options:["Entirely enthusiastic","Cautiously open-minded","Strongly opposed","Completely indifferent"], answer:1 },
    ],
  },
  adults: {
    title: "Диагностика для взрослых",
    age: "18+",
    questions: [
      { id:"a1", prompt:"Choose the correct form.", context:"I usually ___ the train to work.", options:["take","takes","am taking","took"], answer:0 },
      { id:"a2", prompt:"Complete the question.", context:"___ you ever visited Scotland?", options:["Did","Have","Were","Do"], answer:1 },
      { id:"a3", prompt:"Choose the best word.", context:"Could I ___ a table for two, please?", options:["book","order","keep","take"], answer:0 },
      { id:"a4", prompt:"Choose the correct form.", context:"We ___ in this flat since 2022.", options:["live","lived","have lived","are living"], answer:2 },
      { id:"a5", prompt:"Complete the sentence.", context:"The meeting was cancelled ___ the manager was ill.", options:["although","because","despite","unless"], answer:1 },
      { id:"a6", prompt:"Choose the best response.", context:"Would you mind sending me the updated file?", options:["Yes, I would mind","Not at all. I’ll send it now","I send it yesterday","It doesn’t matter me"], answer:1 },
      { id:"a7", prompt:"Read and answer.", context:"The hotel offers free cancellation until 6 p.m. on the day before arrival. Later cancellations are charged for one night. When can you cancel without paying?", options:["At any time","Before 6 p.m. the previous day","On arrival","Only a week before"], answer:1 },
      { id:"a8", prompt:"Choose the correct form.", context:"If the client ___ the proposal today, we can start on Monday.", options:["approves","will approve","approved","would approve"], answer:0 },
      { id:"a9", prompt:"Complete the sentence.", context:"I wish I ___ more time to prepare for the interview yesterday.", options:["have","had had","would have","have had"], answer:1 },
      { id:"a10", prompt:"Choose the best option.", context:"The report needs ___ before it is sent to the board.", options:["revise","to revising","revising","revised"], answer:2 },
      { id:"a11", prompt:"Choose the closest meaning.", context:"Sales remained stable, whereas operating costs rose considerably.", options:["Both figures increased","Costs fell but sales rose","Sales were unchanged but costs increased","Neither figure changed"], answer:2 },
      { id:"a12", prompt:"Complete the sentence.", context:"Had we known about the delay, we ___ a later flight.", options:["book","would book","would have booked","had booked"], answer:2 },
      { id:"a13", prompt:"Choose the correct word.", context:"The company is committed ___ reducing unnecessary packaging.", options:["to","for","with","at"], answer:0 },
      { id:"a14", prompt:"Read and infer.", context:"Remote work has widened the pool of applicants. It has also made informal knowledge-sharing harder to reproduce, a drawback that scheduled video calls only partly address.", options:["Remote work has no disadvantages","Video calls solve every problem","Remote work brings benefits and limitations","Applicants dislike remote work"], answer:2 },
      { id:"a15", prompt:"Choose the correct form.", context:"Not until the figures were checked again ___ the source of the error.", options:["we discovered","did we discover","we had discovered","had we discover"], answer:1 },
      { id:"a16", prompt:"Choose the best phrase.", context:"The policy may appear restrictive. ___, it gives local teams considerable freedom in how they meet the target.", options:["Even so","As a result","For example","In addition to"], answer:0 },
      { id:"a17", prompt:"Choose the closest meaning.", context:"Her response was deliberately non-committal.", options:["She made a firm promise","She avoided taking a clear position","She answered immediately","She disagreed angrily"], answer:1 },
      { id:"a18", prompt:"Read and infer the tone.", context:"While the headline figures are encouraging, they should not obscure the uneven progress beneath them.", options:["Uncritical optimism","Measured caution","Complete rejection","Personal frustration"], answer:1 },
    ],
  },
};

export const cefrLabels = ["Pre-A1", "A1", "A2", "B1", "B2", "C1", "C2"];

export function scorePlacement(track: PlacementTrack, answers: Record<string, number>) {
  const questions = placementTests[track].questions;
  const correct = questions.reduce((sum, question) => sum + (answers[question.id] === question.answer ? 1 : 0), 0);
  const max = questions.length;
  let level = 0;
  if (track === "kids") {
    level = correct <= 3 ? 0 : correct <= 6 ? 1 : correct <= 10 ? 2 : 3;
  } else {
    level = correct <= 3 ? 1 : correct <= 6 ? 2 : correct <= 10 ? 3 : correct <= 14 ? 4 : 5;
  }
  return { correct, max, level, cefr: cefrLabels[level] };
}

const courseStages: Record<string, Partial<Record<number, string>>> = {
  "super-minds": { 0:"Starter", 1:"Level 1–2", 2:"Level 3–4", 3:"Level 5–6" },
  "family-friends": { 0:"Starter", 1:"Level 1–2", 2:"Level 3–4", 3:"Level 5–6" },
  "kids-box": { 0:"Starter", 1:"Level 1–2", 2:"Level 3–4", 3:"Level 5–6" },
  "academy-stars": { 0:"Starter", 1:"Level 1–2", 2:"Level 3–4", 3:"Level 5–6" },
  "gogetter": { 0:"Starter", 1:"Level 1", 2:"Level 2–3", 3:"Level 4" },
  "wider-world": { 0:"Starter", 1:"Level 1", 2:"Level 2", 3:"Level 3–4" },
  "get-involved": { 1:"Level 1", 2:"Level 2", 3:"Level 3–4", 4:"Level 5" },
  "life-vision": { 1:"Elementary", 2:"Pre-Intermediate", 3:"Intermediate", 4:"Upper-Intermediate", 5:"Advanced" },
  "primary-path": { 0:"Foundation", 1:"Level 1–2", 2:"Level 3–4", 3:"Level 5", 4:"Level 6" },
  "prepare": { 1:"Level 1–2", 2:"Level 3–4", 3:"Level 5–6", 4:"Level 7–8", 5:"Level 9" },
  "solutions": { 1:"Elementary", 2:"Pre-Intermediate", 3:"Intermediate", 4:"Upper-Intermediate", 5:"Advanced" },
  "gateway": { 1:"A1+", 2:"A2", 3:"B1/B1+", 4:"B2/B2+", 5:"C1" },
  "english-file": { 0:"Beginner", 1:"Elementary", 2:"Pre-Intermediate", 3:"Intermediate", 4:"Upper-Intermediate", 5:"Advanced", 6:"Advanced Plus" },
  "speakout": { 0:"Starter", 1:"A1", 2:"A2", 3:"B1", 4:"B2", 5:"C1–C2" },
  "empower": { 1:"A1 Starter/Elementary", 2:"A2 Pre-Intermediate", 3:"B1 Intermediate", 4:"B2 Upper-Intermediate", 5:"C1 Advanced" },
  "roadmap": { 1:"A1", 2:"A2", 3:"B1", 4:"B2", 5:"C1", 6:"C1–C2" },
  "business-partner": { 1:"A1", 2:"A2", 3:"B1", 4:"B2", 5:"C1" },
  "tourism": { 2:"Pre-Intermediate", 3:"Intermediate", 4:"Upper-Intermediate" },
  "mindset": { 2:"Foundation", 3:"Level 1", 4:"Level 2", 5:"Level 3" },
  "complete-preliminary": { 3:"Complete Preliminary (B1)" },
  "compact-first": { 4:"Compact First (B2)" },
  "complete-advanced": { 5:"Complete Advanced (C1)" },
  "objective-proficiency": { 6:"Objective Proficiency (C2)" },
  "oge-2026": { 2:"Языковая база перед тренажёром", 3:"Основной тренажёр ОГЭ" },
  "ege-2026": { 3:"Базовая подготовка", 4:"Основной тренажёр ЕГЭ", 5:"Продвинутый уровень" },
};

export function getCourseStage(courseId: string, level: number, minLevel: number, maxLevel: number) {
  const clamped = Math.max(minLevel, Math.min(maxLevel, level));
  const map = courseStages[courseId] ?? {};
  if (map[clamped]) return { stage: map[clamped]!, clamped, outside: level !== clamped };
  const candidates = Object.keys(map).map(Number).sort((a, b) => Math.abs(a - clamped) - Math.abs(b - clamped));
  return { stage: map[candidates[0]] ?? `ступень ${cefrLabels[clamped]}`, clamped, outside: level !== clamped };
}
