from fastapi import APIRouter

from routes import expenses, auth


api_router = APIRouter()
api_router.include_router(expenses.router)
api_router.include_router(auth.router)
