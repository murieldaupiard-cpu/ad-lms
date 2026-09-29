import Link from "next/link";
import "./day4.css";

const modules = [
  { number: "01", title: "Avant l’épreuve", description: "Un sas court pour retrouver la méthode, respirer et entrer dans l’épreuve avec des repères clairs.", meta: "5 minutes · non évalué", color: "alphabet" },
  { number: "02", title: "ECF · 30 minutes", description: "Écouter, compléter la fiche de renseignements, identifier le destinataire et rédiger l’email professionnel.", meta: "2 parties · 30 minutes", color: "numbers" },
  { number: "03", title: "Correction critériée", description: "Consulter les dix critères, les éléments observés et le résultat global : Acquis ou Non acquis.", meta: "10 critères", color: "amber" },
  { number: "04", title: "Remédiation & visio", description: "Préparer l’entretien avec la formatrice grâce au diagnostic et au questionnaire d’explicitation personnalisé.", meta: "accompagnement individualisé", color: "dates" },
];

export default function Day4(){return <main className="cadga-home modules-page day4-page">
  <header className="home-nav modules-nav"><Link className="home-brand" href="/"><span>A</span><div><strong>AD</strong><small>ENGLISH LEARNING</small></div></Link><Link className="back-home" href="/days"><i>←</i> MAIN MENU</Link></header>
  <section className="home-modules"><div className="modules-heading"><div><span>DAY 05 · ECF PART 1</span><h1>Se préparer, réaliser, comprendre</h1><p>Un parcours complet, de l’entrée dans l’épreuve jusqu’à la remédiation avec la formatrice.</p></div><div className="modules-progress"><span>4 ÉTAPES DU PARCOURS</span><i><em style={{width:"100%"}}/></i></div></div>
  <div className="home-module-grid day4-grid">{modules.map(m=><Link className={`home-module ${m.color}`} href="/day4/ecf" key={m.number}><div className="module-visual"><div className="module-banner-top"><small>MODULE {m.number}</small><b>ECF</b></div><h3>{m.title}</h3><span>OPEN MODULE ↗</span></div><div className="module-copy"><span>{m.meta}</span><p>{m.description}</p><div><b>ENTRER DANS LE PARCOURS</b><i>→</i></div></div></Link>)}</div></section>
  <footer className="home-footer"><div className="home-brand compact"><span>A</span><div><strong>AD</strong><small>LEARNING STUDIO</small></div></div><p>English for confident, professional customer interactions.</p><small>CREATED BY <b>ALEXANDRE AND MURIEL</b></small></footer>
</main>}
