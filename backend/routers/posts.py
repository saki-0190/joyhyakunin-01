# ============================================================
# FastAPI のルーター機能
# ============================================================
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

# ============================================================
# backend パッケージ内の database.py
# main.py が backend.main として起動されるため、
# routers/posts.py から見た database.py は backend.database になる
# ============================================================
from backend.database import SessionLocal

# ============================================================
# backend パッケージ内の models.py
# ============================================================
from backend.models import Post

# ============================================================
# backend パッケージ内の schemas.py
# ============================================================
from backend.schemas import PostCreate, Post as PostSchema

router = APIRouter()

# ============================================================
# DB セッション取得
# ============================================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ============================================================
# 投稿API（POST /posts）
# ============================================================
@router.post("/posts", response_model=PostSchema)
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    new_post = Post(
        user_id=post.user_id,
        poem_text=post.poem_text,
        theme=post.theme,
        image_url=post.image_url
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

# ============================================================
# 投稿一覧API（GET /posts）
# ============================================================
@router.get("/posts", response_model=list[PostSchema])
def get_posts(sort: str = "new", db: Session = Depends(get_db)):
    if sort == "popular":
        posts = db.query(Post).order_by(Post.likes_count.desc()).all()
    else:
        posts = db.query(Post).order_by(Post.created_at.desc()).all()
    return posts
