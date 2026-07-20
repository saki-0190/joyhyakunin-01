from backend.models import User
from backend.database import SessionLocal

def find_user_by_email(email: str):
    db = SessionLocal()
    return db.query(User).filter(User.email == email).first()

def create_user(email: str, hashed_pw: str, nickname: str):
    db = SessionLocal()
    new_user = User(email=email, password=hashed_pw, nickname=nickname)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
