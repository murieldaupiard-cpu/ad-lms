import Link from "next/link";
import "../day3/day3.css";
import "../infinity-signature.css";
import {SCENARIOS} from "@/lib/call-scenarios";

// Exam Prep · Part 2 — 10 mises en situation d'accueil téléphonique avec un appelant joué par l'IA.
const colors = ["alphabet", "numbers", "amber", "dates", "symbols"];
const cards = Array.from({length: 10}, (_, i) => {
  const s = SCENARIOS.find(x => x.n === i + 1);
  return {n: String(i + 1).padStart(2, "0"), live: !!s, href: s ? `/exam-prep-2/mes/${s.id}` : "", title: s ? `MES ${i + 1} · ${s.company}` : `MES ${i + 1}`, meta: s ? s.kind : "En préparation", description: s ? `${s.flag} ${s.title}. L’appelant vous parle en direct : répondez, prenez le message et trouvez le bon destinataire.` : "Une nouvelle situation d’accueil téléphonique avec Primevère.", color: colors[i % colors.length]};
});

export default function ExamPrep2() {
  const live = cards.filter(c => c.live).length;
  return (
    <main className="cadga-home modules-page day3-page">
      <header className="home-nav modules-nav">
        <Link className="home-brand" href="/"><span>A</span><div><strong>AD</strong><small>ENGLISH LEARNING</small></div></Link>
        <Link className="back-home" href="/days"><i>←</i> MAIN MENU</Link>
      </header>
      <section className="home-modules">
        <div className="modules-heading">
          <div>
            <span>DAY 04 · EXAM PREP · PART 2</span>
            <h1>Au téléphone avec Primevère</h1>
            <p>Dix appels en anglais, en direct. L’IA joue l’appelant : à vous d’accueillir, de comprendre, de noter, puis de transmettre le message à la bonne personne. Utilisez un casque ou des écouteurs.</p>
          </div>
          <div className="modules-progress"><span>{live} OF 10 CALLS LIVE</span><i><em style={{width: `${live * 10}%`}}/></i></div>
        </div>
        <div className="home-module-grid compact-modules day3-grid">
          {cards.map(c => c.live ? (
            <Link className={`home-module ${c.color}`} href={c.href} key={c.n}>
              <div className="module-visual"><div className="module-banner-top"><small>MES {c.n}</small><b>☎ LIVE</b></div><h3>{c.title}</h3><span>DÉCROCHER ↗</span></div>
              <div className="module-copy"><span>{c.meta}</span><p>{c.description}</p><div><b>RÉPONDRE À L’APPEL</b><i>→</i></div></div>
            </Link>
          ) : (
            <div className={`home-module ${c.color} day3-soon`} key={c.n} aria-disabled="true">
              <div className="module-visual"><div className="module-banner-top"><small>MES {c.n}</small><b>SOON</b></div><h3>{c.title}</h3><span>IN DESIGN</span></div>
              <div className="module-copy"><span>{c.meta}</span><p>{c.description}</p></div>
            </div>
          ))}
        </div>
      </section>
      <footer className="home-footer">
        <div className="home-brand compact"><span>A</span><div><strong>AD</strong><small>LEARNING STUDIO</small></div></div>
        <p>English for confident, professional customer interactions.</p>
        <small>CREATED BY <b>ALEXANDRE AND MURIEL</b></small>
      </footer>
    </main>
  );
}
