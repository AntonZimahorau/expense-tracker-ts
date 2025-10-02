from datetime import date, datetime
from sqlalchemy import String, Integer, Date, Enum, ForeignKey, Text, Numeric, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.db import Base
import enum

class CurrencyEnum(enum.Enum):
    USD = "USD"
    GBP = "GBP"
    PLN = "PLN"

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=func.now())

    transactions: Mapped[list["Transaction"]] = relationship(back_populates="user", cascade="all, delete-orphan")

class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(64), nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    currency: Mapped[CurrencyEnum] = mapped_column(Enum(CurrencyEnum, name="currency_enum"), nullable=False, default=CurrencyEnum.USD)

    user: Mapped["User"] = relationship(back_populates="transactions")
