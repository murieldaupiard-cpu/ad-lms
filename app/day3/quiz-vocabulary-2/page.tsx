"use client";

import QuizArena from "../../day2/quiz/QuizArena";
import { VOCABULARY_BANK_2 } from "@/lib/quiz-vocabulary-2";

// Day 3 · Module 06 — L'Arène 2 : questions nouvelles (193), 60 tirées au sort par partie.
export default function Day3VocabularyQuiz2Page() {
  return (
    <QuizArena
      bank={VOCABULARY_BANK_2}
      questionsPerGame={60}
      quizKey="vocab2"
      title="L'Arène 2"
      homeHref="/day3"
      joinPath="/day3/join"
      eyebrow="Day 03 · Module 06"
      headline={["Expressions et", "situations."]}
    />
  );
}
