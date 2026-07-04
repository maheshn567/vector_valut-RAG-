from fastapi import File,FastAPI,UploadFile,APIRouter
from app.providers.llm.voice_chat_lms.whisper_large_v3 import translate
from app.models.requests import VoiceChatRequest
from app.models.response import VoiceChatResponse

router = APIRouter()


@router.post("/translate")
async def translate_api(file: UploadFile = File(...)):
    request = VoiceChatRequest(audio=file)
    return await translate(request)