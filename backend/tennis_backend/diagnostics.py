"""
Temporary production diagnostics.
DELETE THIS FILE after confirming production sync.

Endpoints:
- /__version__/ - Returns deployment info, model fields, DB schema, migrations
"""

import subprocess
import json
from django.http import JsonResponse
from django.db import connection
from django.db.migrations.recorder import MigrationRecorder


def get_git_commit():
    """Get current git commit hash."""
    try:
        result = subprocess.run(
            ['git', 'rev-parse', 'HEAD'],
            capture_output=True,
            text=True,
            timeout=5
        )
        return result.stdout.strip()[:12] if result.returncode == 0 else "unknown"
    except Exception as e:
        return f"error: {e}"


def get_model_fields():
    """Get Category model fields from Django ORM."""
    try:
        from events.models import Category
        fields = [f.name for f in Category._meta.get_fields()]
        has_show_on_frontend = 'show_on_frontend' in fields
        return {
            'fields': fields,
            'has_show_on_frontend': has_show_on_frontend,
        }
    except Exception as e:
        return {'error': str(e)}


def get_db_schema():
    """Get actual DB columns for events_category table."""
    try:
        with connection.cursor() as cursor:
            # Works for both SQLite and PostgreSQL
            if connection.vendor == 'postgresql':
                cursor.execute("""
                    SELECT column_name
                    FROM information_schema.columns
                    WHERE table_name = 'events_category'
                    ORDER BY ordinal_position
                """)
            else:  # SQLite
                cursor.execute("PRAGMA table_info(events_category)")
                # SQLite returns (cid, name, type, notnull, dflt_value, pk)
                columns = cursor.fetchall()
                return {
                    'columns': [col[1] for col in columns],
                    'has_show_on_frontend': any(col[1] == 'show_on_frontend' for col in columns),
                    'vendor': connection.vendor,
                }

            columns = [row[0] for row in cursor.fetchall()]
            return {
                'columns': columns,
                'has_show_on_frontend': 'show_on_frontend' in columns,
                'vendor': connection.vendor,
            }
    except Exception as e:
        return {'error': str(e), 'vendor': connection.vendor}


def get_migrations_state():
    """Get applied migrations for events app."""
    try:
        recorder = MigrationRecorder(connection)
        applied = recorder.applied_migrations()

        # Filter to events app
        events_migrations = sorted([
            name for (app, name) in applied if app == 'events'
        ])

        # Check for specific critical migration
        has_0002 = '0002_add_show_on_frontend_to_category' in events_migrations
        has_0003 = '0003_add_slug_to_tournament_and_event' in events_migrations

        return {
            'applied': events_migrations,
            'has_0002_show_on_frontend': has_0002,
            'has_0003_slug': has_0003,
        }
    except Exception as e:
        return {'error': str(e)}


def version_view(request):
    """
    Diagnostic endpoint to verify production state.

    Returns:
    - git_commit: Current deployed commit
    - model_fields: Django ORM fields for Category
    - db_schema: Actual PostgreSQL/SQLite columns
    - migrations: Applied migrations for events app
    """
    data = {
        'git_commit': get_git_commit(),
        'model_fields': get_model_fields(),
        'db_schema': get_db_schema(),
        'migrations': get_migrations_state(),
        'diagnosis': None,
    }

    # Auto-diagnose the issue
    model_has_field = data['model_fields'].get('has_show_on_frontend', False)
    db_has_column = data['db_schema'].get('has_show_on_frontend', False)
    migration_applied = data['migrations'].get('has_0002_show_on_frontend', False)

    if model_has_field and db_has_column and migration_applied:
        data['diagnosis'] = "OK: Model, DB, and migrations are in sync"
    elif model_has_field and not db_has_column:
        data['diagnosis'] = "MISMATCH: Model has field but DB missing column - migration not applied"
    elif not model_has_field and db_has_column:
        data['diagnosis'] = "MISMATCH: DB has column but model missing field - code outdated"
    elif model_has_field and db_has_column and not migration_applied:
        data['diagnosis'] = "WARNING: Field exists but migration not recorded - possible manual fix"
    else:
        data['diagnosis'] = "UNKNOWN: Check details above"

    return JsonResponse(data, json_dumps_params={'indent': 2})


def log_diagnostics_on_startup():
    """
    Log diagnostic info at startup.
    Call this from events/apps.py ready() method.
    """
    print("\n" + "=" * 60)
    print("[DIAGNOSTICS] Production Sync Check")
    print("=" * 60)

    print(f"[DIAGNOSTICS] Git commit: {get_git_commit()}")

    model_info = get_model_fields()
    print(f"[DIAGNOSTICS] Model has show_on_frontend: {model_info.get('has_show_on_frontend', 'ERROR')}")

    db_info = get_db_schema()
    print(f"[DIAGNOSTICS] DB vendor: {db_info.get('vendor', 'unknown')}")
    print(f"[DIAGNOSTICS] DB has show_on_frontend column: {db_info.get('has_show_on_frontend', 'ERROR')}")
    print(f"[DIAGNOSTICS] DB columns: {db_info.get('columns', 'ERROR')}")

    migrations_info = get_migrations_state()
    print(f"[DIAGNOSTICS] Applied events migrations: {migrations_info.get('applied', 'ERROR')}")
    print(f"[DIAGNOSTICS] 0002_show_on_frontend applied: {migrations_info.get('has_0002_show_on_frontend', 'ERROR')}")

    print("=" * 60 + "\n")
