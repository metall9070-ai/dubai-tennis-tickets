from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'
    verbose_name = 'User Management'

    def ready(self):
        """Create admin superuser on first startup if not exists."""
        from django.db.utils import OperationalError, ProgrammingError

        try:
            from django.contrib.auth import get_user_model
            User = get_user_model()

            if not User.objects.filter(username='admin').exists():
                User.objects.create_superuser(
                    username='admin',
                    email='admin@dubaitennistickets.com',
                    password='wt3652026!'
                )
        except (OperationalError, ProgrammingError):
            # Database not ready yet - skip silently
            pass
        except Exception:
            # Any other error - skip silently to not break startup
            pass
