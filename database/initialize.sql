CREATE DATABASE todo_db;

DROP TABLE users;
CREATE TABLE IF NOT EXISTS users (
    acc_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(30),
    email TEXT,
    password_hash TEXT
);


TRUNCATE TABLE todo_list;

SELECT * FROM users ORDER BY acc_id ASC;