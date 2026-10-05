import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Sin variables de entorno (p. ej. antes de crear .env.local) no hay sesión que refrescar.
  if (
    !process.env.SUPABASE_URL ||
    !process.env.SUPABASE_PUBLISHABLE_KEY
  ) {
    return response;
  }

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // No ejecutar código entre createServerClient y getClaims():
  // refresca el token de sesión si ha caducado.
  const { data } = await supabase.auth.getClaims();

  // Comprobación optimista: la autorización real se verifica en cada
  // página y Server Action con requireUser() (src/lib/auth.ts).
  const isLoginRoute = request.nextUrl.pathname.startsWith("/login");
  const target = !data?.claims && !isLoginRoute ? "/login" : data?.claims && isLoginRoute ? "/" : null;

  if (target) {
    const redirect = NextResponse.redirect(new URL(target, request.url));
    // Conservar las cookies de sesión refrescadas.
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  return response;
}
