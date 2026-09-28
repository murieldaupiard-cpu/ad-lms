import Link from "next/link";
import "./day2.css";
import "../infinity-signature.css";

const modules = [
  {
    number: "01",
    title: "L'Arène CADGA",
    description: "Revise Day 1 — numbers, symbols, time and dates, against the clock.",
    href: "/day2/quiz",
    activities: "31 questions",
    color: "alphabet",
    live: true,
  },
  {
    number: "02",
    title: "Découvrir Primevère",
    description: "Explore the fictitious company, its teams, products and international network before the exam vocabulary.",
    href: "/day2/company",
    activities: "5 onglets",
    color: "numbers",
    live: true,
  },
  {
    number: "03",
    title: "CADGA Vocabulary",
    description: "Learn the business English vocabulary, then prove it with audio quizzes and a real voicemail challenge.",
    href: "/day2/vocabulary",
    activities: "6 sections",
    color: "amber",
    live: true,
  },
  {
    number: "04",
    title: "Voicemail Exam Method",
    description: "REAC recap, exam steps & timing, tips, the information sheet.",
    href: "/day2/method",
    activities: "5 sections",
    color: "dates",
    live: true,
  },
  {
    number: "05",
    title: "Voicemail Practice",
    description: "Complete a guided voicemail, then validate your skills with an autonomous practice.",
    href: "/day2/practice",
    activities: "2 entraînements",
    color: "symbols",
    live: true,
  },
];

export default function Day2() {
  return (
    <main className="cadga-home modules-page day2-page">
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
            <span>DAY 02 · THE METHOD</span>
            <h1>Vocabulary, method, practice</h1>
            <p>Revise Day 1, discover the CADGA vocabulary, learn how the voicemail exam works, then train for real.</p>
          </div>
          <div className="modules-progress">
            <span>5 OF 5 MODULES LIVE</span>
            <i>
              <em style={{ width: "100%" }} />
            </i>
          </div>
        </div>

        <div className="home-module-grid compact-modules day2-grid">
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
              <div className={`home-module ${module.color} day2-soon`} key={module.number} aria-disabled="true">
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

        <div className="day-games day2-games">
          <section className="casino-invite">
            <div><span>DAY 02 · VOCABULARY CHALLENGE</span><h2>Enter the CADGA Casino.</h2><p>Twenty professional vocabulary hands. €100 in chips. One final All-in.</p></div>
            <div className="casino-invite-chips"><i>€5</i><i>€20</i><i>€50</i></div>
            <Link href="/casino">ENTER THE CASINO <b>→</b></Link>
          </section>
          <section className="timesup-invite">
            <div><span>DAY 02 · TEAM CHALLENGE</span><h2>Time’s Up CADGA.</h2><p>Thirty cards. Three ways to make you guess.</p></div>
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
