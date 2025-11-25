from conftest import *

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