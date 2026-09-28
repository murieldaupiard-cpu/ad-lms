"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import "./times-up.css";
import "./team-wheel.css";
import "./pointer-fix.css";
import "./layout-fix.css";
import "./music-controls.css";
import "./grid-fix.css";
import "./wheel-correction.css";
import "./host-fix.css";
import "./exit-button.css";
import "./action-buttons.css";

type Card = {
  word: string;
  aliases?: string[];
  kind: "CADGA" | "SURPRISE";
  description: string;
  extra: string;
  one: string;
  sketch: string[];
};
const cards: Card[] = [
  {
    word: "Customer",
    aliases: ["client"],
    kind: "CADGA",
    description: "A person who buys products or services from a company.",
    extra: "They may already have a record in the database.",
    one: "Buyer",
    sketch: ["◯", "🛍", "🏪"],
  },
  {
    word: "Prospect",
    kind: "CADGA",
    description:
      "A potential customer who has not bought from the company yet.",
    extra: "The sales team wants to convert this person.",
    one: "Potential",
    sketch: ["👤", "?", "🏪"],
  },
  {
    word: "Complaint",
    kind: "CADGA",
    description: "An expression of dissatisfaction about a product or service.",
    extra: "The customer is unhappy and expects a solution.",
    one: "Dissatisfaction",
    sketch: ["☹", "!", "📦"],
  },
  {
    word: "Delivery",
    kind: "CADGA",
    description: "The process of taking goods to a customer.",
    extra: "A vehicle usually carries a parcel to an address.",
    one: "Transport",
    sketch: ["📦", "🚚", "⌂"],
  },
  {
    word: "Order",
    kind: "CADGA",
    description: "A request to buy specific products or quantities.",
    extra: "It normally receives a unique reference number.",
    one: "Purchase",
    sketch: ["🛒", "✓", "📦"],
  },
  {
    word: "Supplier",
    kind: "CADGA",
    description:
      "A company or person that provides products to another business.",
    extra: "It sends stock to the company.",
    one: "Provides",
    sketch: ["🏭", "→", "🏪"],
  },
  {
    word: "Distributor",
    kind: "CADGA",
    description: "A business that buys products in order to sell them onward.",
    extra: "It connects the producer with a market.",
    one: "Reseller",
    sketch: ["🏭", "🚚", "🏬"],
  },
  {
    word: "Catalogue",
    kind: "CADGA",
    description:
      "A booklet or digital list showing products available for sale.",
    extra: "Customers consult it to discover a range.",
    one: "Products",
    sketch: ["📖", "🧴", "🛍"],
  },
  {
    word: "Discount",
    kind: "CADGA",
    description: "A reduction in the usual price of a product.",
    extra: "It makes the customer pay less.",
    one: "Reduction",
    sketch: ["🏷", "↓", "€"],
  },
  {
    word: "Schedule",
    kind: "CADGA",
    description: "A plan showing dates and times for activities.",
    extra: "It helps arrange a meeting.",
    one: "Planning",
    sketch: ["📅", "🕘", "✓"],
  },
  {
    word: "Inquiry",
    kind: "CADGA",
    description: "A request for information about something.",
    extra: "The caller wants details, not necessarily to complain.",
    one: "Question",
    sketch: ["?", "☎", "ℹ"],
  },
  {
    word: "Quotation",
    kind: "CADGA",
    description:
      "A formal document stating the estimated price of products or services.",
    extra: "It is sent before the customer confirms a purchase.",
    one: "Estimate",
    sketch: ["📄", "€", "✓"],
  },
  {
    word: "Deadline",
    kind: "CADGA",
    description: "The final date or time by which something must be completed.",
    extra: "Missing it means being late.",
    one: "Limit",
    sketch: ["📅", "⏳", "!"],
  },
  {
    word: "Available",
    kind: "CADGA",
    description: "Ready to be used, obtained or contacted.",
    extra: "It is the opposite of unavailable.",
    one: "Ready",
    sketch: ["✓", "📦", "🟢"],
  },
  {
    word: "Urgent",
    kind: "CADGA",
    description: "Requiring immediate attention or action.",
    extra: "It cannot wait until later.",
    one: "Immediate",
    sketch: ["!", "⏰", "⚡"],
  },
  {
    word: "Confirm",
    kind: "CADGA",
    description: "To state that information or an arrangement is correct.",
    extra: "You do this before finalising a meeting.",
    one: "Validate",
    sketch: ["?", "✓", "📅"],
  },
  {
    word: "Update",
    kind: "CADGA",
    description: "To add the newest information to a record.",
    extra: "Contact details may need this after a change.",
    one: "Refresh",
    sketch: ["📄", "↻", "✨"],
  },
  {
    word: "Forward",
    kind: "CADGA",
    description: "To send a message you received to another person.",
    extra: "An arrow moves the email to a colleague.",
    one: "Transfer",
    sketch: ["✉", "→", "👤"],
  },
  {
    word: "Meeting",
    kind: "CADGA",
    description: "An organised occasion when people discuss business together.",
    extra: "It may happen in person, online or by telephone.",
    one: "Gathering",
    sketch: ["👤", "🤝", "👤"],
  },
  {
    word: "Voicemail",
    kind: "CADGA",
    description: "A recorded spoken message left when a call is not answered.",
    extra: "You listen to it and take notes.",
    one: "Recording",
    sketch: ["☎", "🔊", "📝"],
  },
  {
    word: "Harry Potter",
    aliases: ["harrypotter"],
    kind: "SURPRISE",
    description:
      "A young wizard who studies at Hogwarts and has a lightning-shaped scar.",
    extra: "His best friends are Ron and Hermione.",
    one: "Wizard",
    sketch: ["⚡", "👓", "🪄"],
  },
  {
    word: "Beyoncé",
    aliases: ["beyonce"],
    kind: "SURPRISE",
    description:
      "A world-famous American singer known for powerful performances.",
    extra: "She performed Crazy in Love and Single Ladies.",
    one: "Singer",
    sketch: ["🎤", "♛", "🎵"],
  },
  {
    word: "Batman",
    kind: "SURPRISE",
    description: "A masked hero who protects Gotham City at night.",
    extra: "His symbol is a flying mammal.",
    one: "Gotham",
    sketch: ["🌙", "🦇", "🏙"],
  },
  {
    word: "Shrek",
    kind: "SURPRISE",
    description: "A green ogre who lives in a swamp.",
    extra: "His best friend is a talking donkey.",
    one: "Ogre",
    sketch: ["🟢", "👂", "🏚"],
  },
  {
    word: "Ronaldo",
    aliases: ["cristianoronaldo"],
    kind: "SURPRISE",
    description: "A Portuguese football superstar famous for scoring goals.",
    extra: "His celebration is often written as SIUUU.",
    one: "Football",
    sketch: ["⚽", "👕", "🥅"],
  },
  {
    word: "Titanic",
    kind: "SURPRISE",
    description: "A famous passenger ship that sank after striking an iceberg.",
    extra: "It is also the title of a film with Jack and Rose.",
    one: "Iceberg",
    sketch: ["🚢", "🧊", "🌊"],
  },
  {
    word: "Pizza",
    kind: "SURPRISE",
    description: "A round Italian dish with tomato, cheese and toppings.",
    extra: "It is baked and cut into triangular slices.",
    one: "Italian",
    sketch: ["◯", "🍅", "△"],
  },
  {
    word: "Volcano",
    kind: "SURPRISE",
    description: "A mountain that can erupt with lava, ash and smoke.",
    extra: "Magma rises from inside the Earth.",
    one: "Lava",
    sketch: ["△", "☁", "🔥"],
  },
  {
    word: "Dancing",
    kind: "SURPRISE",
    description: "Moving your body rhythmically to music.",
    extra: "People often do it at parties or on a stage.",
    one: "Rhythm",
    sketch: ["🎵", "🕺", "✨"],
  },
  {
    word: "Invisible",
    kind: "SURPRISE",
    description: "Impossible to see with your eyes.",
    extra: "The person may be present, but appears transparent.",
    one: "Unseen",
    sketch: ["👓", "…", "👕"],
  },
];
const rounds = [
  { name: "DESCRIBE IT", time: 30 },
  { name: "ONE WORD", time: 15 },
  { name: "DRAWING", time: 20 },
];
const clean = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

export default function TimesUp() {
  const [started, setStarted] = useState(false),
    [teamDraw, setTeamDraw] = useState<"idle" | "spinning" | "revealed">(
      "idle",
    ),
    [finished, setFinished] = useState(false),
    [team, setTeam] = useState<"GOLD" | "PURPLE">("GOLD"),
    [round, setRound] = useState(0),
    [index, setIndex] = useState(0),
    [seconds, setSeconds] = useState(30),
    [guess, setGuess] = useState(""),
    [result, setResult] = useState<"correct" | "pass" | null>(null),
    [score, setScore] = useState(0),
    [opponent, setOpponent] = useState(0),
    [music, setMusic] = useState(true);
  const audio = useRef<{
    ctx: AudioContext;
    timer: number;
    musicGain: GainNode;
    pulse: () => void;
  } | null>(null);
  const deck = cards,
    card = deck[index],
    r = rounds[round],
    reveal = round === 2 ? (seconds <= 6 ? 3 : seconds <= 13 ? 2 : 1) : 0;
  function note(
    frequency: number,
    start: number,
    duration: number,
    volume = 0.035,
  ) {
    const ctx = audio.current?.ctx;
    if (!ctx) return;
    const osc = ctx.createOscillator(),
      gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration);
  }
  function startMusic() {
    if (audio.current) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const musicGain = ctx.createGain();
    musicGain.gain.value = 0.72;
    musicGain.connect(ctx.destination);

    // A slow, restrained retro-synth atmosphere: dark, mysterious and calm.
    const pulse = () => {
      const now = ctx.currentTime;
      const bar = 1.6;
      const roots = [65.41, 58.27, 49, 55];
      const arpeggio = [0, 7, 12, 15, 12, 7, 3, 7];

      roots.forEach((root, chordIndex) => {
        const start = now + chordIndex * bar;

        const bass = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bass.type = "sine";
        bass.frequency.value = root;
        bassGain.gain.setValueAtTime(0.0001, start);
        bassGain.gain.exponentialRampToValueAtTime(0.018, start + 0.32);
        bassGain.gain.exponentialRampToValueAtTime(0.0001, start + bar);
        bass.connect(bassGain).connect(musicGain);
        bass.start(start);
        bass.stop(start + bar + 0.02);

        arpeggio.forEach((semitones, noteIndex) => {
          const noteStart = start + noteIndex * 0.2;
          const synth = ctx.createOscillator();
          const synthGain = ctx.createGain();
          synth.type = noteIndex % 2 === 0 ? "triangle" : "sine";
          synth.frequency.value = root * 2 * Math.pow(2, semitones / 12);
          synth.detune.value = noteIndex % 2 === 0 ? -3 : 3;
          synthGain.gain.setValueAtTime(0.0001, noteStart);
          synthGain.gain.exponentialRampToValueAtTime(0.008, noteStart + 0.08);
          synthGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.48);
          synth.connect(synthGain).connect(musicGain);
          synth.start(noteStart);
          synth.stop(noteStart + 0.5);
        });
      });
    };

    const timer = window.setInterval(pulse, 6400);
    audio.current = { ctx, timer, musicGain, pulse };
    pulse();
  }
  function pauseBackground() {
    if (!audio.current) return;
    window.clearInterval(audio.current.timer);
    audio.current.musicGain.gain.setValueAtTime(0.0001, audio.current.ctx.currentTime);
  }
  function resumeBackground() {
    if (!music || !audio.current) return;
    window.clearInterval(audio.current.timer);
    audio.current.musicGain.gain.setValueAtTime(1, audio.current.ctx.currentTime);
    audio.current.pulse();
    audio.current.timer = window.setInterval(audio.current.pulse, 3200);
  }
  function stopMusic() {
    if (!audio.current) return;
    window.clearInterval(audio.current.timer);
    audio.current.ctx.close();
    audio.current = null;
  }
  function toggleMusic() {
    if (music) {
      setMusic(false);
      stopMusic();
    } else {
      setMusic(true);
      startMusic();
    }
  }
  function resultMusic(won: boolean) {
    if (!music || !audio.current) return;
    const now = audio.current.ctx.currentTime + 0.05;
    const melody = won
      ? [261.63, 329.63, 392, 523.25, 659.25]
      : [392, 349.23, 293.66, 220, 164.81];
    melody.forEach((f, i) =>
      note(f, now + i * 0.18, won ? 0.42 : 0.5, won ? 0.065 : 0.05),
    );
    if (won)
      [523.25, 659.25, 783.99].forEach((f) => note(f, now + 0.85, 1, 0.04));
  }
  function feedbackMusic(won: boolean) {
    if (!music || !audio.current) return;
    const now = audio.current.ctx.currentTime + 0.03;
    if (won) {
      [523.25, 659.25, 783.99, 1046.5].forEach((frequency, i) =>
        note(frequency, now + i * 0.12, 0.34, 0.1),
      );
      [659.25, 783.99, 1046.5].forEach((frequency) =>
        note(frequency, now + 0.48, 0.72, 0.055),
      );
      return;
    }
    const ctx = audio.current.ctx;
    [146.83, 110].forEach((frequency, i) => {
      const osc = ctx.createOscillator(),
        gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(frequency, now + i * 0.08);
      osc.frequency.exponentialRampToValueAtTime(
        frequency * 0.72,
        now + 0.62,
      );
      gain.gain.setValueAtTime(0.0001, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.11, now + 0.025 + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.68);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + 0.7);
    });
  }
  function countdownTick(value: number) {
    if (!music || !audio.current) return;
    const ctx = audio.current.ctx,
      now = ctx.currentTime,
      osc = ctx.createOscillator(),
      gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = value % 2 === 0 ? 720 : 920;
    gain.gain.setValueAtTime(0.055, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }
  function timeUpSound() {
    if (!music || !audio.current) return;
    pauseBackground();
    const ctx = audio.current.ctx,
      now = ctx.currentTime;
    [220, 164.81].forEach((frequency, i) => {
      const osc = ctx.createOscillator(),
        gain = ctx.createGain(),
        start = now + i * 0.32;
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, start);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.82, start + 0.5);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.12, start + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.58);
    });
  }
  useEffect(() => {
    if (!started || finished || result) return;
    const timer = window.setInterval(
      () =>
        setSeconds((s) => {
          if (s <= 1) {
            window.clearInterval(timer);
            timeUpSound();
            setResult("pass");
            return 0;
          }
          if (s <= 6) countdownTick(s - 1);
          return s - 1;
        }),
      1000,
    );
    return () => window.clearInterval(timer);
    // The sound helpers intentionally read the current audio ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, finished, result, index, round]);
  useEffect(() => () => stopMusic(), []);
  function begin() {
    const drawn = Math.random() > 0.5 ? "GOLD" : "PURPLE";
    setTeam(drawn);
    setTeamDraw("spinning");
    if (music) startMusic();
    window.setTimeout(() => setTeamDraw("revealed"), 2300);
    window.setTimeout(() => {
      setStarted(true);
      setSeconds(rounds[0].time);
    }, 3900);
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    if (result || !guess.trim()) return;
    const accepted = [card.word, ...(card.aliases || [])].map(clean);
    if (accepted.includes(clean(guess))) {
      const bonus = Math.max(0, seconds) * 2;
      setScore((s) => s + 100 + bonus);
      pauseBackground();
      feedbackMusic(true);
      setResult("correct");
    } else {
      feedbackMusic(false);
      setGuess("");
    }
  }
  function pass() {
    if (!result) {
      pauseBackground();
      feedbackMusic(false);
      setResult("pass");
    }
  }
  function next() {
    const opponentGain =
        (index + round * 7) % 4 === 0
          ? 0
          : 70 + ((index * 13 + round * 11) % 51),
      finalOpponent = opponent + opponentGain;
    setOpponent(finalOpponent);
    if (index < deck.length - 1) {
      resumeBackground();
      setIndex((i) => i + 1);
      setSeconds(r.time);
      setGuess("");
      setResult(null);
      return;
    }
    if (round < 2) {
      resumeBackground();
      setRound((v) => v + 1);
      setIndex(0);
      setSeconds(rounds[round + 1].time);
      setGuess("");
      setResult(null);
      return;
    }
    resultMusic(score >= finalOpponent);
    setFinished(true);
  }
  if (!started)
    return (
      <main className="tu-entry">
        <Link href="/modules">← DAY 01</Link>
        {teamDraw === "idle" ? (
          <section>
            <span>DAY 01 · TEAM CHALLENGE</span>
            <h1>
              TIME’S <b>UP!</b>
            </h1>
            <p>
              Thirty cards. Three rounds: describe it, give one word, then
              follow the drawing.
            </p>
            <div>
              <i>DESCRIBE IT</i>
              <i>ONE WORD</i>
              <i>DRAWING</i>
            </div>
            <button onClick={begin}>
              SPIN FOR YOUR TEAM <b>→</b>
            </button>
          </section>
        ) : (
          <section
            className={`team-draw ${teamDraw} draw-${team.toLowerCase()}`}
            aria-live="polite"
          >
            <span>
              {teamDraw === "spinning"
                ? "THE WHEEL IS CHOOSING…"
                : "WELCOME TO"}
            </span>
            <div className="team-wheel">
              <div>
                <b>GOLD</b>
                <b>PURPLE</b>
                <b>GOLD</b>
                <b>PURPLE</b>
              </div>
            </div>
            <h2>{teamDraw === "revealed" ? `TEAM ${team}` : "GOOD LUCK…"}</h2>
            <p>
              {teamDraw === "revealed"
                ? "Your team is ready. The first round is about to begin."
                : "Your team will be assigned at random."}
            </p>
          </section>
        )}
      </main>
    );
  if (finished) {
    const won = score >= opponent;
    return (
      <main className={`tu-results ${team.toLowerCase()}`}>
        <Link href="/modules">← MODULES</Link>
        <section>
          <span>FINAL SCORE</span>
          <h1>{won ? "YOUR TEAM WINS!" : "WHAT A CLOSE GAME!"}</h1>
          <div className="tu-final">
            <div>
              <small>TEAM {team}</small>
              <strong>{score}</strong>
            </div>
            <b>VS</b>
            <div>
              <small>TEAM {team === "GOLD" ? "PURPLE" : "GOLD"}</small>
              <strong>{opponent}</strong>
            </div>
          </div>
          <p>You completed all 30 cards in all three rounds.</p>
          <button onClick={() => location.reload()}>PLAY AGAIN</button>
        </section>
      </main>
    );
  }
  return (
    <main className={`tu-game team-${team.toLowerCase()} ${result ? `result-${result}` : ""}`}>
      <header>
        <Link href="/modules">← EXIT</Link>
        <div>
          <b>TIME’S UP CADGA</b>
          <span>
            ROUND {round + 1} · {r.name}
          </span>
        </div>
        <div className="tu-header-actions">
          <strong>TEAM {team}</strong>
          <button onClick={toggleMusic} aria-label={music ? "Mute music" : "Play music"}>
            {music ? "♪ MUSIC ON" : "♩ MUSIC OFF"}
          </button>
        </div>
      </header>
      <section className="tu-stage">
        <aside className="team-board ours">
          <span>TEAM {team}</span>
          <strong>{score}</strong>
          <div className="tu-avatars">
            <i>MD</i>
            <i>H</i>
            <i>+</i>
          </div>
        </aside>
        <aside className="team-board theirs">
          <span>TEAM {team === "GOLD" ? "PURPLE" : "GOLD"}</span>
          <strong>{opponent}</strong>
          <div className="tu-avatars">
            <i>V</i>
            <i>M</i>
            <i>S</i>
          </div>
        </aside>
        <section className="tu-screen">
          <div
            className="timer"
            style={
              {
                "--time": `${(seconds / r.time) * 100}%`,
              } as React.CSSProperties
            }
          >
            <strong>{seconds}</strong>
            <small>SECONDS</small>
          </div>
          <div className="card-meta">
            <span>CARD {index + 1} / 30</span>
            <b>{card.kind}</b>
          </div>
          {round === 0 && (
            <div className="description">
              <span>DESCRIPTION</span>
              <h2>{card.description}</h2>
              {seconds <= 15 && <p>{card.extra}</p>}
            </div>
          )}
          {round === 1 && (
            <div className="one-word">
              <span>ONE WORD ONLY</span>
              <h2>{card.one}</h2>
            </div>
          )}
          {round === 2 && (
            <div className="ai-sketch">
              <span>SKETCHING…</span>
              <div>
                {card.sketch.map((s, i) => (
                  <i className={i < reveal ? "visible" : ""} key={`${s}-${i}`}>
                    {s}
                  </i>
                ))}
              </div>
              <small>NO LETTERS · NO WORDS</small>
            </div>
          )}
          <form onSubmit={submit}>
            <input
              autoFocus
              disabled={!!result}
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Type your answer in English…"
            />
            <button disabled={!!result || !guess.trim()}>SUBMIT</button>
          </form>
          <section className="ai-host">
            <div className="host-avatar">H</div>
            <span>YOUR HOST</span>
            <p>
              {result === "correct"
                ? "Excellent! Your team takes the points."
                : result === "pass"
                  ? `Time! The card was ${card.word}.`
                  : round === 0
                    ? "Listen carefully to the description."
                    : round === 1
                      ? "One word. Trust your memory."
                      : "Watch the sketch appear."}
            </p>
          </section>
          {!result ? (
            <button className="pass" onClick={pass}>
              PASS THIS CARD
            </button>
          ) : (
            <button className="next-card" onClick={next}>
              {round === 2 && index === 29
                ? "SEE FINAL SCORE"
                : index === 29
                  ? "START NEXT ROUND"
                  : "NEXT CARD"}{" "}
              →
            </button>
          )}
        </section>
      </section>
      <footer>
        <span>ROUND {round + 1} OF 3</span>
        <div>
          <i style={{ width: `${((round * 30 + index + 1) / 90) * 100}%` }} />
        </div>
        <b>{round * 30 + index + 1} / 90</b>
      </footer>
    </main>
  );
}
