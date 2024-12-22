from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime  # Добавьте этот импорт в начало файла
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Mark
from app.schemas import MarkCreate, MarkRead
from app.auth import get_current_user  # Импортируем функцию для получения текущего пользователя
from app.models import User  # Импортируем модель пользователя для проверки роли

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Функция для проверки, является ли пользователь администратором
def is_admin(user: User):
    return user.role == "admin"

@router.get("/", response_model=list[MarkRead])
def read_marks(skip: int = 0, limit: int = 100000, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Пользователи могут только читать оценки
    return db.query(Mark).offset(skip).limit(limit).all()

@router.post("/", response_model=MarkRead)
def create_mark(mark: MarkCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action"
        )
    
    # Если дата не передана, она будет установлена на сервере
    if not mark.created_at:
        mark.created_at = datetime.utcnow()

    db_mark = Mark(
        student_id=mark.student_id,
        subject_id=mark.subject_id,
        teacher_id=mark.teacher_id,
        value=mark.value,
        created_at=mark.created_at  # Добавляем дату выставления оценки
    )
    
    db.add(db_mark)
    db.commit()
    db.refresh(db_mark)
    return db_mark

@router.delete("/{mark_id}", response_model=MarkRead)
def delete_mark(mark_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action"
        )
    db_mark = db.query(Mark).filter(Mark.id == mark_id).first()
    if db_mark is None:
        raise HTTPException(status_code=404, detail="Mark not found")
    db.delete(db_mark)
    db.commit()
    return db_mark

@router.put("/{mark_id}", response_model=MarkRead)
def update_mark(mark_id: int, mark: MarkCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action"
        )
    
    db_mark = db.query(Mark).filter(Mark.id == mark_id).first()
    if db_mark is None:
        raise HTTPException(status_code=404, detail="Mark not found")

    db_mark.student_id = mark.student_id
    db_mark.subject_id = mark.subject_id
    db_mark.teacher_id = mark.teacher_id
    db_mark.value = mark.value
    db_mark.created_at = mark.created_at if mark.created_at else db_mark.created_at  # Если дата не передана, оставляем существующую
    
    db.add(db_mark)
    db.commit()
    db.refresh(db_mark)
    return db_mark
