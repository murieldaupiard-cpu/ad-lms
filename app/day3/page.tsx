import Link from "next/link";
import "./day3.css";
import "../infinity-signature.css";

const modules = [
  {
    number: "01",
    title: "L'Arène · Révision",
    description: "Numbers, symbols, time and dates — everything from Day 1, against the clock.",
    href: "/day3/quiz-revision",
    activities: "31 questions",
    color: "alphabet",
    live: true,
  },
  {
    number: "02",
    title: "L'Arène du Vocabulaire",
    description: "The full CADGA vocabulary: roles, orders, deliveries, invoices and email phrases.",
    href: "/day3/quiz-vocabulary",
    activities: "46 questions",
    color: "numbers",
    live: true,
  },
  {
    number: "03",
    title: "L'objet de l'email",
    description: "Learn the subject-line convention, then build ten of them against real situations.",
    href: "/day3/objet",
    activities: "10 situations",
    color: "amber",
    live: true,
  },
  {
    number: "04",
    title: "L'épreuve en 20 minutes",
    description: "Prove the method instead of re-reading it, then see exactly how today's graded exam runs.",
    href: "/day3/briefing",
    activities: "5 étapes",
    color: "dates",
    live: true,
  },
  {
    number: "05",
    title: "MES d'examen",
    description: "The graded mock exam: 20 minutes, corrected against the ten criteria, with targeted remediation.",
    href: "/day3/mes",
    activities: "3 sujets · 20 min",
    color: "symbols",
    live: true,
  },
];

export default function Day3() {
  return (
    <main className="cadga-home modules-page day3-page">
      <header className="home-nav modules-nav">
        <Link className="home-brand" href="/">
          <span>A</span>
          <div>
            <strong>AD</strong>
            <small>ENGLISH LEARNING</small>
          </div>
        </Link>
        <Link className="back-home" href="/days">
          <i>←</i> MAIN MENU
        </Link>
      </header>

      <section className="home-modules">
        <div className="modules-heading">
          <div>
            <span>DAY 03 · EXAM PREP · PART 1</span>
            <h1>Two arenas, one graded exam</h1>
            <p>Warm up on Day 1, prove the vocabulary, run through the method one last time, then sit the graded mock exam.</p>
          </div>
          <div className="modules-progress">
            <span>5 OF 5 MODULES LIVE</span>
            <i>
              <em style={{ width: "100%" }} />
            </i>
          </div>
        </div>

        <div className="home-module-grid compact-modules day3-grid">
          {modules.map((module) =>
            module.live ? (
              <Link className={`home-module ${module.color}`} href={module.href} key={module.number}>
                <div className="module-visual">
                  <div className="module-banner-top">
                    <small>MODULE {module.number}</small>
                    <b>0% COMPLETE</b>
                  </div>
                  <h3>{module.title}</h3>
                  <span>OPEN MODULE ↗</span>
                </div>
                <div className="module-copy">
                  <span>{module.activities}</span>
                  <p>{module.description}</p>
                  <div>
                    <b>START LEARNING</b>
                    <i>→</i>
                  </div>
                </div>
              </Link>
            ) : (
              <div className={`home-module ${module.color} day3-soon`} key={module.number} aria-disabled="true">
                <div className="module-visual">
                  <div className="module-banner-top">
                    <small>MODULE {module.number}</small>
                    <b>SOON</b>
                  </div>
                  <h3>{module.title}</h3>
                  <span>IN DESIGN</span>
                </div>
                <div className="module-copy">
                  <span>{module.activities}</span>
                  <p>{module.description}</p>
                </div>
              </div>
            )
          )}
        </div>

        <div className="day-games day3-games">
          <section className="casino-invite">
            <div><span>DAY 03 · VOCABULARY CHALLENGE</span><h2>Back to the CADGA Casino.</h2><p>Same table, same chips — except today you know every word on it. Bet accordingly.</p></div>
            <div className="casino-invite-chips"><i>€5</i><i>€20</i><i>€50</i></div>
            <Link href="/casino">ENTER THE CASINO <b>→</b></Link>
          </section>
          <section className="timesup-invite">
            <div><span>DAY 03 · TEAM CHALLENGE</span><h2>Time’s Up CADGA.</h2><p>Thirty cards, three rounds. End the day on your feet, not in front of a screen.</p></div>
            <div className="timesup-rounds"><i>DESCRIBE IT</i><i>ONE WORD</i><i>DRAWING</i></div>
            <Link href="/times-up">SPIN FOR A TEAM <b>→</b></Link>
          </section>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-brand compact">
          <span>A</span>
          <div>
            <strong>AD</strong>
            <small>LEARNING STUDIO</small>
          </div>
        </div>
        <p>English for confident, professional customer interactions.</p>
        <small>
          CREATED BY <b>ALEXANDRE AND MURIEL</b>
        </small>
      </footer>
    </main>
  );
}
