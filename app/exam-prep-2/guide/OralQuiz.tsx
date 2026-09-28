"use client";

import {useEffect, useRef, useState} from "react";
import {ORAL_QUIZ, acceptOral} from "@/lib/oral-quiz";
import {cancelSpeechRecognition, prepareSpeechRecognition, speechErrorMessage, speechRecognitionSupported, type SpeechRecognitionLike} from "@/lib/speech-recognition";

type Result = {heard: string; ok: boolean};

// Quiz oral : une situation, l'apprenant dit la phrase en anglais, la reconnaissance vocale vérifie les mots-clés.
export default function OralQuiz({onDone}: {onDone: (score: number) => void}) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<string, Result>>({});
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const [typed, setTyped] = useState("");
  const [voice, setVoice] = useState(true);
  const rec = useRef<SpeechRecognitionLike | null>(null);
  useEffect(() => { setVoice(speechRecognitionSupported()); return () => cancelSpeechRecognition(); }, []);

  const q = ORAL_QUIZ[index];
  const result = results[q.id];
  const score = Object.values(results).filter(r => r.ok).length;
  const last = index === ORAL_QUIZ.length - 1;

  function grade(alternatives: string[]) {
    const clean = alternatives.map(a => a.trim()).filter(Boolean);
    if (!clean.length) { setError(speechErrorMessage("no-speech")); return; }
    const ok = acceptOral(q, clean);
    setResults(r => ({...r, [q.id]: {heard: clean[0], ok: ok || !!r[q.id]?.ok}}));
    setError("");
  }

  function speak() {
    if (listening) { rec.current?.stop(); return; }
    const {recognition, error: e} = prepareSpeechRecognition("en-GB");
    if (!recognition) { setError(e || speechErrorMessage("unsupported")); return; }
    rec.current = recognition; setError("");
    recognition.onstart = () => setListening(true);
    recognition.onresult = (event: any) => {
      const list = event.results?.[0]; const alts: string[] = [];
      for (let i = 0; list && i < list.length; i++) alts.push(String(list[i]?.transcript || ""));
      grade(alts);
    };
    recognition.onerror = (event: any) => { if (event?.error !== "aborted") setError(speechErrorMessage(event?.error)); };
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  }

  function next() {
    cancelSpeechRecognition(); setListening(false); setError(""); setTyped("");
    if (last) onDone(score); else setIndex(i => i + 1);
  }

  return (
    <div className="oq">
      <div className="oq-top"><span>QUESTION {index + 1} / {ORAL_QUIZ.length}</span><span>{score} ✓</span></div>
      <i className="oq-bar"><em style={{width: `${((index + (result ? 1 : 0)) / ORAL_QUIZ.length) * 100}%`}}/></i>
      <p className="oq-tag">{q.step ? `Étape ${q.step} du guide` : "Quand vous n’avez pas compris"}</p>
      <h2>{q.situation}</h2>
      <p className="oq-hint">Dites votre réponse <b>à voix haute, en anglais</b>.</p>

      {voice ? (
        <button type="button" className={`oq-mic ${listening ? "on" : ""}`} onClick={speak} aria-pressed={listening}>
          <b aria-hidden="true">🎙</b>{listening ? "JE VOUS ÉCOUTE… (TOUCHER POUR ARRÊTER)" : result ? "RÉESSAYER À VOIX HAUTE" : "RÉPONDRE À VOIX HAUTE"}
        </button>
      ) : (
        <form className="oq-type" onSubmit={e => { e.preventDefault(); grade([typed]); }}>
          <input value={typed} onChange={e => setTyped(e.target.value)} placeholder="La reconnaissance vocale n’est pas disponible : écrivez votre phrase" lang="en" aria-label="Votre réponse en anglais"/>
          <button type="submit">VÉRIFIER</button>
        </form>
      )}
      {error && <p className="oq-error" role="alert">{error}</p>}

      {result && (
        <div className={`oq-result ${result.ok ? "ok" : "ko"}`} role="status">
          <strong>{result.ok ? "✓ Bien dit !" : "✗ Pas tout à fait"}</strong>
          <p>Vous avez dit : <i lang="en">« {result.heard} »</i></p>
          <p>Phrase du guide : <b lang="en">“{q.model}”</b></p>
          {!result.ok && <p className="oq-retry">Réessayez en vous aidant de la phrase du guide, ou passez à la suite.</p>}
        </div>
      )}

      <div className="oq-actions">
        {!result && <button type="button" className="oq-skip" onClick={() => setResults(r => ({...r, [q.id]: {heard: "(passé)", ok: false}}))}>JE NE SAIS PAS, VOIR LA RÉPONSE</button>}
        {result && <button type="button" className="vm-primary" onClick={next}>{last ? "VOIR MON RÉSULTAT →" : "QUESTION SUIVANTE →"}</button>}
      </div>
    </div>
  );
}
