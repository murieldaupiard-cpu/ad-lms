import type { Question } from "./quiz-questions";
import { VOCABULARY_BANK } from "./quiz-vocabulary";

// ---------------------------------------------------------------------------
// L'Arène 2 — Day 3 · Module 06
//
// Questions nouvelles uniquement (v47 et suivantes) : celles de la fiche
// Wayground « TP CADGA - RÉCAP DU VOCABULAIRE » (v1–v46) en sont exclues.
// Elles couvrent les 3 fiches de vocabulaire (mots, verbes, expressions et
// phrases-types).
// ---------------------------------------------------------------------------
export const VOCABULARY_BANK_2: Question[] = VOCABULARY_BANK.filter(
  (q) => Number(q.id.replace("v", "")) >= 47,
);
