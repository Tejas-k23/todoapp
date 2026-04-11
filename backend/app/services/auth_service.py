from datetime import datetime, timedelta, timezone

from bson import ObjectId
from jose import jwt

from app.config.database import get_db
from app.config.settings import settings


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])


async def get_user_by_mobile_number(mobile_number: str):
    db = get_db()
    return await db.users.find_one({"mobile_number": mobile_number})


async def get_user_by_name(name: str):
    db = get_db()
    return await db.users.find_one({"name_lower": name.strip().lower()})


async def get_user_by_id(user_id: str):
    db = get_db()
    return await db.users.find_one({"_id": ObjectId(user_id)})


async def create_user(name: str, mobile_number: str, password: str):
    db = get_db()
    now = datetime.now(timezone.utc)
    normalized_name = name.strip()
    user = {
        "name": normalized_name,
        "name_lower": normalized_name.lower(),
        "mobile_number": mobile_number,
        "password": password,
        "email": None,
        "instagram": None,
        "created_at": now,
        "updated_at": now,
    }
    result = await db.users.insert_one(user)
    user["_id"] = result.inserted_id
    return user
