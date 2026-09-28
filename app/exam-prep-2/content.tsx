// Contenu des chapitres 1 (grille) et 2 (guide) d'Exam Prep Part 2, repris des documents de Muriel.

export const GUIDE = [
  {n: 1, color: "#2e8b6a", icon: "🤝", title: "Accueillir", text: "Saluez de façon professionnelle, nommez l’entreprise et proposez votre aide.", phrases: ["Good morning / afternoon, Primevère, [your name] speaking. How may I help you?"]},
  {n: 2, color: "#3b7fd1", icon: "🪪", title: "Identifier l’appelant", text: "Demandez le nom et l’entreprise de l’appelant. Faites épeler le nom (ou vérifiez son orthographe).", phrases: ["May I have your name, please?", "Which company are you calling from?", "Could you spell your name, please?"]},
  {n: 3, color: "#8a5bd6", icon: "↪️", title: "Orienter l’appel / prendre un message", text: "Orientez l’appel vers la personne demandée ou, si elle n’est pas disponible, proposez de prendre un message.", phrases: ["I’m sorry, [name] is not available at the moment. May I take a message?"]},
  {n: 4, color: "#e2772e", icon: "📄", title: "Comprendre le motif de l’appel", text: "Écoutez attentivement, posez des questions si besoin pour bien comprendre et obtenir toutes les informations.", phrases: ["Could you tell me what the call is about?", "Could you give me some more details, please?", "Do you have a specific request?"], example: "Exemple MES 1 : When was the delivery due? When did you receive it? How many boxes were damaged?"},
  {n: 5, color: "#e0527a", icon: "📞", title: "Vérifier les coordonnées et reformuler", text: "Demandez le numéro de téléphone et/ou l’email, et relisez-les à l’appelant pour vérifier, ainsi que les informations principales.", phrases: ["May I have your phone number, please?", "Could I have your email address, please?", "Let me read that back to you: [phone number / email address]", "Is that correct?"]},
  {n: 6, color: "#e8b62c", icon: "🕑", title: "Prendre en compte la demande et s’engager", text: "Montrez que vous avez bien compris la demande (et son urgence le cas échéant) et expliquez la suite donnée.", phrases: ["I understand your request.", "I’ll make sure [name] gets your message, and I’ll ask him/her to call you back as soon as possible."]},
  {n: 7, color: "#2e8b6a", icon: "🏁", title: "Clôturer l’appel", text: "Vérifiez qu’il n’y a pas d’autre information, remerciez et prenez congé.", phrases: ["Is there anything else I can help you with?", "Thank you for your call.", "Goodbye."]},
  {n: 8, color: "#3b7fd1", icon: "🇬🇧", title: "Anglais professionnel", text: "Parlez anglais du début à la fin, sur un ton poli, clair et adapté à un appel professionnel.", phrases: ["Certainly.", "Of course.", "I understand.", "Just a moment, please.", "Have a nice day."]},
];

export const NOT_UNDERSTOOD = ["Sorry, could you repeat that, please?", "Could you speak more slowly, please?", "Could you spell that, please?", "Sorry, I didn’t catch that.", "Could you hold on a moment, please? (pour prendre le temps de noter)"];
export const CONSEILS = ["Parlez anglais du début à la fin.", "Soyez poli(e), clair(e) et professionnel(le).", "Prenez des notes pendant l’appel.", "Vérifiez toujours les informations en les relisant à l’appelant.", "Restez calme et courtois(e), même si vous ne comprenez pas tout."];
export const EVITER = ["Ne pas faire semblant si vous ne comprenez pas.", "Ne pas couper la parole.", "Ne pas oublier de vérifier les coordonnées.", "Ne pas promettre de rappeler vous-même.", "Ne pas parler en français pendant l’appel."];

export const GRILLE = [
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


export const GUIDE_PDF = "/exam-prep-2/guide-accueil-telephonique.pdf";
export const GRILLE_PDF = "/exam-prep-2/grille-evaluation-mes-ad.pdf";

export function Poster({href, title, text, label}: {href: string; title: string; text: string; label: string}) {
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

