from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session
from passlib.hash import argon2

from db.db import get_db
from db.db_models import User
from models import SignInBody, SignUpBody, ForgotPasswordBody, RestorePasswordBody, TokenResponse, MessageResponse
from routes.utils import get_current_user
from auth_token import (
    create_access_token, create_refresh_token, set_refresh_cookie,
    clear_refresh_cookie, decode_token
)



router = APIRouter(tags=["auth"])

@router.post("/api/auth/sign-in", response_model=TokenResponse)
def sign_in(body: SignInBody, response: Response, db: Session = Depends(get_db)):
    user: User | None = db.query(User).filter(User.email == body.email).first()
    if not user or not argon2.verify(body.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access = create_access_token(user.id)
    refresh = create_refresh_token(user.id)
    set_refresh_cookie(response, refresh)
    return {"access_token": access}

@router.post("/api/auth/refresh", response_model=TokenResponse)
def refresh_token(request: Request, response: Response, db: Session = Depends(get_db)):
    refresh = request.cookies.get("refresh_token")
    user_id = decode_token(refresh) if refresh else None
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    if db.get(User, user_id) is None:
        raise HTTPException(status_code=401, detail="User no longer exists")

    access = create_access_token(user_id)
    return {"access_token": access}

@router.post("/api/auth/logout", response_model=MessageResponse)
def logout(response: Response):
    clear_refresh_cookie(response)
    return {"message": "Logged out"}

@router.post("/api/auth/sign-up", response_model=MessageResponse)
def sign_up(body: SignUpBody, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(
        email=body.email,
        password=argon2.hash(body.password),
        name=body.name,
    )
    db.add(user)
    db.commit()
    return {"message": "User created"}

@router.post("/api/auth/forgot-password", response_model=MessageResponse)
def forgot_password(body: ForgotPasswordBody, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    return {"message": "Reset code sent"}

@router.post("/api/auth/restore-password", response_model=MessageResponse)
def restore_password(body: RestorePasswordBody, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    user.password = argon2.hash(body.password)
    db.commit()
    return {"message": "Password reset successful"}

@router.get("/api/users/me")
def get_user_profile(user: Dict[str, Any] = Depends(get_current_user)):
    return {k: v for k, v in user.items() if k != "password"}
