"""Initial migration

Revision ID: 126a210ea45e
Revises: 
Create Date: 2024-12-20 03:16:49.056292

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '126a210ea45e'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute('ALTER TABLE groups ALTER COLUMN id DROP IDENTITY')
    op.execute('ALTER TABLE marks ALTER COLUMN id DROP IDENTITY')
    op.execute('ALTER TABLE people ALTER COLUMN id DROP IDENTITY')
    op.execute('ALTER TABLE subjects ALTER COLUMN id DROP IDENTITY')
    
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('groups', 'id',
               existing_type=sa.INTEGER(),
               server_default=None,
               comment=None,
               existing_comment='Идентификатор группы',
               existing_nullable=False,
               autoincrement=True)
    op.alter_column('groups', 'name',
               existing_type=sa.VARCHAR(length=14),
               nullable=False,
               comment=None,
               existing_comment='Наименование группы')
    op.create_unique_constraint(None, 'groups', ['name'])
    op.drop_table_comment(
        'groups',
        existing_comment='Таблица групп',
        schema=None
    )
    op.alter_column('marks', 'id',
               existing_type=sa.INTEGER(),
               server_default=None,
               comment=None,
               existing_comment='Идентификатор оценки',
               existing_nullable=False,
               autoincrement=True)
    op.alter_column('marks', 'student_id',
               existing_type=sa.INTEGER(),
               nullable=False,
               comment=None,
               existing_comment='Идентификатор студента')
    op.alter_column('marks', 'subject_id',
               existing_type=sa.INTEGER(),
               nullable=False,
               comment=None,
               existing_comment='Идентификатор предмета')
    op.alter_column('marks', 'teacher_id',
               existing_type=sa.INTEGER(),
               nullable=False,
               comment=None,
               existing_comment='Идентификатор преподавателя')
    op.alter_column('marks', 'value',
               existing_type=sa.INTEGER(),
               nullable=False,
               comment=None,
               existing_comment='Значение оценки')
    op.drop_table_comment(
        'marks',
        existing_comment='Таблица оценок',
        schema=None
    )
    op.alter_column('people', 'id',
               existing_type=sa.INTEGER(),
               server_default=None,
               comment=None,
               existing_comment='Идентификатор человека',
               existing_nullable=False,
               autoincrement=True)
    op.alter_column('people', 'first_name',
               existing_type=sa.VARCHAR(length=20),
               nullable=False,
               comment=None,
               existing_comment='имя')
    op.alter_column('people', 'last_name',
               existing_type=sa.VARCHAR(length=20),
               nullable=False,
               comment=None,
               existing_comment='фамилия')
    op.alter_column('people', 'father_name',
               existing_type=sa.VARCHAR(length=20),
               comment=None,
               existing_comment='отчество',
               existing_nullable=True)
    op.alter_column('people', 'group_id',
               existing_type=sa.INTEGER(),
               comment=None,
               existing_comment='Идент. группы (у преп. «_» )',
               existing_nullable=True)
    op.alter_column('people', 'type',
               existing_type=sa.String(),
               nullable=False,
               comment=None,
               existing_comment='Тип («S» - студ, «P» - преп.)')
    op.drop_table_comment(
        'people',
        existing_comment='Таблица студентов и преп.',
        schema=None
    )
    op.alter_column('subjects', 'id',
               existing_type=sa.INTEGER(),
               server_default=None,
               comment=None,
               existing_comment='Идентификатор предмета',
               existing_nullable=False,
               autoincrement=True)
    op.alter_column('subjects', 'name',
               existing_type=sa.VARCHAR(length=20),
               type_=sa.String(length=255),
               nullable=False,
               comment=None,
               existing_comment='Наименование предмета.')
    op.create_unique_constraint(None, 'subjects', ['name'])
    op.drop_table_comment(
        'subjects',
        existing_comment='Таблица предметов',
        schema=None
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table_comment(
        'subjects',
        'Таблица предметов',
        existing_comment=None,
        schema=None
    )
    op.drop_constraint(None, 'subjects', type_='unique')
    op.alter_column('subjects', 'name',
               existing_type=sa.String(length=255),
               type_=sa.VARCHAR(length=20),
               nullable=True,
               comment='Наименование предмета.')
    op.alter_column('subjects', 'id',
               existing_type=sa.INTEGER(),
               server_default=sa.Identity(always=True, start=1, increment=1, minvalue=1, maxvalue=2147483647, cycle=False, cache=1),
               comment='Идентификатор предмета',
               existing_nullable=False,
               autoincrement=True)
    op.create_table_comment(
        'people',
        'Таблица студентов и преп.',
        existing_comment=None,
        schema=None
    )
    op.alter_column('people', 'type',
               existing_type=sa.String(),
               nullable=True,
               comment='Тип («S» - студ, «P» - преп.)')
    op.alter_column('people', 'group_id',
               existing_type=sa.INTEGER(),
               comment='Идент. группы (у преп. «_» )',
               existing_nullable=True)
    op.alter_column('people', 'father_name',
               existing_type=sa.VARCHAR(length=20),
               comment='отчество',
               existing_nullable=True)
    op.alter_column('people', 'last_name',
               existing_type=sa.VARCHAR(length=20),
               nullable=True,
               comment='фамилия')
    op.alter_column('people', 'first_name',
               existing_type=sa.VARCHAR(length=20),
               nullable=True,
               comment='имя')
    op.alter_column('people', 'id',
               existing_type=sa.INTEGER(),
               server_default=sa.Identity(always=True, start=1, increment=1, minvalue=1, maxvalue=2147483647, cycle=False, cache=1),
               comment='Идентификатор человека',
               existing_nullable=False,
               autoincrement=True)
    op.create_table_comment(
        'marks',
        'Таблица оценок',
        existing_comment=None,
        schema=None
    )
    op.alter_column('marks', 'value',
               existing_type=sa.INTEGER(),
               nullable=True,
               comment='Значение оценки')
    op.alter_column('marks', 'teacher_id',
               existing_type=sa.INTEGER(),
               nullable=True,
               comment='Идентификатор преподавателя')
    op.alter_column('marks', 'subject_id',
               existing_type=sa.INTEGER(),
               nullable=True,
               comment='Идентификатор предмета')
    op.alter_column('marks', 'student_id',
               existing_type=sa.INTEGER(),
               nullable=True,
               comment='Идентификатор студента')
    op.alter_column('marks', 'id',
               existing_type=sa.INTEGER(),
               server_default=sa.Identity(always=True, start=1, increment=1, minvalue=1, maxvalue=2147483647, cycle=False, cache=1),
               comment='Идентификатор оценки',
               existing_nullable=False,
               autoincrement=True)
    op.create_table_comment(
        'groups',
        'Таблица групп',
        existing_comment=None,
        schema=None
    )
    op.drop_constraint(None, 'groups', type_='unique')
    op.alter_column('groups', 'name',
               existing_type=sa.VARCHAR(length=14),
               nullable=True,
               comment='Наименование группы')
    op.alter_column('groups', 'id',
               existing_type=sa.INTEGER(),
               server_default=sa.Identity(always=True, start=1, increment=1, minvalue=1, maxvalue=2147483647, cycle=False, cache=1),
               comment='Идентификатор группы',
               existing_nullable=False,
               autoincrement=True)
    # ### end Alembic commands ###
