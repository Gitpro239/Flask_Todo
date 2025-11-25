from flask import Blueprint, request, jsonify
from todo.models import Task
from todo.database import db

todo_bp = Blueprint("todo", __name__, url_prefix='')

# GET ALL TASKS
@todo_bp.route("/list-tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([t.to_dict() for t in tasks]), 200


# GET TASK BY ID
@todo_bp.route("/get-task/<int:id>", methods=["GET"])
def get_task(id):
    task = Task.query.get_or_404(id)
    return jsonify(task.to_dict()), 200


# CREATE TASK
@todo_bp.route("/create-task", methods=["POST"])
def create_task():
    data = request.json

    task = Task(
        title=data["title"],
        description=data.get("description", ""),
        is_completed=data.get("is_completed", False),
    )

    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_dict()), 201


# UPDATE TASK
@todo_bp.route("/update-task/<int:id>", methods=["PUT"])
def update_task(id):
    task = Task.query.get_or_404(id)
    data = request.json

    task.title = data.get("title", task.title)
    task.description = data.get("description", task.description)
    task.is_completed = data.get("is_completed", task.is_completed)

    db.session.commit()

    return jsonify(task.to_dict()), 200


# DELETE TASK
@todo_bp.route("/delete-task/<int:id>", methods=["DELETE"])
def delete_task(id):
    task = Task.query.get_or_404(id)

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted successfully"}), 200
