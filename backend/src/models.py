from pydantic import BaseModel, EmailStr
from typing import Optional

class SignInBody(BaseModel):
    email: EmailStr
    password: str

class SignUpBody(BaseModel):
    name: str
    email: EmailStr
    password: str

class ForgotPasswordBody(BaseModel):
    email: EmailStr

class RestorePasswordBody(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str

class MessageResponse(BaseModel):
    message: str

class ExpenseCreate(BaseModel):
    name: str
    amount: float
    category: str
    date: str
    currency: str

class ExpenseUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[str] = None
    category: Optional[str] = None
    date: Optional[str] = None
