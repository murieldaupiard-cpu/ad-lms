// Exam Prep · Part 2 — mises en situation d'accueil téléphonique avec un appelant joué par l'IA (ElevenLabs Agents).
// Chaque MES : le rôle secret de l'appelant (prompt), la fiche attendue, le bon destinataire et les critères
// d'évaluation de l'appel. bank: true = MES de la Banque de préparation ECF (étape 06), sinon Exam Prep Part 2. Référence de la MES 1 : « MES 1 – Appel téléphonique » de Muriel (Lush Cosmetics Ltd).

export type FicheKey = "firstName" | "lastName" | "job" | "company" | "city" | "country" | "address" | "reason" | "action" | "countryCode" | "phone" | "email";
export const FICHE: {key: FicheKey; label: string; wide?: boolean}[] = [
  {key: "firstName", label: "Prénom"},
  {key: "lastName", label: "Nom"},
  {key: "job", label: "Fonction"},
  {key: "company", label: "Entreprise"},
  {key: "city", label: "Ville"},
  {key: "country", label: "Pays"},
  {key: "address", label: "Adresse", wide: true},
  {key: "reason", label: "Motif de l’appel", wide: true},
  {key: "action", label: "Demande et action attendue", wide: true},
  {key: "countryCode", label: "Indicatif international"},
  {key: "phone", label: "Numéro de téléphone"},
  {key: "email", label: "Adresse email", wide: true},
];

// Destinataires possibles : tout l'organigramme de Primevère.
export const RECIPIENTS = [
  ["Pierre BOSS", "Président-directeur général"], ["Sophie MARTIN", "Assistante de direction"],
  ["Yves BILLET", "Directeur des achats"], ["Xavier BELLO", "Acheteur"], ["René SOCHAN", "Acheteur"], ["Hervé LEMPEREUR", "Responsable du magasin des matières premières et emballages"],
  ["Pierre VIRON", "Directeur de production"], ["François ROSSI", "Responsable du laboratoire"], ["Claude JOURDAIN", "Responsable assurance qualité de la fabrication"], ["Pierre AUNE", "Responsable du magasin des produits finis"],
  ["Daniel BERGER", "Directeur commercial"], ["Joël SALU", "Responsable de l’administration des ventes"], ["Jacques JOUX", "Chef des ventes"], ["Lucien LANOAN", "Chef des ventes"], ["Marie DUPONT", "Responsable export et grands comptes"],
  ["René DUPRÉ", "Directeur des services généraux"], ["Nicolas HUET", "Responsable logistique et transports"], ["Didier ROBERT", "Responsable maintenance et sécurité"], ["Fatima BELDI", "Responsable hygiène et environnement"],
  ["Christian CATALA", "Directeur administratif"], ["Daniel LARUE", "Responsable comptabilité et finances"], ["Gérald MARCHAND", "Directeur des ressources humaines"], ["Caroline DUMAS", "Responsable juridique"], ["Thomas BERTRAND", "Responsable informatique"],
] as const;

export type Criterion = {id: string; name: string; goal: string};
export type CallScenario = {
  id: string; n: number; bank?: boolean; title: string; kind: string; company: string; country: string; flag: string;
  date: string; time: string; briefing: string;
  voiceId: string; prompt: string;
  answers: Record<Exclude<FicheKey, "address">, string> & {address?: string}; groups: Partial<Record<FicheKey, string[][]>>; phoneDigits: string[]; codeDigits: string;
  recipient: string; recipientWhy: string;
  criteria: Criterion[];
  model: string[];
};

const RULES = `
HOW TO PLAY THE CALL
- You are on the phone. Speak natural spoken English, in short turns (one or two sentences). Never use lists or formatting.
- The other person is a receptionist at Primevère (a French cosmetics company, head office in Paris) who is practising English. They speak first when they pick up the phone.
- If the receptionist summarises your message ("So, to recap…"), listen and confirm or correct each detail.
- Only give information when you are asked for it or when it is natural in the conversation. Do not give all the details at once.
- If asked to spell a name, spell it slowly, letter by letter (for example: "D - E - S - C - H - A - M - P - S"). Only spell when asked.
- Give phone numbers slowly, in small groups of digits.
- EMAIL ADDRESSES: never write an email address or a web address in its written form (no "@", no ".ca", no ".com" in your reply). Always write it exactly as it must be pronounced, with "dot" and "at", and spell short country endings letter by letter with capital letters, for example: "m, dot, deschamps, at, lushcosmetics, dot, C, A". Never pronounce ".ca" as a word.
- If the receptionist reads back a detail incorrectly, correct them politely. If they read it back correctly, confirm.
- If the receptionist speaks French, say politely that you don't speak French and continue in English.
- Stay in character at all times. Never help, teach, correct the receptionist's English or give advice. Never say you are an AI.
- If there is a long silence, ask politely if they are still there.
- SPEAKING SPEED. Speak at a calm, unhurried pace, with short pauses between ideas: the receptionist is not a native English speaker. If the receptionist asks you to slow down, to repeat, or shows they did not understand (for example "Could you speak more slowly, please?", "Sorry?", "Pardon?", "Could you repeat?"), apologise briefly ("Of course, sorry.") and from then on, FOR THE REST OF THE CALL, speak much more slowly: very short sentences, one piece of information per sentence, and "..." between groups of words. Separate digits and letters with commas and pauses, for example: "Of course... My number is... plus one... four, one, six... three, six, zero... seven, seven, eight, eight." Never go back to a fast pace after being asked to slow down.
- When the receptionist has taken the message and closes the call, thank them and say goodbye briefly.`;

const ENGLISH = {id: "english", name: "Anglais professionnel", goal: "The user (the receptionist) communicated in English throughout the call, with a polite, professional register adapted to a business phone call. Rédige la justification en français, en une ou deux phrases."};

export const SCENARIOS: CallScenario[] = [
  {
    id: "1", n: 1, title: "Réclamation d’un distributeur exclusif", kind: "Distributeur exclusif · Réclamation", company: "Lush Cosmetics Ltd", country: "Canada", flag: "🇨🇦",
    date: "15 janvier 2026", time: "15 h 53",
    briefing: "Vous êtes à l’accueil de Primevère, au siège à Paris. Nous sommes le 15 janvier 2026, il est 15 h 53. Cet après-midi, les responsables sont en réunion à l’extérieur : vous ne pouvez transférer aucun appel. Répondez en anglais, prenez toutes les informations, remplissez la fiche pendant l’appel, puis choisissez à qui transmettre le message.",
    voiceId: "JBFqnCBsd6RMkjVDRZzb",
    prompt: `You are Marc Deschamps from Lush Cosmetics Ltd in Toronto, Canada. Lush Cosmetics Ltd is Primevère's exclusive distributor for Canada.
YOUR POSITION: you never give a job title. When you introduce yourself, say "I am your exclusive distributor" (for example: "Hello, this is Marc Deschamps from Lush Cosmetics in Toronto. I am your exclusive distributor for Canada."). If the receptionist asks for your position or job title, answer only: "I am your exclusive distributor for Canada." Never say "Business Development Manager" or any other title.
You are calling Primevère on 15 January 2026 to make a complaint about a delivery, and you want to speak to Mr Salu, the Sales Administration Manager.

THE FACTS (never change them)
- The delivery was supposed to arrive on 5 January 2026.
- It was only received today, 15 January 2026: it was delayed by ten days.
- In addition, three boxes were damaged.
- What you want: to speak to Mr Salu now. Only if you are told he is not available, you want him to call you back urgently to discuss the issue.
- Your direct line: +1 416 360 7788 (country code 1, then 416 360 7788).
- Your email: m.deschamps@lushcosmetics.ca. Say it as: "m, dot, deschamps, at, lushcosmetics, dot, C, A". If asked, spell "deschamps" (D-E-S-C-H-A-M-P-S) and "lushcosmetics" (L-U-S-H-C-O-S-M-E-T-I-C-S).
- Your name: Marc Deschamps. First name M-A-R-C, surname D-E-S-C-H-A-M-P-S.

HOW THE CALL GOES
- After the receptionist greets you, introduce yourself briefly ("Hello, this is Marc Deschamps from Lush Cosmetics in Toronto. I am your exclusive distributor for Canada.") and ask to speak to Mr Salu, the Sales Administration Manager.
- IMPORTANT: you do NOT know that Mr Salu is unavailable. Until the receptionist clearly tells you he is not available, your request is simply to speak to him. If you are asked what you need or what it is about before that ("What do you need?", "What is it about?", "How can I help?"), answer that you would like to speak to Mr Salu about a problem with a delivery. Never mention a callback or a message before being told he is unavailable.
- If the receptionist asks you to hold or says they will try to put you through, wait politely.
- When you learn he is not available, you are disappointed but polite, and you accept to leave a message: then, and only then, ask for him to call you back urgently.
- Explain the problem step by step, answering the receptionist's questions: the delay (expected 5 January, received 15 January) and the three damaged boxes.
- Insist that it is urgent: you need Mr Salu to call you back today or as soon as possible.
- If the receptionist offers to transfer you to someone else, politely say you would rather leave a message for Mr Salu, because he handles your account.
- You are a little annoyed by the situation, but always courteous.
${RULES}`,
    answers: {
      firstName: "Marc", lastName: "Deschamps", job: "Distributeur exclusif", company: "Lush Cosmetics Ltd", city: "Toronto", country: "Canada",
      reason: "Réclamation : livraison prévue le 5 janvier 2026, reçue le 15 janvier 2026 (retard) ; trois cartons endommagés",
      action: "Rappeler M. Deschamps en urgence", countryCode: "+1", phone: "416 360 7788", email: "m.deschamps@lushcosmetics.ca",
    },
    groups: {
      firstName: [["marc"]], lastName: [["deschamps"]],
      job: [["distributeur", "exclusif"]],
      company: [["lush"]], city: [["toronto"]], country: [["canada"]],
      reason: [["retard", "endommag"], ["retard", "abim"], ["retard", "carton"], ["delay", "damag"], ["retard", "cass"]],
      action: [["rappel", "urgen"], ["rappeler", "urgen"], ["rappel", "rapidement"], ["rappel", "vite"], ["call", "back", "urgent"], ["rappel", "des que possible"]],
    },
    phoneDigits: ["4163607788", "14163607788", "0014163607788"], codeDigits: "1",
    recipient: "Joël SALU",
    recipientWhy: "Joël SALU, Responsable de l’administration des ventes : c’est lui que M. Deschamps demande, et l’administration des ventes suit les commandes et les réclamations des clients (livraisons, retards, colis abîmés).",
    criteria: [
      {id: "accueil", name: "Accueil", goal: "At the start of the call, the user (the receptionist) greeted the caller professionally, gave their own name, named the company (Primevère) and offered help (for example: 'Good afternoon, Primevère, Anna speaking. How may I help you?'). Rédige la justification en français, en une ou deux phrases."},
      {id: "identification", name: "Identification de l’appelant", goal: "The user asked for and obtained the caller's name and company, and asked the caller to spell his name (or checked its spelling). Rédige la justification en français, en une ou deux phrases."},
      {id: "orientation", name: "Orientation de l’appel / prise de message", goal: "The user dealt correctly with the request to speak to Mr Salu: since he was not available, the user explained it politely and offered to take a message. Rédige la justification en français, en une ou deux phrases."},
      {id: "motif", name: "Compréhension du motif de l’appel", goal: "The user understood the reason for the call — a complaint about a delivery that arrived late (expected 5 January, received 15 January) with three damaged boxes — by asking questions and/or rephrasing to check these details. Rédige la justification en français, en une ou deux phrases."},
      {id: "coordonnees", name: "Coordonnées vérifiées et informations reformulées", goal: "The user asked for the caller's phone number and/or email address, read them back to check them, AND summarised (rephrased) the main information of the call to make sure it was understood (for example 'So, to recap…'). Both parts are required. Rédige la justification en français, en une ou deux phrases."},
      {id: "demande", name: "Prise en compte de la demande et engagement", goal: "The user acknowledged the caller's request (and its urgency) and committed to what would happen next: the message would be passed on and Mr Salu would call back as soon as possible. Rédige la justification en français, en une ou deux phrases."},
      {id: "cloture", name: "Clôture", goal: "The user ended the call politely: checked whether there was anything else, thanked the caller and said goodbye. Rédige la justification en français, en une ou deux phrases."},
      ENGLISH,
    ],
    model: [
      "Good afternoon, Primevère, [your name] speaking. How may I help you?",
      "May I have your name, please? … Could you spell your surname, please?",
      "I’m afraid Mr Salu is not available at the moment. May I take a message?",
      "So, the delivery was expected on 5 January and arrived today, 15 January, and three boxes were damaged. Is that right?",
      "Could I have your phone number, please? … Let me read it back: plus one, four one six, three six zero, seven seven eight eight.",
      "I understand it’s urgent. I’ll make sure Mr Salu gets your message and calls you back as soon as possible.",
      "Thank you for calling, Mr Deschamps. Goodbye.",
    ],
  },
  {
    id: "2", n: 2, title: "Changement de coordonnées d’un distributeur exclusif", kind: "Distributeur exclusif · Changement de coordonnées", company: "Beltine Healthcare", country: "Irlande", flag: "🇮🇪",
    date: "20 mai 2026", time: "14 h 15",
    briefing: "Vous êtes à l’accueil de Primevère, au siège à Paris. Nous sommes le 20 mai 2026, il est 14 h 15. Cet après-midi, les responsables sont en réunion à l’extérieur : vous ne pouvez transférer aucun appel. Répondez en anglais, prenez toutes les informations, remplissez la fiche pendant l’appel, puis choisissez à qui transmettre le message.",
    voiceId: "onwK4e9ZLuTAKqWW03F9",
    prompt: `You are Liam O'Brien from Beltine Healthcare in Dublin, Ireland. Beltine Healthcare is Primevère's exclusive distributor for Ireland.
YOUR POSITION: you never give a job title. When you introduce yourself, say "I am your exclusive distributor" (for example: "Hello, this is Liam O'Brien from Beltine Healthcare in Dublin. I am your exclusive distributor for Ireland."). If the receptionist asks for your position or job title, answer only: "I am your exclusive distributor for Ireland." Never give any other title.
You are calling Primevère on 20 May 2026 because your company's contact details have changed, and you want Primevère to update its records.

THE FACTS (never change them)
- Your company has moved. New address: Unit 3, Clondalkin Industrial Estate, Dublin D22 X304, Ireland. Say the postcode as "D, two, two... X, three, zero, four". If asked, spell Clondalkin: C-L-O-N-D-A-L-K-I-N.
- New telephone number: +353 1 457 5011 (country code 353, then 1 457 5011).
- New email address: l.obrien@beltine.ie. Say it as: "l, dot, o, b, r, i, e, n, at, beltine, dot, I, E". If asked, spell "beltine" (B-E-L-T-I-N-E).
- Your name: Liam O'Brien. First name L-I-A-M, surname "O, apostrophe, B-R-I-E-N".
- Your company: Beltine Healthcare (B-E-L-T-I-N-E, if asked).
- What you want: simply to inform Primevère that your contact details have changed, so that they update their records/database. You do NOT ask to speak to anyone and you never name anyone at Primevère.
- If the receptionist asks who you would like to speak to, answer: "No one in particular, I'm just calling to let you know that our contact details have changed." If the receptionist suggests a name or a department, answer: "That's fine, as long as the right person gets the new details." Never confirm or suggest who the right person is: that is the receptionist's job.
- No callback is needed, unless there is a problem with the new details.

HOW THE CALL GOES
- After the receptionist greets you, introduce yourself briefly and say that you are calling to let Primevère know that your contact details have changed.
- Give the new details one by one, when the receptionist is ready or asks for them: first the new address, then the new phone number, then the new email address. Do not give everything in one go.
- If the receptionist asks you to hold, wait politely.
- You are friendly, calm and courteous. It is not urgent, but you want to be sure the new details are noted correctly.
${RULES}`,
    answers: {
      firstName: "Liam", lastName: "O’Brien", job: "Distributeur exclusif", company: "Beltine Healthcare", city: "Dublin", country: "Irlande",
      address: "Unit 3, Clondalkin Industrial Estate, Dublin D22 X304, Irlande",
      reason: "Changement de coordonnées : nouvelle adresse, nouveau numéro de téléphone et nouvelle adresse email",
      action: "Mettre à jour la base de données avec les nouvelles coordonnées", countryCode: "+353", phone: "1 457 5011", email: "l.obrien@beltine.ie",
    },
    groups: {
      firstName: [["liam"]], lastName: [["o brien"], ["obrien"]],
      job: [["distributeur", "exclusif"]],
      company: [["beltine"]], city: [["dublin"]], country: [["irlande"]],
      address: [["clondalkin", "d22 x304"], ["clondalkin", "d22x304"], ["clondalkin", "unit 3"]],
      reason: [["coordonnees"], ["adresse", "telephone"], ["adresse", "mail"], ["demenag"]],
      action: [["mettre a jour"], ["mise a jour"], ["actualis"], ["modifier"], ["enregistr", "nouvelles"]],
    },
    phoneDigits: ["14575011", "014575011", "35314575011", "0035314575011"], codeDigits: "353",
    recipient: "Marie DUPONT",
    recipientWhy: "Marie DUPONT, Responsable export et grands comptes : Beltine Healthcare est le distributeur exclusif de Primevère en Irlande. Les distributeurs exclusifs sont des partenaires à l’export, suivis par Marie Dupont : c’est à elle de faire mettre à jour leurs coordonnées.",
    criteria: [
      {id: "accueil", name: "Accueil", goal: "At the start of the call, the user (the receptionist) greeted the caller professionally, gave their own name, named the company (Primevère) and offered help (for example: 'Good afternoon, Primevère, Anna speaking. How may I help you?'). Rédige la justification en français, en une ou deux phrases."},
      {id: "identification", name: "Identification de l’appelant", goal: "The user asked for and obtained the caller's name and company, and asked the caller to spell his name (or checked its spelling). Rédige la justification en français, en une ou deux phrases."},
      {id: "orientation", name: "Orientation de l’appel / prise de message", goal: "The caller did not ask for anyone: he only called to give new contact details. The user dealt with this correctly by offering to take down the information / take a message so that it would be passed on to the right person (since no call can be transferred this afternoon). Rédige la justification en français, en une ou deux phrases."},
      {id: "motif", name: "Compréhension du motif de l’appel", goal: "The user understood the reason for the call — the caller's company (an exclusive distributor) has new contact details: a new postal address, a new phone number and a new email address — by asking questions and/or rephrasing to check these details. Rédige la justification en français, en une ou deux phrases."},
      {id: "coordonnees", name: "Coordonnées vérifiées et informations reformulées", goal: "The user read back the new details to check them (at least the new phone number and/or the new email address, ideally also the new address), AND summarised (rephrased) the main information of the call to make sure it was understood (for example 'So, to recap…'). Both parts are required. Rédige la justification en français, en une ou deux phrases."},
      {id: "demande", name: "Prise en compte de la demande et engagement", goal: "The user acknowledged the caller's request and committed to what would happen next: the new contact details would be passed on to the person concerned so that the records/database are updated. Rédige la justification en français, en une ou deux phrases."},
      {id: "cloture", name: "Clôture", goal: "The user ended the call politely: checked whether there was anything else, thanked the caller and said goodbye. Rédige la justification en français, en une ou deux phrases."},
      ENGLISH,
    ],
    model: [
      "Good afternoon, Primevère, [your name] speaking. How may I help you?",
      "May I have your name, please? … Could you spell your surname, please?",
      "Of course, I’ll take down your new details. Could you give me your new address, please?",
      "Could you spell that, please?",
      "Let me read that back to you: plus three five three, one, four five seven, five zero one one. And your email is l dot obrien at beltine dot i e. Is that correct?",
      "So, to recap: your new address is Unit 3, Clondalkin Industrial Estate, Dublin D22 X304, with a new phone number and a new email address.",
      "I’ll pass on your new details to the person concerned so that our database is updated.",
      "Is there anything else I can help you with? … Thank you for calling, Mr O’Brien. Goodbye.",
    ],
  },
];

// ————— Banque de préparation ECF (étape 06) : 7 MES chronométrées, d'après les fiches de Muriel (septembre 2026) —————
// Aucun appelant ne demande une personne précise : c'est à l'apprenant de trouver le bon destinataire.
const J = " Rédige la justification en français, en une ou deux phrases.";
const bankBriefing = (date: string, time: string) => `Vous êtes à l’accueil de Primevère, au siège à Paris. Nous sommes le ${date}, il est ${time}. Les responsables sont en réunion à l’extérieur : vous ne pouvez transférer aucun appel. Répondez en anglais, prenez toutes les informations, remplissez la fiche pendant l’appel, puis choisissez à qui transmettre le message. Vous avez 20 minutes.`;
const noPerson = (need: string) => `- You do NOT ask to speak to a specific person and you never name anyone at Primevère. If the receptionist asks who you would like to speak to, answer: "No one in particular, I just need ${need}." If the receptionist suggests a name or a department, answer: "That's fine, as long as the right person gets the message." Never confirm or suggest who the right person is: that is the receptionist's job.
- If the receptionist asks you to hold, wait politely.`;
const noTitle = (who: string) => `YOUR POSITION: you never give a job title. ${who} Never give any other title.`;
const bankCriteria = (motif: string, demande: string): Criterion[] => [
  {id: "accueil", name: "Accueil", goal: "At the start of the call, the user (the receptionist) greeted the caller professionally, gave their own name, named the company (Primevère) and offered help (for example: 'Good morning, Primevère, Anna speaking. How may I help you?')." + J},
  {id: "identification", name: "Identification de l’appelant", goal: "The user asked for and obtained the caller's name and company, and asked the caller to spell his or her name (or checked its spelling)." + J},
  {id: "orientation", name: "Orientation de l’appel / prise de message", goal: "The caller did not ask for a specific person. The user dealt with this correctly by offering to take a message / take down the information so that it would be passed on to the right person (no call can be transferred)." + J},
  {id: "motif", name: "Compréhension du motif de l’appel", goal: motif + J},
  {id: "coordonnees", name: "Coordonnées vérifiées et informations reformulées", goal: "The user asked for and read back the caller's contact details to check them (at least the phone number and/or the email address), AND summarised (rephrased) the main information of the call to make sure it was understood (for example 'So, to recap…'). Both parts are required." + J},
  {id: "demande", name: "Prise en compte de la demande et engagement", goal: demande + J},
  {id: "cloture", name: "Clôture", goal: "The user ended the call politely: checked whether there was anything else, thanked the caller and said goodbye." + J},
  ENGLISH,
];
const REASON_MOVE = [["coordonnees"], ["adresse", "telephone"], ["adresse", "mail"], ["demenag"]];
const ACTION_UPDATE = [["mettre a jour"], ["mise a jour"], ["actualis"], ["modifier"], ["enregistr", "nouvelle"]];
const DISTRIB = [["distributeur", "exclusif"]];

export const BANK: CallScenario[] = [
  {
    id: "b1", n: 1, bank: true, title: "Réclamation qualité d’un distributeur exclusif", kind: "Distributeur exclusif · Réclamation qualité", company: "Haney Inc.", country: "États-Unis", flag: "🇺🇸",
    date: "12 février 2026", time: "11 h 15", briefing: bankBriefing("12 février 2026", "11 h 15"),
    voiceId: "cgSgspJ2msm6clMCkdW9",
    prompt: `You are Jessica Haney from Haney Inc. in New York, United States. Haney Inc. is Primevère's exclusive distributor for the United States (customer number A03).
${noTitle(`When you introduce yourself, say: "Hello, this is Jessica Haney from Haney Inc. in New York. I am your exclusive distributor for the United States." If asked for your position, answer only: "I am your exclusive distributor for the United States."`)}
You are calling Primevère on 12 February 2026 to make a quality complaint.

THE FACTS (never change them)
- On 2 February 2026 you received a shipment of "Day Cream with Hawthorn", product reference VC002 ("V, C, zero, zero, two").
- The batch number is L2601-114 (say "L, two, six, zero, one, dash, one, one, four").
- Problems: the texture of the cream is more liquid than usual, and the smell has changed. Some of your customers are reporting the problem and returning the products.
- What you want: someone at Primevère must check this batch, and call you back as soon as possible. It is urgent.
- Your phone: +1 212 555 0199. Your email: j.haney@haneyinc.com, said as "j, dot, haney, at, haneyinc, dot, com". If asked, spell Haney: H-A-N-E-Y.

HOW THE CALL GOES
- After the receptionist greets you, introduce yourself and say you are calling about a quality problem with a recent delivery.
${noPerson("someone to check this batch and call me back")}
- Explain the problem step by step, answering the receptionist's questions: product, reference, delivery date, batch number, texture, smell, customer returns.
- You are worried and a little annoyed, but always courteous. Insist that it is urgent.
${RULES}`,
    answers: {
      firstName: "Jessica", lastName: "Haney", job: "Distributeur exclusif", company: "Haney Inc.", city: "New York", country: "États-Unis",
      reason: "Réclamation qualité : lot L2601-114 de Crème de jour à l’aubépine (VC002), reçu le 2 février 2026 ; texture plus liquide et odeur différente ; retours clients",
      action: "Vérifier le lot et rappeler Mme Haney en urgence", countryCode: "+1", phone: "212 555 0199", email: "j.haney@haneyinc.com",
    },
    groups: {
      firstName: [["jessica"]], lastName: [["haney"]], job: DISTRIB, company: [["haney"]], city: [["new york"]], country: [["etats unis"], ["etats-unis"], ["amerique"]],
      reason: [["l2601"], ["vc002"], ["aubepine", "texture"], ["aubepine", "odeur"], ["lot", "texture"], ["lot", "odeur"], ["creme", "texture"]],
      action: [["verif", "rappel"], ["control", "rappel"], ["analys", "rappel"], ["rappel", "urgen"], ["verif", "lot"]],
    },
    phoneDigits: ["2125550199", "12125550199", "0012125550199"], codeDigits: "1",
    recipient: "Claude JOURDAIN",
    recipientWhy: "Claude JOURDAIN, Responsable assurance qualité de la fabrication : Haney Inc. est bien un distributeur exclusif, mais le sujet est un problème de qualité sur un lot (texture, odeur). Quand le sujet est technique, on transmet au spécialiste : ici, la qualité.",
    criteria: bankCriteria(
      "The user understood the reason for the call — a quality complaint about batch L2601-114 of Day Cream with Hawthorn (VC002), received on 2 February: more liquid texture, different smell, customers returning the products — by asking questions and/or rephrasing to check these details.",
      "The user acknowledged the complaint and its urgency, and committed to what would happen next: the message would be passed on to the person concerned so that the batch is checked and the caller is called back as soon as possible."),
    model: [
      "Good morning, Primevère, [your name] speaking. How may I help you?",
      "I’m sorry to hear that. Could you give me the product reference and the batch number, please?",
      "When did you receive the delivery? … And what exactly is the problem with the cream?",
      "So, to recap: batch L2601-114 of Day Cream with Hawthorn, received on 2 February; the texture is more liquid and the smell has changed. Is that right?",
      "I understand it’s urgent. I’ll pass on your message to the person in charge so that the batch is checked, and you’ll be called back as soon as possible.",
    ],
  },
  {
    id: "b2", n: 2, bank: true, title: "Changement de coordonnées d’un distributeur exclusif", kind: "Distributeur exclusif · Changement de coordonnées", company: "Laboratório Koni", country: "Brésil", flag: "🇧🇷",
    date: "15 mars 2026", time: "10 h 20", briefing: bankBriefing("15 mars 2026", "10 h 20"),
    voiceId: "iP95p4xoKVk53GoZ742B",
    prompt: `You are João Ferreira from Laboratório Koni, Primevère's exclusive distributor for Brazil (customer number A01).
${noTitle(`When you introduce yourself, say: "Hello, this is João Ferreira from Laboratório Koni. I am your exclusive distributor for Brazil." If asked for your position, answer only: "I am your exclusive distributor for Brazil."`)}
You are calling Primevère on 15 March 2026: your company has moved from São Paulo to a new office in Rio de Janeiro, and you want Primevère to update its records.

THE FACTS (never change them)
- New address: Avenida das Américas, 500, Barra da Tijuca, Rio de Janeiro, RJ 22640-100, Brazil. Say the postcode as "two, two, six, four, zero, dash, one, zero, zero". If asked, spell Américas (A-M-E-R-I-C-A-S) and Tijuca (T-I-J-U-C-A).
- New phone number: +55 21 3487 5566 (country code 55, then 21 3487 5566).
- New email: j.ferreira@koni.com.br, said as "j, dot, ferreira, at, koni, dot, com, dot, B, R".
- Your name: João Ferreira. If asked, spell: first name J-O-A-O, surname F-E-R-R-E-I-R-A. Company: Laboratório Koni (K-O-N-I).
- No callback is needed, unless there is a problem with the new details.

HOW THE CALL GOES
- After the receptionist greets you, introduce yourself and say you are calling because your contact details have changed.
${noPerson("to let you know that our contact details have changed")}
- Give the new details one by one, when the receptionist is ready or asks for them: address, then phone number, then email. Do not give everything in one go.
- You are friendly and calm.
${RULES}`,
    answers: {
      firstName: "João", lastName: "Ferreira", job: "Distributeur exclusif", company: "Laboratório Koni", city: "Rio de Janeiro", country: "Brésil",
      address: "Avenida das Américas, 500, Barra da Tijuca, Rio de Janeiro – RJ 22640-100, Brésil",
      reason: "Changement de coordonnées (déménagement à Rio de Janeiro) : nouvelle adresse, nouveau numéro de téléphone et nouvelle adresse email",
      action: "Mettre à jour la base de données avec les nouvelles coordonnées", countryCode: "+55", phone: "21 3487 5566", email: "j.ferreira@koni.com.br",
    },
    groups: {
      firstName: [["joao"]], lastName: [["ferreira"]], job: DISTRIB, company: [["koni"]], city: [["rio"]], country: [["bresil"]],
      address: [["americas", "500"], ["americas", "22640"], ["americas", "barra"]],
      reason: REASON_MOVE, action: ACTION_UPDATE,
    },
    phoneDigits: ["2134875566", "02134875566", "552134875566", "00552134875566"], codeDigits: "55",
    recipient: "Marie DUPONT",
    recipientWhy: "Marie DUPONT, Responsable export et grands comptes : Laboratório Koni est le distributeur exclusif de Primevère au Brésil. Les distributeurs exclusifs sont des partenaires à l’export, suivis par Marie Dupont : c’est à elle de faire mettre à jour leurs coordonnées.",
    criteria: bankCriteria(
      "The user understood the reason for the call — the exclusive distributor has moved to Rio de Janeiro and has a new postal address, a new phone number and a new email address — by asking questions and/or rephrasing to check these details.",
      "The user acknowledged the request and committed to what would happen next: the new contact details would be passed on to the person concerned so that the records/database are updated."),
    model: [
      "Good morning, Primevère, [your name] speaking. How may I help you?",
      "Of course, I’ll take down your new details. Could you give me your new address, please? … Could you spell that, please?",
      "Let me read that back to you: plus five five, two one, three four eight seven, five five six six. Is that correct?",
      "So, to recap: your new address is Avenida das Américas, 500, Barra da Tijuca, Rio de Janeiro, with a new phone number and a new email address.",
      "I’ll pass on your new details to the person concerned so that our database is updated.",
    ],
  },
  {
    id: "b3", n: 3, bank: true, title: "Question d’exclusivité d’un distributeur exclusif", kind: "Distributeur exclusif · Question d’exclusivité", company: "Natural Care Australia", country: "Australie", flag: "🇦🇺",
    date: "18 mars 2026", time: "16 h 30", briefing: bankBriefing("18 mars 2026", "16 h 30"),
    voiceId: "XrExE9yKIg1WjnnlVkGX",
    prompt: `You are Sarah Williams from Natural Care Australia in Sydney, Primevère's exclusive distributor for Australia (customer number OC01).
${noTitle(`When you introduce yourself, say: "Hello, this is Sarah Williams from Natural Care Australia in Sydney. I am your exclusive distributor for Australia." If asked for your position, answer only: "I am your exclusive distributor for Australia."`)}
You are calling Primevère on 18 March 2026 about a problem with your exclusivity.

THE FACTS (never change them)
- You noticed that a website called "BeautyDirect AU" (say "Beauty Direct, A, U"; spell BeautyDirect if asked) is selling some Primevère products in Australia at a lower price than yours.
- This is causing confusion with your customers, and you think it is against the exclusivity terms in your contract with Primevère.
- What you want: someone at Primevère must check the situation, especially the exclusivity clause of your contract, and call you back as soon as possible.
- Your phone: +61 2 9234 1100. Your email: s.williams@naturalcare.com.au, said as "s, dot, williams, at, naturalcare, dot, com, dot, A, U". If asked, spell Williams: W-I-L-L-I-A-M-S.

HOW THE CALL GOES
- After the receptionist greets you, introduce yourself and say you are calling about a problem with your exclusivity in Australia.
${noPerson("someone to check our contract and call me back")}
- Explain the situation step by step, answering the receptionist's questions.
- You are concerned and firm, but always polite.
${RULES}`,
    answers: {
      firstName: "Sarah", lastName: "Williams", job: "Distributeur exclusif", company: "Natural Care Australia", city: "Sydney", country: "Australie",
      reason: "Le site BeautyDirect AU vend des produits Primevère en Australie moins cher : non-respect possible de la clause d’exclusivité",
      action: "Vérifier la clause d’exclusivité du contrat et rappeler Mme Williams", countryCode: "+61", phone: "2 9234 1100", email: "s.williams@naturalcare.com.au",
    },
    groups: {
      firstName: [["sarah"]], lastName: [["williams"]], job: DISTRIB, company: [["natural care"]], city: [["sydney"]], country: [["australie"]],
      reason: [["beautydirect"], ["beauty direct"], ["exclusivit"], ["site", "prix"], ["site", "moins cher"]],
      action: [["clause"], ["contrat", "rappel"], ["exclusivit", "rappel"], ["verif", "contrat"]],
    },
    phoneDigits: ["292341100", "0292341100", "61292341100", "0061292341100"], codeDigits: "61",
    recipient: "Caroline DUMAS",
    recipientWhy: "Caroline DUMAS, Responsable juridique : Natural Care Australia est bien un distributeur exclusif, mais la demande porte sur une clause de son contrat (l’exclusivité). Quand le sujet est juridique, on transmet au service juridique.",
    criteria: bankCriteria(
      "The user understood the reason for the call — a website called BeautyDirect AU is selling Primevère products in Australia at a lower price, which the exclusive distributor thinks is against the exclusivity clause of its contract — by asking questions and/or rephrasing to check these details.",
      "The user acknowledged the caller's concern and committed to what would happen next: the message would be passed on to the person concerned so that the contract / exclusivity clause is checked and the caller is called back."),
    model: [
      "Good afternoon, Primevère, [your name] speaking. How may I help you?",
      "Could you tell me the name of the website, please? … Could you spell it, please?",
      "So, to recap: the website BeautyDirect AU is selling our products in Australia at a lower price, and you think this is against your exclusivity. Is that right?",
      "I understand your concern. I’ll pass on your message to the person in charge so that your contract is checked, and you’ll be called back as soon as possible.",
    ],
  },
  {
    id: "b4", n: 4, bank: true, title: "Changement de coordonnées d’un distributeur exclusif", kind: "Distributeur exclusif · Changement de coordonnées", company: "Firma Venere", country: "Italie", flag: "🇮🇹",
    date: "10 avril 2026", time: "11 h 22", briefing: bankBriefing("10 avril 2026", "11 h 22"),
    voiceId: "XB0fDUnXU5powFXDhCwa",
    prompt: `You are Ginevra Questano from Firma Venere in Milan, Primevère's exclusive distributor for Italy (customer number E04).
${noTitle(`When you introduce yourself, say: "Hello, this is Ginevra Questano from Firma Venere in Milan. I am your exclusive distributor for Italy." If asked for your position, answer only: "I am your exclusive distributor for Italy."`)}
You are calling Primevère on 10 April 2026: your company has recently moved to a new office, and you want Primevère to update its records.

THE FACTS (never change them)
- New address: Via Monte Napoleone 18, 20121 Milano, Italy. If asked, spell Napoleone: N-A-P-O-L-E-O-N-E.
- New phone number: +39 02 8754 3210 (country code 39, then 02 8754 3210).
- New email: g.questano@firmavenere.it, said as "g, dot, questano, at, firmavenere, dot, I, T".
- Your name: Ginevra Questano. If asked, spell: first name G-I-N-E-V-R-A, surname Q-U-E-S-T-A-N-O. Company: Firma Venere (V-E-N-E-R-E).
- No callback is needed, unless there is a problem with the new details.

HOW THE CALL GOES
- After the receptionist greets you, introduce yourself and say you are calling because your contact details have changed.
${noPerson("to let you know that our contact details have changed")}
- Give the new details one by one, when the receptionist is ready or asks for them: address, then phone number, then email. Do not give everything in one go.
- You are friendly and calm.
${RULES}`,
    answers: {
      firstName: "Ginevra", lastName: "Questano", job: "Distributeur exclusif", company: "Firma Venere", city: "Milan", country: "Italie",
      address: "Via Monte Napoleone 18, 20121 Milano, Italie",
      reason: "Changement de coordonnées (déménagement) : nouvelle adresse, nouveau numéro de téléphone et nouvelle adresse email",
      action: "Mettre à jour la base de données avec les nouvelles coordonnées", countryCode: "+39", phone: "02 8754 3210", email: "g.questano@firmavenere.it",
    },
    groups: {
      firstName: [["ginevra"]], lastName: [["questano"]], job: DISTRIB, company: [["venere"]], city: [["milan"]], country: [["italie"]],
      address: [["napoleone", "18"], ["montenapoleone", "18"]],
      reason: REASON_MOVE, action: ACTION_UPDATE,
    },
    phoneDigits: ["0287543210", "287543210", "390287543210", "00390287543210"], codeDigits: "39",
    recipient: "Marie DUPONT",
    recipientWhy: "Marie DUPONT, Responsable export et grands comptes : Firma Venere est le distributeur exclusif de Primevère en Italie. Les distributeurs exclusifs sont des partenaires à l’export, suivis par Marie Dupont : c’est à elle de faire mettre à jour leurs coordonnées.",
    criteria: bankCriteria(
      "The user understood the reason for the call — the exclusive distributor for Italy has moved to a new office and has a new postal address, a new phone number and a new email address — by asking questions and/or rephrasing to check these details.",
      "The user acknowledged the request and committed to what would happen next: the new contact details would be passed on to the person concerned so that the records/database are updated."),
    model: [
      "Good morning, Primevère, [your name] speaking. How may I help you?",
      "Of course, I’ll take down your new details. What is your new address, please? … Could you spell the street name, please?",
      "Let me read that back to you: plus three nine, zero two, eight seven five four, three two one zero. Is that correct?",
      "So, to recap: your new address is Via Monte Napoleone 18, 20121 Milano, with a new phone number and a new email address.",
      "I’ll pass on your new details to the person concerned so that our database is updated.",
    ],
  },
  {
    id: "b5", n: 5, bank: true, title: "Renouvellement de la licence CRM", kind: "Fournisseur · Licence CRM", company: "TechSolutions Inc.", country: "Canada", flag: "🇨🇦",
    date: "25 avril 2026", time: "14 h 30", briefing: bankBriefing("25 avril 2026", "14 h 30"),
    voiceId: "cjVigY5qzO86Huf0OWal",
    prompt: `You are David Thompson from TechSolutions Inc. in Toronto, Canada. TechSolutions is the company that provides Primevère's CRM software (you are a supplier, not a customer).
${noTitle(`When you introduce yourself, say: "Hello, this is David Thompson from TechSolutions in Toronto, the company that provides your CRM software." If asked for your position, answer only: "I manage your account at TechSolutions."`)}
You are calling Primevère on 25 April 2026 about the renewal of the CRM licence.

THE FACTS (never change them)
- Primevère's current CRM licence expires on 30 April 2026.
- To renew it, you need to receive, before 28 April: the confirmation of the number of users (currently 25), and a signed purchase order.
- If you do not receive these documents by 28 April, access to the CRM will be suspended.
- What you want: someone at Primevère must send you this information and call you back as soon as possible.
- Your phone: +1 416 555 8732. Your email: d.thompson@techsolutions.ca, said as "d, dot, thompson, at, techsolutions, dot, C, A". If asked, spell Thompson: T-H-O-M-P-S-O-N, and TechSolutions: T-E-C-H-S-O-L-U-T-I-O-N-S.

HOW THE CALL GOES
- After the receptionist greets you, introduce yourself and say you are calling about the renewal of the CRM licence.
${noPerson("the person who deals with your CRM to get my message")}
- Explain step by step, answering the receptionist's questions: expiry date, number of users, purchase order, deadline, risk of suspension.
- You are friendly and professional, but you insist on the deadline.
${RULES}`,
    answers: {
      firstName: "David", lastName: "Thompson", job: "Fournisseur du logiciel CRM", company: "TechSolutions Inc.", city: "Toronto", country: "Canada",
      reason: "Renouvellement de la licence CRM, qui expire le 30 avril 2026 ; sans les documents avant le 28 avril, l’accès au CRM sera suspendu",
      action: "Confirmer le nombre d’utilisateurs (25) et envoyer un bon de commande signé avant le 28 avril ; rappeler M. Thompson", countryCode: "+1", phone: "416 555 8732", email: "d.thompson@techsolutions.ca",
    },
    groups: {
      firstName: [["david"]], lastName: [["thompson"]], job: [["fournisseur"], ["prestataire"]], company: [["techsolution"], ["tech solution"]], city: [["toronto"]], country: [["canada"]],
      reason: [["licence", "30"], ["licence", "expir"], ["license", "expir"], ["crm", "renouvel"], ["licence", "renouvel"]],
      action: [["bon de commande"], ["commande", "28"], ["utilisateur", "28"], ["utilisateur", "commande"]],
    },
    phoneDigits: ["4165558732", "14165558732", "0014165558732"], codeDigits: "1",
    recipient: "Thomas BERTRAND",
    recipientWhy: "Thomas BERTRAND, Responsable informatique : TechSolutions est le fournisseur du logiciel CRM de Primevère. La licence d’un logiciel, le nombre d’utilisateurs et le risque de suspension de l’accès relèvent du service informatique.",
    criteria: bankCriteria(
      "The user understood the reason for the call — the CRM licence expires on 30 April 2026; the supplier needs the confirmation of the number of users (25) and a signed purchase order before 28 April, otherwise access to the CRM will be suspended — by asking questions and/or rephrasing to check these details.",
      "The user acknowledged the request and the deadline, and committed to what would happen next: the message would be passed on to the person concerned so that the information and the signed purchase order are sent before 28 April, and the caller is called back."),
    model: [
      "Good afternoon, Primevère, [your name] speaking. How may I help you?",
      "Could you tell me when the licence expires, please? … And what do you need from us?",
      "So, to recap: the licence expires on 30 April, and you need the number of users and a signed purchase order before 28 April. Otherwise, access to the CRM will be suspended. Is that right?",
      "I understand the deadline. I’ll pass on your message to the person in charge today so that you receive the documents before 28 April.",
    ],
  },
  {
    id: "b6", n: 6, bank: true, title: "Changement de coordonnées d’un distributeur exclusif", kind: "Distributeur exclusif · Changement de coordonnées", company: "Sakura Cosme", country: "Japon", flag: "🇯🇵",
    date: "27 mai 2026", time: "15 h 47", briefing: bankBriefing("27 mai 2026", "15 h 47"),
    voiceId: "pFZP5JQG7iQjIQuC4Bku",
    prompt: `You are Yuki Tanaka from Sakura Cosme in Tokyo, Primevère's exclusive distributor for Japan (customer number AS02).
${noTitle(`When you introduce yourself, say: "Hello, this is Yuki Tanaka from Sakura Cosme in Tokyo. I am your exclusive distributor for Japan." If asked for your position, answer only: "I am your exclusive distributor for Japan."`)}
You are calling Primevère on 27 May 2026: your company has recently moved to a new office, and you want Primevère to update its records.

THE FACTS (never change them)
- New address: 1-9-1 Marunouchi, Chiyoda-ku, Tokyo 100-0005, Japan. Say the street number as "one, dash, nine, dash, one" and the postcode as "one, zero, zero, dash, zero, zero, zero, five". If asked, spell Marunouchi (M-A-R-U-N-O-U-C-H-I) and Chiyoda (C-H-I-Y-O-D-A).
- New phone number: +81 3 6206 4410 (country code 81, then 3 6206 4410).
- Your email address has NOT changed: y.tanaka@sakuracosme.jp, said as "y, dot, tanaka, at, sakuracosme, dot, J, P". Say clearly that the email address remains the same.
- Your name: Yuki Tanaka. If asked, spell: first name Y-U-K-I, surname T-A-N-A-K-A. Company: Sakura Cosme (S-A-K-U-R-A, C-O-S-M-E).
- No callback is needed, unless there is a problem with the new details.

HOW THE CALL GOES
- After the receptionist greets you, introduce yourself and say you are calling because your contact details have changed.
${noPerson("to let you know that our contact details have changed")}
- Give the new details one by one, when the receptionist is ready or asks for them: address, then phone number, then say that the email address is unchanged. Do not give everything in one go.
- You are very polite and calm.
${RULES}`,
    answers: {
      firstName: "Yuki", lastName: "Tanaka", job: "Distributeur exclusif", company: "Sakura Cosme", city: "Tokyo", country: "Japon",
      address: "1-9-1 Marunouchi, Chiyoda-ku, Tokyo 100-0005, Japon",
      reason: "Changement de coordonnées (déménagement) : nouvelle adresse et nouveau numéro de téléphone ; adresse email inchangée",
      action: "Mettre à jour la base de données avec les nouvelles coordonnées", countryCode: "+81", phone: "3 6206 4410", email: "y.tanaka@sakuracosme.jp",
    },
    groups: {
      firstName: [["yuki"]], lastName: [["tanaka"]], job: DISTRIB, company: [["sakura"]], city: [["tokyo"]], country: [["japon"]],
      address: [["marunouchi", "1-9-1"], ["marunouchi", "100-0005"], ["marunouchi", "1 9 1"], ["marunouchi", "chiyoda"]],
      reason: [["coordonnees"], ["adresse", "telephone"], ["demenag"]], action: ACTION_UPDATE,
    },
    phoneDigits: ["362064410", "0362064410", "81362064410", "0081362064410"], codeDigits: "81",
    recipient: "Marie DUPONT",
    recipientWhy: "Marie DUPONT, Responsable export et grands comptes : Sakura Cosme est le distributeur exclusif de Primevère au Japon. Les distributeurs exclusifs sont des partenaires à l’export, suivis par Marie Dupont : c’est à elle de faire mettre à jour leurs coordonnées.",
    criteria: bankCriteria(
      "The user understood the reason for the call — the exclusive distributor for Japan has moved and has a new postal address and a new phone number, while the email address remains the same — by asking questions and/or rephrasing to check these details.",
      "The user acknowledged the request and committed to what would happen next: the new contact details would be passed on to the person concerned so that the records/database are updated."),
    model: [
      "Good afternoon, Primevère, [your name] speaking. How may I help you?",
      "Of course, I’ll take down your new details. What is your new address, please? … Could you spell that, please?",
      "And has your email address changed too? … So it’s still y dot tanaka at sakuracosme dot j p. Is that correct?",
      "So, to recap: your new address is 1-9-1 Marunouchi, Chiyoda-ku, Tokyo, your new number is plus eight one, three, six two zero six, four four one zero, and your email address is the same.",
      "I’ll pass on your new details to the person concerned so that our database is updated.",
    ],
  },
  {
    id: "b7", n: 7, bank: true, title: "Prospect : fabrication en marque blanche", kind: "Prospect · Marque blanche", company: "Pure Essence Ltd", country: "Royaume-Uni", flag: "🇬🇧",
    date: "12 juin 2026", time: "16 h 30", briefing: bankBriefing("12 juin 2026", "16 h 30"),
    voiceId: "N2lVS1w4EtoT3dr4eOWO",
    prompt: `You are James Walker from Pure Essence Ltd, a natural skincare brand based in London, United Kingdom. You have never worked with Primevère: you are a new prospect.
${noTitle(`When you introduce yourself, say: "Hello, this is James Walker from Pure Essence, a natural skincare brand based in London." If asked for your position, answer only: "I'm in charge of this project at Pure Essence."`)}
You are calling Primevère on 12 June 2026.

THE FACTS (never change them)
- You do NOT want to distribute Primevère products. You want Primevère to manufacture a range of skincare products under your own brand, Pure Essence: this is called "private label".
- The launch is planned for this autumn.
- You would like information about: the product range available for private label, the minimum order quantities, the prices, and the delivery lead times.
- What you want: someone at Primevère must send you this information and call you back.
- Your phone: +44 20 7946 0958. Your email: james.walker@pureessence.co.uk, said as "james, dot, walker, at, pureessence, dot, co, dot, U, K". If asked, spell Walker (W-A-L-K-E-R) and Pure Essence (P-U-R-E, E-S-S-E-N-C-E).
- If the receptionist asks whether you want to become a distributor, say: "No, we want you to manufacture products under our own brand."

HOW THE CALL GOES
- After the receptionist greets you, introduce yourself and say you are interested in having products manufactured under your own brand.
${noPerson("the right person to get my request")}
- Explain your request step by step, answering the receptionist's questions.
- You are enthusiastic and polite.
${RULES}`,
    answers: {
      firstName: "James", lastName: "Walker", job: "", company: "Pure Essence Ltd", city: "Londres", country: "Royaume-Uni",
      reason: "Nouveau prospect : souhaite faire fabriquer une gamme de soins sous sa propre marque (marque blanche) pour un lancement à l’automne",
      action: "Lui envoyer des informations (gamme possible, quantités minimales de commande, prix, délais de livraison) et le rappeler", countryCode: "+44", phone: "20 7946 0958", email: "james.walker@pureessence.co.uk",
    },
    groups: {
      firstName: [["james"]], lastName: [["walker"]], company: [["pure essence"], ["pureessence"]], city: [["londres"], ["london"]], country: [["royaume"], ["angleterre"]],
      reason: [["marque blanche"], ["private label"], ["propre marque"], ["sa marque"], ["leur marque"]],
      action: [["quantit", "prix"], ["gamme", "prix"], ["tarif", "quantit"], ["prix", "delai"], ["information", "rappel"]],
    },
    phoneDigits: ["2079460958", "02079460958", "442079460958", "00442079460958"], codeDigits: "44",
    recipient: "Marie DUPONT",
    recipientWhy: "Marie DUPONT, Responsable export et grands comptes : Pure Essence est un nouveau prospect étranger (Royaume-Uni). Les prospects à l’international sont suivis par Marie Dupont. Attention : ce n’est pas une demande de distribution (le Royaume-Uni a déjà un distributeur exclusif), mais une demande de fabrication en marque blanche.",
    criteria: bankCriteria(
      "The user understood the reason for the call — a new prospect (a UK skincare brand) wants Primevère to manufacture products under its own brand (private label) for a launch in autumn, and asks for the product range, minimum order quantities, prices and delivery lead times — by asking questions and/or rephrasing to check these details.",
      "The user acknowledged the request and committed to what would happen next: the request would be passed on to the person concerned so that the caller receives the information and is called back."),
    model: [
      "Good afternoon, Primevère, [your name] speaking. How may I help you?",
      "Just to make sure I understand: you would like us to manufacture products under your own brand, is that right?",
      "What information would you like to receive? … When is the launch planned?",
      "So, to recap: you would like information about the product range, minimum order quantities, prices and delivery lead times, for a launch this autumn.",
      "I’ll pass on your request to the person in charge, and you’ll be contacted as soon as possible.",
    ],
  },
];

export const findScenario = (id: string) => [...SCENARIOS, ...BANK].find(s => s.id === id);

export const normalise = (v: string) => v.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9@+.-]+/g, " ").trim();
export const onlyDigits = (v: string) => v.replace(/\D/g, "");
export function scoreFiche(s: CallScenario, key: FicheKey, value: string): boolean {
  const v = normalise(value);
  if (!v) return false;
  if (key === "countryCode") return onlyDigits(value) === s.codeDigits;
  if (key === "phone") return s.phoneDigits.includes(onlyDigits(value));
  if (key === "email") return value.toLowerCase().replace(/\s/g, "").replace(/[.,;]+$/, "") === s.answers.email.toLowerCase();
  const groups = s.groups[key];
  return !!groups && groups.some(g => g.every(t => v.includes(normalise(t))));
}

// Grille d'évaluation MES AD (Muriel, septembre 2026) : 8 critères de l'appel évalués par l'IA,
// 9 = fiche de renseignements, 10 = destinataire. ACQUIS si au moins 6/10, dont les critères 1 et 5.
export const FICHE_CRITERION = {id: "fiche", name: "Fiche de renseignements complète et exacte"};
export const RECIPIENT_CRITERION = {id: "destinataire", name: "Message transmis au bon destinataire"};
export const REQUIRED = ["accueil", "coordonnees"];
// Champs de la fiche pour une MES : un champ sans réponse attendue (Adresse, ou Fonction d'un prospect) n'apparaît pas.
export const ficheFor = (s: CallScenario) => FICHE.filter(f => !!s.answers[f.key]);
export function ficheValidated(ok: Partial<Record<FicheKey, boolean>>, fields = FICHE): boolean {
  const wrong = fields.filter(f => !ok[f.key]).length;
  return wrong <= 1 && ok.lastName && (ok.phone || ok.email);
}
export function globalResult(validated: Record<string, boolean>): {count: number; acquis: boolean} {
  const count = Object.values(validated).filter(Boolean).length;
  return {count, acquis: count >= 6 && REQUIRED.every(id => validated[id])};
}
