from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# backend パッケージ内の database.py
from backend.database import SessionLocal

# backend パッケージ内の models.py
from backend.models import Like, Post

# backend パッケージ内の schemas.py
from backend.schemas import Like as LikeSchema

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/posts/{post_id}/like", response_model=LikeSchema)
def toggle_like(post_id: int, user_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.post_id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_like = db.query(Like).filter(
        Like.post_id == post_id,
        Like.user_id == user_id
    ).first()

    if existing_like:
        db.delete(existing_like)
        post.likes_count -= 1
        db.commit()
        return existing_like

    new_like = Like(post_id=post_id, user_id=user_id)
    db.add(new_like)
    post.likes_count += 1
    db.commit()
    db.refresh(new_like)
    return new_like
