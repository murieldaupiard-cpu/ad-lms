import type { Question } from "./quiz-questions";

// ---------------------------------------------------------------------------
// CADGA Vocabulary bank — Day 3 · Module 01
//
// Transcrit de la fiche Wayground « TP CADGA - RÉCAP DU VOCABULAIRE »
// (47 questions). Deux corrections par rapport à la source :
//   - Q15 « feedback » : l'option « D. Réponse » est devenue « Réponse ».
//   - Q28 et Q29 (« to purchase » / « to buy ») avaient la même bonne réponse,
//     « acheter », l'une après l'autre : elles sont fusionnées en une seule
//     question à deux réponses.
// Soit 46 questions au total.
// ---------------------------------------------------------------------------

export const VOCABULARY_BANK: Question[] = [
  { id: "v1", type: "single", time: 20, prompt: "What is a prospect?", options: ["Un fournisseur", "Un client existant", "Un client potentiel", "Un distributeur"], correct: 2 },
  { id: "v2", type: "single", time: 25, prompt: "Your contact says: “We are an existing customer.” What does it mean?", options: ["C’est un client potentiel", "C’est déjà un client de l’entreprise", "C’est un fournisseur", "C’est un nouveau contact"], correct: 1 },
  { id: "v3", type: "single", time: 20, prompt: "What is a supplier?", options: ["Client", "Fournisseur", "Prospect", "Responsable"], correct: 1 },
  { id: "v4", type: "single", time: 20, prompt: "What is a Sales Manager?", options: ["Responsable administratif", "Responsable export", "Responsable achats", "Responsable commercial"], correct: 3 },
  { id: "v5", type: "single", time: 20, prompt: "What is a CEO?", options: ["Responsable commercial", "Responsable export", "Responsable administratif", "Directeur général"], correct: 3 },
  { id: "v6", type: "single", time: 20, prompt: "What is an Office Manager?", options: ["Responsable export", "Responsable achats", "Responsable commercial", "Responsable administratif"], correct: 3 },
  { id: "v7", type: "single", time: 20, prompt: "Translate “voicemail”.", options: ["Message vocal", "Courrier", "Réunion", "Appel"], correct: 0 },
  { id: "v8", type: "single", time: 20, prompt: "What does “call back” mean?", options: ["Répondre", "Appeler", "Rappeler", "Envoyer"], correct: 2 },
  { id: "v9", type: "single", time: 20, prompt: "What is the reason for the call?", options: ["Le numéro", "Le client", "L’objet de l’appel", "L’entreprise"], correct: 2 },
  { id: "v10", type: "single", time: 20, prompt: "What are contact details?", options: ["Contact humain", "Contact audiovisuel", "Coordonnées", "Détails de l’agenda"], correct: 2 },
  { id: "v11", type: "single", time: 20, prompt: "Translate “leave a message”.", options: ["écrire un message", "répondre à un message", "laisser un message", "annuler un message"], correct: 2 },
  { id: "v12", type: "single", time: 20, prompt: "Translate “request” in French.", options: ["salutation", "réponse", "test", "demande"], correct: 3 },
  { id: "v13", type: "single", time: 25, prompt: "What are Terms and Conditions?", options: ["Conditions de livraison", "Conditions Générales de Vente", "Conditions de paiement", "Conditions d’achat"], correct: 1 },
  { id: "v14", type: "single", time: 20, prompt: "Translate “delivery terms”.", options: ["Conditions de livraison", "Conditions de paiement", "Conditions d’achat", "Conditions de vente"], correct: 0 },
  { id: "v15", type: "single", time: 20, prompt: "What is feedback?", options: ["Information", "Demande", "Avis", "Réponse"], correct: 2 },
  { id: "v16", type: "single", time: 20, prompt: "Translate “follow-up”.", options: ["Suivi", "Réunion", "Confirmation", "Réponse"], correct: 0 },
  { id: "v17", type: "single", time: 20, prompt: "What does “availability” mean?", options: ["Adaptabilité", "Disponibilité", "Faisabilité", "Ancienneté"], correct: 1 },
  { id: "v18", type: "single", time: 25, prompt: "What does “free” mean in “I am free”?", options: ["Gratuit", "En congé", "Présent", "Disponible"], correct: 3 },
  { id: "v19", type: "single", time: 20, prompt: "Translate “appointment”.", options: ["Réunion", "Planning", "Rendez-vous", "Entretien"], correct: 2 },
  { id: "v20", type: "single", time: 20, prompt: "What is a range of products?", options: ["Produits bio", "Catégorie de produits", "Gamme de produits", "Produits de beauté"], correct: 2 },
  { id: "v21", type: "single", time: 20, prompt: "Translate “facial care”.", options: ["Crème", "Soins du visage", "Soins du corps", "Produits bio"], correct: 1 },
  { id: "v22", type: "single", time: 20, prompt: "Translate “delivery”.", options: ["livraison", "commande", "stockage", "emballage"], correct: 0 },
  { id: "v23", type: "single", time: 25, prompt: "What does “keep me updated” mean?", options: ["restez informé", "restez connecté", "donnez-moi la mise à jour", "tenez-moi informé"], correct: 3 },
  { id: "v24", type: "single", time: 20, prompt: "What does “provide” mean?", options: ["fournir", "envoyer", "recevoir", "acheter"], correct: 0 },
  { id: "v25", type: "single", time: 20, prompt: "Translate “to schedule”.", options: ["restructurer", "planifier", "préparer", "simplifier le schéma"], correct: 1 },
  { id: "v26", type: "single", time: 20, prompt: "What does “postpone” mean?", options: ["suspendre", "confirmer", "annuler", "reporter"], correct: 3 },
  { id: "v27", type: "single", time: 20, prompt: "Translate “deadline”.", options: ["date de péremption", "date ultérieure", "date de livraison", "date limite"], correct: 3 },
  { id: "v28", type: "multi", time: 30, prompt: "Quels verbes signifient « acheter » ? (2 réponses)", options: ["to sell", "to buy", "to provide", "to purchase"], correct: [1, 3] },
  { id: "v29", type: "single", time: 20, prompt: "Translate “record”.", options: ["produit", "contrat", "dossier", "catalogue"], correct: 2 },
  { id: "v30", type: "single", time: 20, prompt: "What does “to sell” mean?", options: ["fournir", "acheter", "vendre", "livrer"], correct: 2 },
  { id: "v31", type: "single", time: 35, prompt: "What does this sentence mean? “Could you send us more information?”", options: ["Pourriez-vous nous rappeler", "Pourriez-vous modifier mes informations", "Pourriez-vous nous envoyer davantage d’informations ?", "Pourriez-vous confirmer votre disponibilité ?"], correct: 2 },
  { id: "v32", type: "single", time: 20, prompt: "What is a Purchasing Manager?", options: ["Responsable commercial", "Directeur général", "Responsable export", "Responsable des achats"], correct: 3 },
  { id: "v33", type: "single", time: 20, prompt: "What is a Project Manager?", options: ["Chef de projet", "Commercial", "Responsable administratif", "Décideur"], correct: 0 },
  { id: "v34", type: "single", time: 20, prompt: "What is a Sales Representative?", options: ["Responsable commercial", "Directeur", "Décideur", "Commercial(e)"], correct: 3 },
  { id: "v35", type: "single", time: 20, prompt: "What is an inquiry?", options: ["Commande", "Réclamation", "Catalogue", "Demande d’information"], correct: 3 },
  { id: "v36", type: "single", time: 20, prompt: "What is a quotation?", options: ["Facture", "Catalogue", "Paiement", "Devis"], correct: 3 },
  { id: "v37", type: "single", time: 20, prompt: "Translate “sample”.", options: ["Catalogue", "Échantillon", "Devis", "Produit"], correct: 1 },
  { id: "v38", type: "single", time: 30, prompt: "What does “Looking forward to hearing from you” mean?", options: ["Merci pour votre message.", "Veuillez me contacter.", "Dans l’attente de votre retour.", "Nous vous répondrons."], correct: 2 },
  { id: "v39", type: "single", time: 20, prompt: "Translate “issue”.", options: ["Commande", "Problème", "Question", "Solution"], correct: 1 },
  { id: "v40", type: "single", time: 20, prompt: "Translate “refund”.", options: ["Paiement", "Remplacement", "Acompte", "Remboursement"], correct: 3 },
  { id: "v41", type: "single", time: 20, prompt: "Translate “order number”.", options: ["Numéro de commande", "Numéro de suivi", "Numéro de client", "Numéro de facture"], correct: 0 },
  { id: "v42", type: "single", time: 20, prompt: "What does “tracking number” mean?", options: ["Référence produit", "Numéro de suivi", "Numéro de commande", "Numéro de téléphone"], correct: 1 },
  { id: "v43", type: "single", time: 20, prompt: "Translate “warehouse”.", options: ["Entrepôt", "Usine", "Magasin", "Bureau"], correct: 0 },
  { id: "v44", type: "single", time: 25, prompt: "What is expected delivery?", options: ["Livraison urgente", "Livraison express", "Date limite", "Livraison prévue"], correct: 3 },
  { id: "v45", type: "single", time: 20, prompt: "Translate “furniture”.", options: ["Canapé", "Mobilier", "Décoration", "Tapis"], correct: 1 },
  { id: "v46", type: "single", time: 20, prompt: "Translate “invoice”.", options: ["Devis", "Paiement", "Acompte", "Facture"], correct: 3 },
];
