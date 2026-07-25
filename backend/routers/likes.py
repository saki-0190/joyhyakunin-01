from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# backend パッケージ内の models.py
from models import Like, Post

from deps import get_db
from security import get_current_user_id

router = APIRouter()

@router.post("/posts/{post_id}/like")
def toggle_like(
    post_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    post = db.query(Post).filter(Post.post_id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_like = db.query(Like).filter(
        Like.post_id == post_id,
        Like.user_id == current_user_id
    ).first()

    if existing_like:
        db.delete(existing_like)
        post.likes_count = max((post.likes_count or 0) - 1, 0)
        db.commit()
        return {
            "liked": False,
            "likes_count": post.likes_count,
        }

    new_like = Like(post_id=post_id, user_id=current_user_id)
    db.add(new_like)
    post.likes_count = (post.likes_count or 0) + 1
    db.commit()
    return {
        "liked": True,
        "likes_count": post.likes_count,
    }
