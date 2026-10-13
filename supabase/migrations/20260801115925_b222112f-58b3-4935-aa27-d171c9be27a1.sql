ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS gcal_event_id TEXT;

CREATE TABLE public.calendar_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gcal_event_id TEXT NOT NULL UNIQUE,
  summary TEXT,
  start_ts TIMESTAMPTZ NOT NULL,
  end_ts TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.calendar_blocks TO authenticated;
GRANT ALL ON public.calendar_blocks TO service_role;
ALTER TABLE public.calendar_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read calendar blocks" ON public.calendar_blocks
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage calendar blocks" ON public.calendar_blocks
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX idx_calendar_blocks_range ON public.calendar_blocks (start_ts, end_ts);

CREATE TABLE public.calendar_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  direction TEXT NOT NULL,
  action TEXT NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  gcal_event_id TEXT,
  ok BOOLEAN NOT NULL DEFAULT true,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.calendar_sync_log TO authenticated;
GRANT ALL ON public.calendar_sync_log TO service_role;
ALTER TABLE public.calendar_sync_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read calendar sync log" ON public.calendar_sync_log
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write calendar sync log" ON public.calendar_sync_log
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));