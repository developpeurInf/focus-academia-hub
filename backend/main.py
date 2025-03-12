
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import List, Optional
from datetime import datetime, timedelta

from models import (
    User, UserCreate, UserLogin, UserRole,
    Student, StudentCreate, 
    Teacher, TeacherCreate,
    Class, ClassCreate, ClassUpdate,
    Attendance, Grade, Payment, Notification, Message,
    ActivityItem, DashboardStats
)
from database import (
    get_users, get_students, get_teachers, get_classes, get_activities,
    add_student, add_class, update_class, delete_class, get_dashboard_stats,
    get_user_by_email, authenticate_user
)
from auth import create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES

app = FastAPI(title="Focus School Management API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication endpoints
@app.post("/api/auth/login", response_model=dict)
async def login(user_data: UserLogin):
    user = authenticate_user(user_data.email, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

# Dashboard endpoints
@app.get("/api/dashboard/stats", response_model=DashboardStats)
async def get_stats(current_user: User = Depends(get_current_user)):
    return get_dashboard_stats(current_user.role)

@app.get("/api/dashboard/activity", response_model=List[ActivityItem])
async def get_recent_activity(
    limit: int = 5, 
    current_user: User = Depends(get_current_user)
):
    return get_activities(limit)

# Students endpoints
@app.get("/api/students", response_model=List[Student])
async def list_students(
    query: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    return get_students(query)

@app.get("/api/students/{student_id}", response_model=Student)
async def get_student(
    student_id: str,
    current_user: User = Depends(get_current_user)
):
    student = next((s for s in get_students() if s.id == student_id), None)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@app.post("/api/students", response_model=Student)
async def create_student(
    student: StudentCreate,
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "teacher"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return add_student(student)

# Classes endpoints
@app.get("/api/classes", response_model=List[Class])
async def list_classes(
    query: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    return get_classes(query)

@app.get("/api/classes/{class_id}", response_model=Class)
async def get_class(
    class_id: str,
    current_user: User = Depends(get_current_user)
):
    class_item = next((c for c in get_classes() if c.id == class_id), None)
    if not class_item:
        raise HTTPException(status_code=404, detail="Class not found")
    return class_item

@app.post("/api/classes", response_model=Class)
async def create_class(
    class_data: ClassCreate,
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "teacher"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    return add_class(class_data)

@app.put("/api/classes/{class_id}", response_model=Class)
async def update_class_endpoint(
    class_id: str,
    class_data: ClassUpdate,
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "teacher"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    updated_class = update_class(class_id, class_data)
    if not updated_class:
        raise HTTPException(status_code=404, detail="Class not found")
    return updated_class

@app.delete("/api/classes/{class_id}", response_model=dict)
async def delete_class_endpoint(
    class_id: str,
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    success = delete_class(class_id)
    if not success:
        raise HTTPException(status_code=404, detail="Class not found")
    return {"success": True}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
