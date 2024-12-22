from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Group, User
from app.schemas import GroupCreate, GroupRead, GroupUpdate
from app.auth import get_current_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def admin_only(user: User):
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can perform this action"
        )

@router.get("/", response_model=list[GroupRead])
def read_groups(
    skip: int = 0,
    limit: int = 100000,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Проверка на авторизацию
):
    # Все пользователи могут видеть список групп
    return db.query(Group).offset(skip).limit(limit).all()

@router.post("/", response_model=GroupRead)
def create_group(
    group: GroupCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Только администратор может создавать группы
    admin_only(current_user)
    db_group = Group(name=group.name)
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

@router.delete("/{group_id}", response_model=GroupRead)
def delete_group(
    group_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Только администратор может удалять группы
    admin_only(current_user)
    db_group = db.query(Group).filter(Group.id == group_id).first()
    if db_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    db.delete(db_group)
    db.commit()
    return db_group

@router.put("/{group_id}", response_model=GroupRead)
def update_group(
    group_id: int,
    group: GroupUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Только администратор может обновлять группы
    admin_only(current_user)
    db_group = db.query(Group).filter(Group.id == group_id).first()
    if db_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    
    # Обновляем поля в группе
    db_group.name = group.name
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group
