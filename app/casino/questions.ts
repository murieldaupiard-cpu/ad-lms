// Casino Game question bank — built from Business English Vocabulary fiches 1, 2 and 3.
export type Question={prompt:string;options:string[];answer:number;explanation:string;round:string};

export const questions:Question[]=[
 // WARM-UP · fiche 1 (postes, entreprises, demandes)
 {round:"WARM-UP",prompt:'What is the French equivalent of “CEO”?',options:["Directeur financier","PDG","Responsable RH"],answer:1,explanation:"CEO = PDG (président-directeur général)."},
 {round:"WARM-UP",prompt:'“Head office” means…',options:["Service client","Salle de réunion","Siège social"],answer:2,explanation:"The head office is the main office of a company: le siège social."},
 {round:"WARM-UP",prompt:"Which expression describes someone who has already bought from the company?",options:["Prospect","Existing customer","Supplier"],answer:1,explanation:"An existing customer (client existant) has already purchased; a prospect has not."},
 {round:"WARM-UP",prompt:'What is the French equivalent of “supplier”?',options:["Distributeur","Concurrent","Fournisseur"],answer:2,explanation:"A supplier provides products or services to a business: un fournisseur."},
 {round:"WARM-UP",prompt:'What is the French equivalent of “quotation”?',options:["Devis","Commande","Facture"],answer:0,explanation:"A quotation (or quote) is a formal price estimate: un devis."},
 {round:"WARM-UP",prompt:'What is the French equivalent of “deadline”?',options:["Rendez-vous","Remise","Échéance"],answer:2,explanation:"A deadline is the last date to do something: une échéance, une date limite."},

 // BUSINESS BASICS · fiche 1 + 2 (actions, argent, documents)
 {round:"BUSINESS BASICS",prompt:'A customer pays 30% of the price in advance. This payment is a…',options:["Refund","Deposit","Discount"],answer:1,explanation:"A deposit is an advance payment: un acompte."},
 {round:"BUSINESS BASICS",prompt:'What is the French equivalent of “inquiry”?',options:["Réclamation","Livraison","Demande d’information"],answer:2,explanation:"An inquiry is a request for information."},
 {round:"BUSINESS BASICS",prompt:'What is the French equivalent of “price excl. VAT”?',options:["Prix hors taxes (HT)","Prix toutes taxes comprises","Prix de gros"],answer:0,explanation:"Excl. VAT = hors taxes (HT). VAT = TVA."},
 {round:"BUSINESS BASICS",prompt:'Which verb means “reporter” (move to a later date)?',options:["To provide","To arrange","To postpone"],answer:2,explanation:"To postpone = reporter. To arrange = organiser."},
 {round:"BUSINESS BASICS",prompt:'“Please keep me updated.” What does the sender want?',options:["To be kept informed","To update the database","To cancel the order"],answer:0,explanation:"Keep me updated = me tenir informé(e)."},
 {round:"BUSINESS BASICS",prompt:'What is the French equivalent of “follow-up”?',options:["Retour","Suivi / Relance","Rendez-vous"],answer:1,explanation:"A follow-up is an action taken after a first contact: un suivi, une relance."},
 {round:"BUSINESS BASICS",prompt:'“Attachment” in an email means…',options:["Objet","Pièce jointe","Signature"],answer:1,explanation:"An attachment is a file sent with an email: une pièce jointe."},
 {round:"BUSINESS BASICS",prompt:'Which document lists the products AND their prices?',options:["A price list","A boarding pass","A letterhead"],answer:0,explanation:"A price list (tarif) gives the prices of the products."},

 // OFFICE DESK · fiche 3 (accueil, téléphone, courrier, agenda)
 {round:"OFFICE DESK",prompt:'“To greet a visitor” means…',options:["Faire entrer un visiteur","S’enregistrer","Accueillir un visiteur"],answer:2,explanation:"To greet = accueillir. To show in = faire entrer."},
 {round:"OFFICE DESK",prompt:'A visitor arrives and writes their name in the register. In English they…',options:["sign in","hang up","hold"],answer:0,explanation:"To sign in = s’enregistrer (à l’accueil)."},
 {round:"OFFICE DESK",prompt:'“Switchboard” in French?',options:["Poste","Hall d’entrée","Standard"],answer:2,explanation:"The switchboard is the company’s telephone exchange: le standard. An extension is un poste."},
 {round:"OFFICE DESK",prompt:'“I’ll put you through.” What does the speaker do?',options:["Hangs up","Connects the caller to someone","Takes a message"],answer:1,explanation:"To put through = mettre en communication."},
 {round:"OFFICE DESK",prompt:'“I’m afraid he is not available.” What should the receptionist do next?',options:["Put the call through","Hang up","Take a message"],answer:2,explanation:"If the person is not available, you take a message (name, number, reason)."},
 {round:"OFFICE DESK",prompt:'“The line is engaged.” What does it mean?',options:["The line is busy","It is a wrong number","The call is confidential"],answer:0,explanation:"Busy / Engaged = occupé."},
 {round:"OFFICE DESK",prompt:'Beware of the false friend! “The agenda was sent before the meeting.” Agenda =',options:["Compte rendu","Carnet de rendez-vous","Ordre du jour"],answer:2,explanation:"False friend: in a meeting, agenda = ordre du jour (diary / calendar = agenda)."},
 {round:"OFFICE DESK",prompt:'Another false friend: “Actually” means…',options:["Actuellement","En fait","Aujourd’hui"],answer:1,explanation:"Actually = en fait. Actuellement = currently."},
 {round:"OFFICE DESK",prompt:'Which verb means “relire / corriger” a text before sending it?',options:["To archive","To file","To proofread"],answer:2,explanation:"To proofread = relire / corriger. To archive = archiver; to file = classer."},

 // VOICEMAIL ROOM · fiche 1 (messages vocaux, demandes, coordonnées)
 {round:"VOICEMAIL ROOM",prompt:'“Could someone call me back this afternoon?” What should you note?',options:["A complaint","A call-back request","A change of address"],answer:1,explanation:"The caller asks to be called back: a call-back request."},
 {round:"VOICEMAIL ROOM",prompt:'“Our new address is 12 Park Road.” What type of message is it?',options:["A quotation request","An invoice","A change of contact details"],answer:2,explanation:"A new address, phone number or email = changement de coordonnées."},
 {round:"VOICEMAIL ROOM",prompt:'“We are interested in your products. Could you send us your price list?” What is requested?',options:["A replacement","The price list","A meeting"],answer:1,explanation:"The caller asks for your price list (and shows interest in your products)."},
 {round:"VOICEMAIL ROOM",prompt:'“Could we schedule a meeting next week?” What is requested?',options:["A refund","A delivery","An appointment"],answer:2,explanation:"To schedule a meeting = planifier une réunion / un rendez-vous."},
 {round:"VOICEMAIL ROOM",prompt:'“Please keep me updated and confirm your availability.” Which two actions are required?',options:["Cancel and refund","Follow up and confirm","Forward and archive"],answer:1,explanation:"The recipient must keep the caller informed and confirm whether they are available."},
 {round:"VOICEMAIL ROOM",prompt:'A caller spells their email address letter by letter. Which verb describes this?',options:["To spell","To forward","To approve"],answer:0,explanation:"To spell = épeler. Always check names and numbers carefully."},

 // ON THE ROAD · fiche 3 (déplacements et agenda)
 {round:"ON THE ROAD",prompt:'“Business trip” in French?',options:["Billet aller-retour","Déplacement professionnel","Note de frais"],answer:1,explanation:"A business trip = un déplacement professionnel."},
 {round:"ON THE ROAD",prompt:'What do you need to board the plane?',options:["A boarding pass","An expense report","A letterhead"],answer:0,explanation:"A boarding pass = une carte d’embarquement."},
 {round:"ON THE ROAD",prompt:'After the trip, you ask for a refund of your costs. Which document do you fill in?',options:["An itinerary","An expense report","A registered letter"],answer:1,explanation:"An expense report = une note de frais."},
 {round:"ON THE ROAD",prompt:'“I would like to reschedule our meeting.” What does the sender want?',options:["Cancel it forever","Change the date or time","Chair the meeting"],answer:1,explanation:"To reschedule = déplacer / replanifier."},

 // THE DEAL · fiche 3 (vente et négociation)
 {round:"THE DEAL",prompt:'“Turnover / Revenue” in French?',options:["Chiffre d’affaires","Conditions de paiement","Objectif"],answer:0,explanation:"Turnover = chiffre d’affaires."},
 {round:"THE DEAL",prompt:'“Could we discuss the payment terms?” What does the sender want to talk about?',options:["Conditions de paiement","Frais d’envoi","Date de livraison"],answer:0,explanation:"Payment terms = conditions de paiement."},
 {round:"THE DEAL",prompt:'A competitor offers a lower price. What is a competitor?',options:["Un concurrent","Un fournisseur","Un invité"],answer:0,explanation:"A competitor = un concurrent."},
 {round:"THE DEAL",prompt:'“To close a deal” means…',options:["Annuler une commande","Conclure une vente","Relancer un client"],answer:1,explanation:"To close a deal = conclure une vente."},

 // HIGH STAKES · fiche 2 (logistique, réclamations, événements, LinkedIn, connecteurs)
 {round:"HIGH STAKES",prompt:'What is the French equivalent of “complaint”?',options:["Remise","Avoir","Réclamation"],answer:2,explanation:"A complaint = une réclamation. A credit note = un avoir."},
 {round:"HIGH STAKES",prompt:'“Wrong item” in a complaint means…',options:["Article en rupture","Article erroné","Article endommagé"],answer:1,explanation:"Wrong item = article erroné; damaged = endommagé / abîmé."},
 {round:"HIGH STAKES",prompt:'Which sentence offers a solution to a complaint?',options:["“Please find attached the quote.”","“Save the date!”","“We will send a replacement.”"],answer:2,explanation:"“We will send a replacement” = Nous vous enverrons un produit de remplacement."},
 {round:"HIGH STAKES",prompt:'“Out of stock” in French?',options:["En rupture de stock","Retard de livraison","Expédition"],answer:0,explanation:"Out of stock = en rupture de stock."},
 {round:"HIGH STAKES",prompt:'“Lead time” means…',options:["Piste commerciale","Échéance","Délai"],answer:2,explanation:"Lead time = délai. A lead = une piste commerciale; a deadline = une échéance."},
 {round:"HIGH STAKES",prompt:'On LinkedIn, “Call to action” means…',options:["Légende","Appel à l’action","Abonnés"],answer:1,explanation:"Call to action = appel à l’action (for example “Join us!”)."},
 {round:"HIGH STAKES",prompt:'Which sentence starts a LinkedIn announcement?',options:["“Delighted to announce our launch event!”","“I am writing to complain about…”","“I’m afraid he is not available.”"],answer:0,explanation:"Delighted to announce = Ravi(e) d’annoncer."},
 {round:"HIGH STAKES",prompt:'“Due to a delay, the shipment will arrive next week.” What does “due to” mean?',options:["Selon","Afin de","En raison de"],answer:2,explanation:"Due to = en raison de. According to = selon; in order to = afin de."},
 {round:"HIGH STAKES",prompt:'“Thank you in advance” in French?',options:["Merci pour votre message","Merci d’avance","Merci de nous rappeler"],answer:1,explanation:"Thank you in advance = merci d’avance."},

 // FINAL ALL-IN
 {round:"FINAL ALL-IN",prompt:'Voicemail: “This is Nadia from Atlas Retail in Dubai. We need 250 gift boxes for our autumn launch. Could you email the unit price and the delivery terms today, then confirm whether delivery before 18 September is possible?” Which CRM note is the most accurate?',options:["Nadia — Atlas Retail, Dubai — 250 gift boxes — unit price + delivery terms requested — delivery confirmed for 18 Sept","Nadia — Atlas Retail, Dubai — 250 gift boxes — unit price + delivery terms requested today — asks if delivery before 18 Sept is possible","Nadia — Atlas Retail, Dubai — 250 gift boxes — quotation required by 18 Sept — delivery date unknown"],answer:1,explanation:"The note must keep the contact, company, location, quantity, product, request deadline and the fact that delivery is being checked, not already confirmed."},
];
