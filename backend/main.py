import backend.config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import likes, mypage, posts, auth
from backend import ai

app = FastAPI()   # ← ここが一番上であることが重要

# ★ CORS を追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(posts.router)
app.include_router(likes.router)
app.include_router(mypage.router)
app.include_router(ai.router)   # ← ここに追加
app.include_router(auth.router)

from backend.database import Base, engine
import backend.models

Base.metadata.create_all(bind=engine)
