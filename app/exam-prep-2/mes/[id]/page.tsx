"use client";
import Link from "next/link";
import {useParams} from "next/navigation";
import {useEffect, useMemo, useRef, useState} from "react";
import "./call.css";
import {FICHE, RECIPIENTS, findScenario, scoreFiche, type FicheKey} from "@/lib/call-scenarios";
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
  const call = useRef<LiveCall | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => call.current?.hangUp(), []);
  useEffect(() => { if (phase !== "live") return; const t = setInterval(() => setSeconds(x => x + 1), 1000); return () => clearInterval(t); }, [phase]);
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
  function restart() { call.current = null; setPhase("brief"); setLines([]); setCriteria(null); setRecipient(""); setError(""); setFiche(Object.fromEntries(FICHE.map(f => [f.key, ""])) as Record<FicheKey, string>); }

  const results = useMemo(() => s ? FICHE.map(f => ({...f, ok: scoreFiche(s, f.key, fiche[f.key])})) : [], [s, fiche]);
  if (!s) return <main className="call-page"><section className="call-shell"><h1>MES introuvable</h1><Link href="/exam-prep-2">← Retour</Link></section></main>;
  const ficheScore = results.filter(r => r.ok).length;
  const recipientOk = recipient === s.recipient;
  const critOk = criteria?.filter(c => c.result === "success").length ?? 0;
  const inCall = phase === "connecting" || phase === "live";
  const canEdit = phase !== "brief" && phase !== "corrected";

  return <main className="call-page">
    <header className="call-top"><Link href="/exam-prep-2" className="call-back">← EXAM PREP · PART 2</Link><div><small>EXAM PREP · PART 2 · ACCUEIL TÉLÉPHONIQUE</small><strong>MES {s.n} · {s.company} — {s.kind}</strong></div><span className="call-date">{s.date} · {s.time}</span></header>

    {phase === "brief" ? <section className="call-brief">
      <span>MES {s.n} · {s.company.toUpperCase()} · AVANT L’APPEL</span><h1>MES {s.n} · Le téléphone va sonner.</h1><p>{s.briefing}</p>
      <ul><li>Décrochez et accueillez l’appelant <b>en anglais</b>, comme à l’accueil de Primevère.</li><li>Remplissez la <b>fiche de renseignements</b> pendant l’appel (en français).</li><li>Après l’appel, choisissez le <b>destinataire du message</b> dans l’organigramme.</li><li>Utilisez un <b>casque ou des écouteurs</b> : sinon l’appelant s’entend lui-même.</li></ul>
      <button type="button" onClick={() => setPhase("ringing")}>JE SUIS PRÊT(E) →</button>
    </section> : <section className="call-grid">
      <div className="call-phone">
        {phase === "ringing" && <div className="call-ring"><div className="ring-icon" aria-hidden="true">☎</div><h2>Appel entrant…</h2><p>Numéro international</p>{error && <p className="call-error" role="alert">{error}</p>}<button type="button" className="answer" onClick={answer}>DÉCROCHER</button></div>}
        {phase !== "ringing" && <>
          <div className={`call-status ${speaking ? "speaking" : ""}`}><div className="avatar" aria-hidden="true">☎</div><div><b>{phase === "connecting" ? "Connexion…" : inCall ? (speaking ? "L’appelant parle…" : "À vous de parler") : "Appel terminé"}</b><span>{clock(seconds)}</span></div>{inCall && <i className="mic" style={{transform: `scaleY(${0.3 + level})`}} aria-hidden="true"/>}</div>
          <div className="call-log" ref={logRef} aria-live="polite">{lines.length === 0 && <p className="hint">{inCall ? "Décrochez en anglais : « Good afternoon, Primevère… »" : "Aucune réplique enregistrée."}</p>}{lines.map((l, i) => <p key={i} className={l.role}><b>{l.role === "caller" ? "Appelant" : "Vous"}</b>{l.text}</p>)}</div>
          {inCall && <button type="button" className="hangup" onClick={hangUp}>RACCROCHER</button>}
        </>}
      </div>

      <div className="call-fiche">
        <div className="fiche-head"><span>FICHE DE RENSEIGNEMENTS</span><small>À remplir en français pendant l’appel</small></div>
        <div className="fiche-grid">{results.map(f => <label key={f.key} className={`${f.wide ? "wide" : ""} ${phase === "corrected" ? (f.ok ? "ok" : "ko") : ""}`}><span>{f.label}</span><input value={fiche[f.key]} disabled={!canEdit} onChange={e => setFiche(v => ({...v, [f.key]: e.target.value}))}/>{phase === "corrected" && !f.ok && <em>Attendu : {s.answers[f.key]}</em>}</label>)}</div>
        <label className={`fiche-recipient ${phase === "corrected" ? (recipientOk ? "ok" : "ko") : ""}`}><span>DESTINATAIRE DU MESSAGE</span><select value={recipient} disabled={!canEdit} onChange={e => setRecipient(e.target.value)}><option value="">— Choisir dans l’organigramme —</option>{RECIPIENTS.map(([n, r]) => <option key={n} value={n}>{n} · {r}</option>)}</select>{phase === "corrected" && <em>{recipientOk ? "✓ " : "Attendu : "}{s.recipientWhy}</em>}</label>
        {phase === "ended" && <button type="button" className="submit" onClick={submit}>VALIDER MA FICHE ET VOIR LA CORRECTION →</button>}
        {inCall && <p className="fiche-note">Vous pourrez finir de compléter la fiche après avoir raccroché.</p>}
      </div>
    </section>}

    {phase === "corrected" && <section className="call-correction">
      <div className="scores"><article><strong>{ficheScore} / {FICHE.length}</strong><span>champs de la fiche</span></article><article className={recipientOk ? "ok" : "ko"}><strong>{recipientOk ? "✓" : "✗"}</strong><span>destinataire</span></article><article><strong>{analysis === "done" ? `${critOk} / ${criteria?.length}` : "…"}</strong><span>critères de l’appel</span></article></div>
      <h2>Votre appel, critère par critère</h2>
      {analysis === "waiting" && <p className="waiting" role="status">Analyse de l’appel en cours… (quelques secondes)</p>}
      {analysis === "failed" && <p className="waiting">L’analyse de l’appel n’est pas disponible pour le moment. Relisez votre conversation et les phrases modèles ci-dessous.</p>}
      {criteria && <ul className="criteria">{criteria.map(c => <li key={c.id} className={c.result}><b>{c.result === "success" ? "✓" : c.result === "failure" ? "✗" : "?"} {c.name}</b><p>{c.rationale || "Pas assez d’éléments dans l’appel pour évaluer ce critère."}</p></li>)}</ul>}
      <h2>Des phrases modèles</h2>
      <ol className="model">{s.model.map(m => <li key={m}>{m}</li>)}</ol>
      <div className="actions"><button type="button" onClick={restart}>↻ REFAIRE L’APPEL</button><Link href="/exam-prep-2">TOUTES LES MES →</Link></div>
    </section>}
  </main>;
}
