# ============================================================
# FastAPI のルーター機能
# ============================================================
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

# ============================================================
# backend パッケージ内の models.py
# ============================================================
from backend.models import Post, Like

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
@router.get("/posts")
def get_posts(
    sort: str = "latest", 
    page: int = 1,       # ページ番号を受け取る（デフォルト1）
    limit: int = 10,     # 1ページあたりの件数（デフォルト10）
    current_user_id: int = 1, # 💡 ログインユーザーID（デフォルト1）
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit

    # 総件数を取得
    total_count = db.query(Post).count()

    # 並び順の判定
    query = db.query(Post)
    if sort == "popular":
        query = query.order_by(Post.likes_count.desc())
    else:
        query = query.order_by(Post.created_at.desc())

    # 指定ページ用の10件を取得
    posts = query.offset(offset).limit(limit).all()

    # 💡 ユーザーがすでに「わかる！」している post_id のセットを取得
    liked_post_ids = set(
        like.post_id for like in db.query(Like.post_id).filter(Like.user_id == current_user_id).all()
    )

    # 💡 各投稿データに is_liked（いいね状態）を含めて辞書化
    items = []
    for post in posts:
        user_icon = getattr(getattr(post, "user", None), "icon", "1")

        items.append({
            "post_id": post.post_id,
            "user_id": post.user_id,
            "poem_text": post.poem_text,
            "theme": getattr(post, "theme", ""),
            "image_url": getattr(post, "image_url", ""),
            "likes_count": getattr(post, "likes_count", 0),
            "created_at": post.created_at.isoformat() if post.created_at else None,
            "icon": user_icon,
            "is_liked": post.post_id in liked_post_ids  # 👈 ここを追加！
        })

    # 総ページ数の計算
    total_pages = (total_count + limit - 1) // limit if total_count > 0 else 1

    return {
        "items": items,
        "totalPages": total_pages,
        "total": total_count
    }

# ============================================================
# わかる！（いいね）トグルAPI（POST /posts/{post_id}/like）
# ============================================================
@router.post("/posts/{post_id}/like")
def toggle_like(post_id: int, user_id: int = 1, db: Session = Depends(get_db)):
    # 投稿が存在するかチェック
    post = db.query(Post).filter(Post.post_id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="投稿が見つかりません")

    # 既にいいねしているか確認
    existing_like = db.query(Like).filter(
        Like.post_id == post_id,
        Like.user_id == user_id
    ).first()

    if existing_like:
        # 解除処理
        db.delete(existing_like)
        post.likes_count = max(0, post.likes_count - 1)
        is_liked = False
    else:
        # 追加処理
        new_like = Like(post_id=post_id, user_id=user_id)
        db.add(new_like)
        post.likes_count += 1
        is_liked = True

    db.commit()
    db.refresh(post)

    return {
        "likes_count": post.likes_count,
        "is_liked": is_liked
    }

# ============================================================
# 投稿削除API（DELETE /posts/{post_id}）
# ============================================================
@router.delete("/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    # 削除対象の投稿を検索
    post = db.query(Post).filter(Post.post_id == post_id).first()
    
    # 見つからない場合は 404 エラー
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="該当の投稿が見つかりません"
        )
    
    # likes テーブルに関連データ（いいね）が紐づいている場合は先に削除
    db.query(Like).filter(Like.post_id == post_id).delete()

    # データベースから投稿本体を削除
    db.delete(post)
    db.commit()
    
    return {"message": "削除に成功しました", "post_id": post_id}