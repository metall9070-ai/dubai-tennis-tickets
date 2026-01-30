#!/bin/bash
set -e

echo "========== START.SH BEGINNING =========="

cd /app/backend

export DJANGO_SETTINGS_MODULE=tennis_backend.settings

echo "[START] Running migrations..."
python manage.py migrate --noinput

echo "[START] Creating superuser..."
python manage.py create_superuser_from_env

echo "[START] Starting gunicorn..."
exec python -m gunicorn tennis_backend.wsgi:application --bind 0.0.0.0:$PORT --workers 1 --threads 1 --timeout 120
