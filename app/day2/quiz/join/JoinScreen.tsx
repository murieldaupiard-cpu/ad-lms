"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import "../quiz.css";
import { AvatarBuilder, DEFAULT_AVATAR, GladiatorAvatar } from "../GladiatorAvatar";
import PlayerGame from "../PlayerGame";

// ---------------------------------------------------------------------------
// /day2/quiz/join — what a learner lands on after scanning the host's QR
// code (or typing the PIN manually). Enter a name + avatar, join the live
// session, then wait for the host's lobby to reach 2 learners and start.
// ---------------------------------------------------------------------------

type Phase = "form" | "joining" | "waiting" | "started" | "error";

export default function JoinScreen() {
  return (
    <Suspense fallback={<main className="qz-page" />}>
      <JoinForm />
    </Suspense>
  );
}

function JoinForm() {
  const searchParams = useSearchParams();
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [phase, setPhase] = useState<Phase>("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [playerId, setPlayerId] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fromUrl = searchParams.get("pin");
    if (fromUrl) setPin(fromUrl.replace(/\D/g, "").slice(0, 6));
  }, [searchParams]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  function startPolling(activePin: string) {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/quiz-session/${activePin}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === "starting" || data.status === "started") {
          setPhase("started");
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        // transient network hiccup — the next tick retries
      }
    }, 1500);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanPin = pin.replace(/\D/g, "").slice(0, 6);
    if (cleanPin.length !== 6) {
      setErrorMsg("Le PIN doit contenir 6 chiffres.");
      setPhase("error");
      return;
    }
    if (!name.trim()) {
      setErrorMsg("Entre ton prénom pour rejoindre.");
      setPhase("error");
      return;
    }
    setPhase("joining");
    try {
      const res = await fetch(`/api/quiz-session/${cleanPin}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, avatar }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "not_found") setErrorMsg("PIN invalide — vérifie le code avec ton formateur.");
        else if (data.error === "full") setErrorMsg("La partie est déjà complète.");
        else if (data.error === "already_started") setErrorMsg("La partie a déjà commencé.");
        else setErrorMsg("Impossible de rejoindre la partie.");
        setPhase("error");
        return;
      }
      setPin(cleanPin);
      setPlayerId(data.player.id);
      setPhase(data.session.status === "starting" ? "started" : "waiting");
      startPolling(cleanPin);
    } catch {
      setErrorMsg("Connexion impossible — vérifie ta connexion et réessaie.");
      setPhase("error");
    }
  }

  return (
    <main className="qz-page">
      <div className="qz-stage">
        <div className="qz-topbar">
          <div className="qz-brand">
            <span>A</span>
            <div>L&apos;Arène CADGA</div>
          </div>
        </div>

        <div className="qz-body">
          {(phase === "form" || phase === "joining" || phase === "error") && (
            <form className="qz-view qz-center" onSubmit={handleSubmit}>
              <div className="qz-eyebrow">Rejoindre la partie</div>
              <h2>Entre le PIN et crée ton gladiateur</h2>

              <input
                className="qz-name-input qz-pin-input"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="PIN à 6 chiffres"
                inputMode="numeric"
                maxLength={6}
              />

              <AvatarBuilder value={avatar} onChange={setAvatar} />

              <input
                className="qz-name-input"
                value={name}
                maxLength={16}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ton prénom"
              />

              {phase === "error" && <div className="qz-join-error">{errorMsg}</div>}

              <button className="qz-primary" type="submit" disabled={phase === "joining"}>
                {phase === "joining" ? "Connexion…" : "Rejoindre →"}
              </button>
            </form>
          )}

          {phase === "waiting" && (
            <div className="qz-view qz-center">
              <div className="qz-eyebrow">C&apos;est bon !</div>
              <h2 className="qz-waiting-name">
                <GladiatorAvatar code={avatar} size={40} />
                {name}
              </h2>
              <p className="qz-lede">Tu es connecté(e). L’IA attend le deuxième apprenant…</p>
              <div className="qz-join-spinner" aria-hidden="true" />
            </div>
          )}

          {phase === "started" && playerId && (
            <PlayerGame pin={pin} playerId={playerId} name={name} avatar={avatar} />
          )}
        </div>
      </div>
    </main>
  );
}
