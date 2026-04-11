from motor.motor_asyncio import AsyncIOMotorClient

from .settings import settings

client: AsyncIOMotorClient | None = None
db = None


async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DB_NAME]
    await db.tasks.create_index("days")
    await db.tasks.create_index("start_time")
    print(f"Connected to MongoDB: {settings.DB_NAME}")


async def close_db():
    global client
    if client:
        client.close()
        print("MongoDB connection closed")


def get_db():
    return db
