from fastapi import FastAPI
from fastapi.responses import RedirectResponse

from routers import auth, chat, workflow

app = FastAPI()
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(workflow.router)


@app.get("/")
def read_root():
    return RedirectResponse(url="/docs/")
