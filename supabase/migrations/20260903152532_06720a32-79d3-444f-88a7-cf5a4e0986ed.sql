-- lovable-cron-fallback-reviewed: 1440 runs/day; radhë emailesh me riprova që ekziston prej më parë, ndryshon vetëm autentikimi
SELECT cron.schedule('saraci-process-emails', '* * * * *', $$
  SELECT net.http_post(
    url := 'https://project--2e444348-10e9-4c67-9ac6-68654f73001a.lovable.app/api/public/hooks/process-emails',
    headers := '{"Content-Type": "application/json", "x-cron-secret": "5fdd85e58b7b0775b1866cb2d4a3084cd1935ccf0b1a814e"}'::jsonb,
    body := '{}'::jsonb
  );
$$);