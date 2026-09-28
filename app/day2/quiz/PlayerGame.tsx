"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { buildShuffledQuestions, type Question } from "@/lib/quiz-questions";
import { GladiatorAvatar } from "./GladiatorAvatar";

type SessionPlayer = { id: string; name: string; avatar: string; score: number; finished: boolean; shielded: boolean; notice?: string; noticeAt?: number };
type QuizReaction = { id: string; playerId: string; playerName: string; content: string; createdAt: number };
type Session = { status: "waiting" | "starting" | "started"; requiredPlayers: number; players: SessionPlayer[]; reactions?: QuizReaction[] };



function ConfettiBurst() {
  const colors = ["#ffd369", "#ff5c8a", "#51e5ff", "#8dff8a", "#a98bff", "#ffffff"];
  return <div className="qz-confetti" aria-hidden="true">
    {Array.from({ length: 54 }, (_, index) => <i key={index} style={{
      "--confetti-x": `${(index * 37) % 100}%`,
      "--confetti-delay": `${(index % 9) * 0.045}s`,
      "--confetti-drift": `${((index * 23) % 180) - 90}px`,
      background: colors[index % colors.length],
    } as CSSProperties} />)}
  </div>;
}

function useGameSounds() {
  const contextRef = useRef<AudioContext | null>(null);

  const context = () => {
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audio = contextRef.current ?? new AudioCtx();
    contextRef.current = audio;
    void audio.resume();
    return audio;
  };

  const tone = (frequency: number, duration: number, type: OscillatorType, volume: number, delay = 0) => {
    const audio = context();
    const start = audio.currentTime + delay;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  };

  const select = () => {
    tone(520, 0.07, "sine", 0.045);
    tone(700, 0.06, "sine", 0.025, 0.04);
  };
  const correct = () => {
    tone(523.25, 0.18, "triangle", 0.06, 0.06);
    tone(659.25, 0.18, "triangle", 0.06, 0.15);
    tone(783.99, 0.28, "triangle", 0.07, 0.24);
  };
  const wrong = () => {
    tone(185, 0.18, "sawtooth", 0.045, 0.06);
    tone(138.59, 0.34, "sawtooth", 0.04, 0.19);
  };
  const fifty = () => {
    [740, 590, 460, 350].forEach((frequency, index) => tone(frequency, 0.13, "sine", 0.045, index * 0.055));
  };
  const strike = () => {
    tone(110, 0.12, "sawtooth", 0.065);
    tone(82.41, 0.28, "square", 0.06, 0.1);
    tone(55, 0.42, "sawtooth", 0.045, 0.2);
  };
  const shield = () => {
    tone(392, 0.18, "sine", 0.05);
    tone(587.33, 0.28, "triangle", 0.055, 0.1);
    tone(783.99, 0.38, "sine", 0.045, 0.22);
  };
  const double = () => {
    tone(220, 0.16, "square", 0.04);
    tone(440, 0.22, "square", 0.045, 0.1);
    tone(880, 0.34, "triangle", 0.06, 0.22);
  };

  useEffect(() => () => {
    void contextRef.current?.close();
  }, []);

  return { select, correct, wrong, fifty, strike, shield, double };
}

function useFunMusic() {
  const contextRef = useRef<AudioContext | null>(null);
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playing, setPlaying] = useState(false);

  const playBar = () => {
    const context = contextRef.current;
    if (!context) return;
    const notes = [261.63, 329.63, 392, 523.25, 392, 440, 329.63, 392];
    const start = context.currentTime;
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index % 2 ? "triangle" : "square";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start + index * 0.24);
      gain.gain.exponentialRampToValueAtTime(0.035, start + index * 0.24 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + index * 0.24 + 0.2);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start + index * 0.24);
      oscillator.stop(start + index * 0.24 + 0.22);
    });
  };

  const start = () => {
    if (playing) return;
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    contextRef.current = contextRef.current ?? new AudioCtx();
    contextRef.current.resume();
    playBar();
    loopRef.current = setInterval(playBar, 1920);
    setPlaying(true);
  };

  const stop = () => {
    if (loopRef.current) clearInterval(loopRef.current);
    loopRef.current = null;
    contextRef.current?.suspend();
    setPlaying(false);
  };

  useEffect(() => () => {
    if (loopRef.current) clearInterval(loopRef.current);
    contextRef.current?.close();
  }, []);

  return { playing, start, stop };
}

export function FunMusicButton() {
  const music = useFunMusic();
  return <button className="qz-music-joker" onClick={music.playing ? music.stop : music.start}>
    <b>{music.playing ? "♫ MUSIQUE ON" : "♪ MUSIQUE"}</b>
    <span>{music.playing ? "Couper le son" : "Lancer la musique fun"}</span>
  </button>;
}

export default function PlayerGame({ pin, playerId, name, avatar }: { pin: string; playerId: string; name: string; avatar: string }) {
  const [session, setSession] = useState<Session | null>(null);
  const [questions] = useState(() => buildShuffledQuestions());
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [jokers, setJokers] = useState({ fifty: true, double: true });
  const [powerMomentsUsed, setPowerMomentsUsed] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState<Question[]>([]);
  const [redemptionQueue, setRedemptionQueue] = useState<Question[]>([]);
  const [redemptionIndex, setRedemptionIndex] = useState(0);
  const [inRedemption, setInRedemption] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const celebratedRef = useRef(false);
  const [hidden, setHidden] = useState<number[]>([]);
  const [double, setDouble] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [review, setReview] = useState<Array<{ prompt: string; options: string[]; picked: number[]; correct: number[] }>>([]);
  const music = useFunMusic();
  const sounds = useGameSounds();
  const question = inRedemption ? redemptionQueue[redemptionIndex] : questions[index];
  const powerMoment = !inRedemption && session?.players.length === 2 && (index === 9 || index === 19) && !powerMomentsUsed.includes(index);

  useEffect(() => {
    const poll = async () => {
      const response = await fetch(`/api/quiz-session/${pin}`, { cache: "no-store" });
      if (response.ok) {
        const data = await response.json() as Session;
        setSession(data);
        const me = data.players.find((player) => player.id === playerId);
        if (me) setScore(me.score);
        if (data.players.length === 2 && data.players.every((player) => player.finished) && !celebratedRef.current) {
          celebratedRef.current = true;
          setShowConfetti(true);
          window.setTimeout(() => setShowConfetti(false), 3600);
        }
      }
    };
    poll();
    const timer = setInterval(poll, 1200);
    return () => clearInterval(timer);
  }, [pin]);

  const answer = (choice: number | number[]) => {
    if (locked || !question) return;
    if (!music.playing) music.start();
    const picks = Array.isArray(choice) ? choice : [choice];
    const expected = (Array.isArray(question.correct) ? question.correct : [question.correct]).slice().sort().join(",");
    const correct = picks.slice().sort().join(",") === expected;
    sounds.select();
    window.setTimeout(correct ? sounds.correct : sounds.wrong, 90);
    const earned = correct ? (inRedemption ? 500 : (double ? 2000 : 1000) + streak * 50) : 0;
    const nextScore = score + earned;
    setScore(nextScore);
    setStreak(correct ? streak + 1 : 0);
    setSelected(picks);
    setReview((items) => [...items, { prompt: `${inRedemption ? "Rattrapage · " : ""}${question.prompt}`, options: question.options, picked: picks, correct: (Array.isArray(question.correct) ? question.correct : [question.correct]) }]);
    if (!correct && !inRedemption) setMistakes((items) => [...items, question]);
    fetch(`/api/quiz-session/${pin}/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, delta: earned, finished: false }),
    }).catch(() => {});
    setLocked(true);
    setDouble(false);
  };

  const finishGame = async () => {
    await fetch(`/api/quiz-session/${pin}/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, delta: 0, finished: true }),
    });
    music.stop();
    setFinished(true);
  };

  const next = async () => {
    if (inRedemption) {
      if (redemptionIndex < redemptionQueue.length - 1) {
        setRedemptionIndex((value) => value + 1);
        setSelected([]);
        setHidden([]);
        setLocked(false);
      } else {
        await finishGame();
      }
      return;
    }
    if (index < questions.length - 1) {
      setIndex((value) => value + 1);
      setSelected([]);
      setHidden([]);
      setLocked(false);
      return;
    }
    const retries = mistakes.slice(0, 2);
    if (retries.length) {
      setRedemptionQueue(retries);
      setRedemptionIndex(0);
      setInRedemption(true);
      setSelected([]);
      setHidden([]);
      setLocked(false);
    } else {
      await finishGame();
    }
  };

  const useFifty = () => {
    if (!jokers.fifty || question.type !== "single" || locked) return;
    const correct = question.correct as number;
    sounds.fifty();
    setHidden(question.options.map((_, i) => i).filter((i) => i !== correct).slice(0, 2));
    setJokers((value) => ({ ...value, fifty: false }));
  };
  const usePower = async (power: "strike" | "shield") => {
    if (!powerMoment || locked) return;
    power === "strike" ? sounds.strike() : sounds.shield();
    setPowerMomentsUsed((items) => [...items, index]);
    const response = await fetch(`/api/quiz-session/${pin}/power`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, power }),
    });
    if (response.ok) {
      const data = await response.json() as Session;
      setSession(data);
      const me = data.players.find((player) => player.id === playerId);
      if (me) setScore(me.score);
    }
  };
  const useDouble = () => {
    if (!jokers.double || locked) return;
    sounds.double();
    setDouble(true);
    setJokers((value) => ({ ...value, double: false }));
  };

  const sendPodiumReaction = async (content: string) => {
    sounds.select();
    if (["👏", "🏆", "Bravo !"].includes(content)) {
      setShowConfetti(false);
      window.setTimeout(() => setShowConfetti(true), 20);
      window.setTimeout(() => setShowConfetti(false), 2600);
    }
    const response = await fetch(`/api/quiz-session/${pin}/reaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, content }),
    });
    if (response.ok) setSession(await response.json());
  };

  if (!session || session.status === "waiting") {
    return <div className="qz-view qz-center qz-ai-lobby">
      <div className="qz-ai-orb">AI</div>
      <div className="qz-eyebrow">L’IA prépare la partie</div>
      <h2>L’IA attend les deux apprenants</h2>
      <p className="qz-lede">{session?.players.length ?? 1}/2 apprenants connectés. La partie commencera automatiquement.</p>
      <div className="qz-join-spinner" aria-hidden="true" />
    </div>;
  }

  if (finished) {
    const ranking = [...session.players].sort((a, b) => b.score - a.score);
    const allFinished = session.players.length === 2 && session.players.every((player) => player.finished);

    if (showReview) {
      return <div className="qz-view qz-player-review">
        <div className="qz-review-title"><div><span className="qz-eyebrow">Correction complète</span><h2>Revoir mes réponses</h2></div><button className="qz-primary" onClick={() => setShowReview(false)}>RETOUR AU PODIUM</button></div>
        <div className="qz-review-cards">
          {review.map((item, questionIndex) => {
            const ok = item.picked.slice().sort().join(",") === item.correct.slice().sort().join(",");
            return <article key={questionIndex} className={ok ? "good" : "bad"}>
              <span>QUESTION {questionIndex + 1}</span><h3>{item.prompt}</h3>
              <p><b>Ta réponse :</b> {item.picked.length ? item.picked.map((i) => item.options[i]).join(" · ") : "Question passée"}</p>
              <p><b>Bonne réponse :</b> {item.correct.map((i) => item.options[i]).join(" · ")}</p>
            </article>;
          })}
        </div>
      </div>;
    }

    return <div className="qz-view qz-center">
      {showConfetti && <ConfettiBurst />}
      <div className="qz-eyebrow">{allFinished ? "Podium final" : "Classement en direct"}</div>
      <h2>{allFinished ? "Les deux apprenants ont terminé !" : "L’IA attend l’autre apprenant…"}</h2>
      {allFinished ? <div className="qz-two-podium">
        {ranking.map((player, rank) => <div className={rank === 0 ? "winner" : "runner-up"} key={player.id}>
          <span className="qz-podium-place">{rank + 1}</span>
          <GladiatorAvatar code={player.avatar} size={64} />
          <h3>{player.name}</h3><b>{player.score} pts</b>
        </div>)}
      </div> : <div className="qz-board-list">
        {ranking.map((player, rank) => <div className="qz-board-row" key={player.id}>
          <span className="qz-rank">#{rank + 1}</span>
          <GladiatorAvatar code={player.avatar} size={28} />
          <span className="qz-board-name">{player.name}</span>
          <span className="qz-board-score">{player.finished ? `${player.score} pts · terminé` : `${player.score} pts · en jeu`}</span>
        </div>)}
      </div>}
      {allFinished && <section className="qz-podium-chat">
        <h3>CÉLÉBREZ ENSEMBLE</h3>
        <div className="qz-reaction-feed" aria-live="polite">
          {(session.reactions ?? []).slice(-5).map((reaction) => <div key={reaction.id} className={reaction.playerId === playerId ? "mine" : ""}>
            <b>{reaction.playerName}</b><span>{reaction.content}</span>
          </div>)}
        </div>
        <div className="qz-emoji-row">
          {["👏", "🔥", "🏆", "😂", "💪"].map((emoji) => <button key={emoji} onClick={() => sendPodiumReaction(emoji)} aria-label={`Envoyer ${emoji}`}>{emoji}</button>)}
        </div>
        <div className="qz-premade-row">
          {["Bravo !", "Bien joué !", "Belle partie !", "Revanche ?"].map((message) => <button key={message} onClick={() => sendPodiumReaction(message)}>{message}</button>)}
        </div>
      </section>}
      <button className="qz-primary qz-review-button" onClick={() => setShowReview(true)}>CONSULTER MES RÉPONSES</button>
    </div>;
  }

  const correct = Array.isArray(question.correct) ? question.correct : [question.correct];
  return <div className="qz-view qz-question qz-player-game">
    <div className="qz-player-toolbar">
      <div className="qz-player-identity"><GladiatorAvatar code={avatar} size={28} /><b>{name}</b></div>
      <span>{inRedemption ? `RATTRAPAGE ${redemptionIndex + 1}/${redemptionQueue.length}` : `QUESTION ${index + 1}/${questions.length}`}</span>
      <strong>{score} PTS</strong>
      <button onClick={music.playing ? music.stop : music.start}>{music.playing ? "♫ MUSIQUE ON" : "♪ MUSIQUE"}</button>
    </div>

    <div className="qz-jokers qz-jokers-featured">
      <button disabled={!jokers.fifty || question.type !== "single"} onClick={useFifty}><b>50/50</b><span>Retirer 2 réponses</span></button>
      {powerMoment && <button className="active" onClick={() => usePower("strike")}><b>⚡ STRIKE</b><span>Retirer 10 % à l’adversaire</span></button>}
      {powerMoment && <button className="active" onClick={() => usePower("shield")}><b>🛡 BOUCLIER</b><span>Bloquer le prochain Strike</span></button>}
      <button className={double ? "active" : ""} disabled={!jokers.double} onClick={useDouble}><b>POINTS ×2</b><span>Doubler le score</span></button>
    </div>

    {powerMoment && <div className="qz-card"><div className="qz-qtext">Choisis un pouvoir : Strike ou Bouclier.</div><div className="qz-qhint">Ce choix spécial apparaît seulement deux fois pendant la partie.</div></div>}
    {session.players.find((player) => player.id === playerId)?.notice && <div className="qz-card"><div className="qz-qhint">{session.players.find((player) => player.id === playerId)?.notice}</div></div>}
    <div className="qz-card">
      <div className="qz-qtext">{question.prompt}</div>
      <div className="qz-qhint">{question.type === "multi" ? `${correct.length} réponses attendues. Sélectionne exactement ${correct.length} réponses, puis valide.` : "1 réponse attendue. Sélectionne une seule réponse."}</div>
    </div>
    <div className="qz-answers">
      {question.options.map((option, optionIndex) => {
        const picked = selected.includes(optionIndex);
        const good = locked && correct.includes(optionIndex);
        const wrong = locked && picked && !correct.includes(optionIndex);
        return <button key={option} hidden={hidden.includes(optionIndex)} disabled={locked}
          className={`qz-answer qz-tile-${optionIndex} ${picked ? "picked" : ""} ${good ? "correct" : ""} ${wrong ? "wrong" : ""}`}
          onClick={() => question.type === "multi" ? (sounds.select(), setSelected((values) => values.includes(optionIndex) ? values.filter((v) => v !== optionIndex) : values.length < correct.length ? [...values, optionIndex] : values)) : answer(optionIndex)}>
          <span className="qz-shape" /><span>{option}</span>
        </button>;
      })}
    </div>
    {question.type === "multi" && !locked && <button className="qz-primary qz-submit" disabled={selected.length !== correct.length} onClick={() => answer(selected)}>VALIDER {selected.length}/{correct.length}</button>}
    {locked && <div className="qz-player-next"><strong>{selected.length && selected.slice().sort().join(",") === correct.slice().sort().join(",") ? "Bonne réponse !" : "Réponse enregistrée"}</strong><button className="qz-primary" onClick={next}>{inRedemption ? (redemptionIndex === redemptionQueue.length - 1 ? "TERMINER" : "RATTRAPAGE SUIVANT →") : (index === questions.length - 1 ? (mistakes.length ? "PASSER AUX RATTRAPAGES →" : "TERMINER") : "QUESTION SUIVANTE →")}</button></div>}
  </div>;
}
