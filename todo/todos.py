from flask import Blueprint, render_template, request, redirect, url_for, jsonify
from todo.models import Task
from todo.database import db

todos_bp = Blueprint('todos', __name__, url_prefix='/api')

@todos_bp.route('/tasks')
def index():
    tasks = Task.query.all()
    return render_template('index.html', tasks=tasks)

@todos_bp.route('/list-tasks', methods=['GET'])
def list_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])


@todos_bp.route('/get-task/<int:id>', methods=['GET'])
def get_task(id):
    task = Task.query.get_or_404(id)
    return jsonify(task.to_dict())


@todos_bp.route('/create-task', methods=['POST'])
def create_task():
    title = request.form['title']
    description = request.form['description']
    task = Task(title=title, description=description)
    db.session.add(task)
    db.session.commit()
    return redirect(url_for('todo.index'))


@todos_bp.route('/update-task/<int:id>', methods=['GET', 'POST'])
def update_task(id):
    task = Task.query.get_or_404(id)
    if request.method == 'POST':
        task.title = request.form['title']
        task.description = request.form['description']
        task.is_completed = 'is_completed' in request.form
        db.session.commit()
        return redirect(url_for('todo.index'))
    return render_template('edit.html', task=task)

@todos_bp.route('/delete-task/<int:id>')
def delete_task(id):
    task = Task.query.get_or_404(id)
    db.session.delete(task)
    db.session.commit()
    return redirect(url_for('todo.index'))