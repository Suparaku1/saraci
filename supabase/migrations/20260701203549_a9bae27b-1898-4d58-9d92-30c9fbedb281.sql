
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'user');
CREATE TYPE public.appointment_status AS ENUM ('booked', 'cancelled', 'rescheduled', 'completed', 'no_show');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  city TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_self_read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_self_write" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_self_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_self_read" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "admin_read_all_profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_manage_roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile + assign role on signup (admin email gets admin role)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, city)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'city', '')
  );
  IF NEW.email = 'elektroniksuparaku@gmail.com' THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
    UPDATE public.profiles SET full_name = 'Esmerald Suparaku', phone = '0692710558', city = 'Elbasan' WHERE id = NEW.id;
  ELSE
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Appointments (1-hour slots, uniqueness enforced)
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT NOT NULL UNIQUE DEFAULT ('SDC-' || upper(substr(md5(random()::text), 1, 8))),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_email TEXT,
  service TEXT,
  notes TEXT,
  slot_start TIMESTAMPTZ NOT NULL,
  status appointment_status NOT NULL DEFAULT 'booked',
  cancelled_reason TEXT,
  rescheduled_to UUID REFERENCES public.appointments(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Only one active booking per slot
CREATE UNIQUE INDEX appointments_active_slot_idx ON public.appointments(slot_start) WHERE status = 'booked';
CREATE INDEX appointments_user_idx ON public.appointments(user_id);
CREATE INDEX appointments_slot_idx ON public.appointments(slot_start);

GRANT SELECT, INSERT, UPDATE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "appt_own_read" ON public.appointments FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));
CREATE POLICY "appt_insert_own" ON public.appointments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "appt_update_own" ON public.appointments FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Validation: only Mon-Sat, whole hours 09:00-18:00 (last slot starts 18:00, ends 19:00)
CREATE OR REPLACE FUNCTION public.validate_appointment_slot()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  local_ts TIMESTAMP;
  hr INT;
  dow INT;
BEGIN
  local_ts := (NEW.slot_start AT TIME ZONE 'Europe/Tirane');
  hr := EXTRACT(HOUR FROM local_ts)::int;
  dow := EXTRACT(ISODOW FROM local_ts)::int; -- 1=Mon..7=Sun
  IF EXTRACT(MINUTE FROM local_ts) <> 0 OR EXTRACT(SECOND FROM local_ts) <> 0 THEN
    RAISE EXCEPTION 'Sloti duhet të jetë orë e plotë (p.sh. 10:00)';
  END IF;
  IF dow = 7 THEN
    RAISE EXCEPTION 'Klinika është e mbyllur të dielën';
  END IF;
  IF hr < 9 OR hr > 18 THEN
    RAISE EXCEPTION 'Orari është 09:00 - 19:00';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER appt_validate_slot BEFORE INSERT OR UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.validate_appointment_slot();

-- Appointment events (audit)
CREATE TABLE public.appointment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.appointment_events TO authenticated;
GRANT ALL ON public.appointment_events TO service_role;
ALTER TABLE public.appointment_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "appt_events_read_own" ON public.appointment_events FOR SELECT TO authenticated USING (
  EXISTS(SELECT 1 FROM public.appointments a WHERE a.id = appointment_id AND (a.user_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'staff')))
);
CREATE POLICY "appt_events_insert" ON public.appointment_events FOR INSERT TO authenticated WITH CHECK (true);

-- Chat sessions & messages
CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Bisedë e re',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX chat_sessions_user_idx ON public.chat_sessions(user_id, updated_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_sessions TO authenticated;
GRANT ALL ON public.chat_sessions TO service_role;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chat_sessions_own" ON public.chat_sessions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system','tool')),
  content TEXT NOT NULL,
  intent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX chat_messages_session_idx ON public.chat_messages(session_id, created_at);
GRANT SELECT, INSERT ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chat_messages_own" ON public.chat_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "chat_messages_insert_own" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Voice sessions (log)
CREATE TABLE public.voice_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE SET NULL,
  transcript TEXT NOT NULL,
  reply TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.voice_transcripts TO authenticated;
GRANT ALL ON public.voice_transcripts TO service_role;
ALTER TABLE public.voice_transcripts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "voice_own" ON public.voice_transcripts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "voice_insert_own" ON public.voice_transcripts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Clinic settings (public + private)
CREATE TABLE public.clinic_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.clinic_settings TO anon, authenticated;
GRANT ALL ON public.clinic_settings TO service_role;
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_public_read" ON public.clinic_settings FOR SELECT USING (is_public = true);
CREATE POLICY "settings_admin_read_all" ON public.clinic_settings FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "settings_admin_write" ON public.clinic_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Seed clinic settings
INSERT INTO public.clinic_settings(key, value, is_public, description) VALUES
  ('clinic_name', 'Saraci Dental Clinic', true, 'Emri i klinikës'),
  ('address', 'Rruga Ptoleme Xhuvani, Elbasan, Shqipëri', true, 'Adresa'),
  ('phone', '0692710558', true, 'Telefoni'),
  ('email', 'elektroniksuparaku@gmail.com', true, 'Email'),
  ('dentist', 'Xhensila Saraci', true, 'Dentisti kryesor'),
  ('owner', 'Xhensila Saraci', true, 'Pronari i klinikës'),
  ('working_hours', 'E hënë - E shtunë, 09:00 - 19:00. E diela e mbyllur.', true, 'Orari'),
  ('parking', 'Po, parking falas pranë klinikës', true, 'Parking'),
  ('toilet', 'Po, tualet i disponueshëm për pacientët', true, 'Tualet'),
  ('accessibility', 'Klinika është e aksesueshme për persona me aftësi ndryshe', true, 'Aksesueshmëri'),
  ('payment_methods', 'Cash, kartë debiti/krediti, transfertë bankare', true, 'Mënyra pagese'),
  ('emergency_number', '127', true, 'Numri i urgjencës'),
  ('wifi_password', 'SaraciDental2026', false, 'Fjalëkalimi i Wi-Fi (privat)'),
  ('internal_notes', 'Prioriteti maksimal për urgjencat.', false, 'Shënime të brendshme'),
  ('emergency_escalation', 'Xhensila Saraci: 0692710558', false, 'Kontakt urgjence i stafit');

-- FAQ
CREATE TABLE public.clinic_faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.clinic_faq TO anon, authenticated;
GRANT ALL ON public.clinic_faq TO service_role;
ALTER TABLE public.clinic_faq ENABLE ROW LEVEL SECURITY;
CREATE POLICY "faq_public_read" ON public.clinic_faq FOR SELECT USING (true);
CREATE POLICY "faq_admin_write" ON public.clinic_faq FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
INSERT INTO public.clinic_faq(question, answer, sort_order) VALUES
  ('Sa zgjat një vizitë?', 'Çdo termin zgjat rreth 1 orë.', 1),
  ('A pranoni pagesa me kartë?', 'Po, pranojmë cash, kartë debiti/krediti dhe transfertë bankare.', 2),
  ('A ka parking?', 'Po, ka parking falas pranë klinikës.', 3),
  ('Sa kushton një zbardhim profesional?', 'Çmimi varet nga metoda. Kontaktoni në 0692710558 për ofertë të saktë.', 4),
  ('Çfarë të bëj në rast urgjence?', 'Në rast dhimbjeje të fortë, ënjtjeje, temperaturë, gjakderdhjeje ose vështirësie në frymëmarrje telefononi 127 menjëherë.', 5);

-- Services catalog
CREATE TABLE public.service_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_hint TEXT,
  duration_minutes INT NOT NULL DEFAULT 60,
  active BOOLEAN NOT NULL DEFAULT true
);
GRANT SELECT ON public.service_catalog TO anon, authenticated;
GRANT ALL ON public.service_catalog TO service_role;
ALTER TABLE public.service_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "svc_public_read" ON public.service_catalog FOR SELECT USING (active = true);
CREATE POLICY "svc_admin_write" ON public.service_catalog FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
INSERT INTO public.service_catalog(name, description, price_hint) VALUES
  ('Kontroll i përgjithshëm', 'Kontroll dhe konsultë fillestare', 'Nga 1500 LEK'),
  ('Pastrim profesional', 'Heqja e gurëzës me ultratinguj', 'Nga 3000 LEK'),
  ('Zbardhim profesional', 'Zbardhim me llambë LED', 'Sipas metodës'),
  ('Mbushje kompozite', 'Mbushje estetike', 'Nga 3500 LEK'),
  ('Endodonci (kanal rrënjor)', 'Trajtim endodontik', 'Nga 8000 LEK'),
  ('Implant dentar', 'Vendosje implanti', 'Konsultë e nevojshme'),
  ('Ortodonci', 'Aparat fiks/mobil', 'Konsultë e nevojshme'),
  ('Urgjenca dentare', 'Dhimbje akute, thyerje, absces', 'Prioritet i lartë');

-- Complaints
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  contact TEXT,
  resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.complaints TO authenticated;
GRANT ALL ON public.complaints TO service_role;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "complaints_own_read" ON public.complaints FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "complaints_insert_own" ON public.complaints FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "complaints_admin_update" ON public.complaints FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Email log (stub, real SMTP integration later)
CREATE TABLE public.email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  related_appointment UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.email_log TO authenticated;
GRANT ALL ON public.email_log TO service_role;
ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "email_admin_read" ON public.email_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "email_insert_any" ON public.email_log FOR INSERT TO authenticated WITH CHECK (true);

-- Audit log
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT,
  entity_id TEXT,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_admin_read" ON public.audit_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "audit_insert_any" ON public.audit_log FOR INSERT TO authenticated WITH CHECK (true);
