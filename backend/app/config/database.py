from motor.motor_asyncio import AsyncIOMotorClient

from .settings import settings

client: AsyncIOMotorClient | None = None
db = None


async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DB_NAME]
    await db.users.create_index("mobile_number", unique=True)
    await db.tasks.create_index([("user_id", 1), ("days", 1)])
    await db.tasks.create_index([("user_id", 1), ("start_time", 1)])
    print(f"Connected to MongoDB: {settings.DB_NAME}")


async def close_db():
    global client
    if client:
        client.close()
        print("MongoDB connection closed")


def get_db():
    return db