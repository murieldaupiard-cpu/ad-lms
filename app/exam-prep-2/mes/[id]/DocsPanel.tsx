"use client";
import {useState} from "react";
import {PITCH_ALL_PDF, PITCH_DOCS} from "@/lib/pitch-docs";

// Panneau latéral des documents Pitch Vision, consultable pendant l'appel sans quitter la page (l'appel continue).
export default function DocsPanel({open, onClose}: {open: boolean; onClose: () => void}) {
  const [tab, setTab] = useState<string>(PITCH_DOCS[0].file);
  const [zoom, setZoom] = useState(false);
  if (!open) return null;
  const doc = PITCH_DOCS.find(d => d.file === tab) ?? PITCH_DOCS[0];
  return <aside className="docs-panel" role="dialog" aria-label="Documents Pitch Vision">
    <div className="docs-head">
      <strong>📂 DOCUMENTS PITCH VISION</strong>
      <a href={PITCH_ALL_PDF} target="_blank" rel="noopener">PDF ↗</a>
      <button type="button" onClick={onClose} aria-label="Fermer les documents">✕</button>
    </div>
    <div className="docs-tabs" role="tablist">{PITCH_DOCS.map(d => <button type="button" role="tab" aria-selected={d.file === tab} className={d.file === tab ? "on" : ""} key={d.file} onClick={() => { setTab(d.file); setZoom(false); }}>{d.tab}</button>)}</div>
    <p className="docs-hint">{zoom ? "Cliquez sur le document pour revenir à la taille normale." : "Cliquez sur le document pour zoomer."}</p>
    <div className={`docs-view ${zoom ? "zoom" : ""}`}><img src={`/pitch-vision/${doc.file}.jpg`} alt={doc.title} onClick={() => setZoom(z => !z)}/></div>
  </aside>;
}
