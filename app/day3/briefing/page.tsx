"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../../day2/method/method.css";
import "./briefing.css";

// ---------------------------------------------------------------------------
// Day 3 · Module 04 — « L'épreuve en 20 minutes »
//
// Le module méthode du Day 2 était en lecture seule : il énonçait la méthode.
// Celui-ci ne la réexplique pas, il la fait prouver — remettre les étapes dans
// l'ordre, trancher traduire/recopier, reconnaître les champs de la fiche —
// puis annonce les conditions exactes de la mise en situation du jour.
// ---------------------------------------------------------------------------

const METHOD = [
  { key: "anticiper", title: "Anticiper", detail: "Lire tous les champs de la fiche avant de lancer l’audio." },
  { key: "ecouter", title: "Écouter", detail: "Repérer l’identité, le contexte et la demande." },
  { key: "renseigner", title: "Renseigner", detail: "Compléter toute la fiche en français." },
  { key: "verifier", title: "Vérifier", detail: "Contrôler les noms, les coordonnées et les informations clés." },
];
const SHUFFLED = ["renseigner", "verifier", "anticiper", "ecouter"];

type Rule = "traduire" | "recopier";
const SORT: { label: string; rule: Rule; why: string }[] = [
  { label: "Le prénom et le nom", rule: "recopier", why: "Un nom propre ne se traduit jamais : il s’épelle et se recopie à l’identique." },
  { label: "La fonction de l’interlocuteur", rule: "traduire", why: "« Export Manager » devient « Responsable export » : la fiche est en français." },
  { label: "Le nom de l’entreprise", rule: "recopier", why: "C’est une raison sociale. La traduire reviendrait à inventer une société qui n’existe pas." },
  { label: "La ville et le pays", rule: "traduire", why: "« Copenhagen, Denmark » devient « Copenhague, Danemark »." },
  { label: "L’adresse email", rule: "recopier", why: "Un caractère changé et le message n’arrive jamais. On recopie, puis on relit." },
  { label: "Le numéro de téléphone", rule: "recopier", why: "Chiffres et indicatif à l’identique, y compris le + de l’indicatif international." },
  { label: "Le motif de l’appel", rule: "traduire", why: "C’est du sens, pas une donnée : il se restitue en français professionnel." },
  { label: "La demande et l’action attendue", rule: "traduire", why: "C’est le cœur de l’email que vous transmettrez. En français, et complet." },
];

const FICHE = [
  "Prénom", "Nom", "Fonction", "Entreprise", "Ville", "Pays",
  "Motif de l’appel", "Demande et action attendue", "Adresse postale",
  "Indicatif international", "Numéro de téléphone", "Adresse email",
];
const INTRUS = ["Numéro de commande", "Date de livraison souhaitée", "Nom du service concerné"];
const ALL_FIELDS = [
  "Prénom", "Numéro de commande", "Nom", "Fonction", "Entreprise",
  "Date de livraison souhaitée", "Ville", "Pays", "Motif de l’appel",
  "Demande et action attendue", "Adresse postale", "Nom du service concerné",
  "Indicatif international", "Numéro de téléphone", "Adresse email",
];

const TIMELINE = [
  { min: "2 min", step: "Anticiper", detail: "Vous lisez la fiche avant d’avoir entendu quoi que ce soit. Vous savez ainsi ce que vous cherchez." },
  { min: "8 min", step: "Écouter et renseigner", detail: "L’audio est à votre main : vous pouvez revenir en arrière et réécouter autant que le temps le permet. Vous complétez la fiche en français." },
  { min: "8 min", step: "Transmettre", detail: "Vous rédigez l’email en français, adressé à la bonne personne dans l’entreprise, avec un objet clair." },
  { min: "2 min", step: "Vérifier", detail: "Vous relisez les noms, les chiffres et l’adresse email. C’est là que se rattrapent la moitié des erreurs." },
];

const STEP_TITLES = ["La méthode dans l’ordre", "Traduire ou recopier", "La fiche de renseignements", "Votre épreuve du jour", "Prêt"];

export default function Day3Briefing() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [order, setOrder] = useState<string[]>([]);
  const orderDone = order.length === METHOD.length;
  const orderOk = orderDone && order.every((k, i) => k === METHOD[i].key);

  const [sorted, setSorted] = useState<Record<string, Rule>>({});
  const sortDone = Object.keys(sorted).length === SORT.length;
  const sortOk = sortDone && SORT.every((item) => sorted[item.label] === item.rule);

  const [ticked, setTicked] = useState<string[]>([]);
  const [ficheChecked, setFicheChecked] = useState(false);
  const ficheOk =
    ticked.length === FICHE.length && FICHE.every((f) => ticked.includes(f)) && !INTRUS.some((i) => ticked.includes(i));

  const go = (n: number) => {
    setStep(n);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="vm-page">
      <div className="vm-shell">
        <header className="vm-top">
          <div>
            <span>CADGA · DAY 03 · MODULE 04</span>
            <strong>L’ÉPREUVE EN 20 MINUTES</strong>
          </div>
          <div className="vm-progress">
            <i>
              <em style={{ width: `${(step / 5) * 100}%` }} />
            </i>
            <small>ÉTAPE {step} / 5</small>
          </div>
          <button onClick={() => router.push("/day3")}>EXIT</button>
        </header>

        {step === 1 && (
          <section className="vm-card">
            <div className="vm-heading">
              <span>CONSOLIDATION · 1 SUR 3</span>
              <h1>La méthode, dans l’ordre</h1>
              <p>
                Hier, vous avez lu les quatre étapes. Aujourd’hui, vous les remettez en place sans aide. Cliquez-les
                dans l’ordre où vous les appliquerez tout à l’heure.
              </p>
            </div>

            <div className="rc-order">
              {SHUFFLED.map((key) => {
                const item = METHOD.find((m) => m.key === key)!;
                const rank = order.indexOf(key);
                return (
                  <button
                    key={key}
                    className={`rc-order-card ${rank >= 0 ? "picked" : ""}`}
                    disabled={rank >= 0}
                    onClick={() => setOrder((o) => [...o, key])}
                  >
                    <b>{rank >= 0 ? rank + 1 : "?"}</b>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.detail}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {orderDone && (
              <div className={`rc-verdict ${orderOk ? "good" : "bad"}`}>
                {orderOk ? (
                  <p>
                    <b>C’est exactement ça.</b> Anticiper, écouter, renseigner, vérifier. Retenez que « vérifier » est
                    une étape à part entière, pas un réflexe de fin si le temps reste.
                  </p>
                ) : (
                  <p>
                    <b>Pas encore.</b> Demandez-vous ce que vous faites <i>avant</i> d’appuyer sur lecture — et ce qu’il
                    reste à faire une fois la fiche remplie.
                  </p>
                )}
                <button onClick={() => setOrder([])}>RECOMMENCER</button>
              </div>
            )}
          </section>
        )}

        {step === 2 && (
          <section className="vm-card">
            <div className="vm-heading">
              <span>CONSOLIDATION · 2 SUR 3</span>
              <h1>Traduire ou recopier</h1>
              <p>
                C’est la décision qui fait perdre le plus de points. Pour chaque information, tranchez : elle se traduit
                en français, ou elle se recopie telle quelle ?
              </p>
            </div>

            <div className="rc-sort">
              {SORT.map((item) => {
                const choice = sorted[item.label];
                const answered = Boolean(choice);
                const right = choice === item.rule;
                return (
                  <div className={`rc-sort-row ${answered ? (right ? "good" : "bad") : ""}`} key={item.label}>
                    <span>{item.label}</span>
                    <div className="rc-sort-actions">
                      {(["traduire", "recopier"] as Rule[]).map((rule) => (
                        <button
                          key={rule}
                          className={choice === rule ? "chosen" : ""}
                          onClick={() => setSorted((s) => ({ ...s, [item.label]: rule }))}
                        >
                          {rule === "traduire" ? "JE TRADUIS" : "JE RECOPIE"}
                        </button>
                      ))}
                    </div>
                    {answered && <p className="rc-why">{right ? item.why : "Relisez l’information : est-ce une donnée à reproduire, ou du sens à restituer ?"}</p>}
                  </div>
                );
              })}
            </div>

            {sortDone && (
              <div className={`rc-verdict ${sortOk ? "good" : "bad"}`}>
                <p>
                  {sortOk ? (
                    <>
                      <b>Tout est juste.</b> La règle tient en une phrase : ce qui identifie ou permet de recontacter se
                      recopie, ce qui porte du sens se traduit.
                    </>
                  ) : (
                    <>
                      <b>Quelques lignes sont à revoir</b> — elles sont encadrées en rouge. Corrigez-les avant de
                      continuer.
                    </>
                  )}
                </p>
                <button onClick={() => setSorted({})}>RECOMMENCER</button>
              </div>
            )}
          </section>
        )}

        {step === 3 && (
          <section className="vm-card">
            <div className="vm-heading">
              <span>CONSOLIDATION · 3 SUR 3</span>
              <h1>La fiche de renseignements</h1>
              <p>
                Douze champs à remplir, et trois intrus dans cette liste. Cochez uniquement ce que la fiche vous
                demandera réellement.
              </p>
            </div>

            <div className="rc-fields">
              {ALL_FIELDS.map((field) => {
                const on = ticked.includes(field);
                const state = ficheChecked ? (FICHE.includes(field) ? (on ? "good" : "missed") : on ? "bad" : "") : "";
                return (
                  <button
                    key={field}
                    className={`rc-field ${on ? "on" : ""} ${state}`}
                    onClick={() => {
                      setFicheChecked(false);
                      setTicked((t) => (t.includes(field) ? t.filter((x) => x !== field) : [...t, field]));
                    }}
                  >
                    <i />
                    {field}
                  </button>
                );
              })}
            </div>

            <div className="rc-verdict-bar">
              <button className="vm-primary" onClick={() => setFicheChecked(true)}>
                VÉRIFIER MA SÉLECTION
              </button>
              <span>{ticked.length} champ(s) coché(s)</span>
            </div>

            {ficheChecked && (
              <div className={`rc-verdict ${ficheOk ? "good" : "bad"}`}>
                <p>
                  {ficheOk ? (
                    <>
                      <b>Les douze champs, sans les intrus.</b> Vous savez donc déjà ce que vous cherchez avant même
                      d’entendre le message. C’est tout l’intérêt de l’étape « anticiper ».
                    </>
                  ) : (
                    <>
                      <b>Regardez les couleurs.</b> En rouge, ce qui n’est pas sur la fiche. En orange, un champ que
                      vous avez oublié de cocher.
                    </>
                  )}
                </p>
              </div>
            )}
          </section>
        )}

        {step === 4 && (
          <section className="vm-card">
            <div className="vm-heading">
              <span>VOTRE ÉPREUVE DU JOUR</span>
              <h1>20 minutes, en autonomie</h1>
              <p>
                Vous allez passer une mise en situation complète : un message vocal en anglais, une fiche à remplir, un
                email à transmettre. Voici exactement comment le temps se répartit.
              </p>
            </div>

            <div className="rc-timeline">
              {TIMELINE.map((slot) => (
                <article key={slot.step}>
                  <b>{slot.min}</b>
                  <div>
                    <h3>{slot.step}</h3>
                    <p>{slot.detail}</p>
                  </div>
                </article>
              ))}
              <div className="rc-total">
                <span>TOTAL</span>
                <strong>20 minutes</strong>
              </div>
            </div>

            <div className="rc-why-20">
              <b>?</b>
              <div>
                <h3>Pourquoi 20 minutes, et pas 30 ?</h3>
                <p>
                  L’épreuve officielle accorde 30 minutes, parce que le candidat découvre l’entreprise le jour J : il
                  lui faut une dizaine de minutes pour comprendre qui fait quoi et à qui s’adresser. Vous, vous
                  connaissez déjà Primevère — ses équipes, ses produits, son réseau international. Ce temps de
                  découverte n’a plus lieu d’être, on le retire. Le jour de l’examen, avec une entreprise inconnue, vous
                  retrouverez vos 30 minutes.
                </p>
              </div>
            </div>

            <div className="rc-rules">
              <article>
                <b>🎧</b>
                <div>
                  <h3>Une seule mise en situation</h3>
                  <p>Pas d’essai blanc ici : ce que vous rendez est ce qui sera corrigé.</p>
                </div>
              </article>
              <article>
                <b>🇫🇷</b>
                <div>
                  <h3>Tout se rend en français</h3>
                  <p>La fiche comme l’email. Seuls les noms propres et les coordonnées restent à l’identique.</p>
                </div>
              </article>
              <article>
                <b>✅</b>
                <div>
                  <h3>Dix critères, deux issues</h3>
                  <p>Votre travail est corrigé sur les dix critères de la grille, et conclu par Acquis ou Non acquis.</p>
                </div>
              </article>
              <article>
                <b>🧭</b>
                <div>
                  <h3>Une remédiation ciblée</h3>
                  <p>Chaque critère manqué vous indique quoi retravailler, précisément — pas « revoyez le vocabulaire ».</p>
                </div>
              </article>
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="vm-card vm-done">
            <div className="vm-award">★</div>
            <span>MODULE 04 TERMINÉ</span>
            <h1>Vous n’avez plus à revenir en arrière.</h1>
            <p>
              La méthode, vous venez de la reconstituer sans aide. La règle traduire/recopier, vous l’avez tranchée
              ligne par ligne. La fiche, vous la connaissez avant de l’ouvrir. Il ne reste qu’à le faire pour de vrai.
            </p>
            <button className="vm-primary" onClick={() => router.push("/day3")}>
              RETOUR À DAY 03
            </button>
          </section>
        )}

        {step < 5 && (
          <footer className="vm-footer">
            <button onClick={() => go(Math.max(1, step - 1))} disabled={step === 1}>
              ‹ PRÉCÉDENT
            </button>
            <span>{STEP_TITLES[step - 1].toUpperCase()}</span>
            <button className="vm-primary" onClick={() => go(step + 1)}>
              {step === 4 ? "TERMINER →" : "SUIVANT →"}
            </button>
          </footer>
        )}
      </div>
    </main>
  );
}
