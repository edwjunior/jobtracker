"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { UserError } from "@/lib/errors";
import { MAX_NOTE_CHARS, MAX_PDF_BYTES, PROFILE_BUCKET, regenerateContext } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";

// `nota` devuelve el texto escrito para reponerlo si falla (React vacía el formulario tras la acción).
export type ProfileFormState = { error?: string; ok?: boolean; nota?: string } | undefined;

function failure(error: unknown, action: string): ProfileFormState {
  if (error instanceof UserError) return { error: error.message };
  console.error(action, error);
  return { error: "Algo ha fallado. Inténtalo de nuevo." };
}

// Sube un PDF (CV o LinkedIn). Si ya había uno del mismo tipo, lo reemplaza.
export async function uploadPdf(
  kind: "cv" | "linkedin",
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await requireUser();

  if (kind !== "cv" && kind !== "linkedin") return { error: "Tipo de documento no válido." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Selecciona un archivo PDF." };
  if (file.size > MAX_PDF_BYTES) return { error: "El PDF supera los 5 MB." };

  // No nos fiamos del tipo ni de la extensión que declara el navegador: comprobamos la cabecera.
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.subarray(0, 5).toString("latin1") !== "%PDF-") {
    return { error: "El archivo no es un PDF válido." };
  }

  const supabase = await createClient();
  // La ruta la genera el servidor; el nombre del cliente solo se guarda para mostrarlo.
  const path = `${user.id}/${crypto.randomUUID()}.pdf`;

  const { error: uploadError } = await supabase.storage
    .from(PROFILE_BUCKET)
    .upload(path, bytes, { contentType: "application/pdf" });
  if (uploadError) return failure(uploadError, "uploadPdf storage");

  const { data: previous } = await supabase.from("profile_sources").select("id, storage_path").eq("kind", kind);

  const { error: insertError } = await supabase
    .from("profile_sources")
    .insert({ kind, filename: file.name.slice(0, 120), storage_path: path });
  if (insertError) {
    await supabase.storage.from(PROFILE_BUCKET).remove([path]);
    return failure(insertError, "uploadPdf insert");
  }

  // Solo se borra el anterior cuando el nuevo ya está guardado.
  if (previous?.length) {
    const paths = previous.map((p) => p.storage_path).filter((p): p is string => Boolean(p));
    if (paths.length) await supabase.storage.from(PROFILE_BUCKET).remove(paths);
    await supabase.from("profile_sources").delete().in("id", previous.map((p) => p.id));
  }

  revalidatePath("/perfil");
  return { ok: true };
}

export async function addNote(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  await requireUser();

  const text = String(formData.get("nota") ?? "").trim();
  if (!text) return { error: "Escribe la nota." };
  if (text.length > MAX_NOTE_CHARS) {
    return { error: `La nota supera los ${MAX_NOTE_CHARS} caracteres.`, nota: text };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("profile_sources").insert({ kind: "extra", extracted_text: text });
  if (error) return { ...failure(error, "addNote"), nota: text };

  revalidatePath("/perfil");
  return { ok: true };
}

export async function deleteSource(id: string) {
  await requireUser();

  const supabase = await createClient();
  const { data: source } = await supabase.from("profile_sources").select("storage_path").eq("id", id).maybeSingle();
  if (!source) return;

  if (source.storage_path) await supabase.storage.from(PROFILE_BUCKET).remove([source.storage_path]);
  await supabase.from("profile_sources").delete().eq("id", id);

  revalidatePath("/perfil");
}

export async function generateProfileContext(): Promise<ProfileFormState> {
  const user = await requireUser();

  try {
    await regenerateContext(await createClient(), user.id);
  } catch (error) {
    return failure(error, "generateProfileContext");
  }

  revalidatePath("/perfil");
  return { ok: true };
}
