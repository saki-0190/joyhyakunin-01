from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import bcrypt

from backend.crud.user import find_user_by_email, create_user

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    nickname: str

@router.post("/login")
def login(req: LoginRequest):
    user = find_user_by_email(req.email)
    if not user or not bcrypt.checkpw(req.password.encode(), user.password.encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"id": user.id, "email": user.email, "nickname": user.nickname}

@router.post("/register")
def register(req: RegisterRequest):
    hashed_pw = bcrypt.hashpw(req.password.encode(), bcrypt.gensalt()).decode()
    new_user = create_user(req.email, hashed_pw, req.nickname)
    return {"id": new_user.id, "email": new_user.email, "nickname": new_user.nickname}
