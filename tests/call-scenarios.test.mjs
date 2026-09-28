import assert from "node:assert/strict";
import test from "node:test";
import {SCENARIOS, scoreFiche} from "../lib/call-scenarios.ts";

test("MES 1 : la fiche attendue est validée et les erreurs sont refusées", () => {
  const s = SCENARIOS[0];
  const ok = {firstName: "Marc", lastName: "DESCHAMPS", job: "Responsable du développement", company: "Lush Cosmetics", city: "Toronto", country: "Canada",
    reason: "Réclamation : livraison en retard (prévue le 5/01, reçue le 15/01) et 3 cartons endommagés", action: "Rappeler M. Deschamps en urgence",
    countryCode: "+1", phone: "416 360 77 88", email: "m.deschamps@lushcosmetics.ca"};
  for (const [k, v] of Object.entries(ok)) assert.equal(scoreFiche(s, k, v), true, k);
  assert.equal(scoreFiche(s, "lastName", "Deschamp"), false);
  assert.equal(scoreFiche(s, "phone", "416 360 7789"), false);
  assert.equal(scoreFiche(s, "email", "m.deschamps@lush.ca"), false);
  assert.equal(scoreFiche(s, "reason", "Problème de livraison"), false);
  assert.equal(s.recipient, "Joël SALU");
  assert.equal(new Set(s.criteria.map(c => c.id)).size, s.criteria.length);
});
