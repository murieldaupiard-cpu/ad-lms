"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "./company.css";

type Tab = "identity"|"history"|"team"|"network"|"mission";
const tabs:[Tab,string,string][]=[["identity","01","L’entreprise"],["history","02","Histoire & produits"],["team","03","Équipe"],["network","04","Réseau international"],["mission","05","Mission"]];
const docs=[["Infographie entreprise","/documents/primevere-infographie.pdf"],["Organigramme","/documents/primevere-organigramme.pdf"],["Catalogue produits","/documents/primevere-catalogue.pdf"],["Distributeurs exclusifs","/documents/primevere-distributeurs.pdf"]];
const facts=[["1958","Année de création"],["150","Collaborateurs environ"],["25","Produits"],["5","Gammes"],["3 000","Points de vente"],["32 M€","Chiffre d’affaires"],["13 %","Réalisé à l’export"]];
const timeline=[["1958","Création par Marta et Jean Primevère, chimistes"],["1965","Première collection visage et corps"],["1978","La société devient anonyme"],["1988","Pierre Boss devient PDG"],["1992","Développement du maquillage et des solaires"],["1996","Expansion nationale et européenne"]];
const ranges=[
 ["Soins visage & corps","Lait hydratant intense 24 h · Crème de jour à l’aubépine · Sérum végétal coup d’éclat · Peeling végétal exfoliant","/documents/ranges/visage-corps.jpg"],
 ["Hygiène / Beauté express","Gel douche hydratant au monoï · Crème réparatrice pour les mains · Lait démaquillant apaisant · Lotion tonique clarifiante","/documents/ranges/hygiene.jpg"],
 ["Parfums & senteurs","Eau de parfum au jasmin · Senteurs marines · Senteurs des Prés · Serviettes rafraîchissantes","/documents/ranges/parfums.jpg"],
 ["Maquillage","Produits pour le teint · le regard · les lèvres · les ongles","/documents/ranges/maquillage.jpg"],
 ["Produits solaires","Crème solaire visage antirides · Écran total visage · Crème autobronzante visage · Lait apaisant après-soleil","/documents/ranges/solaire.jpg"],
];
const departments=[
 ["purchases","Direction des achats","Achats, fournisseurs et stocks","Yves Billet · Directeur des achats|Xavier Bello · Acheteur|René Sochan · Acheteur|Hervé Lempereur · Responsable du magasin des matières premières et emballages"],
 ["production","Direction de production","Fabrication, laboratoire et qualité","Pierre Viron · Directeur de production|François Rossi · Responsable du laboratoire|Claude Jourdain · Responsable assurance qualité de la fabrication|Pierre Aune · Responsable du magasin des produits finis"],
 ["sales","Direction commerciale","Ventes et administration des ventes","Daniel Berger · Directeur commercial|Joël Salu · Responsable de l’administration des ventes|Jacques Joux · Chef des ventes|Lucien Lanoan · Chef des ventes"],
 ["services","Services généraux","Locaux, sécurité et livraisons","René Dupré · Directeur des services généraux|Entretien des machines et du matériel|Hygiène et sécurité|Transports et livraisons"],
 ["admin","Direction administrative","Finance, RH et juridique","Christian Catala · Directeur administratif|Daniel Larue · Responsable comptabilité et finances|Gérald Marchand · Directeur des ressources humaines|Service juridique"],
];
const regions=[["Europe · 7","Allemagne, Espagne, Irlande, Italie, Royaume-Uni, Suède, Ukraine"],["Amériques · 3","Brésil, Canada, États-Unis"],["Afrique, Moyen-Orient & Asie · 5","Chine, Corée du Sud, Égypte, Émirats arabes unis, Maroc"]];
const quiz=[
 ["Où se trouve le siège de Primevère ?",["Nancy","Paris","Lyon"],0,"Le réseau est piloté depuis Nancy."],
 ["Qui dirige l’entreprise ?",["Daniel Berger","Pierre Boss","Joël Salu"],1,"Pierre Boss est PDG depuis 1988."],
 ["Qui est Responsable de l’administration des ventes ?",["Joël Salu","Yves Billet","Gérald Marchand"],0,"Joël Salu appartient à la Direction commerciale."],
 ["Combien de partenaires internationaux représentent la marque ?",["12","15","25"],1,"Primevère possède 15 distributeurs exclusifs."],
 ["Quel pays n’appartient pas au réseau européen ?",["Suède","Canada","Ukraine"],1,"Le Canada appartient à la zone Amériques."],
 ["Quel univers comprend l’eau de parfum au jasmin ?",["Solaire","Parfums & senteurs","Beauté express"],1,"Elle figure dans Parfums & senteurs."],
 ["Quelle part du chiffre d’affaires est réalisée à l’export ?",["13 %","32 %","58 %"],0,"13 % du chiffre d’affaires est réalisé à l’export."],
 ["Quel service gère les transports et livraisons ?",["Services généraux","Achats","Administration"],0,"Ils dépendent des Services généraux."]
] as [string,string[],number,string][];

export default function CompanyModule(){
 const [active,setActive]=useState<Tab>("identity"),[open,setOpen]=useState(false),[range,setRange]=useState(0),[qi,setQi]=useState(0),[pick,setPick]=useState<number|null>(null),[score,setScore]=useState(0),[done,setDone]=useState(false); const q=quiz[qi];
 const choose=(i:number)=>{if(pick!==null)return;setPick(i);if(i===q[2])setScore(s=>s+1)};
 const next=()=>{if(qi===quiz.length-1){setDone(true);return}setQi(i=>i+1);setPick(null)};
 const reset=()=>{setQi(0);setPick(null);setScore(0);setDone(false)};
 return <main className="company-module">
  <header className="company-topbar"><div className="company-brand"><Image src="/documents/primevere-logo.png" alt="Primevère" width={128} height={116} priority/><div><small>CADGA · DAY 02 · MODULE 02</small><strong>DOSSIER ENTREPRISE</strong></div></div><div className="top-actions"><div className="download-wrap"><button className="download-trigger" onClick={()=>setOpen(v=>!v)}>↓ TÉLÉCHARGER LES DOCUMENTS <b>4</b></button>{open&&<div className="download-menu">{docs.map(([title,file],i)=><a href={file} download key={file}><span>0{i+1}</span><b>{title}</b><em>↓ PDF</em></a>)}</div>}</div><Link href="/day2">EXIT</Link></div></header>
  <section className="company-shell"><div className="company-intro"><div><span>AVANT LE VOCABULAIRE</span><h1>Découvrir Primevère</h1><p>Explore l’entreprise fictive pour comprendre son activité, orienter les demandes et transmettre chaque message au bon interlocuteur.</p></div><div className="intro-badge"><b>15</b><span>PARTENAIRES<br/>INTERNATIONAUX</span></div></div>
   <nav className="company-tabs">{tabs.map(([id,n,label])=><button key={id} className={active===id?"active":""} onClick={()=>setActive(id)}><b>{n}</b><span>{label}</span></button>)}</nav>
   <div className="company-panel">
    {active==="identity"&&<section><Heading n="01" title="Primevère en un regard">Entreprise française de cosmétiques naturels créée à Nancy, spécialisée dans des produits personnalisés et adaptés aux besoins de ses clients.</Heading><div className="fact-grid">{facts.map(([v,l])=><article key={l}><strong>{v}</strong><span>{l}</span></article>)}</div><div className="pill-row"><b>Écoute & service</b><b>Qualité & sécurité</b><b>Recherche & innovation</b><b>Performance & environnement</b></div></section>}
    {active==="history"&&<section><Heading n="02" title="Une histoire de passion et d’innovation"/><div className="timeline">{timeline.map(([y,t])=><article key={y}><strong>{y}</strong><p>{t}</p></article>)}</div><h3 className="subheading">Découvre les 5 gammes</h3><div className="range-tabs">{ranges.map(([name],i)=><button className={range===i?"active":""} onClick={()=>setRange(i)} key={name}>{name}</button>)}</div><div className="range-reveal with-photo"><img src={ranges[range][2]} alt={ranges[range][0]}/><div><span>GAMME {String(range+1).padStart(2,"0")}</span><h3>{ranges[range][0]}</h3><p>{ranges[range][1]}</p></div></div></section>}
    {active==="team"&&<section><Heading n="03" title="Les services de Primevère"><b>Pierre Boss</b> · Président-directeur général</Heading><div className="sector-static-grid">{departments.map(([id,title,subtitle,people])=><article key={id}><SectorIcon type={id}/><h3>{title}</h3><small>{subtitle}</small><ul>{people.split("|").map(person=><li key={person}>{person}</li>)}</ul></article>)}</div><div className="callout compact"><b>Le bon message, à la bonne personne.</b><span>Identifier le service et l’interlocuteur concernés garantit une transmission fiable et une réponse rapide au client.</span></div></section>}
    {active==="network"&&<section><Heading n="04" title="15 distributeurs exclusifs">Primevère choisit des partenaires pour représenter sa marque et adapte son accompagnement à chaque marché.</Heading><div className="region-grid">{regions.map(([t,p])=><article key={t}><h3>{t}</h3><p>{p}</p></article>)}</div><div className="callout compact"><b>Les bons repères, dès le premier contact.</b><span>Lors d’un appel international, identifie le pays, l’entreprise, la fonction de ton interlocuteur et l’objet de son appel afin de transmettre sa demande au bon service.</span></div></section>}
    {active==="mission"&&<section className="quiz-section">{!done?<><div className="quiz-head"><div><span>05 · MISSION DE REPÉRAGE</span><h2>{q[0]}</h2></div><div><b>{qi+1} / {quiz.length}</b><span>SCORE {score}</span></div></div><div className="choice-grid">{q[1].map((c,i)=><button key={c} onClick={()=>choose(i)} className={pick===null?"":i===q[2]?"correct":i===pick?"wrong":"muted"}>{c}</button>)}</div>{pick!==null&&<div className="feedback"><div><b>{pick===q[2]?"Bien vu !":"À retenir"}</b><p>{q[3]}</p></div><button onClick={next}>{qi===quiz.length-1?"VOIR MON RÉSULTAT":"QUESTION SUIVANTE →"}</button></div>}</>:<div className="result"><span>{score} / {quiz.length}</span><h2>{score>=6?"Tu connais Primevère.":"Reprends les onglets avant de réessayer."}</h2><div><button onClick={reset}>RECOMMENCER</button><Link href="/day2/vocabulary">CADGA VOCABULARY →</Link></div></div>}</section>}
   </div>
  </section>
 </main>
}
function Heading({n,title,children}:{n:string,title:string,children?:React.ReactNode}){return <div className="panel-heading"><span>{n} · DOSSIER PRIMÈVÈRE</span><h2>{title}</h2>{children&&<p>{children}</p>}</div>}
function SectorIcon({type}:{type:string}){const paths:Record<string,string>={purchases:"M4 7h16M6 7l2 12h8l2-12M9 7a3 3 0 0 1 6 0",production:"M4 20V9l5 3V9l5 3V5h4v15M8 17h2m3 0h2",sales:"M4 19V9m6 10V5m6 14v-7m5 7H2",services:"M14 6l4-4 4 4-4 4m-2-2-7 7m-2-2-4 4 4 4 4-4",admin:"M4 20h16M6 20V9m4 11V9m4 11V9m4 11V9M3 9l9-6 9 6"};return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[type]||paths.admin}/></svg>}
