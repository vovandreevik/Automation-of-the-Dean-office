from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import Mark, Person, Subject
from typing import List, Dict, Any

def get_average_grade(session: Session, start_date: str, end_date: str, filter_by: str) -> List[Dict[str, Any]]:
    filter_conditions = []
    
    # Добавляем фильтрацию по датам
    filter_conditions.append(Mark.created_at >= start_date)
    filter_conditions.append(Mark.created_at <= end_date)

    if filter_by == "students":
        # Получаем всех студентов (включая тех, у кого нет оценок) и их средний балл
        query = session.query(Person.id, Person.first_name, Person.last_name, func.avg(Mark.value).label('avg_grade'))\
            .outerjoin(Mark, Person.id == Mark.student_id)\
            .filter(*filter_conditions)\
            .group_by(Person.id)\
            .all()

        # Возвращаем список студентов с их средним баллом
        return [{'entity': f"{person.first_name} {person.last_name}", 'average_grade': avg_grade if avg_grade is not None else 0} 
                for person, avg_grade in query]

    elif filter_by == "years":
        # Получаем средний балл по годам
        query = session.query(func.extract('year', Mark.created_at).label('year'), func.avg(Mark.value).label('avg_grade'))\
            .filter(*filter_conditions)\
            .group_by(func.extract('year', Mark.created_at))\
            .all()

        # Возвращаем средний балл для каждого года
        return [{'entity': str(year), 'average_grade': avg_grade if avg_grade is not None else 0} for year, avg_grade in query]

    elif filter_by == "groups":
        # Получаем средний балл по группам
        query = session.query(Person.group_id, func.avg(Mark.value).label('avg_grade'))\
            .outerjoin(Mark, Person.id == Mark.student_id)\
            .filter(*filter_conditions)\
            .group_by(Person.group_id)\
            .all()

        # Возвращаем средний балл для каждой группы
        return [{'entity': str(group_id), 'average_grade': avg_grade if avg_grade is not None else 0} for group_id, avg_grade in query]

    elif filter_by == "teachers":
        # Получаем средний балл по преподавателям
        query = session.query(Person.id, Person.first_name, Person.last_name, func.avg(Mark.value).label('avg_grade'))\
            .outerjoin(Mark, Person.id == Mark.teacher_id)\
            .filter(*filter_conditions)\
            .group_by(Person.id)\
            .all()

        # Возвращаем средний балл для каждого преподавателя
        return [{'entity': f"{teacher.first_name} {teacher.last_name}", 'average_grade': avg_grade if avg_grade is not None else 0} 
                for teacher, avg_grade in query]

    elif filter_by == "subjects":
        # Получаем средний балл по предметам
        query = session.query(Subject.id, Subject.name, func.avg(Mark.value).label('avg_grade'))\
            .outerjoin(Mark, Subject.id == Mark.subject_id)\
            .filter(*filter_conditions)\
            .group_by(Subject.id)\
            .all()

        # Возвращаем средний балл для каждого предмета
        return [{'entity': subject.name, 'average_grade': avg_grade if avg_grade is not None else 0} for subject, avg_grade in query]

    else:
        raise ValueError("Invalid filter type")
