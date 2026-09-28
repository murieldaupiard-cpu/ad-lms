"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "./quiz.css";
import { REQUIRED_PLAYERS, type SessionPlayer, type SessionStatus } from "@/lib/quiz-sessions";
import { AvatarBuilder, DEFAULT_AVATAR, GladiatorAvatar } from "./GladiatorAvatar";
import { buildShuffledQuestions, QUESTION_BANK, type Question } from "@/lib/quiz-questions";

export type QuizArenaProps = {
  bank?: Question[];
  title?: string;
  homeHref?: string;
  joinPath?: string;
  eyebrow?: string;
  headline?: string[];
};
import PlayerGame, { FunMusicButton } from "./PlayerGame";

// ---------------------------------------------------------------------------
// CADGA Quiz Arena — moteur de quiz partagé (Day 2 · Module 01, Day 3 · Module 01)
//
// Questions chronométrées à choix unique ou multiple, points pondérés par la
// vitesse, classement en direct — plus une couche CADGA de jokers, un bouclier
// et des gages légers pour animer la salle.
//
// La banque de questions est passée en prop. L'ordre des questions ET celui
// des réponses sont retirés au sort à chaque nouvelle partie.
// ---------------------------------------------------------------------------

const BOTS = [
  { name: "Alexandre", avatar: "crest:#ae7242:#457b9d" },
  { name: "Léa", avatar: "laurel:#edb98a:#9b5de5" },
  { name: "Karim", avatar: "mohawk:#8d5524:#06d6a0" },
];
const GAGES = [
  "Épelle ton prénom en anglais, à voix haute, en moins de 10 secondes !",
  "Donne l'heure qu'il est maintenant, en anglais, de deux façons différentes.",
  "Mime le dernier mot que tu as raté, sans parler — les autres devinent.",
  "Dis la date d'aujourd'hui en anglais, façon britannique (“the...of...”).",
];
const GAGE_CHECKPOINT_EVERY = 8;

type Player = { id: string; name: string; avatar: string; score: number; isMe?: boolean; lastCorrect?: boolean };
type Screen = "landing" | "avatar" | "player" | "lobby" | "question" | "reveal" | "gage" | "board" | "end";
type Mode = "live" | "solo";
type JokerKind = "5050" | "skip" | "double";

export default function QuizArena({
  bank = QUESTION_BANK,
  title = "L'Arène CADGA",
  homeHref = "/day2",
  joinPath = "/day2/quiz/join",
  eyebrow = "Day 02 · Module 01",
  headline = ["Nombres, symboles,", "heures et dates."],
}: QuizArenaProps) {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("landing");
  const [mode, setMode] = useState<Mode>("solo");
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [name, setName] = useState("Toi");
  const [players, setPlayers] = useState<Player[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [shield, setShield] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [picks, setPicks] = useState<number[]>([]);
  const [removedOpts, setRemovedOpts] = useState<number[]>([]);
  const [jokers, setJokers] = useState<Record<JokerKind, boolean>>({ "5050": true, skip: true, double: true });
  const [doubleArmed, setDoubleArmed] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; pts: number } | null>(null);
  const [review, setReview] = useState<{ question: string; correct: boolean | null }[]>([]);
  const [gageTarget, setGageTarget] = useState<Player | null>(null);
  const [gageText, setGageText] = useState("");
  const [pin, setPin] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Holds this playthrough's shuffled question order + shuffled answer order.
  // A ref (not state) so every handler always reads the exact same list that
  // was drawn when the game started, synchronously, without waiting on a render.
  const questionsRef = useRef<Question[]>(bank);
  const q = questionsRef.current[qIndex];
  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };
  useEffect(() => clearTimer, []);

  async function startGame(chosenMode: Mode) {
    questionsRef.current = buildShuffledQuestions(bank);
    const me: Player = { id: "me", name, avatar, score: 0, isMe: true };
    setMode(chosenMode);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setShield(false);
    setReview([]);
    setJokers({ "5050": true, skip: true, double: true });
    setDoubleArmed(false);

    if (chosenMode === "live") {
      setPin(null);
      try {
        const matchRes = await fetch("/api/quiz-session/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, avatar }),
        });
        const matched = await matchRes.json();
        if (!matchRes.ok) throw new Error(matched.error ?? "match_failed");
        setPin(matched.session.pin);
        setPlayerId(matched.player.id);
        setScreen("player");
      } catch {
        setScreen("landing");
      }
      return;
    }

    setPlayers([me]);
    runQuestion(0);
  }

  function onLobbyReady(roster: Player[]) {
    setPlayers(roster);
    if (pin) fetch(`/api/quiz-session/${pin}/start`, { method: "POST" }).catch(() => {});
    runQuestion(0);
  }

  function runQuestion(index: number) {
    setQIndex(index);
    setAnswered(false);
    setPicks([]);
    setRemovedOpts([]);
    setFeedback(null);
    setTimeLeft(0);
    setScreen("question");
  }

  function useJoker(kind: JokerKind) {
    if (!jokers[kind] || answered) return;
    setJokers((j) => ({ ...j, [kind]: false }));
    if (kind === "5050") {
      const correctIdx = Array.isArray(q.correct) ? q.correct : [q.correct];
      const wrong = q.options.map((_, i) => i).filter((i) => !correctIdx.includes(i));
      setRemovedOpts(wrong.sort(() => Math.random() - 0.5).slice(0, 2));
    } else if (kind === "skip") {
      clearTimer();
      setReview((r) => [...r, { question: q.prompt, correct: null }]);
      setAnswered(true);
      advance();
    } else if (kind === "double") {
      setDoubleArmed(true);
    }
  }

  function toggleMulti(i: number) {
    if (answered || removedOpts.includes(i)) return;
    setPicks((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  }

  const lockIn = useCallback(
    (pick: number | number[] | null) => {
      if (answered) return;
      setAnswered(true);
      clearTimer();

      let correct: boolean;
      if (q.type === "multi") {
        const picked = Array.isArray(pick) ? pick : [];
        const correctSet = (q.correct as number[]).slice().sort().join(",");
        correct = picked.length > 0 && picked.slice().sort().join(",") === correctSet;
      } else {
        correct = pick === q.correct;
      }

      let pts = 0;
      let newStreak = streak;
      let earnedShield = shield;
      if (correct) {
        pts = 1000 + streak * 40;
        if (doubleArmed) pts *= 2;
        newStreak = streak + 1;
        if (newStreak % 3 === 0 && !shield) earnedShield = true;
      } else {
        newStreak = 0;
      }

      setDoubleArmed(false);
      setStreak(newStreak);
      setBestStreak((b) => Math.max(b, newStreak));
      setShield(earnedShield);
      setScore((s) => s + pts);
      setFeedback({ correct, pts });
      setReview((r) => [...r, { question: q.prompt, correct }]);

      if (mode === "live") {
        setPlayers((ps) =>
          ps.map((p) => {
            if (p.isMe) return { ...p, score: p.score + pts, lastCorrect: correct };
            const botCorrect = Math.random() < 0.6;
            return { ...p, score: p.score + (botCorrect ? Math.round(150 + 750 * Math.random()) : 0), lastCorrect: botCorrect };
          })
        );
      }

      setTimeout(advance, 1200);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [answered, q, streak, shield, timeLeft, doubleArmed, mode]
  );

  function advance() {
    const next = qIndex + 1;
    if (mode === "solo") {
      if (next >= questionsRef.current.length) return finish();
      return runQuestion(next);
    }
    setQIndex(next);
    setScreen("reveal");
  }

  function afterReveal() {
    if (qIndex >= questionsRef.current.length) return finish();
    if (qIndex > 0 && qIndex % GAGE_CHECKPOINT_EVERY === 0) return showGage();
    setScreen("board");
  }

  function showGage() {
    const sorted = [...players].sort((a, b) => b.score - a.score);
    const last = sorted[sorted.length - 1];
    setGageTarget(last);
    if (last.isMe && shield) {
      setShield(false);
      setGageText("🛡️ Bouclier activé — gage évité !");
    } else {
      setGageText(GAGES[Math.floor(Math.random() * GAGES.length)]);
    }
    setScreen("gage");
  }

  function finish() {
    setScreen("end");
  }

  function reset() {
    clearTimer();
    setScreen("landing");
  }

  const CIRC = 113;
  const ratio = q ? Math.max(0, timeLeft / q.time) : 0;

  return (
    <main className="qz-page">
      <div className="qz-stage">
        <div className="qz-topbar">
          <div className="qz-brand">
            <span>A</span>
            <div>{title}</div>
          </div>
          <button className="qz-exit" onClick={() => router.push(homeHref)}>
            EXIT
          </button>
        </div>

        <div className="qz-body">
          {screen === "landing" && (
            <div className="qz-view qz-landing">
              <div className="qz-eyebrow">{eyebrow}</div>
              <h1>
                {headline.map((line, i) => (
                  <span key={line}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </h1>
              <p className="qz-lede">Chrono, points à la vitesse, classement en direct — plus jokers, boucliers et gages.</p>
              <div className="qz-mode-grid">
                <button
                  className="qz-mode-card"
                  onClick={() => {
                    setMode("solo");
                    setScreen("avatar");
                  }}
                >
                  <span className="qz-tag qz-tag-solo">Mode solo</span>
                  <div className="qz-mode-name">Jouer seul</div>
                  <div className="qz-mode-desc">Entraîne-toi immédiatement, sans Game PIN.</div>
                </button>
                <button className="qz-mode-card" onClick={() => { setMode("live"); setScreen("avatar"); }}>
                  <span className="qz-tag qz-tag-live">Mode classe · 2 apprenants</span>
                  <div className="qz-mode-name">Jouer avec ma classe</div>
                  <div className="qz-mode-desc">Deux apprenants jouent simultanément, chacun sur son PC.</div>
                </button>
              </div>
            </div>
          )}

          {screen === "avatar" && (
            <div className="qz-view qz-center">
              <div className="qz-eyebrow">Avant de commencer</div>
              <h2>Crée ton gladiateur</h2>
              <AvatarBuilder value={avatar} onChange={setAvatar} />
              <input className="qz-name-input" value={name} maxLength={12} onChange={(e) => setName(e.target.value)} />
              <button className="qz-primary" onClick={() => startGame(mode)}>
                C&apos;est parti →
              </button>
            </div>
          )}

          {screen === "player" && pin && playerId && <PlayerGame pin={pin} playerId={playerId} name={name} avatar={avatar} />}

          {screen === "question" && q && (
            <div className="qz-view qz-question">
              <div className="qz-qhead">
                <div>
                  <span className="qz-progress">
                    QUESTION {qIndex + 1}/{questionsRef.current.length}
                  </span>
                  <span className="qz-type">{q.type === "multi" ? "Sélection multiple" : "Choix multiple"}</span>
                </div>

                <div className="qz-status">
                  {streak > 0 && <span className="qz-streak">🔥 {streak}</span>}
                  {shield && <span className="qz-shield">🛡️</span>}
                  <span className="qz-score">{score} pts</span>
                </div>
              </div>

              <div className="qz-jokers qz-jokers-featured">
                <button className="qz-joker" disabled={!jokers["5050"] || q.type !== "single"} onClick={() => useJoker("5050")}>
                  🎯 50/50
                </button>
                <button className="qz-joker" disabled={!jokers.skip} onClick={() => useJoker("skip")}>
                  ⏭️ Passe
                </button>
                <button className={`qz-joker ${doubleArmed ? "active" : ""}`} disabled={!jokers.double} onClick={() => useJoker("double")}>
                  ⚡ Double
                </button>
                <FunMusicButton />
              </div>

              <div className="qz-card">
                <div className="qz-qtext">{q.prompt}</div>
                <div className="qz-qhint">{q.type === "multi" ? "Sélectionne toutes les bonnes réponses puis valide." : "Une seule bonne réponse."}</div>
              </div>

              <div className="qz-answers">
                {q.options.map((opt, i) => {
                  const removed = removedOpts.includes(i);
                  const picked = picks.includes(i);
                  const correctIdx = Array.isArray(q.correct) ? q.correct : [q.correct];
                  const showCorrect = answered && correctIdx.includes(i);
                  const showWrong = answered && !correctIdx.includes(i) && picks.includes(i);
                  return (
                    <button
                      key={i}
                      className={`qz-answer qz-tile-${i} ${picked ? "picked" : ""} ${showCorrect ? "correct" : ""} ${showWrong ? "wrong" : ""}`}
                      style={{ visibility: removed ? "hidden" : "visible" }}
                      disabled={answered || removed}
                      onClick={() => (q.type === "multi" ? toggleMulti(i) : lockIn(i))}
                    >
                      <span className="qz-shape" />
                      <span>{opt}</span>
                      {q.type === "multi" && <span className={`qz-check ${picked ? "on" : ""}`} />}
                    </button>
                  );
                })}
              </div>

              {q.type === "multi" && !answered && (
                <button className="qz-primary qz-submit" disabled={picks.length === 0} onClick={() => lockIn(picks)}>
                  Valider
                </button>
              )}

              {feedback && (
                <div className={`qz-feedback ${feedback.correct ? "good" : "bad"}`}>{feedback.correct ? `+${feedback.pts} pts` : "Raté !"}</div>
              )}
            </div>
          )}

          {screen === "reveal" && <Reveal question={questionsRef.current[qIndex - 1]} players={players} onNext={afterReveal} />}

          {screen === "gage" && gageTarget && (
            <div className="qz-view qz-center">
              <div className="qz-gage-card">
                <div className="qz-eyebrow">Gage</div>
                <div className="qz-gage-target">
                  <GladiatorAvatar code={gageTarget.avatar} size={32} />
                  {gageTarget.name}
                  {gageTarget.isMe ? " (toi)" : ""}
                </div>
                <div className="qz-gage-text">{gageText}</div>
              </div>
              <button className="qz-primary" onClick={() => setScreen("board")}>
                Classement →
              </button>
            </div>
          )}

          {screen === "board" && (
            <div className="qz-view qz-center">
              <h2>Classement — après la question {qIndex}</h2>
              <div className="qz-board-list">
                {[...players]
                  .sort((a, b) => b.score - a.score)
                  .map((p, idx) => (
                    <div key={p.id} className={`qz-board-row ${p.isMe ? "me" : ""}`}>
                      <span className="qz-rank">#{idx + 1}</span>
                      <span className="qz-board-avatar">
                        <GladiatorAvatar code={p.avatar} size={26} />
                      </span>
                      <span className="qz-board-name">
                        {p.name}
                        {p.isMe ? " (toi)" : ""} {p.isMe && shield ? "🛡️" : ""}
                      </span>
                      <span className="qz-board-score">{p.score} pts</span>
                    </div>
                  ))}
              </div>
              <button className="qz-primary" onClick={() => runQuestion(qIndex)}>
                Question suivante →
              </button>
            </div>
          )}

          {screen === "end" && (
            <End mode={mode} players={players} score={score} bestStreak={bestStreak} review={review} onReplay={reset} />
          )}
        </div>
      </div>
    </main>
  );
}

// Live lobby: creates/shows a QR code + PIN, polls the session for learners
// who join from their own phone, displays them in a roster table, and — once
// REQUIRED_PLAYERS have connected — runs a 3-2-1 countdown before starting.
function Lobby({
  pin,
  hostPlayer,
  onReady,
  joinPath = "/day2/quiz/join",
}: {
  pin: string | null;
  hostPlayer: Player;
  onReady: (players: Player[]) => void;
  joinPath?: string;
}) {
  const [joined, setJoined] = useState<SessionPlayer[]>([]);
  const [status, setStatus] = useState<SessionStatus>("waiting");
  const [n, setN] = useState(3);
  const countingDown = status !== "waiting";
  const readyFired = useRef(false);

  useEffect(() => {
    if (!pin) return;
    let stopped = false;
    const poll = async () => {
      try {
        const res = await fetch(`/api/quiz-session/${pin}`, { cache: "no-store" });
        if (!res.ok || stopped) return;
        const data = await res.json();
        setJoined(data.players ?? []);
        setStatus(data.status ?? "waiting");
      } catch {
        // transient network hiccup — the next tick retries
      }
    };
    poll();
    const t = setInterval(poll, 1500);
    return () => {
      stopped = true;
      clearInterval(t);
    };
  }, [pin]);

  useEffect(() => {
    if (!countingDown) return;
    if (n <= 0) {
      if (readyFired.current) return;
      readyFired.current = true;
      const roster: Player[] = [hostPlayer, ...joined.map((p) => ({ id: p.id, name: p.name, avatar: p.avatar, score: 0 }))];
      onReady(roster);
      return;
    }
    const t = setTimeout(() => setN((x) => x - 1), 800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countingDown, n]);

  const joinUrl = pin && typeof window !== "undefined" ? `${window.location.origin}${joinPath}?pin=${pin}` : "";
  const qrSrc = joinUrl ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(joinUrl)}` : "";

  return (
    <div className="qz-view qz-center">
      <div className="qz-eyebrow">Partie en direct</div>

      {!pin && <p className="qz-lede">Création de la partie…</p>}

      {pin && (
        <>
          <div className="qz-pin">
            GAME PIN · {pin.slice(0, 3)} {pin.slice(3)}
          </div>

          {!countingDown && (
            <>
              <div className="qz-join-box">
                {qrSrc && <img className="qz-qr" src={qrSrc} alt="QR code pour rejoindre le quiz" width={180} height={180} />}
                <div className="qz-join-hint">
                  Scanne ce QR code ou va sur <b>{joinPath}</b>
                  <br />
                  et entre le PIN <b>{pin}</b>
                </div>
              </div>
              <div className="qz-roster-status">
                {joined.length}/{REQUIRED_PLAYERS} apprenants connectés
              </div>
            </>
          )}

          <div className="qz-roster">
            {Array.from({ length: REQUIRED_PLAYERS }).map((_, i) => {
              const p = joined[i];
              return (
                <div key={i} className={`qz-roster-row ${p ? "filled" : "empty"}`}>
                  <span className="qz-roster-avatar">{p ? <GladiatorAvatar code={p.avatar} size={26} /> : "…"}</span>
                  <span className="qz-roster-name">{p ? p.name : "En attente d'un apprenant…"}</span>
                  <span className="qz-roster-state">{p ? "✅" : "⏳"}</span>
                </div>
              );
            })}
          </div>

          <div className="qz-players-row">
            <div className="qz-player-chip host">
              <span className="qz-chip-avatar">
                <GladiatorAvatar code={hostPlayer.avatar} size={20} />
              </span>
              {hostPlayer.name} (toi)
            </div>
          </div>

          {countingDown && <div className="qz-countdown">{n > 0 ? n : ""}</div>}
        </>
      )}
    </div>
  );
}

function Reveal({ question, players, onNext }: { question: Question; players: Player[]; onNext: () => void }) {
  if (!question) return null;
  const correctIdx = Array.isArray(question.correct) ? question.correct : [question.correct];
  const total = players.length || 1;
  return (
    <div className="qz-view qz-center">
      <h2>Ce que la classe a répondu</h2>
      <div className="qz-dist">
        {question.options.map((opt, i) => {
          const isCorrect = correctIdx.includes(i);
          let count = 0;
          players.forEach((p) => {
            if (isCorrect && p.lastCorrect) count++;
            if (!isCorrect && !p.lastCorrect && Math.random() < 0.5) count++;
          });
          const pct = Math.min(100, Math.round((count / total) * 100));
          return (
            <div key={i} className="qz-dist-row">
              <div className="qz-dist-label">{opt}</div>
              <div className="qz-dist-track">
                <div className={`qz-dist-fill ${isCorrect ? "correct" : ""}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="qz-dist-pct">{pct}%</div>
            </div>
          );
        })}
      </div>
      <button className="qz-primary" onClick={onNext}>
        Continuer →
      </button>
    </div>
  );
}

function End({
  mode,
  players,
  score,
  bestStreak,
  review,
  onReplay,
}: {
  mode: Mode;
  players: Player[];
  score: number;
  bestStreak: number;
  review: { question: string; correct: boolean | null }[];
  onReplay: () => void;
}) {
  if (mode === "live") {
    const top3 = [...players].sort((a, b) => b.score - a.score).slice(0, 3);
    const order = [top3[1], top3[0], top3[2]].filter(Boolean);
    const ranks = [2, 1, 3];
    return (
      <div className="qz-view qz-center">
        <div className="qz-eyebrow">C&apos;est fini !</div>
        <h2>Résultats de la partie</h2>
        <div className="qz-podium">
          {order.map((p, idx) => (
            <div key={p.id} className={`qz-podium-col qz-p${idx}`}>
              <div className="qz-podium-avatar">
                <GladiatorAvatar code={p.avatar} size={56} />
              </div>
              <div className="qz-podium-name">
                {p.name}
                {p.isMe ? " (toi)" : ""}
              </div>
              <div className="qz-podium-score">{p.score} pts</div>
              <div className="qz-podium-bar">
                <span>{ranks[idx]}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="qz-primary" onClick={onReplay}>
          Rejouer
        </button>
      </div>
    );
  }

  const answered = review.filter((r) => r.correct !== null);
  const ok = answered.filter((r) => r.correct).length;
  const rate = answered.length ? Math.round((ok / answered.length) * 100) : 0;

  return (
    <div className="qz-view qz-center">
      <div className="qz-eyebrow">Quiz terminé</div>
      <h2>Tes résultats</h2>
      <div className="qz-stats">
        <div className="qz-stat">
          <div className="qz-stat-num">{score}</div>
          <div className="qz-stat-label">Points</div>
        </div>
        <div className="qz-stat">
          <div className="qz-stat-num">{rate}%</div>
          <div className="qz-stat-label">Taux de réussite</div>
        </div>
        <div className="qz-stat">
          <div className="qz-stat-num">{bestStreak}</div>
          <div className="qz-stat-label">Meilleure série</div>
        </div>
      </div>
      <div className="qz-review">
        {review.map((r, i) => (
          <div key={i} className="qz-review-row">
            <span className={`qz-dot ${r.correct === null ? "sk" : r.correct ? "ok" : "no"}`} />
            <span>
              {r.question} {r.correct === null ? "(passée)" : ""}
            </span>
          </div>
        ))}
      </div>
      <button className="qz-primary" onClick={onReplay}>
        Rejouer
      </button>
    </div>
  );
}
