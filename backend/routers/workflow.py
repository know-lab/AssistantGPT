import datetime
import uuid

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from exceptions.request_error import RequestError
from utils.jwt_wrapper import JWTBearer
from utils.supabase_wrapper import SupabaseWrapper


class Workflow(BaseModel):
    title: str
    description: str | None
    definition: str


router = APIRouter(
    prefix="/workflow",
    tags=["workflow"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(JWTBearer())],
)

supabase = SupabaseWrapper().client


@router.get("/")
async def get_workflows():
    try:
        return supabase.from_("Workflow").select("*").execute()
    except RequestError as e:
        return {"error": str(e)}


@router.get("/{workflow_id}")
async def get_workflow(workflow_id: int):
    try:
        return supabase.from_("Workflow").select("*").eq("id", workflow_id).execute()
    except RequestError as e:
        return {"error": str(e)}


@router.post("/")
async def create_workflow(workflow: Workflow):
    try:
        workflow_id = uuid.uuid4()
        return (
            supabase.from_("Workflow")
            .insert(
                [
                    {
                        "id": workflow_id,
                        "title": workflow.title,
                        "description": workflow.description,
                        "definition": workflow.definition,
                        "created_at": datetime.datetime.now().isoformat(),
                    }
                ]
            )
            .execute()
        )
    except RequestError as e:
        return {"error": str(e)}


@router.patch("/")
async def update_workflow(workflow_id: int, workflow: Workflow):
    try:
        return (
            supabase.from_("Workflow")
            .update(
                {
                    "title": workflow.title,
                    "description": workflow.description,
                    "definition": workflow.definition,
                }
            )
            .eq("id", workflow_id)
            .execute()
        )
    except RequestError as e:
        return {"error": str(e)}


@router.delete("/")
async def delete_workflow(workflow_id: int):
    try:
        return supabase.from_("Workflow").delete().eq("id", workflow_id).execute()
    except RequestError as e:
        return {"error": str(e)}
