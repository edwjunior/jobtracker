"use client";

import { useRef } from "react";
import { deleteJob } from "@/app/(app)/ofertas/actions";
import { TrashIcon } from "./icons";
import { buttonPrimary, buttonSecondary } from "./ui";

// Eliminar no se puede deshacer: pide confirmación en un diálogo nativo.
export function DeleteJobButton({ id, label }: { id: string; label: string }) {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className={buttonSecondary}>
        <TrashIcon />
        Eliminar
      </button>
      <dialog
        ref={ref}
        className="m-auto w-[min(92vw,26rem)] rounded-[2px] border border-rule-strong bg-folder p-0 text-ink backdrop:bg-ink/50"
      >
        <form action={deleteJob.bind(null, id)} className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">¿Eliminar esta oferta?</h2>
            <p className="text-sm text-ink-soft">
              {label}. Esta acción no se puede deshacer.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => ref.current?.close()} className={buttonSecondary}>
              Cancelar
            </button>
            <button type="submit" className={buttonPrimary}>
              Eliminar oferta
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
