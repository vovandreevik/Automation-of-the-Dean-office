from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import SessionLocal
from sqlalchemy import func
from app.models import Group, Person, Subject, Mark


router = APIRouter()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
@router.post("/analytics")
def analytics(
    date_range: list[str] | None = None,
    student: int | None = None,
    group: int | None = None,
    subject: int | None = None,
    teacher: int | None = None,
    db: Session = Depends(get_db),
):
    # Базовый запрос к таблице оценок
    query = db.query(
        func.avg(Mark.value).label("average_grade"),
        Group.name.label("group"),
        Person.first_name.label("student_first_name"),
        Person.last_name.label("student_last_name"),
        Subject.name.label("subject"),
        Person.first_name.label("teacher_first_name"),
        Person.last_name.label("teacher_last_name"),
    ).join(
        Group, Mark.group_id == Group.id
    ).join(
        Person, Mark.student_id == Person.id
    ).join(
        Subject, Mark.subject_id == Subject.id
    ).join(
        Person, Mark.teacher_id == Person.id
    )

    # Применение фильтров
    if date_range:
        start_date = datetime.strptime(date_range[0], "%Y-%m-%d")
        end_date = datetime.strptime(date_range[1], "%Y-%m-%d")
        query = query.filter(Mark.date.between(start_date, end_date))

    if student:
        query = query.filter(Mark.student_id == student)

    if group:
        query = query.filter(Mark.group_id == group)

    if subject:
        query = query.filter(Mark.subject_id == subject)

    if teacher:
        query = query.filter(Mark.teacher_id == teacher)

    # Выполнение запроса
    results = query.group_by(
        Group.name, Person.id, Subject.id, Person.id
    ).all()

    # Форматирование данных
    table_data = [
        {
            "group": result.group,
            "student": f"{result.student_first_name} {result.student_last_name}",
            "subject": result.subject,
            "teacher": f"{result.teacher_first_name} {result.teacher_last_name}",
            "average_grade": round(result.average_grade, 2),
        }
        for result in results
    ]

    # Данные для графика
    chart_data = {
        "labels": [f"{res.subject} ({res.group})" for res in results],
        "datasets": [
            {
                "label": "Average Grades",
                "data": [res.average_grade for res in results],
                "backgroundColor": "rgba(75, 192, 192, 0.2)",
                "borderColor": "rgba(75, 192, 192, 1)",
                "borderWidth": 1,
            }
        ],
    }

    return {"table": table_data, "chart": chart_data}
