from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from backend.config import DATABASE_URL

SQLALCHEMY_DATABASE_URL = (
    DATABASE_URL
    or "mysql+pymysql://tech0:Gen12class3@mysql-gen12-class3.mysql.database.azure.com:3306/joyhyakunin"
)

if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL is not configured.")

# プロジェクトルート
BASE_DIR = Path(__file__).resolve().parents[1]

# SSL証明書
SSL_CERT = BASE_DIR / "certs" / "DigiCertGlobalRootG2.crt.pem"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,
    connect_args={
        "ssl": {
            "ca": str(SSL_CERT)
        }
    },
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()

import backend.models  # noqa: F401

Base.metadata.create_all(bind=engine)