import json
import base64
from groq import Groq
from fastapi import UploadFile, File, APIRouter
from app.models.response import VoiceChatResponse
from app.models.requests import VoiceChatRequest
from app.services.text_to_speech_service import audio_response

router = APIRouter()
client = Groq()

async def transcribe(request: VoiceChatRequest) -> VoiceChatResponse:
    audio_file = request.audio
    file_content = await audio_file.read()
    transcription = client.audio.transcriptions.create(
        model="whisper-large-v3-turbo",
        file=(audio_file.filename, file_content),
        response_format="json",
    )
    print(json.dumps(transcription, indent=2, default=str))
    
    # Generate TTS audio base64 and decode to bytes
    tts_audio_base64 = await audio_response(transcription.text)
    tts_audio = base64.b64decode(tts_audio_base64) if tts_audio_base64 else None
    
    return VoiceChatResponse(answer=transcription.text, audio=tts_audio)
