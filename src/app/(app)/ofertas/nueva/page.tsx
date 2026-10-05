import Link from "next/link";
import { AnalyzeForm } from "@/components/analyze-form";
import { ArrowLeftIcon } from "@/components/icons";
import { JobForm } from "@/components/job-form";
import { requireUser } from "@/lib/auth";
import { createJob } from "../actions";

// El análisis con IA comparte este límite: la acción tarda lo que tarde Gemini.
export const maxDuration = 60;

const folder =
  "rounded-[2px] border border-rule-strong bg-folder p-5 shadow-[0_1px_0_rgba(20,32,46,0.08),0_3px_8px_-3px_rgba(20,32,46,0.25)] sm:p-8";

export default async function NuevaOfertaPage({ searchParams }: PageProps<"/ofertas/nueva">) {
  await requireUser();
  const manual = (await searchParams).modo === "manual";

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">
        <ArrowLeftIcon />
        Ofertas
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">{manual ? "Nueva oferta a mano" : "Añadir oferta"}</h1>
      <p className="mb-6 mt-1 max-w-prose text-ink-soft">
        {manual ? (
          <>
            Rellena todos los campos tú mismo.{" "}
            <Link href="/ofertas/nueva" className="font-semibold underline underline-offset-2">
              Analizar con IA
            </Link>
          </>
        ) : (
          "Pega la descripción y se compara con tu perfil. La oferta se guarda en «Guardada» con competencias, gaps, ventajas, desventajas y score ya rellenados."
        )}
      </p>

      <div className={folder}>
        {manual ? (
          <JobForm action={createJob} submitLabel="Guardar oferta" cancelHref="/" />
        ) : (
          <AnalyzeForm />
        )}
      </div>
    </main>
  );
}
