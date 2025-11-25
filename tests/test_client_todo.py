import sys
from pathlib import Path
from flask.testing import FlaskClient

sys.path.insert(0, str(Path(__file__).parent.parent))

from app import app

client = FlaskClient(app)


# CREATE (POST)
def test_create_todo():
    payload = {
        "title": "Learn FastAPI",
        "description": "Study FastAPI basics",
        "completed": False
    }
    response = client.post("/create-task", json=payload)

    assert response.status_code == 201
    data = response.json

    assert data["title"] == payload["title"]
    assert data["description"] == payload["description"]
    assert data["is_completed"] is False


# READ ALL (GET)
def test_get_all_todos():
    response = client.get("/list-tasks")
    assert response.status_code == 200
    assert isinstance(response.json, list)


# READ ONE (GET/{id})
def test_get_single_todo():
    payload = {"title": "Task A", "description": "Details", "completed": False}
    res = client.post("/create-task", json=payload)
    todo_id = res.json["id"]

    response = client.get(f"/get-task/{todo_id}")

    assert response.status_code == 200
    assert response.json["id"] == todo_id


# UPDATE (PUT)
def test_update_todo():
    payload = {"title": "Old Title", "description": "Old desc", "completed": False}
    res = client.post("/create-task", json=payload)
    todo_id = res.json["id"]

    update_payload = {"title": "New Title", "completed": True}
    response = client.put(f"/update-task/{todo_id}", json=update_payload)

    assert response.status_code == 200
    data = response.json

    assert data["title"] == "New Title"
    assert data["is_completed"] is False


# DELETE (DELETE/{id})
def test_delete_todo():
    payload = {"title": "Remove me", "description": "Testing delete", "completed": False}
    res = client.post("/create-task", json=payload)
    todo_id = res.json["id"]

    response = client.delete(f"/delete-task/{todo_id}")

    assert response.status_code == 200
    assert response.json["message"] == "Task deleted successfully"
