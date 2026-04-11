from datetime import datetime

from pydantic import BaseModel, Field, field_validator


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
    name: str = Field(..., min_length=2, max_length=80)
    password: str = Field(..., min_length=4, max_length=200)

    @field_validator("mobile_number")
    @classmethod
    def validate_mobile_number(cls, value: str):
        return normalize_mobile_number(value)


class UserResponse(BaseModel):
    id: str
    name: str
    mobile_number: str
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
