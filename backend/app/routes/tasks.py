from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pymongo import ReturnDocument

from app.config.database import get_db
from app.middleware.auth_middleware import get_current_user
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.services.task_service import build_task_payload, validate_task_payload
from app.utils.helpers import parse_object_id, serialize_task

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/", response_model=List[TaskResponse])
async def get_tasks(day: Optional[str] = None, current_user=Depends(get_current_user)):
    db = get_db()
    query = {"user_id": str(current_user["_id"])}
    if day:
        query["days"] = {"$in": [day]}
    tasks = await db.tasks.find(query).sort("start_time", 1).to_list(1000)
    return [serialize_task(task) for task in tasks]


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(data: TaskCreate, current_user=Depends(get_current_user)):
    db = get_db()
    payload = build_task_payload(data.model_dump(), str(current_user["_id"]))
    validate_task_payload(payload["start_time"], payload["end_time"])
    result = await db.tasks.insert_one(payload)
    payload["_id"] = result.inserted_id
    return serialize_task(payload)


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str, current_user=Depends(get_current_user)):
    db = get_db()
    task = await db.tasks.find_one(
        {"_id": parse_object_id(task_id), "user_id": str(current_user["_id"])}
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return serialize_task(task)


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: str, data: TaskUpdate, current_user=Depends(get_current_user)):
    db = get_db()
    task_object_id = parse_object_id(task_id)
    update_data = {key: value for key, value in data.model_dump().items() if value is not None}
    if "start_time" in update_data or "end_time" in update_data:
        existing = await db.tasks.find_one(
            {"_id": task_object_id, "user_id": str(current_user["_id"])}
        )
        if not existing:
            raise HTTPException(status_code=404, detail="Task not found")
        validate_task_payload(
            update_data.get("start_time", existing["start_time"]),
            update_data.get("end_time", existing["end_time"]),
        )

    update_data = build_task_payload(update_data, str(current_user["_id"]), is_update=True)
    result = await db.tasks.find_one_and_update(
        {"_id": task_object_id, "user_id": str(current_user["_id"])},
        {"$set": update_data},
        return_document=ReturnDocument.AFTER,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Task not found")
    return serialize_task(result)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: str, current_user=Depends(get_current_user)):
    db = get_db()
    result = await db.tasks.delete_one(
        {"_id": parse_object_id(task_id), "user_id": str(current_user["_id"])}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_all_tasks(current_user=Depends(get_current_user)):
    db = get_db()
    await db.tasks.delete_many({"user_id": str(current_user["_id"])})
