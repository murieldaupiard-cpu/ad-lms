import Link from "next/link";
import "../day4/day4.css";
import "./pitch-vision.css";

// Documents de l'entreprise Pitch Vision (ECF · Part 1 et Part 2), consultables pendant l'épreuve.
const DOCS = [
  {file: "annuaire", title: "Annuaire interne", text: "Noms, fonctions, emails et numéros de poste de toute l’équipe."},
  {file: "organigramme", title: "Organigramme", text: "Les services, l’équipe et l’encadré « Qui traite quoi ? » pour choisir le bon destinataire."},
  {file: "clients", title: "Tableau des clients", text: "Les clients existants, leurs contacts et la personne qui les suit (colonne « Suivi par »)."},
  {file: "catalogue", title: "Catalogue & grille tarifaire", text: "Les produits et services, les références PV-01 à PV-08, les tarifs et les conditions."},
  {file: "calendrier", title: "Calendrier 2026", text: "Les matchs, concerts et événements prévus au Stade de France."},
];

export default function PitchVision() {
  return <main className="cadga-home modules-page day4-page pv-page">
    <header className="home-nav modules-nav"><Link className="home-brand" href="/"><span>A</span><div><strong>AD</strong><small>ENGLISH LEARNING</small></div></Link><Link className="back-home" href="/days"><i>←</i> MAIN MENU</Link></header>
    <section className="home-modules">
      <div className="modules-heading"><div><span>ECF · DOCUMENTS DE L’ENTREPRISE</span><h1>Pitch Vision · Stade de France</h1><p>Pitch Vision vend de la publicité LED, des hospitalités VIP et des événements au Stade de France. Pendant l’épreuve, vous êtes assistant(e) de direction chez Pitch Vision : utilisez ces documents pour trouver le bon destinataire du message.</p></div></div>
      <div className="pv-grid">{DOCS.map(d => <article className="pv-doc" key={d.file}>
        <a href={`/pitch-vision/${d.file}.jpg`} target="_blank" rel="noopener"><img src={`/pitch-vision/${d.file}.jpg`} alt={d.title} loading="lazy"/></a>
        <div><h2>{d.title}</h2><p>{d.text}</p><div className="pv-actions"><a href={`/pitch-vision/${d.file}.jpg`} target="_blank" rel="noopener">AGRANDIR ↗</a><a href={`/pitch-vision/${d.file}.jpg`} download>TÉLÉCHARGER ↓</a></div></div>
      </article>)}</div>
    </section>
    <footer className="home-footer"><div className="home-brand compact"><span>A</span><div><strong>AD</strong><small>LEARNING STUDIO</small></div></div><p>English for confident, professional customer interactions.</p><small>CREATED BY <b>ALEXANDRE AND MURIEL</b></small></footer>
  </main>;
}
