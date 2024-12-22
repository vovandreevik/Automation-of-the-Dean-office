from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Person
from app.schemas import PersonCreate, PersonRead, PersonUpdate
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

@router.get("/", response_model=list[PersonRead])
def read_people(skip: int = 0, limit: int = 10000, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Пользователи могут только читать данные о людях
    return db.query(Person).offset(skip).limit(limit).all()

@router.post("/", response_model=PersonRead)
def create_person(person: PersonCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action"
        )
    db_person = Person(
        first_name=person.first_name,
        last_name=person.last_name,
        father_name=person.father_name,
        group_id=person.group_id,
        type=person.type
    )
    db.add(db_person)
    db.commit()
    db.refresh(db_person)
    return db_person

@router.delete("/{person_id}", response_model=PersonRead)
def delete_person(person_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action"
        )
    db_person = db.query(Person).filter(Person.id == person_id).first()
    if db_person is None:
        raise HTTPException(status_code=404, detail="Person not found")
    db.delete(db_person)
    db.commit()
    return db_person

@router.put("/{person_id}", response_model=PersonRead)
def update_person(person_id: int, person: PersonUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not is_admin(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action"
        )
    db_person = db.query(Person).filter(Person.id == person_id).first()
    if db_person is None:
        raise HTTPException(status_code=404, detail="Person not found")

    db_person.first_name = person.first_name
    db_person.last_name = person.last_name
    db_person.father_name = person.father_name
    db_person.group_id = person.group_id
    db_person.type = person.type
    db.add(db_person)
    db.commit()
    db.refresh(db_person)
    return db_person
