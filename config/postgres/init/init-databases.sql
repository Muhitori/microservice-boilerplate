CREATE EXTENSION IF NOT EXISTS dblink;

DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'user_service') THEN
      PERFORM dblink_exec('dbname=' || current_database(), 'CREATE DATABASE user_service');
   END IF;
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'product_service') THEN
      PERFORM dblink_exec('dbname=' || current_database(), 'CREATE DATABASE product_service');
   END IF;
END
$$;