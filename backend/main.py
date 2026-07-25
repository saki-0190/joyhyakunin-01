import config
from fastapi import FastAPI
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import OperationalError, SQLAlchemyError
from routers import likes, mypage, posts, auth
import ai
from database import check_database_connection, initialize_database

app = FastAPI()   # ← ここが一番上であることが重要

# ★ CORS を追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(posts.router)
app.include_router(likes.router)
app.include_router(mypage.router)
app.include_router(ai.router)   # ← ここに追加
app.include_router(auth.router)


@app.on_event("startup")
def on_startup() -> None:
    try:
        initialize_database()
    except OperationalError as error:
        # Keep API process alive and return 503 on DB-dependent routes.
        print(f"[startup] database initialization failed: {error}")


@app.exception_handler(OperationalError)
async def handle_db_operational_error(_: Request, error: OperationalError) -> JSONResponse:
    print(f"[db] operational error: {error}")
    return JSONResponse(
        status_code=503,
        content={"detail": "データベースに接続できません。しばらくして再試行してください。"},
    )


@app.exception_handler(SQLAlchemyError)
async def handle_sqlalchemy_error(_: Request, error: SQLAlchemyError) -> JSONResponse:
    print(f"[db] sqlalchemy error: {error}")
    return JSONResponse(
        status_code=500,
        content={"detail": "データベース処理でエラーが発生しました。"},
    )


@app.get("/health/db")
def health_db() -> dict[str, bool | str]:
    healthy = check_database_connection()
    return {
        "ok": healthy,
        "database": "up" if healthy else "down",
    }

