import base64
import hashlib
import hmac
import json
import os
import time

from fastapi import Header, HTTPException


TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7


def _get_secret() -> bytes:
    secret = os.getenv("AUTH_SECRET") or os.getenv("NEXTAUTH_SECRET") or "dev-auth-secret-change-me"
    return secret.encode("utf-8")


def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")


def _b64url_decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode((value + padding).encode("utf-8"))


def create_access_token(user_id: int) -> str:
    payload = {
        "sub": user_id,
        "exp": int(time.time()) + TOKEN_TTL_SECONDS,
    }
    payload_json = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    payload_b64 = _b64url_encode(payload_json)
    signature = hmac.new(_get_secret(), payload_b64.encode("utf-8"), hashlib.sha256).digest()
    signature_b64 = _b64url_encode(signature)
    return f"{payload_b64}.{signature_b64}"


def _decode_and_validate_token(token: str) -> dict:
    try:
        payload_b64, signature_b64 = token.split(".", 1)
    except ValueError as error:
        raise HTTPException(status_code=401, detail="Invalid token") from error

    expected_signature = hmac.new(
        _get_secret(), payload_b64.encode("utf-8"), hashlib.sha256
    ).digest()
    expected_signature_b64 = _b64url_encode(expected_signature)

    if not hmac.compare_digest(signature_b64, expected_signature_b64):
        raise HTTPException(status_code=401, detail="Invalid token")

    try:
        payload = json.loads(_b64url_decode(payload_b64).decode("utf-8"))
    except (json.JSONDecodeError, ValueError, UnicodeDecodeError) as error:
        raise HTTPException(status_code=401, detail="Invalid token payload") from error

    expires_at = payload.get("exp")
    if not isinstance(expires_at, int) or expires_at < int(time.time()):
        raise HTTPException(status_code=401, detail="Token expired")

    return payload


def get_current_user_id(authorization: str | None = Header(default=None)) -> int:
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header is required")

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    payload = _decode_and_validate_token(token)
    user_id = payload.get("sub")
    if not isinstance(user_id, int):
        raise HTTPException(status_code=401, detail="Invalid token subject")
    return user_id
