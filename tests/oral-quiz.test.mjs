import test from "node:test";
import assert from "node:assert/strict";
import {ORAL_QUIZ, acceptOral} from "../lib/oral-quiz.ts";

const q = id => ORAL_QUIZ.find(x => x.id === id);

test("chaque phrase modèle est acceptée", () => {
  for (const item of ORAL_QUIZ) assert.ok(acceptOral(item, [item.model.replace(/\[.*?\]/g, "Anna")]), item.id);
});

test("réponses orales plausibles", () => {
  assert.ok(acceptOral(q("greet"), ["good afternoon primavera anna speaking how can I help you"]));
  assert.ok(!acceptOral(q("greet"), ["hello anna speaking"]));
  assert.ok(acceptOral(q("absent"), ["I'm sorry he's in a meeting can I take a message"]));
  assert.ok(!acceptOral(q("absent"), ["can I take a message"]));
  assert.ok(acceptOral(q("repeat"), ["sorry I didn’t catch that"]));
  assert.ok(acceptOral(q("slow"), ["can you speak slower please"]));
  assert.ok(!acceptOral(q("spell"), ["what is your name"]));
  assert.ok(acceptOral(q("bye"), ["thanks for calling, have a nice day"]));
});
