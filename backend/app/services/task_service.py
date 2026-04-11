from datetime import datetime, timezone

from fastapi import HTTPException


def validate_task_payload(start_time: str, end_time: str):
    if start_time >= end_time:
        raise HTTPException(
            status_code=400,
            detail="End time must be later than start time",
        )


def build_task_payload(data: dict, user_id: str, is_update: bool = False):
    now = datetime.now(timezone.utc)
    payload = dict(data)
    payload["user_id"] = user_id
    if "description" in payload and payload["description"] is None:
        payload["description"] = ""
    if "days" in payload and payload["days"] is not None:
        payload["days"] = list(dict.fromkeys(payload["days"]))
    payload["updated_at"] = now
    if not is_update:
        payload.setdefault("description", "")
        payload.setdefault("notification_enabled", False)
        payload.setdefault("completed", False)
        payload.setdefault("priority", "medium")
        payload.setdefault("days", [])
        payload.setdefault("date", None)
        payload["created_at"] = now
    return payload
