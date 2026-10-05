// Carga única de las ofertas del prototipo HTML (supabase/seed/jobs.json).
// Entra con tu usuario (RLS) y omite las ofertas que ya existen (misma empresa y puesto).
//
//   SEED_EMAIL=tu@email.com SEED_PASSWORD=... pnpm seed
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SEED_EMAIL, SEED_PASSWORD } =
  process.env;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error("Faltan las variables de Supabase en .env.local.");
}
if (!SEED_EMAIL || !SEED_PASSWORD) {
  throw new Error("Define SEED_EMAIL y SEED_PASSWORD (tu usuario de Supabase).");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const { error: authError } = await supabase.auth.signInWithPassword({
  email: SEED_EMAIL,
  password: SEED_PASSWORD,
});
if (authError) throw new Error(`No se pudo iniciar sesión: ${authError.message}`);

const seed = JSON.parse(readFileSync(new URL("../supabase/seed/jobs.json", import.meta.url), "utf8"));

const { data: existing, error: readError } = await supabase.from("jobs").select("empresa, puesto");
if (readError) throw new Error(`No se pudo leer jobs (¿migración aplicada?): ${readError.message}`);

const taken = new Set(existing.map((j) => `${j.empresa}|${j.puesto}`));
const pending = seed.filter((j) => !taken.has(`${j.empresa}|${j.puesto}`));

if (pending.length > 0) {
  const { error: insertError } = await supabase.from("jobs").insert(pending);
  if (insertError) throw new Error(`No se pudieron insertar las ofertas: ${insertError.message}`);
}

console.log(`Insertadas ${pending.length}, omitidas ${seed.length - pending.length} (ya existían).`);
