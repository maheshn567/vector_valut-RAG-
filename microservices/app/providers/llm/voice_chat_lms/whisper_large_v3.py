import json
import base64
from groq import Groq
from fastapi import UploadFile, File, APIRouter
from app.models.requests import VoiceChatRequest
from app.models.response import VoiceChatResponse
from app.services.text_to_speech_service import audio_response

router = APIRouter()
client = Groq()

async def translate(request: VoiceChatRequest) -> VoiceChatResponse:
    text_content = None
    if request.audio:
        audio_file = request.audio
        file_content = await audio_file.read()
        translation = client.audio.translations.create(
            model="whisper-large-v3",
            file=(audio_file.filename, file_content),
            response_format="json",
        )
        print(json.dumps(translation, indent=2, default=str))
        text_content = translation.text
    else:
        text_content = request.query

    # Generate TTS audio base64 and decode to bytes
    tts_audio_base64 = await audio_response(text_content) if text_content else None
    tts_audio = base64.b64decode(tts_audio_base64) if tts_audio_base64 else None
    
    return VoiceChatResponse(answer=text_content, audio=tts_audio)
