"use client";

import { useOptimistic, useState, useTransition } from "react";
import { moveJob } from "@/app/(app)/ofertas/actions";
import { ESTADOS, ESTADO_LABEL, type Estado, type Job } from "@/lib/jobs";
import { DiscardDialog } from "./discard-dialog";
import { fieldClass } from "./ui";

type Props = Pick<Job, "id" | "estado" | "puesto" | "empresa">;

// Cambia la fase desde la ficha. Descartar pide el motivo antes de guardar.
export function StatusControl({ id, estado, puesto, empresa }: Props) {
  const [optimisticEstado, setOptimisticEstado] = useOptimistic(estado);
  const [discarding, setDiscarding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function commit(next: Estado, motivo = "", detalle = "") {
    setError(null);
    startTransition(async () => {
      setOptimisticEstado(next);
      const result = await moveJob(id, next, motivo, detalle);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-2 text-sm font-medium">
        Fase
        <select
          value={optimisticEstado}
          onChange={(e) => {
            const next = e.target.value as Estado;
            if (next === estado) return;
            if (next === "descartada") setDiscarding(true);
            else commit(next);
          }}
          className={`${fieldClass} w-auto py-1.5`}
        >
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {ESTADO_LABEL[e]}
            </option>
          ))}
        </select>
      </label>
      {error && (
        <p role="alert" className="text-sm font-medium text-phase-descartada">
          {error}
        </p>
      )}
      <DiscardDialog
        job={discarding ? { puesto, empresa } : null}
        onCancel={() => setDiscarding(false)}
        onConfirm={(motivo, detalle) => {
          setDiscarding(false);
          commit("descartada", motivo, detalle);
        }}
      />
    </div>
  );
}
