"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "./mes.css";
import {
  FIELDS, RECIPIENTS, SUBJECTS, digits, normalise, scoreField,
  type FieldKey, type Subject,
} from "./subjects";

// ---------------------------------------------------------------------------
// Day 3 · Module 05 — la mise en situation évaluée.
//
// Contrairement à l'entraînement du Day 2, découpé en deux temps et sans
// chrono, tout se passe ici sur un seul écran, en continu, sous 20 minutes.
// L'audio et le chrono restent collés en haut, et la fiche remplie s'affiche
// en aide-mémoire à côté du cadre de rédaction : on ne remonte jamais.
// ---------------------------------------------------------------------------

const TOTAL_SECONDS = 20 * 60;
const EMPTY_FORM = Object.fromEntries(FIELDS.map((f) => [f.key, ""])) as Record<FieldKey, string>;

type Criterion = { text: string; ok: boolean; note: string };

function clock(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export default function Day3Mes() {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [phase, setPhase] = useState<"pick" | "brief" | "exam" | "result">("pick");
  const [subject, setSubject] = useState<Subject | null>(null);
  const [left, setLeft] = useState(TOTAL_SECONDS);
  const [timedOut, setTimedOut] = useState(false);

  const [form, setForm] = useState<Record<FieldKey, string>>(EMPTY_FORM);
  const [recipient, setRecipient] = useState("");
  const [mailSubject, setMailSubject] = useState("");
  const [message, setMessage] = useState("");

  const submit = useCallback((outOfTime: boolean) => {
    setTimedOut(outOfTime);
    setPhase("result");
    audioRef.current?.pause();
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (phase !== "exam") return;
    if (left <= 0) {
      submit(true);
      return;
    }
    const t = setTimeout(() => setLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, left, submit]);

  const results = useMemo(() => {
    if (!subject) return {} as Record<FieldKey, boolean>;
    return Object.fromEntries(FIELDS.map((f) => [f.key, scoreField(subject, f.key, form[f.key])])) as Record<FieldKey, boolean>;
  }, [subject, form]);

  const criteria = useMemo<Criterion[]>(() => {
    if (!subject) return [];
    const msg = normalise(message);
    const obj = normalise(mailSubject);
    const msgDigits = digits(message);

    const identity = results.firstName && results.lastName;
    const context = results.company && results.job && results.city && results.country;
    const purpose = results.reason && results.action;
    const tel = results.countryCode && results.phone;
    const mail = results.email;

    const rightRecipient = normalise(recipient).includes("salu");
    const objCat = /client|existant/.test(obj);
    const objCompany = obj.includes(normalise(subject.companyKey));
    const objDemande = /coordonnees|changement|adresse/.test(obj);
    const goodSubject = objCat && objCompany && objDemande;

    const addressTerms = (subject.groups.address ?? [[]])[0];
    const msgAddress = addressTerms.every((t) => msg.includes(normalise(t)));
    const msgPhone = subject.phoneDigits.some((d) => msgDigits.includes(d));
    const msgEmail = msg.includes(subject.answers.email.toLowerCase());
    const relayed = msgAddress && msgPhone && msgEmail;

    const greeting = /(bonjour|madame|monsieur)/.test(msg);
    const closing = /(cordialement|salutations|respectueusement)/.test(msg);
    const wellWritten = greeting && closing && message.trim().length >= 180;

    return [
      { text: "Identifie correctement le prénom et le nom de l’interlocuteur.", ok: identity, note: identity ? "Identité complète et correctement orthographiée." : "Le prénom ou le nom n’a pas été relevé exactement. Réécoutez l’épellation." },
      { text: "Identifie l’entreprise, la fonction et la localisation de l’interlocuteur.", ok: context, note: context ? "Entreprise, fonction, ville et pays relevés." : "Il manque l’entreprise, la fonction traduite en français, la ville ou le pays." },
      { text: "Comprend le motif de l’appel et l’action attendue.", ok: purpose, note: purpose ? "Motif et action attendue correctement restitués." : "Le motif (changement de coordonnées) ou l’action (mettre à jour la base) n’apparaît pas." },
      { text: "Relève exactement le numéro de téléphone et l’indicatif international.", ok: tel, note: tel ? "Indicatif et numéro exacts." : "Un chiffre ou l’indicatif diffère. Réécoutez le numéro groupe par groupe." },
      { text: "Relève exactement l’adresse électronique.", ok: mail, note: mail ? "Adresse email exacte." : "L’adresse email comporte une erreur. Un seul caractère faux et le message n’arrive pas." },
      { text: "Adresse l’email au bon destinataire dans l’entreprise.", ok: rightRecipient, note: rightRecipient ? "Joël Salu, administration des ventes : bon choix." : "Une mise à jour de fiche client relève de l’administration des ventes — Joël Salu." },
      { text: "Rédige un objet d’email clair et pertinent.", ok: goodSubject, note: goodSubject ? "Catégorie, entreprise et demande : objet exploitable." : `Format attendu : catégorie – entreprise – demande. Par exemple « Client existant – ${subject.company} – changement de coordonnées ».` },
      { text: "Transmet fidèlement les informations essentielles dans un ordre logique.", ok: relayed, note: relayed ? "Adresse, téléphone et email figurent dans le message." : "Les trois nouvelles données doivent apparaître dans l’email : adresse postale, téléphone, adresse électronique." },
      { text: "Rédige en français un email structuré, clair et professionnel.", ok: wellWritten, note: wellWritten ? "Formule d’appel, corps et formule de politesse." : "Il manque une formule d’appel, une formule de politesse, ou le message est trop succinct." },
      { text: "Produit dans les 20 minutes un message complet et directement exploitable.", ok: !timedOut, note: timedOut ? "Le temps imparti a été dépassé : l’épreuve s’est arrêtée d’elle-même." : "Rendu dans le temps imparti." },
    ];
  }, [subject, results, message, mailSubject, recipient, timedOut]);

  const acquired = criteria.filter((c) => c.ok).length;
  const passed = acquired >= 8;
  const filled = FIELDS.filter((f) => form[f.key].trim());

  function start(s: Subject) {
    setSubject(s);
    setForm(EMPTY_FORM);
    setRecipient("");
    setMailSubject("");
    setMessage("");
    setLeft(TOTAL_SECONDS);
    setTimedOut(false);
    setPhase("brief");
  }
  function seek(delta: number) {
    const a = audioRef.current;
    if (a) a.currentTime = Math.max(0, a.currentTime + delta);
  }

  // ---------------------------------------------------------------- choix ---
  if (phase === "pick") {
    return (
      <main className="mes-page">
        <div className="mes-shell">
          <header className="mes-top">
            <div>
              <span>CADGA · DAY 03 · MODULE 05</span>
              <strong>MISE EN SITUATION ÉVALUÉE</strong>
            </div>
            <button onClick={() => router.push("/day3")}>EXIT</button>
          </header>
          <section className="mes-card">
            <div className="mes-heading">
              <span>VOS TROIS MISES EN SITUATION</span>
              <h1>Trois messages, une seule tentative</h1>
              <p>
                Chaque sujet est une mise en situation complète : un message vocal en anglais, une fiche à remplir et un
                email à transmettre, en 20 minutes chrono. Vous passerez les trois, l’un après l’autre.
              </p>
            </div>
            <div className="mes-subjects">
              {SUBJECTS.map((s) => (
                <button key={s.id} onClick={() => start(s)}>
                  <b>{String(s.n).padStart(2, "0")}</b>
                  <h3>Voicemail {s.n}</h3>
                  <small>Message vocal en anglais · 20 minutes</small>
                  <i>COMMENCER →</i>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------- briefing ---
  if (phase === "brief" && subject) {
    return (
      <main className="mes-page">
        <div className="mes-shell">
          <header className="mes-top">
            <div>
              <span>CADGA · DAY 03 · MODULE 05</span>
              <strong>VOICEMAIL {subject.n}</strong>
            </div>
            <button onClick={() => setPhase("pick")}>CHANGER DE SUJET</button>
          </header>
          <section className="mes-card">
            <div className="mes-heading">
              <span>AVANT DE LANCER LE CHRONO</span>
              <h1>20 minutes, sans interruption</h1>
              <p>Le chrono démarre au clic et ne s’arrête plus. Relisez ces quatre points, puis lancez quand vous êtes prêt(e).</p>
            </div>
            <div className="mes-rules">
              <article><b>1</b><div><h3>L’audio reste à votre main</h3><p>Vous pouvez le relancer et reculer de dix secondes autant de fois que nécessaire, y compris pendant que vous rédigez.</p></div></article>
              <article><b>2</b><div><h3>La fiche, puis l’email</h3><p>Tout est sur le même écran. Vos réponses à la fiche s’affichent à côté du cadre de rédaction : ne remontez pas.</p></div></article>
              <article><b>3</b><div><h3>Tout se rend en français</h3><p>Seuls les noms propres, l’adresse postale et les coordonnées se recopient à l’identique.</p></div></article>
              <article><b>4</b><div><h3>À zéro, l’épreuve se rend seule</h3><p>Ce qui est écrit est corrigé sur les dix critères de la grille. Rien n’est perdu, rien n’est complété après.</p></div></article>
            </div>
            <button className="mes-start" onClick={() => setPhase("exam")}>DÉMARRER L’ÉPREUVE · 20:00</button>
          </section>
        </div>
      </main>
    );
  }

  // --------------------------------------------------------------- épreuve ---
  if (phase === "exam" && subject) {
    const danger = left <= 120;
    const warn = left <= 300 && !danger;
    return (
      <main className="mes-page">
        <div className="mes-shell">
          <div className="mes-bar">
            <div className="mes-player">
              <button onClick={() => seek(-10)} aria-label="Reculer de 10 secondes">↶ <b>10 s</b></button>
              <audio ref={audioRef} controls preload="auto" src={subject.audio} />
            </div>
            <div className={`mes-timer ${danger ? "danger" : warn ? "warn" : ""}`}>
              <small>TEMPS RESTANT</small>
              <b>{clock(left)}</b>
            </div>
          </div>

          <section className="mes-card">
            <div className="mes-heading">
              <span>PARTIE 1 · LA FICHE</span>
              <h1>Complétez la fiche de renseignements</h1>
              <p>En français, sauf les noms propres, l’adresse postale et les coordonnées, qui se recopient à l’identique.</p>
            </div>
            <div className="mes-fiche">
              {FIELDS.map((f) => (
                <label key={f.key} className={f.wide ? "wide" : ""}>
                  <span>{f.label}</span>
                  <input
                    value={form[f.key]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder="…"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="mes-card">
            <div className="mes-heading">
              <span>PARTIE 2 · L’EMAIL</span>
              <h1>Transmettez la demande</h1>
              <p>Vos notes restent affichées à droite pendant toute la rédaction.</p>
            </div>

            <div className="mes-compose">
              <div className="mes-form">
                <div className="mes-recipients">
                  <small>DESTINATAIRE</small>
                  <div>
                    {RECIPIENTS.map((r) => (
                      <button
                        key={r.name}
                        className={recipient === r.name ? "on" : ""}
                        onClick={() => setRecipient(r.name)}
                      >
                        <b>{r.name}</b>
                        <i>{r.role}</i>
                      </button>
                    ))}
                  </div>
                </div>
                <label>
                  <span>Objet</span>
                  <input value={mailSubject} onChange={(e) => setMailSubject(e.target.value)} placeholder="…" />
                </label>
                <label>
                  <span>Message</span>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={13} placeholder="Bonjour Monsieur…" />
                </label>
              </div>

              <aside className="mes-notes">
                <small>VOS NOTES</small>
                {filled.length === 0 ? (
                  <p className="mes-empty">Vos réponses à la fiche apparaîtront ici au fur et à mesure.</p>
                ) : (
                  <dl>
                    {filled.map((f) => (
                      <div key={f.key}>
                        <dt>{f.label}</dt>
                        <dd>{form[f.key]}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </aside>
            </div>

            <button className="mes-start" onClick={() => submit(false)}>RENDRE MA COPIE</button>
          </section>
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------- résultat ---
  if (phase === "result" && subject) {
    return (
      <main className="mes-page">
        <div className="mes-shell">
          <header className="mes-top">
            <div>
              <span>CADGA · DAY 03 · MODULE 05</span>
              <strong>RÉSULTAT · VOICEMAIL {subject.n}</strong>
            </div>
            <button onClick={() => router.push("/day3")}>EXIT</button>
          </header>

          <section className={`mes-verdict ${passed ? "ok" : "no"}`}>
            <div>
              <small>RÉSULTAT GLOBAL</small>
              <h1>{passed ? "ACQUIS" : "NON ACQUIS"}</h1>
              <p>{acquired} critère{acquired > 1 ? "s" : ""} sur 10 · seuil à 8</p>
            </div>
            <b>{passed ? "★" : "↻"}</b>
          </section>

          {timedOut && <div className="mes-alert">Le temps est écoulé : l’épreuve a été rendue automatiquement.</div>}

          <section className="mes-card">
            <div className="mes-heading">
              <span>GRILLE D’ÉVALUATION · MES</span>
              <h1>Critère par critère</h1>
            </div>
            <div className="mes-criteria">
              {criteria.map((c, i) => (
                <article key={c.text} className={c.ok ? "ok" : "no"}>
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  <div>
                    <h3>{c.text}</h3>
                    <p>{c.note}</p>
                  </div>
                  <i>{c.ok ? "ACQUIS" : "NON ACQUIS"}</i>
                </article>
              ))}
            </div>
          </section>

          <section className="mes-card">
            <div className="mes-heading">
              <span>CORRIGÉ DE LA FICHE</span>
              <h1>Votre réponse et celle attendue</h1>
            </div>
            <div className="mes-compare">
              {FIELDS.map((f) => (
                <article key={f.key} className={results[f.key] ? "ok" : "no"}>
                  <small>{f.label}</small>
                  <b>{form[f.key].trim() || "— non renseigné —"}</b>
                  {!results[f.key] && <i>{subject.answers[f.key]}</i>}
                </article>
              ))}
            </div>
            <button className="mes-start" onClick={() => setPhase("pick")}>PASSER UN AUTRE SUJET</button>
          </section>
        </div>
      </main>
    );
  }

  return null;
}
