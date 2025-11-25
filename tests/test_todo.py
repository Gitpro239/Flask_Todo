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


# TEST: Get Task by ID
def test_get_task():
    payload = new_task_payload()
    create_res = requests.post(f"{BASE_URL}/create-task", json=payload)
    task_id = create_res.json()["id"]

    response = requests.get(f"{BASE_URL}/get-task/{task_id}")

    assert response.status_code == 200
    assert response.json()["id"] == task_id


# TEST: List All Tasks
def test_list_tasks():
    for _ in range(2):
        requests.post(f"{BASE_URL}/create-task", json=new_task_payload())

    response = requests.get(f"{BASE_URL}/list-tasks")
    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2  


# TEST: Update Task
def test_update_task():
    payload = new_task_payload()
    create_res = requests.post(f"{BASE_URL}/create-task", json=payload)
    task_id = create_res.json()["id"]

    updated_payload = {
        "title": "updated title",
        "is_completed": True
    }

    update_res = requests.put(f"{BASE_URL}/update-task/{task_id}", json=updated_payload)

    assert update_res.status_code == 200
    updated_data = update_res.json()

    assert updated_data["title"] == "updated title"
    assert updated_data["is_completed"] is True
    assert updated_data["description"] == payload["description"]


# TEST: Delete Task
def test_delete_task():
    payload = new_task_payload()
    create_res = requests.post(f"{BASE_URL}/create-task", json=payload)
    task_id = create_res.json()["id"]

    delete_res = requests.delete(f"{BASE_URL}/delete-task/{task_id}")
    assert delete_res.status_code == 200
    assert delete_res.json()["message"] == "Task deleted successfully"

    get_res = requests.get(f"{BASE_URL}/get-task/{task_id}")
    assert get_res.status_code == 404

