import { 
  Student, 
  Teacher, 
  User, 
  Class, 
  Attendance, 
  Grade, 
  Payment, 
  Notification, 
  Message, 
  ActivityItem, 
  DashboardStats,
  UserRole
} from './types';

// Mock data for demonstration
const USERS: User[] = [
  { id: "1", name: "Admin User", email: "admin@focus.edu", role: "admin", avatar: "/placeholder.svg" },
  { id: "2", name: "John Smith", email: "john@focus.edu", role: "teacher", avatar: "/placeholder.svg" },
  { id: "3", name: "Emma Wilson", email: "emma@focus.edu", role: "student", avatar: "/placeholder.svg" },
  { id: "4", name: "Robert Wilson", email: "robert@focus.edu", role: "parent", avatar: "/placeholder.svg" },
];

const STUDENTS: Student[] = [
  { 
    id: "1", 
    name: "Emma Wilson", 
    email: "emma@focus.edu", 
    grade: "10th", 
    enrollmentDate: "2022-09-01", 
    parentId: "4", 
    avatar: "/placeholder.svg",
    address: "123 School St, Education City",
    phoneNumber: "(555) 123-4567",
    dateOfBirth: "2006-05-15",
    status: "active",
    attendance: 94,
    averageGrade: 88
  },
  { 
    id: "2", 
    name: "Michael Johnson", 
    email: "michael@focus.edu", 
    grade: "10th", 
    enrollmentDate: "2022-09-02", 
    avatar: "/placeholder.svg",
    address: "456 Learning Ave, Knowledge Town",
    phoneNumber: "(555) 234-5678",
    dateOfBirth: "2006-08-23",
    status: "active",
    attendance: 89,
    averageGrade: 92
  },
  { 
    id: "3", 
    name: "Sophia Brown", 
    email: "sophia@focus.edu", 
    grade: "11th", 
    enrollmentDate: "2021-09-01", 
    avatar: "/placeholder.svg",
    address: "789 Education Blvd, Wisdom City",
    phoneNumber: "(555) 345-6789",
    dateOfBirth: "2005-02-10",
    status: "active",
    attendance: 97,
    averageGrade: 95
  },
  { 
    id: "4", 
    name: "Daniel Taylor", 
    email: "daniel@focus.edu", 
    grade: "9th", 
    enrollmentDate: "2023-09-01", 
    avatar: "/placeholder.svg",
    address: "101 School Rd, Learning Heights",
    phoneNumber: "(555) 456-7890",
    dateOfBirth: "2007-11-05",
    status: "active",
    attendance: 91,
    averageGrade: 84
  },
  { 
    id: "5", 
    name: "Olivia Martinez", 
    email: "olivia@focus.edu", 
    grade: "12th", 
    enrollmentDate: "2020-09-01", 
    avatar: "/placeholder.svg",
    address: "202 Academy St, Scholarship Hills",
    phoneNumber: "(555) 567-8901",
    dateOfBirth: "2004-07-22",
    status: "active",
    attendance: 96,
    averageGrade: 91
  },
];

const ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    userId: "2",
    userName: "John Smith",
    userAvatar: "/placeholder.svg",
    action: "graded assignment for",
    target: "Class 10A - Mathematics",
    date: "2023-09-15T10:30:00",
    type: "grade"
  },
  {
    id: "2",
    userId: "1",
    userName: "Admin User",
    userAvatar: "/placeholder.svg",
    action: "added new student",
    target: "Daniel Taylor",
    date: "2023-09-14T14:15:00",
    type: "system"
  },
  {
    id: "3",
    userId: "3",
    userName: "Emma Wilson",
    userAvatar: "/placeholder.svg",
    action: "submitted assignment for",
    target: "English Literature",
    date: "2023-09-14T09:45:00",
    type: "system"
  },
  {
    id: "4",
    userId: "2",
    userName: "John Smith",
    userAvatar: "/placeholder.svg",
    action: "marked attendance for",
    target: "Class 10A",
    date: "2023-09-13T08:30:00",
    type: "attendance"
  },
  {
    id: "5",
    userId: "4",
    userName: "Robert Wilson",
    userAvatar: "/placeholder.svg",
    action: "made payment for",
    target: "Tuition Fee - September",
    date: "2023-09-12T11:20:00",
    type: "payment"
  },
];

const DASHBOARD_STATS: DashboardStats = {
  totalStudents: 320,
  totalTeachers: 28,
  averageAttendance: 93,
  averageGrade: 86,
  pendingPayments: 45,
  upcomingEvents: 12
};

// Mock classes data
const CLASSES: Class[] = [
  {
    id: "1",
    name: "Math 101",
    subject: "Mathematics",
    teacherId: "2",
    teacherName: "John Smith",
    schedule: [
      { day: "Monday", startTime: "09:00", endTime: "10:30", room: "A101" },
      { day: "Wednesday", startTime: "09:00", endTime: "10:30", room: "A101" }
    ],
    studentCount: 28
  },
  {
    id: "2",
    name: "English Literature",
    subject: "English",
    teacherId: "5",
    teacherName: "Sarah Johnson",
    schedule: [
      { day: "Tuesday", startTime: "11:00", endTime: "12:30", room: "B205" },
      { day: "Thursday", startTime: "11:00", endTime: "12:30", room: "B205" }
    ],
    studentCount: 24
  },
  {
    id: "3",
    name: "Physics Fundamentals",
    subject: "Physics",
    teacherId: "6",
    teacherName: "Robert Chen",
    schedule: [
      { day: "Monday", startTime: "13:00", endTime: "14:30", room: "C310" },
      { day: "Wednesday", startTime: "13:00", endTime: "14:30", room: "C310" },
      { day: "Friday", startTime: "10:00", endTime: "11:30", room: "C310" }
    ],
    studentCount: 20
  },
  {
    id: "4",
    name: "Biology 101",
    subject: "Biology",
    teacherId: "7",
    teacherName: "Maria Garcia",
    schedule: [
      { day: "Tuesday", startTime: "09:00", endTime: "10:30", room: "D110" },
      { day: "Thursday", startTime: "09:00", endTime: "10:30", room: "D110" }
    ],
    studentCount: 26
  },
  {
    id: "5",
    name: "World History",
    subject: "History",
    teacherId: "8",
    teacherName: "James Wilson",
    schedule: [
      { day: "Wednesday", startTime: "11:00", endTime: "12:30", room: "A210" },
      { day: "Friday", startTime: "13:00", endTime: "14:30", room: "A210" }
    ],
    studentCount: 30
  },
  {
    id: "6",
    name: "Chemistry Basics",
    subject: "Chemistry",
    teacherId: "9",
    teacherName: "Emily Davis",
    schedule: [
      { day: "Monday", startTime: "11:00", endTime: "12:30", room: "C220" },
      { day: "Thursday", startTime: "13:00", endTime: "14:30", room: "C220" }
    ],
    studentCount: 22
  },
];

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Update Base API URL to use HTTPS
const API_BASE_URL = 'https://192.168.1.38:9090/api';

// API client
class ApiClient {
  // Authentication
  async login(email: string, password: string): Promise<{ user: User; access_token: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      return {
        user: data.user,
        access_token: data.access_token
      };
    } catch (error) {
      console.error('API login error:', error);
      throw error;
    }
  }
  
  // Dashboard
  async getDashboardStats(token: string | null, role: UserRole): Promise<DashboardStats> {
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        // Fallback to mock data
        return DASHBOARD_STATS;
      }
    }
    
    // Fallback for demo/development
    await delay(500);
    return DASHBOARD_STATS;
  }
  
  async getRecentActivity(token: string | null, limit: number = 5): Promise<ActivityItem[]> {
    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/dashboard/activity?limit=${limit}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch activity');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Failed to fetch activity:', error);
        // Fallback to mock data
        return ACTIVITIES.slice(0, limit);
      }
    }
    
    // Fallback for demo/development
    await delay(600);
    return ACTIVITIES.slice(0, limit);
  }
  
  // Students
  async getStudents(token: string | null, query?: string): Promise<Student[]> {
    if (token) {
      try {
        const url = query 
          ? `${API_BASE_URL}/students?query=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/students`;
          
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Failed to fetch students:', error);
        // Fallback to mock data with filtering
        let students = [...STUDENTS];
        if (query) {
          const lowercasedQuery = query.toLowerCase();
          students = students.filter(student => 
            student.name.toLowerCase().includes(lowercasedQuery) || 
            student.email.toLowerCase().includes(lowercasedQuery) ||
            student.grade.toLowerCase().includes(lowercasedQuery)
          );
        }
        return students;
      }
    }
    
    // Fallback for demo/development
    await delay(700);
    let students = [...STUDENTS];
    
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      students = students.filter(student => 
        student.name.toLowerCase().includes(lowercasedQuery) || 
        student.email.toLowerCase().includes(lowercasedQuery) ||
        student.grade.toLowerCase().includes(lowercasedQuery)
      );
    }
    
    return students;
  }
  
  async getStudentById(id: string): Promise<Student | null> {
    await delay(500);
    return STUDENTS.find(s => s.id === id) || null;
  }
  
  async createStudent(student: Omit<Student, "id">): Promise<Student> {
    await delay(800);
    const newStudent = {
      ...student,
      id: Math.random().toString(36).substr(2, 9)
    };
    return newStudent;
  }
  
  async getClasses(token: string | null, query?: string): Promise<Class[]> {
    if (token) {
      try {
        const url = query 
          ? `${API_BASE_URL}/classes?query=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/classes`;
          
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch classes');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Failed to fetch classes:', error);
        // Fallback to mock data
        return this.filterClasses(CLASSES, query);
      }
    }
    
    // Fallback for demo/development
    await delay(600);
    return this.filterClasses(CLASSES, query);
  }
  
  private filterClasses(classes: Class[], query?: string): Class[] {
    if (!query) return [...classes];
    
    const lowercasedQuery = query.toLowerCase();
    return classes.filter(classItem => 
      classItem.name.toLowerCase().includes(lowercasedQuery) || 
      classItem.subject.toLowerCase().includes(lowercasedQuery) ||
      classItem.teacherName.toLowerCase().includes(lowercasedQuery)
    );
  }
  
  async getClassById(id: string): Promise<Class | null> {
    await delay(500);
    return CLASSES.find(c => c.id === id) || null;
  }
  
  // Update this method to be explicit about the parameter type
  async createClass(classData: Omit<Class, "id">): Promise<Class> {
    await delay(800);
    const newClass = {
      ...classData,
      id: Math.random().toString(36).substr(2, 9)
    };
    return newClass;
  }
  
  async updateClass(id: string, classData: Partial<Class>): Promise<Class> {
    await delay(700);
    const classIndex = CLASSES.findIndex(c => c.id === id);
    if (classIndex === -1) {
      throw new Error("Class not found");
    }
    
    const updatedClass = {
      ...CLASSES[classIndex],
      ...classData
    };
    
    return updatedClass;
  }
  
  async deleteClass(id: string): Promise<boolean> {
    await delay(600);
    const classIndex = CLASSES.findIndex(c => c.id === id);
    if (classIndex === -1) {
      throw new Error("Class not found");
    }
    
    return true;
  }
}

export const api = new ApiClient();
