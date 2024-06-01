from flask import Flask, request, jsonify, render_template
from flask_restful import Resource, Api
import psycopg2

app = Flask(__name__)
api = Api(app)

def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="todos_db",
        user="postgres",
        password="deepak",
        port='5432'
    )
    return conn

class TodoList(Resource):
    def get(self):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM todos;')
        todos = cur.fetchall()
        cur.close()
        conn.close()

        return jsonify(todos)

    def post(self):
        new_task = request.json['task']
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('INSERT INTO todos (task) VALUES (%s) RETURNING id;', (new_task,))
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({'id': new_id, 'task': new_task})

class TodoItem(Resource):
    def put(self, todo_id):
        updated_task = request.json['task']
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('UPDATE todos SET task = %s WHERE id = %s;', (updated_task, todo_id))
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({'id': todo_id, 'task': updated_task})

    def delete(self, todo_id):
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('DELETE FROM todos WHERE id = %s;', (todo_id,))
        conn.commit()
        cur.close()
        conn.close()

        return '', 204

api.add_resource(TodoList, '/todos')
api.add_resource(TodoItem, '/todos/<int:todo_id>')

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
