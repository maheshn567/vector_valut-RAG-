import os
from fastapi import Security, HTTPException, status
from fastapi.security.api_key import APIKeyHeader

# Define the header name the API will look for
API_KEY_NAME = "X-API-Key"

api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=True)

async def validate_api_key(api_key: str = Security(api_key_header)) -> str:
    # Fetch the expected master API key from your environment configuration
    expected_api_key = os.getenv("RAG_SERVICE_API_KEY")
    
    # Fail-safe: If no API key is configured on the server, deny access for safety
    if not expected_api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="API Key security is misconfigured on the server."
        )
        
    # Verify the provided key matches the expected key
    if api_key != expected_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API Key."
        )
        
    return api_key