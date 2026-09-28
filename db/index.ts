import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

/**
 * Database access is only available when a Cloudflare D1 binding is provided
 * at runtime. Keeping this module free of the Cloudflare-only
 * `cloudflare:workers` import allows the Next.js app to compile on Vercel.
 */
export function getDb(binding?: unknown) {
  if (!binding) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable in this runtime. Pass the D1 binding explicitly when using getDb()."
    );
  }

  return drizzle(binding as Parameters<typeof drizzle>[0], { schema });
}
