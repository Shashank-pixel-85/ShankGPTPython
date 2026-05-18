from fastapi import Header, HTTPException
from app.utils.auth import decode_token

def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        token = authorization.split(" ")[1]  # "Bearer token"
    except:
        raise HTTPException(status_code=401, detail="Invalid token format")

    payload = decode_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return payload["user_id"]