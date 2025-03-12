
# Focus School Management System - Backend API

This is the backend API for the Focus School Management System, built with FastAPI.

## Features

- User authentication with JWT
- Student management
- Class management
- Dashboard statistics
- Activity tracking

## Setup and Installation

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the application:
   ```
   python main.py
   ```

The API will be available at `http://localhost:8000`

API Documentation will be available at `http://localhost:8000/docs`

## API Endpoints

- **Authentication**
  - POST `/api/auth/login` - Login user

- **Dashboard**
  - GET `/api/dashboard/stats` - Get dashboard statistics
  - GET `/api/dashboard/activity` - Get recent activity

- **Students**
  - GET `/api/students` - List all students
  - GET `/api/students/{student_id}` - Get student by ID
  - POST `/api/students` - Create a new student

- **Classes**
  - GET `/api/classes` - List all classes
  - GET `/api/classes/{class_id}` - Get class by ID
  - POST `/api/classes` - Create a new class
  - PUT `/api/classes/{class_id}` - Update a class
  - DELETE `/api/classes/{class_id}` - Delete a class

## Notes

- This is a mock implementation using in-memory data
- In a production environment, this would be connected to a database
- Default users are created with credentials:
  - Admin: admin@focus.edu / adminpass
  - Teacher: john@focus.edu / johnpass
  - Student: emma@focus.edu / emmapass
  - Parent: robert@focus.edu / robertpass
