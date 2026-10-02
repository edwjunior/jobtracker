-- Esquema inicial de JobTracker.
-- Todas las tablas son privadas por usuario (RLS: user_id = auth.uid()).

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Fuentes del perfil: CV, LinkedIn y datos extra ------------------------------

create table public.profile_sources (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind           text not null check (kind in ('cv', 'linkedin', 'extra')),
  filename       text,
  storage_path   text,
  extracted_text text not null default '',
  created_at     timestamptz not null default now()
);

create index profile_sources_user_id_idx on public.profile_sources (user_id);

-- Contexto único del perfil (una fila por usuario) ----------------------------
-- sources_hash = hash del texto de las fuentes con el que se generó el contexto;
-- si no coincide con el actual, el contexto está obsoleto.

create table public.profile_context (
  user_id      uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  content      text not null default '',
  sources_hash text,
  status       text not null default 'stale' check (status in ('stale', 'generating', 'ready', 'failed')),
  model        text,
  generated_at timestamptz,
  updated_at   timestamptz not null default now()
);

create trigger profile_context_set_updated_at
  before update on public.profile_context
  for each row execute function public.set_updated_at();

-- Ofertas ---------------------------------------------------------------------

create table public.jobs (
  id                         uuid primary key default gen_random_uuid(),
  user_id                    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  empresa                    text not null,
  puesto                     text not null,
  ubicacion                  text not null default '',
  modalidad                  text not null default '',
  salario                    text not null default '',
  score                      smallint not null default 0 check (score between 0 and 100),
  estado                     text not null default 'guardada'
                               check (estado in ('guardada', 'en-curso', 'entrevista', 'completada', 'descartada')),
  motivo                     text not null default '',
  motivo_detalle             text not null default '',
  url                        text not null default '',
  descripcion                text not null default '',
  match                      text[] not null default '{}',
  gaps                       text[] not null default '{}',
  ventajas                   text[] not null default '{}',
  desventajas                text[] not null default '{}',
  notas                      text not null default '',
  rating                     text not null default '',
  investigacion              text not null default '',
  fuentes                    jsonb not null default '[]',
  analysis_status            text not null default 'none' check (analysis_status in ('none', 'running', 'done', 'failed')),
  analyzed_with_context_hash text,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now(),
  -- Descartar una oferta exige indicar el motivo.
  constraint jobs_descartada_requires_motivo check (estado <> 'descartada' or motivo <> '')
);

create index jobs_user_id_estado_idx on public.jobs (user_id, estado);

create trigger jobs_set_updated_at
  before update on public.jobs
  for each row execute function public.set_updated_at();

-- RLS ---------------------------------------------------------------------------

alter table public.profile_sources enable row level security;
alter table public.profile_context enable row level security;
alter table public.jobs enable row level security;

create policy "own rows" on public.profile_sources
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "own rows" on public.profile_context
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "own rows" on public.jobs
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Permisos de la Data API: solo usuarios autenticados (RLS limita a sus filas).
grant select, insert, update, delete on public.profile_sources, public.profile_context, public.jobs to authenticated;

-- Storage: bucket privado, un directorio por usuario (<user_id>/<fichero>) -------

insert into storage.buckets (id, name, public)
values ('profile-docs', 'profile-docs', false)
on conflict (id) do nothing;

create policy "own folder" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'profile-docs'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'profile-docs'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
