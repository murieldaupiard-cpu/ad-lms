import Link from "next/link";
import "../day4/day4.css";
import "./pitch-vision.css";
import {PITCH_ALL_PDF, PITCH_DOCS} from "@/lib/pitch-docs";

// Documents de l'entreprise Pitch Vision (ECF · Part 1 et Part 2), à consulter ou imprimer avant l'épreuve.
// Pendant l'appel, les mêmes documents s'ouvrent dans un panneau à côté de la fiche.
export default function PitchVision() {
  return <main className="cadga-home modules-page day4-page pv-page">
    <header className="home-nav modules-nav"><Link className="home-brand" href="/"><span>A</span><div><strong>AD</strong><small>ENGLISH LEARNING</small></div></Link><Link className="back-home" href="/days"><i>←</i> MAIN MENU</Link></header>
    <section className="home-modules">
      <div className="modules-heading"><div><span>ECF · DOCUMENTS DE L’ENTREPRISE</span><h1>Pitch Vision · Stade de France</h1><p>Pitch Vision vend de la publicité LED, des hospitalités VIP et des événements au Stade de France. Pendant l’épreuve, vous êtes assistant(e) de direction chez Pitch Vision. Prenez connaissance de ces documents avant l’appel : vous pouvez les imprimer, et ils restent aussi disponibles pendant l’appel, à côté de la fiche de renseignements (bouton « Documents Pitch Vision »).</p></div></div>
      <div className="pv-all"><a href={PITCH_ALL_PDF} target="_blank" rel="noopener">🖨 OUVRIR / IMPRIMER TOUS LES DOCUMENTS (PDF)</a><a href={PITCH_ALL_PDF} download>TÉLÉCHARGER TOUT ↓</a></div>
      <div className="pv-grid">{PITCH_DOCS.map(d => <article className="pv-doc" key={d.file}>
        <a href={`/pitch-vision/${d.file}.jpg`} target="_blank" rel="noopener"><img src={`/pitch-vision/${d.file}.jpg`} alt={d.title} loading="lazy"/></a>
        <div><h2>{d.title}</h2><p>{d.text}</p><div className="pv-actions"><a href={`/pitch-vision/${d.file}.jpg`} target="_blank" rel="noopener">AGRANDIR ↗</a><a href={`/pitch-vision/${d.file}.pdf`} target="_blank" rel="noopener">PDF À IMPRIMER ↓</a></div></div>
      </article>)}</div>
    </section>
    <footer className="home-footer"><div className="home-brand compact"><span>A</span><div><strong>AD</strong><small>LEARNING STUDIO</small></div></div><p>English for confident, professional customer interactions.</p><small>CREATED BY <b>ALEXANDRE AND MURIEL</b></small></footer>
  </main>;
}
