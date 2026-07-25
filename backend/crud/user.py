from models import User
from database import SessionLocal
from sqlalchemy.exc import IntegrityError

def find_user_by_email(email: str):
    db = SessionLocal()
    try:
        return db.query(User).filter(User.email == email).first()
    finally:
        db.close()

def create_user(
    email: str,
    hashed_pw: str,
    nickname: str,
    full_name: str,
    industry: str,
    profile_image_url: str = "/images/profile/profile01.png",
):
    db = SessionLocal()
    try:
        new_user = User(
            email=email,
            password=hashed_pw,
            nickname=nickname,
            full_name=full_name,
            industry=industry,
            profile_image_url=profile_image_url,
        )
        db.add(new_user)
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            raise ValueError("Email is already in use")
        db.refresh(new_user)
        return new_user
    finally:
        db.close()

def find_user_by_id(user_id: int):
    db = SessionLocal()
    try:
        return db.query(User).filter(User.id == user_id).first()
    finally:
        db.close()

def update_user(
    user_id: int,
    email: str,
    nickname: str,
    full_name: str,
    industry: str,
    profile_image_url: str,
    hashed_pw: str | None = None,
):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None

        user.email = email
        user.nickname = nickname
        user.full_name = full_name
        user.industry = industry
        user.profile_image_url = profile_image_url
        if hashed_pw:
            user.password = hashed_pw

        db.commit()
        db.refresh(user)
        return user
    finally:
        db.close()
