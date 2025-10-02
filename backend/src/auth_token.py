import datetime as dt
from typing import Optional, Dict, Any
import jwt
import os
from fastapi import Response, Request, HTTPException, status
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ACCESS_MINUTES = 5
REFRESH_DAYS = 7


def _encode_token(user_id: int, minutes: int) -> str:
    now = dt.datetime.utcnow()
    payload = {"sub": user_id, "iat": now, "exp": now + dt.timedelta(minutes=minutes)}
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def create_access_token(user_id: int) -> str:
    return _encode_token(user_id, ACCESS_MINUTES)

def create_refresh_token(user_id: int) -> str:
    return _encode_token(user_id, REFRESH_DAYS * 24 * 60)

def decode_token(token: str) -> Optional[int]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return int(payload["sub"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def set_refresh_cookie(resp: Response, token: str) -> None:
    resp.set_cookie(
        key="refresh_token",
        value=token,
        httponly=True,
        samesite="lax",
        max_age=86400 * REFRESH_DAYS,
        secure=False,
        path="/",
    )

def clear_refresh_cookie(resp: Response) -> None:
    resp.delete_cookie(key="refresh_token", path="/", samesite="lax")
