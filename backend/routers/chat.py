
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from exceptions.request_error import RequestError
from utils.gpt_wrapper import GPTWrapper
from utils.jwt_wrapper import JWTBearer
from utils.supabase_wrapper import SupabaseWrapper

router = APIRouter(
    prefix="/chats",
    tags=["chats"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(JWTBearer())],
)


class Conversation(BaseModel):
    title: str
    content: str


gpt_wrapper = GPTWrapper()
supabase = SupabaseWrapper().client


@router.get("/")
async def get_chats():
    try:
        return supabase.from_("Conversation").select("*").execute().data
    except RequestError:
        return {"error": "Failed to get chats"}


@router.get("/chatlist")
async def get_chatlist():
    try:
        return supabase.from_("Conversation").select("id", "title").execute().data
    except RequestError:
        return {"error": "Failed to get chatlist"}


@router.get("/{chat_id}")
async def get_messages(chat_id: int):
    try:
        return supabase.from_("Conversation").select("*").eq("id", chat_id).execute().data
    except RequestError:
        return {"error": "Failed to get messages"}


@router.post("/")
async def create_chat(message: str):
    try:
        user_id = supabase.auth.get_user().user.id
        gpt_wrapper.send_message(message=message)
        return (
            supabase.from_("Conversation")
            .insert(
                [
                    {
                        "title": gpt_wrapper.get_chat_title(),
                        "content": gpt_wrapper.get_chat_history(),
                        "user_id": user_id,
                    }
                ]
            )
            .execute()
            .data
        )
    except RequestError:
        return {"error": "Failed to create chat"}


@router.post("/{chat_id}")
async def send_message(chat_id: int, message: str):
    try:
        gpt_wrapper.send_message(message=message)
        return (
            supabase.from_("Conversation")
            .update(
                {
                    "content": gpt_wrapper.get_chat_history(),
                }
            )
            .eq("id", chat_id)
            .execute()
            .data
        )
    except RequestError:
        return {"error": "Failed to send message"}


@router.delete("/")
async def delete_chat(chat_id: int):
    try:
        return supabase.from_("Conversation").delete().eq("id", chat_id).execute().data
    except RequestError:
        return {"error": "Failed to delete chat"}
