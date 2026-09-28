export type Situation = {
  id: number;
  brief: string;
  categories: string[];
  category: number;
  companies: string[];
  company: number;
  demandes: string[];
  demande: number;
  why: string;
};

// Dix situations couvrant les catégories de contact et de demande rencontrées
// chez Primevère. Dans chaque triplet de propositions, les deux mauvaises sont
// plausibles : c'est ce qui rend l'exercice utile.
export const SITUATIONS: Situation[] = [
  {
    id: 1,
    brief: "Maja appelle de Copenhague pour Nordic Bloom Cosmetics. Elle a découvert la gamme de cosmétiques biologiques sur un salon, n’a jamais commandé, et souhaite recevoir les tarifs et les conditions de livraison.",
    categories: ["Prospect", "Client existant", "Distributeur exclusif"],
    category: 0,
    companies: ["Nordic Bloom Cosmetics", "Primevère", "Aurora Beauty Ltd"],
    company: 0,
    demandes: ["demande d’informations et de tarifs", "réclamation sur une livraison", "changement de coordonnées"],
    demande: 0,
    why: "Elle n’a jamais commandé : c’est un prospect, pas un client. Et l’entreprise à faire figurer est la sienne, pas Primevère — Joël Salu sait déjà où il travaille.",
  },
  {
    id: 2,
    brief: "Aurora Beauty Ltd, cliente irlandaise déjà référencée dans la base, appelle : la société a changé de nom de domaine, toutes les adresses email de son service commercial sont modifiées.",
    categories: ["Prospect", "Client existant", "Fournisseur"],
    category: 1,
    companies: ["Aurora Beauty Ltd", "Primevère", "Kosmetyka Warszawa"],
    company: 0,
    demandes: ["changement de coordonnées", "demande de devis", "relance"],
    demande: 0,
    why: "Elle est déjà dans la base : client existant. L’objet doit annoncer le changement de coordonnées, sinon personne ne comprend qu’il faut modifier une fiche.",
  },
  {
    id: 3,
    brief: "Le responsable commercial de Cosmética Rio Ltda, à São Paulo, appelle contrarié : le colis reçu hier contenait douze flacons brisés. Il demande un remplacement rapide.",
    categories: ["Réclamation", "Commande", "Demande d’informations"],
    category: 0,
    companies: ["Cosmética Rio Ltda", "Primevère", "Nordic Bloom Cosmetics"],
    company: 0,
    demandes: ["douze flacons brisés à la livraison", "demande d’échantillons", "changement de coordonnées"],
    demande: 0,
    why: "Un litige sur une marchandise reçue est une réclamation. Et la précision « douze flacons brisés » permet de traiter le dossier sans rappeler le client.",
  },
  {
    id: 4,
    brief: "Bellezza Milano représente la marque en Italie depuis six ans. Son dirigeant appelle pour un réassort avant les fêtes : 300 coffrets de la gamme Parfums & senteurs.",
    categories: ["Distributeur exclusif", "Distributeur potentiel", "Fournisseur"],
    category: 0,
    companies: ["Bellezza Milano", "Primevère", "Cosmética Rio Ltda"],
    company: 0,
    demandes: ["commande de réassort de 300 coffrets", "demande de devis", "réclamation sur une facture"],
    demande: 0,
    why: "Il représente déjà la marque : c’est l’un des quinze distributeurs exclusifs, pas un candidat. Le volume dans l’objet permet d’anticiper le stock.",
  },
  {
    id: 5,
    brief: "Kosmetyka Warszawa appelle de Varsovie : cette société ne travaille pas encore avec Primevère et souhaite représenter la marque sur le marché polonais.",
    categories: ["Distributeur potentiel", "Prospect", "Distributeur exclusif"],
    category: 0,
    companies: ["Kosmetyka Warszawa", "Primevère", "Bellezza Milano"],
    company: 0,
    demandes: ["candidature pour le marché polonais", "commande de réassort", "changement de coordonnées"],
    demande: 0,
    why: "Elle ne veut pas acheter pour elle, elle veut vendre pour vous : ce n’est pas un prospect. Et rien n’est signé : ce n’est pas encore un distributeur exclusif.",
  },
  {
    id: 6,
    brief: "Verrerie Saint-Clair, qui fabrique les flacons de la gamme solaire, appelle : sa production a pris du retard, la prochaine livraison arrivera avec dix jours de décalage.",
    categories: ["Fournisseur", "Client existant", "Réclamation"],
    category: 0,
    companies: ["Verrerie Saint-Clair", "Primevère", "Kosmetyka Warszawa"],
    company: 0,
    demandes: ["retard de livraison de dix jours", "demande d’informations", "commande de réassort"],
    demande: 0,
    why: "Il livre Primevère : c’est un fournisseur, pas un client. Piège classique, parce qu’il parle lui aussi de livraison.",
  },
  {
    id: 7,
    brief: "Farmácia Atlântico, chaîne de parapharmacies portugaise jamais cliente, veut chiffrer une opération : 500 coffrets découverte pour ses vingt points de vente.",
    categories: ["Prospect", "Distributeur exclusif", "Client existant"],
    category: 0,
    companies: ["Farmácia Atlântico", "Primevère", "Verrerie Saint-Clair"],
    company: 0,
    demandes: ["demande de devis pour 500 coffrets", "réclamation sur une commande", "candidature de distribution"],
    demande: 0,
    why: "Elle veut un chiffrage, pas des informations générales : « demande de devis » oriente directement vers l’administration des ventes.",
  },
  {
    id: 8,
    brief: "Highgate Retail Ltd rappelle de Londres : la société a demandé un devis il y a quinze jours et n’a toujours pas de réponse. Son acheteur s’impatiente.",
    categories: ["Relance", "Prospect", "Fournisseur"],
    category: 0,
    companies: ["Highgate Retail Ltd", "Primevère", "Farmácia Atlântico"],
    company: 0,
    demandes: ["devis sans réponse depuis quinze jours", "changement de coordonnées", "commande de réassort"],
    demande: 0,
    why: "Ce n’est pas une nouvelle demande mais une relance. Mentionner le délai dans l’objet signale l’urgence sans avoir à ouvrir le message.",
  },
  {
    id: 9,
    brief: "Institut Marine, cliente française fidèle, voudrait tester la nouvelle gamme solaire avant de l’inscrire à son catalogue. Elle demande des échantillons.",
    categories: ["Client existant", "Prospect", "Distributeur potentiel"],
    category: 0,
    companies: ["Institut Marine", "Primevère", "Highgate Retail Ltd"],
    company: 0,
    demandes: ["demande d’échantillons de la gamme solaire", "demande de devis", "réclamation sur un produit"],
    demande: 0,
    why: "Elle commande déjà : client existant. « Échantillons » est plus précis que « demande d’informations » et évite un aller-retour.",
  },
  {
    id: 10,
    brief: "Le service comptabilité de Bellezza Milano appelle : la facture du mois dernier leur est parvenue deux fois. Ils demandent un avoir sur le doublon.",
    categories: ["Réclamation", "Commande", "Relance"],
    category: 0,
    companies: ["Bellezza Milano", "Primevère", "Institut Marine"],
    company: 0,
    demandes: ["facture reçue en double, demande d’avoir", "demande de devis", "changement de coordonnées"],
    demande: 0,
    why: "Une réclamation ne porte pas que sur la marchandise : un litige de facturation en est une aussi. L’objet doit dire « avoir » pour que la comptabilité s’en saisisse.",
  },
];
