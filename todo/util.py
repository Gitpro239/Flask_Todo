def validate_task_data(data):
    if 'title' not in data or not data['title']:
        return False, "Title is required"
    return True, ""
