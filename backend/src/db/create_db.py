from .db import engine, Base
from . import db_models

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Tables created.")
