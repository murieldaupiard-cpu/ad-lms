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
    ["E01", "Allemagne", "BÖHME GmbH", "Berlin", "Kurfürstendamm 210, 10719 Berlin, Allemagne", "Anna Müller", "Import Manager", "a.mueller@boehme.de", "+49 30 2345 6780"],
    ["E02", "Espagne", "Empresa Aguileras", "Madrid", "Calle de Serrano 118, 28006 Madrid, Espagne", "Carlos Torres", "Commercial Director", "c.torres@aguileras.es", "+34 91 523 2210"],
    ["E03", "Irlande", "Beeline Healthcare", "Dublin", "Riverside Business Park, Block B, Unit 4, Dublin D12 X6F9, Irlande", "Sarah O’Connor", "Sales Manager", "s.oconnor@beeline.ie", "+353 1 672 4450"],
    ["E04", "Italie", "Firma Venere", "Milan", "Via Alessandro Manzoni 32, 20121 Milano, Italie", "Luca Bianchi", "Country Manager", "l.bianchi@firmavenere.it", "+39 02 8945 7766"],
    ["E05", "Royaume-Uni", "Advanced Care Products Ltd", "Londres", "Unit 12, Greenford Business Centre, 250 Old Oak Common Lane, London NW10 6DX, Royaume-Uni", "Emily Carter", "Head of Procurement", "e.carter@advancedcare.co.uk", "+44 20 7612 3444"],
    ["E06", "Suède", "Dermarome Stockholm AB", "Stockholm", "Sveavägen 145, 113 46 Stockholm, Suède", "Erik Lindström", "Managing Director", "e.lindstrom@dermarome.se", "+46 8 612 0200"],
    ["E07", "Ukraine", "Scientific Beauty Academy", "Kiev", "Velyka Vasylkivska St. 102, 01004 Kyiv, Ukraine", "Olena Kovalenko", "Partnership Manager", "o.kovalenko@sba.ua", "+380 44 337 1788"],
  ]},
  {id: "ameriques", name: "Amériques", partners: [
    ["A01", "Brésil", "Laboratorio Koni", "São Paulo", "Av. Paulista 1578, Bela Vista, São Paulo – SP 01310-200, Brésil", "Ana Silva", "Diretora Comercial", "a.silva@koni.com.br", "+55 11 3056 0900"],
    ["A02", "Canada", "Lush Cosmetics Ltd", "Toronto", "150 King Street West, Suite 1400, Toronto, ON M5H 1J9, Canada", "Michael Brown", "Purchasing Manager", "m.brown@lushcosmetics.ca", "+1 416 555 0199"],
    ["A03", "États-Unis", "Harvey Inc.", "New York", "445 Madison Avenue, Suite 1200, New York, NY 10022, États-Unis", "Jessica White", "Import Manager", "j.white@harveyinc.com", "+1 212 550 1122"],
  ]},
  {id: "asie", name: "Asie", partners: [
    ["AS01", "Chine", "Green Beauty Co.", "Shanghai", "Suite 2201, Jing An Tower, 1268 Nanjing West Road, Shanghai 200040, Chine", "Li Wei", "Sales Director", "l.wei@greenbeauty.cn", "+86 21 6343 5566"],
    ["AS02", "Japon", "Sakura Cosme", "Tokyo", "4-18-6 Ginza, Chuo-ku, Tokyo 104-0061, Japon", "Yuki Tanaka", "Import Manager", "y.tanaka@sakuracosme.jp", "+81 3 4580 1122"],
    ["AS03", "Singapour", "PureGlow Asia", "Singapour", "8 Marina View, #15-03 Asia Square Tower 1, Singapour 018960, Singapour", "Priya Nair", "Regional Manager", "p.nair@pureglowasia.sg", "+65 6221 7788"],
  ]},
  {id: "oceanie", name: "Océanie", partners: [
    ["OC01", "Australie", "Natural Care Australia", "Sydney", "Level 10, 88 Market Street, Sydney NSW 2000, Australie", "Sarah Williams", "Managing Director", "s.williams@naturalcare.com.au", "+61 2 8014 6677"],
  ]},
  {id: "autres", name: "Autres régions", partners: [
    ["R01", "Afrique du Sud", "Botanic Africa", "Le Cap", "The Terraces, 3 Bree Street, Cape Town 8001, Afrique du Sud", "Thabo Mokoena", "Commercial Director", "t.mokoena@botanicafrica.co.za", "+27 21 003 4455"],
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
  {cat: "Distributeurs · Europe", doc: "04", q: "Qui est votre interlocuteur chez Firma Venere, en Italie ?", choices: ["Luca Bianchi, Country Manager", "Carlos Torres, Commercial Director", "Erik Lindström, Managing Director"], answer: 0, why: "E04 · Firma Venere · Milan · Luca Bianchi, Country Manager · l.bianchi@firmavenere.it."},
  {cat: "Distributeurs · Europe", doc: "04", q: "Vous devez rappeler Dermarome Stockholm AB. Quel numéro composez-vous ?", choices: ["+46 8 612 0200", "+49 30 2345 6780", "+44 20 7612 3444"], answer: 0, why: "E06 · Dermarome Stockholm AB · +46 8 612 0200. Les deux autres numéros sont ceux de BÖHME GmbH (Berlin) et d’Advanced Care Products Ltd (Londres)."},
  {cat: "Distributeurs · Monde", doc: "04", q: "Quel est le distributeur exclusif de Primevère au Japon ?", choices: ["Green Beauty Co.", "PureGlow Asia", "Sakura Cosme"], answer: 2, why: "AS02 · Sakura Cosme · Tokyo · Yuki Tanaka, Import Manager."},
  {cat: "Distributeurs · Monde", doc: "04", q: "Vous devez écrire à Jessica White. Quelle adresse email utilisez-vous ?", choices: ["j.white@harveyinc.com", "m.brown@lushcosmetics.ca", "a.silva@koni.com.br"], answer: 0, why: "A03 · Harvey Inc. · New York · Jessica White, Import Manager · j.white@harveyinc.com."},
  {cat: "Organigramme", doc: "05", mes: "Un fournisseur d’emballages appelle : il veut fixer l’heure de livraison de ses cartons au magasin des matières premières et emballages.", q: "À qui transmettez-vous l’appel ?", choices: ["Pierre AUNE", "Hervé LEMPEREUR", "Fatima BELDI"], answer: 1, why: "Hervé LEMPEREUR · Responsable du magasin des matières premières et emballages (Direction des achats) · +33 1 47 32 10 13. Pierre AUNE gère le magasin des produits finis."},
  {cat: "Organigramme", doc: "05", mes: "Un commercial vous signale que le CRM n’enregistre plus les nouvelles fiches clients : il faut une mise à jour.", q: "À qui vous adressez-vous ?", choices: ["Thomas BERTRAND", "Didier ROBERT", "Daniel LARUE"], answer: 0, why: "Thomas BERTRAND · Responsable informatique (Direction administrative) · t.bertrand@primevere.fr."},
  {cat: "Organigramme", doc: "05", mes: "Une pharmacie de Lyon, qui ne vend pas encore Primevère, souhaite rencontrer un commercial pour référencer la marque.", q: "Prospect : à qui transmettez-vous sa demande ?", choices: ["Yves BILLET", "Jacques JOUX", "Gérald MARCHAND"], answer: 1, why: "Jacques JOUX · Chef des ventes (Direction commerciale). Yves BILLET dirige les achats : il achète pour Primevère, il ne vend pas."},
  {cat: "Organigramme", doc: "05", mes: "Une chaîne de parfumeries mexicaine voudrait importer toute la gamme Primevère. Le Mexique n’a pas encore de distributeur exclusif.", q: "Prospect à l’international : à qui transmettez-vous l’appel ?", choices: ["Caroline DUMAS", "Xavier BELLO", "Marie DUPONT"], answer: 2, why: "Marie DUPONT · Responsable export et grands comptes (Direction commerciale) · m.dupont@primevere.fr."},
  {cat: "Organigramme", doc: "05", mes: "Anna Müller, de BÖHME GmbH (distributeur exclusif en Allemagne), appelle pour une grosse commande destinée à l’export.", q: "Distributeur exclusif : à qui la transmettez-vous ?", choices: ["Marie DUPONT", "Nicolas HUET", "Daniel LARUE"], answer: 0, why: "Marie DUPONT · Responsable export et grands comptes. Les distributeurs exclusifs sont des partenaires à l’export."},
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
