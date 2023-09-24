from fastapi import FastAPI
from gpt_wrapper import GPT_Wrapper

app = FastAPI()
gpt_wrapper = GPT_Wrapper()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/gpt/")
def interact_with_gpt(message: str):
    gpt_wrapper.send_message(message=message)
    return gpt_wrapper.get_chat_history()

