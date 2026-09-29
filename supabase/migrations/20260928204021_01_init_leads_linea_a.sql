CREATE TABLE public.leads_linea_a (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    comercio_id TEXT NOT NULL DEFAULT 'demo_barberia',
    cliente_nombre TEXT NOT NULL,
    cliente_telefono TEXT NOT NULL,
    servicio_deseado TEXT NOT NULL,
    preferencia_horaria TEXT NOT NULL,
    estado TEXT DEFAULT 'pendiente_confirmacion'
);

ALTER TABLE public.leads_linea_a ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir inserts desde Make (Service Role)"
ON public.leads_linea_a FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Lectura solo admin (Service Role)"
ON public.leads_linea_a FOR SELECT TO service_role USING (true);
