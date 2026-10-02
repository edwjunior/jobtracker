"use client";

import Link from "next/link";
import { useActionState, useState, type ReactNode } from "react";
import type { JobFormState } from "@/app/(app)/ofertas/actions";
import { ESTADOS, ESTADO_LABEL, MODALIDADES, MOTIVOS, type Estado, type Job } from "@/lib/jobs";
import { buttonPrimary, buttonSecondary, fieldClass } from "./ui";

type Props = {
  action: (state: JobFormState, formData: FormData) => Promise<JobFormState>;
  job?: Job;
  submitLabel: string;
  cancelHref: string;
};

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      {label}
      {children}
      {hint && <span className="text-xs font-normal text-ink-soft">{hint}</span>}
    </label>
  );
}

export function JobForm({ action, job, submitLabel, cancelHref }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [estado, setEstado] = useState<Estado>(job?.estado ?? "guardada");

  const lines = (items: string[] | undefined) => (items ?? []).join("\n");
  const fuentes = (job?.fuentes ?? []).map((f) => `${f.title} | ${f.url}`).join("\n");

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Empresa">
          <input name="empresa" required defaultValue={job?.empresa} className={fieldClass} />
        </Field>
        <Field label="Puesto">
          <input name="puesto" required defaultValue={job?.puesto} className={fieldClass} />
        </Field>
        <Field label="Ubicación">
          <input name="ubicacion" defaultValue={job?.ubicacion} className={fieldClass} />
        </Field>
        <Field label="Modalidad">
          <input name="modalidad" list="modalidades" defaultValue={job?.modalidad} className={fieldClass} />
          <datalist id="modalidades">
            {MODALIDADES.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </Field>
        <Field label="Salario (opcional)">
          <input name="salario" defaultValue={job?.salario} placeholder="38.000-45.000 €" className={fieldClass} />
        </Field>
        <Field label="Match global (0-100)">
          <input
            name="score"
            type="number"
            min={0}
            max={100}
            defaultValue={job?.score ?? 50}
            className={fieldClass}
          />
        </Field>
        <Field label="Fase">
          <select
            name="estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value as Estado)}
            className={fieldClass}
          >
            {ESTADOS.map((e) => (
              <option key={e} value={e}>
                {ESTADO_LABEL[e]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Enlace a la oferta">
          <input name="url" type="url" defaultValue={job?.url} placeholder="https://…" className={fieldClass} />
        </Field>
      </div>

      {estado === "descartada" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Motivo del descarte">
            <select name="motivo" required defaultValue={job?.motivo ?? ""} className={fieldClass}>
              <option value="" disabled>
                Selecciona un motivo
              </option>
              {MOTIVOS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Detalle (opcional)">
            <input name="motivo_detalle" defaultValue={job?.motivo_detalle} className={fieldClass} />
          </Field>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Competencias que coinciden" hint="Una por línea.">
          <textarea name="match" rows={5} defaultValue={lines(job?.match)} className={fieldClass} />
        </Field>
        <Field label="Gaps: competencias que te faltan" hint="Una por línea.">
          <textarea name="gaps" rows={5} defaultValue={lines(job?.gaps)} className={fieldClass} />
        </Field>
        <Field label="Ventajas" hint="Una por línea.">
          <textarea name="ventajas" rows={5} defaultValue={lines(job?.ventajas)} className={fieldClass} />
        </Field>
        <Field label="Desventajas y red flags" hint="Una por línea.">
          <textarea name="desventajas" rows={5} defaultValue={lines(job?.desventajas)} className={fieldClass} />
        </Field>
      </div>

      <Field label="Valoración de la empresa (opcional)">
        <input name="rating" defaultValue={job?.rating} placeholder="3.9/5 en Glassdoor" className={fieldClass} />
      </Field>
      <Field label="Investigación de la empresa" hint="Reputación, opiniones y contexto.">
        <textarea name="investigacion" rows={5} defaultValue={job?.investigacion} className={fieldClass} />
      </Field>
      <Field label="Fuentes" hint="Una por línea: «Título | https://…» o solo la URL.">
        <textarea name="fuentes" rows={3} defaultValue={fuentes} className={fieldClass} />
      </Field>
      <Field label="Notas">
        <textarea name="notas" rows={5} defaultValue={job?.notas} className={fieldClass} />
      </Field>
      <Field label="Descripción de la oferta" hint="El texto original, para consultarlo después.">
        <textarea name="descripcion" rows={8} defaultValue={job?.descripcion} className={fieldClass} />
      </Field>

      {state?.error && (
        <p role="alert" className="text-sm font-medium text-phase-descartada">
          {state.error}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Link href={cancelHref} className={buttonSecondary}>
          Cancelar
        </Link>
        <button type="submit" disabled={pending} className={buttonPrimary}>
          {pending ? "Guardando…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
