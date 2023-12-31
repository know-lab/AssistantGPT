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
        return supabase.from_("Workflow").select("*").execute().data
    except RequestError:
        return {"error": "Failed to get workflows"}


@router.get("/workflowlist")
async def get_workflowlist():
    try:
        return supabase.from_("Workflow").select("id", "title").execute().data
    except RequestError:
        return {"error": "Failed to get workflowlist"}


@router.get("/{workflow_id}")
async def get_workflow(workflow_id: int):
    try:
        return supabase.from_("Workflow").select("*").eq("id", workflow_id).execute().data
    except RequestError:
        return {"error": "Failed to get workflow"}


@router.post("/")
async def create_workflow(workflow: Workflow):
    try:
        user_id = supabase.auth.get_user().user.id
        return (
            supabase.from_("Workflow")
            .insert(
                [
                    {
                        "title": workflow.title,
                        "description": workflow.description,
                        "definition": workflow.definition,
                        "user_id": user_id,
                    }
                ]
            )
            .execute()
            .data
        )
    except RequestError:
        return {"error": "Failed to create workflow"}


@router.post("/{workflow_id}")
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
            .data
        )
    except RequestError:
        return {"error": "Failed to update workflow"}


@router.delete("/")
async def delete_workflow(workflow_id: int):
    try:
        return supabase.from_("Workflow").delete().eq("id", workflow_id).execute().data
    except RequestError:
        return {"error": "Failed to delete workflow"}
