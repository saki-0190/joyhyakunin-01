from pathlib import Path
from dotenv import load_dotenv
import os

dotenv_path = Path(__file__).resolve().parents[1] / ".env.local"
load_dotenv(dotenv_path)

DATABASE_URL = os.getenv("DATABASE_URL") or os.getenv("SQLALCHEMY_DATABASE_URL")
OPENAI_ENDPOINT = os.getenv("OPENAI_ENDPOINT")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_VERSION = os.getenv("OPENAI_API_VERSION")
OPENAI_DEPLOYMENT = os.getenv("OPENAI_DEPLOYMENT", "gpt-4o-mini")
MYSQL_SSL_CA = os.getenv("MYSQL_SSL_CA")
