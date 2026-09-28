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
  assert.equal(scoreFiche(s, "job", "Business Development Manager"), false);
  assert.equal(scoreFiche(s, "phone", "416 360 7789"), false);
  assert.equal(scoreFiche(s, "email", "m.deschamps@lush.ca"), false);
  assert.equal(scoreFiche(s, "reason", "Problème de livraison"), false);
  assert.equal(s.recipient, "Joël SALU");
  assert.equal(new Set(s.criteria.map(c => c.id)).size, s.criteria.length);
});

test("Grille AD : fiche validée à 1 erreur près, réussite à 6/10 avec les critères 1 et 5", async () => {
  const {ficheValidated, globalResult, FICHE} = await import("../lib/call-scenarios.ts");
  const all = Object.fromEntries(FICHE.map(f => [f.key, true]));
  assert.equal(ficheValidated(all), true);
  assert.equal(ficheValidated({...all, city: false}), true);
  assert.equal(ficheValidated({...all, city: false, job: false}), false);
  assert.equal(ficheValidated({...all, lastName: false}), false);
  assert.equal(ficheValidated({...all, phone: false, email: false}), false);
  assert.equal(ficheValidated({...all, phone: false}), true);
  const ten = ["accueil","identification","orientation","motif","coordonnees","demande","cloture","english","fiche","destinataire"];
  const v = n => Object.fromEntries(ten.map((id, i) => [id, i < n]));
  assert.equal(globalResult(v(6)).acquis, true);
  assert.equal(globalResult(v(5)).acquis, false);
  assert.equal(globalResult({...v(10), coordonnees: false}).acquis, false);
  assert.equal(globalResult({...v(10), accueil: false}).acquis, false);
});
