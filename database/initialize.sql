CREATE DATABASE todo_db;

CREATE TABLE task (
    task_id INT PRIMARY KEY,
    task_name TEXT,
    completed BOOLEAN NOT NULL
);