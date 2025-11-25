import requests
import uuid

BASE_URL = "http://127.0.0.1:5000"


def new_task_payload():
    """Generate unique payload for each test."""
    return {
        "title": f"task_{uuid.uuid4().hex}",
        "description": f"description_{uuid.uuid4().hex}",
        "is_completed": False,
    }


# TEST: Create Task
def test_create_task():
    payload = new_task_payload()
    response = requests.post(f"{BASE_URL}/create-task", json=payload)

    assert response.status_code == 201

    data = response.json()
    assert data["title"] == payload["title"]
    assert data["description"] == payload["description"]
    assert data["is_completed"] == False
    assert "id" in data