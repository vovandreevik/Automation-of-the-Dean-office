from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class GroupBase(BaseModel):
    name: str

class GroupCreate(GroupBase):
    pass

class GroupRead(GroupBase):
    id: int

    class Config:
        orm_mode = True

class GroupUpdate(BaseModel):
    name: str  # Здесь можно добавить другие поля для обновлений, если необходимо

    class Config:
        orm_mode = True


class PersonBase(BaseModel):
    first_name: str
    last_name: str
    father_name: Optional[str] = None
    group_id: Optional[int] = None  # Группа (может быть пустой для преподавателя)
    type: str  # "S" для студента, "P" для преподавателя

class PersonCreate(PersonBase):
    pass

class PersonRead(PersonBase):
    id: int

    class Config:
        orm_mode = True

class PersonUpdate(BaseModel):
    first_name: str
    last_name: str
    father_name: Optional[str] = None
    group_id: Optional[int] = None  # Группа (может быть пустой для преподавателя)
    type: str

    class Config:
        orm_mode = True

class SubjectBase(BaseModel):
    name: str

class SubjectCreate(SubjectBase):
    pass

class SubjectRead(SubjectBase):
    id: int

    class Config:
        orm_mode = True

class MarkBase(BaseModel):
    student_id: int
    subject_id: int
    teacher_id: int
    value: int

class MarkCreate(MarkBase):
    created_at: datetime = None  # Можно указать дату или оставить пустой, чтобы использовать значение по умолчанию

class MarkRead(MarkBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
class UserBase(BaseModel):
    login: str
    role: str

class UserCreate(UserBase):
    password: str  # пароль для создания

class UserRead(UserBase):
    id: int
    person_id: int

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    login: str
    password: str
    role: str = "user"  # Default role as 'user'
    person_id: Optional[int] = None  

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    login: Optional[str]
    password: Optional[str]
    role: Optional[str]
    person_id: Optional[int]

class AverageGradeRequest(BaseModel):
    start_date: str  # Date in 'YYYY-MM-DD' format
    end_date: str  # Date in 'YYYY-MM-DD' format
    filter_by: str  # Filter type: 'students', 'years', 'groups', or 'teachers'

class AverageGradeResponse(BaseModel):
    entity: str  # The entity we are averaging for (student, group, teacher, etc.)
    average_grade: float  # The computed average grade for that entity