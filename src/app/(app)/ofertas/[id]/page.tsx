import { notFound } from "next/navigation";
import { JobDetail } from "@/components/job-detail";
import { requireUser } from "@/lib/auth";
import { compareJobs, type Job } from "@/lib/jobs";
import { createClient } from "@/lib/supabase/server";

export default async function OfertaPage({ params }: PageProps<"/ofertas/[id]">) {
  const { id } = await params;
  await requireUser();

  const supabase = await createClient();
  const [{ data }, { data: all }] = await Promise.all([
    supabase.from("jobs").select("*").eq("id", id).maybeSingle(),
    supabase.from("jobs").select("id, score, empresa"),
  ]);
  if (!data) notFound();

  const ranking = [...(all ?? [])].sort(compareJobs);
  const index = ranking.findIndex((j) => j.id === id);

  return (
    <JobDetail
      job={data as Job}
      prevId={index > 0 ? ranking[index - 1].id : null}
      nextId={index >= 0 && index < ranking.length - 1 ? ranking[index + 1].id : null}
      position={index + 1}
      total={ranking.length}
    />
  );
}
