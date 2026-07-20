import backend.config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import likes, mypage, posts
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