CREATE TABLE public.private_job_config (key text PRIMARY KEY, value text NOT NULL);
REVOKE ALL ON public.private_job_config FROM anon, authenticated;
GRANT ALL ON public.private_job_config TO service_role;
ALTER TABLE public.private_job_config ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.private_job_config IS 'Server-only config for scheduled jobs; no client access.';