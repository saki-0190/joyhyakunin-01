from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

from backend.config import DATABASE_URL


def get_database_url() -> str:
    if DATABASE_URL:
        return DATABASE_URL

    return "mysql+pymysql://tech0:Gen12class3@mysql-gen12-class3.mysql.database.azure.com:3306/joyhyakunin"


SQLALCHEMY_DATABASE_URL = get_database_url()

engine_kwargs = {
    "pool_pre_ping": True,
    "connect_args": {
        "ssl": {"ssl_ca": "/etc/ssl/cert.pem"},
    },
}

engine = create_engine(SQLALCHEMY_DATABASE_URL, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

import backend.models  # noqa: F401
Base.metadata.create_all(bind=engine)


def ensure_profile_image_column() -> None:
    inspector = inspect(engine)
    table_names = inspector.get_table_names()
    if "users" not in table_names:
        return

    columns = {column["name"] for column in inspector.get_columns("users")}
    if "profile_image_url" in columns:
        return

    with engine.begin() as connection:
        connection.execute(
            text("ALTER TABLE users ADD COLUMN profile_image_url VARCHAR(500) DEFAULT '/images/profile/profile01.png'")
        )
        connection.execute(
            text("UPDATE users SET profile_image_url = '/images/profile/profile01.png' WHERE profile_image_url IS NULL")
        )


def ensure_user_profile_columns() -> None:
    inspector = inspect(engine)
    table_names = inspector.get_table_names()
    if "users" not in table_names:
        return

    columns = {column["name"] for column in inspector.get_columns("users")}

    with engine.begin() as connection:
        if "full_name" not in columns:
            connection.execute(text("ALTER TABLE users ADD COLUMN full_name VARCHAR(255) DEFAULT ''"))
            connection.execute(text("UPDATE users SET full_name = '' WHERE full_name IS NULL"))

        if "industry" not in columns:
            connection.execute(text("ALTER TABLE users ADD COLUMN industry VARCHAR(255) DEFAULT ''"))
            connection.execute(text("UPDATE users SET industry = '' WHERE industry IS NULL"))


def ensure_like_uniqueness() -> None:
    inspector = inspect(engine)
    table_names = inspector.get_table_names()
    if "likes" not in table_names or "posts" not in table_names:
        return

    existing_index_names = {index["name"] for index in inspector.get_indexes("likes")}
    existing_unique_names = {constraint["name"] for constraint in inspector.get_unique_constraints("likes")}

    with engine.begin() as connection:
        # Keep the oldest like per (post_id, user_id) and remove accidental duplicates.
        connection.execute(
            text(
                "DELETE FROM likes "
                "WHERE like_id NOT IN ("
                "SELECT kept_like_id FROM ("
                "SELECT MIN(like_id) AS kept_like_id FROM likes GROUP BY post_id, user_id"
                ") AS dedup"
                ")"
            )
        )

        # Recalculate cached likes_count to match current likes table.
        connection.execute(
            text(
                "UPDATE posts "
                "SET likes_count = (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.post_id)"
            )
        )

        if "ux_likes_post_user" not in existing_index_names and "ux_likes_post_user" not in existing_unique_names:
            connection.execute(text("CREATE UNIQUE INDEX ux_likes_post_user ON likes (post_id, user_id)"))


ensure_profile_image_column()
ensure_user_profile_columns()
ensure_like_uniqueness()
