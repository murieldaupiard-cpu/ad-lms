"use client";

import {useState} from "react";
import Link from "next/link";
import "../../day4/ecf/ecf.css";

const steps = [
  {number:"01",title:"Écouter",text:"Repérer qui appelle, pour quelle entreprise et à propos de quel événement."},
  {number:"02",title:"Comprendre",text:"Identifier le problème, ce qui était prévu et le degré d’urgence."},
  {number:"03",title:"Noter",text:"Vérifier les noms, la fonction, le téléphone et l’adresse email sans interpréter."},
  {number:"04",title:"Orienter",text:"Croiser la demande avec l’organigramme pour choisir le bon destinataire."},
  {number:"05",title:"Transmettre",text:"Rédiger un email clair en français : faits, urgence, coordonnées et action attendue."},
];

export default function Day5Preparation(){
 const [ready,setReady]=useState(false);
 return <main className="ecf-page"><header className="ecf-top"><div><span>DAY 06 · MODULE 01</span><strong>AVANT L’ÉPREUVE</strong></div><div className="ecf-stages"><span className={ready?"done":"active"}><b>1</b>Se recentrer</span><span className={ready?"active":""}><b>2</b>Être prêt·e</span></div><Link href="/day5">EXIT</Link></header>
 <section className="ecf-shell">{!ready?<div className="ecf-calm"><div className="ecf-calm-copy"><span>5 MINUTES · NON ÉVALUÉ</span><h1>Retrouver ses repères.</h1><p>Ce sas ne donne aucune réponse au sujet. Il remet simplement en mémoire la méthode déjà travaillée pour aborder l’ECF avec calme.</p><div className="ecf-breathe"><i/><div><strong>Inspirer. Expirer.</strong><small>Lire les consignes avant de lancer l’audio.</small></div></div></div><div className="ecf-checks">{steps.map(s=><article key={s.number}><b>{s.number}</b><div><h3>{s.title}</h3><p>{s.text}</p></div></article>)}<button onClick={()=>{setReady(true);window.scrollTo({top:0,behavior:"smooth"})}}>J’AI RETROUVÉ LA MÉTHODE <b>→</b></button></div></div>:<div className="ecf-instructions"><div className="ecf-heading"><span>DERNIERS REPÈRES</span><h1>Tu n’as pas à tout comprendre.</h1><p>Tu dois rendre le message exploitable pour la bonne personne, avec des informations exactes et une formulation professionnelle.</p></div><div className="ecf-parts"><article><b>PENDANT L’ÉCOUTE</b><h2>Des mots-clés, pas des phrases</h2><p>Nom, fonction, entreprise, événement, problème, service attendu, urgence, téléphone et email.</p></article><article><b>AVANT L’ENVOI</b><h2>La vérification finale</h2><p>Bon destinataire, objet précis, faits fidèles, action demandée et coordonnées complètes. Ne propose pas toi-même une solution.</p></article></div><div className="ecf-rules"><span>Message en français</span><span>Ton formel</span><span>Transmission fidèle</span><span>30 minutes au total</span></div><Link className="ecf-primary link" href="/day5">RETOUR AU DAY 5</Link></div>}</section></main>
}