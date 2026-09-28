import Link from "next/link";
import "../day4/day4.css";

const modules = [
  { number: "01", title: "Avant l’épreuve", description: "Un sas court pour retrouver la méthode, respirer et entrer dans l’épreuve avec des repères clairs.", meta: "5 minutes · non évalué", color: "alphabet", href: "/day5/preparation", live: true },
  { number: "02", title: "ECF · 30 minutes", description: "Écouter la réclamation, relever les informations utiles et transmettre un email professionnel au bon destinataire.", meta: "2 parties · 30 minutes", color: "numbers", href: "#", live: false },
  { number: "03", title: "Correction critériée", description: "Consulter les critères, les éléments observés et le résultat global : Acquis ou Non acquis.", meta: "grille d’évaluation", color: "amber", href: "#", live: false },
  { number: "04", title: "Remédiation & visio", description: "Préparer l’entretien avec la formatrice grâce au diagnostic et au questionnaire d’explicitation personnalisé.", meta: "accompagnement individualisé", color: "dates", href: "#", live: false },
];

export default function Day5(){return <main className="cadga-home modules-page day4-page">
  <header className="home-nav modules-nav"><Link className="home-brand" href="/"><span>A</span><div><strong>AD</strong><small>ENGLISH LEARNING</small></div></Link><Link className="back-home" href="/days"><i>←</i> MAIN MENU</Link></header>
  <section className="home-modules"><div className="modules-heading"><div><span>DAY 07 · ECF PART 2</span><h1>Se recentrer avant l’épreuve finale</h1><p>Commencer par un rappel rassurant de la méthode avant de réaliser l’ECF final.</p></div><div className="modules-progress"><span>1 MODULE DISPONIBLE</span><i><em style={{width:"25%"}}/></i></div></div>
  <div className="home-module-grid day4-grid">{modules.map(m=>m.live?<Link className={`home-module ${m.color}`} href={m.href} key={m.number}><div className="module-visual"><div className="module-banner-top"><small>MODULE {m.number}</small><b>0% COMPLETE</b></div><h3>{m.title}</h3><span>OPEN MODULE ↗</span></div><div className="module-copy"><span>{m.meta}</span><p>{m.description}</p><div><b>ENTRER DANS LE MODULE</b><i>→</i></div></div></Link>:<div className={`home-module ${m.color} day3-soon`} key={m.number} aria-disabled="true"><div className="module-visual"><div className="module-banner-top"><small>MODULE {m.number}</small><b>SOON</b></div><h3>{m.title}</h3><span>IN DESIGN</span></div><div className="module-copy"><span>{m.meta}</span><p>{m.description}</p></div></div>)}</div></section>
  <footer className="home-footer"><div className="home-brand compact"><span>A</span><div><strong>AD</strong><small>LEARNING STUDIO</small></div></div><p>English for confident, professional customer interactions.</p><small>CREATED BY <b>ALEXANDRE AND MURIEL</b></small></footer>
</main>}