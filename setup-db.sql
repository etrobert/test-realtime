-- Database setup for counter app
CREATE DATABASE counter_app;

-- Connect to the database and create the table
\c counter_app;

CREATE TABLE IF NOT EXISTS counter (
    id SERIAL PRIMARY KEY,
    value INTEGER NOT NULL DEFAULT 0
);

-- Insert initial counter value
INSERT INTO counter (value) VALUES (0);