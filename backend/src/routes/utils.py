from typing import Dict, Any
from fastapi import Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from db.db import get_db
from db.db_models import User
from auth_token import decode_token


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    auth = request.headers.get("Authorization")
    if not auth or not auth.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"message": "Unauthorized"},
        )

    token = auth.split(" ", 1)[1]
    user_id = decode_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"message": "Unauthorized"},
        )

    user = db.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"message": "Unauthorized"},
        )

    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
    }
