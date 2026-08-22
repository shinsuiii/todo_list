CREATE DATABASE todo_db;

TRUNCATE TABLE todo_list;

SELECT * FROM users ORDER BY acc_id ASC;
DELETE FROM users WHERE acc_id = 1;

SELECT * FROM todo_list ORDER BY todo_id ASC;
SELECT * FROM todo_list WHERE todo_name = 'Oliviaaa';

DELETE FROM todo_list WHERE todo_id = 1;

INSERT INTO todo_list VALUES (1, 'Buy groceries', FALSE);
INSERT INTO todo_list VALUES (2, 'Cook rice', FALSE);
INSERT INTO todo_list VALUES (3, 'Wash dishes', FALSE);