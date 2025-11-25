from conftest import *


# TEST: List All Tasks
def test_list_tasks():
    for _ in range(2):
        requests.post(f"{BASE_URL}/create-task", json=new_task_payload())

    response = requests.get(f"{BASE_URL}/list-tasks")
    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2  