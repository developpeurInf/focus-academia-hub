
export type UserRole = "admin" | "teacher" | "student" | "parent";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  enrollmentDate: string;
  parentId?: string;
  avatar?: string;
  address?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  status: "active" | "inactive";
  attendance?: number;
  averageGrade?: number;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  avatar?: string;
  phoneNumber?: string;
  department?: string;
  qualification?: string;
  joinDate: string;
}

export interface Class {
  id: string;
  name: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  schedule: ClassSchedule[];
  studentCount: number;
}

export interface ClassSchedule {
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  class: string;
}

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  score: number;
  maxScore: number;
  term: string;
  date: string;
  teacherId: string;
  teacherName: string;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "overdue";
  type: "tuition" | "fee" | "other";
  description: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: "info" | "warning" | "success" | "error";
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}

export interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: string;
  target: string;
  date: string;
  type: "message" | "grade" | "attendance" | "payment" | "system";
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  averageAttendance: number;
  averageGrade: number;
  pendingPayments: number;
  upcomingEvents: number;
}
