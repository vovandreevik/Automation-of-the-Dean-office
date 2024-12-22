from sqlalchemy import Column, Integer, String, ForeignKey, CheckConstraint, DateTime
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime


class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(14), unique=True, nullable=False)

    people = relationship("Person", back_populates="group", cascade="all, delete-orphan")  # Cascade delete for people


class Person(Base):
    __tablename__ = "people"

    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(20), nullable=False)
    last_name = Column(String(20), nullable=False)
    father_name = Column(String(20), nullable=True)
    group_id = Column(Integer, ForeignKey("groups.id", ondelete="CASCADE"))
    type = Column(String(1), nullable=False)

    group = relationship("Group", back_populates="people")
    given_marks = relationship("Mark", foreign_keys="Mark.teacher_id", back_populates="teacher", cascade="all, delete-orphan")  # Cascade delete for teacher
    received_marks = relationship("Mark", foreign_keys="Mark.student_id", back_populates="student", cascade="all, delete-orphan")  # Cascade delete for student

    user = relationship("User", back_populates="person", uselist=False)  # Removed cascade here

    __table_args__ = (
        CheckConstraint("type IN ('S', 'P')", name="check_type"),
    )


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    login = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(10), nullable=False, default="user")  # 'user' or 'admin'
    person_id = Column(Integer, ForeignKey("people.id", ondelete="CASCADE"), nullable=True)

    person = relationship("Person", back_populates="user", uselist=False, single_parent=True)  # Added single_parent=True here

    __table_args__ = (
        CheckConstraint("role IN ('user', 'admin')", name="check_role"),
    )



class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False, unique=True)

    marks = relationship("Mark", back_populates="subject", cascade="all, delete-orphan")  # Cascade delete for marks

class Mark(Base):
    __tablename__ = "marks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("people.id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("people.id", ondelete="CASCADE"), nullable=False)
    value = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)  # Поле для хранения даты и времени


    student = relationship("Person", foreign_keys=[student_id], back_populates="received_marks")
    subject = relationship("Subject", back_populates="marks")
    teacher = relationship("Person", foreign_keys=[teacher_id], back_populates="given_marks")
