import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Verifica la sesión contra Supabase. Llamar desde cada página, Server Action
// o Route Handler que lea o escriba datos: el proxy solo hace una comprobación
// optimista y no sustituye a esta.
export const requireUser = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) redirect("/login");

  return { id: data.claims.sub, email: data.claims.email ?? "" };
});
