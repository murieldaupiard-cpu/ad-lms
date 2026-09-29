import Link from "next/link";
import "../day3/day3.css";
import "../infinity-signature.css";
import {SCENARIOS} from "@/lib/call-scenarios";

// Banque de préparation ECF (étape 06, entre ECF 1 et ECF 2) — 10 MES d'accueil téléphonique Primevère,
// appelant joué par l'IA. Sert de remédiation après l'ECF 1. Les MES sont dans lib/call-scenarios.ts (bank: true).
const colors = ["alphabet", "numbers", "amber", "dates", "symbols"];
const MES_COUNT = 10;
const cards = Array.from({length: MES_COUNT}, (_, i) => {
  const s = SCENARIOS.find(x => x.bank && x.n === i + 1);
  return {n: String(i + 1).padStart(2, "0"), live: !!s, href: s ? `/exam-prep-2/mes/${s.id}` : "", title: `MES ${i + 1}`, meta: s ? s.kind : "En préparation", description: s ? `${s.flag} ${s.title}. L’appelant vous parle en direct : répondez, prenez le message et trouvez le bon destinataire.` : "Une nouvelle situation d’accueil téléphonique avec Primevère.", color: colors[i % colors.length]};
});

export default function BanqueECF() {
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
            <span>DAY 06 · BANQUE DE PRÉPARATION ECF</span>
            <h1>Entraînez-vous avant l’ECF 2</h1>
            <p>Dix nouvelles mises en situation avec Primevère, dans les conditions de l’épreuve : l’IA joue l’appelant, en direct. Appuyez-vous sur la correction de votre ECF 1 et entraînez-vous en priorité sur les critères non validés. Chaque MES est suivie de sa correction. La grille et le guide restent disponibles dans l’Exam Prep · Part 2.</p>
          </div>
          <div className="modules-progress"><span>{live} OF {MES_COUNT} MES LIVE</span><i><em style={{width: `${(live / MES_COUNT) * 100}%`}}/></i></div>
        </div>
        <div className="home-module-grid compact-modules day3-grid">
          {cards.map((c, i) => c.live ? (
            <Link className={`home-module ${c.color}`} href={c.href} key={c.n}>
              <div className="module-visual"><div className="module-banner-top"><small>MES {String(i + 1).padStart(2, "0")}</small><b>☎ LIVE</b></div><h3>{c.title}</h3><span>DÉCROCHER ↗</span></div>
              <div className="module-copy"><span>{c.meta}</span><p>{c.description}</p><div><b>APPEL + CORRECTION</b><i>→</i></div></div>
            </Link>
          ) : (
            <div className={`home-module ${c.color} day3-soon`} key={c.n} aria-disabled="true">
              <div className="module-visual"><div className="module-banner-top"><small>MES {String(i + 1).padStart(2, "0")}</small><b>SOON</b></div><h3>{c.title}</h3><span>IN DESIGN</span></div>
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
