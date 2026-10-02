export const ESTADOS = [
  "guardada",
  "en-curso",
  "entrevista",
  "completada",
  "descartada",
] as const;

export type Estado = (typeof ESTADOS)[number];

export const ESTADO_LABEL: Record<Estado, string> = {
  guardada: "Guardada",
  "en-curso": "En curso",
  entrevista: "Entrevista",
  completada: "Completada",
  descartada: "Descartada",
};

// Clases completas (no construidas) para que Tailwind las detecte.
export const ESTADO_FILL: Record<Estado, string> = {
  guardada: "bg-phase-guardada text-white",
  "en-curso": "bg-phase-en-curso text-white",
  entrevista: "bg-phase-entrevista text-ink",
  completada: "bg-phase-completada text-white",
  descartada: "bg-phase-descartada text-white",
};

export const ESTADO_DOT: Record<Estado, string> = {
  guardada: "bg-phase-guardada",
  "en-curso": "bg-phase-en-curso",
  entrevista: "bg-phase-entrevista",
  completada: "bg-phase-completada",
  descartada: "bg-phase-descartada",
};

export const ESTADO_EDGE: Record<Estado, string> = {
  guardada: "border-t-phase-guardada",
  "en-curso": "border-t-phase-en-curso",
  entrevista: "border-t-phase-entrevista",
  completada: "border-t-phase-completada",
  descartada: "border-t-phase-descartada",
};

export const MOTIVOS = [
  { value: "Sin respuesta", label: "Sin respuesta de la empresa" },
  { value: "Rechazado tras cribado de CV", label: "Rechazado tras cribado de CV" },
  { value: "Rechazado tras entrevista", label: "Rechazado tras entrevista" },
  { value: "Rechazado tras prueba técnica", label: "Rechazado tras prueba técnica" },
  { value: "Descartado por mí: salario", label: "Lo descarté yo: salario o condiciones" },
  { value: "Descartado por mí: cultura/reputación", label: "Lo descarté yo: cultura o reputación" },
  { value: "Descartado por mí: otra oferta aceptada", label: "Lo descarté yo: acepté otra oferta" },
  { value: "Otro", label: "Otro" },
] as const;

export const MODALIDADES = ["Remoto", "Híbrido", "Presencial"] as const;

export type Fuente = { title: string; url: string };

export type Job = {
  id: string;
  empresa: string;
  puesto: string;
  ubicacion: string;
  modalidad: string;
  salario: string;
  score: number;
  estado: Estado;
  motivo: string;
  motivo_detalle: string;
  url: string;
  descripcion: string;
  match: string[];
  gaps: string[];
  ventajas: string[];
  desventajas: string[];
  notas: string;
  rating: string;
  investigacion: string;
  fuentes: Fuente[];
  created_at: string;
  updated_at: string;
};

export function isEstado(value: unknown): value is Estado {
  return typeof value === "string" && (ESTADOS as readonly string[]).includes(value);
}

// Mismo criterio de ordenación en lista, tabla, Kanban y navegación de fichas.
export function compareJobs(a: Pick<Job, "score" | "empresa" | "id">, b: Pick<Job, "score" | "empresa" | "id">) {
  return b.score - a.score || a.empresa.localeCompare(b.empresa) || a.id.localeCompare(b.id);
}

export type ScoreTier = "alto" | "medio" | "bajo";

export function scoreTier(score: number): ScoreTier {
  if (score >= 70) return "alto";
  if (score >= 40) return "medio";
  return "bajo";
}

export function summarize(jobs: Job[]) {
  const total = jobs.length;
  const avg = total ? Math.round(jobs.reduce((sum, j) => sum + j.score, 0) / total) : null;
  const active = jobs.filter((j) => j.estado === "en-curso" || j.estado === "entrevista").length;
  return { total, avg, active };
}

// Los gaps se escriben como frases largas: "Kubernetes y GCP — no hay evidencia…".
// Para la lista basta la parte inicial.
export function gapHeadline(gap: string) {
  const cut = gap.search(/ — | \(|: /);
  const head = (cut > 0 ? gap.slice(0, cut) : gap).trim();
  if (head.length <= 60) return head;
  // Si es largo, mejor cortar en la primera cláusula que a media frase.
  const clause = head.search(/[,;] |\. /);
  if (clause >= 15) return head.slice(0, clause);
  const words = head
    .slice(0, 60)
    .replace(/\s+\S*$/, "")
    .replace(/(\s+(y|o|de|del|la|el|en|con|a|que|para|como|al|un|una|sin|muy))+$/i, "");
  return `${words}…`;
}

export function matchesQuery(job: Job, query: string) {
  const q = query.trim().toLowerCase();
  return !q || job.empresa.toLowerCase().includes(q) || job.puesto.toLowerCase().includes(q);
}
