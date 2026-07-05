from fastapi import APIRouter, UploadFile, File, Request
from typing import Optional
from app.providers.llm.voice_chat_lms.whisper_large_v3 import translate
from app.models.requests import VoiceChatRequest

router = APIRouter()


@router.post("/translate")
async def translate_api(request: Request, file: Optional[UploadFile] = File(None)):
    text = None
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            body = await request.json()
            text = body.get("query") or body.get("text") or body.get("message")
        except Exception:
            pass

    request_obj = VoiceChatRequest(audio=file, query=text)
    return await translate(request_obj)