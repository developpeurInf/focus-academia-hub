
from typing import List, Optional, Dict, Any
import random
import uuid
from datetime import datetime
from models import (
    User, UserCreate, UserRole, 
    Student, StudentCreate,
    Teacher, TeacherCreate,
    Class, ClassCreate, ClassUpdate,
    ActivityItem, DashboardStats
)
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Mock database (in-memory data)
USERS = [
    User(
        id="1", 
        name="Admin User", 
        email="admin@focus.edu", 
        role="admin", 
        avatar="/placeholder.svg"
    ),
    User(
        id="2", 
        name="John Smith", 
        email="john@focus.edu", 
        role="teacher", 
        avatar="/placeholder.svg"
    ),
    User(
        id="3", 
        name="Emma Wilson", 
        email="emma@focus.edu", 
        role="student", 
        avatar="/placeholder.svg"
    ),
    User(
        id="4", 
        name="Robert Wilson", 
        email="robert@focus.edu", 
        role="parent", 
        avatar="/placeholder.svg"
    ),
]

# Store passwords separately for security
USER_PASSWORDS = {
    "admin@focus.edu": pwd_context.hash("adminpass"),
    "john@focus.edu": pwd_context.hash("johnpass"),
    "emma@focus.edu": pwd_context.hash("emmapass"),
    "robert@focus.edu": pwd_context.hash("robertpass"),
}

STUDENTS = [
    Student(
        id="1", 
        name="Emma Wilson", 
        email="emma@focus.edu", 
        grade="10th", 
        enrollmentDate="2022-09-01", 
        parentId="4", 
        avatar="/placeholder.svg",
        address="123 School St, Education City",
        phoneNumber="(555) 123-4567",
        dateOfBirth="2006-05-15",
        status="active",
        attendance=94,
        averageGrade=88
    ),
    Student(
        id="2", 
        name="Michael Johnson", 
        email="michael@focus.edu", 
        grade="10th", 
        enrollmentDate="2022-09-02", 
        avatar="/placeholder.svg",
        address="456 Learning Ave, Knowledge Town",
        phoneNumber="(555) 234-5678",
        dateOfBirth="2006-08-23",
        status="active",
        attendance=89,
        averageGrade=92
    ),
    Student(
        id="3", 
        name="Sophia Brown", 
        email="sophia@focus.edu", 
        grade="11th", 
        enrollmentDate="2021-09-01", 
        avatar="/placeholder.svg",
        address="789 Education Blvd, Wisdom City",
        phoneNumber="(555) 345-6789",
        dateOfBirth="2005-02-10",
        status="active",
        attendance=97,
        averageGrade=95
    ),
    Student(
        id="4", 
        name="Daniel Taylor", 
        email="daniel@focus.edu", 
        grade="9th", 
        enrollmentDate="2023-09-01", 
        avatar="/placeholder.svg",
        address="101 School Rd, Learning Heights",
        phoneNumber="(555) 456-7890",
        dateOfBirth="2007-11-05",
        status="active",
        attendance=91,
        averageGrade=84
    ),
    Student(
        id="5", 
        name="Olivia Martinez", 
        email="olivia@focus.edu", 
        grade="12th", 
        enrollmentDate="2020-09-01", 
        avatar="/placeholder.svg",
        address="202 Academy St, Scholarship Hills",
        phoneNumber="(555) 567-8901",
        dateOfBirth="2004-07-22",
        status="active",
        attendance=96,
        averageGrade=91
    ),
]

CLASSES = [
    Class(
        id="1",
        name="Math 101",
        subject="Mathematics",
        teacherId="2",
        teacherName="John Smith",
        schedule=[
            {"day": "Monday", "startTime": "09:00", "endTime": "10:30", "room": "A101"},
            {"day": "Wednesday", "startTime": "09:00", "endTime": "10:30", "room": "A101"}
        ],
        studentCount=28
    ),
    Class(
        id="2",
        name="English Literature",
        subject="English",
        teacherId="5",
        teacherName="Sarah Johnson",
        schedule=[
            {"day": "Tuesday", "startTime": "11:00", "endTime": "12:30", "room": "B205"},
            {"day": "Thursday", "startTime": "11:00", "endTime": "12:30", "room": "B205"}
        ],
        studentCount=24
    ),
    Class(
        id="3",
        name="Physics Fundamentals",
        subject="Physics",
        teacherId="6",
        teacherName="Robert Chen",
        schedule=[
            {"day": "Monday", "startTime": "13:00", "endTime": "14:30", "room": "C310"},
            {"day": "Wednesday", "startTime": "13:00", "endTime": "14:30", "room": "C310"},
            {"day": "Friday", "startTime": "10:00", "endTime": "11:30", "room": "C310"}
        ],
        studentCount=20
    ),
    Class(
        id="4",
        name="Biology 101",
        subject="Biology",
        teacherId="7",
        teacherName="Maria Garcia",
        schedule=[
            {"day": "Tuesday", "startTime": "09:00", "endTime": "10:30", "room": "D110"},
            {"day": "Thursday", "startTime": "09:00", "endTime": "10:30", "room": "D110"}
        ],
        studentCount=26
    ),
    Class(
        id="5",
        name="World History",
        subject="History",
        teacherId="8",
        teacherName="James Wilson",
        schedule=[
            {"day": "Wednesday", "startTime": "11:00", "endTime": "12:30", "room": "A210"},
            {"day": "Friday", "startTime": "13:00", "endTime": "14:30", "room": "A210"}
        ],
        studentCount=30
    ),
]

ACTIVITIES = [
    ActivityItem(
        id="1",
        userId="2",
        userName="John Smith",
        userAvatar="/placeholder.svg",
        action="graded assignment for",
        target="Class 10A - Mathematics",
        date="2023-09-15T10:30:00",
        type="grade"
    ),
    ActivityItem(
        id="2",
        userId="1",
        userName="Admin User",
        userAvatar="/placeholder.svg",
        action="added new student",
        target="Daniel Taylor",
        date="2023-09-14T14:15:00",
        type="system"
    ),
    ActivityItem(
        id="3",
        userId="3",
        userName="Emma Wilson",
        userAvatar="/placeholder.svg",
        action="submitted assignment for",
        target="English Literature",
        date="2023-09-14T09:45:00",
        type="system"
    ),
    ActivityItem(
        id="4",
        userId="2",
        userName="John Smith",
        userAvatar="/placeholder.svg",
        action="marked attendance for",
        target="Class 10A",
        date="2023-09-13T08:30:00",
        type="attendance"
    ),
    ActivityItem(
        id="5",
        userId="4",
        userName="Robert Wilson",
        userAvatar="/placeholder.svg",
        action="made payment for",
        target="Tuition Fee - September",
        date="2023-09-12T11:20:00",
        type="payment"
    ),
]

# Database access functions
def get_users() -> List[User]:
    return USERS.copy()

def get_user_by_email(email: str) -> Optional[User]:
    for user in USERS:
        if user.email == email:
            return user
    return None

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(email: str, password: str) -> Optional[User]:
    user = get_user_by_email(email)
    if not user:
        return None
    if email not in USER_PASSWORDS:
        return None
    if not verify_password(password, USER_PASSWORDS[email]):
        return None
    return user

def get_students(query: Optional[str] = None) -> List[Student]:
    if not query:
        return STUDENTS.copy()
    
    query = query.lower()
    return [
        student for student in STUDENTS
        if query in student.name.lower() or 
           query in student.email.lower() or 
           query in student.grade.lower()
    ]

def get_teachers() -> List[Teacher]:
    # Mock data, would be from database in a real app
    return []

def get_classes(query: Optional[str] = None) -> List[Class]:
    if not query:
        return CLASSES.copy()
    
    query = query.lower()
    return [
        cls for cls in CLASSES
        if query in cls.name.lower() or 
           query in cls.subject.lower() or 
           query in cls.teacherName.lower()
    ]

def get_activities(limit: int = 5) -> List[ActivityItem]:
    return ACTIVITIES[:limit]

def get_dashboard_stats(role: UserRole) -> DashboardStats:
    # In a real application, these would be calculated from the database
    return DashboardStats(
        totalStudents=320,
        totalTeachers=28,
        averageAttendance=93,
        averageGrade=86,
        pendingPayments=45,
        upcomingEvents=12
    )

def add_student(student_data: StudentCreate) -> Student:
    student_id = str(uuid.uuid4())[:8]
    new_student = Student(
        id=student_id,
        **student_data.model_dump()
    )
    STUDENTS.append(new_student)
    return new_student

def add_class(class_data: ClassCreate) -> Class:
    class_id = str(uuid.uuid4())[:8]
    new_class = Class(
        id=class_id,
        **class_data.model_dump()
    )
    CLASSES.append(new_class)
    return new_class

def update_class(class_id: str, class_data: ClassUpdate) -> Optional[Class]:
    for i, cls in enumerate(CLASSES):
        if cls.id == class_id:
            # Update only provided fields
            update_data = {k: v for k, v in class_data.model_dump().items() if v is not None}
            updated_class = Class(**{**cls.model_dump(), **update_data})
            CLASSES[i] = updated_class
            return updated_class
    return None

def delete_class(class_id: str) -> bool:
    global CLASSES
    original_length = len(CLASSES)
    CLASSES = [cls for cls in CLASSES if cls.id != class_id]
    return len(CLASSES) < original_length
