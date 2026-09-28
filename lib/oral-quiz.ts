// Quiz oral du chapitre 2 (guide de l'appel) : une situation en français, l'apprenant répond à voix haute
// en anglais. La réponse est acceptée si chaque groupe de mots-clés est présent (une des variantes suffit).

export type OralQuestion = {id: string; step: number; situation: string; model: string; groups: string[][]};

export const ORAL_QUIZ: OralQuestion[] = [
  {id: "greet", step: 1, situation: "Le téléphone sonne. Décrochez : saluez, nommez l’entreprise, donnez votre prénom et proposez votre aide.", model: "Good morning, Primevère, [your name] speaking. How may I help you?", groups: [["good morning", "good afternoon", "hello", "good evening"], ["prim", "prima"], ["help"]]},
  {id: "name", step: 2, situation: "Demandez poliment le nom de l’appelant.", model: "May I have your name, please?", groups: [["name"]]},
  {id: "company", step: 2, situation: "Demandez de quelle entreprise il appelle.", model: "Which company are you calling from?", groups: [["company", "organisation", "organization", "firm"]]},
  {id: "spell", step: 2, situation: "Demandez-lui d’épeler son nom.", model: "Could you spell your name, please?", groups: [["spell"]]},
  {id: "absent", step: 3, situation: "La personne demandée n’est pas disponible. Dites-le et proposez de prendre un message.", model: "I’m sorry, Mr Salu is not available at the moment. May I take a message?", groups: [["not available", "unavailable", "not in", "out of the office", "away", "in a meeting", "not here", "isn't available", "is not in"], ["message"]]},
  {id: "reason", step: 4, situation: "Demandez à l’appelant l’objet de son appel.", model: "Could you tell me what the call is about?", groups: [["about", "reason", "purpose", "regarding", "concerning"]]},
  {id: "details", step: 4, situation: "Demandez-lui plus de détails.", model: "Could you give me some more details, please?", groups: [["detail", "more information", "tell me more", "explain"]]},
  {id: "phone", step: 5, situation: "Demandez son numéro de téléphone.", model: "May I have your phone number, please?", groups: [["number", "phone"]]},
  {id: "email", step: 5, situation: "Demandez son adresse email.", model: "Could I have your email address, please?", groups: [["email", "e-mail", "e mail", "mail address"]]},
  {id: "readback", step: 5, situation: "Annoncez que vous allez relire les informations pour vérifier.", model: "Let me read that back to you.", groups: [["read", "repeat", "check", "confirm", "go over"]]},
  {id: "correct", step: 5, situation: "Après avoir relu, demandez si c’est correct.", model: "Is that correct?", groups: [["correct", "right", "ok"]]},
  {id: "commit", step: 6, situation: "Engagez-vous : la personne recevra le message et le rappellera dès que possible.", model: "I’ll make sure Mr Salu gets your message, and I’ll ask him to call you back as soon as possible.", groups: [["message", "call you back", "call back", "get back to you", "return your call"], ["soon", "possible", "today", "shortly", "quickly", "make sure", "ask him", "ask her"]]},
  {id: "else", step: 7, situation: "Vérifiez qu’il n’y a rien d’autre.", model: "Is there anything else I can help you with?", groups: [["anything else", "something else", "any other"]]},
  {id: "bye", step: 7, situation: "Remerciez l’appelant et prenez congé.", model: "Thank you for your call. Goodbye.", groups: [["thank"], ["goodbye", "bye", "nice day", "good day"]]},
  {id: "repeat", step: 0, situation: "Vous n’avez pas compris : demandez de répéter.", model: "Sorry, could you repeat that, please?", groups: [["repeat", "say that again", "say it again", "pardon", "didn't catch", "did not catch", "come again"]]},
  {id: "slow", step: 0, situation: "L’appelant parle trop vite : demandez-lui de ralentir.", model: "Could you speak more slowly, please?", groups: [["slow"]]},
  {id: "hold", step: 0, situation: "Vous avez besoin d’un moment pour noter : demandez-lui de patienter.", model: "Could you hold on a moment, please?", groups: [["hold", "moment", "second", "minute", "wait"]]},
];

export function normalise(text: string) {
  return " " + text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’‘`]/g, "'").replace(/[^a-z0-9' -]+/g, " ").replace(/\s+/g, " ").trim() + " ";
}

export function missingGroups(q: OralQuestion, answer: string) {
  const text = normalise(answer);
  return q.groups.filter(g => !g.some(k => text.includes(normalise(k).trim())));
}

/** Vrai si une des transcriptions proposées par la reconnaissance vocale contient tous les groupes. */
export function acceptOral(q: OralQuestion, alternatives: string[]) {
  return alternatives.some(a => missingGroups(q, a).length === 0);
}
