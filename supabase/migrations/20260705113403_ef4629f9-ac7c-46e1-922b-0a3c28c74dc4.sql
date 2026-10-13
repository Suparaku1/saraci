
-- Update clinic settings to real contact info
UPDATE public.clinic_settings SET value = '+355 67 540 2044' WHERE key = 'phone';
UPDATE public.clinic_settings SET value = 'xhensilasaraci@gmail.com' WHERE key = 'email';
UPDATE public.clinic_settings SET value = 'Rruga Ptoleme Xhuvani, Elbasan 3001' WHERE key = 'address';
UPDATE public.clinic_settings SET value = 'Xhensila Saraci: +355 67 540 2044' WHERE key = 'emergency_escalation';

-- Add CRM columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS clinical_notes text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS medical_history text,
  ADD COLUMN IF NOT EXISTS date_of_birth date;

-- Admins can update any profile (for CRM notes/tags)
DROP POLICY IF EXISTS "admin_write_all_profiles" ON public.profiles;
CREATE POLICY "admin_write_all_profiles" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add complaint status + priority + admin_notes
DO $$ BEGIN
  CREATE TYPE public.complaint_status AS ENUM ('open','in_progress','resolved','closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.complaints
  ADD COLUMN IF NOT EXISTS status public.complaint_status NOT NULL DEFAULT 'open',
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone NOT NULL DEFAULT now();

-- Add clinical_notes to appointments (doctor's post-visit notes)
ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS clinical_notes text;
