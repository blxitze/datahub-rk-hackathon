#!/bin/bash

set -e

echo "Waiting for PostgreSQL..."
MAX_RETRIES=30
RETRY_COUNT=0
while ! python -c "import socket; socket.create_connection(('$POSTGRES_HOST', ${POSTGRES_PORT:-5432}))" 2>/dev/null; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "Warning: PostgreSQL not available after $MAX_RETRIES attempts, proceeding anyway..."
        break
    fi
    echo "Waiting for PostgreSQL... (attempt $RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done
echo "PostgreSQL check complete"

echo "Making migrations for universities app..."
python manage.py makemigrations universities --noinput

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Seeding data..."
python manage.py seed_data

echo "Creating superuser if not exists..."
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superuser created')
else:
    print('Superuser already exists')
EOF

echo "Starting server..."
exec "$@"
