from datetime import datetime
from typing import List, Optional
from datetime import datetime

from pydantic import BaseModel, Field, field_validator

VALID_DAYS = {"S", "M", "T", "W", "Th", "F", "Sa"}


class TaskCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    description: Optional[str] = ""
    days: Optional[List[str]] = None
    date: Optional[str] = None
    start_time: str
    end_time: str
    notification_enabled: Optional[bool] = False
    completed: Optional[bool] = False
    priority: Optional[str] = "medium"

    @field_validator("days")
    @classmethod
    def validate_days(cls, value: Optional[List[str]]):
        if value is None:
            return value
        if not value:
            return value
        if any(day not in VALID_DAYS for day in value):
            raise ValueError("Invalid day selection")
        return value

    @field_validator("date")
    @classmethod
    def validate_date(cls, value: Optional[str]):
        if value is None:
            return value
        try:
            datetime.strptime(value, "%Y-%m-%d")
        except ValueError as exc:
            raise ValueError("Date must be in YYYY-MM-DD format") from exc
        return value


class TaskUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=120)
    description: Optional[str] = None
    days: Optional[List[str]] = None
    date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    notification_enabled: Optional[bool] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None

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

    @field_validator("date")
    @classmethod
    def validate_update_date(cls, value: Optional[str]):
        if value is None:
            return value
        try:
            datetime.strptime(value, "%Y-%m-%d")
        except ValueError as exc:
            raise ValueError("Date must be in YYYY-MM-DD format") from exc
        return value


class TaskResponse(BaseModel):
    id: str
    name: str
    description: str
    days: List[str]
    date: Optional[str] = None
    start_time: str
    end_time: str
    notification_enabled: bool
    completed: bool
    priority: str
    created_at: datetime
    updated_at: datetime
