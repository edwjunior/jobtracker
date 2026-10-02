import { scoreTier } from "@/lib/jobs";

const TIER_CLASS = {
  alto: "bg-ink text-folder border-ink",
  medio: "bg-transparent text-ink border-ink",
  bajo: "bg-transparent text-ink-faint border-rule-strong",
} as const;

const SIZE_CLASS = {
  sm: "h-9 min-w-9 px-1.5 text-base border-[1.5px]",
  md: "h-12 min-w-12 px-2 text-2xl border-2",
  lg: "h-14 min-w-14 px-2 text-3xl border-2 sm:h-20 sm:min-w-20 sm:px-3 sm:text-5xl",
} as const;

// El score es un sello: sólido en tinta desde 70, contorno de 40 a 69, tenue por debajo.
// Sin color semántico: los colores de fase no deben confundirse con el score.
export function ScoreStamp({ score, size = "md" }: { score: number; size?: keyof typeof SIZE_CLASS }) {
  return (
    <span
      role="img"
      aria-label={`Compatibilidad ${score} de 100`}
      className={`inline-flex shrink-0 items-center justify-center rounded-[2px] font-bold tabular-nums leading-none ${TIER_CLASS[scoreTier(score)]} ${SIZE_CLASS[size]}`}
    >
      {score}
    </span>
  );
}
