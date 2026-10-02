import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { JobForm } from "@/components/job-form";
import { requireUser } from "@/lib/auth";
import { createJob } from "../actions";

export default async function NuevaOfertaPage() {
  await requireUser();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">
        <ArrowLeftIcon />
        Ofertas
      </Link>
      <h1 className="mb-6 mt-6 text-3xl font-bold tracking-tight">Nueva oferta</h1>
      <div className="rounded-[2px] border border-rule-strong bg-folder p-5 shadow-[0_1px_0_rgba(20,32,46,0.08),0_3px_8px_-3px_rgba(20,32,46,0.25)] sm:p-8">
        <JobForm action={createJob} submitLabel="Guardar oferta" cancelHref="/" />
      </div>
    </main>
  );
}
