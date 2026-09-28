"use client";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import "./company.css";
import {catalogueClaims, commitments, directions, documents, identity, ingredients, leadership, quiz, ranges, regions, type Person} from "./data";

const MODULE_LABEL = "AD · DAY 02 · MODULE 02";
const NEXT = {href: "/day2/vocabulary", label: "VOCABULARY →"};
const STORE = "primevere-docs-downloaded";

const tabs = [
  {id: "identity", label: "Fiche d’identité"},
  {id: "commitments", label: "Engagements & labels"},
  {id: "catalogue", label: "Catalogue produits"},
  {id: "europe", label: "Distributeurs · Europe"},
  {id: "world", label: "Distributeurs · Monde"},
  {id: "org", label: "Organigramme"},
  {id: "docs", label: "Documents"},
  {id: "quiz", label: "Manipuler les documents"},
] as const;
type TabId = typeof tabs[number]["id"];
const n2 = (i: number) => String(i + 1).padStart(2, "0");

type SubItem = readonly [string, string, string?];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Sub({items, value, onChange}: {items: readonly SubItem[]; value: string; onChange: (v: any) => void}) {
  return <div className="pv-sub" role="tablist">{items.map(([id, label, count]) => <button type="button" role="tab" aria-selected={value === id} className={value === id ? "active" : ""} key={id} onClick={() => onChange(id)}>{label}{count && <b>{count}</b>}</button>)}</div>;
}
function Heading({n, title, children}: {n: number; title: string; children?: React.ReactNode}) {
  return <div className="pv-heading"><span>{n2(n)} · DOSSIER PRIMEVÈRE</span><h2>{title}</h2>{children && <p>{children}</p>}</div>;
}
function Source({doc}: {doc: string}) {
  const d = documents.find(x => x.n === doc)!;
  return <p className="pv-source">Source : document {d.n} · {d.title}</p>;
}
function PersonCard({p}: {p: Person}) {
  const initials = p[0].split(" ").map(x => x[0]).join("").slice(0, 2);
  return <article className="pv-person"><i aria-hidden="true">{initials}</i><div><h4>{p[0]}</h4><p>{p[1]}</p><small>☎ {p[2]}</small><small>✉ {p[3]}</small></div></article>;
}

export default function CompanyModule() {
  const [active, setActive] = useState<TabId>("identity");
  const [idSub, setIdSub] = useState<"general" | "history" | "figures" | "activity">("general");
  const [cmSub, setCmSub] = useState<"labels" | "concrete" | "goals" | "field">("labels");
  const [range, setRange] = useState(ranges[0].id);
  const [world, setWorld] = useState("ameriques");
  const [dir, setDir] = useState("direction");
  const [downloaded, setDownloaded] = useState<string[]>([]);
  const [started, setStarted] = useState(false);
  const [qi, setQi] = useState(0), [pick, setPick] = useState<number | null>(null), [answers, setAnswers] = useState<boolean[]>([]), [done, setDone] = useState(false);

  useEffect(() => { try { const v = JSON.parse(localStorage.getItem(STORE) || "[]"); if (Array.isArray(v)) setDownloaded(v); } catch {} }, []);
  const markDownloaded = (file: string) => setDownloaded(list => { const next = [...new Set([...list, file])]; try { localStorage.setItem(STORE, JSON.stringify(next)); } catch {} return next; });
  const allDownloaded = documents.every(d => downloaded.includes(d.file));
  const tabIndex = tabs.findIndex(t => t.id === active);
  const go = (id: TabId) => { setActive(id); if (typeof window !== "undefined") window.scrollTo({top: 0, behavior: "smooth"}); };

  const q = quiz[qi];
  const score = answers.filter(Boolean).length;
  const choose = (i: number) => { if (pick !== null) return; setPick(i); setAnswers(a => [...a, i === q.answer]); };
  const next = () => { if (qi === quiz.length - 1) { setDone(true); return; } setQi(i => i + 1); setPick(null); };
  const reset = () => { setQi(0); setPick(null); setAnswers([]); setDone(false); };
  const byCat = useMemo(() => { const m = new Map<string, [number, number]>(); quiz.forEach((x, i) => { const r = m.get(x.cat) || [0, 0]; m.set(x.cat, [r[0] + (answers[i] ? 1 : 0), r[1] + 1]); }); return [...m]; }, [answers]);

  const currentRange = ranges.find(r => r.id === range)!;
  const worldRegion = regions.find(r => r.id === world)!;

  return <main className="pv">
    <header className="pv-top"><div className="pv-brand"><Image src="/documents/primevere-logo.png" alt="Primevère" width={128} height={116} priority/><div><small>{MODULE_LABEL}</small><strong>DÉCOUVRIR PRIMEVÈRE</strong></div></div><div className="pv-top-actions"><button type="button" className="pv-docs-btn" onClick={() => go("docs")}>↓ DOCUMENTS <b>{downloaded.filter(f => documents.some(d => d.file === f)).length}/{documents.length}</b></button><Link href="/day2">EXIT</Link></div></header>
    <section className="pv-shell">
      <div className="pv-intro"><div><span>AVANT LE VOCABULAIRE</span><h1>Découvrir Primevère</h1><p>Explore l’entreprise onglet par onglet, télécharge ses documents, puis prouve que tu sais t’en servir : retrouver un prix, un contact, un label… et transmettre chaque appel au bon interlocuteur.</p></div><div className="pv-badge"><b>8</b><span>ONGLETS<br/>À EXPLORER</span></div></div>
      <nav className="pv-tabs" aria-label="Onglets du dossier">{tabs.map((t, i) => <button type="button" key={t.id} className={`${active === t.id ? "active" : ""} ${t.id === "docs" ? "is-docs" : ""} ${t.id === "quiz" ? "is-quiz" : ""}`} aria-current={active === t.id} onClick={() => go(t.id)}><b>{n2(i)}</b><span>{t.label}</span>{t.id === "docs" && !allDownloaded && <em>À FAIRE</em>}</button>)}</nav>

      <div className="pv-panel">
        {active === "identity" && <section>
          <div className="pv-hero"><Image src="/documents/ranges/siege.webp" alt="Le siège de Primevère" width={889} height={409}/><div><Heading n={0} title="Primevère en un regard">La beauté naturelle depuis 1958. Des soins botaniques, efficaces et responsables, pour révéler la beauté de chacun.</Heading></div></div>
          <Sub items={[["general", "Informations générales"], ["history", "Notre histoire"], ["figures", "Chiffres clés & mission"], ["activity", "Nos activités"]]} value={idSub} onChange={setIdSub}/>
          {idSub === "general" && <dl className="pv-idcard">{identity.general.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>}
          {idSub === "history" && <ol className="pv-timeline">{identity.history.map(([y, t]) => <li key={y}><strong>{y}</strong><p>{t}</p></li>)}</ol>}
          {idSub === "figures" && <><h3 className="pv-h3">Nos chiffres clés (2024)</h3><div className="pv-facts">{identity.figures.map(([v, l]) => <article key={l}><strong>{v}</strong><span>{l}</span></article>)}</div><blockquote className="pv-quote"><span>NOTRE MISSION</span>« {identity.mission} »</blockquote></>}
          {idSub === "activity" && <div className="pv-cards five steps">{identity.activity.map(([t, d], i) => <article key={t}><small>{n2(i)}</small><h4>{t}</h4><p>{d}</p></article>)}</div>}
          <Source doc="01"/>
        </section>}

        {active === "commitments" && <section>
          <Heading n={1} title="Nos engagements, labels & responsabilité">Des soins naturels, efficaces et responsables, pour révéler la beauté de chacun tout en préservant la planète.</Heading>
          <Sub items={[["labels", "Labels & certifications", "8"], ["concrete", "Engagements concrets", "6"], ["goals", "Objectifs à 2030", "5"], ["field", "Terrain & reconnaissances"]]} value={cmSub} onChange={setCmSub}/>
          {cmSub === "labels" && <div className="pv-cards four">{commitments.labels.map(([t, d]) => <article key={t} className="label"><h4>{t}</h4><p>{d}</p></article>)}</div>}
          {cmSub === "concrete" && <div className="pv-cards three">{commitments.concrete.map(([t, d]) => <article key={t}><h4>{t}</h4><p>{d}</p></article>)}</div>}
          {cmSub === "goals" && <div className="pv-facts goals">{commitments.goals.map(([v, l]) => <article key={l}><strong>{v}</strong><span>{l}</span></article>)}</div>}
          {cmSub === "field" && <><h3 className="pv-h3">Nos partenariats & engagements terrain</h3><div className="pv-cards four">{commitments.field.map(([t, d]) => <article key={t}><h4>{t}</h4><p>{d}</p></article>)}</div><h3 className="pv-h3">Reconnaissances</h3><div className="pv-awards">{commitments.awards.map(([t, y, by]) => <article key={t}><span>🏆 {y}</span><h4>{t}</h4><p>{by}</p></article>)}</div></>}
          <Source doc="02"/>
        </section>}

        {active === "catalogue" && <section>
          <Heading n={2} title="Catalogue produits">La nature en soin, chaque jour. 5 gammes de 6 références, avec leur contenance et leur prix HT.</Heading>
          <div className="pv-claims">{catalogueClaims.map(c => <b key={c}>{c}</b>)}</div>
          <Sub items={ranges.map(r => [r.id, `${r.n} · ${r.name}`] as [string, string])} value={range} onChange={setRange}/>
          <div className={`pv-range r${currentRange.n}`}>
            <div className="pv-range-head"><Image src={currentRange.image} alt={currentRange.name} width={456} height={243}/><div><span>GAMME {currentRange.n}</span><h3>{currentRange.name}</h3><strong>{currentRange.tagline}</strong><p>{currentRange.text}</p><div className="pv-tags">{currentRange.tags.map(t => <i key={t}>{t}</i>)}</div></div></div>
            <div className="pv-table-wrap"><table className="pv-table"><thead><tr><th>Réf.</th><th>Produit</th><th>Contenance</th><th>Prix HT</th></tr></thead><tbody>{currentRange.products.map(p => <tr key={p[0]}><td><b>{p[0]}</b></td><td>{p[1]}</td><td>{p[2]}</td><td>{p[3]}</td></tr>)}</tbody></table></div>
          </div>
          <h3 className="pv-h3">Des ingrédients clés</h3><div className="pv-claims soft">{ingredients.map(([n, e]) => <b key={n}>{n} · <em>{e}</em></b>)}</div>
          <Source doc="03"/>
        </section>}

        {active === "europe" && <section>
          <Heading n={3} title="Europe · 7 distributeurs exclusifs">Des partenaires de confiance pour partager une beauté plus naturelle dans le monde entier : 15 partenaires exclusifs dans 15 pays, sur 5 continents, dont 7 en Europe.</Heading>
          <PartnerGrid partners={regions[0].partners}/>
          <Source doc="04"/>
        </section>}

        {active === "world" && <section>
          <Heading n={4} title="Amériques, Asie, Océanie et Afrique">Les 8 autres distributeurs exclusifs de Primevère, hors d’Europe.</Heading>
          <Sub items={regions.slice(1).map(r => [r.id, r.name, String(r.partners.length)] as [string, string, string])} value={world} onChange={setWorld}/>
          <PartnerGrid partners={worldRegion.partners}/>
          <Source doc="04"/>
        </section>}

        {active === "org" && <section>
          <Heading n={5} title="Organigramme">Des femmes et des hommes engagés au service de nos clients, de nos partenaires et de la nature. Repère qui fait quoi : c’est ce qui te permet de transmettre chaque appel au bon interlocuteur.</Heading>
          <Sub items={[["direction", "Direction générale", "2"], ...directions.map(d => [d.id, d.name, String(d.people.length)] as [string, string, string])]} value={dir} onChange={setDir}/>
          <div className="pv-people">{(dir === "direction" ? leadership : directions.find(d => d.id === dir)!.people).map(p => <PersonCard key={p[0]} p={p}/>)}</div>
          <div className="pv-callout"><b>Le bon message, à la bonne personne.</b><span>Lis la fonction de chaque interlocuteur : c’est elle qui te dit à qui transmettre une demande (achats, stock, qualité, transport, informatique, juridique…).</span></div>
          <Source doc="05"/>
        </section>}

        {active === "docs" && <section>
          <Heading n={6} title="Télécharge les documents">Tu vas en avoir besoin tout de suite : le quiz de l’onglet 08 te demande de retrouver des prix, des références, des contacts et le bon interlocuteur dans ces documents. Garde-les ouverts pendant que tu réponds.</Heading>
          <div className={`pv-must ${allDownloaded ? "ok" : ""}`} role="status"><b>{allDownloaded ? "✓ Les 5 documents sont téléchargés." : `Obligatoire avant le quiz · ${downloaded.filter(f => documents.some(d => d.file === f)).length} / ${documents.length} téléchargés`}</b><span>{allDownloaded ? "Ouvre-les à côté de la LMS, puis lance le quiz." : "Télécharge chaque document ci-dessous : sans eux, tu ne pourras pas répondre au quiz."}</span></div>
          <ul className="pv-downloads">{documents.map(d => <li key={d.file} className={downloaded.includes(d.file) ? "done" : ""}><span>{d.n}</span><div><b>{d.title}</b><small>{d.detail}</small></div><a href={d.file} download onClick={() => markDownloaded(d.file)}>{downloaded.includes(d.file) ? "✓ TÉLÉCHARGÉ" : "↓ TÉLÉCHARGER"}</a></li>)}</ul>
          <div className="pv-next"><button type="button" onClick={() => go("quiz")} className={allDownloaded ? "" : "ghost"}>{allDownloaded ? "J’AI MES DOCUMENTS · LANCER LE QUIZ →" : "PASSER AU QUIZ →"}</button></div>
        </section>}

        {active === "quiz" && <section className="pv-quiz">
          {!started ? <div className="pv-gate">
            <Heading n={7} title="Manipuler les documents">{quiz.length} questions : au moins une par onglet, puis des mises en situation au téléphone où tu dois trouver, dans l’organigramme, la personne à qui transmettre l’appel.</Heading>
            {!allDownloaded && <div className="pv-must"><b>Tu n’as pas encore téléchargé tous les documents.</b><span>Les réponses se trouvent dans les documents, pas dans ta mémoire : télécharge-les et garde-les ouverts pendant le quiz.</span></div>}
            <div className="pv-next">{!allDownloaded && <button type="button" onClick={() => go("docs")}>↓ TÉLÉCHARGER LES DOCUMENTS</button>}<button type="button" className={allDownloaded ? "" : "ghost"} onClick={() => setStarted(true)}>{allDownloaded ? "COMMENCER LE QUIZ →" : "J’AI DÉJÀ LES DOCUMENTS, COMMENCER →"}</button></div>
          </div> : !done ? <>
            <div className="pv-qhead"><div><span>08 · {q.cat.toUpperCase()} · DOCUMENT {q.doc}</span>{q.mes && <div className="pv-mes"><b>☎ MISE EN SITUATION</b><p>{q.mes}</p></div>}<h2>{q.q}</h2></div><div className="pv-count"><b>{qi + 1} / {quiz.length}</b><span>SCORE {score}</span></div></div>
            <div className="pv-progress" aria-hidden="true"><i style={{width: `${((qi + (pick !== null ? 1 : 0)) / quiz.length) * 100}%`}}/></div>
            <div className="pv-choices">{q.choices.map((c, i) => <button type="button" key={c} disabled={pick !== null} onClick={() => choose(i)} className={pick === null ? "" : i === q.answer ? "correct" : i === pick ? "wrong" : "muted"}>{c}</button>)}</div>
            {pick !== null && <div className="pv-feedback" aria-live="polite"><div><b>{pick === q.answer ? "Bien vu !" : "À retenir"}</b><p>{q.why}</p></div><button type="button" onClick={next}>{qi === quiz.length - 1 ? "VOIR MON RÉSULTAT →" : "QUESTION SUIVANTE →"}</button></div>}
          </> : <div className="pv-result"><span>{score} / {quiz.length}</span><h2>{score / quiz.length >= .8 ? "Tu sais te servir des documents Primevère." : "Reprends les documents et réessaie."}</h2><ul>{byCat.map(([cat, [ok, total]]) => <li key={cat} className={ok === total ? "ok" : ""}><b>{cat}</b><span>{ok} / {total}</span></li>)}</ul><div><button type="button" onClick={reset}>↻ RECOMMENCER</button><Link href={NEXT.href}>{NEXT.label}</Link></div></div>}
        </section>}

        <div className="pv-steps">{tabIndex > 0 ? <button type="button" onClick={() => go(tabs[tabIndex - 1].id)}>← {tabs[tabIndex - 1].label}</button> : <span/>}{tabIndex < tabs.length - 1 && <button type="button" className="next" onClick={() => go(tabs[tabIndex + 1].id)}>{tabs[tabIndex + 1].label} →</button>}</div>
      </div>
    </section>
  </main>;
}

function PartnerGrid({partners}: {partners: typeof regions[number]["partners"]}) {
  return <div className="pv-partners">{partners.map(p => <article key={p[0]}><div className="pv-partner-top"><span>{p[0]}</span><b>{p[1]}</b></div><h4>{p[2]}</h4><p className="city">{p[3]}</p><p className="addr">{p[4]}</p><dl><div><dt>Contact</dt><dd>{p[5]}</dd></div><div><dt>Fonction</dt><dd>{p[6]}</dd></div><div><dt>Email</dt><dd>{p[7]}</dd></div><div><dt>Téléphone</dt><dd>{p[8]}</dd></div></dl></article>)}</div>;
}
