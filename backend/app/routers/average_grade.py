import logging
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from typing import List, Dict, Any
from app.schemas import AverageGradeRequest, AverageGradeResponse
from sqlalchemy import func
from app.models import Mark, Person, Subject, Group

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/calculate-average-grade", response_model=List[AverageGradeResponse])
def calculate_average_grade(
    request: AverageGradeRequest, db: Session = Depends(get_db)
):
    try:
        logger.info("Received request: %s", request)  # Логируем входящий запрос

        filter_conditions = []
        # Добавляем фильтрацию по датам
        filter_conditions.append(Mark.created_at >= request.start_date)
        filter_conditions.append(Mark.created_at <= request.end_date) 
        if request.filter_by == "students":
            logger.info("Processing 'students' filter...")
            query = db.query(Person.id, Person.first_name, Person.last_name, func.avg(Mark.value).label('avg_grade'))\
                .outerjoin(Mark, Person.id == Mark.student_id)\
                .filter(*filter_conditions)\
                .group_by(Person.id)\
                .all()

            logger.info("Students query result: %s", query)

            result = [{'entity': f"{student_first_name} {student_last_name}", 'average_grade': avg_grade if avg_grade is not None else 0}
                    for student_id, student_first_name, student_last_name, avg_grade in query]


        elif request.filter_by == "years":
            logger.info("Processing 'years' filter...")
            query = db.query(func.extract('year', Mark.created_at).label('year'), func.avg(Mark.value).label('avg_grade'))\
                .filter(*filter_conditions)\
                .group_by(func.extract('year', Mark.created_at))\
                .all()

            result = [{'entity': str(year), 'average_grade': avg_grade if avg_grade is not None else 0} for year, avg_grade in query]

        elif request.filter_by == "groups":
            logger.info("Processing 'groups' filter...")
            query = db.query(Person.group_id, func.avg(Mark.value).label('avg_grade'), Group.name)\
                .join(Group, Person.group_id == Group.id)\
                .outerjoin(Mark, Person.id == Mark.student_id)\
                .filter(*filter_conditions)\
                .group_by(Person.group_id, Group.name)\
                .all()

            logger.info("Groups query result: %s", query)

            result = [{'entity': group_name, 'average_grade': avg_grade if avg_grade is not None else 0}
                    for group_id, avg_grade, group_name in query]

        elif request.filter_by == "teachers":
            logger.info("Processing 'teachers' filter...")
            query = db.query(Person.id, Person.first_name, Person.last_name, func.avg(Mark.value).label('avg_grade'))\
                .outerjoin(Mark, Person.id == Mark.teacher_id)\
                .filter(*filter_conditions)\
                .group_by(Person.id)\
                .all()

            # Логируем результат запроса для преподавателей перед распаковкой
            logger.info("Teachers query result: %s", query)

            # Теперь распаковываем правильно, ожидая 4 элемента в каждом кортеже
            result = [{'entity': f"{teacher_first_name} {teacher_last_name}", 'average_grade': avg_grade if avg_grade is not None else 0}
                      for teacher_id, teacher_first_name, teacher_last_name, avg_grade in query]

        elif request.filter_by == "subjects":
            logger.info("Processing 'subjects' filter...")
            query = db.query(Subject.id, Subject.name, func.avg(Mark.value).label('avg_grade'))\
                .outerjoin(Mark, Subject.id == Mark.subject_id)\
                .filter(*filter_conditions)\
                .group_by(Subject.id, Subject.name)\
                .all()

            logger.info("Subjects query result: %s", query)

            result = [{'entity': subject_name, 'average_grade': avg_grade if avg_grade is not None else 0}
                    for subject_id, subject_name, avg_grade in query]

        else:
            raise ValueError("Invalid filter type")

        logger.info("Calculated average grades: %s", result)  # Логируем результат

        return result
    
    except ValueError as e:
        logger.error("Error occurred: %s", str(e))  # Логируем ошибку
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        logger.error("Unexpected error: %s", str(e))  # Логируем неожиданные ошибки
        raise HTTPException(status_code=500, detail="Internal Server Error")
