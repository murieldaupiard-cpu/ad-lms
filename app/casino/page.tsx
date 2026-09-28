"use client";

import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import "./casino.css";
import "./team-wheel.css";
import "./pointer-fix.css";
import "./wheel-correction.css";

type Question={prompt:string;options:string[];answer:number;explanation:string;round:string};

const questions:Question[]=[
 {round:"WARM-UP",prompt:'What is the synonym of “available”?',options:["Impossible","Forbidden","Accessible"],answer:2,explanation:"Available means accessible or ready to be used."},
 {round:"WARM-UP",prompt:'What is the French equivalent of “deadline”?',options:["Horaire","Délai","Programme"],answer:1,explanation:"A deadline is the final time or date by which something must be completed."},
 {round:"WARM-UP",prompt:'What is the synonym of “urgent”?',options:["Immediate","Optional","Routine"],answer:0,explanation:"An urgent request requires immediate attention."},
 {round:"WARM-UP",prompt:'What is the French equivalent of “quotation”?',options:["Devis","Commande","Facture"],answer:0,explanation:"A quotation is a formal estimate: un devis."},
 {round:"BUSINESS BASICS",prompt:'What is the French equivalent of “inquiry”?',options:["Demande d’information","Réclamation","Livraison"],answer:0,explanation:"An inquiry is a request for information."},
 {round:"BUSINESS BASICS",prompt:'What is the synonym of “confirm”?',options:["Cancel","Validate","Archive"],answer:1,explanation:"To confirm means to validate or establish that something is correct."},
 {round:"BUSINESS BASICS",prompt:'What is the French equivalent of “supplier”?',options:["Distributeur","Fournisseur","Partenaire"],answer:1,explanation:"A supplier provides products or services to a business."},
 {round:"BUSINESS BASICS",prompt:'What is the French equivalent of “follow-up”?',options:["Retour","Rendez-vous","Relance / suivi"],answer:2,explanation:"A follow-up is an action taken after an initial contact."},
 {round:"CADGA DESK",prompt:"Which expression describes someone who has already bought from the company?",options:["New prospect","Distributor","Existing customer"],answer:2,explanation:"An existing customer has already purchased from the company."},
 {round:"CADGA DESK",prompt:"A caller expresses dissatisfaction about a product. What is the main issue?",options:["A catalogue request","A complaint","A loyalty programme"],answer:1,explanation:"Dissatisfaction about a product or service is a complaint."},
 {round:"CADGA DESK",prompt:"What does MOQ stand for?",options:["Minimum Order Quantity","Maximum Order Quality","Monthly Order Quotation"],answer:0,explanation:"MOQ means Minimum Order Quantity: the smallest number of units that can be ordered."},
 {round:"CADGA DESK",prompt:"Which information tells us where the order must be sent?",options:["Delivery date","Order number","Delivery address"],answer:2,explanation:"The delivery address is the location where the order should arrive."},
 {round:"VOICEMAIL ROOM",prompt:'“Please send me your current catalogue.” What action is requested?',options:["Send the catalogue","Call the customer","Update the record"],answer:0,explanation:"The caller explicitly asks the company to send its catalogue."},
 {round:"VOICEMAIL ROOM",prompt:'“Order 4587 was expected yesterday.” What is the main issue?',options:["A delayed delivery","A discount","A payment method"],answer:0,explanation:"The order has not arrived on the expected date, so the delivery is delayed."},
 {round:"VOICEMAIL ROOM",prompt:'“Could someone telephone me this afternoon?” What should you note?',options:["A complaint","A call-back request","A change of address"],answer:1,explanation:"The caller requests a call back during the afternoon."},
 {round:"VOICEMAIL ROOM",prompt:'“We are interested in your facial creams and body oils.” What should be recorded?',options:["Delivery terms","Payment failure","Product interest"],answer:2,explanation:"The prospect is asking about two product ranges."},
 {round:"HIGH STAKES",prompt:'A prospect asks for prices, MOQ and delivery terms. What document is most relevant?',options:["A complaint form","A price list and terms","A delivery note"],answer:1,explanation:"Prices, MOQ and delivery conditions belong in commercial information and terms."},
 {round:"HIGH STAKES",prompt:'“Please keep me updated and confirm availability.” Which two actions are required?',options:["Follow up and confirm","Cancel and refund","Forward and archive"],answer:0,explanation:"The recipient must provide updates and confirm whether the product is available."},
 {round:"HIGH STAKES",prompt:"A caller gives a new phone number and email address. What is the priority?",options:["Create a complaint","Send a quotation","Update the customer record"],answer:2,explanation:"New contact details must be updated accurately in the customer record."},
 {round:"FINAL ALL-IN",prompt:'Voicemail: “This is Nadia from Atlas Retail in Dubai. We need 250 gift boxes for our autumn launch. Could you email the unit price and MOQ today, then confirm whether delivery before 18 September is possible?” Which CRM note is the most accurate?',options:["Nadia — Atlas Retail, Dubai — 250 gift boxes — unit price + MOQ requested — delivery confirmed for 18 Sept","Nadia — Atlas Retail, Dubai — 250 gift boxes — unit price + MOQ requested today — asks if delivery before 18 Sept is possible","Nadia — Atlas Retail, Dubai — 250 gift boxes — quotation required by 18 Sept — delivery date unknown"],answer:1,explanation:"The note must preserve the contact, company, location, quantity, product, request deadline and the fact that delivery is being checked—not already confirmed."},
];

const players=[
 {name:"Victoria",role:"THE STRATEGIST",initial:"V",line:"Calculated. Precise."},
 {name:"Malik",role:"THE RISK TAKER",initial:"M",line:"Fortune favours the bold."},
 {name:"Sofia",role:"THE ANALYST",initial:"S",line:"Every detail matters."},
 {name:"James",role:"THE VETERAN",initial:"J",line:"Experience pays."},
];

const stakes=[5,10,20,50];

export default function CasinoPage(){
 const[index,setIndex]=useState(0),[balance,setBalance]=useState(100),[stake,setStake]=useState<number|null>(null),[choice,setChoice]=useState<number|null>(null),[locked,setLocked]=useState(false),[started,setStarted]=useState(false),[teamDraw,setTeamDraw]=useState<"idle"|"spinning"|"revealed">("idle"),[team,setTeam]=useState<"GOLD"|"PURPLE">("GOLD"),[finished,setFinished]=useState(false),[correct,setCorrect]=useState(0),[music,setMusic]=useState(true),[reaction,setReaction]=useState<"win"|"loss"|null>(null),[history,setHistory]=useState<number[]>([]);
 const audio=useRef<{ctx:AudioContext;timer:number;nodes:OscillatorNode[]}|null>(null);
 const q=questions[index],isFinal=index===questions.length-1,available=Math.max(balance,0),selectedStake=isFinal?available:stake===null?0:Math.min(stake,available);

 function tone(frequency:number,duration=.16){if(!music)return;const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;const ctx=audio.current?.ctx||new Ctx(),osc=ctx.createOscillator(),gain=ctx.createGain();osc.type="sine";osc.frequency.value=frequency;gain.gain.setValueAtTime(.045,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);osc.connect(gain).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+duration)}
 function startAmbience(){if(!music||audio.current)return;const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;const ctx=new Ctx(),nodes:OscillatorNode[]=[];const playChord=()=>{[110,164.81,220].forEach((f,i)=>{const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=i===1?"triangle":"sine";osc.frequency.value=f;gain.gain.setValueAtTime(.0001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.012,ctx.currentTime+.35);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+3.4);osc.connect(gain).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+3.5);nodes.push(osc)})};playChord();const timer=window.setInterval(playChord,3800);audio.current={ctx,timer,nodes}}
 function stopAmbience(){if(!audio.current)return;window.clearInterval(audio.current.timer);audio.current.ctx.close();audio.current=null}
 // The audio engine is intentionally owned by the lifetime of this page.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 useEffect(()=>()=>stopAmbience(),[]);
 // eslint-disable-next-line react-hooks/exhaustive-deps
 useEffect(()=>{if(started&&music)startAmbience();else stopAmbience()},[music,started]);

 function enter(){const drawn=Math.random()>.5?"GOLD":"PURPLE";setTeam(drawn);setTeamDraw("spinning");window.setTimeout(()=>setTeamDraw("revealed"),2300);window.setTimeout(()=>{setStarted(true);if(music)startAmbience()},3900)}
 function placeBet(amount:number){if(choice===null||locked||amount<=0)return;const wager=Math.min(amount,available),won=choice===q.answer;setStake(wager);setLocked(true);setReaction(won?"win":"loss");setHistory(h=>[...h,choice]);if(won){setBalance(b=>b+wager);setCorrect(c=>c+1);tone(659,.28)}else{setBalance(b=>Math.max(0,b-wager));tone(146,.32)}}
 function next(){if(index===questions.length-1){setFinished(true);stopAmbience();return}if(balance===0)setBalance(20);setIndex(i=>i+1);setChoice(null);setLocked(false);setReaction(null);setStake(null)}
 function restart(){setIndex(0);setBalance(100);setStake(null);setChoice(null);setLocked(false);setStarted(true);setFinished(false);setCorrect(0);setReaction(null);setHistory([]);if(music)startAmbience()}

 if(!started)return <main className="casino-entry"><div className="entry-vignette"/><Link href="/modules" className="casino-back">← DAY 01</Link>{teamDraw==="idle"?<section><span className="casino-kicker">DAY 01 · FINAL CHALLENGE</span><h1>CADGA<br/><b>CASINO</b></h1><p>Twenty questions. One hundred euros. Trust your vocabulary, place your bets and finish with one final All-in.</p><div className="entry-rules"><span>20 QUESTIONS</span><span>€100 START</span><span>FINAL ALL-IN</span></div><button onClick={enter}>SPIN &amp; ENTER <b>→</b></button><small>Training currency only · No real-money gambling</small></section>:<section className={`casino-team-draw ${teamDraw} draw-${team.toLowerCase()}`} aria-live="polite"><span className="casino-kicker">{teamDraw==="spinning"?"THE CROUPIER SPINS…":"YOUR TABLE IS READY"}</span><div className="casino-wheel"><div><b>GOLD</b><b>PURPLE</b><b>GOLD</b><b>PURPLE</b></div></div><h2>{teamDraw==="revealed"?`TEAM ${team}`:"PLACE YOUR LUCK…"}</h2><p>{teamDraw==="revealed"?"Take your seat. Your first hand is about to begin.":"The wheel will assign your team at random."}</p></section>}</main>;

 if(finished){const title=correct>=18?"VOCABULARY CHAMPION":correct>=15?"CADGA HIGH ROLLER":correct>=11?"SMART BETTOR":"CASINO ROOKIE";return <main className="casino-results"><Link href="/modules" className="casino-back">← MODULES</Link><section><div className="result-crown">♛</div><span>GAME COMPLETE</span><h1>{title}</h1><div className="result-money">€{balance}</div><p>You identified <b>{correct} / 20</b> professional vocabulary answers correctly.</p><div className="result-grid"><div><strong>€100</strong><small>STARTING CAPITAL</small></div><div><strong>{Math.max(...[100,balance])}€</strong><small>FINAL CAPITAL</small></div><div><strong>{history.length}</strong><small>BETS PLACED</small></div></div><div className="result-actions"><button onClick={restart}>PLAY TRAINING MODE AGAIN</button><Link href="/modules">RETURN TO DAY 01</Link></div></section></main>}

 return <main className={`casino-game ${reaction||""}`}>
  <header><Link href="/modules">← EXIT</Link><div><b>CADGA CASINO</b><span>TEAM {team} · {q.round}</span></div><button onClick={()=>setMusic(v=>!v)} aria-label={music?"Mute music":"Play music"}>{music?"♪ MUSIC ON":"♩ MUSIC OFF"}</button></header>
  <section className="casino-room">
   <div className="dealer"><div className="dealer-face"><span>♠</span></div><b>THE CROUPIER</b><small>{locked?reaction==="win"?"Excellent call.":"The house takes the bet.":isFinal?"Final hand. All bets are in.":"Place your bet."}</small></div>
   <div className="opponents">{players.map((p,i)=><article className={`opponent o${i+1} ${locked?reaction||"":""}`} key={p.name}><div className="avatar">{p.initial}</div><b>{p.name}</b><small>{locked?(reaction==="win"?(i%2?"Well played!":"Good call."):(i%2?"That was close.":"The house wins.")):p.role}</small><i>{locked?reaction==="win"?(i%2?"👏":"😮"):(i%2?"😏":"🤔"):""}</i></article>)}</div>
   <section className="poker-table">
    <div className="table-mark">CADGA <span>♠</span> CASINO</div>
    <div className="hand-info"><span>HAND {index+1} / 20</span><div><i style={{width:`${(index+1)/20*100}%`}}/></div><b>{q.round}</b></div>
    <article className="question-card"><span>{isFinal?`FINAL ALL-IN · QUESTION ${index+1} OF ${questions.length}`:`QUESTION ${index+1} OF ${questions.length}`}</span><h2>{q.prompt}</h2><div className="answer-cards">{q.options.map((option,i)=><button disabled={locked} className={`${choice===i?"selected":""} ${locked&&i===q.answer?"correct":""} ${locked&&choice===i&&i!==q.answer?"wrong":""}`} onClick={()=>setChoice(i)} key={option}><b>{String.fromCharCode(65+i)}</b><span>{option}</span></button>)}</div>{locked&&<div className={`answer-reveal ${reaction}`}><strong>{reaction==="win"?`YOU WIN €${selectedStake}`:`YOU LOSE €${selectedStake}`}</strong><p>{q.explanation}</p></div>}</article>
    {stake!==null&&<div className={`chip-pot ${locked?reaction||"":""}`}><span>€{selectedStake}</span></div>}
   </section>
  </section>
  <footer className={`betting-dock ${choice!==null&&!locked?"needs-bet":""} ${!locked?"betting-open":""}`}><div className="wallet"><small>YOUR CAPITAL</small><strong>€{balance}</strong></div><div className="bets"><small>{isFinal?"STEP 2 — CLICK TO GO ALL-IN":"STEP 2 — CLICK A CHIP TO BET"}</small><em>{choice===null?"First choose one of the three answers A, B or C.":isFinal?`Click ALL-IN to stake your full €${available}.`:"Your click confirms the bet immediately."}</em><div>{isFinal?<button className="all-in active" disabled={locked||choice===null||available===0} onClick={()=>placeBet(available)}>ALL-IN €{available}</button>:<>{stakes.map(v=><button disabled={locked||choice===null||v>available} onClick={()=>placeBet(v)} key={v}>€{v}</button>)}<button disabled={locked||choice===null||available===0} className="all-in" onClick={()=>placeBet(available)}>ALL-IN €{available}</button></>}</div></div>{locked&&<button className="deal next" onClick={next}>{isFinal?"SEE RESULTS":"NEXT HAND"} <b>→</b></button>}</footer>
 </main>
}

declare global{interface Window{webkitAudioContext:typeof AudioContext}}
