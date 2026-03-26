from datetime import datetime, timedelta, timezone

from bson import ObjectId
from jose import jwt
from pymongo import ReturnDocument

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


async def get_user_by_id(user_id: str):
    db = get_db()
    return await db.users.find_one({"_id": ObjectId(user_id)})


async def create_user(name: str, mobile_number: str, verification_token: str):
    db = get_db()
    now = datetime.now(timezone.utc)
    user = {
        "name": name.strip(),
        "mobile_number": mobile_number,
        "last_verification_token": verification_token,
        "auth_provider": "msg91-otp",
        "created_at": now,
        "updated_at": now,
    }
    result = await db.users.insert_one(user)
    user["_id"] = result.inserted_id
    return user


async def update_user_verification(user_id: str, verification_token: str):
    db = get_db()
    now = datetime.now(timezone.utc)
    return await db.users.find_one_and_update(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "last_verification_token": verification_token,
                "updated_at": now,
            }
        },
        return_document=ReturnDocument.AFTER,
    )