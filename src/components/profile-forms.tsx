"use client";

import { useActionState } from "react";
import { addNote, generateProfileContext, uploadPdf } from "@/app/(app)/perfil/actions";
import { buttonPrimary, buttonSecondary, fieldClass } from "./ui";

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm font-medium text-phase-descartada">
      {message}
    </p>
  );
}

export function PdfUploadForm({ kind, replacing }: { kind: "cv" | "linkedin"; replacing: boolean }) {
  const [state, action, pending] = useActionState(uploadPdf.bind(null, kind), undefined);

  return (
    <form action={action} className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          name="file"
          accept="application/pdf"
          required
          className="text-sm file:mr-3 file:rounded-[2px] file:border file:border-ink file:bg-transparent file:px-3 file:py-1.5 file:text-sm file:font-semibold"
        />
        <button type="submit" disabled={pending} className={buttonSecondary}>
          {pending ? "Subiendo…" : replacing ? "Reemplazar" : "Subir PDF"}
        </button>
      </div>
      <ErrorText message={state?.error} />
    </form>
  );
}

export function NoteForm() {
  const [state, action, pending] = useActionState(addNote, undefined);

  return (
    <form action={action} className="flex flex-col gap-2">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Nueva nota
        <textarea
          name="nota"
          rows={4}
          required
          maxLength={5000}
          defaultValue={state?.nota}
          placeholder="Proyectos propios, logros, preferencias de búsqueda, lo que no aparece en el CV…"
          className={fieldClass}
        />
      </label>
      <ErrorText message={state?.error} />
      <div>
        <button type="submit" disabled={pending} className={buttonSecondary}>
          {pending ? "Guardando…" : "Añadir nota"}
        </button>
      </div>
    </form>
  );
}

export function RegenerateButton({ disabled, label }: { disabled: boolean; label: string }) {
  const [state, action, pending] = useActionState(generateProfileContext, undefined);

  return (
    <form action={action} className="flex flex-col items-start gap-2">
      <button type="submit" disabled={disabled || pending} className={buttonPrimary}>
        {pending ? "Generando…" : label}
      </button>
      {pending && <p className="text-sm text-ink-soft">Gemini está leyendo tus documentos. Puede tardar hasta un minuto.</p>}
      <ErrorText message={state?.error} />
    </form>
  );
}
