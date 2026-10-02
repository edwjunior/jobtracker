import Link from "next/link";
import { ESTADO_LABEL, gapHeadline, type Job } from "@/lib/jobs";
import { PhaseDot } from "./phase-label";
import { ScoreStamp } from "./score-stamp";

function Items({ items }: { items: string[] }) {
  if (items.length === 0) return <span className="text-ink-faint">—</span>;
  return (
    <ul className="flex list-disc flex-col gap-0.5 pl-4">
      {items.map((item) => (
        <li key={item}>{gapHeadline(item)}</li>
      ))}
    </ul>
  );
}

const ROWS: { label: string; cell: (job: Job) => React.ReactNode }[] = [
  { label: "Match", cell: (j) => <ScoreStamp score={j.score} size="sm" /> },
  {
    label: "Fase",
    cell: (j) => (
      <span className="inline-flex items-center gap-2">
        <PhaseDot estado={j.estado} />
        {ESTADO_LABEL[j.estado]}
      </span>
    ),
  },
  { label: "Motivo de descarte", cell: (j) => (j.estado === "descartada" ? j.motivo || "—" : "—") },
  { label: "Ubicación", cell: (j) => j.ubicacion || "—" },
  { label: "Modalidad", cell: (j) => j.modalidad || "—" },
  { label: "Salario", cell: (j) => j.salario || "—" },
  { label: "Valoración de empresa", cell: (j) => (j.rating ? <span className="line-clamp-4">{j.rating}</span> : "—") },
  { label: "Coincidencias", cell: (j) => <Items items={j.match} /> },
  { label: "Gaps", cell: (j) => <Items items={j.gaps} /> },
  { label: "Ventajas", cell: (j) => <Items items={j.ventajas} /> },
  { label: "Desventajas", cell: (j) => <Items items={j.desventajas} /> },
];

// Ofertas en columnas, criterios en filas: la primera columna queda fija al desplazar.
export function JobsTable({ jobs }: { jobs: Job[] }) {
  // "Motivo de descarte" solo aporta cuando hay alguna oferta descartada.
  const rows = jobs.some((j) => j.estado === "descartada")
    ? ROWS
    : ROWS.filter((row) => row.label !== "Motivo de descarte");

  return (
    <>
      {jobs.length > 4 && (
        <p className="mb-2 text-sm text-ink-soft">Desplázate hacia los lados para comparar más ofertas.</p>
      )}
      <div className="overflow-x-auto rounded-[2px] border border-rule-strong bg-folder">
      <table className="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-10 w-40 min-w-40 border-b border-r border-rule-strong bg-ink px-3 py-3 text-left font-semibold text-folder"
            >
              Criterio
            </th>
            {jobs.map((job) => (
              <th
                key={job.id}
                scope="col"
                className="min-w-64 max-w-72 border-b border-r border-rule-strong bg-ink px-3 py-3 text-left align-top font-normal text-folder"
              >
                <Link href={`/ofertas/${job.id}`} className="flex flex-col items-start gap-1.5 hover:underline">
                  <span className="rounded-[2px] bg-folder px-1.5 py-1 text-xs font-semibold uppercase leading-none tracking-wider text-ink [font-stretch:75%]">
                    {job.empresa}
                  </span>
                  <span className="font-semibold">{job.puesto}</span>
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th
                scope="row"
                className="sticky left-0 z-10 border-b border-r border-rule bg-drawer px-3 py-2.5 text-left align-top font-semibold"
              >
                {row.label}
              </th>
              {jobs.map((job) => (
                <td key={job.id} className="border-b border-r border-rule px-3 py-2.5 align-top">
                  {row.cell(job)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}
