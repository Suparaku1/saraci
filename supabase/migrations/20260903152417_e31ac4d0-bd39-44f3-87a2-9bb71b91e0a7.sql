SELECT cron.schedule('saraci-log-retention', '20 3 * * *', $$
  DELETE FROM public.calendar_sync_log WHERE created_at < now() - interval '14 days';
  DELETE FROM public.email_log WHERE status = 'sent' AND created_at < now() - interval '90 days';
  DELETE FROM public.error_log WHERE created_at < now() - interval '60 days';
$$);

DELETE FROM public.calendar_sync_log WHERE created_at < now() - interval '14 days';