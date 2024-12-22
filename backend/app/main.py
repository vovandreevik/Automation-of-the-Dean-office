from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models
from . import routers
from app.routers import groups, people, subjects, marks, analytics, user, average_grade

from app.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware


# Инициализация базы данных
models.Base.metadata.create_all(bind=engine)

# Создаем приложение FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Укажите разрешенные источники или используйте ["*"] для всех
    allow_credentials=True,
    allow_methods=["*"],  # Разрешить все методы (GET, POST, OPTIONS и т.д.)
    allow_headers=["*"],  # Разрешить все заголовки
)

# Подключаем маршруты
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(routers.groups.router, prefix="/groups", tags=["Groups"])
app.include_router(routers.people.router, prefix="/people", tags=["People"])
app.include_router(routers.subjects.router, prefix="/subjects", tags=["Subjects"])
app.include_router(routers.marks.router, prefix="/marks", tags=["Marks"])
app.include_router(user.router, prefix="/users", tags=["users"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
app.include_router(average_grade.router, prefix="/average_grade", tags=["average_grade"])

# Зависимость для работы с базой данных
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
