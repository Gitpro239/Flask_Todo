from conftest import *

# TEST: Get Task by ID
def test_get_task():
    payload = new_task_payload()
    create_res = requests.post(f"{BASE_URL}/create-task", json=payload)
    task_id = create_res.json()["id"]

    response = requests.get(f"{BASE_URL}/get-task/{task_id}")

    assert response.status_code == 200
    assert response.json()["id"] == task_id