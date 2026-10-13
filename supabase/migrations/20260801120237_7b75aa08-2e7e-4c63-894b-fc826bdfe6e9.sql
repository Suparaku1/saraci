SELECT cron.schedule(
  'saraci-calendar-sync',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://project--2e444348-10e9-4c67-9ac6-68654f73001a.lovable.app/api/public/hooks/calendar-sync',
    headers := '{"Content-Type": "application/json", "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94Y3B4b3RtdWVnb3ZndG1ldGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MjgxNDMsImV4cCI6MjA5ODUwNDE0M30.HN5bEJJdE170I2mYW3tWr-B-VlXt_-jAKTnJcEOrLOo"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);