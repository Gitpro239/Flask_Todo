from conftest import *


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