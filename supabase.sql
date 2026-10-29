create table if not exists public.participaciones_vente (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 1 and 160),
  truco text not null default '' check (char_length(truco) <= 5000),
  participa text not null check (participa in ('¡Me apunto al reto!', 'Esta vez no participo.')),
  creado_en timestamptz not null default now()
);
alter table public.participaciones_vente enable row level security;
-- No se crean políticas de lectura ni escritura públicas.
-- Solo la función de servidor con service_role accede a los datos.
