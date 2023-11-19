from typing import Annotated

from fastapi import Depends, FastAPI

from auth import AuthHandler
from gpt_wrapper import GPTWrapper
from models import Token, User
from test_data import fake_users_db

auth = AuthHandler(fake_users_db=fake_users_db)
app = FastAPI()
gpt_wrapper = GPTWrapper()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/gpt/")
def interact_with_gpt(message: str):
    gpt_wrapper.send_message(message=message)
    return gpt_wrapper.get_chat_history()


@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[User, Depends(auth.login_for_access_token)]):
    return form_data


@app.get("/users/me/", response_model=User)
async def get_current_user(current_user: Annotated[User, Depends(auth.get_current_user)]):
    return current_user
