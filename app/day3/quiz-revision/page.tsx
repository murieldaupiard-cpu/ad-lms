"use client";

import QuizArena from "../../day2/quiz/QuizArena";
import { QUESTION_BANK } from "@/lib/quiz-questions";

// Day 3 · Module 01 — révision : nombres, symboles, heures, dates (31 questions).
export default function Day3RevisionQuizPage() {
  return (
    <QuizArena
      bank={QUESTION_BANK}
      title="L'Arène · Révision"
      homeHref="/day3"
      joinPath="/day3/join"
      eyebrow="Day 03 · Module 01"
      headline={["Nombres, symboles,", "heures et dates."]}
    />
  );
}
