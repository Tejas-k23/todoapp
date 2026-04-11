from fastapi import APIRouter, Depends, HTTPException, status

from app.middleware.auth_middleware import get_current_user
from app.schemas.user import TokenResponse, UserLogin, UserResponse, UserSignup
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
    user = await get_user_by_name(data.name)
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
