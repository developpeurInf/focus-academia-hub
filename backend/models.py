from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Union, Literal
from datetime import datetime
import uuid

# Base Models
# Changed from class to type alias to avoid metaclass conflict
UserRole = Literal["admin", "teacher", "student", "parent"]

class ClassSchedule(BaseModel):
    day: str
    startTime: str
    endTime: str
    room: str

# User Models
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str
    avatar: Optional[str] = None

# Student Models
class StudentBase(BaseModel):
    name: str
    email: EmailStr
    grade: str
    status: Literal["active", "inactive"]

class StudentCreate(StudentBase):
    enrollmentDate: str
    parentId: Optional[str] = None
    avatar: Optional[str] = None
    address: Optional[str] = None
    phoneNumber: Optional[str] = None
    dateOfBirth: Optional[str] = None
    attendance: Optional[int] = None
    averageGrade: Optional[int] = None

class Student(StudentBase):
    id: str
    enrollmentDate: str
    parentId: Optional[str] = None
    avatar: Optional[str] = None
    address: Optional[str] = None
    phoneNumber: Optional[str] = None
    dateOfBirth: Optional[str] = None
    attendance: Optional[int] = None
    averageGrade: Optional[int] = None

# Teacher Models
class TeacherBase(BaseModel):
    name: str
    email: EmailStr
    subject: str

class TeacherCreate(TeacherBase):
    joinDate: str
    avatar: Optional[str] = None
    phoneNumber: Optional[str] = None
    department: Optional[str] = None
    qualification: Optional[str] = None

class Teacher(TeacherBase):
    id: str
    joinDate: str
    avatar: Optional[str] = None
    phoneNumber: Optional[str] = None
    department: Optional[str] = None
    qualification: Optional[str] = None

# Class Models
class ClassBase(BaseModel):
    name: str
    subject: str
    teacherId: str
    teacherName: str
    studentCount: int

class ClassCreate(ClassBase):
    schedule: List[ClassSchedule]

class ClassUpdate(BaseModel):
    name: Optional[str] = None
    subject: Optional[str] = None
    teacherId: Optional[str] = None
    teacherName: Optional[str] = None
    studentCount: Optional[int] = None
    schedule: Optional[List[ClassSchedule]] = None

class Class(ClassBase):
    id: str
    schedule: List[ClassSchedule]

# Other Models
class Attendance(BaseModel):
    id: str
    studentId: str
    studentName: str
    date: str
    status: Literal["present", "absent", "late", "excused"]
    class_name: str = Field(..., alias="class")

class Grade(BaseModel):
    id: str
    studentId: str
    studentName: str
    subject: str
    score: int
    maxScore: int
    term: str
    date: str
    teacherId: str
    teacherName: str

class Payment(BaseModel):
    id: str
    studentId: str
    studentName: str
    amount: float
    date: str
    status: Literal["paid", "pending", "overdue"]
    type: Literal["tuition", "fee", "other"]
    description: str

class Notification(BaseModel):
    id: str
    userId: str
    title: str
    message: str
    date: str
    read: bool
    type: Literal["info", "warning", "success", "error"]

class Message(BaseModel):
    id: str
    senderId: str
    senderName: str
    senderAvatar: Optional[str] = None
    receiverId: str
    subject: str
    content: str
    date: str
    read: bool

class ActivityItem(BaseModel):
    id: str
    userId: str
    userName: str
    userAvatar: Optional[str] = None
    action: str
    target: str
    date: str
    type: Literal["message", "grade", "attendance", "payment", "system"]

class DashboardStats(BaseModel):
    totalStudents: int
    totalTeachers: int
    averageAttendance: int
    averageGrade: int
    pendingPayments: int
    upcomingEvents: int

# Config for all models
class Config:
    populate_by_name = True
