"use client";

import {FormEvent,useMemo,useState} from "react";
import Link from "next/link";
import "./satisfaction.css";

const scale=["Pas du tout","Plutôt non","Plutôt oui","Tout à fait"];
const confidence=["Pas encore","Avec de l’aide","En autonomie","Avec assurance"];
const scaleQuestions=[
 "Le parcours de 40 heures m’a permis de progresser étape par étape sans me sentir perdu·e.",
 "Les consignes et la navigation sur la plateforme étaient suffisamment claires pour travailler en autonomie.",
 "La qualité et le débit des audios m’ont aidé·e à développer une écoute plus efficace.",
 "Les activités m’ont appris une méthode réutilisable pour traiter un message professionnel, et pas seulement à réussir un exercice.",
 "Les corrections après les mises en situation m’ont permis de comprendre précisément mes réussites et mes erreurs.",
 "L’alternance entre activités individuelles, jeux et mises en situation a soutenu ma motivation.",
 "La remédiation avec la formatrice m’a aidé·e à identifier une stratégie concrète pour progresser.",
 "Je pourrai réutiliser les acquis de cette formation dans une situation professionnelle réelle."
];
const skills=[
 "Repérer rapidement les informations essentielles dans un message vocal.",
 "Noter avec exactitude un nom, un numéro, une date, une heure ou une adresse email.",
 "Identifier le bon destinataire grâce au contexte et à l’organigramme.",
 "Transmettre en français un message fidèle, clair et professionnel.",
 "Gérer mon temps et vérifier ma production pendant une mise en situation."
];

export default function Satisfaction(){
 const total=scaleQuestions.length+skills.length+5;
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [submitted,setSubmitted]=useState(false);
 const completed=useMemo(()=>Object.values(answers).filter(v=>v.trim()).length,[answers]);
 const set=(key:string,value:string)=>setAnswers(a=>({...a,[key]:value}));
 const submit=(e:FormEvent)=>{e.preventDefault();if(completed<total)return;localStorage.setItem("cadga-satisfaction",JSON.stringify({answers,completedAt:new Date().toISOString()}));setSubmitted(true);window.scrollTo({top:0,behavior:"smooth"})};
 if(submitted)return <main className="survey-page"><header className="survey-nav"><Link href="/days">← RETOUR AU PARCOURS</Link><span>QUESTIONNAIRE TERMINÉ</span></header><section className="survey-thanks"><span>MERCI POUR VOTRE RETOUR</span><h1>Votre expérience compte.</h1><p>Vos réponses aideront à ajuster les activités, les supports et l’accompagnement proposés aux prochains groupes CADGA.</p><Link href="/days">RETOUR AU PARCOURS</Link></section></main>;
 return <main className="survey-page"><header className="survey-nav"><Link href="/days">← RETOUR AU PARCOURS</Link><div><span>{completed} / {total} RÉPONSES</span><i><em style={{width:`${Math.round(completed/total*100)}%`}}/></i></div></header>
 <section className="survey-intro"><span>EN FIN DE PARCOURS · 5 À 7 MINUTES</span><h1>Votre regard sur le parcours.</h1><p>Ce questionnaire porte sur l’expérience d’apprentissage, l’autonomie et le transfert professionnel. Il n’est pas évalué.</p></section>
 <form className="survey-form" onSubmit={submit}>
  <section><div className="survey-section-title"><b>01</b><div><h2>Expérience d’apprentissage</h2><p>Pour chaque affirmation, choisissez la réponse qui correspond le mieux à votre expérience.</p></div></div>{scaleQuestions.map((q,i)=><fieldset key={q}><legend>{q}</legend><div className="survey-options">{scale.map(x=><label key={x}><input type="radio" name={`scale-${i}`} value={x} checked={answers[`scale-${i}`]===x} onChange={()=>set(`scale-${i}`,x)} required/><span>{x}</span></label>)}</div></fieldset>)}</section>
  <section><div className="survey-section-title"><b>02</b><div><h2>Compétences mobilisables</h2><p>À la fin du parcours, où vous situez-vous aujourd’hui ?</p></div></div>{skills.map((q,i)=><fieldset key={q}><legend>{q}</legend><div className="survey-options">{confidence.map(x=><label key={x}><input type="radio" name={`skill-${i}`} value={x} checked={answers[`skill-${i}`]===x} onChange={()=>set(`skill-${i}`,x)} required/><span>{x}</span></label>)}</div></fieldset>)}</section>
  <section><div className="survey-section-title"><b>03</b><div><h2>Ce qui fera évoluer la formation</h2><p>Des réponses concrètes pour conserver ce qui fonctionne et améliorer le reste.</p></div></div>
   <label className="survey-text"><span>Quelle activité vous a réellement fait changer de méthode ou de réflexe ? Pourquoi ?</span><textarea required value={answers.change||""} onChange={e=>set("change",e.target.value)} placeholder="Décrivez un moment précis…"/></label>
   <label className="survey-text"><span>À quel moment du parcours avez-vous rencontré le plus de difficulté ?</span><textarea required value={answers.difficulty||""} onChange={e=>set("difficulty",e.target.value)} placeholder="Day, module ou type d’activité…"/></label>
   <label className="survey-text"><span>Quel élément faudrait-il absolument conserver pour les prochains groupes ?</span><textarea required value={answers.keep||""} onChange={e=>set("keep",e.target.value)} placeholder="Un support, un jeu, une méthode, un accompagnement…"/></label>
   <label className="survey-text"><span>Si une seule chose devait être améliorée sur la plateforme ou l’accompagnement, laquelle choisiriez-vous ?</span><textarea required value={answers.improve||""} onChange={e=>set("improve",e.target.value)} placeholder="Soyez aussi précis·e que possible…"/></label>
   <fieldset><legend>Recommanderiez-vous ce parcours à un futur stagiaire CADGA ?</legend><div className="survey-score">{Array.from({length:11},(_,i)=><label key={i}><input type="radio" name="recommend" value={i} checked={answers.recommend===String(i)} onChange={()=>set("recommend",String(i))} required/><span>{i}</span></label>)}</div><div className="score-ends"><span>Pas du tout</span><span>Tout à fait</span></div></fieldset>
  </section>
  <div className="survey-submit"><p>{completed===total?"Toutes les réponses sont complètes.":"Répondez à toutes les questions pour terminer."}</p><button disabled={completed<total}>VALIDER MES RÉPONSES →</button></div>
 </form></main>
}