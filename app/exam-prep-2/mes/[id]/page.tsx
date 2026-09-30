"use client";
import Link from "next/link";
import {useParams} from "next/navigation";
import {useEffect, useMemo, useRef, useState} from "react";
import "./call.css";
import DocsPanel from "./DocsPanel";
import {FICHE, FICHE_CRITERION, ficheFor, recipientsFor, orgName, RECIPIENT_CRITERION, REQUIRED, ficheValidated, findScenario, globalResult, scoreFiche, type FicheKey} from "@/lib/call-scenarios";
import {LiveCall, type Line} from "@/lib/live-call";

type Phase = "brief" | "ringing" | "connecting" | "live" | "ended" | "corrected";
type Criterion = {id: string; name: string; result: string; rationale: string};

const ERRORS: Record<string, string> = {
  "agents-not-configured": "La voix de l’appelant n’est pas encore configurée sur ce site (clé ElevenLabs manquante). Prévenez votre formatrice.",
  "agents-permission": "La clé ElevenLabs de ce site n’a pas accès aux Agents (appels en direct). Prévenez votre formatrice.",
  "agents-unavailable": "Le service d’appel ne répond pas. Réessayez dans un instant.",
  "rate-limited": "Trop d’appels lancés en peu de temps. Patientez quelques minutes avant de recommencer.",
  "NotAllowedError": "Le micro est bloqué. Autorisez le micro pour ce site dans votre navigateur, puis réessayez.",
  "NotFoundError": "Aucun micro n’a été trouvé sur cet appareil.",
  network: "La connexion à l’appel a échoué. Vérifiez votre connexion internet et réessayez.",
};
// MES de la Banque de préparation ECF : chronométrées, 20 minutes pour valider la fiche à partir du décroché.
const TIME_LIMIT = 20 * 60;
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function CallPage() {
  const {id} = useParams<{id: string}>();
  const s = findScenario(String(id));
  const [phase, setPhase] = useState<Phase>("brief");
  const [error, setError] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [level, setLevel] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [fiche, setFiche] = useState<Record<FicheKey, string>>(() => Object.fromEntries(FICHE.map(f => [f.key, ""])) as Record<FicheKey, string>);
  const [recipient, setRecipient] = useState("");
  const [criteria, setCriteria] = useState<Criterion[] | null>(null);
  const [analysis, setAnalysis] = useState<"waiting" | "done" | "failed">("waiting");
  const [deadline, setDeadline] = useState<number | null>(null);
  const [left, setLeft] = useState(TIME_LIMIT);
  const [timedOut, setTimedOut] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const timed = !!s?.bank || !!s?.ecf;
  const call = useRef<LiveCall | null>(null);
  const submitRef = useRef<() => void>(() => {});
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => call.current?.hangUp(), []);
  useEffect(() => { if (phase !== "live") return; const t = setInterval(() => setSeconds(x => x + 1), 1000); return () => clearInterval(t); }, [phase]);
  useEffect(() => { if (timed && phase === "live" && deadline === null) setDeadline(Date.now() + TIME_LIMIT * 1000); }, [timed, phase, deadline]);
  useEffect(() => {
    if (deadline === null || phase === "corrected") return;
    const tick = () => {
      const l = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setLeft(l);
      if (l === 0) { setTimedOut(true); call.current?.hangUp(); submitRef.current(); }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [deadline, phase]);
  useEffect(() => { logRef.current?.scrollTo({top: logRef.current.scrollHeight, behavior: "smooth"}); }, [lines]);

  async function answer() {
    if (!s) return;
    setError(""); setPhase("connecting"); setLines([]); setSeconds(0);
    try {
      const res = await fetch("/api/call/session", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({mes: s.id})});
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.signedUrl) throw new Error(data.error || "agents-unavailable");
      const c = new LiveCall({
        onStatus: (st, detail) => {
          if (st === "live") setPhase("live");
          if (st === "ended") setPhase(p => (p === "connecting" && !c.conversationId ? "ringing" : "ended"));
          if (st === "error") { setError(ERRORS[detail || "network"] || ERRORS.network); setPhase("ringing"); }
        },
        onLine: line => setLines(l => [...l, line]),
        onSpeaking: setSpeaking,
        onLevel: setLevel,
      });
      call.current = c;
      await c.start(data.signedUrl);
    } catch (e) {
      const code = e instanceof Error ? (e.name && e.name !== "Error" ? e.name : e.message) : "network";
      setError(ERRORS[code] || ERRORS.network); setPhase("ringing"); call.current?.hangUp(); call.current = null;
    }
  }
  function hangUp() { call.current?.hangUp(); setPhase("ended"); }

  async function submit() {
    if (!s) return;
    setPhase("corrected"); setAnalysis("waiting");
    const convId = call.current?.conversationId;
    if (!convId) { setAnalysis("failed"); return; }
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, i ? 3000 : 1500));
      try {
        const res = await fetch(`/api/call/result?mes=${s.id}&id=${encodeURIComponent(convId)}`);
        const data = await res.json();
        if (res.ok && data.status === "done" && data.analysed) { setCriteria(data.criteria); if (Array.isArray(data.transcript) && data.transcript.length) setLines(data.transcript); setAnalysis("done"); return; }
      } catch {}
    }
    setAnalysis("failed");
  }
  submitRef.current = submit;
  function restart() { call.current = null; setDeadline(null); setLeft(TIME_LIMIT); setTimedOut(false); setPhase("brief"); setLines([]); setCriteria(null); setRecipient(""); setError(""); setFiche(Object.fromEntries(FICHE.map(f => [f.key, ""])) as Record<FicheKey, string>); }

  const results = useMemo(() => s ? ficheFor(s).map(f => ({...f, ok: scoreFiche(s, f.key, fiche[f.key])})) : [], [s, fiche]);
  if (!s) return <main className="call-page"><section className="call-shell"><h1>MES introuvable</h1><Link href="/exam-prep-2">← Retour</Link></section></main>;
  const back = s.ecf === 1 ? "/day4" : s.ecf === 2 ? "/day5" : s.bank ? "/banque-ecf" : "/exam-prep-2";
  const section = s.ecf ? `ECF · PART ${s.ecf}` : s.bank ? "BANQUE DE PRÉPARATION ECF" : "EXAM PREP · PART 2";
  const title = s.ecf ? `ECF · Part ${s.ecf}` : `MES ${s.n}`;
  const ficheScore = results.filter(r => r.ok).length;
  const recipientOk = recipient === s.recipient;
  const ficheOk = ficheValidated(Object.fromEntries(results.map(r => [r.key, r.ok])) as Partial<Record<FicheKey, boolean>>, results);
  const grid = [...(criteria || s.criteria.map(c => ({id: c.id, name: c.name, result: "pending", rationale: ""}))),
    {id: FICHE_CRITERION.id, name: FICHE_CRITERION.name, result: ficheOk ? "success" : "failure", rationale: `${ficheScore} champ${ficheScore > 1 ? "s" : ""} juste${ficheScore > 1 ? "s" : ""} sur ${results.length}. Validé si au plus 1 champ est faux ou manquant, avec le nom de l’appelant et au moins un moyen de contact justes.`},
    {id: RECIPIENT_CRITERION.id, name: RECIPIENT_CRITERION.name, result: recipientOk ? "success" : "failure", rationale: recipientOk ? s.recipientWhy : `Vous avez choisi ${recipient || "aucun destinataire"}. ${s.recipientWhy}`}];
  const verdict = globalResult(Object.fromEntries(grid.map(c => [c.id, c.result === "success"])));
  const inCall = phase === "connecting" || phase === "live";
  const canEdit = phase !== "brief" && phase !== "corrected";

  return <main className="call-page">
    <header className="call-top"><Link href={back} className="call-back">← {section}</Link><div><small>{section} · ACCUEIL TÉLÉPHONIQUE</small><strong>{title}</strong></div>{timed && phase !== "brief" && <span className={`call-timer ${deadline === null ? "" : left <= 120 ? "urgent" : left <= 300 ? "warn" : ""}`} role="timer" aria-label="Temps restant">⏱ {phase === "corrected" ? (timedOut ? "TEMPS ÉCOULÉ" : `${clock(TIME_LIMIT - left)} utilisées`) : clock(left)}</span>}<span className="call-date">{s.date} · {s.time}</span></header>

    {phase === "brief" ? <section className="call-brief">
      <span>AVANT L’APPEL</span><h1>{title}</h1><p>{s.briefing}</p>
      {s.org === "pitch" && <p className="call-docs">📂 Pendant l’appel, les documents Pitch Vision (annuaire, organigramme, tableau des clients, tarifs, calendrier) s’ouvrent à côté de la fiche. Vous pouvez aussi <a href="/pitch-vision" target="_blank" rel="noopener">les consulter ou les imprimer maintenant ↗</a>.</p>}
      {timed && <p className="call-timed">⏱ <b>{s.ecf ? "Épreuve chronométrée : 20 minutes" : "MES chronométrée : 20 minutes"}</b> à partir du moment où vous décrochez, pour mener l’appel, remplir la fiche, choisir le destinataire et valider. À 0:00, l’appel est coupé et votre fiche est validée automatiquement, telle quelle.</p>}
      <ul><li>Décrochez et accueillez l’appelant <b>en anglais</b>, comme à l’accueil de {orgName(s)}.</li><li>Remplissez la <b>fiche de renseignements</b> pendant l’appel (en français).</li><li>Après l’appel, choisissez le <b>destinataire du message</b> dans l’organigramme.</li><li>Utilisez un <b>casque ou des écouteurs</b> : sinon l’appelant s’entend lui-même.</li></ul>
      <button type="button" onClick={() => setPhase("ringing")}>JE SUIS PRÊT(E) →</button>
    </section> : <section className="call-grid">
      <div className="call-phone">
        {phase === "ringing" && <div className="call-ring"><div className="ring-icon" aria-hidden="true">☎</div><h2>Appel entrant…</h2><p>Numéro international</p>{error && <p className="call-error" role="alert">{error}</p>}<button type="button" className="answer" onClick={answer}>DÉCROCHER</button></div>}
        {phase !== "ringing" && <>
          <div className={`call-status ${speaking ? "speaking" : ""}`}><div className="avatar" aria-hidden="true">☎</div><div><b>{phase === "connecting" ? "Connexion…" : inCall ? (speaking ? "L’appelant parle…" : "À vous de parler") : "Appel terminé"}</b><span>{clock(seconds)}</span></div>{inCall && <i className="mic" style={{transform: `scaleY(${0.3 + level})`}} aria-hidden="true"/>}</div>
          <div className="call-log" ref={logRef} aria-live="polite">{lines.length === 0 && <p className="hint">{inCall ? `Décrochez en anglais : « Good morning, ${orgName(s)}… »` : "Aucune réplique enregistrée."}</p>}{lines.map((l, i) => <p key={i} className={l.role}><b>{l.role === "caller" ? "Appelant" : "Vous"}</b>{l.text}</p>)}</div>
          {inCall && <button type="button" className="hangup" onClick={hangUp}>RACCROCHER</button>}
        </>}
      </div>

      <div className="call-fiche">
        <div className="fiche-head"><span>FICHE DE RENSEIGNEMENTS</span><small>À remplir en français pendant l’appel</small></div>
        {s.org === "pitch" && phase !== "corrected" && <button type="button" className="docs-open" onClick={() => setDocsOpen(o => !o)}>📂 {docsOpen ? "Masquer" : "Ouvrir"} les documents Pitch Vision (annuaire, organigramme, clients…)</button>}
        <div className="fiche-grid">{results.map(f => <label key={f.key} className={`${f.wide ? "wide" : ""} ${phase === "corrected" ? (f.ok ? "ok" : "ko") : ""}`}><span>{f.label}</span><input value={fiche[f.key]} disabled={!canEdit} onChange={e => setFiche(v => ({...v, [f.key]: e.target.value}))}/>{phase === "corrected" && !f.ok && <em>Attendu : {s.answers[f.key]}</em>}</label>)}</div>
        <label className={`fiche-recipient ${phase === "corrected" ? (recipientOk ? "ok" : "ko") : ""}`}><span>DESTINATAIRE DU MESSAGE</span><select value={recipient} disabled={!canEdit} onChange={e => setRecipient(e.target.value)}><option value="">— Choisir dans l’organigramme —</option>{recipientsFor(s).map(([n, r]) => <option key={n} value={n}>{n} · {r}</option>)}</select>{phase === "corrected" && <em>{recipientOk ? "✓ " : "Attendu : "}{s.recipientWhy}</em>}</label>
        {phase === "ended" && <button type="button" className="submit" onClick={submit}>VALIDER MA FICHE ET VOIR LA CORRECTION →</button>}
        {inCall && <p className="fiche-note">Vous pourrez finir de compléter la fiche après avoir raccroché{timed ? ", dans la limite des 20 minutes" : ""}.</p>}
      </div>
    </section>}

    {phase === "corrected" && <section className="call-correction">
      <div className={`verdict ${analysis !== "done" ? "" : verdict.acquis ? "ok" : "ko"}`}><div><span>RÉSULTAT GLOBAL</span><strong>{analysis === "waiting" ? "Analyse en cours…" : analysis === "failed" ? "Résultat partiel" : verdict.acquis ? "ACQUIS" : "NON ACQUIS"}</strong></div><div><b>{analysis === "done" ? verdict.count : "…"} / 10</b><small>critères validés · ACQUIS si au moins 6 sur 10, dont les critères 1 (Accueil) et 5 (Coordonnées vérifiées et informations reformulées)</small></div></div>
      {timedOut && <p className="timeout-note">⏱ Temps écoulé : votre fiche a été validée automatiquement au bout de 20 minutes. Les champs vides comptent comme faux.</p>}
      <h2>Grille d’évaluation, critère par critère</h2>
      {analysis === "waiting" && <p className="waiting" role="status">Analyse de l’appel en cours… (quelques secondes)</p>}
      {analysis === "failed" && <p className="waiting">L’analyse de l’appel n’est pas disponible pour le moment : seuls les critères 9 et 10 sont corrigés. Relisez votre conversation et les phrases modèles ci-dessous.</p>}
      <ol className="criteria">{grid.map((c, i) => <li key={c.id} className={c.result}><b><i>{i + 1}</i>{c.result === "success" ? "✓" : c.result === "failure" ? "✗" : c.result === "pending" ? "…" : "?"} {c.name}{REQUIRED.includes(c.id) && <em>obligatoire</em>}</b><p>{c.result === "pending" ? "En cours d’analyse…" : c.rationale || "Pas assez d’éléments dans l’appel pour évaluer ce critère."}</p>{(c.result === "failure" || c.result === "unknown") && <Link className="remediation" href={i < 8 ? `/exam-prep-2/guide?etape=${i + 1}` : "/exam-prep-2/grille?section=fiche"}>🔁 {i < 8 ? `Revoir l’étape ${i + 1} du guide (chapitre 02)` : "Revoir la fiche et le destinataire (chapitre 01)"} →</Link>}</li>)}</ol>
      <h2>Des phrases modèles</h2>
      <ol className="model">{s.model.map(m => <li key={m}>{m}</li>)}</ol>
      <div className="actions"><button type="button" onClick={restart}>↻ REFAIRE L’APPEL</button><Link href={back}>{s.ecf ? "RETOUR À L’ECF →" : "TOUTES LES MES →"}</Link></div>
    </section>}
  {s.org === "pitch" && <DocsPanel open={docsOpen && phase !== "corrected"} onClose={() => setDocsOpen(false)}/>}
  </main>;
}
