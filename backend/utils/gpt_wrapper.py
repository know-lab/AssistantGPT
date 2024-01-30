import json
import os

import dotenv
from openai import OpenAI

from utils.gpt_tools import available_tools, tools

dotenv.load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


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
add_command_to_allowed_list
remove_command_from_allowed_list
You must be always polite and helpful.
You can decline to run a command if you think it's harmful.
You should always propose command to run for the user and wait for a Should I run it? yes or no question.
Only run the command if the user said yes!
You have a list of the allowed commands. Only run the command if it's in the list.
"""

command_result_prompt = """
You are a summarizer who summarizes the command stdout results.
Say it if the command was successful or not.
Print the stdout formatted as readable text.
And what was the error if there was any.
"""

command_steps_prompt = """
You are a summarizer who summarizes the command steps.
Say how can the user do the steps from the command on the gui and on the command line.
"""

db_summary_prompt = """
Return the database results in a readable format.
Expect a format like this:
[
  {
    "id": 1,
    "created_at": "2023-12-21T09:51:56.576832+00:00",
    "title": "Test",
    "description": "desc",
    "definition": "ls -l",
    "user_id": "bd7ab55b-590d-4b09-9a2a-5f682ae9acca"
  },
  {
    "id": 2,
    "created_at": "2023-12-21T10:01:47.671207+00:00",
    "title": "Test2",
    "description": "desc",
    "definition": "echo hello",
    "user_id": "bd7ab55b-590d-4b09-9a2a-5f682ae9acca"
  },
You should say the title and the definition of each workflow and the description if
there is any even if they are in a list or dictionary.
Don't say this "It returned a list of dictionaries with 'id', 'created_at', 'title', 'description', 'definition',
and 'user_id' keys. Each dictionary corresponds to a record in the database."
      }"
Say the concrete values of the keys.
Return a table with the columns 'id', 'title', 'description', and 'definition'.
"""


class GPTWrapper:
    def __init__(
        self,
        engine="gpt-3.5-turbo-1106",
    ):
        self.engine = engine
        self.system_prompt = system_prompt
        self.command_steps_prompt = command_steps_prompt
        self.command_result_prompt = command_result_prompt
        self.db_summary_prompt = db_summary_prompt
        self.chat_history = []
        self.tools = tools
        self.append_system_prompt(system_prompt)

    def send_message(self, message):
        self.append_user_message(message)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo-1106",
            messages=self.chat_history,
            tools=self.tools,
            tool_choice="auto",
        )
        response = response.choices[0].message
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
        for tool_call in tool_calls:
            function_name = tool_call.function.name
            function_to_call = available_tools[function_name]
            function_args = json.loads(tool_call.function.arguments)
            ## Check if the function command arg is in the allowed list
            if function_name == "run_command":
                with open("allowed_commands.txt", "r") as f:
                    allowed_commands = f.readlines()
                if function_args["command"] not in allowed_commands:
                    self.append_assistant_message(
                        f"Command {function_args['command']} is not in the allowed list."
                    )
                    continue

            function_response = function_to_call(**function_args)

            tool_call_result = {
                "role": "assistant",
                "content": str(function_response),
            }

            self.append_assistant_message(
                f"Running command {function_name} with parameters: {function_args}."
            )
            self.append_assistant_message(f"Command result: {function_response}.")

            if function_name == "get_workflows":
                self.append_assistant_message("Getting workflows from database.")
                summarize_function_calls = client.chat.completions.create(
                    model="gpt-3.5-turbo-1106",
                    messages=[
                        {
                            "role": "system",
                            "content": self.db_summary_prompt,
                        },
                        tool_call_result,
                    ],
                )
            elif function_name == "get_workflow_from_db":
                self.append_assistant_message(
                    f"Getting workflow {function_args} from database."
                )
                summarize_function_calls = client.chat.completions.create(
                    model="gpt-3.5-turbo-1106",
                    messages=[
                        {
                            "role": "system",
                            "content": self.db_summary_prompt,
                        },
                        tool_call_result,
                    ],
                )
            elif function_name == "add_command_to_allowed_list":
                self.append_assistant_message(
                    f"Adding command {function_args} to allowed list."
                )
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
            elif function_name == "remove_command_from_allowed_list":
                self.append_assistant_message(
                    f"Removing command {function_args} from allowed list."
                )
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
            else:
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
                self.append_assistant_message(
                    summarize_function_calls.choices[0].message.content
                )

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
            self.append_assistant_message(
                summarize_function_calls.choices[0].message.content
            )


if __name__ == "__main__":
    gpt = GPTWrapper()
    gpt.send_message("list my files on the desktop")
    print(gpt.get_chat_history())
