from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv
import sounddevice as sd
import numpy as np
from pydub import AudioSegment
from scipy.io.wavfile import write
import wavio as wv
import simpleaudio as sa
import soundfile as sf


load_dotenv()
client = OpenAI()

# Sampling frequency
freq = 44100
 
# Recording duration
duration = 5
 
# Start recorder with the given values 
# of duration and sample frequency
recording = sd.rec(int(duration * freq), 
                   samplerate=freq, channels=1)
 
# Record audio for the given number of seconds
sd.wait()
 
# This will convert the NumPy array to an audio
# file with the given sampling frequency
write("audio.wav", freq, recording)
 
audio_file=Path(__file__).parent / "rec.wav"
# Convert the NumPy array to audio file
wv.write(str(audio_file), recording, freq, sampwidth=2)

print(f"Uploading {audio_file} to OpenAI")
transcript = client.audio.transcriptions.create(
  model="whisper-1",
  file=audio_file,
  response_format="text"
)

# send transcript as prompt to gpt 3
response_gpt = client.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": transcript
    }
  ]
)

print(transcript)
print(response_gpt)

speech_file_path = Path(__file__).parent / "speech.wav"
response = client.audio.speech.create(
  model="tts-1",
  voice="alloy",
  input=response_gpt.choices[0].message.content
)

response.stream_to_file(speech_file_path)

filename = str(speech_file_path)
# Extract data and sampling rate from file
data, fs = sf.read(filename, dtype='float32')  
sd.play(data, fs)
status = sd.wait()  # Wait until file is done playing