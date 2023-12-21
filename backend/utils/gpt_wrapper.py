import json
import os

import dotenv
from command_executor import CommandExecutor
from openai import OpenAI
from supabase_wrapper import SupabaseWrapper

dotenv.load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
supabase = SupabaseWrapper().client
command_executor = CommandExecutor()


system_prompt = """
You are an AI assistant that helps beginner and advanced users with running commands on their computer.
You can run commands on the user's computer, run multiple commands on the user's computer, get a list of workflows
, and save a workflow.
A workflow is a string of commands that can be saved and run later.
You mustn't run any commands that could harm the user's computer!!!
You can run the following commands:
run_command
run_workflow
get_workflows
save_workflow
You must be always polite and helpful.
You can decline to run a command if you think it's harmful.
"""

command_result_prompt = """
You are a summarizer who summarizes the command stdout results.
Say it if the command was successful or not.
And what was the error if there was any.
"""

command_steps_prompt = """
You are a summarizer who summarizes the command steps.
Say how can the user do the steps from the command on the gui and on the command line.
"""


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
        return (
            supabase.from_("Workflow")
            .insert(
                {
                    "title": title,
                    "description": description,
                    "definition": definition,
                }
            )
            .execute()
        )
    except Exception:
        return "Failed to save workflow."


available_tools = {
    "run_command": run_command,
    "run_workflow": run_workflow,
    "get_workflows": get_workflows,
    "save_workflow": save_workflow,
}


class GPTWrapper:
    def __init__(
        self,
        engine="gpt-3.5-turbo-1106",
    ):
        self.engine = engine
        self.system_prompt = system_prompt
        self.command_steps_prompt = command_steps_prompt
        self.command_result_prompt = command_result_prompt
        self.chat_history = []
        self.tools = tools
        self.append_system_prompt(system_prompt)

    def send_message(self, message):
        self.append_user_message(message)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo-1106", messages=self.chat_history, tools=self.tools, tool_choice="auto"
        )
        response = response.choices[0].message
        # print(response)
        if response.tool_calls is not None:
            self.use_tools(response.tool_calls)
        else:
            self.append_assistant_message(response.content)

        return response.content

    def set_chat_history(self, chat_history):
        self.chat_history = chat_history
        return self.chat_history

    def get_chat_history(self):
        return self.chat_history

    def clear_chat_history(self):
        self.chat_history = []
        self.append_system_prompt(self.system_prompt)
        return self.chat_history

    def get_chat_title(self):
        return self.chat_history[1]["content"]

    def append_system_prompt(self, system_prompt):
        self.chat_history.append({"role": "system", "content": system_prompt})
        return self.chat_history

    def append_user_message(self, message):
        self.chat_history.append({"role": "user", "content": message})
        return self.chat_history

    def append_assistant_message(self, message):
        self.chat_history.append({"role": "assistant", "content": message})
        return self.chat_history

    def use_tools(self, tool_calls):
        # logger.info(tool_calls)
        for tool_call in tool_calls:
            function_name = tool_call.function.name
            function_to_call = available_tools[function_name]
            function_args = json.loads(tool_call.function.arguments)
            function_response = function_to_call(**function_args)

            tool_call_result = {
                "role": "assistant",
                "content": str(function_response),
            }

            if (function_args is not None) and (function_args != {}):
                self.append_assistant_message("Running command with parameters: " + str(function_args))
                summarize_function_calls = client.chat.completions.create(
                    model="gpt-3.5-turbo-1106",
                    messages=[
                        {
                            "role": "system",
                            "content": self.command_steps_prompt,
                        },
                        tool_call_result,
                    ],
                )
                self.append_assistant_message(summarize_function_calls.choices[0].message.content)

            summarize_function_calls = client.chat.completions.create(
                model="gpt-3.5-turbo-1106",
                messages=[
                    {
                        "role": "system",
                        "content": self.command_result_prompt,
                    },
                    tool_call_result,
                ],
            )
            self.append_assistant_message(summarize_function_calls.choices[0].message.content)


if __name__ == "__main__":
    gpt_wrapper = GPTWrapper()
    gpt_wrapper.send_message("Hello, which workflows do i have?")
    print(gpt_wrapper.chat_history)
