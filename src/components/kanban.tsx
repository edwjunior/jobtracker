"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ESTADOS,
  ESTADO_EDGE,
  ESTADO_LABEL,
  gapHeadline,
  type Estado,
  type Job,
} from "@/lib/jobs";
import { ScoreStamp } from "./score-stamp";

type Props = {
  jobs: Job[];
  onMove: (job: Job, estado: Estado) => void;
};

// Una columna por fase. Arrastrar una carpeta cambia su fase; el selector "Mover a"
// cubre teclado y pantallas táctiles, donde arrastrar no funciona.
export function Kanban({ jobs, onMove }: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overEstado, setOverEstado] = useState<Estado | null>(null);

  function drop(estado: Estado) {
    const job = jobs.find((j) => j.id === draggingId);
    setDraggingId(null);
    setOverEstado(null);
    if (job) onMove(job, estado);
  }

  return (
    <div className="grid gap-3 overflow-x-auto [grid-template-columns:repeat(5,minmax(16rem,1fr))]">
      {ESTADOS.map((estado) => {
        const column = jobs.filter((j) => j.estado === estado);
        return (
          <section
            key={estado}
            aria-label={ESTADO_LABEL[estado]}
            onDragOver={(e) => {
              if (!draggingId) return;
              e.preventDefault();
              setOverEstado(estado);
            }}
            onDragLeave={() => setOverEstado((current) => (current === estado ? null : current))}
            onDrop={(e) => {
              e.preventDefault();
              drop(estado);
            }}
            className={`flex min-h-48 flex-col gap-2.5 rounded-[2px] border border-t-[3px] border-rule bg-desk p-2.5 transition-colors duration-150 ${ESTADO_EDGE[estado]} ${
              overEstado === estado ? "bg-folder" : ""
            }`}
          >
            <h3 className="flex items-baseline justify-between text-sm font-semibold uppercase tracking-wider [font-stretch:75%]">
              {ESTADO_LABEL[estado]}
              <span className="tabular-nums text-ink-soft">{column.length}</span>
            </h3>

            {column.length === 0 && (
              <p className="py-4 text-center text-sm text-ink-faint">Suelta aquí una oferta</p>
            )}

            {column.map((job) => {
              const gap = job.gaps[0] ? gapHeadline(job.gaps[0]) : "";
              return (
                <article
                  key={job.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", job.id);
                    setDraggingId(job.id);
                  }}
                  onDragEnd={() => {
                    setDraggingId(null);
                    setOverEstado(null);
                  }}
                  className={`flex cursor-grab flex-col gap-2 rounded-[2px] border border-rule-strong bg-folder p-3 shadow-[0_1px_0_rgba(20,32,46,0.08),0_2px_5px_-2px_rgba(20,32,46,0.25)] transition-opacity duration-150 active:cursor-grabbing ${
                    draggingId === job.id ? "opacity-40" : ""
                  }`}
                >
                  <Link
                    href={`/ofertas/${job.id}`}
                    draggable={false}
                    className="flex items-start justify-between gap-2"
                  >
                    <span className="flex min-w-0 flex-col items-start gap-1.5">
                      <span className="tape text-xs">{job.empresa}</span>
                      <span className="line-clamp-3 font-semibold leading-snug">{job.puesto}</span>
                    </span>
                    <ScoreStamp score={job.score} size="sm" />
                  </Link>

                  {gap && <p className="line-clamp-2 text-sm text-ink-soft">Falta: {gap}</p>}

                  <label className="flex items-center gap-2 text-xs text-ink-soft">
                    Mover a
                    <select
                      value={job.estado}
                      onChange={(e) => onMove(job, e.target.value as Estado)}
                      className="rounded-[2px] border border-rule-strong bg-white px-1.5 py-1 text-xs text-ink"
                    >
                      {ESTADOS.map((e) => (
                        <option key={e} value={e}>
                          {ESTADO_LABEL[e]}
                        </option>
                      ))}
                    </select>
                  </label>
                </article>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
