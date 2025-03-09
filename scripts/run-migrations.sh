#!/bin/sh

echo "Waiting for database to be ready..."

while ! nc -z postgres 5432; do
    echo "Postgres is unavailable - sleeping"
    sleep 1
done

echo "Database is ready! Running migrations..."

cd /usr/src/app

if [ "$SERVICE_NAME" = "user-service" ]; then
    echo "Running User Service migrations..."
    npm run migration:run
fi

if [ "$SERVICE_NAME" = "product-service" ]; then
    echo "Running Product Service migrations..."
    npm run migration:run
fi

echo "Migrations completed!"

exec "$@"