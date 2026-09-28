// Contenu du dossier Primevère — repris mot pour mot des 5 documents fournis par Muriel (septembre 2026) :
// 1/6 Fiche d'identité (infographie) · 2/6 Engagements, labels & responsabilité · 3/6 Catalogue produits ·
// 4/6 et 5/6 Réseau international – distributeurs exclusifs · Organigramme.

export const documents = [
  {n: "01", title: "Fiche d’identité", detail: "Informations générales, histoire, chiffres clés, activités", file: "/documents/primevere-infographie.pdf"},
  {n: "02", title: "Engagements, labels & responsabilité", detail: "Labels, engagements concrets, objectifs 2030", file: "/documents/primevere-engagements.pdf"},
  {n: "03", title: "Catalogue produits", detail: "5 gammes, références, contenances et prix HT", file: "/documents/primevere-catalogue.pdf"},
  {n: "04", title: "Distributeurs exclusifs", detail: "15 partenaires : entreprises, contacts, emails, téléphones", file: "/documents/primevere-distributeurs.pdf"},
  {n: "05", title: "Organigramme", detail: "Directions, interlocuteurs, fonctions, lignes directes", file: "/documents/primevere-organigramme.pdf"},
];

export const identity = {
  general: [
    ["Raison sociale", "Primevère SAS (entreprise fictive)"],
    ["Forme juridique", "SAS"],
    ["Siège social", "123 Avenue des Plantes, 75008 Paris, France"],
    ["Téléphone (standard)", "+33 1 47 32 10 00"],
    ["Email général", "contact@primevere.fr"],
    ["Site internet", "www.primevere.fr"],
    ["Date de création", "1958"],
    ["Effectif", "150 collaborateurs"],
    ["Chiffre d’affaires (2024)", "32 millions d’euros"],
    ["Part de l’export", "13 %"],
    ["Secteur d’activité", "Cosmétiques naturels et soins bien-être"],
    ["Marchés", "Grand public, instituts, pharmacies, distributeurs spécialisés"],
  ],
  history: [
    ["1958", "Création de Primevère par une passionnée de botanique."],
    ["1963", "Première gamme de soins à base d’extraits végétaux."],
    ["1978", "Développement de la distribution en France et en Europe."],
    ["1988", "Ouverture à l’international."],
    ["1992", "Modernisation des sites de production."],
    ["1995", "Lancement de la gamme solaire."],
    ["2003", "Certification BIO et développement de nouvelles formules écoresponsables."],
    ["2016", "Expansion sur de nouveaux marchés (Asie, Amériques)."],
    ["Aujourd’hui", "Une marque reconnue pour son expertise, son innovation et son engagement durable."],
  ],
  figures: [
    ["150", "collaborateurs"],
    ["30", "produits"],
    ["5", "gammes"],
    ["32 M€", "chiffre d’affaires"],
    ["13 %", "à l’export"],
    ["15", "pays partenaires"],
  ],
  mission: "Révéler la beauté naturelle de chacun grâce à des soins botaniques efficaces et respectueux de l’environnement.",
  activity: [
    ["Conception & recherche", "Des formules innovantes inspirées par la nature."],
    ["Fabrication", "Des sites de production modernes et responsables."],
    ["Distribution", "Un réseau de partenaires exclusifs dans 15 pays."],
    ["Commercialisation", "Des soins adaptés à tous les types de peaux et à tous les besoins."],
    ["Innovation durable", "Des engagements concrets pour une beauté plus responsable."],
  ],
};

export const commitments = {
  labels: [
    ["COSMOS ORGANIC", "Des cosmétiques biologiques et naturels, selon le référentiel européen COSMOS."],
    ["ECOCERT", "Certification d’ingrédients issus de l’agriculture biologique et de procédés respectueux de l’environnement."],
    ["COSMOS NATURAL", "Des formules naturelles, avec un minimum de 95 % d’ingrédients d’origine naturelle."],
    ["VEGAN SOCIETY", "Aucun ingrédient d’origine animale et aucun test sur les animaux."],
    ["CRUELTY FREE INTERNATIONAL", "Garantie que nos produits ne sont pas testés sur les animaux."],
    ["FABRIQUÉ EN FRANCE", "Des produits formulés et majoritairement fabriqués en France, dans le respect des normes européennes."],
    ["FSC (Forest Stewardship Council®)", "Des emballages issus de forêts gérées durablement et de sources responsables."],
    ["1% FOR THE PLANET", "1 % de notre chiffre d’affaires reversé à des projets environnementaux."],
  ],
  concrete: [
    ["Des ingrédients d’origine naturelle", "Jusqu’à 99 % d’ingrédients d’origine naturelle dans nos formules."],
    ["Des formules clean", "Sans silicones, sans parabènes, sans huiles minérales, sans colorants controversés."],
    ["Une production maîtrisée", "Sites de production modernes, contrôles qualité rigoureux, amélioration continue de nos procédés."],
    ["Des emballages éco-responsables", "Matériaux recyclables ou recyclés, réduction du plastique, éco-conception de nos packagings."],
    ["Une empreinte carbone réduite", "Optimisation des transports, production locale et recours aux énergies renouvelables."],
    ["Un approvisionnement durable", "Des partenariats responsables avec des producteurs engagés et des filières équitables."],
  ],
  goals: [
    ["100 %", "des nouvelles formules éco-conçues"],
    ["-50 %", "de plastique vierge dans nos emballages"],
    ["-40 %", "d’émissions de CO₂ (par unité produite)"],
    ["100 %", "de nos fournisseurs évalués selon des critères RSE"],
    ["10", "nouveaux projets pour la biodiversité soutenus"],
  ],
  field: [
    ["Filières botaniques durables", "Approvisionnement responsable de nos plantes auprès de producteurs locaux et internationaux engagés."],
    ["Soutien à la biodiversité", "Protection des espèces végétales et des écosystèmes, en collaboration avec des associations environnementales."],
    ["Communautés locales", "Développement de projets économiques et sociaux dans les régions de culture de nos matières premières."],
    ["Recherche & innovation", "Des formules toujours plus naturelles et efficaces, grâce à la science et à l’expertise botanique."],
  ],
  awards: [
    ["Prix Innovation Cosmétique", "2022", "Salon In-Cosmetics"],
    ["Trophée RSE", "2023", "Cosmétiques & Société"],
    ["Entreprise engagée pour la planète", "2024", "Les Trophées du Développement Durable"],
  ],
};

export type Product = [ref: string, name: string, size: string, price: string];
export const ranges: {id: string; n: string; name: string; tagline: string; text: string; tags: string[]; image: string; products: Product[]}[] = [
  {id: "visage-corps", n: "1", name: "Visage & corps", tagline: "L’hydratation essentielle au quotidien", text: "Des soins doux et efficaces pour une peau saine et éclatante.", tags: ["Hydratation 24 h", "Peaux normales à sèches", "Visage & corps"], image: "/documents/ranges/visage-corps.webp", products: [
    ["VC001", "Lait hydratant intense 24 h", "200 ml", "8,50 €"],
    ["VC002", "Crème de jour à l’aubépine", "50 ml", "12,00 €"],
    ["VC003", "Sérum végétal coup d’éclat", "30 ml", "15,00 €"],
    ["VC004", "Gel douche hydratant au monoi", "250 ml", "6,00 €"],
    ["VC005", "Lait démaquillant apaisant", "200 ml", "7,50 €"],
    ["VC006", "Lotion tonique clarifiante", "200 ml", "7,00 €"],
  ]},
  {id: "beaute-express", n: "2", name: "Beauté express", tagline: "Des solutions ciblées et efficaces", text: "Une routine simple pour une peau fraîche et éclatante, même dans un quotidien bien rempli.", tags: ["Effet éclat immédiat", "Tous types de peaux", "Routine express"], image: "/documents/ranges/beaute-express.webp", products: [
    ["BE001", "Gel nettoyant douceur", "150 ml", "6,00 €"],
    ["BE002", "Crème mains réparatrice", "75 ml", "5,50 €"],
    ["BE003", "Masque hydratant coup d’éclat", "50 ml", "9,00 €"],
    ["BE004", "Baume lèvres nourrissant", "10 ml", "4,00 €"],
    ["BE005", "Brume visage rafraîchissante", "100 ml", "7,00 €"],
    ["BE006", "Gel contour des yeux défatigant", "15 ml", "11,00 €"],
  ]},
  {id: "solaire", n: "3", name: "Solaire", tagline: "Une protection efficace et sensorielle", text: "Des soins solaires respectueux de la peau et de l’environnement.", tags: ["Haute protection UVA/UVB", "Résistant à l’eau", "Formules respectueuses des océans"], image: "/documents/ranges/solaire.webp", products: [
    ["SO001", "Crème solaire visage SPF 50", "50 ml", "14,00 €"],
    ["SO002", "Lait solaire corps SPF 30", "200 ml", "13,00 €"],
    ["SO003", "Spray solaire SPF 50", "150 ml", "16,00 €"],
    ["SO004", "Après-soleil apaisant", "200 ml", "9,00 €"],
    ["SO005", "Brume rafraîchissante après-soleil", "100 ml", "8,50 €"],
    ["SO006", "Stick solaire zones sensibles SPF 50", "15 g", "10,00 €"],
  ]},
  {id: "parfums-bien-etre", n: "4", name: "Parfums & bien-être", tagline: "Des senteurs inspirées par la nature", text: "Des fragrances délicates pour un moment de bien-être au quotidien.", tags: ["Parfums naturels et durables", "Huiles essentielles", "Bien-être au quotidien"], image: "/documents/ranges/parfums-bien-etre.webp", products: [
    ["PB001", "Eau de toilette Fleur de Lin", "50 ml", "18,00 €"],
    ["PB002", "Eau de toilette Jardin de Lavande", "50 ml", "18,00 €"],
    ["PB003", "Eau de toilette Fleur d’Oranger", "50 ml", "18,00 €"],
    ["PB004", "Brume parfumée Corps & Cheveux", "100 ml", "12,00 €"],
    ["PB005", "Bougie parfumée Ambre & Fleurs", "180 g", "14,00 €"],
    ["PB006", "Huile de massage Relax", "100 ml", "11,00 €"],
  ]},
  {id: "produits-specifiques", n: "5", name: "Produits spécifiques", tagline: "Des soins ciblés pour chaque besoin", text: "Des formules expertes pour répondre aux problématiques de peau.", tags: ["Anti-âge", "Peaux sensibles", "Soins experts"], image: "/documents/ranges/produits-specifiques.webp", products: [
    ["PS001", "Crème anti-âge régénérante", "50 ml", "16,00 €"],
    ["PS002", "Sérum fermeté liftant", "30 ml", "22,00 €"],
    ["PS003", "Soin fortifiant capillaire", "150 ml", "11,00 €"],
    ["PS004", "Soin purifiant peaux sensibles", "50 ml", "14,00 €"],
    ["PS005", "Gel apaisant après-rasage", "75 ml", "8,00 €"],
    ["PS006", "Masque détox peaux mixtes", "50 ml", "10,00 €"],
  ]},
];
export const catalogueClaims = ["Ingrédients d’origine naturelle jusqu’à 99 %", "Fabriqué en France", "COSMOS, COSMOS ORGANIC ou COSMOS NATURAL selon les produits", "Formules clean : sans silicones, sans parabènes, sans huiles minérales"];
export const ingredients = [["Aubépine", "Apaisante"], ["Aloe vera", "Hydratante"], ["Lavande", "Relaxante"], ["Fleur d’oranger", "Éclat"], ["Monoï", "Nourrissant"], ["Karité", "Protecteur"], ["Thé vert", "Antioxydant"]];

export type Partner = [code: string, country: string, company: string, city: string, address: string, contact: string, role: string, email: string, phone: string];
export const regions: {id: string; name: string; partners: Partner[]}[] = [
  {id: "europe", name: "Europe", partners: [
    ["E01", "Allemagne", "Böhme GmbH", "Berlin", "Kurfürstendamm 210, 10719 Berlin, Allemagne", "Anna Müller", "Responsable des importations", "a.mueller@boehme.de", "+49 30 2345 6789"],
    ["E02", "Espagne", "Empresa Aguileras", "Madrid", "Calle de Serrano 118, 28006 Madrid, Espagne", "Carlos Torres", "Responsable commercial", "c.torres@aguileras.es", "+34 91 523 2210"],
    ["E03", "Irlande", "Beltine Healthcare", "Dublin", "Riverside Business Park, Block B, Unit 4, Dublin D12 X9P8, Irlande", "Sarah O’Connor", "Responsable des ventes", "s.oconnor@beltine.ie", "+353 1 672 4450"],
    ["E04", "Italie", "Firma Venere", "Milan", "Via Alessandro Manzoni 32, 20121 Milano, Italie", "Luca Bianchi", "Responsable pays", "l.bianchi@firmavenere.it", "+39 02 8545 7766"],
    ["E05", "Royaume-Uni", "Advanced Care Products Ltd", "Londres", "Unit 12, Cumberland Business Centre, 230 Old Oak Common Lane, London NW10 6DX, Royaume-Uni", "Emily Carter", "Responsable des achats", "e.carter@advancedcare.co.uk", "+44 20 7612 3444"],
    ["E06", "Suède", "Dermarome Stockholm AB", "Stockholm", "Sveavägen 145, 113 46 Stockholm, Suède", "Erik Lindström", "Directeur des opérations", "e.lindstrom@dermarome.se", "+46 8 612 0000"],
    ["E07", "Ukraine", "Scientific Beauty Academy", "Kiev", "Velyka Vasylkivska St. 102, 01004 Kyiv, Ukraine", "Olena Kovalenko", "Responsable partenariats", "o.kovalenko@sba.ua", "+380 44 337 1788"],
  ]},
  {id: "ameriques", name: "Amériques", partners: [
    ["A01", "Brésil", "Laboratório Koni", "São Paulo", "Av. Paulista 1000, Bela Vista, São Paulo, Brésil", "Ana Paula Silva", "Directrice commerciale", "a.silva@koni.com.br", "+55 11 3123 4455"],
    ["A02", "Canada", "Lush Cosmetics Ltd", "Toronto", "150 King St W, Suite 1200, Toronto, ON M5H 1J9, Canada", "Marc Deschamps", "Responsable du développement", "m.deschamps@lushcosmetics.ca", "+1 416 360 7788"],
    ["A03", "États-Unis", "Haney Inc.", "New York", "445 Madison Ave, Suite 1200, New York, NY 10022, États-Unis", "Jessica Haney", "Directrice des ventes", "j.haney@haneyinc.com", "+1 212 555 0199"],
  ]},
  {id: "asie", name: "Asie", partners: [
    ["AS01", "Chine", "Gwen Beauty Co.", "Shanghai", "Suite 2201, 1288 Nanjing West Road, Shanghai 200040, Chine", "Li Wei", "Responsable commerciale", "l.wei@gwenbeauty.cn", "+86 21 6288 7733"],
    ["AS02", "Japon", "Sakura Cosme", "Tokyo", "4-18-6 Ginza, Chuo-ku, Tokyo 104-0061, Japon", "Yuki Tanaka", "Responsable partenariats", "y.tanaka@sakuracosme.jp", "+81 3 6688 5521"],
    ["AS03", "Singapour", "PureGlow Asia", "Singapour", "8 Marina Boulevard, #15-03 Marina Bay, Singapour 018981", "Daniel Lim", "Directeur des opérations", "d.lim@pureglowasia.sg", "+65 6900 2277"],
  ]},
  {id: "oceanie", name: "Océanie", partners: [
    ["OC01", "Australie", "Natural Care Australie", "Sydney", "Level 10, 88 Market Street, Sydney NSW 2000, Australie", "Sarah Williams", "Responsable pays", "s.williams@naturalcare.com.au", "+61 2 9234 1100"],
  ]},
  {id: "afrique", name: "Afrique", partners: [
    ["AF01", "Afrique du Sud", "Botanic Africa", "Le Cap", "The Terraces, 8 Bree Street, Cape Town 8001, Afrique du Sud", "Thabo Ndlovu", "Responsable des ventes", "t.ndlovu@botanicafrica.co.za", "+27 21 422 8890"],
  ]},
];

export type Person = [name: string, role: string, phone: string, email: string];
export const leadership: Person[] = [
  ["Pierre BOSS", "Président-directeur général", "+33 1 47 32 10 01", "p.boss@primevere.fr"],
  ["Sophie MARTIN", "Assistante de direction", "+33 1 47 32 10 02", "s.martin@primevere.fr"],
];
export const directions: {id: string; name: string; people: Person[]}[] = [
  {id: "achats", name: "Direction des achats", people: [
    ["Yves BILLET", "Directeur des achats", "+33 1 47 32 10 10", "y.billet@primevere.fr"],
    ["Xavier BELLO", "Acheteur", "+33 1 47 32 10 11", "x.bello@primevere.fr"],
    ["René SOCHAN", "Acheteur", "+33 1 47 32 10 12", "r.sochan@primevere.fr"],
    ["Hervé LEMPEREUR", "Responsable du magasin des matières premières et emballages", "+33 1 47 32 10 13", "h.lempereur@primevere.fr"],
  ]},
  {id: "production", name: "Direction de production", people: [
    ["Pierre VIRON", "Directeur de production", "+33 1 47 32 10 20", "p.viron@primevere.fr"],
    ["François ROSSI", "Responsable du laboratoire", "+33 1 47 32 10 21", "f.rossi@primevere.fr"],
    ["Claude JOURDAIN", "Responsable assurance qualité de la fabrication", "+33 1 47 32 10 22", "c.jourdain@primevere.fr"],
    ["Pierre AUNE", "Responsable du magasin des produits finis", "+33 1 47 32 10 23", "p.aune@primevere.fr"],
  ]},
  {id: "commerciale", name: "Direction commerciale", people: [
    ["Daniel BERGER", "Directeur commercial", "+33 1 47 32 10 30", "d.berger@primevere.fr"],
    ["Joël SALU", "Responsable de l’administration des ventes", "+33 1 47 32 10 31", "j.salu@primevere.fr"],
    ["Jacques JOUX", "Chef des ventes", "+33 1 47 32 10 32", "j.joux@primevere.fr"],
    ["Lucien LANOAN", "Chef des ventes", "+33 1 47 32 10 33", "l.lanoan@primevere.fr"],
    ["Marie DUPONT", "Responsable export et grands comptes", "+33 1 47 32 10 34", "m.dupont@primevere.fr"],
  ]},
  {id: "services", name: "Services généraux", people: [
    ["René DUPRÉ", "Directeur des services généraux", "+33 1 47 32 10 40", "r.dupre@primevere.fr"],
    ["Nicolas HUET", "Responsable logistique et transports", "+33 1 47 32 10 41", "n.huet@primevere.fr"],
    ["Didier ROBERT", "Responsable maintenance et sécurité", "+33 1 47 32 10 42", "d.robert@primevere.fr"],
    ["Fatima BELDI", "Responsable hygiène et environnement", "+33 1 47 32 10 43", "f.beldi@primevere.fr"],
  ]},
  {id: "administrative", name: "Direction administrative", people: [
    ["Christian CATALA", "Directeur administratif", "+33 1 47 32 10 50", "c.catala@primevere.fr"],
    ["Daniel LARUE", "Responsable comptabilité et finances", "+33 1 47 32 10 51", "d.larue@primevere.fr"],
    ["Gérald MARCHAND", "Directeur des ressources humaines", "+33 1 47 32 10 52", "g.marchand@primevere.fr"],
    ["Caroline DUMAS", "Responsable juridique", "+33 1 47 32 10 53", "c.dumas@primevere.fr"],
    ["Thomas BERTRAND", "Responsable informatique", "+33 1 47 32 10 54", "t.bertrand@primevere.fr"],
  ]},
];

// Onglet 8 · Manipuler les documents. Au moins une question par catégorie ; l'organigramme est travaillé
// en mises en situation (MES) : à qui transmettre l'appel ? Réponses vérifiables dans les documents téléchargés.
export type Question = {cat: string; doc: string; mes?: string; q: string; choices: string[]; answer: number; why: string};
export const quiz: Question[] = [
  {cat: "Fiche d’identité", doc: "01", q: "En quelle année Primevère a-t-elle obtenu la certification BIO ?", choices: ["1995", "2003", "2016"], answer: 1, why: "2003 : certification BIO et développement de nouvelles formules écoresponsables (Notre histoire)."},
  {cat: "Fiche d’identité", doc: "01", q: "Quelle part du chiffre d’affaires Primevère réalise-t-elle à l’export ?", choices: ["13 %", "15 %", "32 %"], answer: 0, why: "Part de l’export : 13 % (Informations générales). 15 est le nombre de pays partenaires, 32 M€ le chiffre d’affaires."},
  {cat: "Engagements & labels", doc: "02", q: "Un prospect veut une garantie : aucun ingrédient d’origine animale dans les produits. Quel label de Primevère le garantit ?", choices: ["FSC", "Vegan Society", "1% for the Planet"], answer: 1, why: "Vegan Society : aucun ingrédient d’origine animale et aucun test sur les animaux."},
  {cat: "Engagements & labels", doc: "02", q: "Quel est l’objectif de Primevère à 2030 pour le plastique vierge dans ses emballages ?", choices: ["-40 %", "-50 %", "100 %"], answer: 1, why: "Objectifs à 2030 : -50 % de plastique vierge dans nos emballages (-40 % concerne les émissions de CO₂)."},
  {cat: "Catalogue produits", doc: "03", q: "Un client passe commande de la référence BE002. De quel produit s’agit-il ?", choices: ["Crème mains réparatrice", "Baume lèvres nourrissant", "Crème de jour à l’aubépine"], answer: 0, why: "BE002 · Crème mains réparatrice · 75 ml · 5,50 € HT (gamme Beauté express)."},
  {cat: "Catalogue produits", doc: "03", q: "Un institut commande 10 Laits solaires corps SPF 30. Quel est le montant total HT ?", choices: ["130,00 €", "140,00 €", "160,00 €"], answer: 0, why: "SO002 · Lait solaire corps SPF 30 · 13,00 € HT × 10 = 130,00 € HT."},
  {cat: "Catalogue produits", doc: "03", q: "Quel est le produit le plus cher du catalogue ?", choices: ["Eau de toilette Jardin de Lavande", "Sérum fermeté liftant", "Spray solaire SPF 50"], answer: 1, why: "PS002 · Sérum fermeté liftant · 22,00 € HT. Les eaux de toilette sont à 18,00 € et le spray solaire à 16,00 €."},
  {cat: "Distributeurs · Europe", doc: "04", q: "Qui est votre interlocuteur chez Firma Venere, en Italie ?", choices: ["Luca Bianchi, Responsable pays", "Carlos Torres, Responsable commercial", "Erik Lindström, Directeur des opérations"], answer: 0, why: "E04 · Firma Venere · Milan · Luca Bianchi, Responsable pays · l.bianchi@firmavenere.it."},
  {cat: "Distributeurs · Europe", doc: "04", q: "Vous devez rappeler Dermarome Stockholm AB. Quel numéro composez-vous ?", choices: ["+46 8 612 0000", "+49 30 2345 6789", "+44 20 7612 3444"], answer: 0, why: "E06 · Dermarome Stockholm AB · +46 8 612 0000. Les deux autres numéros sont ceux de Böhme GmbH (Berlin) et d’Advanced Care Products Ltd (Londres)."},
  {cat: "Distributeurs · Monde", doc: "04", q: "Quel est le distributeur exclusif de Primevère au Japon ?", choices: ["Gwen Beauty Co.", "PureGlow Asia", "Sakura Cosme"], answer: 2, why: "AS02 · Sakura Cosme · Tokyo · Yuki Tanaka, Responsable partenariats."},
  {cat: "Distributeurs · Monde", doc: "04", q: "Vous devez écrire à Jessica Haney. Quelle adresse email utilisez-vous ?", choices: ["j.haney@haneyinc.com", "m.deschamps@lushcosmetics.ca", "a.silva@koni.com.br"], answer: 0, why: "A03 · Haney Inc. · New York · Jessica Haney, Directrice des ventes · j.haney@haneyinc.com."},
  {cat: "Organigramme", doc: "05", mes: "Un fournisseur d’emballages appelle : il veut fixer l’heure de livraison de ses cartons au magasin des matières premières et emballages.", q: "À qui transmettez-vous l’appel ?", choices: ["Pierre AUNE", "Hervé LEMPEREUR", "Fatima BELDI"], answer: 1, why: "Hervé LEMPEREUR · Responsable du magasin des matières premières et emballages (Direction des achats) · +33 1 47 32 10 13. Pierre AUNE gère le magasin des produits finis."},
  {cat: "Organigramme", doc: "05", mes: "Un commercial vous signale que le CRM n’enregistre plus les nouvelles fiches clients : il faut une mise à jour.", q: "À qui vous adressez-vous ?", choices: ["Thomas BERTRAND", "Didier ROBERT", "Daniel LARUE"], answer: 0, why: "Thomas BERTRAND · Responsable informatique (Direction administrative) · t.bertrand@primevere.fr."},
  {cat: "Organigramme", doc: "05", mes: "Une pharmacie de Lyon, qui ne vend pas encore Primevère, souhaite rencontrer un commercial pour référencer la marque.", q: "Prospect : à qui transmettez-vous sa demande ?", choices: ["Yves BILLET", "Jacques JOUX", "Gérald MARCHAND"], answer: 1, why: "Jacques JOUX · Chef des ventes (Direction commerciale). Yves BILLET dirige les achats : il achète pour Primevère, il ne vend pas."},
  {cat: "Organigramme", doc: "05", mes: "Une chaîne de parfumeries mexicaine voudrait importer toute la gamme Primevère. Le Mexique n’a pas encore de distributeur exclusif.", q: "Prospect à l’international : à qui transmettez-vous l’appel ?", choices: ["Caroline DUMAS", "Xavier BELLO", "Marie DUPONT"], answer: 2, why: "Marie DUPONT · Responsable export et grands comptes (Direction commerciale) · m.dupont@primevere.fr."},
  {cat: "Organigramme", doc: "05", mes: "Anna Müller, de Böhme GmbH (distributeur exclusif en Allemagne), appelle pour une grosse commande destinée à l’export.", q: "Distributeur exclusif : à qui la transmettez-vous ?", choices: ["Marie DUPONT", "Nicolas HUET", "Daniel LARUE"], answer: 0, why: "Marie DUPONT · Responsable export et grands comptes. Les distributeurs exclusifs sont des partenaires à l’export."},
  {cat: "Organigramme", doc: "05", mes: "Réclamation : un institut a reçu sa commande avec une semaine de retard et demande ce qui s’est passé avec le transporteur.", q: "À qui transmettez-vous la réclamation ?", choices: ["Pierre VIRON", "Nicolas HUET", "Gérald MARCHAND"], answer: 1, why: "Nicolas HUET · Responsable logistique et transports (Services généraux) · +33 1 47 32 10 41."},
  {cat: "Organigramme", doc: "05", mes: "Réclamation : une cliente signale que la texture de sa crème a changé d’un lot à l’autre et s’inquiète de la qualité de fabrication.", q: "À qui transmettez-vous la réclamation ?", choices: ["René SOCHAN", "Pierre AUNE", "Claude JOURDAIN"], answer: 2, why: "Claude JOURDAIN · Responsable assurance qualité de la fabrication (Direction de production)."},
  {cat: "Organigramme", doc: "05", mes: "Un producteur d’aloe vera bio appelle : il aimerait proposer ses matières premières à Primevère.", q: "Fournisseur : à qui transmettez-vous l’appel ?", choices: ["Xavier BELLO", "Jacques JOUX", "Didier ROBERT"], answer: 0, why: "Xavier BELLO · Acheteur (Direction des achats). Jacques JOUX est chef des ventes : il vend, il n’achète pas."},
  {cat: "Organigramme", doc: "05", mes: "Un fournisseur n’a toujours pas été payé : sa facture date de deux mois.", q: "À qui transmettez-vous l’appel ?", choices: ["Thomas BERTRAND", "Daniel LARUE", "Pierre AUNE"], answer: 1, why: "Daniel LARUE · Responsable comptabilité et finances (Direction administrative) · d.larue@primevere.fr."},
  {cat: "Organigramme", doc: "05", mes: "Un client veut savoir si les 200 Brumes visage rafraîchissantes qu’il vient de commander sont disponibles en stock, prêtes à partir.", q: "Qui peut vérifier le stock de produits finis ?", choices: ["Hervé LEMPEREUR", "Fatima BELDI", "Pierre AUNE"], answer: 2, why: "Pierre AUNE · Responsable du magasin des produits finis (Direction de production). Hervé LEMPEREUR gère les matières premières et emballages."},
  {cat: "Organigramme", doc: "05", mes: "L’avocat d’un distributeur exclusif appelle au sujet d’une clause d’exclusivité de son contrat.", q: "À qui transmettez-vous l’appel ?", choices: ["Caroline DUMAS", "Christian CATALA", "Marie DUPONT"], answer: 0, why: "Caroline DUMAS · Responsable juridique (Direction administrative) · +33 1 47 32 10 53."},
  {cat: "Organigramme", doc: "05", mes: "Une candidate appelle pour savoir où en est sa candidature spontanée.", q: "À qui transmettez-vous l’appel ?", choices: ["Sophie MARTIN", "Gérald MARCHAND", "René DUPRÉ"], answer: 1, why: "Gérald MARCHAND · Directeur des ressources humaines (Direction administrative)."},
  {cat: "Organigramme", doc: "05", mes: "Le technicien d’un prestataire doit intervenir sur une machine de l’usine tombée en panne.", q: "Qui est son interlocuteur ?", choices: ["Didier ROBERT", "François ROSSI", "Thomas BERTRAND"], answer: 0, why: "Didier ROBERT · Responsable maintenance et sécurité (Services généraux) · +33 1 47 32 10 42."},
  {cat: "Organigramme", doc: "05", mes: "Une journaliste souhaite obtenir une interview avec le président-directeur général, Pierre BOSS.", q: "À qui transmettez-vous sa demande ?", choices: ["Daniel BERGER", "Sophie MARTIN", "Caroline DUMAS"], answer: 1, why: "Sophie MARTIN · Assistante de direction · +33 1 47 32 10 02 : elle gère l’agenda et les demandes adressées au PDG."},
];

// Astuce propre à chaque sous-onglet de l'organigramme : quelles demandes transmettre à ce service.
export const orgTips: Record<string, [string, string]> = {
  direction: ["Le PDG ne se dérange pas directement.", "Une demande pour Pierre BOSS (rendez-vous, interview, invitation) passe par Sophie MARTIN, son assistante de direction : c’est elle qui gère son agenda."],
  achats: ["Ce que Primevère achète, pas ce qu’elle vend.", "Un fournisseur qui propose ses produits ou discute d’un prix : un acheteur (Xavier BELLO ou René SOCHAN). Une livraison de matières premières ou d’emballages à réceptionner : Hervé LEMPEREUR, au magasin."],
  production: ["Fabriquer, contrôler, stocker.", "Une question sur une formule : le laboratoire (François ROSSI). Un défaut de qualité sur un lot : Claude JOURDAIN. La disponibilité d’un produit fini en stock : Pierre AUNE."],
  commerciale: ["Tout ce qui concerne les clients.", "Un prospect en France : un chef des ventes (Jacques JOUX ou Lucien LANOAN). Un client à l’export, un grand compte ou un distributeur exclusif : Marie DUPONT. Le suivi d’une commande ou des coordonnées client à mettre à jour : Joël SALU, à l’administration des ventes."],
  services: ["Le fonctionnement de l’entreprise au quotidien.", "Une livraison en retard ou un transporteur : Nicolas HUET. Une machine en panne ou un problème de sécurité : Didier ROBERT. L’hygiène des locaux ou l’environnement : Fatima BELDI."],
  administrative: ["L’argent, les personnes, le droit et l’informatique.", "Une facture ou un paiement : Daniel LARUE. Une candidature ou une question RH : Gérald MARCHAND. Un contrat ou un litige : Caroline DUMAS. Le CRM, un ordinateur ou la messagerie : Thomas BERTRAND."],
};
