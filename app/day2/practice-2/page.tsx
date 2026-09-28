"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "../practice/practice.css";

type Key="firstName"|"lastName"|"job"|"company"|"city"|"country"|"reason"|"request"|"countryCode"|"phone"|"email";
const labels:Record<Key,string>={firstName:"Prénom",lastName:"Nom",job:"Fonction",company:"Entreprise",city:"Ville",country:"Pays",reason:"Motif de l’appel",request:"Demande et action attendue",countryCode:"Indicatif international",phone:"Numéro de téléphone",email:"Adresse email"};
const answers:Record<Key,string>={firstName:"Sophia",lastName:"Larsen",job:"Responsable des ventes",company:"Nordic Beauty House",city:"Copenhague",country:"Danemark",reason:"Intérêt pour les produits cosmétiques biologiques de Primevère, particulièrement les soins naturels",request:"Informations sur les produits, prix et livraison ; rappel ou disponibilités pour une conférence téléphonique",countryCode:"+45",phone:"22 34 56 78",email:"sophia.larsen@nordicbeauty.dk"};
const keys=Object.keys(labels) as Key[];
const norm=(v:string)=>v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9@+]+/g," ").trim();
const digits=(v:string)=>v.replace(/\D/g,"");
function correct(k:Key,value:string){const v=norm(value);if(!v)return false;if(k==="countryCode")return digits(value)==="45";if(k==="phone")return ["22345678","022345678"].includes(digits(value));if(k==="email")return value.toLowerCase().replace(/\s/g,"")===answers.email;const tests:Record<Exclude<Key,"countryCode"|"phone"|"email">,string[][]>={firstName:[["sophia"]],lastName:[["larsen"]],job:[["responsable","ventes"]],company:[["nordic","beauty","house"]],city:[["copenhague"]],country:[["danemark"]],reason:[["cosmetiques","biologiques"],["soins","naturels"]],request:[["produits","prix","livraison"],["conference","telephonique"]]};return tests[k].some(g=>g.every(t=>v.includes(norm(t))))}
function remediation(key: Key, value: string) {
  const response = norm(value);
  const expected = norm(answers[key]);
  const letters = (text: string) => norm(text).replace(/[^a-z]/g, "");
  const learnerLetters = letters(value);
  const expectedLetters = letters(answers[key]);

  if (key === "email") {
    if (!value.includes("@")) return "Le symbole @ manque. Dans une adresse email, il sépare le nom de l’utilisateur du domaine.";
    if (!value.slice(value.indexOf("@") + 1).includes(".")) return "Le point du nom de domaine manque. Réécoute la fin de l’adresse et vérifie le symbole « dot ».";
  }

  if (key === "email" || key === "firstName" || key === "lastName") {
    const limit = Math.min(learnerLetters.length, expectedLetters.length);
    const differences = Array.from({ length: limit }, (_, index) => index).filter((index) => learnerLetters[index] !== expectedLetters[index]);
    if (learnerLetters.length === expectedLetters.length && differences.length === 1) {
      const index = differences[0];
      const heard = learnerLetters[index].toUpperCase();
      const wanted = expectedLetters[index].toUpperCase();
      if ("AEIOUY".includes(heard) && "AEIOUY".includes(wanted)) return `Tu as remplacé la voyelle ${wanted} par ${heard}. Réécoute uniquement ces deux voyelles anglaises, puis vérifie le mot lettre par lettre.`;
      if (new Set([heard, wanted]).size === 2 && [heard, wanted].every((letter) => ["G", "J"].includes(letter))) return `Tu as confondu G et J. En anglais, G se prononce « dji » et J « djeï ». Réécoute la lettre concernée, puis vérifie le mot.`;
      return `Une lettre a été confondue : ${wanted} a été remplacé par ${heard}. Réécoute cette lettre précise, puis contrôle le mot complet.`;
    }
    if (learnerLetters.length < expectedLetters.length) return `Il manque ${expectedLetters.length - learnerLetters.length} lettre(s). Réécoute l’épellation et coche chaque lettre au fur et à mesure.`;
    if (learnerLetters.length > expectedLetters.length) return `Tu as ajouté ${learnerLetters.length - expectedLetters.length} lettre(s). Compare la réponse et la correction caractère par caractère.`;
    return "Plusieurs lettres diffèrent. Réécoute l’épellation par petits groupes et vérifie chaque groupe avant de continuer.";
  }

  if (key === "countryCode" || key === "phone") {
    const learnerDigits = digits(value);
    const expectedDigits = digits(answers[key]);
    if (learnerDigits.slice(1) === expectedDigits && learnerDigits.startsWith("0")) return "Le zéro initial a bien été entendu : il est accepté lorsqu’il est prononcé dans l’audio.";
    if (learnerDigits.length < expectedDigits.length) return `Il manque ${expectedDigits.length - learnerDigits.length} chiffre(s). Réécoute le numéro groupe par groupe et note chaque groupe séparément.`;
    if (learnerDigits.length > expectedDigits.length) return `Il y a ${learnerDigits.length - expectedDigits.length} chiffre(s) en trop. Vérifie le début du numéro et chaque groupe prononcé.`;
    const changed = [...expectedDigits].filter((digit, index) => learnerDigits[index] !== digit);
    if (changed.length === 2 && [...learnerDigits].sort().join("") === [...expectedDigits].sort().join("")) return "Deux chiffres ont été inversés. Réécoute le groupe concerné, puis répète-le avant de l’écrire.";
    return "Un ou plusieurs chiffres ont été confondus. Réécoute chaque groupe, répète-le à voix haute, puis vérifie sa position.";
  }

  const required: Partial<Record<Key, string[]>> = {
    job: ["responsable", "export"],
    company: ["Nordic", "Bloom", "Cosmetics"],
    city: ["Copenhague"],
    country: ["Danemark"],
    reason: ["produits cosmétiques biologiques", "soins du visage", "soins du corps"],
    request: ["informations", "prix", "livraison", "partenariat", "entretien téléphonique", "24 juin", "10 h"],
  };
  const missing = (required[key] ?? []).filter((term) => !response.includes(norm(term)));
  if (missing.length) return `Ta réponse ne restitue pas encore : ${missing.join(", ")}. Réécoute le passage en ciblant uniquement ces informations, puis reformule-les en français.`;
  if (response !== expected) return "L’information est comprise, mais elle doit être reformulée plus précisément en français professionnel.";
  return "Réécoute le passage concerné et compare ta formulation avec la correction.";
}

const steps=["Mission","Écoute","Correction","Email","Bilan"];

export default function PracticeTwo(){
 const audio=useRef<HTMLAudioElement>(null);const [step,setStep]=useState(1);const [max,setMax]=useState(1);
 const [form,setForm]=useState<Record<Key,string>>(Object.fromEntries(keys.map(k=>[k,""])) as Record<Key,string>);const [checked,setChecked]=useState(false);
 const [recipient,setRecipient]=useState("");const [subject,setSubject]=useState("");const [message,setMessage]=useState("");const [sent,setSent]=useState(false);
 const results=useMemo(()=>Object.fromEntries(keys.map(k=>[k,correct(k,form[k])])) as Record<Key,boolean>,[form]);
 const body=norm(message),identity=results.firstName&&results.lastName,context=results.job&&results.company&&results.city&&results.country,reason=results.reason&&results.request,phone=results.countryCode&&results.phone;
 const goodRecipient=norm(recipient).includes("salu"),goodSubject=["demande","information","prospect","disponibilite","rappel"].some(t=>norm(subject).includes(t));
 const faithful=["sophia","larsen","nordic","beauty"].every(t=>body.includes(t))&&(body.includes("prix")||body.includes("tarif"))&&body.includes("livraison");
 const professional=message.trim().length>=170&&(body.includes("bonjour")||body.includes("monsieur"))&&(body.includes("cordialement")||body.includes("bien cordialement"));
 const complete=faithful&&(message.includes("+45")||message.toLowerCase().includes(answers.email))&&(body.includes("conference")||body.includes("rappel")||body.includes("disponibilite"));
 const grid=[identity,context,reason,phone,results.email,goodRecipient,goodSubject,faithful,professional,complete];const count=grid.filter(Boolean).length;const verdict=count>=8&&grid[2]&&grid[3]&&grid[4]&&grid[5]?"ACQUIS":"NON ACQUIS";
 const criteria=["Identifie correctement le prénom et le nom.","Identifie l’entreprise, la fonction et la localisation.","Comprend le motif et l’action attendue.","Relève exactement l’indicatif et le numéro.","Relève exactement l’adresse électronique.","Adresse l’email au bon destinataire.","Rédige un objet clair et pertinent.","Transmet fidèlement les informations essentielles.","Rédige un email structuré, clair et professionnel.","Produit en 30 minutes un message complet et exploitable."];
 const go=(n:number)=>{setStep(n);setMax(v=>Math.max(v,n));window.scrollTo({top:0,behavior:"smooth"})};
 const seek=(s:number)=>{const a=audio.current;if(!a)return;const end=Number.isFinite(a.duration)?a.duration:a.currentTime+Math.max(0,s);a.currentTime=Math.min(end,Math.max(0,a.currentTime+s))};
 return <main className="vp-page vp-page-two"><header className="vp-top"><div><span>CADGA · MODULE 05</span><strong>VOICEMAIL PRACTICE 02</strong></div><div className="vp-progress"><i><em style={{width:`${step/5*100}%`}}/></i><small>ÉTAPE {step} / 5</small></div><Link href="/day2">EXIT</Link></header>
 <nav className="vp-step-tabs vp-five-tabs">{steps.map((s,i)=>{const n=i+1;return <button key={s} className={step===n?"active":n<step?"done":""} disabled={n>max} onClick={()=>go(n)}><b>{String(n).padStart(2,"0")}</b><span>{s}</span></button>})}</nav><section className="vp-card">
 {step===1&&<div className="vp-welcome"><div className="vp-welcome-hero"><div><span>ENTRAÎNEMENT AUTONOME</span><h1>Voicemail Practice 02</h1><p>Applique seul(e) la méthode complète : écouter, relever, cibler et transmettre.</p></div><aside><small>MISSION</small><strong>ÉCOUTER</strong><i>→</i><strong>TRANSMETTRE</strong><div><b>30</b><span>MINUTES<br/>AU TOTAL</span></div></aside></div><div className="vp-two-parts"><article><b>15 MIN</b><h2>Partie 1 · Écoute</h2><p>Complète les onze informations sans consulter la correction.</p></article><article><b>15 MIN</b><h2>Partie 2 · Email</h2><p>Choisis le destinataire et transmets le message en français.</p></article></div><p className="vp-note">À la fin, les 10 critères sont complétés et le résultat global est prononcé : Acquis ou Non acquis.</p></div>}
 {step===2&&<div id="audio-2"><div className="vp-heading"><span>PARTIE 1 · 15 MINUTES</span><h1>Écoute et complète la fiche</h1><p>Tu peux mettre sur pause, revenir en arrière et avancer librement.</p></div><div className="vp-audio-station"><button onClick={()=>seek(-10)}>↶ <b>10 s</b></button><audio ref={audio} className="vp-audio" controls preload="metadata" src="/day2/voicemail-2.m4a"/><button onClick={()=>seek(10)}><b>10 s</b> ↷</button></div><div className="vp-form">{keys.map(k=><label key={k}><span>{labels[k]}</span>{k==="reason"||k==="request"?<textarea value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/>:<input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/>}</label>)}</div><button className="vp-primary vp-submit" disabled={keys.some(k=>!form[k].trim())} onClick={()=>{setChecked(true);go(3)}}>VALIDER MA FICHE</button></div>}
 {step===3&&<div><div className="vp-heading"><span>CORRECTION DE LA PARTIE 1</span><h1>Analyse et remédiation</h1><p>{Object.values(results).filter(Boolean).length}/{keys.length} informations correctement relevées.</p></div><div className="vp-feedback">{keys.map(k=><article className={results[k]?"good":"bad"} key={k}><div><b>{labels[k]}</b><span>{results[k]?"CORRECT":"À REVOIR"}</span></div><p><strong>Ta réponse :</strong> {form[k]||"Aucune réponse"}</p>{!results[k]&&<><p><strong>Correction :</strong> {answers[k]}</p><p>{remediation(k,form[k])}</p></>}</article>)}</div><div className="vp-poster"><Image src="/day2/voicemail-2-correction.jpg" alt="Correction du voicemail 2" width={1536} height={1024}/></div></div>}
 {step===4&&<div><div className="vp-heading"><span>PARTIE 2 · 15 MINUTES</span><h1>Cible et rédige le message</h1><p>Choisis le bon destinataire et rédige l’email en français.</p></div><div className="vp-mail"><label><span>À</span><select value={recipient} onChange={e=>setRecipient(e.target.value)}><option value="">Sélectionne le destinataire</option><option>J. Salu · Responsable des Ventes</option><option>L. Martin · Ressources humaines</option><option>A. Morel · Comptabilité</option><option>C. Robert · Production</option></select></label><label><span>Objet</span><input value={subject} onChange={e=>setSubject(e.target.value)}/></label><textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder={"Bonjour Monsieur Salu,\n\n..."}/></div><button className="vp-primary vp-submit" disabled={!recipient||!subject.trim()||message.trim().length<80} onClick={()=>{setSent(true);go(5)}}>ENVOYER POUR CORRECTION</button></div>}
 {step===5&&<div><div className="vp-heading"><span>BILAN FINAL</span><h1>Grille d’évaluation complétée</h1><p>{count} critères acquis sur 10.</p></div><div className="vp-final-grid">{criteria.map((text,i)=><article className={grid[i]?"good":"bad"} key={text}><b>{i+1}</b><div><h3>{text}</h3><p>{grid[i]?"Critère maîtrisé.":"Critère à retravailler."}</p></div><strong>{grid[i]?"ACQUIS":"NON ACQUIS"}</strong></article>)}</div><div className={`vp-verdict ${verdict==="ACQUIS"?"good":"bad"}`}><span>RÉSULTAT GLOBAL</span><h2>{verdict}</h2><p>{verdict==="ACQUIS"?"Tu as traité ce deuxième voicemail de façon autonome.":`Tu maîtrises ${count} critères sur 10. Reprends les points non acquis avant de recommencer.`}</p></div></div>}
 <footer className="vp-nav"><button disabled={step===1} onClick={()=>go(step-1)}>‹ PRÉCÉDENT</button><span>{steps[step-1].toUpperCase()}</span>{step===1&&<button className="vp-primary" onClick={()=>go(2)}>COMMENCER →</button>}{step===3&&checked&&<button className="vp-primary" onClick={()=>go(4)}>COMMENCER LA PARTIE 2 →</button>}{step===5&&sent&&<button className="vp-primary" onClick={()=>{setStep(2);setMax(2)}}>RECOMMENCER</button>}</footer></section></main>
}
