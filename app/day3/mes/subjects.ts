export type FieldKey =
  | "firstName" | "lastName" | "job" | "company" | "city" | "country"
  | "reason" | "address" | "countryCode" | "phone" | "email" | "action";

export type Field = { key: FieldKey; label: string; hint: string; wide?: boolean };

export const FIELDS: Field[] = [
  { key: "firstName", label: "Prénom", hint: "" },
  { key: "lastName", label: "Nom", hint: "" },
  { key: "job", label: "Fonction", hint: "" },
  { key: "company", label: "Entreprise", hint: "" },
  { key: "city", label: "Ville", hint: "" },
  { key: "country", label: "Pays", hint: "" },
  { key: "reason", label: "Motif de l’appel", hint: "", wide: true },
  { key: "action", label: "Demande et action attendue", hint: "", wide: true },
  { key: "address", label: "Adresse postale", hint: "", wide: true },
  { key: "countryCode", label: "Indicatif international", hint: "" },
  { key: "phone", label: "Numéro de téléphone", hint: "" },
  { key: "email", label: "Adresse email", hint: "" },
];

export type Subject = {
  id: string;
  n: number;
  audio: string;
  company: string;
  country: string;
  flag: string;
  caller: string;
  time: string;
  answers: Record<FieldKey, string>;
  groups: Partial<Record<FieldKey, string[][]>>;
  phoneDigits: string[];
  codeDigits: string;
  companyKey: string;
};

export const RECIPIENTS = [
  { name: "Joël Salu", role: "Responsable de l’administration des ventes", correct: true },
  { name: "Daniel Berger", role: "Directeur commercial", correct: false },
  { name: "Yves Billet", role: "Directeur des achats", correct: false },
  { name: "Christian Catala", role: "Directeur administratif", correct: false },
];

const COMMON_GROUPS = {
  reason: [["changement", "coordonnees"], ["nouvelles", "coordonnees"], ["modification", "coordonnees"], ["demenagement"]],
  action: [["mettre", "jour"], ["mise", "jour"], ["actualiser"], ["modifier", "fiche"], ["modifier", "base"]],
};

export const SUBJECTS: Subject[] = [
  {
    id: "vm3",
    n: 3,
    audio: "/day3/voicemail-3.m4a",
    company: "Dermarome Stockholm AB",
    country: "Suède",
    flag: "🇸🇪",
    caller: "Maja Johansson",
    time: "20 mai · 10 h 42",
    companyKey: "dermarome",
    codeDigits: "46",
    phoneDigits: ["87214590", "087214590", "4687214590"],
    answers: {
      firstName: "Maja",
      lastName: "Johansson",
      job: "Responsable administratif",
      company: "Dermarome Stockholm AB",
      city: "Stockholm",
      country: "Suède",
      reason: "L’entreprise a déménagé : ses coordonnées ont changé",
      address: "Sveavägen 125, 113 50 Stockholm, Suède",
      countryCode: "+46",
      phone: "8 721 45 90",
      email: "contact@dermarome.se",
      action: "Mettre à jour la base de données avec les nouvelles coordonnées",
    },
    groups: {
      firstName: [["maja"]],
      lastName: [["johansson"]],
      job: [["responsable", "administrat"], ["directrice", "administrat"]],
      company: [["dermarome"]],
      city: [["stockholm"]],
      country: [["suede"]],
      address: [["sveavagen", "125"]],
      ...COMMON_GROUPS,
    },
  },
  {
    id: "vm4",
    n: 4,
    audio: "/day3/voicemail-4.m4a",
    company: "Böhme GmbH",
    country: "Allemagne",
    flag: "🇩🇪",
    caller: "Hanna Böhme",
    time: "20 mai · 11 h 05",
    companyKey: "bohme",
    codeDigits: "49",
    phoneDigits: ["22122620100", "022122620100", "4922122620100"],
    answers: {
      firstName: "Hanna",
      lastName: "Böhme",
      job: "Responsable des achats",
      company: "Böhme GmbH",
      city: "Cologne (Köln)",
      country: "Allemagne",
      reason: "Les coordonnées de l’entreprise ont changé",
      address: "Dürerstrasse 35, D 5000 Köln, Allemagne",
      countryCode: "+49",
      phone: "221 22620100",
      email: "boehme.koln@gmbh.de",
      action: "Mettre à jour la base de données avec les nouvelles coordonnées",
    },
    groups: {
      firstName: [["hanna"]],
      lastName: [["bohme"], ["boehme"]],
      job: [["responsable", "achat"], ["directrice", "achat"], ["acheteuse"]],
      company: [["bohme"], ["boehme"]],
      city: [["koln"], ["cologne"]],
      country: [["allemagne"]],
      address: [["durerstrasse", "35"], ["durer", "35"]],
      ...COMMON_GROUPS,
    },
  },
  {
    id: "vm5",
    n: 5,
    audio: "/day3/voicemail-5.m4a",
    company: "Empresa Aguileras",
    country: "Espagne",
    flag: "🇪🇸",
    caller: "Francesca Arias",
    time: "20 mai · 11 h 38",
    companyKey: "aguileras",
    codeDigits: "34",
    phoneDigits: ["675859666", "0675859666", "34675859666"],
    answers: {
      firstName: "Francesca",
      lastName: "Arias",
      job: "Responsable commerciale",
      company: "Empresa Aguileras",
      city: "Madrid",
      country: "Espagne",
      reason: "Les coordonnées de l’entreprise ont changé",
      address: "Calle de los Toreros, 28005 Madrid, Espagne",
      countryCode: "+34",
      phone: "675 859 666",
      email: "empresa-aguileras@hotmail.es",
      action: "Mettre à jour la base de données avec les nouvelles coordonnées",
    },
    groups: {
      firstName: [["francesca"]],
      lastName: [["arias"]],
      job: [["responsable", "commercial"], ["directrice", "commercial"], ["commerciale"]],
      company: [["aguileras"]],
      city: [["madrid"]],
      country: [["espagne"]],
      address: [["calle", "toreros"], ["toreros", "28005"]],
      ...COMMON_GROUPS,
    },
  },
];

export const normalise = (v: string) =>
  v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9@+.-]+/g, " ").trim();
export const digits = (v: string) => v.replace(/\D/g, "");

export function scoreField(subject: Subject, key: FieldKey, value: string): boolean {
  const v = normalise(value);
  if (!v) return false;
  if (key === "countryCode") return digits(value) === subject.codeDigits;
  if (key === "phone") return subject.phoneDigits.includes(digits(value));
  if (key === "email") return value.toLowerCase().replace(/\s/g, "").replace(/[.,;]+$/, "") === subject.answers.email.toLowerCase();
  const groups = subject.groups[key];
  if (!groups) return false;
  return groups.some((group) => group.every((term) => v.includes(normalise(term))));
}
