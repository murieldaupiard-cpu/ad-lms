"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./method.css";

// ---------------------------------------------------------------------------
// CADGA · Day 2 · Module 04 — Voicemail Exam Method
//
// A read-only "method" module (no exercises, no scoring): it walks the
// trainee through the exact material they need before ever touching a real
// voicemail — the official REAC competency behind the exercise, how the real
// exam is organised (REAC/RE, arrêté du 20/06/2025), the concrete listening
// format used in class (verified by the AFPAR trainers), the information
// sheet used while listening, and the evaluation grid used to mark the
// practice exercise. The CADGA business vocabulary itself now has its own
// full module — see Module 03 (/day2/vocabulary).
// ---------------------------------------------------------------------------

const ANGLAIS_SAVOIR_FAIRE = [
  "Épeler des noms et des adresses mail et énoncer des numéros de téléphone en anglais",
  "Retranscrire des noms, des adresses mail et des numéros de téléphone énoncés en anglais",
  "Répondre en anglais à une demande simple d'un interlocuteur non francophone",
  "Restituer à l'écrit les informations principales d'un échange simple en anglais",
];

const FICHE_FIELDS = [
  { label: "Prénom", hint: "First name" },
  { label: "Nom", hint: "Last name" },
  { label: "Fonction", hint: "Job title" },
  { label: "Nom de l'entreprise", hint: "Company name" },
  { label: "Ville", hint: "City" },
  { label: "Pays", hint: "Country" },
  { label: "Objet de l'appel", hint: "Reason for the call" },
  { label: "Indicatif pays + numéro de téléphone", hint: "Country code + phone number" },
  { label: "Adresse e-mail", hint: "Email address" },
];

type GrilleGroup = { title: string; items: string[] };
const GRILLE: GrilleGroup[] = [
  {
    title: "Comprendre le message (1 à 5)",
    items: [
      "Identifie correctement le prénom et le nom de l'interlocuteur",
      "Identifie l'entreprise, la fonction et la localisation de l'interlocuteur",
      "Comprend le motif de l'appel et l'action attendue",
      "Relève exactement le numéro de téléphone et l'indicatif international",
      "Relève exactement l'adresse électronique",
    ],
  },
  {
    title: "Transmettre par email (6 à 9)",
    items: [
      "Adresse l'email au bon destinataire dans l'entreprise",
      "Rédige un objet d'email clair et pertinent",
      "Transmet fidèlement les informations essentielles dans un ordre logique",
      "Rédige en français un email structuré, clair et professionnel",
    ],
  },
  {
    title: "Respecter la consigne (10)",
    items: [
      "Produit dans les 30 minutes un message complet et directement exploitable",
    ],
  },
];

const STEP_TITLES = ["Bienvenue", "La compétence anglaise", "Déroulé de l'examen", "Fiche de renseignement", "Grille d'évaluation", "Terminé"];
const STEP_DESCRIPTIONS = [
  "Découvrir le module",
  "La compétence officielle du REAC derrière cet exercice",
  "Comment se déroule vraiment l'épreuve, étape par étape",
  "Ce qu'il faut repérer pendant l'écoute",
  "Comment ton email sera évalué",
];

export default function VoicemailMethodModule() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  function go(n: number) {
    setStep(Math.max(1, Math.min(6, n)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="vm-page">
      <div className="vm-shell">
        <header className="vm-top">
          <div>
            <span>CADGA · MODULE 04</span>
            <strong>VOICEMAIL EXAM METHOD</strong>
          </div>
          <div className="vm-progress">
            <i>
              <em style={{ width: `${(step / 6) * 100}%` }} />
            </i>
            <small>STEP {step} / 6</small>
          </div>
          <button onClick={() => router.push("/day2")}>EXIT</button>
        </header>

        {step === 1 && (
          <section className="vm-card vm-welcome">
            <span>BIENVENUE</span>
            <h1>Voicemail Exam Method</h1>
            <p>
              Tu connais déjà le vocabulaire CADGA (Module 03) — ce module te donne le reste : la compétence officielle
              évaluée, le déroulé exact de l'épreuve, la fiche à remplir pendant l'écoute, et la grille qui servira à
              corriger ton email.
            </p>
            <div className="vm-meta">
              <div>
                <b>📖</b>
                <span>
                  LECTURE SEULE
                  <small>PAS D'EXERCICE ICI</small>
                </span>
              </div>
              <div>
                <b>🗂️</b>
                <span>
                  4 SECTIONS
                  <small>~8 MIN DE LECTURE</small>
                </span>
              </div>
              <div>
                <b>🎧</b>
                <span>
                  ENSUITE
                  <small>MODULE 05 · PRACTICE</small>
                </span>
              </div>
            </div>
            <div className="vm-steps">
              <h2>AU PROGRAMME</h2>
              {STEP_TITLES.slice(1, 5).map((title, i) => (
                <button key={title} onClick={() => go(i + 2)}>
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  <span>
                    <strong>{title}</strong>
                    <small>{STEP_DESCRIPTIONS[i + 1]}</small>
                  </span>
                  <em>→</em>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="vm-card">
            <div className="vm-heading">
              <span>REAC · COMPÉTENCE PROFESSIONNELLE N°1</span>
              <h1>Assurer l'accueil physique et téléphonique</h1>
              <p>C'est cette compétence du référentiel officiel du TP CADGA qui est derrière l'exercice voicemail → email.</p>
            </div>

            <div className="vm-quote">
              « Le cas échéant, prendre et transmettre les messages aux destinataires concernés en utilisant les outils
              appropriés et en garantissant leur fiabilité. Restituer à l'écrit les informations principales d'un échange
              simple en anglais. »
              <small>REAC CADGA — Fiche compétence professionnelle n°1</small>
            </div>

            <div className="vm-criterion">
              <span>CRITÈRE DE PERFORMANCE ÉVALUÉ</span>
              <p>« Les informations principales d'un échange simple en anglais sont transmises en français par écrit au destinataire cible. »</p>
            </div>

            <h3 className="vm-subheading">Ce que tu dois savoir faire en anglais</h3>
            <ul className="vm-check-list">
              {ANGLAIS_SAVOIR_FAIRE.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            <div className="vm-transversal">
              <span>COMPÉTENCES TRANSVERSALES CONCERNÉES</span>
              <div>
                <b>Communiquer</b>
                <b>Mobiliser les environnements numériques</b>
              </div>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="vm-card">
            <div className="vm-heading">
              <span>RÉFÉRENTIEL D'ÉVALUATION · ARRÊTÉ DU 20/06/2025</span>
              <h1>Comment se déroule l'examen</h1>
              <p>L'exercice voicemail → email fait partie de la Mise en Situation Professionnelle (MES) écrite de l'examen officiel.</p>
            </div>

            <div className="vm-timeline">
              <div className="vm-timeline-item">
                <b>1h45</b>
                <div>
                  <strong>Mise en situation écrite</strong>
                  <p>
                    Le candidat traite différents dossiers dans le respect des délais et des procédures. À partir d'une
                    communication simple en anglais (le voicemail), il rédige et transmet un message en français à
                    l'attention d'un destinataire cible.
                  </p>
                </div>
              </div>
              <div className="vm-timeline-item">
                <b>40 min</b>
                <div>
                  <strong>Mise en situation orale</strong>
                  <p>Dont 10 minutes de préparation, puis 30 minutes pour accueillir un visiteur et un collaborateur, traiter deux appels téléphoniques, et transmettre les messages pris en note.</p>
                </div>
              </div>
              <div className="vm-timeline-item">
                <b>35 min</b>
                <div>
                  <strong>Entretien technique, questionnement et entretien final</strong>
                  <p>10 min d'entretien technique + 10 min de questionnement à partir de production(s) + 30 min d'entretien final.</p>
                </div>
              </div>
              <div className="vm-timeline-total">Durée totale de l'épreuve pour le candidat : 3h00</div>
            </div>

            <div className="vm-heading vm-heading-tight">
              <span>EN CLASSE · FORMAT VÉRIFIÉ PAR LES FORMATEURS AFPAR</span>
              <h2>Concrètement, pour l'exercice voicemail</h2>
            </div>
            <div className="vm-steps-flow">
              <div className="vm-flow-step">
                <b>🎧</b>
                <strong>Écoute du message vocal</strong>
                <p>Le message vocal en anglais est diffusé.</p>
              </div>
              <div className="vm-flow-step">
                <b>10 min</b>
                <strong>Lecture de l'entreprise fictive</strong>
                <p>Le candidat prend connaissance des informations sur l'entreprise fictive et son contexte.</p>
              </div>
              <div className="vm-flow-step">
                <b>20 min</b>
                <strong>Réalisation de l'exercice</strong>
                <p>Noter les informations clés, rédiger l'email en français, le transmettre au destinataire cible.</p>
              </div>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="vm-card">
            <div className="vm-heading">
              <span>PENDANT L'ÉCOUTE</span>
              <h1>La fiche de renseignement</h1>
              <p>Ce sont exactement les informations que la grille d'évaluation va vérifier — repère-les pendant l'écoute du voicemail.</p>
            </div>
            <div className="vm-fiche">
              {FICHE_FIELDS.map((f) => (
                <div className="vm-fiche-row" key={f.label}>
                  <span className="vm-fiche-label">{f.label}</span>
                  <span className="vm-fiche-hint">{f.hint}</span>
                  <span className="vm-fiche-blank" />
                </div>
              ))}
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="vm-card">
            <div className="vm-heading">
              <span>GRILLE D'ÉVALUATION · MES · TP CADGA</span>
              <h1>Comment ton email sera noté</h1>
              <p>Une grille resserrée sur 10 critères observables, directement alignés sur les trois actions attendues en 30 minutes : comprendre, transmettre et finaliser.</p>
            </div>
            <div className="vm-grille">
              {GRILLE.map((group) => (
                <div className="vm-grille-group" key={group.title}>
                  <h3>{group.title}</h3>
                  {group.items.map((item) => (
                    <div className="vm-grille-row" key={item}>
                      <span>{item}</span>
                      <div className="vm-grille-marks" aria-label="Acquis ou non acquis">
                        <i className="ok" />
                        <i className="no" />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div className="vm-grille-legend">
                <span>
                  <i className="ok" /> Acquis
                </span>
                <span>
                  <i className="no" /> Non acquis
                </span>
              </div>
            </div>
            <div className="vm-poster-panel">
              <div>
                <span>SUPPORT À IMPRIMER</span>
                <h2>Grille d'évaluation - 30 minutes</h2>
                <p>Utilise cette grille pendant les entraînements pour repérer immédiatement ce qui est acquis et ce qui doit encore être travaillé.</p>
                <a href="/day2/grille-evaluation-voicemail-cadga.pdf" download>TÉLÉCHARGER LA GRILLE PDF ↓</a>
              </div>
              <object data="/day2/grille-evaluation-voicemail-cadga.pdf#toolbar=0&navpanes=0" type="application/pdf" aria-label="Aperçu de la grille d'évaluation">
                <a href="/day2/grille-evaluation-voicemail-cadga.pdf">Ouvrir la grille PDF</a>
              </object>
            </div>
          </section>
        )}

        {step === 6 && (
          <section className="vm-card vm-done">
            <div className="vm-award">★</div>
            <span>MODULE 04 TERMINÉ</span>
            <h1>Tu connais la méthode.</h1>
            <p>Tu es prêt(e) à passer au premier entraînement : écouter de vrais voicemails, prendre des notes, et rédiger ton email.</p>
            <button className="vm-primary" onClick={() => router.push("/day2")}>
              RETOUR À DAY 02
            </button>
          </section>
        )}

        {step > 1 && step < 6 && (
          <footer className="vm-footer">
            <button onClick={() => go(step - 1)}>‹ PRÉCÉDENT</button>
            <span>{STEP_TITLES[step - 1].toUpperCase()}</span>
            <button className="vm-primary" onClick={() => go(step + 1)}>
              {step === 5 ? "TERMINER →" : "SUIVANT →"}
            </button>
          </footer>
        )}
      </div>
    </main>
  );
}
