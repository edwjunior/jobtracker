"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { moveJob } from "@/app/(app)/ofertas/actions";
import {
  ESTADOS,
  ESTADO_EDGE,
  ESTADO_LABEL,
  compareJobs,
  matchesQuery,
  summarize,
  type Estado,
  type Job,
} from "@/lib/jobs";
import { DiscardDialog } from "./discard-dialog";
import { BoardViewIcon, CardsViewIcon, PlusIcon, SearchIcon, TableViewIcon } from "./icons";
import { JobFolder } from "./job-folder";
import { JobsTable } from "./jobs-table";
import { Kanban } from "./kanban";
import { PhaseDot } from "./phase-label";
import { buttonPrimary, buttonSecondary } from "./ui";

type View = "tarjetas" | "tabla" | "kanban";
type Fase = Estado | "todas";

const VIEWS: { id: View; label: string; Icon: typeof CardsViewIcon }[] = [
  { id: "tarjetas", label: "Tarjetas", Icon: CardsViewIcon },
  { id: "tabla", label: "Tabla", Icon: TableViewIcon },
  { id: "kanban", label: "Kanban", Icon: BoardViewIcon },
];

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export function JobsBoard({ jobs }: { jobs: Job[] }) {
  const [view, setView] = useState<View>("tarjetas");
  const [query, setQuery] = useState("");
  const [fase, setFase] = useState<Fase>("todas");
  const [discarding, setDiscarding] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // La carpeta cambia de fase al instante; si el servidor falla, vuelve a su sitio.
  const [current, applyMove] = useOptimistic(
    jobs,
    (state, move: Pick<Job, "id" | "estado" | "motivo" | "motivo_detalle">) =>
      state.map((j) => (j.id === move.id ? { ...j, ...move } : j)),
  );

  const { total, avg, active } = summarize(current);
  const counts = Object.fromEntries(
    ESTADOS.map((e) => [e, current.filter((j) => j.estado === e).length]),
  ) as Record<Estado, number>;

  const searched = current.filter((j) => matchesQuery(j, query)).sort(compareJobs);
  const visible = view === "kanban" || fase === "todas" ? searched : searched.filter((j) => j.estado === fase);

  function commitMove(job: Job, estado: Estado, motivo: string, detalle: string) {
    setError(null);
    startTransition(async () => {
      applyMove({ id: job.id, estado, motivo, motivo_detalle: detalle });
      const result = await moveJob(job.id, estado, motivo, detalle);
      if (result.error) setError(result.error);
    });
  }

  function requestMove(job: Job, estado: Estado) {
    if (estado === job.estado) return;
    if (estado === "descartada") setDiscarding(job);
    else commitMove(job, estado, "", "");
  }

  function clearFilters() {
    setQuery("");
    setFase("todas");
  }

  const tabBase =
    "relative -mb-px inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-t-[4px] border border-b-0 px-3.5 py-2 text-sm font-medium transition-colors duration-150";

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ofertas</h1>
          <p className="mt-1 text-ink-soft tabular-nums">
            {plural(total, "expediente", "expedientes")}
            {avg !== null && <> · match medio {avg}</>} · {active} en proceso
          </p>
        </div>
        <Link href="/ofertas/nueva" className={buttonPrimary}>
          <PlusIcon />
          Añadir oferta
        </Link>
      </div>

      {total === 0 ? (
        <div className="mt-8 flex flex-col items-start gap-3 rounded-[2px] border border-dashed border-rule-strong p-8">
          <h2 className="text-xl font-bold">Aún no hay expedientes</h2>
          <p className="max-w-prose text-ink-soft">
            Añade tu primera oferta para empezar a ordenarlas por compatibilidad y a seguir cada
            candidatura por sus fases.
          </p>
          <Link href="/ofertas/nueva" className={buttonPrimary}>
            <PlusIcon />
            Añadir oferta
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <label className="relative w-full sm:w-auto">
                <span className="sr-only">Buscar empresa o puesto</span>
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar empresa o puesto"
                  className="w-full rounded-[2px] border border-rule-strong bg-white py-2 pl-9 pr-3 text-sm placeholder:text-ink-faint sm:w-72"
                />
              </label>
              <span className="text-sm text-ink-soft">Ordenadas por compatibilidad</span>
            </div>

            <div role="group" aria-label="Vista" className="flex overflow-hidden rounded-[2px] border border-ink">
              {VIEWS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={view === id}
                  onClick={() => setView(id)}
                  className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold transition-colors duration-150 ${
                    view === id ? "bg-ink text-folder" : "hover:bg-drawer"
                  }`}
                >
                  <Icon />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-3 text-sm font-medium text-phase-descartada">
              {error}
            </p>
          )}

          {view !== "kanban" && (
            <div role="group" aria-label="Filtrar por fase" className="-mx-1 mt-4 flex flex-nowrap items-end gap-1 overflow-x-auto px-1 pb-px pt-1">
              {(["todas", ...ESTADOS] as Fase[]).map((f) => {
                const selected = fase === f;
                return (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setFase(f)}
                    className={`${tabBase} ${
                      selected
                        ? `z-10 border-rule-strong border-t-[3px] bg-drawer text-ink ${f === "todas" ? "border-t-ink" : ESTADO_EDGE[f]}`
                        : "border-rule bg-desk text-ink-soft hover:bg-drawer/60"
                    }`}
                  >
                    {f !== "todas" && <PhaseDot estado={f} />}
                    {f === "todas" ? "Todas" : ESTADO_LABEL[f]}
                    <span className="tabular-nums text-ink-soft">{f === "todas" ? total : counts[f]}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div
            className={`border border-rule-strong bg-drawer p-3 sm:p-5 ${
              view === "kanban" ? "mt-5 rounded-[4px]" : "-mt-px rounded-b-[4px] rounded-tr-[4px]"
            }`}
          >
            {visible.length === 0 ? (
              <div className="flex flex-col items-start gap-3 py-6">
                <p className="text-lg font-semibold">Ninguna oferta coincide con los filtros.</p>
                <button type="button" onClick={clearFilters} className={buttonSecondary}>
                  Limpiar filtros
                </button>
              </div>
            ) : view === "tarjetas" ? (
              <ul className="grid gap-x-4 gap-y-6 [grid-template-columns:repeat(auto-fill,minmax(min(20rem,100%),1fr))]">
                {visible.map((job) => (
                  <li key={job.id}>
                    <JobFolder job={job} />
                  </li>
                ))}
              </ul>
            ) : view === "tabla" ? (
              <JobsTable jobs={visible} />
            ) : (
              <Kanban jobs={visible} onMove={requestMove} />
            )}
          </div>
        </>
      )}

      <DiscardDialog
        job={discarding}
        onCancel={() => setDiscarding(null)}
        onConfirm={(motivo, detalle) => {
          if (discarding) commitMove(discarding, "descartada", motivo, detalle);
          setDiscarding(null);
        }}
      />
    </div>
  );
}
