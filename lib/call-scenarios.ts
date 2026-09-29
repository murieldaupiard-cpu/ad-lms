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

export const findScenario = (id: string) => SCENARIOS.find(s => s.id === id);

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
// Champs de la fiche pour une MES : le champ Adresse n'apparaît que si la MES a une adresse attendue.
export const ficheFor = (s: CallScenario) => FICHE.filter(f => f.key !== "address" || !!s.answers.address);
export function ficheValidated(ok: Partial<Record<FicheKey, boolean>>, fields = FICHE): boolean {
  const wrong = fields.filter(f => !ok[f.key]).length;
  return wrong <= 1 && ok.lastName && (ok.phone || ok.email);
}
export function globalResult(validated: Record<string, boolean>): {count: number; acquis: boolean} {
  const count = Object.values(validated).filter(Boolean).length;
  return {count, acquis: count >= 6 && REQUIRED.every(id => validated[id])};
}
