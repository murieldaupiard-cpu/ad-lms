"use client";

import {useState, type CSSProperties} from "react";
import {useRouter} from "next/navigation";
import "../../day2/method/method.css";
import "./guide.css";
import {FICHE} from "@/lib/call-scenarios";

// AD · Exam Prep Part 2 · Module 01 — présentation du guide apprenant et de la grille d'évaluation
// (documents de Muriel, téléchargeables), avant les mises en situation d'appel en direct.

const GUIDE = [
  {n: 1, color: "#2e8b6a", icon: "🤝", title: "Accueillir", text: "Saluez de façon professionnelle, nommez l’entreprise et proposez votre aide.", phrases: ["Good morning / afternoon, Primevère, [your name] speaking. How may I help you?"]},
  {n: 2, color: "#3b7fd1", icon: "🪪", title: "Identifier l’appelant", text: "Demandez le nom et l’entreprise de l’appelant. Faites épeler le nom (ou vérifiez son orthographe).", phrases: ["May I have your name, please?", "Which company are you calling from?", "Could you spell your name, please?"]},
  {n: 3, color: "#8a5bd6", icon: "↪️", title: "Orienter l’appel / prendre un message", text: "Orientez l’appel vers la personne demandée ou, si elle n’est pas disponible, proposez de prendre un message.", phrases: ["I’m sorry, [name] is not available at the moment. May I take a message?"]},
  {n: 4, color: "#e2772e", icon: "📄", title: "Comprendre le motif de l’appel", text: "Écoutez attentivement, posez des questions si besoin pour bien comprendre et obtenir toutes les informations.", phrases: ["Could you tell me what the call is about?", "Could you give me some more details, please?", "Do you have a specific request?"], example: "Exemple MES 1 : When was the delivery due? When did you receive it? How many boxes were damaged?"},
  {n: 5, color: "#e0527a", icon: "📞", title: "Vérifier les coordonnées et reformuler", text: "Demandez le numéro de téléphone et/ou l’email, et relisez-les à l’appelant pour vérifier, ainsi que les informations principales.", phrases: ["May I have your phone number, please?", "Could I have your email address, please?", "Let me read that back to you: [phone number / email address]", "Is that correct?"]},
  {n: 6, color: "#e8b62c", icon: "🕑", title: "Prendre en compte la demande et s’engager", text: "Montrez que vous avez bien compris la demande (et son urgence le cas échéant) et expliquez la suite donnée.", phrases: ["I understand your request.", "I’ll make sure [name] gets your message, and I’ll ask him/her to call you back as soon as possible."]},
  {n: 7, color: "#2e8b6a", icon: "🏁", title: "Clôturer l’appel", text: "Vérifiez qu’il n’y a pas d’autre information, remerciez et prenez congé.", phrases: ["Is there anything else I can help you with?", "Thank you for your call.", "Goodbye."]},
  {n: 8, color: "#3b7fd1", icon: "🇬🇧", title: "Anglais professionnel", text: "Parlez anglais du début à la fin, sur un ton poli, clair et adapté à un appel professionnel.", phrases: ["Certainly.", "Of course.", "I understand.", "Just a moment, please.", "Have a nice day."]},
];

const NOT_UNDERSTOOD = ["Sorry, could you repeat that, please?", "Could you speak more slowly, please?", "Could you spell that, please?", "Sorry, I didn’t catch that.", "Could you hold on a moment, please? (pour prendre le temps de noter)"];
const CONSEILS = ["Parlez anglais du début à la fin.", "Soyez poli(e), clair(e) et professionnel(le).", "Prenez des notes pendant l’appel.", "Vérifiez toujours les informations en les relisant à l’appelant.", "Restez calme et courtois(e), même si vous ne comprenez pas tout."];
const EVITER = ["Ne pas faire semblant si vous ne comprenez pas.", "Ne pas couper la parole.", "Ne pas oublier de vérifier les coordonnées.", "Ne pas promettre de rappeler vous-même.", "Ne pas parler en français pendant l’appel."];

const GRILLE = [
  {n: 1, title: "Accueil", text: "Salue de façon professionnelle, donne son nom, nomme l’entreprise (Primevère) et propose son aide.", required: true},
  {n: 2, title: "Identification de l’appelant", text: "Demande le nom et l’entreprise de l’appelant, fait épeler le nom (ou vérifie son orthographe)."},
  {n: 3, title: "Orientation de l’appel / prise de message", text: "Oriente l’appel vers la personne demandée ou, si celle-ci n’est pas disponible, propose de prendre un message."},
  {n: 4, title: "Compréhension du motif de l’appel", text: "Comprend la raison de l’appel en posant des questions et/ou en reformulant pour vérifier."},
  {n: 5, title: "Coordonnées vérifiées et informations reformulées", text: "Demande le numéro de téléphone et/ou l’email, relit et vérifie les coordonnées, et reformule l’ensemble des informations principales de l’appel.", required: true},
  {n: 6, title: "Prise en compte de la demande et engagement", text: "Prend en compte la demande (et son urgence le cas échéant) et s’engage sur la suite donnée (transmission du message, rappel par la personne concernée…)."},
  {n: 7, title: "Clôture", text: "Vérifie qu’il n’y a pas d’autre information, remercie et prend congé."},
  {n: 8, title: "Anglais professionnel", text: "S’exprime en anglais du début à la fin, sur un ton poli, clair et adapté à un appel professionnel."},
  {n: 9, title: "Fiche de renseignements complète et exacte", text: "Renseigne toutes les informations demandées (au plus 1 champ faux ou manquant), avec le nom de l’appelant et au moins un moyen de contact correctement renseignés."},
  {n: 10, title: "Message transmis au bon destinataire", text: "Adresse le message à la bonne personne dans l’entreprise."},
];

const STEP_TITLES = ["Bienvenue", "L’épreuve", "Le guide de l’appel", "Quand vous n’avez pas compris", "La fiche de renseignements", "La grille d’évaluation", "Terminé"];
const STEP_DESCRIPTIONS = ["", "Ce qui est évalué et comment se passent les MES", "Les 8 étapes d’un appel réussi et les phrases utiles", "Demander de l’aide, les conseils clés et les erreurs à éviter", "Ce que vous notez pendant l’appel, et le destinataire", "Les 10 critères et les conditions de réussite"];
const LAST = STEP_TITLES.length;

function Poster({href, title, text, label}: {href: string; title: string; text: string; label: string}) {
  return (
    <div className="vm-poster-panel">
      <div>
        <span>SUPPORT À TÉLÉCHARGER</span>
        <h2>{title}</h2>
        <p>{text}</p>
        <a href={href} download>{label} ↓</a>
      </div>
      <object data={`${href}#toolbar=0&navpanes=0&view=FitH`} type="application/pdf" aria-label={`Aperçu : ${title}`}>
        <a href={href}>Ouvrir le PDF</a>
      </object>
    </div>
  );
}

export default function PhoneMethodModule() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const go = (n: number) => { setStep(Math.max(1, Math.min(LAST, n))); window.scrollTo({top: 0, behavior: "smooth"}); };

  return (
    <main className="vm-page ad-guide">
      <div className="vm-shell">
        <header className="vm-top">
          <div><span>AD · EXAM PREP PART 2 · MODULE 01</span><strong>L’APPEL TÉLÉPHONIQUE EN ANGLAIS</strong></div>
          <div className="vm-progress"><i><em style={{width: `${(step / LAST) * 100}%`}}/></i><small>STEP {step} / {LAST}</small></div>
          <button onClick={() => router.push("/exam-prep-2")}>EXIT</button>
        </header>

        {step === 1 && (
          <section className="vm-card vm-welcome">
            <span>BIENVENUE</span>
            <h1>Le guide et la grille</h1>
            <p>Avant de décrocher, découvrez comment mener un appel professionnel en anglais, étape par étape, et comment il sera évalué. Vous pouvez télécharger le guide et la grille pour les garder sous les yeux pendant vos MES.</p>
            <div className="vm-meta">
              <div><b>📖</b><span>LECTURE<small>PAS D’EXERCICE ICI</small></span></div>
              <div><b>🗂️</b><span>5 SECTIONS<small>~10 MIN DE LECTURE</small></span></div>
              <div><b>☎️</b><span>ENSUITE<small>LES MES EN DIRECT</small></span></div>
            </div>
            <div className="vm-steps">
              <h2>AU PROGRAMME</h2>
              {STEP_TITLES.slice(1, LAST - 1).map((title, i) => (
                <button key={title} onClick={() => go(i + 2)}>
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  <span><strong>{title}</strong><small>{STEP_DESCRIPTIONS[i + 1]}</small></span>
                  <em>→</em>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="vm-card">
            <div className="vm-heading">
              <span>REAC TP AD (MILLÉSIME 04) · CP4</span>
              <h1>Assurer l’interface orale entre l’équipe de direction et les interlocuteurs internes et externes</h1>
              <p>Épreuve : appel téléphonique en anglais et prise de message.</p>
            </div>
            <h3 className="vm-subheading">Comment se passe une MES sur la plateforme</h3>
            <div className="vm-steps-flow">
              <div className="vm-flow-step"><b>☎️</b><strong>Le téléphone sonne</strong><p>Vous décrochez : un interlocuteur étranger, joué par l’IA, vous parle en direct, en anglais.</p></div>
              <div className="vm-flow-step"><b>📝</b><strong>Vous menez l’appel</strong><p>Vous suivez les 8 étapes du guide et remplissez la fiche de renseignements pendant l’appel.</p></div>
              <div className="vm-flow-step"><b>📨</b><strong>Vous transmettez</strong><p>Vous choisissez le bon destinataire dans l’organigramme de Primevère, puis vous obtenez votre correction selon la grille.</p></div>
            </div>
            <div className="vm-criterion">
              <span>POUR RÉUSSIR</span>
              <p>Au moins 6 critères sur 10 validés, dont obligatoirement le critère 1 (Accueil) et le critère 5 (Coordonnées vérifiées et informations reformulées).</p>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="vm-card">
            <div className="vm-heading">
              <span>GUIDE APPRENANT</span>
              <h1>Les 8 étapes d’un appel réussi</h1>
              <p>Chaque étape correspond à un critère de la grille. Entraînez-vous à dire les phrases à voix haute.</p>
            </div>
            <div className="ad-steps">
              {GUIDE.map(g => (
                <article key={g.n} style={{"--c": g.color} as CSSProperties}>
                  <b className="ad-num">{g.n}</b>
                  <div className="ad-body">
                    <h3><span aria-hidden="true">{g.icon}</span> {g.title}</h3>
                    <p>{g.text}</p>
                  </div>
                  <ul className="ad-phrases" lang="en">
                    {g.phrases.map(p => <li key={p}>“{p}”</li>)}
                    {g.example && <li className="ad-example">{g.example}</li>}
                  </ul>
                  <small className="ad-crit">Critère {g.n}</small>
                </article>
              ))}
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="vm-card">
            <div className="vm-heading">
              <span>GUIDE APPRENANT</span>
              <h1>Quand vous n’avez pas compris</h1>
              <p>Restez poli(e) et demandez de l’aide : c’est normal, et c’est exactement ce que fait un(e) professionnel(le).</p>
            </div>
            <div className="ad-boxes">
              <div className="ad-box purple"><h3>❓ Demander de l’aide</h3><ul lang="en">{NOT_UNDERSTOOD.map(p => <li key={p}>“{p.replace(" (pour prendre le temps de noter)", "")}”{p.includes("(") && <small lang="fr"> pour prendre le temps de noter</small>}</li>)}</ul></div>
              <div className="ad-box green"><h3>💡 Conseils clés</h3><ul>{CONSEILS.map(p => <li key={p}>{p}</li>)}</ul></div>
              <div className="ad-box red"><h3>⚠️ À éviter</h3><ul>{EVITER.map(p => <li key={p}>{p}</li>)}</ul></div>
            </div>
            <Poster href="/exam-prep-2/guide-accueil-telephonique.pdf" title="Guide apprenant : appel téléphonique en anglais" text="Les 8 étapes, les phrases utiles, les conseils et les erreurs à éviter sur une seule page. Gardez-le à côté de vous pendant vos MES." label="TÉLÉCHARGER LE GUIDE PDF"/>
          </section>
        )}

        {step === 5 && (
          <section className="vm-card">
            <div className="vm-heading">
              <span>PENDANT L’APPEL</span>
              <h1>La fiche de renseignements</h1>
              <p>Vous la remplissez en français pendant l’appel. La fonction de l’appelant doit être notée en français. Puis vous choisissez le destinataire du message.</p>
            </div>
            <div className="vm-fiche">
              {FICHE.map(f => (
                <div className="vm-fiche-row" key={f.key}><span className="vm-fiche-label">{f.label}</span><span className="vm-fiche-hint"/><span className="vm-fiche-blank"/></div>
              ))}
              <div className="vm-fiche-row ad-recipient"><span className="vm-fiche-label">Destinataire du message</span><span className="vm-fiche-hint">Organigramme Primevère</span><span className="vm-fiche-blank"/></div>
            </div>
            <div className="vm-criterion">
              <span>CRITÈRES 9 ET 10</span>
              <p>La fiche est validée avec au plus 1 champ faux ou manquant, si le nom de l’appelant et au moins un moyen de contact sont exacts. Le destinataire doit être la bonne personne dans l’entreprise.</p>
            </div>
          </section>
        )}

        {step === 6 && (
          <section className="vm-card">
            <div className="vm-heading">
              <span>GRILLE D’ÉVALUATION · MES AD</span>
              <h1>Comment votre appel sera évalué</h1>
              <p>10 critères, chacun acquis ou non acquis. Les critères 1 à 8 portent sur l’appel, les critères 9 et 10 sur la prise de message.</p>
            </div>
            <ol className="ad-grille">
              {GRILLE.map(g => (
                <li key={g.n}>
                  <b>{g.n}</b>
                  <div><strong>{g.title}{g.required && <em>OBLIGATOIRE</em>}</strong><p>{g.text}</p></div>
                  <div className="vm-grille-marks" aria-hidden="true"><i className="ok"/><i className="no"/></div>
                </li>
              ))}
            </ol>
            <div className="ad-success">
              <span>🎯 CONDITIONS DE RÉUSSITE</span>
              <p>L’épreuve est <b>ACQUISE</b> si au moins <b>6 critères sur 10</b> sont validés, <b>et</b> si les critères <b>1 (Accueil)</b> et <b>5 (Coordonnées vérifiées et informations reformulées)</b> sont validés.</p>
            </div>
            <Poster href="/exam-prep-2/grille-evaluation-mes-ad.pdf" title="Grille d’évaluation : MES AD" text="La grille officielle utilisée pour corriger chaque appel. Utilisez-la pour vous auto-évaluer après chaque MES." label="TÉLÉCHARGER LA GRILLE PDF"/>
          </section>
        )}

        {step === LAST && (
          <section className="vm-card vm-done">
            <div className="vm-award">★</div>
            <span>MODULE 01 TERMINÉ</span>
            <h1>Vous êtes prêt(e) à décrocher.</h1>
            <p>Gardez le guide sous les yeux et lancez votre première mise en situation.</p>
            <button className="vm-primary" onClick={() => router.push("/exam-prep-2/mes/1")}>COMMENCER LA MES 1 →</button>
            <button className="ad-secondary" onClick={() => router.push("/exam-prep-2")}>RETOUR À EXAM PREP PART 2</button>
          </section>
        )}

        {step > 1 && step < LAST && (
          <footer className="vm-footer">
            <button onClick={() => go(step - 1)}>‹ PRÉCÉDENT</button>
            <span>{STEP_TITLES[step - 1].toUpperCase()}</span>
            <button className="vm-primary" onClick={() => go(step + 1)}>{step === LAST - 1 ? "TERMINER →" : "SUIVANT →"}</button>
          </footer>
        )}
      </div>
    </main>
  );
}
