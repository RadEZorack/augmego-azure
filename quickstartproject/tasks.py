from .celery import app


@app.task
def add(x, y):
    print("hello celery")
    return x + y