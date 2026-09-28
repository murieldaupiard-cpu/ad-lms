"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import "../../day2/method/method.css";
import "./objet.css";
import { SITUATIONS, type Situation } from "./situations";

// ---------------------------------------------------------------------------
// Day 3 · Module 03 — « L'objet de l'email »
//
// Critère 7 de la grille : « rédige un objet d'email clair et pertinent ».
// Il n'était enseigné nulle part. Ce module donne la convention, les catégories
// de Primevère, puis dix situations où l'objet se construit par sélection —
// l'apprenant voit son objet s'assembler avant de devoir l'écrire seul en MES.
// ---------------------------------------------------------------------------

const QUI = [
  { label: "Prospect", detail: "Il veut acheter vos produits, mais n’a encore jamais commandé." },
  { label: "Client existant", detail: "Il est déjà dans la base. Sa fiche existe." },
  { label: "Distributeur exclusif", detail: "L’un des quinze partenaires dont le contrat est déjà signé." },
  { label: "Distributeur potentiel", detail: "Il ne veut pas acheter pour lui : il veut représenter la marque sur un territoire." },
  { label: "Fournisseur", detail: "C’est lui qui livre Primevère, pas l’inverse." },
];
const POURQUOI = [
  { label: "Demande d’informations", detail: "Tarifs, gamme, conditions — rien de chiffré encore." },
  { label: "Demande de devis", detail: "Il attend un prix ferme sur une quantité précise." },
  { label: "Commande", detail: "Il achète. Volume et référence à faire remonter." },
  { label: "Réclamation", detail: "Un problème : marchandise, livraison ou facturation." },
  { label: "Changement de coordonnées", detail: "Une fiche client est à modifier." },
  { label: "Relance", detail: "Il a déjà écrit ou appelé, et attend toujours." },
];

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = arr.slice();
  let s = seed * 9301 + 49297;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Picks = { cat: string | null; comp: string | null; dem: string | null };
const EMPTY: Picks = { cat: null, comp: null, dem: null };

export default function Day3Objet() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<Picks>(EMPTY);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const s: Situation = SITUATIONS[index];
  const options = useMemo(
    () => ({
      cat: shuffle(s.categories, s.id * 3),
      comp: shuffle(s.companies, s.id * 7),
      dem: shuffle(s.demandes, s.id * 11),
    }),
    [s]
  );

  const right = {
    cat: s.categories[s.category],
    comp: s.companies[s.company],
    dem: s.demandes[s.demande],
  };
  const complete = Boolean(picks.cat && picks.comp && picks.dem);
  const allRight = picks.cat === right.cat && picks.comp === right.comp && picks.dem === right.dem;

  const preview = `${picks.cat ?? "…"} – ${picks.comp ?? "…"} – ${picks.dem ?? "…"}`;

  function validate() {
    if (!complete || checked) return;
    setChecked(true);
    if (allRight) setScore((v) => v + 1);
  }
  function next() {
    if (index === SITUATIONS.length - 1) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setPicks(EMPTY);
    setChecked(false);
  }
  function restart() {
    setIndex(0);
    setPicks(EMPTY);
    setChecked(false);
    setScore(0);
    setDone(false);
  }
  const go = (n: number) => {
    setStep(n);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="vm-page">
      <div className="vm-shell">
        <header className="vm-top">
          <div>
            <span>CADGA · DAY 03 · MODULE 03</span>
            <strong>L’OBJET DE L’EMAIL</strong>
          </div>
          <div className="vm-progress">
            <i>
              <em style={{ width: `${(step / 4) * 100}%` }} />
            </i>
            <small>ÉTAPE {step} / 4</small>
          </div>
          <button onClick={() => router.push("/day3")}>EXIT</button>
        </header>

        {step === 1 && (
          <section className="vm-card">
            <div className="vm-heading">
              <span>LA RÈGLE</span>
              <h1>Trois informations, dans cet ordre</h1>
              <p>
                Joël Salu reçoit des dizaines d’emails par jour. L’objet décide du sort du vôtre : qui va le traiter,
                dans quel ordre il passe, et si on le retrouve le jour où le client rappellera.
              </p>
            </div>

            <div className="ob-anatomy">
              <div className="ob-line">
                <b>Objet :</b>
                <span className="ob-cat">Prospect</span>
                <i>–</i>
                <span className="ob-comp">Aurora Beauty Ltd</span>
                <i>–</i>
                <span className="ob-dem">demande de devis pour 200 coffrets</span>
              </div>
              <div className="ob-legend">
                <article>
                  <b className="ob-cat">1</b>
                  <div>
                    <h3>La catégorie</h3>
                    <p>Qui appelle, ou pourquoi. C’est ce qui oriente vers le bon service.</p>
                  </div>
                </article>
                <article>
                  <b className="ob-comp">2</b>
                  <div>
                    <h3>L’entreprise</h3>
                    <p>Celle de votre interlocuteur — jamais Primevère. Elle permet de retrouver le dossier.</p>
                  </div>
                </article>
                <article>
                  <b className="ob-dem">3</b>
                  <div>
                    <h3>La demande</h3>
                    <p>En quelques mots concrets. « Demande » tout seul ne dit rien.</p>
                  </div>
                </article>
              </div>
            </div>

            <div className="ob-compare">
              <article className="bad">
                <span>À ÉVITER</span>
                <b>Objet : Message important</b>
                <p>Ne dit ni qui, ni quoi. Il faudra ouvrir, lire, et peut-être rappeler le client.</p>
              </article>
              <article className="bad">
                <span>À ÉVITER</span>
                <b>Objet : Appel de Primevère</b>
                <p>Primevère, c’est vous. L’entreprise attendue est celle de l’interlocuteur.</p>
              </article>
              <article className="good">
                <span>EXPLOITABLE</span>
                <b>Objet : Réclamation – Cosmética Rio Ltda – douze flacons brisés</b>
                <p>Le service, le dossier et l’urgence sont lisibles en une ligne.</p>
              </article>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="vm-card">
            <div className="vm-heading">
              <span>LES CATÉGORIES</span>
              <h1>Onze mots à connaître</h1>
              <p>
                Cinq disent qui appelle, six disent pourquoi. Un objet en retient un seul — celui qui détermine le
                traitement de la demande.
              </p>
            </div>

            <h3 className="ob-sub">Qui appelle</h3>
            <div className="ob-cats">
              {QUI.map((c) => (
                <article key={c.label}>
                  <b>{c.label}</b>
                  <p>{c.detail}</p>
                </article>
              ))}
            </div>

            <h3 className="ob-sub">Pourquoi il appelle</h3>
            <div className="ob-cats">
              {POURQUOI.map((c) => (
                <article key={c.label}>
                  <b>{c.label}</b>
                  <p>{c.detail}</p>
                </article>
              ))}
            </div>

            <div className="ob-note">
              <b>Trois mots qu’on confond tout le temps.</b> La question n’est pas « depuis quand ? » mais « il veut
              quoi ? ». Le <i>prospect</i> veut acheter vos produits. Le <i>distributeur potentiel</i> veut les vendre
              pour vous sur un territoire, et se porte candidat. Le <i>distributeur exclusif</i> est l’un des quinze
              dont le contrat est déjà signé. Une commande, une candidature et un partenariat ne partent pas au même
              service.
            </div>
          </section>
        )}

        {step === 3 && !done && (
          <section className="vm-card">
            <div className="vm-heading">
              <span>LE JEU · SITUATION {index + 1} SUR {SITUATIONS.length}</span>
              <h1>Construisez l’objet</h1>
            </div>

            <div className="ob-status">
              <i>
                <em style={{ width: `${(index / SITUATIONS.length) * 100}%` }} />
              </i>
              <span>SCORE {score} / {SITUATIONS.length}</span>
            </div>

            <p className="ob-brief">{s.brief}</p>

            <div className="ob-builder">
              {(
                [
                  ["cat", "1 · LA CATÉGORIE", options.cat, right.cat],
                  ["comp", "2 · L’ENTREPRISE", options.comp, right.comp],
                  ["dem", "3 · LA DEMANDE", options.dem, right.dem],
                ] as const
              ).map(([key, label, list, correct]) => (
                <div className="ob-row" key={key}>
                  <small>{label}</small>
                  <div>
                    {list.map((opt) => {
                      const picked = picks[key] === opt;
                      const state = checked ? (opt === correct ? "correct" : picked ? "wrong" : "") : "";
                      return (
                        <button
                          key={opt}
                          className={`ob-chip ${picked ? "picked" : ""} ${state}`}
                          disabled={checked}
                          onClick={() => setPicks((p) => ({ ...p, [key]: opt }))}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className={`ob-preview ${checked ? (allRight ? "good" : "bad") : ""}`}>
              <small>VOTRE OBJET</small>
              <b>{preview}</b>
            </div>

            {checked && (
              <div className={`ob-feedback ${allRight ? "good" : "bad"}`}>
                <p>
                  <b>{allRight ? "Exact." : "Pas tout à fait."}</b> {s.why}
                </p>
                {!allRight && (
                  <p className="ob-answer">
                    Objet attendu : <i>{`${right.cat} – ${right.comp} – ${right.dem}`}</i>
                  </p>
                )}
              </div>
            )}

            <div className="ob-actions">
              {!checked ? (
                <button className="vm-primary" onClick={validate} disabled={!complete}>
                  VALIDER MON OBJET
                </button>
              ) : (
                <button className="vm-primary" onClick={next}>
                  {index === SITUATIONS.length - 1 ? "VOIR MON RÉSULTAT →" : "SITUATION SUIVANTE →"}
                </button>
              )}
            </div>
          </section>
        )}

        {step === 3 && done && (
          <section className="vm-card">
            <div className="vm-heading">
              <span>RÉSULTAT</span>
              <h1>
                {score} objet{score > 1 ? "s" : ""} sur {SITUATIONS.length}
              </h1>
              <p>
                {score >= 8
                  ? "Vous savez orienter une demande. En mise en situation, il ne restera qu’à l’écrire vous-même."
                  : score >= 5
                  ? "La structure est acquise, les catégories moins. Reprenez l’étape 2, puis rejouez."
                  : "Reprenez les catégories avant de rejouer : c’est le choix du premier mot qui décide de tout le reste."}
              </p>
            </div>
            <div className="ob-actions">
              <button onClick={restart}>REJOUER</button>
              <button className="vm-primary" onClick={() => go(4)}>
                TERMINER →
              </button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="vm-card vm-done">
            <div className="vm-award">★</div>
            <span>MODULE 03 TERMINÉ</span>
            <h1>Un objet, trois informations.</h1>
            <p>
              La catégorie, l’entreprise de votre interlocuteur, sa demande en quelques mots. C’est le critère 7 de la
              grille — et en mise en situation, vous l’écrirez sans propositions.
            </p>
            <button className="vm-primary" onClick={() => router.push("/day3")}>
              RETOUR À DAY 03
            </button>
          </section>
        )}

        {step < 4 && !(step === 3 && done) && (
          <footer className="vm-footer">
            <button onClick={() => go(Math.max(1, step - 1))} disabled={step === 1}>
              ‹ PRÉCÉDENT
            </button>
            <span>{["LA RÈGLE", "LES CATÉGORIES", "LE JEU"][step - 1]}</span>
            <button className="vm-primary" onClick={() => go(step + 1)} disabled={step === 3}>
              SUIVANT →
            </button>
          </footer>
        )}
      </div>
    </main>
  );
}
