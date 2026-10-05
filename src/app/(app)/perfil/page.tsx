import { NoteForm, PdfUploadForm, RegenerateButton } from "@/components/profile-forms";
import { TrashIcon } from "@/components/icons";
import { requireUser } from "@/lib/auth";
import { isContextStale, type ProfileContext, type ProfileSource } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import { deleteSource } from "./actions";

// Regenerar el contexto lee los PDFs con Gemini y puede tardar.
export const maxDuration = 60;

const folder =
  "rounded-[2px] border border-rule-strong bg-folder p-5 shadow-[0_1px_0_rgba(20,32,46,0.08),0_3px_8px_-3px_rgba(20,32,46,0.25)] sm:p-8";

const dateFormat = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" });

function DeleteSource({ id, label }: { id: string; label: string }) {
  return (
    <form action={deleteSource.bind(null, id)}>
      <button
        type="submit"
        aria-label={`Eliminar ${label}`}
        className="inline-flex items-center gap-1.5 rounded-[2px] px-2 py-1 text-sm font-semibold transition-colors duration-150 hover:bg-drawer"
      >
        <TrashIcon />
        Eliminar
      </button>
    </form>
  );
}

function PdfBlock({ title, source, kind }: { title: string; source?: ProfileSource; kind: "cv" | "linkedin" }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {source ? (
        <div className="flex items-center justify-between gap-3 text-sm">
          <p>
            <span className="font-medium">{source.filename ?? "PDF"}</span>
            <span className="text-ink-soft"> · subido el {dateFormat.format(new Date(source.created_at))}</span>
          </p>
          <DeleteSource id={source.id} label={title} />
        </div>
      ) : (
        <p className="text-sm text-ink-soft">Aún no has subido el PDF.</p>
      )}
      <PdfUploadForm kind={kind} replacing={Boolean(source)} />
    </section>
  );
}

export default async function PerfilPage() {
  await requireUser();

  const supabase = await createClient();
  const [{ data: sourceRows, error }, { data: contextRow }] = await Promise.all([
    supabase.from("profile_sources").select("*").order("created_at"),
    supabase.from("profile_context").select("*").maybeSingle(),
  ]);

  if (error) {
    console.error("PerfilPage", error);
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
        <p role="alert" className="mt-4 text-ink-soft">
          No se pudo cargar el perfil. Comprueba la migración de Supabase y las variables de .env.local.
        </p>
      </main>
    );
  }

  const sources = sourceRows as ProfileSource[];
  const context = contextRow as ProfileContext | null;
  const cv = sources.find((s) => s.kind === "cv");
  const linkedin = sources.find((s) => s.kind === "linkedin");
  const notes = sources.filter((s) => s.kind === "extra");
  const stale = isContextStale(context, sources);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 pb-16 pt-8 sm:px-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
        <p className="mt-1 max-w-prose text-ink-soft">
          Sube tu CV y tu LinkedIn en PDF y, si quieres, añade notas. Con ellos se genera un único perfil que se
          usa para analizar cada oferta.
        </p>
      </div>

      <div className={`${folder} flex flex-col gap-8`}>
        <PdfBlock title="CV" source={cv} kind="cv" />
        <div className="border-t border-rule pt-8">
          <PdfBlock title="LinkedIn" source={linkedin} kind="linkedin" />
        </div>

        <section className="flex flex-col gap-4 border-t border-rule pt-8">
          <h2 className="text-lg font-semibold">Notas extra</h2>
          {notes.length > 0 && (
            <ul className="flex flex-col gap-3">
              {notes.map((note) => (
                <li key={note.id} className="flex items-start justify-between gap-3 text-sm">
                  <p className="max-w-[60ch] whitespace-pre-line">{note.extracted_text}</p>
                  <DeleteSource id={note.id} label="la nota" />
                </li>
              ))}
            </ul>
          )}
          <NoteForm />
        </section>
      </div>

      <div className={`${folder} flex flex-col gap-4`}>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Perfil generado</h2>
          <p className="text-sm text-ink-soft">
            {sources.length === 0
              ? "Sube al menos tu CV para poder generarlo."
              : !context || !context.content
                ? "Aún no se ha generado."
                : stale
                  ? "Obsoleto: tus documentos han cambiado desde que se generó. Se regenerará solo al analizar la siguiente oferta."
                  : `Actualizado${context.generated_at ? ` el ${dateFormat.format(new Date(context.generated_at))}` : ""}${context.model ? ` · ${context.model}` : ""}.`}
          </p>
        </div>

        <RegenerateButton
          disabled={sources.length === 0}
          label={context?.content ? "Regenerar perfil" : "Generar perfil"}
        />

        {context?.content && (
          <details className="border-t border-rule pt-4">
            <summary className="cursor-pointer text-sm font-semibold">Ver el perfil generado</summary>
            <p className="mt-3 max-w-[70ch] whitespace-pre-wrap text-sm leading-relaxed">{context.content}</p>
          </details>
        )}
      </div>
    </main>
  );
}
