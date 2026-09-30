import Link from "next/link";
import "./day4.css";
import "../day3/day3.css";

const modules = [
  { number: "01", title: "Découvrir Pitch Vision", description: "L’entreprise de l’épreuve : annuaire, organigramme, clients, catalogue et calendrier. À consulter avant et pendant l’appel.", meta: "5 documents · à consulter", color: "alphabet", href: "/pitch-vision", live: true, tag: "DOCUMENTS" },
  { number: "02", title: "ECF · Appel en direct", description: "Un client appelle Pitch Vision : accueillez-le en anglais, remplissez la fiche de renseignements et choisissez le bon destinataire.", meta: "chronométré · 20 minutes", color: "numbers", href: "/exam-prep-2/mes/e1", live: true, tag: "☎ ÉPREUVE" },
  { number: "03", title: "Correction critériée", description: "Juste après l’appel : les dix critères, la fiche corrigée champ par champ, le bon destinataire et le résultat Acquis ou Non acquis.", meta: "10 critères", color: "amber", href: "/exam-prep-2/mes/e1", live: true, tag: "APRÈS L’APPEL" },
  { number: "04", title: "Remédiation & visio", description: "Préparer l’entretien avec la formatrice à partir de votre correction et des critères non validés.", meta: "accompagnement individualisé", color: "dates", href: "#", live: false, tag: "" },
];

export default function Day4(){return <main className="cadga-home modules-page day4-page">
  <header className="home-nav modules-nav"><Link className="home-brand" href="/"><span>A</span><div><strong>AD</strong><small>ENGLISH LEARNING</small></div></Link><Link className="back-home" href="/days"><i>←</i> MAIN MENU</Link></header>
  <section className="home-modules"><div className="modules-heading"><div><span>DAY 05 · ECF PART 1</span><h1>Au téléphone avec Pitch Vision</h1><p>Une entreprise que vous ne connaissez pas encore, comme le jour de l’examen. Découvrez ses documents, puis prenez l’appel en direct : 20 minutes pour accueillir, noter et transmettre.</p></div><div className="modules-progress"><span>4 ÉTAPES DU PARCOURS</span><i><em style={{width:"100%"}}/></i></div></div>
  <div className="home-module-grid day4-grid">{modules.map(m=>m.live?<Link className={`home-module ${m.color}`} href={m.href} key={m.number}><div className="module-visual"><div className="module-banner-top"><small>MODULE {m.number}</small><b>{m.tag}</b></div><h3>{m.title}</h3><span>OPEN MODULE ↗</span></div><div className="module-copy"><span>{m.meta}</span><p>{m.description}</p><div><b>ENTRER DANS LE MODULE</b><i>→</i></div></div></Link>:<div className={`home-module ${m.color} day3-soon`} key={m.number} aria-disabled="true"><div className="module-visual"><div className="module-banner-top"><small>MODULE {m.number}</small><b>AVEC LA FORMATRICE</b></div><h3>{m.title}</h3><span>EN SÉANCE</span></div><div className="module-copy"><span>{m.meta}</span><p>{m.description}</p></div></div>)}</div></section>
  <footer className="home-footer"><div className="home-brand compact"><span>A</span><div><strong>AD</strong><small>LEARNING STUDIO</small></div></div><p>English for confident, professional customer interactions.</p><small>CREATED BY <b>ALEXANDRE AND MURIEL</b></small></footer>
</main>}
