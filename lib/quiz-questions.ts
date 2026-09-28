export type QuestionType = "single" | "multi";

export type Question = {
  id: string;
  type: QuestionType;
  time: number; // seconds allowed
  prompt: string;
  options: string[];
  correct: number | number[];
};

export const QUESTION_BANK: Question[] = [
  {
    id: "q1",
    type: "multi",
    time: 45,
    prompt: "Hey there, friends! It's 08:45, and our buddy Liam is trying to figure out what time it is. Can you help him out? (3 réponses)",
    options: ["Quarter past eight", "Quarter to nine", "Eight forty-five", "Forty-five past eight"],
    correct: [1, 2, 3],
  },
  {
    id: "q2",
    type: "single",
    time: 25,
    prompt: "Hey there, friends! If it's 15:30 on the clock, what time is it really? Let's help Nora, Luna, and Ethan figure this out!",
    options: ["Three thirty", "Half past three", "Fifteen thirty", "All of the above"],
    correct: 3,
  },
  {
    id: "q3",
    type: "multi",
    time: 40,
    prompt: "Hey there, time travelers! Can you help Harper, Nora, and Luna figure out what 07:05 means? (2 réponses)",
    options: ["Seven five", "Five past seven", "Seven oh five", "Seven past five"],
    correct: [1, 2],
  },
  {
    id: "q4",
    type: "multi",
    time: 45,
    prompt: "Hey there, time travelers! Can you help Anika, Michael, and Ethan figure out what 23:50 means? (3 réponses)",
    options: ["Ten to midnight", "Ten past eleven", "Fifty past eleven", "Eleven fifty"],
    correct: [0, 2, 3],
  },
  {
    id: "q5",
    type: "multi",
    time: 40,
    prompt: "Hey there, time travelers! If Nora says it's “Quarter past nine in the evening,” what time could it possibly be? (2 réponses)",
    options: ["9:15 a.m.", "21:15", "19:15", "9:15 p.m."],
    correct: [1, 3],
  },
  {
    id: "q6",
    type: "single",
    time: 20,
    prompt: "Hey there, Arjun! Today is Monday, and guess what? In just three days, we'll be celebrating the middle of the week! Can you figure out which day it will be?",
    options: ["Wednesday", "Thursday", "Friday", "Saturday"],
    correct: 1,
  },
  {
    id: "q7",
    type: "single",
    time: 20,
    prompt: "Hey there, math whiz! If today is Friday, can you help Sophia figure out what day it was two days ago?",
    options: ["Wednesday", "Thursday", "Tuesday", "Saturday"],
    correct: 0,
  },
  {
    id: "q8",
    type: "single",
    time: 25,
    prompt: "Hey there, students! If Arjun, Mason, and Sophia were planning a party on 01/10/2025, how would they write the date?",
    options: ["The first of October, twenty twenty-five", "October one, twenty twenty-five", "October first, twenty twenty-five", "All of the above"],
    correct: 3,
  },
  {
    id: "q9",
    type: "multi",
    time: 40,
    prompt: "Hey there, students! Today's date is 25/09/2025. Can you help Grace, Nora, and Mason figure out which of the following ways to say the date is correct? (2 réponses)",
    options: [
      "September twenty-fifth, twenty twenty-five",
      "The twenty-five of September, two thousand twenty-five",
      "September the twenty-fifth, twenty twenty-five",
      "The September of twenty-five, twenty twenty-five",
    ],
    correct: [0, 2],
  },
  {
    id: "q10",
    type: "multi",
    time: 45,
    prompt: "Hey there, time travelers! It's 17:20, and our friends Daniel, Rohan, and Mia are trying to figure out how to say it. Can you help them out? (3 réponses)",
    options: ["Seventeen twenty", "Twenty past five in the evening", "Five twenty in the morning", "Five twenty PM"],
    correct: [0, 1, 3],
  },
  {
    id: "q11",
    type: "single",
    time: 15,
    prompt: "What is “fifty” in figures?",
    options: ["15", "55", "50", "5"],
    correct: 2,
  },
  {
    id: "q12",
    type: "single",
    time: 15,
    prompt: "What is “eighty-seven” in figures?",
    options: ["78", "80", "77", "87"],
    correct: 3,
  },
  {
    id: "q13",
    type: "single",
    time: 15,
    prompt: "What is “one hundred and sixteen” in figures?",
    options: ["160", "116", "106", "1,016"],
    correct: 1,
  },
  {
    id: "q14",
    type: "single",
    time: 15,
    prompt: "What is “two hundred and forty-five” in figures?",
    options: ["245", "254", "2,045", "240"],
    correct: 0,
  },
  {
    id: "q15",
    type: "single",
    time: 15,
    prompt: "What is “one thousand two hundred” in figures?",
    options: ["12,000", "1,020", "1,200", "120"],
    correct: 2,
  },
  {
    id: "q16",
    type: "single",
    time: 20,
    prompt: "What is “forty-two thousand and nineteen” in figures?",
    options: ["42,019", "42,190", "4,219", "420,019"],
    correct: 0,
  },
  {
    id: "q17",
    type: "single",
    time: 20,
    prompt: "What is “one hundred and twenty-five thousand” in figures?",
    options: ["1,025,000", "125,000", "125,100", "1,250,000"],
    correct: 1,
  },
  {
    id: "q18",
    type: "single",
    time: 20,
    prompt: "What is “seven hundred and sixty-three thousand four hundred” in figures?",
    options: ["763,040", "736,400", "763,400", "7,634,000"],
    correct: 2,
  },
  {
    id: "q19",
    type: "single",
    time: 20,
    prompt: "What is “twelve million three hundred and forty thousand” in figures?",
    options: ["12,034,000", "12,340,000", "123,400,000", "12,304,000"],
    correct: 1,
  },
  {
    id: "q20",
    type: "single",
    time: 20,
    prompt: "What is “nine hundred and eighty-seven million six hundred thousand” in figures?",
    options: ["987,060,000", "987,600,000", "98,760,000", "987,006,000"],
    correct: 1,
  },
  {
    id: "q21",
    type: "single",
    time: 15,
    prompt: "Which example is written in “uppercase”?",
    options: ["training", "Training", "TRAINING", "train_ing"],
    correct: 2,
  },
  {
    id: "q22",
    type: "single",
    time: 15,
    prompt: "Which example is written in “lowercase”?",
    options: ["EMAIL", "Email", "e-mail", "email"],
    correct: 3,
  },
  {
    id: "q23",
    type: "single",
    time: 15,
    prompt: "Which symbol is an “underscore”?",
    options: ["-", "_", "/", "."],
    correct: 1,
  },
  {
    id: "q24",
    type: "single",
    time: 15,
    prompt: "Which symbol is a “dash”?",
    options: ["_", ".", "-", ":"],
    correct: 2,
  },
  {
    id: "q25",
    type: "single",
    time: 15,
    prompt: "Which symbol is a “dot”?",
    options: [",", ":", ";", "."],
    correct: 3,
  },
  {
    id: "q26",
    type: "single",
    time: 15,
    prompt: "Which symbols are “brackets”?",
    options: [":", "( )", "\" \"", ";"],
    correct: 1,
  },
  {
    id: "q27",
    type: "single",
    time: 25,
    prompt: "What is “three billion four hundred and sixty-five million four hundred and sixty-three thousand five hundred and sixty-seven” in figures?",
    options: ["3,465,436,567", "3,465,463,567", "3,456,463,567", "3,465,463,657"],
    correct: 1,
  },
  {
    id: "q28",
    type: "single",
    time: 25,
    prompt: "What is “seven billion two hundred and thirty-four million six hundred and eighty-nine thousand one hundred and twenty-five” in figures?",
    options: ["7,234,689,125", "7,243,689,125", "7,234,698,125", "7,234,689,152"],
    correct: 0,
  },
  {
    id: "q29",
    type: "single",
    time: 25,
    prompt: "What is “one billion eight hundred and seventy-six million five hundred and forty-two thousand three hundred and ninety-one” in figures?",
    options: ["1,867,542,391", "1,876,524,391", "1,876,542,319", "1,876,542,391"],
    correct: 3,
  },
  {
    id: "q30",
    type: "single",
    time: 25,
    prompt: "What is “nine billion three hundred and twelve million seven hundred and fifty-six thousand four hundred and eighty-two” in figures?",
    options: ["9,312,765,482", "9,321,756,482", "9,312,756,482", "9,312,756,428"],
    correct: 2,
  },
  {
    id: "q31",
    type: "single",
    time: 25,
    prompt: "What is “five billion six hundred and forty-eight million two hundred and seventeen thousand nine hundred and thirty-four” in figures?",
    options: ["5,648,217,934", "5,684,217,934", "5,648,271,934", "5,648,217,943"],
    correct: 0,
  },
];

// Fisher-Yates shuffle — never mutates the input array.
function shuffleArray<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffles a single question's answer options and remaps the correct index(es)
// so they keep pointing at the right text after reordering.
function shuffleQuestionOptions(question: Question): Question {
  const order = shuffleArray(question.options.map((_, i) => i)); // new position -> old index
  const options = order.map((oldIdx) => question.options[oldIdx]);
  const remap = (oldIdx: number) => order.indexOf(oldIdx);
  const correct = Array.isArray(question.correct) ? question.correct.map(remap) : remap(question.correct);
  return { ...question, options, correct };
}

// Wayground-style shuffle: reorder the questions AND reorder each question's
// answers, freshly every time a game starts.
export function buildShuffledQuestions(bank: Question[] = QUESTION_BANK): Question[] {
  return shuffleArray(bank).map(shuffleQuestionOptions);
}

