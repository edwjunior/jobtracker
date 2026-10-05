"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

type Props = { prevId: string | null; nextId: string | null; position: number; total: number };

const linkClass =
  "inline-flex items-center gap-1.5 rounded-[2px] px-2 py-1 text-sm font-semibold transition-colors duration-150 hover:bg-drawer";
const disabledClass = "inline-flex items-center gap-1.5 px-2 py-1 text-sm text-ink-faint";

// Pasa a la oferta anterior o siguiente del ranking por score, también con ← y →.
export function RankNav({ prevId, nextId, position, total }: Props) {
  const router = useRouter();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, dialog, [contenteditable]")) return;

      if (event.key === "ArrowLeft" && prevId) router.push(`/ofertas/${prevId}`);
      if (event.key === "ArrowRight" && nextId) router.push(`/ofertas/${nextId}`);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevId, nextId, router]);

  return (
    <nav aria-label="Ranking de ofertas" className="flex items-center gap-1">
      {prevId ? (
        <Link href={`/ofertas/${prevId}`} className={linkClass} title="Anterior (←)">
          <ArrowLeftIcon />
          Anterior
        </Link>
      ) : (
        <span className={disabledClass}>
          <ArrowLeftIcon />
          Anterior
        </span>
      )}
      <span className="px-2 text-sm tabular-nums text-ink-soft">
        {position} de {total}
      </span>
      {nextId ? (
        <Link href={`/ofertas/${nextId}`} className={linkClass} title="Siguiente (→)">
          Siguiente
          <ArrowRightIcon />
        </Link>
      ) : (
        <span className={disabledClass}>
          Siguiente
          <ArrowRightIcon />
        </span>
      )}
    </nav>
  );
}
