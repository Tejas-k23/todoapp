from bson import ObjectId
from fastapi import HTTPException


def parse_object_id(value: str) -> ObjectId:
    if not ObjectId.is_valid(value):
        raise HTTPException(status_code=400, detail="Invalid ID")
    return ObjectId(value)


def serialize_user(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "mobile_number": user["mobile_number"],
        "email": user.get("email"),
        "instagram": user.get("instagram"),
        "created_at": user["created_at"],
    }


def serialize_task(task: dict) -> dict:
    return {
        "id": str(task["_id"]),
        "name": task["name"],
        "description": task.get("description", ""),
        "days": task.get("days") or [],
        "date": task.get("date"),
        "start_time": task["start_time"],
        "end_time": task["end_time"],
        "notification_enabled": task.get("notification_enabled", False),
        "completed": task.get("completed", False),
        "priority": task.get("priority", "medium"),
        "created_at": task["created_at"],
        "updated_at": task["updated_at"],
    }
