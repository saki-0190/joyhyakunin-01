# ============================================================
# FastAPI のルーター機能
# ============================================================
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session

# ============================================================
# backend パッケージ内の models.py
# ============================================================
from models import Post, User, Like

# ============================================================
# backend パッケージ内の schemas.py
# ============================================================
from schemas import PostCreate, Post as PostSchema
from deps import get_db
from security import (
    get_current_user_id,
    get_optional_user_id_from_authorization,
)

router = APIRouter()


# ============================================================
# 投稿API（POST /posts）
# ============================================================
@router.post("/posts", response_model=PostSchema)
def create_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    new_post = Post(
        user_id=current_user_id,
        poem_text=post.poem_text,
        theme=post.theme,
        image_url=post.image_url,
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return new_post


# ============================================================
# 投稿一覧API（GET /posts）
# ============================================================
@router.get("/posts")
def get_posts(
    sort: str = "latest",
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    authorization: str | None = Header(default=None),
):
    viewer_user_id = get_optional_user_id_from_authorization(
        authorization
    )

    query = db.query(Post)

    if sort == "popular":
        query = query.order_by(Post.likes_count.desc())
    else:
        query = query.order_by(Post.created_at.desc())

    # 全件数
    total = query.count()

    # ページ数
    total_pages = (total + limit - 1) // limit

    # ページ取得
    posts = (
        query.offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    items = []

    for post in posts:
        user = (
            db.query(User)
            .filter(User.id == post.user_id)
            .first()
        )

        liked_by_me = False

        if viewer_user_id is not None:
            liked_by_me = (
                db.query(Like)
                .filter(
                    Like.post_id == post.post_id,
                    Like.user_id == viewer_user_id,
                )
                .first()
                is not None
            )

        items.append(
            {
                "post_id": post.post_id,
                "user_id": post.user_id,
                "poem_text": post.poem_text,
                "theme": post.theme,
                "image_url": post.image_url,
                "likes_count": post.likes_count,
                "liked_by_me": liked_by_me,
                "created_at": (
                    post.created_at.isoformat()
                    if post.created_at
                    else None
                ),
                "author_name": (
                    user.nickname
                    if user
                    else f"ユーザー{post.user_id}"
                ),
                "author_image_url": (
                    user.profile_image_url
                    if user and user.profile_image_url
                    else "/images/profile/profile01.png"
                ),
            }
        )

    return {
        "items": items,
        "page": page,
        "limit": limit,
        "total": total,
        "totalPages": total_pages,
    }


# ============================================================
# 投稿削除API
# ============================================================
@router.delete("/posts/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    post = (
        db.query(Post)
        .filter(Post.post_id == post_id)
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    if post.user_id != current_user_id:
        raise HTTPException(
            status_code=403,
            detail="You cannot delete this post",
        )

    db.query(Like).filter(
        Like.post_id == post_id
    ).delete(synchronize_session=False)

    db.delete(post)
    db.commit()

    return {
        "ok": True,
        "post_id": post_id,
    }