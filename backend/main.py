import json
from typing import Annotated
import uuid

from auth import AuthHandler
from fastapi import Depends, FastAPI
from fastapi.responses import RedirectResponse
from gpt_wrapper import GPTWrapper
from models import Token, User
from test_data import fake_users_db

auth = AuthHandler(fake_users_db=fake_users_db)
app = FastAPI()
gpt_wrapper = GPTWrapper()

with open("endpoint-example-responses/fetch_chatlist.json", "r") as f:
    fetch_chatlist_example_response = json.load(f)

with open("endpoint-example-responses/fetch_messages.json", "r") as f:
    fetch_messages_example_response = json.load(f)


with open("endpoint-example-responses/fetch_workflows.json", "r") as f:
    fetch_workflows_example_response = json.load(f)


@app.get("/")
def read_root():
    return RedirectResponse(url="/docs/")


@app.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[User, Depends(auth.login_for_access_token)]
):
    return form_data


@app.get("/users/me/", response_model=User)
async def get_current_user(
    current_user: Annotated[User, Depends(auth.get_current_user)]
):
    return current_user


@app.get("/chat/{chat_id}")
def get_messages(chat_id: int):
    return {"messages": fetch_messages_example_response}


@app.post("/chat")
def create_chat(message: str):
    gpt_wrapper.send_message(message=message)
    return gpt_wrapper.get_chat_history()


@app.post("/chat/{chat_id}")
def send_message(message: str):
    gpt_wrapper.send_message(message=message)
    return gpt_wrapper.get_chat_history()


@app.get("/chatlist")
def get_chatlist():
    return {"chatlist": fetch_chatlist_example_response}


@app.patch("/chatlist/{chat_id}")
def update_chatlist(chat_id: int):
    return {"chatlist": "Chatlist" + chat_id}


@app.get("/workflow")
def get_workflows():
    return {"workflows": fetch_workflows_example_response}


@app.get("/workflow/{workflow_id}")
def get_workflow(workflow_id: int):
    return {"workflow": "Workflow" + workflow_id}


@app.post("/workflow")
def create_workflow():
    return {"workflow": "Workflow" + uuid.uuid4()}


@app.patch("/workflow/{workflow_id}")
def update_workflow(workflow_id: int):
    return {"workflow": "Workflow" + workflow_id}


@app.delete("/workflow/{workflow_id}")
def delete_workflow(workflow_id: int):
    return {"workflow": "Workflow" + workflow_id}
