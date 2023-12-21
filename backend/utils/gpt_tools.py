from command_executor import CommandExecutor
from supabase_wrapper import SupabaseWrapper
from openai import OpenAI
import os
import dotenv

dotenv.load_dotenv()


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

supabase = SupabaseWrapper().client
command_executor = CommandExecutor()
tools = [
    {
        "type": "function",
        "function": {
            "name": "run_command",
            "description": "Runs a command on the user's computer.",
            "parameters": {
                "type": "object",
                "properties": {
                    "command": {
                        "type": "string",
                        "description": "The command to run.",
                    },
                },
            },
            "required": ["command"],
        },
    },
    {
        "type": "function",
        "function": {
            "name": "run_workflow",
            "description": "Runs multiple commands on the user's computer.",
            "parameters": {
                "type": "object",
                "properties": {
                    "commands": {
                        "type": "array",
                        "description": "The commands to run.",
                        "items": {
                            "type": "string",
                        },
                    },
                },
            },
        },
        "required": ["commands"],
    },
    {
        "type": "function",
        "function": {
            "name": "get_workflows",
            "description": "Gets a list of workflows.",
            "parameters": {},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "save_workflow",
            "description": "Saves a workflow. The previously ran commands",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string",
                        "description": "The title of the workflow.",
                    },
                    "description": {
                        "type": "string",
                        "description": "The description of the workflow.",
                    },
                    "definition": {
                        "type": "string",
                        "description": "The definition of the workflow. All the commands to run in a string.",
                    },
                },
            },
        },
        "required": ["title", "description", "definition"],
    },
    {
        "type": "function",
        "function": {
            "name": "get_workflow_from_db",
            "description": "Runs a workflow from the database.",
            "parameters": {
                "type": "object",
                "properties": {
                    "workflow_title": {
                        "type": "string",
                        "description": "The title of the workflow.",
                    },
                },
            },
        },
        "required": ["workflow_title"],
    },
]


def run_command(command):
    try:
        return command_executor.execute(command)
    except Exception:
        return "Failed to run command."


def run_workflow(commands):
    try:
        return command_executor.execute_chain(commands)
    except Exception:
        return "Failed to run workflow."


def get_workflows():
    try:
        return supabase.from_("Workflow").select("*").execute().data
    except Exception:
        return "Failed to get workflows."


def save_workflow(title, description, definition):
    try:
        user_id = supabase.auth.get_user().user.id
        return (
            supabase.from_("Workflow")
            .insert(
                {
                    "title": title,
                    "description": description,
                    "definition": definition,
                    "user_id": user_id,
                }
            )
            .execute()
        )
    except Exception:
        return "Failed to save workflow."


def get_workflow_from_db(workflow_title):
    try:
        data = supabase.from_("Workflow").select("*").eq("title", workflow_title).execute().data
        return run_workflow(data) 

    except Exception:
        return "Failed to run workflow from database."


available_tools = {
    "run_command": run_command,
    "run_workflow": run_workflow,
    "get_workflows": get_workflows,
    "save_workflow": save_workflow,
    "get_workflow_from_db": get_workflow_from_db,
}
