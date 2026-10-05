"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { analyzeOffer, MAX_OFFER_CHARS, MIN_OFFER_CHARS } from "@/lib/analysis";
import { requireUser } from "@/lib/auth";
import { UserError } from "@/lib/errors";
import { getFreshContext } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { isEstado, MOTIVOS, type Estado, type Fuente } from "@/lib/jobs";

export type JobFormState = { error?: string } | undefined;
// Devuelve lo escrito para reponerlo si falla (React vacía el formulario tras la acción).
export type AnalyzeFormState = { error?: string; descripcion?: string; url?: string } | undefined;
export type MoveResult = { error?: string };

const HTTP_URL = /^https?:\/\/\S+$/i;

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function lines(formData: FormData, key: string) {
  return text(formData, key)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

// Una fuente por línea: "Título | https://…" o solo la URL.
function parseFuentes(raw: string[]): Fuente[] | null {
  const fuentes: Fuente[] = [];
  for (const line of raw) {
    const sep = line.lastIndexOf("|");
    const title = sep >= 0 ? line.slice(0, sep).trim() : "";
    const url = (sep >= 0 ? line.slice(sep + 1) : line).trim();
    if (!HTTP_URL.test(url)) return null;
    fuentes.push({ title: title || url, url });
  }
  return fuentes;
}

function isValidMotivo(value: string) {
  return MOTIVOS.some((m) => m.value === value);
}

function parseJob(formData: FormData) {
  const empresa = text(formData, "empresa");
  const puesto = text(formData, "puesto");
  const estado = text(formData, "estado");
  const url = text(formData, "url");
  const motivo = text(formData, "motivo");
  const fuentes = parseFuentes(lines(formData, "fuentes"));

  if (!empresa || !puesto) return { error: "Indica la empresa y el puesto." };
  if (!isEstado(estado)) return { error: "La fase no es válida." };
  if (url && !HTTP_URL.test(url)) return { error: "El enlace a la oferta debe empezar por http:// o https://." };
  if (!fuentes) return { error: "Cada fuente debe ser una URL http(s), con título opcional: «Título | https://…»." };
  if (estado === "descartada" && !isValidMotivo(motivo)) {
    return { error: "Indica el motivo del descarte." };
  }

  const score = Math.round(Number(text(formData, "score")));

  return {
    data: {
      empresa,
      puesto,
      ubicacion: text(formData, "ubicacion"),
      modalidad: text(formData, "modalidad"),
      salario: text(formData, "salario"),
      score: Number.isFinite(score) ? Math.min(100, Math.max(0, score)) : 0,
      estado,
      motivo: estado === "descartada" ? motivo : "",
      motivo_detalle: estado === "descartada" ? text(formData, "motivo_detalle") : "",
      url,
      descripcion: text(formData, "descripcion"),
      match: lines(formData, "match"),
      gaps: lines(formData, "gaps"),
      ventajas: lines(formData, "ventajas"),
      desventajas: lines(formData, "desventajas"),
      notas: text(formData, "notas"),
      rating: text(formData, "rating"),
      investigacion: text(formData, "investigacion"),
      fuentes,
    },
  };
}

export async function createJob(_prev: JobFormState, formData: FormData): Promise<JobFormState> {
  await requireUser();

  const parsed = parseJob(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await createClient();
  const { data, error } = await supabase.from("jobs").insert(parsed.data).select("id").single();

  if (error) {
    console.error("createJob", error);
    return { error: "No se pudo guardar la oferta. Inténtalo de nuevo." };
  }

  revalidatePath("/");
  redirect(`/ofertas/${data.id}`);
}

export async function updateJob(id: string, _prev: JobFormState, formData: FormData): Promise<JobFormState> {
  await requireUser();

  const parsed = parseJob(formData);
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("jobs").update(parsed.data).eq("id", id);

  if (error) {
    console.error("updateJob", error);
    return { error: "No se pudo guardar la oferta. Inténtalo de nuevo." };
  }

  revalidatePath("/");
  revalidatePath(`/ofertas/${id}`);
  redirect(`/ofertas/${id}`);
}

export async function deleteJob(id: string) {
  await requireUser();

  const supabase = await createClient();
  const { error } = await supabase.from("jobs").delete().eq("id", id);
  if (error) {
    console.error("deleteJob", error);
    throw new Error("No se pudo eliminar la oferta.");
  }

  revalidatePath("/");
  redirect("/");
}

export async function moveJob(
  id: string,
  estado: Estado,
  motivo = "",
  motivoDetalle = "",
): Promise<MoveResult> {
  await requireUser();

  if (!isEstado(estado)) return { error: "La fase no es válida." };
  if (estado === "descartada" && !isValidMotivo(motivo)) {
    return { error: "Indica el motivo del descarte." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("jobs")
    .update({
      estado,
      motivo: estado === "descartada" ? motivo : "",
      motivo_detalle: estado === "descartada" ? motivoDetalle.trim() : "",
    })
    .eq("id", id);

  if (error) {
    console.error("moveJob", error);
    return { error: "No se pudo mover la oferta." };
  }

  revalidatePath("/");
  revalidatePath(`/ofertas/${id}`);
  return {};
}

// Pegar la descripción → la IA compara con el perfil → se crea la oferta con todo rellenado.
export async function analyzeAndCreate(
  _prev: AnalyzeFormState,
  formData: FormData,
): Promise<AnalyzeFormState> {
  const user = await requireUser();

  const descripcion = text(formData, "descripcion");
  const url = text(formData, "url");
  const keep = { descripcion, url };

  if (descripcion.length < MIN_OFFER_CHARS) {
    return { ...keep, error: `Pega la descripción completa de la oferta (mínimo ${MIN_OFFER_CHARS} caracteres).` };
  }
  if (descripcion.length > MAX_OFFER_CHARS) {
    return { ...keep, error: `La descripción supera los ${MAX_OFFER_CHARS} caracteres.` };
  }
  if (url && !HTTP_URL.test(url)) {
    return { ...keep, error: "El enlace a la oferta debe empezar por http:// o https://." };
  }

  const supabase = await createClient();
  let jobId: string;

  try {
    const profile = await getFreshContext(supabase, user.id);
    const analysis = await analyzeOffer(profile.content, descripcion);

    const { data, error } = await supabase
      .from("jobs")
      .insert({
        ...analysis,
        estado: "guardada",
        url,
        descripcion,
        analysis_status: "done",
        analyzed_with_context_hash: profile.hash,
      })
      .select("id")
      .single();
    if (error) throw error;

    jobId = data.id;
  } catch (error) {
    if (error instanceof UserError) return { ...keep, error: error.message };
    console.error("analyzeAndCreate", error);
    return { ...keep, error: "No se pudo analizar la oferta. Inténtalo de nuevo." };
  }

  revalidatePath("/");
  redirect(`/ofertas/${jobId}`);
}
