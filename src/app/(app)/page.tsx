import { JobsBoard } from "@/components/jobs-board";
import { requireUser } from "@/lib/auth";
import type { Job } from "@/lib/jobs";
import { createClient } from "@/lib/supabase/server";

export default async function OfertasPage() {
  await requireUser();

  const supabase = await createClient();
  const { data, error } = await supabase.from("jobs").select("*");

  if (error) {
    console.error("OfertasPage", error);
    return (
      <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Ofertas</h1>
        <p role="alert" className="mt-4 max-w-prose text-ink-soft">
          No se pudieron cargar las ofertas. Comprueba que has aplicado la migración de Supabase
          (supabase/migrations) y que las variables de .env.local son correctas.
        </p>
      </main>
    );
  }

  return (
    <main>
      <JobsBoard jobs={data as Job[]} />
    </main>
  );
}
