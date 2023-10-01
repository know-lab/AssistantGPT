import openai
import dotenv
import os

dotenv.load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


class GPT_Wrapper:
    def __init__(self, engine='gpt-3.5-turbo', system_prompt="The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly."):
        self.engine = engine
        self.system_prompt = system_prompt
        self.chat_history = []
        self.append_system_prompt(system_prompt)

    def send_message(self, message):
        self.append_user_message(message)
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo", messages=self.chat_history)
        self.append_assistant_message(completion.choices[0].message.content)
        return completion.choices[0].message.content

    def get_chat_history(self):
        return self.chat_history

    def clear_chat_history(self):
        self.chat_history = []
        return self.chat_history

    def set_engine(self, engine):
        self.engine = engine
        return self.engine

    def get_engine(self):
        return self.engine

    def set_system_prompt(self, system_prompt):
        self.system_prompt = system_prompt
        return self.system_prompt

    def get_system_prompt(self):
        return self.system_prompt

    def append_system_prompt(self, system_prompt):
        self.chat_history.append({"role": "system", "content": system_prompt})
        return self.chat_history

    def append_user_message(self, message):
        self.chat_history.append({"role": "user", "content": message})
        return self.chat_history

    def append_assistant_message(self, message):
        self.chat_history.append({"role": "assistant", "content": message})
        return self.chat_history
