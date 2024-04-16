from fastapi import APIRouter, Depends
from pydantic import BaseModel

from exceptions.request_error import RequestError
from utils.gpt_wrapper import GPTWrapper
from utils.jwt_wrapper import JWTBearer
from utils.supabase_wrapper import SupabaseWrapper

router = APIRouter(
    prefix="/apiaction",
    tags=["apiaction"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(JWTBearer())],
)


class ApiDef(BaseModel):
    title: str
    description: str | None
    endpoint: str
    method: str
    header: str | None
    schema: str


gpt_wrapper = GPTWrapper()
supabase = SupabaseWrapper().client


@router.get("/")
async def get_apis():
    try:
        return supabase.from_("Api").select("*").execute().data
    except RequestError:
        return {"error": "Failed to get apis"}


@router.get("/apilist")
async def get_api_list():
    try:
        return supabase.from_("Api").select("id", "title").execute().data
    except RequestError:
        return {"error": "Failed to get api list"}


@router.get("/{api_id}")
async def get_messages(api_id: int):
    try:
        return supabase.from_("Api").select("*").eq("id", api_id).execute().data
    except RequestError:
        return {"error": "Failed to get messages"}


@router.post("/")
async def create_api(apidef: ApiDef):
    print(apidef)
    try:
        user_id = supabase.auth.get_user().user.id
        return (
            supabase.from_("Api")
            .insert(
                [
                    {
                        "title": apidef.title,
                        "description": apidef.description,
                        "endpoint": apidef.endpoint,
                        "method": apidef.method,
                        "header": apidef.header,
                        "schema": apidef.schema,
                        "user_id": user_id,
                    }
                ]
            )
            .execute()
            .data
        )
    except RequestError:
        return {"error": "Failed to create api definition"}


@router.post("/{api_id}")
async def update_api(api_id: int, apidef: ApiDef):
    try:
        return (
            supabase.from_("Api")
            .update(
                {
                    "title": apidef.title,
                    "description": apidef.description,
                    "endpoint": apidef.endpoint,
                    "method": apidef.method,
                    "header": apidef.header,
                    "schema": apidef.schema,
                }
            )
            .eq("id", api_id)
            .execute()
            .data
        )
    except RequestError:
        return {"error": "Failed to send message"}


@router.delete("/{api_id}")
async def delete_api(api_id: int):
    try:
        print("DELETING", api_id)
        return supabase.from_("Api").delete().eq("id", api_id).execute().data
    except RequestError:
        return {"error": "Failed to delete api"}
    
