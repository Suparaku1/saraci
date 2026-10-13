
-- Fix search_path on trigger function
CREATE OR REPLACE FUNCTION public.validate_appointment_slot()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  local_ts TIMESTAMP;
  hr INT;
  dow INT;
BEGIN
  local_ts := (NEW.slot_start AT TIME ZONE 'Europe/Tirane');
  hr := EXTRACT(HOUR FROM local_ts)::int;
  dow := EXTRACT(ISODOW FROM local_ts)::int;
  IF EXTRACT(MINUTE FROM local_ts) <> 0 OR EXTRACT(SECOND FROM local_ts) <> 0 THEN
    RAISE EXCEPTION 'Sloti duhet të jetë orë e plotë';
  END IF;
  IF dow = 7 THEN RAISE EXCEPTION 'Klinika është e mbyllur të dielën'; END IF;
  IF hr < 9 OR hr > 18 THEN RAISE EXCEPTION 'Orari është 09:00 - 19:00'; END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Restrict SECURITY DEFINER execution
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Tighten permissive insert policies
DROP POLICY IF EXISTS "appt_events_insert" ON public.appointment_events;
CREATE POLICY "appt_events_insert" ON public.appointment_events FOR INSERT TO authenticated WITH CHECK (
  user_id = auth.uid() OR EXISTS(SELECT 1 FROM public.appointments a WHERE a.id = appointment_id AND a.user_id = auth.uid())
);

DROP POLICY IF EXISTS "email_insert_any" ON public.email_log;
CREATE POLICY "email_insert_own" ON public.email_log FOR INSERT TO authenticated WITH CHECK (
  related_appointment IS NULL OR EXISTS(SELECT 1 FROM public.appointments a WHERE a.id = related_appointment AND (a.user_id = auth.uid() OR public.has_role(auth.uid(),'admin')))
);

DROP POLICY IF EXISTS "audit_insert_any" ON public.audit_log;
CREATE POLICY "audit_insert_own" ON public.audit_log FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
