from flask import Flask
from flask_cors import CORS
from todo.database import db
from todo.routes import todo_bp
from todo.todos import todos_bp

import os
from dotenv import load_dotenv

load_dotenv()  # Load .env file

app = Flask(__name__)

CORS(app)  # enable CORS for local frontend integration

## MySQL configuration
host = os.getenv('HOST')
user = os.getenv('USER')
password = os.getenv('PASSWORD')
database = os.getenv('DATABASE')

print(f"MySQL host: {host}, user: {user}, database: {database}") 

# app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{user}:{password}@{host}/{database}"
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

## SQLite configuration
database_url = os.getenv('DATABASE_URL')

app.config['SQLALCHEMY_DATABASE_URI'] = f'{database_url}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(todo_bp)
app.register_blueprint(todos_bp)


@app.get("/")
def read_root():
    return {"message": "Todo API is running", "version": "1.0.0"}

if __name__ == '__main__':
    app.run(debug=True)
