from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# backend パッケージ内の models.py
from backend.models import Like, Post

# backend パッケージ内の schemas.py
from backend.schemas import Like as LikeSchema
from backend.deps import get_db
from backend.security import get_current_user_id

router = APIRouter()

@router.post("/posts/{post_id}/like", response_model=LikeSchema)
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
        post.likes_count -= 1
        db.commit()
        return existing_like

    new_like = Like(post_id=post_id, user_id=current_user_id)
    db.add(new_like)
    post.likes_count += 1
    db.commit()
    db.refresh(new_like)
    return new_like
