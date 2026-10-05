"use client";

import { useEffect, useRef, type FormEvent } from "react";
import { MOTIVOS, type Job } from "@/lib/jobs";
import { buttonPrimary, buttonSecondary, fieldClass } from "./ui";

type Props = {
  job: Pick<Job, "puesto" | "empresa"> | null;
  onCancel: () => void;
  onConfirm: (motivo: string, detalle: string) => void;
};

// Descartar exige un motivo: es la única interrupción que el flujo justifica.
export function DiscardDialog({ job, onCancel, onConfirm }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (job && !dialog.open) dialog.showModal();
    if (!job && dialog.open) dialog.close();
  }, [job]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onConfirm(String(data.get("motivo") ?? ""), String(data.get("detalle") ?? ""));
  }

  return (
    <dialog
      ref={ref}
      onClose={onCancel}
      className="m-auto w-[min(92vw,28rem)] rounded-[2px] border border-rule-strong bg-folder p-0 text-ink backdrop:bg-ink/50"
    >
      {job && (
        <form onSubmit={submit} className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Descartar oferta</h2>
            <p className="text-sm text-ink-soft">
              {job.puesto} · {job.empresa}
            </p>
          </div>

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Motivo
            <select name="motivo" required defaultValue="" className={fieldClass}>
              <option value="" disabled>
                Selecciona un motivo
              </option>
              {MOTIVOS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Detalle (opcional)
            <textarea
              name="detalle"
              rows={3}
              placeholder="Fase concreta, feedback recibido…"
              className={fieldClass}
            />
          </label>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => ref.current?.close()} className={buttonSecondary}>
              Cancelar
            </button>
            <button type="submit" className={buttonPrimary}>
              Descartar oferta
            </button>
          </div>
        </form>
      )}
    </dialog>
  );
}
