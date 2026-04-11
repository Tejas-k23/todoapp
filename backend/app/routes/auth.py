from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pymongo import ReturnDocument

from app.config.database import get_db
from app.middleware.auth_middleware import get_current_user
from app.schemas.user import (
    ChangePassword,
    TokenResponse,
    UserLogin,
    UserResponse,
    UserSignup,
    UserUpdate,
    normalize_mobile_number,
)
from app.services.auth_service import (
    create_access_token,
    create_user,
    get_user_by_name,
    get_user_by_mobile_number,
)
from app.utils.helpers import serialize_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(data: UserSignup):
    existing = await get_user_by_mobile_number(data.mobile_number)
    if existing:
        raise HTTPException(status_code=400, detail="Mobile number already registered")

    existing_name = await get_user_by_name(data.name)
    if existing_name:
        raise HTTPException(status_code=400, detail="Name already registered")

    user = await create_user(data.name, data.mobile_number, data.password)
    token = create_access_token({"sub": str(user["_id"])})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": serialize_user(user),
    }


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin):
    identifier = data.identifier or data.name or data.mobile_number
    if not identifier:
        raise HTTPException(status_code=422, detail="Name or mobile number is required")

    digits = "".join(char for char in identifier if char.isdigit())
    if len(digits) >= 10:
        normalized = normalize_mobile_number(identifier)
        user = await get_user_by_mobile_number(normalized)
    else:
        user = await get_user_by_name(identifier)
    if not user:
        raise HTTPException(status_code=404, detail="Name not registered")

    if user.get("password") != data.password:
        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_access_token({"sub": str(user["_id"])})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": serialize_user(user),
    }


@router.get("/me", response_model=UserResponse)
async def get_me(current_user=Depends(get_current_user)):
    return serialize_user(current_user)


@router.put("/profile", response_model=UserResponse)
async def update_profile(data: UserUpdate, current_user=Depends(get_current_user)):
    update_data = {
        key: value
        for key, value in data.model_dump(exclude_unset=True).items()
        if value is not None
    }
    if not update_data:
        return serialize_user(current_user)

    if "name" in update_data:
        update_data["name"] = update_data["name"].strip()
        existing_name = await get_user_by_name(update_data["name"])
        if existing_name and str(existing_name["_id"]) != str(current_user["_id"]):
            raise HTTPException(status_code=400, detail="Name already registered")
        update_data["name_lower"] = update_data["name"].lower()

    if "mobile_number" in update_data:
        existing_mobile = await get_user_by_mobile_number(update_data["mobile_number"])
        if existing_mobile and str(existing_mobile["_id"]) != str(current_user["_id"]):
            raise HTTPException(status_code=400, detail="Mobile number already registered")

    update_data["updated_at"] = datetime.now(timezone.utc)
    db = get_db()
    updated = await db.users.find_one_and_update(
        {"_id": current_user["_id"]},
        {"$set": update_data},
        return_document=ReturnDocument.AFTER,
    )
    return serialize_user(updated)


@router.put("/password")
async def change_password(data: ChangePassword, current_user=Depends(get_current_user)):
    if current_user.get("password") != data.current_password:
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    db = get_db()
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"password": data.new_password, "updated_at": datetime.now(timezone.utc)}},
    )
    return {"status": "ok"}
