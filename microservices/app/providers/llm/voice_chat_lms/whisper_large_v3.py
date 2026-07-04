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
    audio_file = request.audio
    file_content = await audio_file.read()
    translation = client.audio.translations.create(
        model="whisper-large-v3",
        file=(audio_file.filename, file_content),
        response_format="json",
    )
    print(json.dumps(translation, indent=2, default=str))
    
    # Generate TTS audio base64 and decode to bytes
    tts_audio_base64 = await audio_response(translation.text)
    tts_audio = base64.b64decode(tts_audio_base64) if tts_audio_base64 else None
    
    return VoiceChatResponse(answer=translation.text, audio=tts_audio)
