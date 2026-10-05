import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { UserError } from "./errors";
import { generate, type GeminiPart } from "./gemini";

export const PROFILE_BUCKET = "profile-docs";
export const MAX_PDF_BYTES = 5 * 1024 * 1024;
export const MAX_NOTE_CHARS = 5000;

export type SourceKind = "cv" | "linkedin" | "extra";

export type ProfileSource = {
  id: string;
  kind: SourceKind;
  filename: string | null;
  storage_path: string | null;
  extracted_text: string;
  created_at: string;
};

export type ProfileContext = {
  content: string;
  sources_hash: string | null;
  status: "stale" | "generating" | "ready" | "failed";
  model: string | null;
  generated_at: string | null;
};

export const KIND_LABEL: Record<SourceKind, string> = {
  cv: "CV",
  linkedin: "LinkedIn",
  extra: "Notas extra",
};

// Cada fuente nueva es una fila nueva (nunca se edita), así que basta el conjunto de ids.
export function sourcesHash(sources: Pick<ProfileSource, "id">[]) {
  const ids = sources.map((s) => s.id).sort();
  return createHash("sha256").update(ids.join("|")).digest("hex");
}

export function isContextStale(context: ProfileContext | null, sources: Pick<ProfileSource, "id">[]) {
  return (
    !context ||
    context.status !== "ready" ||
    !context.content ||
    context.sources_hash !== sourcesHash(sources)
  );
}

const CONTEXT_SYSTEM = `Eres un asistente que redacta el PERFIL PROFESIONAL consolidado de una persona a partir de sus documentos (CV, LinkedIn) y notas. Ese perfil se usará después para comparar ofertas de empleo, así que debe ser fiel y completo.

Reglas:
- Usa SOLO la información de los documentos y las notas. No inventes ni embellezcas nada: ni empresas, ni fechas, ni tecnologías, ni cifras.
- Conserva exactos los nombres propios, las fechas y las cifras.
- Si dos fuentes se contradicen, indícalo.
- Si algún documento es ilegible o está vacío, dilo al principio con "Aviso: …".
- No incluyas datos de contacto (email, teléfono, dirección).
- Escribe en español, en markdown, con estas secciones (omite las que no tengan datos): ## Resumen, ## Experiencia (por puesto: empresa, rol, fechas, responsabilidades, logros y tecnologías), ## Skills (agrupadas; añade años aproximados solo si se deducen de las fechas), ## Formación, ## Idiomas (con nivel), ## Preferencias y objetivos, ## Otros datos.`;

async function sourceParts(supabase: SupabaseClient, source: ProfileSource): Promise<GeminiPart[]> {
  if (source.kind === "extra") {
    return [{ text: `NOTAS EXTRA DEL USUARIO:\n${source.extracted_text}` }];
  }

  const { data, error } = await supabase.storage.from(PROFILE_BUCKET).download(source.storage_path ?? "");
  if (error || !data) {
    console.error("Storage download", error?.message);
    throw new UserError(`No se pudo leer el PDF de ${KIND_LABEL[source.kind]}. Vuelve a subirlo.`);
  }

  return [
    { text: `A continuación, el PDF de ${KIND_LABEL[source.kind]}:` },
    { inline_data: { mime_type: "application/pdf", data: Buffer.from(await data.arrayBuffer()).toString("base64") } },
  ];
}

async function generateContext(supabase: SupabaseClient, userId: string, sources: ProfileSource[]) {
  const parts = (await Promise.all(sources.map((s) => sourceParts(supabase, s)))).flat();
  const content = (await generate({ system: CONTEXT_SYSTEM, parts })).trim();

  if (content.length < 200) {
    throw new UserError("No se pudo generar un perfil útil con los documentos aportados.");
  }

  const hash = sourcesHash(sources);
  const { error } = await supabase.from("profile_context").upsert({
    user_id: userId,
    content,
    sources_hash: hash,
    status: "ready",
    model: process.env.GEMINI_MODEL ?? null,
    generated_at: new Date().toISOString(),
  });
  if (error) {
    console.error("profile_context upsert", error.message);
    throw new UserError("No se pudo guardar el perfil. Inténtalo de nuevo.");
  }

  return { content, hash };
}

async function loadSources(supabase: SupabaseClient) {
  const { data, error } = await supabase.from("profile_sources").select("*").order("created_at");
  if (error) throw new UserError("No se pudieron cargar las fuentes del perfil.");
  return data as ProfileSource[];
}

// Regenera siempre el contexto a partir de las fuentes actuales.
export async function regenerateContext(supabase: SupabaseClient, userId: string) {
  const sources = await loadSources(supabase);
  if (sources.length === 0) {
    throw new UserError("Añade al menos tu CV en Perfil antes de generar el contexto.");
  }
  return generateContext(supabase, userId, sources);
}

// Devuelve el contexto guardado si sigue vigente y, si no, lo regenera.
export async function getFreshContext(supabase: SupabaseClient, userId: string) {
  const sources = await loadSources(supabase);
  if (sources.length === 0) {
    throw new UserError("Antes de analizar ofertas, añade tu CV en Perfil.");
  }

  const { data } = await supabase.from("profile_context").select("*").maybeSingle();
  const context = data as ProfileContext | null;
  if (!isContextStale(context, sources)) {
    return { content: context!.content, hash: context!.sources_hash! };
  }

  return generateContext(supabase, userId, sources);
}
