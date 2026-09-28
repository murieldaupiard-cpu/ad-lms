import Link from "next/link";
import "../day3/day3.css";
import "../infinity-signature.css";
import {SCENARIOS} from "@/lib/call-scenarios";

// Exam Prep · Part 2 — 10 mises en situation d'accueil téléphonique avec un appelant joué par l'IA.
const colors = ["alphabet", "numbers", "amber", "dates", "symbols"];
const cards = Array.from({length: 10}, (_, i) => {
  const s = SCENARIOS.find(x => x.n === i + 1);
  return {n: String(i + 1).padStart(2, "0"), live: !!s, href: s ? `/exam-prep-2/mes/${s.id}` : "", title: `MES ${i + 1}`, meta: s ? s.kind : "En préparation", description: s ? `${s.flag} ${s.title}. L’appelant vous parle en direct : répondez, prenez le message et trouvez le bon destinataire.` : "Une nouvelle situation d’accueil téléphonique avec Primevère.", color: colors[i % colors.length]};
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
            <p>Commencez par la grille d’évaluation et le guide de l’appel, puis enchaînez les mises en situation : l’IA joue l’appelant, en direct. À vous d’accueillir, de comprendre, de noter et de transmettre le message à la bonne personne. Chaque MES est suivie de sa correction.</p>
          </div>
          <div className="modules-progress"><span>{live + 2} OF 12 CHAPTERS LIVE</span><i><em style={{width: `${((live + 2) / 12) * 100}%`}}/></i></div>
        </div>
        <div className="home-module-grid compact-modules day3-grid">
          <Link className="home-module amber" href="/exam-prep-2/grille">
            <div className="module-visual"><div className="module-banner-top"><small>CHAPITRE 01</small><b>✅ GRILLE</b></div><h3>La grille d’évaluation</h3><span>À LIRE D’ABORD ↗</span></div>
            <div className="module-copy"><span>L’épreuve · 10 critères</span><p>La compétence évaluée, le déroulé d’une MES, les 10 critères et les conditions de réussite. Grille à télécharger en PDF.</p><div><b>DÉCOUVRIR LA GRILLE</b><i>→</i></div></div>
          </Link>
          <Link className="home-module dates" href="/exam-prep-2/guide">
            <div className="module-visual"><div className="module-banner-top"><small>CHAPITRE 02</small><b>🎙 QUIZ ORAL</b></div><h3>Le guide de l’appel</h3><span>8 ÉTAPES ↗</span></div>
            <div className="module-copy"><span>Guide · Phrases utiles · Quiz oral</span><p>Les 8 étapes d’un appel réussi et les phrases utiles, puis un quiz où vous dites les réponses à voix haute. Guide à télécharger en PDF.</p><div><b>OUVRIR LE GUIDE</b><i>→</i></div></div>
          </Link>
          {cards.map((c, i) => c.live ? (
            <Link className={`home-module ${c.color}`} href={c.href} key={c.n}>
              <div className="module-visual"><div className="module-banner-top"><small>CHAPITRE {String(i + 3).padStart(2, "0")}</small><b>☎ LIVE</b></div><h3>{c.title}</h3><span>DÉCROCHER ↗</span></div>
              <div className="module-copy"><span>{c.meta}</span><p>{c.description}</p><div><b>APPEL + CORRECTION</b><i>→</i></div></div>
            </Link>
          ) : (
            <div className={`home-module ${c.color} day3-soon`} key={c.n} aria-disabled="true">
              <div className="module-visual"><div className="module-banner-top"><small>CHAPITRE {String(i + 3).padStart(2, "0")}</small><b>SOON</b></div><h3>{c.title}</h3><span>IN DESIGN</span></div>
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
