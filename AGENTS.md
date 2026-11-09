<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Availability checks use the authenticated get_calendar_block_ranges RPC, exposing only times, never private Google Calendar summaries.
- Validate complaint changes with the shared browser-safe schema so admin controls match the database fields and enum.
- Account passwords are managed through the Auth admin API after verifying administrator access; never put passwords in source, migrations, or reports.
- Scheduled-job key lives only in server-only table private_job_config (read by cron and assertCronRequest); never put it in code, migrations or env.
