#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Pre-generates the CADGA Vocabulary module's audio as static files.
//
// Why: the module used to ask ElevenLabs for the voice on every click, so the
// bill grew with the number of trainees and the audio died whenever the quota
// ran out. Generating each clip once and serving it from public/ makes the
// cost one-off and the module independent of the quota.
//
// It talks to the site's OWN endpoint rather than to ElevenLabs, so the API
// key stays on the server and this script never sees it.
//
//   node scripts/generate-vocabulary-audio.mjs            # generate what's missing
//   node scripts/generate-vocabulary-audio.mjs --dry-run  # just list the work
//   node scripts/generate-vocabulary-audio.mjs --force    # regenerate everything
//   SITE=http://localhost:3000 node scripts/...           # point at another site
//
// Re-running is cheap: existing files are skipped, so after changing a few
// words only those words cost anything.
// ---------------------------------------------------------------------------

import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "app/day2/vocabulary/page.tsx");
const OUT_DIR = join(ROOT, "public/audio/vocabulary");
const SITE = process.env.SITE || "https://cadga-lms.vercel.app";
const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.argv.includes("--force");

const WORD_SPEED = 0.88;

// Keep in step with clipName() in app/day2/vocabulary/page.tsx — if the two
// ever disagree every lookup misses and the module quietly falls back to the
// paid endpoint, which is exactly what this script exists to avoid.
function clipName(text, speed) {
  return createHash("sha256").update(`${speed}|${text}`).digest("hex").slice(0, 16);
}

function pairsIn(block) {
  return [...block.matchAll(/\["((?:[^"\\]|\\.)*)",\s*"((?:[^"\\]|\\.)*)"\]/g)].map((m) => m[1]);
}

function section(src, from, to) {
  const a = src.indexOf(from);
  const b = src.indexOf(to);
  if (a === -1 || b === -1 || b <= a) {
    throw new Error(`Could not locate the section between "${from}" and "${to}" in page.tsx`);
  }
  return src.slice(a, b);
}

function collectTexts(src) {
  const clips = [];
  const add = (text, speed) => {
    if (text && !clips.some((c) => c.text === text && c.speed === speed)) {
      clips.push({ text, speed });
    }
  };

  // Spoken vocabulary: only the English side is ever sent to the voice.
  const vocab = pairsIn(section(src, "const VOCAB", "const PHRASES"));
  const phrases = pairsIn(section(src, "const PHRASES", "// One targeted tip"));
  const quiz = pairsIn(section(src, "const QUIZ_BANK", "const IDENTIFY_ROUNDS"));

  // Speeds are written as named constants (NARRATION, SPELLING) rather than
  // bare numbers, so resolve those declarations before reading the segments.
  const speeds = new Map();
  for (const m of src.matchAll(/^const ([A-Z_]+) = ([0-9.]+);/gm)) speeds.set(m[1], Number(m[2]));
  const resolveSpeed = (raw) => {
    const value = /^[0-9.]+$/.test(raw) ? Number(raw) : speeds.get(raw);
    if (typeof value !== "number" || Number.isNaN(value)) {
      throw new Error(`Could not resolve the speed "${raw}" in page.tsx — update collectTexts().`);
    }
    return value;
  };

  // The Real-Life Challenge voicemail: several clips at two different speeds.
  const segBlock = section(src, "const CHALLENGE_SEGMENTS", "\nfunction shuffle");
  const segments = [...segBlock.matchAll(/text:\s*([\s\S]*?),\s*\n\s*speed:\s*([A-Za-z0-9_.]+)/g)].map((m) => ({
    text: [...m[1].matchAll(/[`"]([\s\S]*?)[`"]/g)]
      .map((x) => x[1])
      .join("")
      .replaceAll("${SP}", '<break time="0.6s"/>'),
    speed: resolveSpeed(m[2]),
  }));

  // Check each section separately. Checking only the final tally would hide a
  // broken section behind the others, and the quiz words are deliberately the
  // same texts as the vocabulary ones, so they dedupe away to nothing here.
  const counts = { vocab: vocab.length, phrases: phrases.length, quiz: quiz.length, segments: segments.length };
  const minimums = { vocab: 60, phrases: 5, quiz: 15, segments: 4 };
  for (const [name, min] of Object.entries(minimums)) {
    if (counts[name] < min) {
      throw new Error(
        `Parsed only ${counts[name]} entries from ${name} in page.tsx (expected at least ${min}). ` +
          `The file's shape changed — fix collectTexts() before generating, or clips will silently ` +
          `fall back to the paid endpoint.`
      );
    }
  }

  for (const en of [...vocab, ...phrases, ...quiz]) add(en, WORD_SPEED);
  for (const seg of segments) add(seg.text, seg.speed);

  return { clips, counts };
}

async function main() {
  const src = await readFile(SOURCE, "utf8");
  const { clips, counts } = collectTexts(src);

  await mkdir(OUT_DIR, { recursive: true });
  const existing = new Set(await readdir(OUT_DIR).catch(() => []));

  const todo = clips.filter((c) => FORCE || !existing.has(`${clipName(c.text, c.speed)}.mp3`));
  const chars = todo.reduce((n, c) => n + c.text.length, 0);

  console.log(`site        : ${SITE}`);
  console.log(
    `parsed      : ${counts.vocab} words, ${counts.phrases} expressions, ` +
      `${counts.quiz} quiz words, ${counts.segments} voicemail clips`
  );
  console.log(`clips found : ${clips.length} (quiz words reuse the vocabulary recordings)`);
  console.log(`already done: ${clips.length - todo.length}`);
  console.log(`to generate : ${todo.length}  (${chars.toLocaleString()} characters of quota)`);

  if (DRY_RUN) {
    for (const c of todo.slice(0, 5)) {
      console.log(`  ${clipName(c.text, c.speed)}.mp3  speed ${c.speed}  ${JSON.stringify(c.text.slice(0, 60))}`);
    }
    if (todo.length > 5) console.log(`  … and ${todo.length - 5} more`);
    console.log("\nDry run — nothing was generated.");
    return;
  }
  if (!todo.length) {
    console.log("\nNothing to do.");
    return;
  }

  const stopAndExplain = (reason, detail) => {
    console.error(`\n\n${reason}`);
    if (detail) console.error(`Server said: ${detail}`);
    console.error(`\n${done} clip(s) saved so far. Nothing is lost — re-run this script`);
    console.error(`once the voice quota has renewed and it resumes where it stopped.`);
    process.exit(1);
  };

  let done = 0;
  let consecutiveFailures = 0;
  let lastDetail = "";
  const failures = [];

  for (const clip of todo) {
    const name = clipName(clip.text, clip.speed);
    let saved = false;

    for (let attempt = 1; attempt <= 3 && !saved; attempt++) {
      const response = await fetch(`${SITE}/api/symbol-tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clip.text, speed: clip.speed }),
      });
      if (response.ok) {
        await writeFile(join(OUT_DIR, `${name}.mp3`), Buffer.from(await response.arrayBuffer()));
        saved = true;
        break;
      }
      lastDetail = (await response.text().catch(() => "")).slice(0, 160);
      if (/quota/i.test(lastDetail) || response.status === 429) {
        stopAndExplain("The voice quota is exhausted — stopping here.", lastDetail);
      }
      // Generating many clips back to back trips ElevenLabs' rate limit, which
      // clears on its own — so back off rather than giving up on the clip.
      if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 5000));
      else failures.push({ clip, status: response.status, detail: lastDetail });
    }

    if (saved) {
      done++;
      consecutiveFailures = 0;
      process.stdout.write(`\r  generated ${done}/${todo.length}`);
      await new Promise((r) => setTimeout(r, 400)); // stay under the rate limit
    } else {
      consecutiveFailures++;
      // An exhausted quota looks like a generic failure on older deployments,
      // so don't rely on recognising the message: if several clips in a row
      // fail, the voice service is not going to start working on clip 40.
      // Grinding through the whole list would waste many minutes to end up
      // with nothing.
      if (consecutiveFailures >= 3) {
        stopAndExplain(
          "Three clips in a row failed, so the voice service is refusing everything.\n" +
            "That is almost always an exhausted quota.",
          lastDetail
        );
      }
    }
  }

  console.log(`\n\nSaved ${done} clip(s) to public/audio/vocabulary/`);
  if (failures.length) {
    console.log(`${failures.length} clip(s) failed — re-run to retry just those:`);
    for (const f of failures) console.log(`  [${f.status}] ${f.clip.text.slice(0, 50)} ${f.detail}`);
    process.exitCode = 1;
  }

  const bytes = (
    await Promise.all(
      (await readdir(OUT_DIR)).map(async (f) => (await stat(join(OUT_DIR, f))).size)
    )
  ).reduce((a, b) => a + b, 0);
  console.log(`public/audio/vocabulary/ is now ${(bytes / 1024 / 1024).toFixed(1)} MB`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
