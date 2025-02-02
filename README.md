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

<img src="https://github.com/user-attachments/assets/622df7d3-fa29-4e6d-ab76-955bce6a7818" alt="photo" height="800"/>

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
## Screenshots

1. Login page
<img src="https://github.com/user-attachments/assets/7165f213-1ef1-4caf-85c1-9985a6e3f435" alt="photo" height="400"/>

2. Analytics Section
<img src="https://github.com/user-attachments/assets/ce8d7d39-fbd6-4689-8b5f-a1e4706cce90" alt="photo" height="400"/>

3. Groups section
<img src="https://github.com/user-attachments/assets/4d90a00c-c993-4d94-9547-2c723144862b" alt="photo" height="400"/>

4. People section
<img src="https://github.com/user-attachments/assets/e30345d9-555a-46d0-8740-5b49f9f105c4" alt="photo" height="400"/>

5. Report example
<img src="https://github.com/user-attachments/assets/d8e90288-a7b5-4444-ab36-ed6b37bd6e7a" alt="photo" height="400"/>
