from fastapi import FastAPI,APIRouter,UploadFile,File
from app.providers.llm.voice_chat_lms.whisper_large_v3_turbo import transcribe
from app.models.requests import VoiceChatRequest
from app.models.response import VoiceChatResponse

router = APIRouter()


@router.post("/transcribe")
async def transcribe_api(file: UploadFile = File(...)):
    request = VoiceChatRequest(audio=file)
    return await transcribe(request)