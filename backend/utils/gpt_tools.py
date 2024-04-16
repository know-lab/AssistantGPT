from re import L
import requests
from utils.command_executor import CommandExecutor
from utils.supabase_wrapper import SupabaseWrapper
from bs4 import BeautifulSoup


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
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Gets the weather for a location.",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The location to get the weather for.",
                    },
                },
            },
        },
        "required": ["location"],
    },
    {
        "type": "function",
        "function": {
            "name": "get_colors",
            "description": "Gets a list of colors.",
            "parameters": {},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_passing_yards",
            "description": "Gets a list of passing yards.",
            "parameters": {},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_movies",
            "description": "Gets a list of movies.",
            "parameters": {
                "type": "object",
                "properties": {
                    "genre": {
                        "type": "string",
                        "description": "The genre of the movies. should be one of: action-adventure, comedy, drama, horror, romance, scifi-fantasy",
                    },
                },
            },
        },
        "required": ["genre"],
    },
    {
        "type": "function",
        "function": {
            "name": "get_stocks",
            "description": "Gets a list of stocks.",
            "parameters": {
                "type": "object",
                "properties": {
                    "stock_name": {
                        "type": "string",
                        "description": "The name of the stock.",
                    },
                    "start_date": {
                        "type": "string",
                        "description": "The start date.",
                    },
                    "end_date": {
                        "type": "string",
                        "description": "The end date.",
                    },
                },
            },
        },
        "required": ["stock_name", "start_date", "end_date"],
    },
    {
        "type": "function",
        "function": {
            "name": "process_website",
            "description": "Processes a website.",
            "parameters": {
                "type": "object",
                "properties": {
                    "url": {
                        "type": "string",
                        "description": "The URL of the website.",
                    },
                },
            },
        },
        "required": ["url"],
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

def get_weather(location):
    # Define the URL for the OpenWeatherMap API
    url = f"http://api.openweathermap.org/data/2.5/weather?q={location}&appid=2e48fd59abf2968bb7c62f3274d0a7d2"

    # Make the HTTP GET request
    response = requests.get(url, timeout=5)

    # Parse the response
    weather_data = response.json()

    # Return the weather data
    return weather_data

def get_colors():
    # https://api.sampleapis.com/csscolornames/colors
    url = "https://api.sampleapis.com/csscolornames/colors"
    response = requests.get(url, timeout=5)
    colors = response.json()
    return colors

# https://api.sampleapis.com/football/passingyards-singleseason
def get_passing_yards():
    url = "https://api.sampleapis.com/football/passingyards-singleseason"
    response = requests.get(url, timeout=5)
    passing_yards = response.json()
    return passing_yards

# https://api.sampleapis.com/movies/action-adventure
def get_movies(genre):
    url = f"https://api.sampleapis.com/movies/{genre}"
    response = requests.get(url, timeout=5)
    movies = response.json()
    return movies

def get_stocks(stock_name, start_date, end_date):
    url = f"https://api.polygon.io/v2/aggs/ticker/{stock_name}/range/1/day/{start_date}/{end_date}?adjusted=true&sort=asc&limit=120&apiKey=p_FpaDLz886gIXpPky6D5oKxpmQfCnpq"
    response = requests.get(url, timeout=5)
    stocks = response.json()
    return stocks

def process_website(url):
    soup = BeautifulSoup(requests.get(url, timeout=5).text, "lxml")
    soup.body.get_text(strip=True)
    # only return first 6000 characters
    return soup.get_text(strip=True)[:6000]

available_tools = {
    "run_command": run_command,
    "run_workflow": run_workflow,
    "get_workflows": get_workflows,
    "save_workflow": save_workflow,
    "get_workflow_from_db": get_workflow_from_db,
    "get_weather": get_weather,
    "get_colors": get_colors,
    "get_passing_yards": get_passing_yards,
    "get_movies": get_movies,
    "get_stocks": get_stocks,
    "process_website": process_website,
}
