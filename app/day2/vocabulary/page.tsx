"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "./vocabulary.css";

// ---------------------------------------------------------------------------
// CADGA · Day 2 · Module 02 — CADGA Vocabulary
//
// A full interactive vocabulary module, built on the same pattern as Day 1's
// Alphabet module: learn by category with natural-voice audio, an audio
// identification quiz, a Real-Life Challenge (a professional voicemail using
// this exact vocabulary), targeted remediation, and a final validation.
// This is the "liste de vocabulaire CADGA" step of the Day 2 storyboard,
// now standalone rather than folded into Module 03 (Voicemail Exam Method).
// ---------------------------------------------------------------------------

type Pair = [string, string];
type VocabCategory = { title: string; pairs: Pair[] };

const VOCAB: VocabCategory[] = [
  {
    title: "Personnes et entreprises",
    pairs: [
      ["Prospect", "Prospect"],
      ["Existing customer", "Client existant"],
      ["Supplier", "Fournisseur"],
      ["Distributor", "Distributeur"],
      ["Contact person", "Personne de contact"],
      ["Export Manager", "Responsable export"],
      ["Sales Manager", "Responsable commercial"],
      ["Purchasing Manager", "Responsable des achats"],
      ["Operations Manager", "Responsable d'exploitation"],
      ["Office Manager", "Responsable administratif"],
    ],
  },
  {
    title: "Appels téléphoniques et messages vocaux",
    pairs: [
      ["Voicemail", "Message vocal"],
      ["Call back", "Rappeler"],
      ["Reason for call", "Motif de l'appel"],
      ["Contact details", "Coordonnées"],
      ["Phone number", "Numéro de téléphone"],
      ["Email address", "Adresse e-mail"],
      ["Postal address", "Adresse postale"],
      ["Caller", "Appelant"],
      ["Message received", "Message reçu"],
      ["Leave a message", "Laisser un message"],
    ],
  },
  {
    title: "Demandes et informations",
    pairs: [
      ["Request", "Demande"],
      ["Inquiry", "Demande d'information"],
      ["Information", "Information"],
      ["Documentation", "Documentation"],
      ["Catalogue", "Catalogue"],
      ["Price list", "Tarif / Liste de prix"],
      ["Terms and Conditions (T&C)", "Conditions Générales de Vente (CGV)"],
      ["Delivery terms", "Conditions de livraison"],
      ["Feedback", "Retour / Avis"],
      ["Follow-up", "Suivi / Relance"],
    ],
  },
  {
    title: "Actions et verbes",
    pairs: [
      ["Update", "Mettre à jour"],
      ["Keep me updated", "Me tenir informé(e)"],
      ["Confirm", "Confirmer"],
      ["Provide", "Fournir"],
      ["Arrange", "Organiser"],
      ["Schedule", "Planifier"],
      ["Postpone", "Reporter"],
      ["Change", "Modifier"],
      ["Reply", "Répondre"],
      ["Forward", "Transférer"],
      ["Receive", "Recevoir"],
      ["Send", "Envoyer"],
    ],
  },
  {
    title: "Réunions et disponibilité",
    pairs: [
      ["Availability", "Disponibilité"],
      ["Available", "Disponible"],
      ["Meeting", "Réunion"],
      ["Appointment", "Rendez-vous"],
      ["Conference call", "Conférence téléphonique"],
      ["Telephone meeting", "Réunion téléphonique"],
      ["Preferred date", "Date souhaitée"],
      ["Preferred time", "Heure souhaitée"],
      ["Partnership", "Partenariat"],
    ],
  },
  {
    title: "Produits et vente",
    pairs: [
      ["Organic products", "Produits biologiques"],
      ["Organic cosmetics", "Cosmétiques biologiques"],
      ["Skincare range", "Gamme de soins"],
      ["Facial care", "Soins du visage"],
      ["Body care", "Soins du corps"],
      ["Essential oils", "Huiles essentielles"],
      ["Product range", "Gamme de produits"],
      ["Delivery", "Livraison"],
    ],
  },
  {
    title: "Autres mots utiles",
    pairs: [
      ["Change of contact details", "Changement de coordonnées"],
      ["New address", "Nouvelle adresse"],
      ["New phone number", "Nouveau numéro de téléphone"],
      ["New email address", "Nouvelle adresse e-mail"],
      ["No customer record", "Aucun dossier client"],
      ["Database", "Base de données"],
      ["Record", "Donnée / Dossier"],
      ["Details", "Détails"],
      ["Important", "Important"],
      ["Next steps", "Prochaines étapes"],
      ["Potential distributor", "Distributeur potentiel"],
    ],
  },
];

const PHRASES: Pair[] = [
  ["Could you send us more information?", "Pourriez-vous nous envoyer davantage d'informations ?"],
  ["Please update your records.", "Merci de mettre à jour vos données."],
  ["We are interested in your products.", "Nous sommes intéressés par vos produits."],
  ["Could you send us your catalogue?", "Pourriez-vous nous envoyer votre catalogue ?"],
  ["Could you send us your price list?", "Pourriez-vous nous envoyer votre liste de prix ?"],
  ["Could we schedule a meeting next week?", "Pourrions-nous planifier une réunion la semaine prochaine ?"],
  ["Please confirm your availability.", "Merci de confirmer votre disponibilité."],
];

// One targeted tip per category, indexed like the tabs: VOCAB[0..6], then the
// "Expressions utiles" tab at index VOCAB.length. Each one says what this
// particular vocabulary is *for* in the voicemail exercise, rather than
// repeating the same generic advice under every category.
type Tip = { title: string; lines: string[] };
const TIPS: Tip[] = [
  {
    title: "💡 Identifier qui appelle",
    lines: [
      "Note le prénom et le nom séparément : l'anglais donne souvent les deux d'affilée.",
      "Les noms propres sont fréquemment épelés dans le message — c'est là que l'alphabet anglais du Day 1 sert vraiment.",
      "La fonction (Sales Manager, Purchasing Manager) indique à quel service transmettre.",
      "Supplier et distributor ne désignent pas le même rôle : ne les confonds pas.",
    ],
  },
  {
    title: "💡 Relever les coordonnées sans erreur",
    lines: [
      "Les chiffres se disent un par un : « four nine six » = 496.",
      "« Double four » = 44 : ce raccourci revient souvent sur les indicatifs.",
      "Dans une adresse e-mail : « dot » = point, « at » = @.",
      "Si un chiffre t'échappe, laisse un blanc et continue — tu le récupéreras à la réécoute.",
    ],
  },
  {
    title: "💡 Cerner l'objet de l'appel",
    lines: [
      "C'est ici que se joue le motif : catalogue, tarifs, CGV, conditions de livraison ?",
      "Inquiry = demande d'information, ni une réclamation ni une enquête.",
      "Un même message peut contenir plusieurs demandes : compte-les avant de rédiger.",
      "Reformule chaque demande en français — ne recopie pas l'anglais tel quel.",
    ],
  },
  {
    title: "💡 Repérer ce qu'on attend de toi",
    lines: [
      "Le verbe porte l'action à mener : send, confirm, update, forward.",
      "Confirm (confirmer) et update (mettre à jour) n'appellent pas le même geste.",
      "« Keep me updated » n'exige pas de réponse immédiate, mais se signale dans l'e-mail.",
      "Écoute aussi le délai : as soon as possible, by Friday, next week.",
    ],
  },
  {
    title: "💡 Fixer le bon créneau",
    lines: [
      "Note la date et l'heure demandées, même approximatives (« next week »).",
      "Un « conference call » se tient à distance ; un « meeting » peut être sur place.",
      "En chiffres, l'américain écrit 03/15 pour le 15 mars : vérifie l'ordre jour/mois.",
      "« Availability » est une question : il faudra y répondre, pas seulement la noter.",
    ],
  },
  {
    title: "💡 Nommer le bon produit",
    lines: [
      "Le produit demandé oriente le service destinataire : note-le précisément.",
      "Range = gamme (skincare range = gamme de soins), jamais « rangée ».",
      "Organic = biologique, au sens commercial du terme.",
      "Un nom de marque ou de gamme se recopie tel quel, sans le traduire.",
    ],
  },
  {
    title: "💡 Ne rien laisser passer en fin de message",
    lines: [
      "Un changement de coordonnées est une action à effectuer, pas une simple info.",
      "Record = dossier ou donnée client, pas un enregistrement audio.",
      "« No customer record » signifie que le client est absent de la base : signale-le.",
      "Ces précisions arrivent souvent en toute fin d'appel : garde ta concentration jusqu'au bout.",
    ],
  },
  {
    title: "💡 Reconnaître les formules toutes faites",
    lines: [
      "Ces tournures reviennent presque mot pour mot dans les messages de l'examen.",
      "« Could you...? » est une demande polie : « Pourriez-vous... » ou « Merci de... ».",
      "Repère la formule et tu tiens la demande, même si un mot t'échappe.",
      "Garde ce niveau de politesse professionnelle dans ton e-mail en français.",
    ],
  },
];

// A curated subset used for the audio quizzes (identify + validation) —
// diverse across all categories, exactly like Day 1's Alphabet module only
// samples a subset of the 26 letters for its own audio quiz.
const QUIZ_BANK: Pair[] = [
  ["Prospect", "Prospect"],
  ["Existing customer", "Client existant"],
  ["Purchasing Manager", "Responsable des achats"],
  ["Voicemail", "Message vocal"],
  ["Leave a message", "Laisser un message"],
  ["Reason for call", "Motif de l'appel"],
  ["Inquiry", "Demande d'information"],
  ["Price list", "Tarif / Liste de prix"],
  ["Follow-up", "Suivi / Relance"],
  ["Keep me updated", "Me tenir informé(e)"],
  ["Schedule", "Planifier"],
  ["Forward", "Transférer"],
  ["Availability", "Disponibilité"],
  ["Conference call", "Conférence téléphonique"],
  ["Preferred time", "Heure souhaitée"],
  ["Organic products", "Produits biologiques"],
  ["Skincare range", "Gamme de soins"],
  ["Essential oils", "Huiles essentielles"],
  ["Change of contact details", "Changement de coordonnées"],
  ["Potential distributor", "Distributeur potentiel"],
];
const IDENTIFY_ROUNDS = QUIZ_BANK.slice(0, 10);
const VALIDATION_ROUNDS = QUIZ_BANK.slice(10, 18);
const ALL_FR = QUIZ_BANK.map(([, fr]) => fr);

type Drill = { prompt: string; answer: string; choices: string[] };
const DRILLS: Drill[] = [
  { prompt: "Inquiry", answer: "Demande d'information", choices: ["Demande", "Demande d'information"] },
  { prompt: "Request", answer: "Demande", choices: ["Demande", "Demande d'information"] },
  { prompt: "Feedback", answer: "Retour / Avis", choices: ["Retour / Avis", "Suivi / Relance"] },
  { prompt: "Follow-up", answer: "Suivi / Relance", choices: ["Retour / Avis", "Suivi / Relance"] },
  { prompt: "Supplier", answer: "Fournisseur", choices: ["Fournisseur", "Distributeur"] },
  { prompt: "Distributor", answer: "Distributeur", choices: ["Fournisseur", "Distributeur"] },
  { prompt: "Confirm", answer: "Confirmer", choices: ["Confirmer", "Mettre à jour", "Reporter"] },
  { prompt: "Update", answer: "Mettre à jour", choices: ["Confirmer", "Mettre à jour", "Reporter"] },
  { prompt: "Availability", answer: "Disponibilité", choices: ["Disponibilité", "Rendez-vous"] },
  { prompt: "Appointment", answer: "Rendez-vous", choices: ["Disponibilité", "Rendez-vous"] },
];

// Real-Life Challenge script: a realistic voicemail using this module's
// exact vocabulary. Trainees fill in the same fields as the exam's fiche de
// renseignement, then get an auto-scored correction.
// The voicemail is generated as three separate clips played back to back,
// rather than one long one. Measured on the real endpoint: inside a single
// 45-second generation the model flattens the pacing, so pause tags and
// punctuation barely register (45.3s with commas, 45.9s with full stops,
// 46.5s with pause tags). In a short clip the same tags are honoured —
// spelling "Sarah" went from 3.0s to 5.2s. Splitting it is therefore the only
// way to slow the spelling down without dragging out the whole message, which
// has to stay at exam speed. Each clip stays under the 1200-character ceiling
// /api/symbol-tts enforces; past it the request 400s and the step goes silent.
type Segment = { text: string; speed: number };
const SP = '<break time="0.6s"/>';
const NARRATION = 0.75; // the caller's own pace
const SPELLING = 0.72; // slower still, for anything read out letter by letter
const CHALLENGE_SEGMENTS: Segment[] = [
  {
    text: "Hello, this is Sarah Bennett calling from Green Valley Organics. Let me spell that for you.",
    speed: NARRATION,
  },
  {
    text:
      `Sarah. S${SP}A${SP}R${SP}A${SP}H. ` +
      `Bennett. B${SP}E${SP}double N${SP}E${SP}double T.`,
    speed: SPELLING,
  },
  {
    // The company name is spelled too: it goes on the fiche de renseignement,
    // and its spelling is what the email domain has to be built from.
    text:
      `And the company. Green. G${SP}R${SP}E${SP}E${SP}N. ` +
      `Valley. V${SP}A${SP}double L${SP}E${SP}Y. ` +
      `Organics. O${SP}R${SP}G${SP}A${SP}N${SP}I${SP}C${SP}S.`,
    speed: SPELLING,
  },
  {
    text:
      "We're a supplier based in Manchester, United Kingdom. I'd like to request your latest price list and catalogue " +
      "for your organic skincare range. Could you send us more information and confirm your availability for a " +
      "conference call next week? You can reach me on plus double four, one six one, four nine six, zero one three two, " +
      "or by email at s dot bennett at greenvalleyorganics dot co dot uk. Thank you, looking forward to hearing from you.",
    speed: NARRATION,
  },
];

type ChallengeField = { key: string; label: string; placeholder: string; check: (value: string) => boolean };
const norm = (v: string) => v.trim().toLowerCase();
const CHALLENGE_FIELDS: ChallengeField[] = [
  { key: "first", label: "Prénom", placeholder: "First name", check: (v) => norm(v) === "sarah" },
  { key: "last", label: "Nom", placeholder: "Last name", check: (v) => norm(v) === "bennett" },
  { key: "company", label: "Nom de l'entreprise", placeholder: "Company name", check: (v) => norm(v) === "green valley organics" },
  { key: "location", label: "Ville / Pays", placeholder: "City, Country", check: (v) => norm(v).includes("manchester") },
  { key: "phone", label: "Indicatif + numéro de téléphone", placeholder: "e.g. +44...", check: (v) => v.replace(/\D/g, "").includes("441614960132") },
  { key: "email", label: "Adresse e-mail", placeholder: "name@company.com", check: (v) => norm(v) === "s.bennett@greenvalleyorganics.co.uk" },
];

// Names the pre-generated recording for a clip. MUST stay identical to
// clipName() in scripts/generate-vocabulary-audio.mjs: if the two ever
// disagree, every lookup 404s and the module silently falls back to the paid
// endpoint — working, but billing per play again, which is the whole problem
// this was meant to solve.
async function clipName(key: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key));
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function optionsFor(correct: string): string[] {
  const distractors = shuffle(ALL_FR.filter((fr) => fr !== correct)).slice(0, 3);
  return shuffle([correct, ...distractors]);
}

const STEP_TITLES = ["Bienvenue", "Apprendre le vocabulaire", "Écoute & identification", "Real-Life Challenge", "Remédiation", "Validation", "Terminé"];
const STEP_DESCRIPTIONS = [
  "Découvrir le module",
  "Le vocabulaire CADGA par catégorie, avec la voix naturelle",
  "Écoute un mot, choisis la bonne traduction",
  "Un vrai message vocal professionnel à traiter",
  "Travaille les mots qui se ressemblent",
  "Le contrôle final",
];

export default function VocabularyModule() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(0);
  const [audioBusy, setAudioBusy] = useState(false);
  const [audioError, setAudioError] = useState("");
  const [listened, setListened] = useState<Set<string>>(new Set());

  const [quizIndex, setQuizIndex] = useState(0);
  const [quizPicked, setQuizPicked] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const [challengeStarted, setChallengeStarted] = useState(false);
  const [challengeDone, setChallengeDone] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  const [drillIndex, setDrillIndex] = useState(0);
  const [drillPicked, setDrillPicked] = useState<string | null>(null);
  const [drillScore, setDrillScore] = useState(0);
  const [drillFinished, setDrillFinished] = useState(false);

  const [valIndex, setValIndex] = useState(0);
  const [valPicked, setValPicked] = useState<string | null>(null);
  const [valScore, setValScore] = useState(0);
  const [valFinished, setValFinished] = useState(false);

  const audioCache = useRef(new Map<string, string>());
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  // Bumped on every stop. A clip sequence checks it between clips and bails
  // out if it no longer matches, so leaving mid-voicemail doesn't let the
  // next clip start on top of the step the learner just moved to.
  const playToken = useRef(0);

  // An <audio> element keeps playing after the step that started it goes away,
  // so every navigation has to stop it explicitly — otherwise the voice follows
  // the learner onto the next step, or out of the module entirely.
  function stopAudio() {
    playToken.current += 1;
    const audio = currentAudio.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      currentAudio.current = null;
    }
  }

  // Leaving the module (EXIT, "retour à Day 02", browser back) unmounts us.
  useEffect(() => {
    return () => {
      const audio = currentAudio.current;
      if (audio) {
        audio.pause();
        currentAudio.current = null;
      }
    };
  }, []);

  function go(n: number) {
    stopAudio();
    setAudioBusy(false);
    setStep(Math.max(1, Math.min(7, n)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function clipUrl(text: string, speed: number) {
    const key = `${speed}|${text}`;
    const cached = audioCache.current.get(key);
    if (cached) return cached;

    // Prefer the recording made once by scripts/generate-vocabulary-audio.mjs.
    // Serving a static file costs nothing per play, so the module no longer
    // gets more expensive with each trainee and keeps working when the voice
    // quota is spent. The paid endpoint below is only the fallback for texts
    // that have not been generated yet.
    const staticUrl = `/audio/vocabulary/${await clipName(key)}.mp3`;
    try {
      const file = await fetch(staticUrl, { method: "HEAD" });
      if (file.ok) {
        audioCache.current.set(key, staticUrl);
        return staticUrl;
      }
    } catch {
      // Offline or blocked — fall through and try generating it.
    }

    const response = await fetch("/api/symbol-tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, speed }),
    });
    if (!response.ok) {
      // Distinguish "the voice account is out of credits" from a passing
      // glitch: telling someone to retry when retrying cannot work just has
      // them clicking a dead button in the middle of a lesson.
      let quota = false;
      try {
        quota = (await response.json())?.quotaExceeded === true;
      } catch {
        quota = false;
      }
      throw new Error(quota ? "quota" : "fail");
    }
    const url = URL.createObjectURL(await response.blob());
    audioCache.current.set(key, url);
    return url;
  }

  function playUrl(url: string, token: number) {
    return new Promise<void>((resolve, reject) => {
      if (token !== playToken.current) return resolve();
      // A stop mid-clip pauses the element, so onended never fires. Without
      // settling on pause too, the sequence would await a promise forever.
      const stale = () => token !== playToken.current;
      const audio = new Audio(url);
      currentAudio.current = audio;
      audio.onended = () => resolve();
      audio.onpause = () => {
        if (stale()) resolve();
      };
      audio.onerror = () => (stale() ? resolve() : reject(new Error()));
      audio.play().catch((err) => (stale() ? resolve() : reject(err)));
    });
  }

  // Plays one or more clips back to back. Multi-clip playback is what lets the
  // voicemail's spelling be generated slowly while the rest stays at exam pace.
  async function playClips(clips: Segment[], cacheKey?: string) {
    if (audioBusy) return;
    stopAudio();
    const token = playToken.current;
    setAudioBusy(true);
    setAudioError("");
    try {
      for (const clip of clips) {
        if (token !== playToken.current) return;
        const url = await clipUrl(clip.text, clip.speed);
        if (token !== playToken.current) return;
        await playUrl(url, token);
      }
      if (token === playToken.current && cacheKey) {
        setListened((s) => new Set(s).add(cacheKey));
      }
    } catch (err) {
      setAudioError(
        err instanceof Error && err.message === "quota"
          ? "Le quota de la voix de synthèse est épuisé : l'audio ne reviendra qu'au renouvellement du quota ElevenLabs."
          : "La voix naturelle n'est pas disponible. Réessaie."
      );
    } finally {
      if (token === playToken.current) setAudioBusy(false);
    }
  }

  function play(text: string, cacheKey?: string) {
    return playClips([{ text, speed: 0.88 }], cacheKey);
  }

  const identifyRound = IDENTIFY_ROUNDS[quizIndex];
  const identifyOptions = useMemo(() => (identifyRound ? optionsFor(identifyRound[1]) : []), [quizIndex]);

  function pickQuizAnswer(fr: string) {
    if (quizPicked) return;
    setQuizPicked(fr);
    if (fr === identifyRound[1]) setQuizScore((s) => s + 1);
  }
  function nextQuizRound() {
    if (quizIndex === IDENTIFY_ROUNDS.length - 1) {
      setQuizFinished(true);
      return;
    }
    setQuizIndex((i) => i + 1);
    setQuizPicked(null);
  }

  async function playChallenge() {
    setChallengeStarted(true);
    await playClips(CHALLENGE_SEGMENTS, "challenge-message");
  }
  const challengeScore = CHALLENGE_FIELDS.filter((f) => f.check(values[f.key] || "")).length;

  const drill = DRILLS[drillIndex];
  function pickDrill(choice: string) {
    if (drillPicked) return;
    setDrillPicked(choice);
    if (choice === drill.answer) setDrillScore((s) => s + 1);
  }
  function nextDrill() {
    if (drillIndex === DRILLS.length - 1) {
      setDrillFinished(true);
      return;
    }
    setDrillIndex((i) => i + 1);
    setDrillPicked(null);
  }

  const valRound = VALIDATION_ROUNDS[valIndex];
  const valOptions = useMemo(() => (valRound ? optionsFor(valRound[1]) : []), [valIndex]);
  function pickVal(fr: string) {
    if (valPicked) return;
    setValPicked(fr);
    if (fr === valRound[1]) setValScore((s) => s + 1);
  }
  function nextVal() {
    if (valIndex === VALIDATION_ROUNDS.length - 1) {
      setValFinished(true);
      return;
    }
    setValIndex((i) => i + 1);
    setValPicked(null);
  }

  const currentCategory = category < VOCAB.length ? VOCAB[category] : null;

  return (
    <main className="voc-page">
      <div className="voc-shell">
        <header className="voc-top">
          <div>
            <span>CADGA · MODULE 03</span>
            <strong>CADGA VOCABULARY</strong>
          </div>
          <div className="voc-progress">
            <i>
              <em style={{ width: `${(step / 7) * 100}%` }} />
            </i>
            <small>STEP {step} / 7</small>
          </div>
          <button onClick={() => router.push("/day2")}>EXIT</button>
        </header>

        {step === 1 && (
          <section className="voc-card voc-welcome">
            <span>BIENVENUE</span>
            <h1>CADGA Vocabulary</h1>
            <p>
              Le vocabulaire business anglais utilisé dans les voicemails et les e-mails professionnels — prospects,
              clients, réunions, demandes. Apprends-le, entraîne-toi à l'oral, puis valide tes acquis.
            </p>
            <a className="voc-download" href="/documents/business-english-vocabulary.pdf" download>
              <span>↓</span>
              <b>TÉLÉCHARGER LE POSTER DE VOCABULAIRE</b>
              <small>PDF · Support de révision</small>
            </a>
            <div className="voc-meta">
              <div>
                <b>🔊</b>
                <span>
                  VOIX NATURELLE
                  <small>ÉCOUTE CHAQUE MOT</small>
                </span>
              </div>
              <div>
                <b>★</b>
                <span>
                  VALIDATION FINALE
                  <small>80% TARGET</small>
                </span>
              </div>
              <div>
                <b>🎧</b>
                <span>
                  ENSUITE
                  <small>MODULE 04 · METHOD</small>
                </span>
              </div>
            </div>
            <div className="voc-steps">
              <h2>AU PROGRAMME</h2>
              {STEP_TITLES.slice(1, 6).map((title, i) => (
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
          <section className="voc-card">
            <div className="voc-heading">
              <span>APPRENDRE · {listened.size} MOTS ÉCOUTÉS</span>
              <h1>Le vocabulaire par catégorie</h1>
              <p>Choisis une catégorie, écoute chaque mot avec la voix naturelle.</p>
            </div>
            <div className="voc-tabs">
              {VOCAB.map((cat, i) => (
                <button key={cat.title} className={category === i ? "active" : ""} onClick={() => setCategory(i)}>
                  {cat.title}
                </button>
              ))}
              <button className={category === VOCAB.length ? "active" : ""} onClick={() => setCategory(VOCAB.length)}>
                Expressions utiles
              </button>
            </div>
            {audioError && <p className="voc-audio-error">{audioError}</p>}
            <div className="voc-word-grid">
              {(currentCategory ? currentCategory.pairs : PHRASES).map(([en, fr]) => {
                const key = `${category}-${en}`;
                return (
                  <div className={`voc-word-card ${listened.has(key) ? "done" : ""}`} key={en}>
                    <div className="voc-word-en">{en}</div>
                    <div className="voc-word-fr">{fr}</div>
                    <button disabled={audioBusy} onClick={() => play(en, key)}>
                      🔊 {listened.has(key) ? "RÉÉCOUTER" : "ÉCOUTER"}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="voc-callout">
              <h3>{TIPS[category].title}</h3>
              <ul>
                {TIPS[category].lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {step === 3 && !quizFinished && identifyRound && (
          <section className="voc-card voc-quiz">
            <div className="voc-quiz-head">
              <div>
                <span className="voc-eyebrow">QUESTION {quizIndex + 1} / {IDENTIFY_ROUNDS.length}</span>
                <h1>Quelle est la bonne traduction ?</h1>
              </div>
              <div className="voc-score-chip">SCORE {quizScore}</div>
            </div>
            <button className={`voc-orb ${audioBusy ? "loading" : ""}`} disabled={audioBusy} onClick={() => play(identifyRound[0])}>
              🔊 <b>{audioBusy ? "LECTURE…" : "ÉCOUTER LE MOT"}</b>
            </button>
            <div className="voc-options">
              {identifyOptions.map((fr) => {
                const isCorrect = quizPicked && fr === identifyRound[1];
                const isWrong = quizPicked === fr && fr !== identifyRound[1];
                return (
                  <button key={fr} disabled={!!quizPicked} className={`${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`} onClick={() => pickQuizAnswer(fr)}>
                    {fr}
                  </button>
                );
              })}
            </div>
            {quizPicked && (
              <div className={`voc-feedback ${quizPicked === identifyRound[1] ? "good" : "bad"}`}>
                {quizPicked === identifyRound[1] ? "✓ Correct !" : `Pas tout à fait — la bonne réponse était « ${identifyRound[1]} ».`}
                <button className="voc-primary" onClick={nextQuizRound}>
                  {quizIndex === IDENTIFY_ROUNDS.length - 1 ? "VOIR LE RÉSULTAT →" : "SUIVANT →"}
                </button>
              </div>
            )}
          </section>
        )}

        {step === 3 && quizFinished && (
          <section className="voc-card voc-result">
            <span>ÉCOUTE & IDENTIFICATION TERMINÉ</span>
            <div className="voc-ring" style={{ background: `conic-gradient(#49d391 ${(quizScore / IDENTIFY_ROUNDS.length) * 360}deg, #173a2f 0)` }}>
              <b>{Math.round((quizScore / IDENTIFY_ROUNDS.length) * 100)}%</b>
            </div>
            <p>
              {quizScore} / {IDENTIFY_ROUNDS.length} bonnes réponses.
            </p>
            <div className="voc-result-actions">
              <button
                onClick={() => {
                  setQuizIndex(0);
                  setQuizPicked(null);
                  setQuizScore(0);
                  setQuizFinished(false);
                }}
              >
                ↻ RECOMMENCER
              </button>
              <button className="voc-primary" onClick={() => go(4)}>
                CONTINUER →
              </button>
            </div>
          </section>
        )}

        {step === 4 && !challengeDone && (
          <section className="voc-card">
            <div className="voc-heading">
              <span>REAL-LIFE CHALLENGE</span>
              <h1>Traite ce message vocal</h1>
              <p>Écoute le message professionnel et remplis les informations, exactement comme à l'examen.</p>
            </div>
            <button className="voc-orb voc-orb-wide" disabled={audioBusy} onClick={playChallenge}>
              🔊 <b>{audioBusy ? "LECTURE EN COURS…" : challengeStarted ? "RÉÉCOUTER" : "ÉCOUTER LE MESSAGE"}</b>
            </button>
            {audioError && <p className="voc-audio-error">{audioError}</p>}
            <div className="voc-fields">
              {CHALLENGE_FIELDS.map((f) => (
                <div className="voc-field-row" key={f.key}>
                  <label>{f.label}</label>
                  <input
                    value={values[f.key] || ""}
                    placeholder={f.placeholder}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <button className="voc-primary" disabled={!challengeStarted} onClick={() => setChallengeDone(true)}>
              VALIDER MES RÉPONSES
            </button>
          </section>
        )}

        {step === 4 && challengeDone && (
          <section className="voc-card voc-result">
            <span>REAL-LIFE CHALLENGE TERMINÉ</span>
            <div className="voc-ring" style={{ background: `conic-gradient(#49d391 ${(challengeScore / CHALLENGE_FIELDS.length) * 360}deg, #173a2f 0)` }}>
              <b>
                {challengeScore}/{CHALLENGE_FIELDS.length}
              </b>
            </div>
            <div className="voc-fields voc-fields-review">
              {CHALLENGE_FIELDS.map((f) => (
                <div className={`voc-field-row ${f.check(values[f.key] || "") ? "good" : "bad"}`} key={f.key}>
                  <label>{f.label}</label>
                  <span>{values[f.key] || "—"}</span>
                </div>
              ))}
            </div>
            <div className="voc-result-actions">
              <button
                onClick={() => {
                  setChallengeStarted(false);
                  setChallengeDone(false);
                  setValues({});
                }}
              >
                ↻ RECOMMENCER
              </button>
              <button className="voc-primary" onClick={() => go(5)}>
                CONTINUER →
              </button>
            </div>
          </section>
        )}

        {step === 5 && !drillFinished && (
          <section className="voc-card voc-drill">
            <span className="voc-eyebrow">
              REMÉDIATION · {drillIndex + 1} / {DRILLS.length}
            </span>
            <h1>Ne les confonds pas.</h1>
            <div className="voc-drill-prompt">{drill.prompt}</div>
            <div className={`voc-drill-choices ${drill.choices.length === 2 ? "two" : "three"}`}>
              {drill.choices.map((c) => (
                <button
                  key={c}
                  disabled={!!drillPicked}
                  className={drillPicked ? (c === drill.answer ? "correct" : c === drillPicked ? "wrong" : "") : ""}
                  onClick={() => pickDrill(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            {drillPicked && (
              <div className={`voc-feedback ${drillPicked === drill.answer ? "good" : "bad"}`}>
                {drillPicked === drill.answer ? "✓ Correct !" : `La bonne réponse était « ${drill.answer} ».`}
                <button className="voc-primary" onClick={nextDrill}>
                  {drillIndex === DRILLS.length - 1 ? "VOIR LE RÉSULTAT →" : "SUIVANT →"}
                </button>
              </div>
            )}
          </section>
        )}

        {step === 5 && drillFinished && (
          <section className="voc-card voc-result">
            <span>REMÉDIATION TERMINÉE</span>
            <div className="voc-ring" style={{ background: `conic-gradient(#49d391 ${(drillScore / DRILLS.length) * 360}deg, #173a2f 0)` }}>
              <b>{Math.round((drillScore / DRILLS.length) * 100)}%</b>
            </div>
            <p>
              {drillScore} / {DRILLS.length} bonnes réponses.
            </p>
            <button className="voc-primary" onClick={() => go(6)}>
              ALLER À LA VALIDATION →
            </button>
          </section>
        )}

        {step === 6 && !valFinished && valRound && (
          <section className="voc-card voc-quiz">
            <div className="voc-quiz-head">
              <div>
                <span className="voc-eyebrow">
                  VALIDATION FINALE · {valIndex + 1} / {VALIDATION_ROUNDS.length}
                </span>
                <h1>Dernière ligne droite.</h1>
              </div>
              <div className="voc-score-chip">SCORE {valScore}</div>
            </div>
            <button className={`voc-orb ${audioBusy ? "loading" : ""}`} disabled={audioBusy} onClick={() => play(valRound[0])}>
              🔊 <b>{audioBusy ? "LECTURE…" : "ÉCOUTER LE MOT"}</b>
            </button>
            <div className="voc-options">
              {valOptions.map((fr) => {
                const isCorrect = valPicked && fr === valRound[1];
                const isWrong = valPicked === fr && fr !== valRound[1];
                return (
                  <button key={fr} disabled={!!valPicked} className={`${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`} onClick={() => pickVal(fr)}>
                    {fr}
                  </button>
                );
              })}
            </div>
            {valPicked && (
              <div className={`voc-feedback ${valPicked === valRound[1] ? "good" : "bad"}`}>
                {valPicked === valRound[1] ? "✓ Correct !" : `La bonne réponse était « ${valRound[1]} ».`}
                <button className="voc-primary" onClick={nextVal}>
                  {valIndex === VALIDATION_ROUNDS.length - 1 ? "TERMINER →" : "SUIVANT →"}
                </button>
              </div>
            )}
          </section>
        )}

        {step === 6 && valFinished && (
          <section className="voc-card voc-result">
            <span>MODULE 02 · CONTRÔLE FINAL</span>
            <div className="voc-ring" style={{ background: `conic-gradient(#49d391 ${(valScore / VALIDATION_ROUNDS.length) * 360}deg, #173a2f 0)` }}>
              <b>{Math.round((valScore / VALIDATION_ROUNDS.length) * 100)}%</b>
            </div>
            <h1>{valScore / VALIDATION_ROUNDS.length >= 0.8 ? "ACQUIS" : "À RETRAVAILLER"}</h1>
            <p>
              {valScore} / {VALIDATION_ROUNDS.length} — objectif 80%.{" "}
              {valScore / VALIDATION_ROUNDS.length >= 0.8 ? "Tu maîtrises le vocabulaire CADGA." : "Repasse par la remédiation avant de continuer."}
            </p>
            <button className="voc-primary" onClick={() => go(7)}>
              CONTINUER →
            </button>
          </section>
        )}

        {step === 7 && (
          <section className="voc-card voc-done">
            <div className="voc-award">★</div>
            <span>MODULE 02 TERMINÉ</span>
            <h1>Le vocabulaire, c'est acquis.</h1>
            <p>Direction le Module 03 pour découvrir précisément comment se déroule l'épreuve voicemail à l'examen.</p>
            <button className="voc-primary" onClick={() => router.push("/day2")}>
              RETOUR À DAY 02
            </button>
          </section>
        )}

        {step > 1 && step < 7 && (
          <footer className="voc-footer">
            <button onClick={() => go(step - 1)}>‹ PRÉCÉDENT</button>
            <span>{STEP_TITLES[step - 1].toUpperCase()}</span>
            <button className="voc-primary" onClick={() => go(step + 1)}>
              SUIVANT →
            </button>
          </footer>
        )}
      </div>
    </main>
  );
}
