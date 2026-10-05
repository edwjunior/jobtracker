import Link from "next/link";
import { gapHeadline, type Job } from "@/lib/jobs";
import { PhaseTab } from "./phase-label";
import { ScoreStamp } from "./score-stamp";

const SALARIO_SIN_DATO = /^no especificad/i;

// Una oferta es una carpeta: pestaña de fase arriba, cinta de empresa, puesto, sello de score y qué falta.
export function JobFolder({ job }: { job: Job }) {
  const gaps = job.gaps.slice(0, 2).map(gapHeadline);
  // Sin duplicados: ubicación "Remoto" y modalidad "Remoto" se leen una sola vez.
  const meta = [
    ...new Map(
      [
        job.ubicacion,
        job.modalidad,
        job.salario && !SALARIO_SIN_DATO.test(job.salario) ? job.salario : "",
      ]
        .filter(Boolean)
        .map((value) => [value.toLowerCase(), value]),
    ).values(),
  ];

  return (
    <Link href={`/ofertas/${job.id}`} className="group flex h-full flex-col">
      <span className="flex">
        <PhaseTab estado={job.estado} />
      </span>
      <article className="flex flex-1 flex-col gap-3 rounded-b-[2px] rounded-tr-[2px] border border-rule-strong bg-folder p-4 shadow-[0_1px_0_rgba(20,32,46,0.08),0_3px_8px_-3px_rgba(20,32,46,0.25)] transition-[transform,box-shadow] duration-150 group-hover:-translate-y-px group-hover:shadow-[0_1px_0_rgba(20,32,46,0.1),0_8px_16px_-6px_rgba(20,32,46,0.35)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col items-start gap-2">
            <span className="tape text-sm">{job.empresa}</span>
            <h3 className="line-clamp-3 text-lg font-semibold leading-snug">{job.puesto}</h3>
          </div>
          <ScoreStamp score={job.score} />
        </div>

        {meta.length > 0 && <p className="line-clamp-2 text-sm text-ink-soft">{meta.join(" · ")}</p>}

        {job.estado === "descartada" && job.motivo && (
          <p className="text-sm font-medium text-phase-descartada">{job.motivo}</p>
        )}

        {gaps.length > 0 && (
          <div className="flex flex-col gap-0.5 border-t border-rule pt-3 text-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint [font-stretch:75%]">
              Falta
            </span>
            {gaps.map((gap) => (
              <span key={gap} className="line-clamp-2">
                {gap}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
