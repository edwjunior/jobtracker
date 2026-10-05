"use client";

import Link from "next/link";
import { useActionState } from "react";
import { analyzeAndCreate } from "@/app/(app)/ofertas/actions";
import { buttonPrimary, fieldClass } from "./ui";

export function AnalyzeForm() {
  const [state, action, pending] = useActionState(analyzeAndCreate, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Descripción de la oferta
        <textarea
          name="descripcion"
          rows={14}
          required
          defaultValue={state?.descripcion}
          placeholder="Pega aquí el texto completo de la oferta…"
          className={fieldClass}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Enlace a la oferta (opcional)
        <input name="url" type="url" defaultValue={state?.url} placeholder="https://…" className={fieldClass} />
      </label>

      {state?.error && (
        <p role="alert" className="text-sm font-medium text-phase-descartada">
          {state.error}
          {state.error.includes("Perfil") && (
            <>
              {" "}
              <Link href="/perfil" className="underline underline-offset-2">
                Ir a Perfil
              </Link>
            </>
          )}
        </p>
      )}

      {pending && (
        <p role="status" className="text-sm text-ink-soft">
          Comparando la oferta con tu perfil. Puede tardar hasta un minuto.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className={buttonPrimary}>
          {pending ? "Analizando…" : "Analizar y guardar"}
        </button>
        <Link href="/ofertas/nueva?modo=manual" className="text-sm font-semibold underline underline-offset-2">
          Rellenar a mano
        </Link>
      </div>
    </form>
  );
}
