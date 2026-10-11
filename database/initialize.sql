CREATE DATABASE todo_db;

-- show all tables in the db;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name ASC;

DROP TABLE users;

SELECT * FROM "Ash_todos";
SELECT * FROM "ash_todos";

INSERT INTO "Ash_todos" (todo_name, completed) VALUES ('hotdog', False)

CREATE TABLE IF NOT EXISTS users (
    acc_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(30),
    email TEXT,
    password_hash TEXT
);

SELECT * FROM users ORDER BY acc_id ASC;