"use client";

import QuizArena from "../../day2/quiz/QuizArena";
import { VOCABULARY_BANK } from "@/lib/quiz-vocabulary";

// Day 3 · Module 02 — vocabulaire CADGA (239 questions, 30 tirées au sort par partie).
export default function Day3VocabularyQuizPage() {
  return (
    <QuizArena
      bank={VOCABULARY_BANK}
      questionsPerGame={30}
      title="L'Arène du Vocabulaire"
      homeHref="/day3"
      joinPath="/day3/join"
      eyebrow="Day 03 · Module 02"
      headline={["Tout le vocabulaire", "CADGA."]}
    />
  );
}
