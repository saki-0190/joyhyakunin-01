from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from backend.database import Base

# ============================================
# posts テーブル
# ============================================
class Post(Base):
    __tablename__ = "posts"

    # 主キー
    post_id = Column(Integer, primary_key=True, index=True)

    # 投稿者ID
    user_id = Column(Integer, index=True, nullable=False)

    # 俳句・詩本文（長文になるので Text に変更）
    # MySQL は String(長さなし) が使えないため、Text が最適
    poem_text = Column(Text, nullable=False)

    # テーマ（短い文字列なので String(255)）
    theme = Column(String(255), nullable=False)

    # 画像URL（長くなる可能性があるので String(500)）
    image_url = Column(String(500))

    # いいね数
    likes_count = Column(Integer, default=0)

    # 作成日時
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ============================================
# likes テーブル
# ============================================
class Like(Base):
    __tablename__ = "likes"

    # 主キー
    like_id = Column(Integer, primary_key=True, index=True)

    # posts.post_id への外部キー
    post_id = Column(Integer, ForeignKey("posts.post_id"), nullable=False)

    # いいねしたユーザーID
    user_id = Column(Integer, nullable=False)

    # 作成日時
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# ============================================
# users テーブル
# ============================================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    nickname = Column(String(255), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
