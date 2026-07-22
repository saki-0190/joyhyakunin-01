from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.config import DATABASE_URL

SQLALCHEMY_DATABASE_URL = DATABASE_URL or "mysql+pymysql://tech0:Gen12class3@mysql-gen12-class3.mysql.database.azure.com:3306/joyhyakunin"

if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL is not configured.")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,
    connect_args={
        "ssl": {
            "ssl_ca": "/etc/ssl/cert.pem"
            }
        }
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

import backend.models  # noqa: F401
Base.metadata.create_all(bind=engine)
