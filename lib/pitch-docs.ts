// Documents Pitch Vision remis aux apprenants pour l'ECF (versions finales de Muriel, septembre 2026).
// Les fiches de rôle des MES ne sont PAS ici : elles restent réservées à la formatrice et à l'IA.
export const PITCH_DOCS = [
  {file: "annuaire", tab: "Annuaire", title: "Annuaire interne", text: "Noms, fonctions, emails et numéros de poste de toute l’équipe."},
  {file: "organigramme", tab: "Organigramme", title: "Organigramme", text: "Les services et l’encadré « Qui traite quoi ? » pour choisir le bon destinataire."},
  {file: "clients", tab: "Clients", title: "Tableau des clients", text: "Les clients existants, leurs contacts et la personne qui les suit (colonne « Suivi par »)."},
  {file: "tarifs", tab: "Offres & tarifs", title: "Produits, services & grille tarifaire", text: "Les produits et services, les références PV-01 à PV-08, les tarifs et les conditions."},
  {file: "calendrier", tab: "Calendrier", title: "Calendrier 2026", text: "Les matchs, concerts et événements prévus au Stade de France."},
] as const;
export const PITCH_ALL_PDF = "/pitch-vision/pitch-vision-documents.pdf";
