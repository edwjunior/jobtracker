# jobtracker
Dashboard para evaluar y hacer seguimiento de ofertas de empleo: analiza compatibilidad con tu perfil, organiza candidaturas por fases (Guardada → En curso → Entrevista → Completada/Descartada) y centraliza investigación de empresas. Versión web con backend, migrada desde un prototipo HTML estático.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com) v4
- [Supabase](https://supabase.com) (`@supabase/ssr`)
- Despliegue en [Vercel](https://vercel.com)

## Desarrollo local

```bash
pnpm install
cp .env.example .env.local   # rellena con los datos de tu proyecto Supabase
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Supabase

Los clientes están en `src/lib/supabase/`:

- `client.ts` — para Client Components (`"use client"`).
- `server.ts` — para Server Components, Server Actions y Route Handlers.
- `proxy.ts` — refresca la sesión en cada petición (lo usa `src/proxy.ts`).

Variables necesarias (Supabase → Project Settings → API):

| Variable | Descripción |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clave publishable (o `anon`) |

### Preparar el proyecto Supabase

1. Aplica `supabase/migrations/20261002000000_init.sql` (SQL Editor del panel, o `supabase db push` con la CLI). Crea las tablas, las políticas RLS y el bucket privado `profile-docs`.
2. *Authentication → Providers → Email*: desactiva **Allow new users to sign up** (la app es de un solo usuario).
3. *Authentication → Users → Add user*: crea tu cuenta con email y contraseña. Con esas credenciales entras en `/login`.

## Despliegue en Vercel

1. Importa el repositorio en [vercel.com/new](https://vercel.com/new) (detecta Next.js automáticamente).
2. Añade las variables de entorno anteriores en *Settings → Environment Variables*
   (o usa la integración de Supabase del Marketplace de Vercel, que las configura sola).
3. Cada push a `main` despliega a producción; cada PR genera un preview.
