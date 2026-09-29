"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import "../../day2/method/method.css";
import "../chapters.css";
import {GRILLE, GRILLE_PDF, Poster} from "../content";
import {FICHE} from "@/lib/call-scenarios";

// AD · Exam Prep Part 2 · Chapitre 1 — l'épreuve et la grille d'évaluation de Muriel (PDF téléchargeable).
// ?section=fiche ouvre directement la fiche de renseignements (remédiation des critères 9 et 10).

const STEP_TITLES = ["Bienvenue", "L’épreuve", "Les 10 critères", "La fiche et le destinataire", "Terminé"];
const STEP_DESCRIPTIONS = ["", "La compétence évaluée et le déroulé d’une MES", "Ce qui est évalué et les conditions de réussite", "Critères 9 et 10 : la prise de message"];
const LAST = STEP_TITLES.length;

export default function GrilleChapter() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [remediation, setRemediation] = useState(false);
  const go = (n: number) => { setStep(Math.max(1, Math.min(LAST, n))); setRemediation(false); window.scrollTo({top: 0, behavior: "smooth"}); };
  useEffect(() => { if (new URLSearchParams(window.location.search).get("section") === "fiche") { setStep(4); setRemediation(true); } }, []);

  return (
    <main className="vm-page ad-guide">
      <div className="vm-shell">
        <header className="vm-top">
          <div><span>AD · EXAM PREP PART 2 · CHAPITRE 01</span><strong>LA GRILLE D’ÉVALUATION</strong></div>
          <div className="vm-progress"><i><em style={{width: `${(step / LAST) * 100}%`}}/></i><small>STEP {step} / {LAST}</small></div>
          <button onClick={() => router.push("/exam-prep-2")}>EXIT</button>
        </header>

        {remediation && step === 4 && <p className="ad-remediation">🔁 Remédiation : revoyez ce qu’il faut noter sur la fiche et comment choisir le destinataire, puis refaites votre MES.</p>}

        {step === 1 && (
          <section className="vm-card vm-welcome">
            <span>CHAPITRE 01</span>
            <h1>La grille d’évaluation</h1>
            <p>Avant de décrocher, découvrez ce qui est attendu : la compétence évaluée, le déroulé d’une mise en situation, les 10 critères de la grille et les conditions de réussite.</p>
            <div className="vm-meta">
              <div><b>📖</b><span>LECTURE<small>~5 MIN</small></span></div>
              <div><b>✅</b><span>10 CRITÈRES<small>ACQUIS / NON ACQUIS</small></span></div>
              <div><b>📖</b><span>ENSUITE<small>CHAPITRE 02 · LE GUIDE</small></span></div>
            </div>
            <div className="vm-steps">
              <h2>AU PROGRAMME</h2>
              {STEP_TITLES.slice(1, LAST - 1).map((title, i) => (
                <button key={title} onClick={() => go(i + 2)}>
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  <span><strong>{title}</strong><small>{STEP_DESCRIPTIONS[i + 1]}</small></span>
                  <em>→</em>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="vm-card">
            <div className="vm-heading">
              <span>REAC TP AD (MILLÉSIME 04) · CP4</span>
              <h1>Assurer l’interface orale entre l’équipe de direction et les interlocuteurs internes et externes</h1>
              <p>Épreuve : appel téléphonique en anglais et prise de message.</p>
            </div>
            <h3 className="vm-subheading">Comment se passe une MES sur la plateforme</h3>
            <div className="vm-steps-flow">
              <div className="vm-flow-step"><b>☎️</b><strong>Le téléphone sonne</strong><p>Vous décrochez : un interlocuteur étranger, joué par l’IA, vous parle en direct, en anglais.</p></div>
              <div className="vm-flow-step"><b>📝</b><strong>Vous menez l’appel</strong><p>Vous suivez les étapes du guide et remplissez la fiche de renseignements pendant l’appel.</p></div>
              <div className="vm-flow-step"><b>📨</b><strong>Vous transmettez</strong><p>Vous choisissez le bon destinataire dans l’organigramme de Primevère, puis vous recevez votre correction selon la grille.</p></div>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="vm-card">
            <div className="vm-heading">
              <span>GRILLE D’ÉVALUATION · MES AD</span>
              <h1>Comment votre appel sera évalué</h1>
              <p>10 critères, chacun acquis ou non acquis. Les critères 1 à 8 portent sur l’appel, les critères 9 et 10 sur la prise de message.</p>
            </div>
            <ol className="ad-grille">
              {GRILLE.map(g => (
                <li key={g.n}>
                  <b>{g.n}</b>
                  <div><strong>{g.title}{g.required && <em>OBLIGATOIRE</em>}</strong><p>{g.text}</p></div>
                  <div className="vm-grille-marks" aria-hidden="true"><i className="ok"/><i className="no"/></div>
                </li>
              ))}
            </ol>
            <div className="ad-success">
              <span>🎯 CONDITIONS DE RÉUSSITE</span>
              <p>L’épreuve est <b>ACQUISE</b> si au moins <b>6 critères sur 10</b> sont validés, <b>et</b> si les critères <b>1 (Accueil)</b> et <b>5 (Coordonnées vérifiées et informations reformulées)</b> sont validés.</p>
            </div>
            <Poster href={GRILLE_PDF} title="Grille d’évaluation : MES AD" text="La grille utilisée pour corriger chaque appel. Utilisez-la pour vous auto-évaluer après chaque MES." label="TÉLÉCHARGER LA GRILLE PDF"/>
          </section>
        )}

        {step === 4 && (
          <section className="vm-card">
            <div className="vm-heading">
              <span>CRITÈRES 9 ET 10 · PENDANT L’APPEL</span>
              <h1>La fiche de renseignements</h1>
              <p>Vous la remplissez en français pendant l’appel. La fonction de l’appelant doit être notée en français. Puis vous choisissez le destinataire du message.</p>
            </div>
            <div className="vm-fiche">
              {FICHE.filter(f => f.key !== "address").map(f => <div className="vm-fiche-row" key={f.key}><span className="vm-fiche-label">{f.label}</span><span className="vm-fiche-hint"/><span className="vm-fiche-blank"/></div>)}
              <div className="vm-fiche-row ad-recipient"><span className="vm-fiche-label">Destinataire du message</span><span className="vm-fiche-hint">Organigramme Primevère</span><span className="vm-fiche-blank"/></div>
            </div>
            <div className="vm-criterion">
              <span>POUR VALIDER LES CRITÈRES 9 ET 10</span>
              <p>La fiche est validée avec au plus 1 champ faux ou manquant, si le nom de l’appelant et au moins un moyen de contact sont exacts. Le destinataire doit être la bonne personne dans l’entreprise : aidez-vous de l’organigramme (Day 02 · Découvrir Primevère).</p>
            </div>
          </section>
        )}

        {step === LAST && (
          <section className="vm-card vm-done">
            <div className="vm-award">★</div>
            <span>CHAPITRE 01 TERMINÉ</span>
            <h1>Vous savez comment vous serez évalué(e).</h1>
            <p>Place au guide de l’appel : les 8 étapes, les phrases utiles et le quiz oral.</p>
            <button className="vm-primary" onClick={() => router.push("/exam-prep-2/guide")}>CHAPITRE 02 · LE GUIDE →</button>
          </section>
        )}

        {step > 1 && step < LAST && (
          <footer className="vm-footer">
            <button onClick={() => go(step - 1)}>‹ PRÉCÉDENT</button>
            <span>{STEP_TITLES[step - 1].toUpperCase()}</span>
            <button className="vm-primary" onClick={() => go(step + 1)}>{step === LAST - 1 ? "TERMINER →" : "SUIVANT →"}</button>
          </footer>
        )}
      </div>
    </main>
  );
}
