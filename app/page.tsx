import Link from "next/link";
import "./home-loop.css";
import "./home-interactions.css";
import "./infinity-signature.css";

export default function Home(){return <main className="cadga-home">
 <header className="home-nav"><Link className="home-brand" href="/"><span>A</span><div><strong>AD</strong><small>ENGLISH LEARNING</small></div></Link><div className="home-nav-right"><span>40H TRAINING PATH</span><div className="learner-avatar">AM</div></div></header>
 <section className="home-hero standalone"><div className="hero-photo"/><div className="hero-shade"/><div className="hero-content"><span className="hero-eyebrow">ASSISTANT DE DIRECTION · PROFESSIONAL ENGLISH</span><h1>Welcome to your<br/><b>learning journey.</b></h1><p>Develop the English reflexes you need to communicate clearly, confidently and professionally with every customer.</p></div><div className="cadga-signal" aria-hidden="true"><i/><i/><i/><div className="signal-wave"><span/><span/><span/><span/><span/></div></div><Link className="page-next" href="/days"><span>DISCOVER YOUR MODULES</span><b>→</b></Link><div className="hero-creator infinity-signature"><span>CREATED BY <b>ALEXANDRE AND MURIEL</b></span></div></section>
 </main>}
