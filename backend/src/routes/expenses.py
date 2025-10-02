import datetime as dt
import random
from decimal import Decimal
from typing import Optional, Dict, Any, List

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy import select, and_
from sqlalchemy.orm import Session

from models import MessageResponse, ExpenseCreate, ExpenseUpdate
from db.db_models import User, Transaction, CurrencyEnum
from db.db import get_db
from routes.utils import get_current_user

router = APIRouter(tags=["expenses"])


def to_dict(tx: Transaction) -> Dict[str, Any]:
    """Serialize a Transaction to the previous dict shape expected by the frontend."""
    amount = float(tx.amount) if isinstance(tx.amount, Decimal) else tx.amount
    date_str = tx.date.isoformat() if isinstance(tx.date, (dt.date,)) else str(tx.date)
    currency = tx.currency.value if hasattr(tx.currency, "value") else str(tx.currency)

    return {
        "id": tx.id,
        "user_id": tx.user_id,
        "amount": amount,
        "category": tx.category,
        "date": date_str,
        "name": tx.name,
        "currency": currency,
    }


@router.post("/api/expenses")
def create_expense(
    payload: ExpenseCreate,
    user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    currency = payload.currency
    if isinstance(currency, str) and "CurrencyEnum" in globals():
        try:
            currency = CurrencyEnum(currency)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid currency")

    tx = Transaction(
        user_id=user["id"],
        amount=payload.amount,
        category=payload.category,
        date=payload.date,
        name=payload.name,
        currency=currency,
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)

    return tx.id


@router.get("/api/expenses")
def fetch_expenses(
    user: Dict[str, Any] = Depends(get_current_user),
    startDate: Optional[dt.date] = Query(None),
    endDate: Optional[dt.date] = Query(None),
    db: Session = Depends(get_db),
):
    conditions = [Transaction.user_id == user["id"]]
    if startDate:
        conditions.append(Transaction.date >= startDate)
    if endDate:
        conditions.append(Transaction.date <= endDate)

    stmt = (
        select(Transaction)
        .where(and_(*conditions))
        .order_by(Transaction.date.desc(), Transaction.id.desc())
    )
    rows = db.execute(stmt).scalars().all()
    return [to_dict(tx) for tx in rows]


@router.patch("/api/expenses/{expense_id}")
def update_expense(
    expense_id: int,
    payload: ExpenseUpdate,
    user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tx = db.get(Transaction, expense_id)
    if not tx or tx.user_id != user["id"]:
        raise HTTPException(status_code=404, detail="Not found")

    if payload.name is not None:
        tx.name = payload.name
    if payload.amount is not None:
        tx.amount = payload.amount
    if payload.currency is not None:
        tx.currency = CurrencyEnum(payload.currency) if isinstance(payload.currency, str) else payload.currency
    if payload.category is not None:
        tx.category = payload.category
    if payload.date is not None:
        tx.date = payload.date

    db.commit()
    db.refresh(tx)
    return to_dict(tx)


@router.delete("/api/expenses/{expense_id}", response_model=MessageResponse)
def delete_expense(
    expense_id: int,
    user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    tx = db.get(Transaction, expense_id)
    if not tx or tx.user_id != user["id"]:
        raise HTTPException(status_code=404, detail="Not found")

    db.delete(tx)
    db.commit()
    return {"message": "Deleted"}


@router.post("/api/expenses/analyze-invoice")
def analyze_invoice(
    file: UploadFile = File(None),
    user: Dict[str, Any] = Depends(get_current_user),
):
    if file is None:
        raise HTTPException(status_code=400, detail="No file provided")

    filename = file.filename or "Unknown"
    categories = [
        "mobile", 
        "credit", 
        "other_payments", 
        "hobby", 
        "subscriptions",
        "transport", 
        "restaurants", 
        "utility", 
        "online_shopping", 
        "debts",
    ]
    currencies = ["USD", "GBP", "PLN"]
    name = f"Invoice: {filename}"

    result = {
        "name": name,
        "amount": random.randint(1, 300),
        "currency": random.choice(currencies),
        "date": str(dt.date.today()),
        "category": random.choice(categories),
    }
    return result
