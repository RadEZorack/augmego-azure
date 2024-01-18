from .celery import app
from ai.models import ArtificalIntelligence


@app.task
def add(x, y):
    print("hello celery")
    return x + y

@app.task
async def create_ai():
    print("creating AI")
    bob = ArtificalIntelligence()
    await bob.start_me()