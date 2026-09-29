import Link from "next/link";
import "./days.css";
import "../infinity-signature.css";

const days = [
  {
    number: "01",
    title: "The Foundations",
    description: "Alphabet, numbers, symbols, dates and time — plus the Casino Game and Tongue Twisters.",
    href: "/modules",
    activities: "5 modules",
    progress: 0,
    live: true,
  },
  {
    number: "02",
    title: "The Method",
    description: "Day 1 revision quiz, CADGA vocabulary, the voicemail exam walkthrough, and guided practice.",
    href: "/day2",
    activities: "5 modules",
    progress: 0,
    live: true,
  },
  {
    number: "03",
    title: "Exam Prep · Part 1",
    description: "Two quiz arenas, the email subject-line drill, the exam briefing, and your first graded voicemail (MES).",
    href: "/day3",
    activities: "5 modules",
    progress: 0,
    live: true,
  },
  {
    number: "04",
    title: "Exam Prep · Part 2",
    description: "Two live phone calls with Primevère: the AI plays the caller, you take the message and route it to the right person.",
    href: "/exam-prep-2",
    activities: "2 appels · 1 disponible",
    progress: 0,
    live: true,
  },
  {
    number: "05",
    title: "ECF · Part 1",
    description: "Your first certification exam, reviewed and discussed with Muriel.",
    href: "/day4",
    activities: "4 modules",
    progress: 0,
    live: true,
  },
  {
    number: "06",
    title: "Banque de préparation ECF",
    description: "Ten more live phone calls with Primevère to train on the criteria you missed in ECF 1, before ECF 2.",
    href: "/banque-ecf",
    activities: "10 appels · en préparation",
    progress: 0,
    live: true,
  },
  {
    number: "07",
    title: "ECF · Part 2",
    description: "Final certification exam, correction and individual support plan.",
    href: "/day5",
    activities: "1 module live",
    progress: 0,
    live: true,
  },
  {
    number: "08",
    title: "Votre retour d’expérience",
    description: "Un questionnaire de clôture sur votre progression, votre autonomie et les améliorations à apporter au parcours.",
    href: "/satisfaction",
    activities: "5 à 7 minutes · non évalué",
    progress: 0,
    live: true,
    survey: true,
  },
];

export default function Days() {
  return (
    <main className="cadga-home days-page">
      <header className="home-nav modules-nav">
        <Link className="home-brand" href="/">
          <span>A</span>
          <div>
            <strong>AD</strong>
            <small>ENGLISH LEARNING</small>
          </div>
        </Link>
        <Link className="back-home" href="/">
          <i>←</i> HOME
        </Link>
      </header>

      <section className="home-modules days-section">
        <div className="modules-heading">
          <div>
            <span>40H TRAINING PATH</span>
            <h1>Choose your day</h1>
            <p>One goal: walk into your Assistant de Direction exam ready.</p>
          </div>
          <div className="modules-progress">
            <span>6 OF 7 DAYS LIVE</span>
            <i>
              <em style={{ width: "86%" }} />
            </i>
          </div>
        </div>

        <div className="days-list">
          {days.map((day) =>
            day.live ? (
              <Link className={`day-row ${"survey" in day && day.survey ? "survey-row" : ""}`} href={day.href} key={day.number}>
                <span className="day-row-num">{day.number}</span>
                <div className="day-row-body">
                  <div className="day-row-top">
                    <h3>{day.title}</h3>
                    <span className="day-row-progress">{"survey" in day && day.survey ? "QUESTIONNAIRE" : `${day.progress}% COMPLETE`}</span>
                  </div>
                  <p>{day.description}</p>
                  <span className="day-row-meta">{day.activities}</span>
                </div>
                <span className="day-row-arrow">→</span>
              </Link>
            ) : (
              <div className="day-row locked" aria-disabled="true" key={day.number}>
                <span className="day-row-num">{day.number}</span>
                <div className="day-row-body">
                  <div className="day-row-top">
                    <h3>{day.title}</h3>
                    <span className="day-row-progress locked">COMING SOON</span>
                  </div>
                  <p>{day.description}</p>
                  <span className="day-row-meta">{day.activities}</span>
                </div>
              </div>
            )
          )}
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
