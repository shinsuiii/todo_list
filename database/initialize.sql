CREATE DATABASE todo_db;

-- show all tables in the db;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

DROP TABLE users;

CREATE TABLE IF NOT EXISTS users (
    acc_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(30),
    email TEXT,
    password_hash TEXT
);


TRUNCATE TABLE todo_list;

SELECT * FROM users ORDER BY acc_id ASC;