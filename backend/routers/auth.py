from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import bcrypt

from backend.crud.user import find_user_by_email, create_user, find_user_by_id, update_user
from backend.security import create_access_token, get_current_user_id

router = APIRouter()

DUPLICATE_EMAIL_MESSAGE = "そのメールアドレスは既に使用されています"

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    nickname: str
    full_name: str
    industry: str

class UpdateUserRequest(BaseModel):
    email: str
    nickname: str
    full_name: str
    industry: str
    profile_image_url: str
    password: str | None = None

@router.post("/login")
def login(req: LoginRequest):
    user = find_user_by_email(req.email)
    if not user or not bcrypt.checkpw(req.password.encode(), user.password.encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "id": user.id,
        "email": user.email,
        "nickname": user.nickname,
        "full_name": user.full_name or "",
        "industry": user.industry or "",
        "profile_image_url": user.profile_image_url or "/images/profile/profile01.png",
        "access_token": create_access_token(user.id),
    }

@router.post("/register")
def register(req: RegisterRequest):
    hashed_pw = bcrypt.hashpw(req.password.encode(), bcrypt.gensalt()).decode()
    try:
        new_user = create_user(req.email, hashed_pw, req.nickname, req.full_name, req.industry)
    except ValueError:
        raise HTTPException(status_code=409, detail=DUPLICATE_EMAIL_MESSAGE)

    return {
        "id": new_user.id,
        "email": new_user.email,
        "nickname": new_user.nickname,
        "full_name": new_user.full_name or "",
        "industry": new_user.industry or "",
        "profile_image_url": new_user.profile_image_url or "/images/profile/profile01.png",
        "access_token": create_access_token(new_user.id),
    }

@router.put("/users/{user_id}")
def edit_user(user_id: int, req: UpdateUserRequest, current_user_id: int = Depends(get_current_user_id)):
    if current_user_id != user_id:
        raise HTTPException(status_code=403, detail="You cannot edit this user")

    user = find_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    existing_user = find_user_by_email(req.email)
    if existing_user and existing_user.id != user_id:
        raise HTTPException(status_code=409, detail=DUPLICATE_EMAIL_MESSAGE)

    hashed_pw = None
    if req.password:
        hashed_pw = bcrypt.hashpw(req.password.encode(), bcrypt.gensalt()).decode()

    updated_user = update_user(
        user_id=user_id,
        email=req.email,
        nickname=req.nickname,
        full_name=req.full_name,
        industry=req.industry,
        profile_image_url=req.profile_image_url,
        hashed_pw=hashed_pw,
    )
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": updated_user.id,
        "email": updated_user.email,
        "nickname": updated_user.nickname,
        "full_name": updated_user.full_name or "",
        "industry": updated_user.industry or "",
        "profile_image_url": updated_user.profile_image_url or "/images/profile/profile01.png",
        "access_token": create_access_token(updated_user.id),
    }
