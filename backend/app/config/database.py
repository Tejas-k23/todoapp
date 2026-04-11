from motor.motor_asyncio import AsyncIOMotorClient

from .settings import settings

client: AsyncIOMotorClient | None = None
db = None


async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DB_NAME]
    # Clean up legacy unique index that blocks inserts when email is missing.
    indexes = [index async for index in db.users.list_indexes()]
    for index in indexes:
        if index.get("name") == "email_1":
            await db.users.drop_index("email_1")
            break
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
