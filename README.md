# Dean's Office Automation

## About the Project
This project is designed to automate the work of the dean's office, enabling the management of student grades and performance analysis. The system provides an intuitive web interface for handling groups, students, teachers, subjects, and grades.

## Features
- **User Roles**: Regular users can only view data, while administrators have full access to modify records.
- **Security**: Authentication via JWT, passwords are securely stored using bcrypt hashing.
- **Performance Analysis**: Flexible filtering options for analyzing grades by students, groups, subjects, teachers, and academic years.
- **Graphical Reports**: Visualization of analysis results.
- **Database Integrity**: Ensures data consistency using constraints, transactions, and triggers.

## Technologies Used
### Backend
- **Language**: Python
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **Migrations**: Alembic

### Frontend
- **Language**: TypeScript
- **Framework**: React
- **Build Tool**: Vite

## Database Structure

![Untitled](https://github.com/user-attachments/assets/622df7d3-fa29-4e6d-ab76-955bce6a7818)

## Installation and Setup
### Requirements
- Python 3.10+
- Node.js 16+
- PostgreSQL

### Backend Setup
1. Install dependencies:
   ```
   pip install -r requirements.txt
2. Configure database connection in the .env file:
  ```
  DATABASE_URL=postgresql://user:password@localhost/dbname
  ```
3. Apply migrations:
  ```
  alembic upgrade head
  ```
4. Start the server:
  ```
  uvicorn main:app --reload
  ```
### Frontend Setup
1. Install dependencies:
  ```
  npm install
2. Start the application:
  ```
  npm run dev
### API
This project provides a REST API for data management. Full documentation is available at:

```
http://localhost:8000/docs
```
## screenshots

