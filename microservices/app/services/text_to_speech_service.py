import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

import base64

async def audio_response(text: str):
    try:
        # Prepend vocal directions to steer the generative model to a robotic monotone delivery
        steered_text = f"[monotone, robotic] {text}"
        response = client.audio.speech.create(
            model="canopylabs/orpheus-v1-english",
            voice="troy",
            input=steered_text,
            response_format="wav"
        )
        audio_bytes = response.read()
        audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
        return audio_base64
    except Exception as e:
        print("TTS Error:", e)
        return None


