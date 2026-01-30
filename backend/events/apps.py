from django.apps import AppConfig


class EventsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'events'
    verbose_name = 'Events & Tickets'

    def ready(self):
        """
        Run diagnostics at startup.
        DELETE this method after production sync confirmed.
        """
        import os
        # Only run diagnostics once (not in autoreloader child process)
        if os.environ.get('RUN_MAIN') != 'true':
            try:
                from tennis_backend.diagnostics import log_diagnostics_on_startup
                log_diagnostics_on_startup()
            except Exception as e:
                print(f"[DIAGNOSTICS] Failed to run: {e}")
