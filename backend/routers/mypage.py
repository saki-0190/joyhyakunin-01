# ============================================================
# マイページ API
# ============================================================
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

# backend パッケージの DB / モデル
from backend.models import Post, Like, User
from backend.deps import get_db

router = APIRouter()

# ============================================================
# マイページ API
# GET /mypage/{user_id}
# ============================================================
@router.get("/mypage/{user_id}")
def get_mypage(user_id: int, db: Session = Depends(get_db)):
    profile_user = db.query(User).filter(User.id == user_id).first()
    profile = {
        "id": user_id,
        "nickname": profile_user.nickname if profile_user else f"ユーザー{user_id}",
        "email": profile_user.email if profile_user else "",
        "full_name": profile_user.full_name if profile_user and profile_user.full_name else "",
        "industry": profile_user.industry if profile_user and profile_user.industry else "",
        "profile_image_url": profile_user.profile_image_url if profile_user and profile_user.profile_image_url else "/images/profile/profile01.png",
    }

    # ① 自分の投稿一覧（新しい順）
    my_posts = db.query(Post).filter(Post.user_id == user_id).order_by(Post.created_at.desc()).all()

    # ② 自分が押した「わかる！」一覧（新しい順）
    my_likes_given = (
        db.query(Like, Post)
        .join(Post, Like.post_id == Post.post_id)
        .filter(Like.user_id == user_id)
        .order_by(Like.created_at.desc())
        .all()
    )

    # ③ 自分が受け取った「わかる！」一覧（新しい順）
    my_likes_received = (
        db.query(Like, Post)
        .join(Post, Like.post_id == Post.post_id)
        .filter(Post.user_id == user_id)
        .order_by(Like.created_at.desc())
        .all()
    )

    def serialize_post(post: Post) -> dict:
        user = db.query(User).filter(User.id == post.user_id).first()
        return {
            "post_id": post.post_id,
            "user_id": post.user_id,
            "poem_text": post.poem_text,
            "theme": post.theme,
            "image_url": post.image_url,
            "likes_count": post.likes_count,
            "created_at": post.created_at.isoformat() if post.created_at else None,
            "author_name": user.nickname if user else f"ユーザー{post.user_id}",
            "author_image_url": user.profile_image_url if user and user.profile_image_url else "/images/profile/profile01.png",
        }

    return {
        "profile": profile,
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
