import { ESTADO_DOT, ESTADO_FILL, ESTADO_LABEL, type Estado } from "@/lib/jobs";

// Pestaña de la carpeta: el color de fase solo aparece aquí y en los puntos de fase.
export function PhaseTab({ estado }: { estado: Estado }) {
  return (
    <span
      className={`inline-block rounded-t-[4px] px-2.5 py-1 text-xs font-semibold uppercase leading-none tracking-wider [font-stretch:75%] ${ESTADO_FILL[estado]}`}
    >
      {ESTADO_LABEL[estado]}
    </span>
  );
}

export function PhaseDot({ estado }: { estado: Estado }) {
  return <span aria-hidden="true" className={`inline-block size-2 shrink-0 rounded-full ${ESTADO_DOT[estado]}`} />;
}
