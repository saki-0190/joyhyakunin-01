# ============================================================
# FastAPI のルーター機能
# ============================================================
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

# ============================================================
# backend パッケージ内の models.py
# ============================================================
from backend.models import Post

# ============================================================
# backend パッケージ内の schemas.py
# ============================================================
from backend.schemas import PostCreate, Post as PostSchema
from backend.deps import get_db

router = APIRouter()

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
