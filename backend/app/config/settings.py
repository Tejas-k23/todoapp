from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    MONGO_URI: str
    DB_NAME: str = "timetable_db"
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    FRONTEND_URL: str = "http://localhost:5173"
    FRONTEND_URLS: str = (
        "http://localhost:5173,"
        "http://127.0.0.1:5173,"
        "https://todoapp-iota-puce.vercel.app"
    )

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def frontend_origins(self) -> list[str]:
        origins = [
            origin.strip()
            for origin in self.FRONTEND_URLS.split(",")
            if origin.strip()
        ]
        if self.FRONTEND_URL not in origins:
            origins.append(self.FRONTEND_URL)
        return origins


settings = Settings()

