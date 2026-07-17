# ============================================================
# マイページ API
# ============================================================
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# backend パッケージの DB / モデル / スキーマ
from backend.database import SessionLocal
from backend.models import Post, Like

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
# マイページ API
# GET /mypage/{user_id}
# ============================================================
@router.get("/mypage/{user_id}")
def get_mypage(user_id: int, db: Session = Depends(get_db)):

    # ① 自分の投稿一覧
    my_posts = db.query(Post).filter(Post.user_id == user_id).all()

    # ② 自分が押した「わかる！」一覧
    my_likes_given = (
        db.query(Like, Post)
        .join(Post, Like.post_id == Post.post_id)
        .filter(Like.user_id == user_id)
        .all()
    )

    # ③ 自分が受け取った「わかる！」一覧
    my_likes_received = (
        db.query(Like, Post)
        .join(Post, Like.post_id == Post.post_id)
        .filter(Post.user_id == user_id)
        .all()
    )

    def serialize_post(post: Post) -> dict:
        return {
            "post_id": post.post_id,
            "user_id": post.user_id,
            "poem_text": post.poem_text,
            "theme": post.theme,
            "image_url": post.image_url,
            "likes_count": post.likes_count,
            "created_at": post.created_at.isoformat() if post.created_at else None,
        }

    return {
        "my_posts": [serialize_post(post) for post in my_posts],
        "my_likes_given": [
            {
                "like_id": like.like_id,
                "post": serialize_post(post),
                "created_at": like.created_at.isoformat() if like.created_at else None,
            }
            for like, post in my_likes_given
        ],
        "my_likes_received": [
            {
                "like_id": like.like_id,
                "liked_by_user_id": like.user_id,
                "post": serialize_post(post),
                "created_at": like.created_at.isoformat() if like.created_at else None,
            }
            for like, post in my_likes_received
        ],
    }
