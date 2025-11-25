# first run application server then test
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


response = requests.get(BASE_URL + "/")

data = response.json()
print(data)

status_code = response.status_code
print(status_code)

def test_can_call_endpoint():
    response = requests.get(BASE_URL + "/")
    assert response.status_code == 200
