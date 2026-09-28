import { getCache } from "@vercel/functions";

export type SessionPlayer = {
  id: string;
  name: string;
  avatar: string;
  joinedAt: number;
  score: number;
  finished: boolean;
  shielded: boolean;
  notice?: string;
  noticeAt?: number;
};

export type SessionStatus = "waiting" | "starting" | "started";

export type QuizReaction = {
  id: string;
  playerId: string;
  playerName: string;
  content: string;
  createdAt: number;
};

export type QuizSession = {
  pin: string;
  createdAt: number;
  status: SessionStatus;
  requiredPlayers: number;
  players: SessionPlayer[];
  reactions: QuizReaction[];
};

export const REQUIRED_PLAYERS = 2;
const SESSION_TTL_SECONDS = 30 * 60;
const cache = getCache({ namespace: "cadga-quiz" });

function key(pin: string) {
  return `session:${pin}`;
}

async function saveSession(session: QuizSession) {
  await cache.set(key(session.pin), session, {
    ttl: SESSION_TTL_SECONDS,
    tags: [`quiz-session-${session.pin}`],
    name: "CADGA live quiz session",
  });
  return session;
}

async function generatePin(): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const pin = String(Math.floor(100000 + Math.random() * 900000));
    if (!(await getSession(pin))) return pin;
  }
  throw new Error("Unable to generate a unique quiz PIN");
}

export async function createSession(): Promise<QuizSession> {
  const session: QuizSession = {
    pin: await generatePin(),
    createdAt: Date.now(),
    status: "waiting",
    requiredPlayers: REQUIRED_PLAYERS,
    players: [],
    reactions: [],
  };
  return saveSession(session);
}

export async function getSession(pin: string): Promise<QuizSession | undefined> {
  return (await cache.get(key(pin))) as QuizSession | undefined;
}

export type JoinResult =
  | { session: QuizSession; player: SessionPlayer }
  | { error: "not_found" | "already_started" | "full" };

export async function joinSession(pin: string, name: string, avatar: string): Promise<JoinResult> {
  const session = await getSession(pin);
  if (!session) return { error: "not_found" };
  if (session.status !== "waiting") return { error: "already_started" };
  if (session.players.length >= session.requiredPlayers) return { error: "full" };

  const player: SessionPlayer = {
    id: Math.random().toString(36).slice(2, 10),
    name: name.trim().slice(0, 16) || "Apprenant",
    avatar: avatar || "spartan:#d08b5b:#e63946",
    joinedAt: Date.now(),
    score: 0,
    finished: false,
    shielded: false,
  };
  session.players.push(player);
  if (session.players.length >= session.requiredPlayers) session.status = "started";
  await saveSession(session);
  return { session, player };
}

export async function markStarted(pin: string): Promise<QuizSession | undefined> {
  const session = await getSession(pin);
  if (!session) return undefined;
  session.status = "started";
  return saveSession(session);
}

export async function updatePlayerResult(pin: string, playerId: string, delta = 0, finished = false): Promise<QuizSession | undefined> {
  const session = await getSession(pin);
  if (!session) return undefined;
  const player = session.players.find((item) => item.id === playerId);
  if (!player) return undefined;
  player.score = Math.max(0, Math.round(player.score + delta));
  player.finished = finished;
  return saveSession(session);
}

export async function applyPlayerPower(pin: string, playerId: string, power: "strike" | "shield"): Promise<QuizSession | undefined> {
  const session = await getSession(pin);
  if (!session) return undefined;
  const player = session.players.find((item) => item.id === playerId);
  const opponent = session.players.find((item) => item.id !== playerId);
  if (!player || !opponent) return undefined;
  const now = Date.now();

  if (power === "shield") {
    player.shielded = true;
    player.notice = "Bouclier activé : le prochain Strike sera bloqué.";
    player.noticeAt = now;
  } else if (opponent.shielded) {
    opponent.shielded = false;
    opponent.notice = `${player.name} a lancé un Strike, mais ton Bouclier l’a bloqué !`;
    opponent.noticeAt = now;
    player.notice = `Le Bouclier de ${opponent.name} a bloqué ton Strike.`;
    player.noticeAt = now;
  } else {
    const damage = Math.round(opponent.score * 0.1);
    opponent.score = Math.max(0, opponent.score - damage);
    opponent.notice = `${player.name} t’a frappé : −${damage} points (10 %).`;
    opponent.noticeAt = now;
    player.notice = `Strike réussi : ${opponent.name} perd ${damage} points.`;
    player.noticeAt = now;
  }
  return saveSession(session);
}


const ALLOWED_REACTIONS = new Set(["👏", "🔥", "🏆", "😂", "💪", "Bravo !", "Bien joué !", "Belle partie !", "Revanche ?"]);

export async function sendReaction(pin: string, playerId: string, content: string): Promise<QuizSession | undefined> {
  const session = await getSession(pin);
  if (!session || !ALLOWED_REACTIONS.has(content)) return undefined;
  const player = session.players.find((item) => item.id === playerId);
  if (!player) return undefined;
  session.reactions ??= [];
  session.reactions.push({
    id: Math.random().toString(36).slice(2, 10),
    playerId,
    playerName: player.name,
    content,
    createdAt: Date.now(),
  });
  session.reactions = session.reactions.slice(-20);
  return saveSession(session);
}

export async function matchPlayer(name: string, avatar: string): Promise<JoinResult> {
  const waitingPin = (await cache.get("waiting-room")) as string | undefined;
  let session = waitingPin ? await getSession(waitingPin) : undefined;

  if (!session || session.status !== "waiting" || session.players.length >= REQUIRED_PLAYERS) {
    session = await createSession();
    await cache.set("waiting-room", session.pin, {
      ttl: SESSION_TTL_SECONDS,
      tags: ["quiz-waiting-room"],
      name: "CADGA waiting room",
    });
  }

  const result = await joinSession(session.pin, name, avatar);
  if ("session" in result && result.session.players.length >= REQUIRED_PLAYERS) {
    await cache.delete("waiting-room");
  }
  return result;
}
