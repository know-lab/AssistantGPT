import datetime
from fastapi import APIRouter, Depends
import uuid

from pydantic import BaseModel
from utils.JWTBearer import JWTBearer
from utils.SupabaseWrapper import SupabaseWrapper


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
def get_workflows():
    try:
        data = supabase.from_("Workflow").select("*").execute()
        return data
    except Exception as e:
        return {"error": str(e)}


@router.get("/{workflow_id}")
def get_workflow(workflow_id: int):
    try:
        data = supabase.from_("Workflow").select("*").eq("id", workflow_id).execute()
        return data
    except Exception as e:
        return {"error": str(e)}


@router.post("/")
def create_workflow(workflow: Workflow):
    try:
        workflow_id = uuid.uuid4()
        data = (
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
        return data
    except Exception as e:
        return {"error": str(e)}


@router.patch("/")
def update_workflow(workflow: Workflow):
    try:
        data = (
            supabase.from_("Workflow")
            .update(
                {
                    "title": workflow.title,
                    "description": workflow.description,
                    "definition": workflow.definition,
                }
            )
            .eq("id", workflow.id)
            .execute()
        )
        return data
    except Exception as e:
        return {"error": str(e)}


@router.delete("/")
def delete_workflow(workflow_id: int):
    try:
        data = supabase.from_("Workflow").delete().eq("id", workflow_id).execute()
        return data
    except Exception as e:
        return {"error": str(e)}
