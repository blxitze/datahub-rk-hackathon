#!/bin/bash

set -e

# Debug: Print database connection info
if [ -n "$DATABASE_URL" ]; then
    echo "Using DATABASE_URL for database connection"
else
    echo "Database config: HOST=${POSTGRES_HOST:-not set}, PORT=${POSTGRES_PORT:-5432}, DB=${POSTGRES_DB:-not set}"
fi

# Wait for PostgreSQL if we have connection info
if [ -n "$DATABASE_URL" ]; then
    # Extract host and port from DATABASE_URL
    DB_HOST=$(echo $DATABASE_URL | sed -e 's/.*@//' -e 's/:.*//' -e 's/\/.*//')
    DB_PORT=$(echo $DATABASE_URL | sed -e 's/.*@[^:]*://' -e 's/\/.*//' | grep -E '^[0-9]+$' || echo "5432")
    
    echo "Waiting for PostgreSQL at ${DB_HOST}:${DB_PORT}..."
    MAX_RETRIES=30
    RETRY_COUNT=0
    while ! python -c "import socket; socket.create_connection(('$DB_HOST', $DB_PORT))" 2>/dev/null; do
        RETRY_COUNT=$((RETRY_COUNT + 1))
        if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
            echo "Warning: PostgreSQL not available after $MAX_RETRIES attempts, proceeding anyway..."
            break
        fi
        echo "Waiting for PostgreSQL... (attempt $RETRY_COUNT/$MAX_RETRIES)"
        sleep 2
    done
    echo "PostgreSQL check complete"
elif [ -n "$POSTGRES_HOST" ]; then
    echo "Waiting for PostgreSQL at ${POSTGRES_HOST}:${POSTGRES_PORT:-5432}..."
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
else
    echo "No database connection info, skipping wait"
fi

echo "Running migrations..."
python manage.py migrate --noinput || echo "Migration failed, will retry on next deploy"

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Seeding data..."
python manage.py seed_data || echo "Seeding skipped (data may already exist)"

echo "Creating superuser if not exists..."
python manage.py shell << 'EOF' || echo "Superuser creation skipped"
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superuser created')
else:
    print('Superuser already exists')
EOF

echo "Starting server on port 8000..."
exec "$@"
