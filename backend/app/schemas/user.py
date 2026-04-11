from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator


def normalize_mobile_number(value: str) -> str:
    digits = "".join(char for char in value if char.isdigit())
    if len(digits) < 10 or len(digits) > 15:
        raise ValueError("Enter a valid mobile number")
    return digits


class UserSignup(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    mobile_number: str
    password: str = Field(..., min_length=4, max_length=200)

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile_number(cls, value: str):
        return normalize_mobile_number(value)


class UserLogin(BaseModel):
    identifier: str | None = None
    name: str | None = None
    mobile_number: str | None = None
    password: str = Field(..., min_length=4, max_length=200)

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile_number(cls, value: str | None):
        if value is None:
            return value
        return normalize_mobile_number(value)


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=80)
    mobile_number: str | None = None
    email: EmailStr | None = None
    instagram: str | None = Field(default=None, max_length=120)

    @field_validator("mobile_number")
    @classmethod
    def validate_update_mobile_number(cls, value: str | None):
        if value is None:
            return value
        return normalize_mobile_number(value)

    @field_validator("instagram")
    @classmethod
    def normalize_instagram(cls, value: str | None):
        if value is None:
            return value
        value = value.strip()
        if value.startswith("@"):
            value = value[1:]
        return value or None


class ChangePassword(BaseModel):
    current_password: str = Field(..., min_length=4, max_length=200)
    new_password: str = Field(..., min_length=4, max_length=200)


class UserResponse(BaseModel):
    id: str
    name: str
    mobile_number: str
    email: EmailStr | None = None
    instagram: str | None = None
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
