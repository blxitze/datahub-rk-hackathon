#!/bin/bash

set -e

echo "Waiting for PostgreSQL..."
while ! python -c "import socket; socket.create_connection(('$POSTGRES_HOST', ${POSTGRES_PORT:-5432}))" 2>/dev/null; do
    sleep 1
done
echo "PostgreSQL is available"

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
