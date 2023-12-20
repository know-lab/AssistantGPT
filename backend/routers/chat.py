from fastapi import APIRouter, Depends
from pydantic import BaseModel
from exceptions.RequestError import RequestError
from utils.GPTWrapper import GPTWrapper
from utils.JWTBearer import JWTBearer
from utils.SupabaseWrapper import SupabaseWrapper

import uuid

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
        data = (
            supabase.from_("Conversation")
            .select("*")
            .order("created_at", ascending=False)
            .execute()
        )
        return data
    except RequestError as e:
        return {"error": str(e)}


@router.get("/{chat_id}")
async def get_messages(chat_id: int):
    try:
        data = supabase.from_("Conversation").select("*").eq("id", chat_id).execute()
        return data
    except RequestError as e:
        return {"error": str(e)}


@router.get("/chatlist")
async def get_chatlist():
    try:
        data = (
            supabase.from_("Conversation")
            .select("id", "title")
            .order("created_at", ascending=False)
            .execute()
        )
        return data
    except RequestError as e:
        return {"error": str(e)}


@router.post("/")
async def create_chat(message: str):
    try:
        chat_id = uuid.uuid4()
        gpt_wrapper.send_message(message=message)
        supabase.from_("Conversation").insert(
            [
                {
                    "id": chat_id,
                    "title": "Conversation " + str(chat_id),
                    "content": gpt_wrapper.get_chat_history(),
                }
            ]
        )
        return gpt_wrapper.get_chat_history()
    except RequestError as e:
        return {"error": str(e)}


@router.post("/{chat_id}")
async def send_message(chat_id: int, message: str):
    try:
        gpt_wrapper.send_message(message=message)
        supabase.from_("Conversation").update(
            {
                "content": gpt_wrapper.get_chat_history(),
            }
        ).eq("id", chat_id).execute()
        return gpt_wrapper.get_chat_history()
    except RequestError as e:
        return {"error": str(e)}


@router.delete("/")
async def delete_chat(chat_id: int):
    try:
        data = supabase.from_("Conversation").delete().eq("id", chat_id).execute()
        return data
    except RequestError as e:
        return {"error": str(e)}
