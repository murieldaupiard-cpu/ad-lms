"use client";

import {useEffect, useState, type CSSProperties} from "react";
import {useRouter} from "next/navigation";
import "../../day2/method/method.css";
import "../chapters.css";
import {CONSEILS, EVITER, GUIDE, GUIDE_PDF, NOT_UNDERSTOOD, Poster} from "../content";
import {ORAL_QUIZ} from "@/lib/oral-quiz";
import OralQuiz from "./OralQuiz";

// AD · Exam Prep Part 2 · Chapitre 2 — le guide apprenant de l'appel (8 étapes) puis son quiz oral.
// ?etape=n ouvre directement l'étape n (lien de remédiation depuis la correction d'une MES).

const STEP_TITLES = ["Bienvenue", "Étapes 1 à 4", "Étapes 5 à 8", "Quand vous n’avez pas compris", "Quiz oral", "Terminé"];
const STEP_DESCRIPTIONS = ["", "Accueillir, identifier, orienter, comprendre le motif", "Vérifier, s’engager, clôturer, parler un anglais professionnel", "Demander de l’aide, les conseils clés et les erreurs à éviter", `${ORAL_QUIZ.length} situations : dites la bonne phrase à voix haute`];
const LAST = STEP_TITLES.length;

function Steps({from, to, focus}: {from: number; to: number; focus: number}) {
  return (
    <div className="ad-steps">
      {GUIDE.filter(g => g.n >= from && g.n <= to).map(g => (
        <article key={g.n} id={`etape-${g.n}`} className={focus === g.n ? "focus" : ""} style={{"--c": g.color} as CSSProperties}>
          <b className="ad-num">{g.n}</b>
          <div className="ad-body"><h3><span aria-hidden="true">{g.icon}</span> {g.title}</h3><p>{g.text}</p></div>
          <ul className="ad-phrases" lang="en">
            {g.phrases.map(p => <li key={p}>“{p}”</li>)}
            {g.example && <li className="ad-example" lang="fr">{g.example}</li>}
          </ul>
          <small className="ad-crit">Critère {g.n}</small>
        </article>
      ))}
    </div>
  );
}

export default function GuideChapter() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [focus, setFocus] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const go = (n: number) => { setStep(Math.max(1, Math.min(LAST, n))); setFocus(0); window.scrollTo({top: 0, behavior: "smooth"}); };

  useEffect(() => {
    const n = Number(new URLSearchParams(window.location.search).get("etape"));
    if (n >= 1 && n <= 8) {
      setStep(n <= 4 ? 2 : 3); setFocus(n);
      setTimeout(() => document.getElementById(`etape-${n}`)?.scrollIntoView({behavior: "smooth", block: "center"}), 150);
    }
  }, []);

  return (
    <main className="vm-page ad-guide">
      <div className="vm-shell">
        <header className="vm-top">
          <div><span>AD · EXAM PREP PART 2 · CHAPITRE 02</span><strong>LE GUIDE DE L’APPEL</strong></div>
          <div className="vm-progress"><i><em style={{width: `${(step / LAST) * 100}%`}}/></i><small>STEP {step} / {LAST}</small></div>
          <button onClick={() => router.push("/exam-prep-2")}>EXIT</button>
        </header>

        {focus > 0 && (step === 2 || step === 3) && <p className="ad-remediation">🔁 Remédiation : relisez l’<b>étape {focus}</b> et dites les phrases à voix haute, puis refaites votre MES.</p>}

        {step === 1 && (
          <section className="vm-card vm-welcome">
            <span>CHAPITRE 02</span>
            <h1>Le guide de l’appel</h1>
            <p>8 étapes pour mener un appel professionnel en anglais et prendre un message complet. Chaque étape correspond à un critère de la grille. À la fin du chapitre, un quiz oral : vous dites les phrases à voix haute.</p>
            <div className="vm-meta">
              <div><b>📖</b><span>LE GUIDE<small>8 ÉTAPES + PHRASES UTILES</small></span></div>
              <div><b>🎙</b><span>QUIZ ORAL<small>{ORAL_QUIZ.length} SITUATIONS</small></span></div>
              <div><b>☎️</b><span>ENSUITE<small>LA MES 1</small></span></div>
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
            <Poster href={GUIDE_PDF} title="Guide apprenant : appel téléphonique en anglais" text="Tout le guide sur une page. Téléchargez-le et gardez-le à côté de vous pendant vos MES." label="TÉLÉCHARGER LE GUIDE PDF"/>
          </section>
        )}

        {step === 2 && (
          <section className="vm-card">
            <div className="vm-heading"><span>GUIDE APPRENANT · ÉTAPES 1 À 4</span><h1>Accueillir et comprendre</h1><p>Lisez chaque étape, puis dites les phrases à voix haute.</p></div>
            <Steps from={1} to={4} focus={focus}/>
          </section>
        )}

        {step === 3 && (
          <section className="vm-card">
            <div className="vm-heading"><span>GUIDE APPRENANT · ÉTAPES 5 À 8</span><h1>Vérifier, s’engager, conclure</h1><p>Ces étapes font la différence : le critère 5 est obligatoire pour réussir l’épreuve.</p></div>
            <Steps from={5} to={8} focus={focus}/>
          </section>
        )}

        {step === 4 && (
          <section className="vm-card">
            <div className="vm-heading"><span>GUIDE APPRENANT</span><h1>Quand vous n’avez pas compris</h1><p>Restez poli(e) et demandez de l’aide : c’est normal, et c’est exactement ce que fait un(e) professionnel(le).</p></div>
            <div className="ad-boxes">
              <div className="ad-box purple"><h3>❓ Demander de l’aide</h3><ul lang="en">{NOT_UNDERSTOOD.map(p => <li key={p}>“{p.replace(" (pour prendre le temps de noter)", "")}”{p.includes("(") && <small lang="fr">pour prendre le temps de noter</small>}</li>)}</ul></div>
              <div className="ad-box green"><h3>💡 Conseils clés</h3><ul>{CONSEILS.map(p => <li key={p}>{p}</li>)}</ul></div>
              <div className="ad-box red"><h3>⚠️ À éviter</h3><ul>{EVITER.map(p => <li key={p}>{p}</li>)}</ul></div>
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="vm-card">
            <div className="vm-heading"><span>QUIZ ORAL</span><h1>À vous de parler</h1><p>Pour chaque situation, dites la phrase en anglais. Utilisez de préférence Chrome, Edge ou Safari, et autorisez le micro.</p></div>
            <OralQuiz onDone={s => { setScore(s); go(LAST); }}/>
          </section>
        )}

        {step === LAST && (
          <section className="vm-card vm-done">
            <div className="vm-award">★</div>
            <span>CHAPITRE 02 TERMINÉ</span>
            <h1>{score === null ? "Vous connaissez le guide." : `Quiz oral : ${score} / ${ORAL_QUIZ.length}`}</h1>
            <p>{score !== null && score < ORAL_QUIZ.length * 0.7 ? "Relisez le guide et refaites le quiz avant de passer à la MES 1." : "Vous êtes prêt(e) à décrocher : gardez le guide sous les yeux et lancez la MES 1."}</p>
            <button className="vm-primary" onClick={() => router.push("/exam-prep-2/mes/1")}>CHAPITRE 03 · MES 1 →</button>
            <button className="ad-secondary" onClick={() => { setScore(null); go(5); }}>REFAIRE LE QUIZ ORAL</button>
          </section>
        )}

        {step > 1 && step < LAST && step !== 5 && (
          <footer className="vm-footer">
            <button onClick={() => go(step - 1)}>‹ PRÉCÉDENT</button>
            <span>{STEP_TITLES[step - 1].toUpperCase()}</span>
            <button className="vm-primary" onClick={() => go(step + 1)}>{step === 4 ? "QUIZ ORAL →" : "SUIVANT →"}</button>
          </footer>
        )}
      </div>
    </main>
  );
}
