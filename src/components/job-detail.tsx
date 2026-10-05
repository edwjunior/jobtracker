import Link from "next/link";
import type { ReactNode } from "react";
import { DeleteJobButton } from "./delete-job-button";
import { ArrowLeftIcon, CheckIcon, CrossIcon, ExternalIcon, MinusIcon, PencilIcon, PlusIcon } from "./icons";
import { PhaseTab } from "./phase-label";
import { RankNav } from "./rank-nav";
import { ScoreStamp } from "./score-stamp";
import { StatusControl } from "./status-control";
import { buttonSecondary } from "./ui";
import type { Job } from "@/lib/jobs";

const HTTP_URL = /^https?:\/\//i;

function ListSection({ title, items, icon }: { title: string; items: string[]; icon: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {items.length === 0 ? (
        <p className="text-ink-faint">—</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item} className="flex gap-2.5 text-[15px] leading-snug">
              <span className="mt-0.5 shrink-0 text-ink-soft">{icon}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Prose({ children }: { children: string }) {
  return <p className="max-w-[70ch] whitespace-pre-line leading-relaxed">{children}</p>;
}

type Props = { job: Job; prevId: string | null; nextId: string | null; position: number; total: number };

export function JobDetail({ job, prevId, nextId, position, total }: Props) {
  const meta = [job.ubicacion, job.modalidad, job.salario].filter(Boolean);
  const hasResearch = job.rating || job.investigacion || job.fuentes.length > 0;

  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 pb-16 pt-6 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">
          <ArrowLeftIcon />
          Ofertas
        </Link>
        <RankNav prevId={prevId} nextId={nextId} position={position} total={total} />
      </div>

      <div className="mt-6 flex">
        <PhaseTab estado={job.estado} />
      </div>
      <article className="rounded-b-[2px] rounded-tr-[2px] border border-rule-strong bg-folder p-5 shadow-[0_1px_0_rgba(20,32,46,0.08),0_3px_8px_-3px_rgba(20,32,46,0.25)] sm:p-8">
        <header className="flex items-start justify-between gap-4 sm:gap-6">
          <div className="flex min-w-0 flex-col items-start gap-3">
            <span className="tape text-base">{job.empresa}</span>
            <h1 className="text-3xl font-bold leading-tight tracking-tight">{job.puesto}</h1>
            {meta.length > 0 && <p className="text-ink-soft">{meta.join(" · ")}</p>}
          </div>
          <ScoreStamp score={job.score} size="lg" />
        </header>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-rule pt-5">
          <StatusControl id={job.id} estado={job.estado} puesto={job.puesto} empresa={job.empresa} />
          <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
            {HTTP_URL.test(job.url) && (
              <a href={job.url} target="_blank" rel="noopener noreferrer" className={buttonSecondary}>
                <ExternalIcon />
                Ver oferta
              </a>
            )}
            <Link href={`/ofertas/${job.id}/editar`} className={buttonSecondary}>
              <PencilIcon />
              Editar
            </Link>
            <DeleteJobButton id={job.id} label={`${job.puesto} · ${job.empresa}`} />
          </div>
        </div>

        {job.estado === "descartada" && job.motivo && (
          <p className="mt-5 text-phase-descartada">
            <span className="font-semibold">Descartada: {job.motivo}.</span> {job.motivo_detalle}
          </p>
        )}

        <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
          <ListSection title="Competencias que coinciden" items={job.match} icon={<CheckIcon />} />
          <ListSection title="Gaps" items={job.gaps} icon={<CrossIcon />} />
          <ListSection title="Ventajas" items={job.ventajas} icon={<PlusIcon />} />
          <ListSection title="Desventajas" items={job.desventajas} icon={<MinusIcon />} />
        </div>

        {hasResearch && (
          <section className="mt-10 border-t border-rule pt-8">
            <h2 className="mb-3 text-lg font-semibold">Investigación de la empresa</h2>
            <div className="flex flex-col gap-3">
              {job.rating && (
                <p className="max-w-[70ch]">
                  <span className="font-semibold">Valoración: </span>
                  {job.rating}
                </p>
              )}
              {job.investigacion && <Prose>{job.investigacion}</Prose>}
              {job.fuentes.length > 0 && (
                <ul className="flex flex-col gap-1.5">
                  {job.fuentes
                    .filter((f) => HTTP_URL.test(f.url))
                    .map((f) => (
                      <li key={f.url}>
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm underline underline-offset-2 hover:text-ink-soft"
                        >
                          <ExternalIcon />
                          {f.title || f.url}
                        </a>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {job.notas && (
          <section className="mt-10 border-t border-rule pt-8">
            <h2 className="mb-3 text-lg font-semibold">Notas</h2>
            <Prose>{job.notas}</Prose>
          </section>
        )}

        {job.descripcion && (
          <details className="mt-10 border-t border-rule pt-6">
            <summary className="cursor-pointer text-lg font-semibold">Descripción de la oferta</summary>
            <div className="mt-3">
              <Prose>{job.descripcion}</Prose>
            </div>
          </details>
        )}
      </article>
    </main>
  );
}
