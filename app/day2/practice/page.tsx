"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./practice.css";

type FieldKey = "firstName" | "lastName" | "job" | "company" | "city" | "country" | "reason" | "request" | "countryCode" | "phone" | "email";
type Criterion = { text: string; acquired: boolean; note: string; remedy?: { label: string; href: string } };

const answers: Record<FieldKey, string> = {
  firstName: "Olivia",
  lastName: "Hansen",
  job: "Responsable export",
  company: "Nordic Bloom Cosmetics",
  city: "Copenhague",
  country: "Danemark",
  reason: "Intérêt pour les produits cosmétiques biologiques de Primevère, notamment les soins du visage et du corps",
  request: "Obtenir des informations sur les produits, les prix et les conditions de livraison, discuter d’un partenariat et organiser un entretien téléphonique le mardi 24 juin à 10 h, heure de Paris",
  countryCode: "+45",
  phone: "31 67 89 21",
  email: "o.hansen@nordicbloom.dk",
};

const fields: Array<{ key: FieldKey; label: string; hint: string }> = [
  { key: "firstName", label: "Prénom", hint: "First name" },
  { key: "lastName", label: "Nom", hint: "Last name" },
  { key: "job", label: "Fonction", hint: "Job title" },
  { key: "company", label: "Entreprise", hint: "Company" },
  { key: "city", label: "Ville", hint: "City" },
  { key: "country", label: "Pays", hint: "Country" },
  { key: "reason", label: "Motif de l’appel", hint: "Reason for the call" },
  { key: "request", label: "Demande et action attendue", hint: "Request and expected action" },
  { key: "countryCode", label: "Indicatif international", hint: "" },
  { key: "phone", label: "Numéro de téléphone", hint: "" },
  { key: "email", label: "Adresse email", hint: "Email address" },
];

const normalise = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9@+]+/g, " ").trim();
const containsAll = (value: string, terms: string[]) => terms.every((term) => normalise(value).includes(normalise(term)));
const digits = (value: string) => value.replace(/\D/g, "");

function scoreField(key: FieldKey, value: string) {
  const v = normalise(value);
  if (!v) return false;
  if (key === "countryCode") return digits(value) === "45";
  if (key === "phone") return ["31678921", "031678921"].includes(digits(value));
  if (key === "email") return value.toLowerCase().replace(/\s/g, "") === answers.email;
  const groups: Record<Exclude<FieldKey, "countryCode" | "phone" | "email">, string[][]> = {
    firstName: [["olivia"]],
    lastName: [["hansen"]],
    job: [["responsable", "export"]],
    company: [["nordic", "bloom", "cosmetics"]],
    city: [["copenhague"]],
    country: [["danemark"]],
    reason: [["produits", "cosmetiques", "bio"], ["soins", "visage", "corps"]],
    request: [["informations", "prix", "livraison"]],
  };
  return groups[key].some((group) => group.every((term) => v.includes(normalise(term))));
}

function remediationFor(key: FieldKey, value: string) {
  const response = normalise(value);
  const expected = normalise(answers[key]);
  const letters = (text: string) => normalise(text).replace(/[^a-z]/g, "");
  const learnerLetters = letters(value);
  const expectedLetters = letters(answers[key]);

  if (key === "email") {
    if (!value.includes("@")) return "Le symbole @ manque. Dans une adresse email, il sépare le nom de l’utilisateur du domaine.";
    if (!value.slice(value.indexOf("@") + 1).includes(".")) return "Le point du nom de domaine manque. Réécoute la fin de l’adresse et vérifie le symbole « dot ».";
  }

  if (key === "email" || key === "firstName" || key === "lastName") {
    const limit = Math.min(learnerLetters.length, expectedLetters.length);
    const differences = Array.from({ length: limit }, (_, index) => index).filter((index) => learnerLetters[index] !== expectedLetters[index]);
    if (learnerLetters.length === expectedLetters.length && differences.length === 1) {
      const index = differences[0];
      const heard = learnerLetters[index].toUpperCase();
      const wanted = expectedLetters[index].toUpperCase();
      if ("AEIOUY".includes(heard) && "AEIOUY".includes(wanted)) return `Tu as remplacé la voyelle ${wanted} par ${heard}. Réécoute uniquement ces deux voyelles anglaises, puis vérifie le mot lettre par lettre.`;
      if (new Set([heard, wanted]).size === 2 && [heard, wanted].every((letter) => ["G", "J"].includes(letter))) return `Tu as confondu G et J. En anglais, G se prononce « dji » et J « djeï ». Réécoute la lettre concernée, puis vérifie le mot.`;
      return `Une lettre a été confondue : ${wanted} a été remplacé par ${heard}. Réécoute cette lettre précise, puis contrôle le mot complet.`;
    }
    if (learnerLetters.length < expectedLetters.length) return `Il manque ${expectedLetters.length - learnerLetters.length} lettre(s). Réécoute l’épellation et coche chaque lettre au fur et à mesure.`;
    if (learnerLetters.length > expectedLetters.length) return `Tu as ajouté ${learnerLetters.length - expectedLetters.length} lettre(s). Compare la réponse et la correction caractère par caractère.`;
    return "Plusieurs lettres diffèrent. Réécoute l’épellation par petits groupes et vérifie chaque groupe avant de continuer.";
  }

  if (key === "countryCode" || key === "phone") {
    const learnerDigits = digits(value);
    const expectedDigits = digits(answers[key]);
    if (learnerDigits.slice(1) === expectedDigits && learnerDigits.startsWith("0")) return "Le zéro initial a bien été entendu : il est accepté lorsqu’il est prononcé dans l’audio.";
    if (learnerDigits.length < expectedDigits.length) return `Il manque ${expectedDigits.length - learnerDigits.length} chiffre(s). Réécoute le numéro groupe par groupe et note chaque groupe séparément.`;
    if (learnerDigits.length > expectedDigits.length) return `Il y a ${learnerDigits.length - expectedDigits.length} chiffre(s) en trop. Vérifie le début du numéro et chaque groupe prononcé.`;
    const changed = [...expectedDigits].filter((digit, index) => learnerDigits[index] !== digit);
    if (changed.length === 2 && [...learnerDigits].sort().join("") === [...expectedDigits].sort().join("")) return "Deux chiffres ont été inversés. Réécoute le groupe concerné, puis répète-le avant de l’écrire.";
    return "Un ou plusieurs chiffres ont été confondus. Réécoute chaque groupe, répète-le à voix haute, puis vérifie sa position.";
  }

  const required: Partial<Record<FieldKey, string[]>> = {
    job: ["responsable", "export"],
    company: ["Nordic", "Bloom", "Cosmetics"],
    city: ["Copenhague"],
    country: ["Danemark"],
    reason: ["produits cosmétiques biologiques", "soins du visage", "soins du corps"],
    request: ["informations", "prix", "livraison", "partenariat", "entretien téléphonique", "24 juin", "10 h"],
  };
  const missing = (required[key] ?? []).filter((term) => !response.includes(normalise(term)));
  if (missing.length) return `Ta réponse ne restitue pas encore : ${missing.join(", ")}. Réécoute le passage en ciblant uniquement ces informations, puis reformule-les en français.`;
  if (response !== expected) return "L’information est comprise, mais elle doit être reformulée plus précisément en français professionnel.";
  return "Réécoute le passage concerné et compare ta formulation avec la correction.";
}

const STEP_LABELS = ["Méthode", "Assimilation", "Déroulé", "Écoute", "Correction", "Email", "Analyse", "Bilan"];

const quiz = [
  { q: "Avant de lancer l’audio, que fais-tu en premier ?", choices: ["Je commence à rédiger l’email de transmission", "Je prends connaissance de tous les champs de la fiche", "Je note la date et l’heure de l’appel"], correct: 1 },
  { q: "Pendant l’écoute, quels sont les trois blocs d’information à repérer ?", choices: ["L’identité, le contexte et la demande", "La prononciation, l’intonation et le débit", "Le prix, la remise et le délai de livraison"], correct: 0 },
  { q: "Dans quelle langue la fiche de renseignements doit-elle être complétée ?", choices: ["En anglais, comme le message reçu", "En français", "Dans la langue de mon choix"], correct: 1 },
  { q: "Quels éléments dois-tu recopier sans les traduire ?", choices: ["La fonction et le pays", "Le motif et l’action attendue", "Les noms propres, l’entreprise et les coordonnées"], correct: 2 },
  { q: "À l’étape Vérifier, que contrôles-tu en priorité ?", choices: ["La mise en forme de l’email", "Les noms, les coordonnées et les informations clés", "L’orthographe des mots anglais entendus"], correct: 1 },
];

export default function VoicemailPractice() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [step, setStep] = useState(1);
  const [maxVisited, setMaxVisited] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [form, setForm] = useState<Record<FieldKey, string>>(Object.fromEntries(fields.map((field) => [field.key, ""])) as Record<FieldKey, string>);
  const [part1Submitted, setPart1Submitted] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [part2Submitted, setPart2Submitted] = useState(false);

  const fieldResults = useMemo(() => Object.fromEntries(fields.map((field) => [field.key, scoreField(field.key, form[field.key])])) as Record<FieldKey, boolean>, [form]);
  const quizPassed = quizAnswers.length === quiz.length && quiz.every((item, index) => quizAnswers[index] === item.correct);

  const criteria = useMemo<Criterion[]>(() => {
    const identity = fieldResults.firstName && fieldResults.lastName;
    const context = fieldResults.job && fieldResults.company && fieldResults.city && fieldResults.country;
    const reason = fieldResults.reason && fieldResults.request;
    const phone = fieldResults.countryCode && fieldResults.phone;
    const email = fieldResults.email;
    const body = normalise(message);
    const goodRecipient = normalise(recipient).includes("salu");
    const goodSubject = ["demande", "information", "partenariat", "prospect"].some((term) => normalise(subject).includes(term));
    const faithful = containsAll(message, ["olivia", "hansen", "nordic", "bloom"]) && (body.includes("prix") || body.includes("tarif")) && body.includes("livraison");
    const professional = message.trim().length >= 180 && (body.includes("bonjour") || body.includes("monsieur")) && (body.includes("cordialement") || body.includes("bien cordialement"));
    const complete = faithful && (message.includes("+45") || message.toLowerCase().includes("o.hansen@nordicbloom.dk")) && (body.includes("24 juin") || body.includes("telephone") || body.includes("réunion"));
    return [
      { text: "Identifie correctement le prénom et le nom de l’interlocuteur.", acquired: identity, note: identity ? "Identité exacte." : "Le prénom ou le nom comporte une erreur.", remedy: { label: "Revoir Alphabet & Spelling", href: "/alphabet" } },
      { text: "Identifie l’entreprise, la fonction et la localisation.", acquired: context, note: context ? "Contexte professionnel complet." : "Une information de contexte manque ou est imprécise.", remedy: { label: "Revoir CADGA Vocabulary", href: "/day2/vocabulary" } },
      { text: "Comprend le motif de l’appel et l’action attendue.", acquired: reason, note: reason ? "Motif et demande compris." : "Le motif ou l’action demandée doit être réécouté.", remedy: { label: "Refaire l’écoute guidée", href: "#audio" } },
      { text: "Relève exactement le numéro et l’indicatif international.", acquired: phone, note: phone ? "Numéro exact." : "Le numéro comporte une inversion, un oubli ou une confusion.", remedy: { label: "Revoir Numbers", href: "/numbers" } },
      { text: "Relève exactement l’adresse électronique.", acquired: email, note: email ? "Adresse exacte." : "L’adresse email doit être vérifiée caractère par caractère.", remedy: { label: "Revoir Symbols & Emails", href: "/symbols" } },
      { text: "Adresse l’email au bon destinataire.", acquired: goodRecipient, note: goodRecipient ? "J. Salu est le destinataire adapté." : "Le destinataire ne correspond pas à la demande commerciale.", remedy: { label: "Revoir l’organigramme", href: "/day2/company" } },
      { text: "Rédige un objet d’email clair et pertinent.", acquired: goodSubject, note: goodSubject ? "Objet exploitable." : "L’objet doit annoncer clairement la demande." },
      { text: "Transmet fidèlement les informations essentielles.", acquired: faithful, note: faithful ? "Les éléments essentiels sont transmis." : "L’identité, la demande, les prix ou la livraison ne sont pas tous restitués." },
      { text: "Rédige un email structuré, clair et professionnel.", acquired: professional, note: professional ? "Structure et ton professionnels." : "Ajoute une ouverture, des paragraphes lisibles et une formule de clôture." },
      { text: "Produit en 30 minutes un message complet et exploitable.", acquired: complete, note: complete ? "Le message permet une prise en charge immédiate." : "Une coordonnée ou une action attendue manque encore." },
    ];
  }, [fieldResults, recipient, subject, message]);

  const acquiredCount = criteria.filter((criterion) => criterion.acquired).length;
  const essential = criteria[2].acquired && criteria[3].acquired && criteria[4].acquired && criteria[5].acquired;
  const verdict = acquiredCount >= 8 && essential ? "ACQUIS" : "NON ACQUIS";

  const seekAudio = (seconds: number) => {
    const player = audioRef.current;
    if (!player) return;
    const end = Number.isFinite(player.duration) ? player.duration : player.currentTime + Math.max(0, seconds);
    player.currentTime = Math.min(end, Math.max(0, player.currentTime + seconds));
  };

  const go = (next: number) => {
    setStep(next);
    setMaxVisited((current) => Math.max(current, next));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return <main className="vp-page">
    <header className="vp-top">
      <div><span>CADGA · MODULE 05</span><strong>VOICEMAIL PRACTICE</strong></div>
      <div className="vp-progress"><i><em style={{ width: `${(step / 8) * 100}%` }} /></i><small>ÉTAPE {step} / 8</small></div>
      <Link href="/day2">EXIT</Link>
    </header>

    <nav className="vp-step-tabs" aria-label="Étapes du module">
      {STEP_LABELS.map((label, index) => {
        const number = index + 1;
        return <button key={label} className={step === number ? "active" : number < step ? "done" : ""} disabled={number > maxVisited} onClick={() => go(number)}><b>{String(number).padStart(2, "0")}</b><span>{label}</span></button>;
      })}
    </nav>

    <section className="vp-card">
      {step === 1 && <div className="vp-welcome">
        <div className="vp-welcome-hero"><div><span>ENTRAÎNEMENT GUIDÉ</span><h1>Réussir l’exercice voicemail</h1><p>Une méthode simple pour repérer, vérifier et transmettre les informations essentielles d’un message vocal.</p></div><aside><small>MISSION</small><strong>ÉCOUTER</strong><i>→</i><strong>TRANSMETTRE</strong><div><b>30</b><span>MINUTES<br/>AU TOTAL</span></div></aside></div>
        <div className="vp-language-rule">
          <div><small>LA RÈGLE ESSENTIELLE</small><h2>J’écoute en anglais.<br/>Je renseigne en français.</h2></div>
          <p><strong>En français :</strong> la fonction, la ville, le pays, le motif, la demande et l’action attendue.<span><strong>À l’identique :</strong> les noms propres, le nom de l’entreprise et les coordonnées.</span></p>
        </div>
        <div className="vp-method">
          <article><b>01</b><div><h3>Anticiper</h3><p>Prendre connaissance de tous les champs de la fiche de renseignements avant de lancer l’audio.</p></div></article>
          <article><b>02</b><div><h3>Écouter</h3><p>Repérer l’identité, le contexte et la demande.</p></div></article>
          <article><b>03</b><div><h3>Renseigner</h3><p>Compléter toute la fiche en français.</p></div></article>
          <article><b>04</b><div><h3>Vérifier</h3><p>Contrôler les noms, les coordonnées et les informations clés.</p></div></article>
        </div>
      </div>}

      {step === 2 && <div className="vp-assimilation"><div className="vp-heading"><span>ASSIMILATION</span><h1>À toi de décider</h1><p>Cinq situations courtes pour vérifier que tu as bien assimilé la méthode : anticiper, écouter, renseigner, vérifier.</p></div>
        <div className="vp-quiz-status"><div><small>PROGRESSION</small><strong>{quizAnswers.filter((answer) => Number.isInteger(answer)).length} / {quiz.length}</strong></div><i><em style={{width:`${(quizAnswers.filter((answer) => Number.isInteger(answer)).length / quiz.length) * 100}%`}} /></i><span>{quizPassed ? "MÉTHODE MAÎTRISÉE" : "CHOISIS UNE RÉPONSE PAR SITUATION"}</span></div>
        <div className="vp-quiz">{quiz.map((item, qi) => <article key={item.q}><header><b>{String(qi + 1).padStart(2, "0")}</b><small>SITUATION</small></header><h3>{item.q}</h3><div>{item.choices.map((choice, ci) => <button className={quizAnswers[qi] === ci ? "selected" : ""} key={choice} onClick={() => setQuizAnswers((values) => { const copy = [...values]; copy[qi] = ci; return copy; })}><span>{String.fromCharCode(65 + ci)}</span>{choice}</button>)}</div></article>)}</div>
        {quizAnswers.filter((answer) => Number.isInteger(answer)).length === quiz.length && !quizPassed && <p className="vp-alert">Une ou plusieurs décisions sont à revoir. Relis la méthode, puis modifie tes réponses.</p>}
      </div>}

      {step === 3 && <div className="vp-brief"><span>COMMENT VA SE PASSER L’EXERCICE ?</span><h1>Deux parties · 30 minutes</h1>
        <div className="vp-two-parts"><article><b>15 MIN</b><h2>Partie 1 · Écouter</h2><p>Écoute le voicemail et complète toute la fiche en français. Après validation, tes erreurs sont relevées et une remédiation ciblée t’est proposée.</p></article><article><b>15 MIN</b><h2>Partie 2 · Transmettre</h2><p>Reprends la MES, cible le bon destinataire et rédige en français l’email à transmettre.</p></article></div>
        <p className="vp-note">À la fin, les 10 critères de la grille sont complétés et le résultat est prononcé : Acquis ou Non acquis.</p>
      </div>}

      {step === 4 && <div id="audio"><div className="vp-heading"><span>PARTIE 1 · 15 MINUTES</span><h1>Écoute et complète la fiche</h1><p>Réponds en français dans tous les champs : fonction, ville, pays, motif et demande. Recopie seulement les noms propres et les coordonnées à l’identique.</p></div>
        <div className="vp-audio-station">
          <button type="button" onClick={() => seekAudio(-10)} aria-label="Reculer l’audio de 10 secondes">↶ <b>10 s</b></button>
          <audio ref={audioRef} className="vp-audio" controls preload="metadata" src="/day2/voicemail-1.m4a">Ton navigateur ne peut pas lire cet audio.</audio>
          <button type="button" onClick={() => seekAudio(10)} aria-label="Avancer l’audio de 10 secondes"><b>10 s</b> ↷</button>
        </div>
        <div className="vp-form">{fields.map((field) => <label key={field.key}><span>{field.label}</span>{field.key === "reason" || field.key === "request" ? <textarea value={form[field.key]} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} /> : <input value={form[field.key]} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} />}</label>)}</div>
        <button className="vp-primary vp-submit" disabled={fields.some((field) => !form[field.key].trim())} onClick={() => { setPart1Submitted(true); go(5); }}>VALIDER MA FICHE</button>
      </div>}

      {step === 5 && <div><div className="vp-heading"><span>ANALYSE DES RÉPONSES</span><h1>Correction et remédiation</h1><p>{Object.values(fieldResults).filter(Boolean).length}/{fields.length} informations correctement relevées.</p></div>
        <div className="vp-feedback">{fields.map((field) => <article className={fieldResults[field.key] ? "good" : "bad"} key={field.key}><div><b>{field.label}</b><span>{fieldResults[field.key] ? "CORRECT" : "À REVOIR"}</span></div><p><strong>Ta réponse :</strong> {form[field.key] || "Aucune réponse"}</p>{!fieldResults[field.key] && <><p><strong>Correction :</strong> {answers[field.key]}</p><p>{remediationFor(field.key, form[field.key])}</p></>}</article>)}</div>
        <div className="vp-poster"><Image src="/day2/voicemail-1-correction.jpg" alt="Correction complète du voicemail 1" width={1536} height={1024} /></div>
      </div>}

      {step === 6 && <div><div className="vp-heading"><span>PARTIE 2 · 15 MINUTES</span><h1>Cible et rédige le message</h1><p>Consulte la MES et l’organigramme de Primevère, puis prépare l’email en français.</p></div>
        <div className="vp-mail">
          <label><span>À</span><select value={recipient} onChange={(event) => setRecipient(event.target.value)}><option value="">Sélectionne le destinataire</option><option>J. Salu · Responsable des Ventes</option><option>L. Martin · Ressources humaines</option><option>A. Morel · Comptabilité</option><option>C. Robert · Production</option></select></label>
          <label><span>Objet</span><input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Objet professionnel et précis" /></label>
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder={"Bonjour Monsieur Salu,\n\n..."} />
        </div>
        <button className="vp-primary vp-submit" disabled={!recipient || !subject.trim() || message.trim().length < 80} onClick={() => { setPart2Submitted(true); go(7); }}>ENVOYER POUR CORRECTION</button>
      </div>}

      {step === 7 && <div><div className="vp-heading"><span>CORRECTION DE LA PARTIE 2</span><h1>Ton email a été analysé</h1></div>
        <div className="vp-email-review"><article><h3>Destinataire</h3><b className={criteria[5].acquired ? "ok" : "no"}>{criteria[5].acquired ? "Correct · J. Salu" : "Incorrect · J. Salu était attendu"}</b></article><article><h3>Objet</h3><b className={criteria[6].acquired ? "ok" : "no"}>{criteria[6].note}</b></article><article><h3>Restitution</h3><b className={criteria[7].acquired ? "ok" : "no"}>{criteria[7].note}</b></article><article><h3>Qualité professionnelle</h3><b className={criteria[8].acquired ? "ok" : "no"}>{criteria[8].note}</b></article></div>
        <div className="vp-model"><span>EXEMPLE DE TRANSMISSION</span><h3>Objet : Prospect – Nordic Bloom Cosmetics – demande d’informations et de rendez-vous</h3><p>Bonjour Monsieur Salu,</p><p>Olivia Hansen, Export Manager chez Nordic Bloom Cosmetics à Copenhague, souhaite obtenir davantage d’informations sur notre gamme de cosmétiques biologiques, notamment les soins du visage et du corps.</p><p>Elle souhaite connaître nos produits, nos tarifs et nos conditions de livraison afin d’envisager un partenariat. Elle propose un échange téléphonique le mardi 24 juin à 10 h, heure de Paris.</p><p>Vous pouvez la joindre au +45 31 67 89 21 ou à l’adresse o.hansen@nordicbloom.dk.</p><p>Bien cordialement,</p></div>
      </div>}

      {step === 8 && <div><div className="vp-heading"><span>BILAN FINAL</span><h1>Grille d’évaluation complétée</h1><p>{acquiredCount} critères acquis sur 10.</p></div>
        <div className="vp-final-grid">{criteria.map((criterion, index) => <article className={criterion.acquired ? "good" : "bad"} key={criterion.text}><b>{index + 1}</b><div><h3>{criterion.text}</h3><p>{criterion.note}</p>{!criterion.acquired && criterion.remedy && <Link href={criterion.remedy.href}>{criterion.remedy.label} →</Link>}</div><strong>{criterion.acquired ? "ACQUIS" : "NON ACQUIS"}</strong></article>)}</div>
        <div className={`vp-verdict ${verdict === "ACQUIS" ? "good" : "bad"}`}><span>RÉSULTAT GLOBAL</span><h2>{verdict}</h2><p>{verdict === "ACQUIS" ? "Tu as compris le message et transmis les informations essentielles de façon exploitable. Tu peux passer au voicemail autonome." : `Tu maîtrises ${acquiredCount} critères sur 10. Reprends les remédiations proposées, puis recommence les parties concernées avant le voicemail autonome.`}</p></div>
        <button className="vp-primary" onClick={() => { setStep(4); setPart1Submitted(false); setPart2Submitted(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>RECOMMENCER L’ENTRAÎNEMENT</button><Link className="vp-primary vp-next-practice" href="/day2/practice-2">PASSER AU PRACTICE 02 →</Link>
      </div>}

      <footer className="vp-nav">
        <button disabled={step === 1} onClick={() => go(step - 1)}>‹ PRÉCÉDENT</button>
        <span>{step === 4 ? "PARTIE 1" : step === 6 ? "PARTIE 2" : `ÉTAPE ${step}`}</span>
        {step < 4 && <button className="vp-primary" disabled={(step === 2 && !quizPassed)} onClick={() => go(step + 1)}>SUIVANT →</button>}
        {step === 5 && part1Submitted && <button className="vp-primary" onClick={() => go(6)}>COMMENCER LA PARTIE 2 →</button>}
        {step === 7 && part2Submitted && <button className="vp-primary" onClick={() => go(8)}>VOIR MA GRILLE →</button>}
      </footer>
    </section>
  </main>;
}
