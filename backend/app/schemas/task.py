from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator

VALID_DAYS = {"S", "M", "T", "W", "Th", "F", "Sa"}


class TaskCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    description: Optional[str] = ""
    days: List[str]
    start_time: str
    end_time: str
    notification_enabled: Optional[bool] = False

    @field_validator("days")
    @classmethod
    def validate_days(cls, value: List[str]):
        if not value:
            raise ValueError("At least one day is required")
        if any(day not in VALID_DAYS for day in value):
            raise ValueError("Invalid day selection")
        return value


class TaskUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=120)
    description: Optional[str] = None
    days: Optional[List[str]] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    notification_enabled: Optional[bool] = None

    @field_validator("days")
    @classmethod
    def validate_days(cls, value: Optional[List[str]]):
        if value is None:
            return value
        if not value:
            raise ValueError("At least one day is required")
        if any(day not in VALID_DAYS for day in value):
            raise ValueError("Invalid day selection")
        return value


class TaskResponse(BaseModel):
    id: str
    user_id: str
    name: str
    description: str
    days: List[str]
    start_time: str
    end_time: str
    notification_enabled: bool
    created_at: datetime
    updated_at: datetime
