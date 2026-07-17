from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite のローカルDB
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# ORM モデルを読み込んでからテーブルを作成する
# これにより、models.py に定義されたテーブルが create_all で登録される
import backend.models  # noqa: F401

# テーブルが存在しない場合は自動作成
Base.metadata.create_all(bind=engine)
