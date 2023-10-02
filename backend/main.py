from fastapi import FastAPI
from gpt_wrapper import GPTWrapper

app = FastAPI()
gpt_wrapper = GPTWrapper()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/gpt/")
def interact_with_gpt(message: str):
    gpt_wrapper.send_message(message=message)
    return gpt_wrapper.get_chat_history()
