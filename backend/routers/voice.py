from fastapi import APIRouter, Depends, UploadFile, File
from pydantic import BaseModel
from openai import OpenAI
from pathlib import Path


from exceptions.request_error import RequestError
from utils.gpt_wrapper import GPTWrapper
from utils.jwt_wrapper import JWTBearer
from utils.supabase_wrapper import SupabaseWrapper

router = APIRouter(
    prefix="/voice",
    tags=["voice"],
    responses={404: {"description": "Not found"}},
    dependencies=[Depends(JWTBearer())],
)


gpt_wrapper = GPTWrapper()
supabase = SupabaseWrapper().client

@router.get("/")
async def get_voices(audio_file: UploadFile = File(...)):
    client = OpenAI()

    transcript = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
        response_format="text"
    )
    return transcript

@router.post("/speak{message}")
async def speak(message: str):
    client = OpenAI
    response_gpt = gpt_wrapper.get_response(message)
    speech_file_path = Path(__file__).parent / "speech.wav"
    response = client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=response_gpt.choices[0].message.content
    )
    response.stream_to_file(speech_file_path)

    return speech_file_path

    

    
    
