import psycopg # type: ignore



def insert_task():
    connection = psycopg.connect(
        dbname="todo_db",
        user="postgres",
        password="shanejoey21",
        host="localhost",
        port="5432"
    )

    with connection.cursor() as cursor:
        cursor.execute()