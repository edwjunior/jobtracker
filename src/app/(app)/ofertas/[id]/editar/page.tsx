import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@/components/icons";
import { JobForm } from "@/components/job-form";
import { requireUser } from "@/lib/auth";
import type { Job } from "@/lib/jobs";
import { createClient } from "@/lib/supabase/server";
import { updateJob } from "../../actions";

export default async function EditarOfertaPage({ params }: PageProps<"/ofertas/[id]/editar">) {
  const { id } = await params;
  await requireUser();

  const supabase = await createClient();
  const { data: job } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle();
  if (!job) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <Link
        href={`/ofertas/${id}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
      >
        <ArrowLeftIcon />
        {job.puesto}
      </Link>
      <h1 className="mb-6 mt-6 text-3xl font-bold tracking-tight">Editar oferta</h1>
      <div className="rounded-[2px] border border-rule-strong bg-folder p-5 shadow-[0_1px_0_rgba(20,32,46,0.08),0_3px_8px_-3px_rgba(20,32,46,0.25)] sm:p-8">
        <JobForm
          action={updateJob.bind(null, id)}
          job={job as Job}
          submitLabel="Guardar cambios"
          cancelHref={`/ofertas/${id}`}
        />
      </div>
    </main>
  );
}
