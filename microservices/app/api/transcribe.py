from fastapi import APIRouter, UploadFile, File, Request, HTTPException
from typing import Optional
from app.providers.llm.voice_chat_lms.whisper_large_v3_turbo import transcribe
from app.models.requests import VoiceChatRequest

router = APIRouter()


@router.post("/transcribe")
async def transcribe_api(request: Request, file: Optional[UploadFile] = File(None)):
    try:
        text = None
        content_type = request.headers.get("content-type", "")
        if "application/json" in content_type:
            try:
                body = await request.json()
                text = body.get("query") or body.get("text") or body.get("message")
            except Exception:
                pass

        request_obj = VoiceChatRequest(audio=file, query=text)
        return await transcribe(request_obj)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
