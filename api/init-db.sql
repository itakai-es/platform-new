-- Create production database if it doesn't exist
SELECT 'CREATE DATABASE itakai_prod'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'itakai_prod')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE itakai_dev TO itakai;
GRANT ALL PRIVILEGES ON DATABASE itakai_prod TO itakai;
