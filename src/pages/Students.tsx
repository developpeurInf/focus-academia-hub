import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Student } from '@/lib/types';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  CalendarClock, 
  CheckCircle2, 
  XCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { api } from '@/lib/api';

// Import the dialog components
import StudentFormDialog from '@/components/students/StudentFormDialog';
import StudentProfileDialog from '@/components/students/StudentProfileDialog';
import DeleteStudentDialog from '@/components/students/DeleteStudentDialog';
import StudentFilters, { StudentFilters as StudentFiltersType } from '@/components/students/StudentFilters';

const Students = () => {
  const { user, accessToken } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  
  // Filtering states
  const [filters, setFilters] = useState<StudentFiltersType>({
    grades: [],
    status: [],
  });
  
  // State for managing dialogs
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);
  const [isDeleteStudentOpen, setIsDeleteStudentOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const data = await api.getStudents(accessToken);
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error('Failed to load students. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch students if we have an access token
    if (accessToken) {
      fetchStudents();
    } else {
      // If no access token is available, set empty students list
      setStudents([]);
      setFilteredStudents([]);
      setIsLoading(false);
    }
  }, [accessToken]);

  // Extract unique grades for filter
  const uniqueGrades = [...new Set(students.map(student => student.grade))];

  useEffect(() => {
    let filtered = [...students];
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(lowercasedQuery) || 
        student.email.toLowerCase().includes(lowercasedQuery) || 
        student.grade.toLowerCase().includes(lowercasedQuery)
      );
    }
    
    // Apply grade filters
    if (filters.grades.length > 0) {
      filtered = filtered.filter(student => 
        filters.grades.includes(student.grade)
      );
    }
    
    // Apply status filters
    if (filters.status.length > 0) {
      filtered = filtered.filter(student => 
        filters.status.includes(student.status)
      );
    }
    
    setFilteredStudents(filtered);
  }, [searchQuery, students, filters]);

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle removing a student
  const handleRemoveStudent = async (studentId: string) => {
    try {
      await api.deleteStudent(studentId, accessToken);
      toast.success('Student removed successfully');
      
      // Refresh the student list after successful deletion
      const updatedStudents = await api.getStudents(accessToken);
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
    } catch (error) {
      console.error('Error removing student:', error);
      toast.error('Failed to remove student. Please try again.');
    } finally {
      setIsDeleteStudentOpen(false);
      setSelectedStudent(null);
    }
  };

  // Handle refreshing the student list after adding or updating a student
  const handleStudentAdded = async () => {
    try {
      setIsLoading(true);
      const data = await api.getStudents(accessToken);
      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error('Error refreshing students:', error);
      toast.error('Failed to refresh student list');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: StudentFiltersType) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <DashboardHeader
        title="Student Management"
        description="View, add, and manage students"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search students..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <StudentFilters 
              trigger={
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              }
              onFiltersChange={handleFilterChange}
              availableGrades={uniqueGrades}
            />
            <Button 
              className="flex-1 sm:flex-none"
              onClick={() => setIsAddStudentOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>
      </DashboardHeader>
      
      <div className="bg-white rounded-xl border border-gray-100 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Student</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Grade</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">Enrollment Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 hidden lg:table-cell">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 hidden lg:table-cell">Attendance</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 hidden lg:table-cell">Average Grade</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Loading skeleton
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3 px-4"><Skeleton className="h-10 w-40" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-6 w-16" /></td>
                    <td className="py-3 px-4 hidden md:table-cell"><Skeleton className="h-6 w-24" /></td>
                    <td className="py-3 px-4 hidden lg:table-cell"><Skeleton className="h-6 w-20" /></td>
                    <td className="py-3 px-4 hidden lg:table-cell"><Skeleton className="h-6 w-16" /></td>
                    <td className="py-3 px-4 hidden lg:table-cell"><Skeleton className="h-6 w-16" /></td>
                    <td className="py-3 px-4 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-full" /></td>
                  </tr>
                ))
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    {accessToken ? "No students found. Try a different search term or filter." : "Please log in to view students."}
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback className="bg-focus-100 text-focus-700 text-xs">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{student.name}</div>
                          <div className="text-gray-500 text-xs">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{student.grade}</Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-500 hidden md:table-cell">
                      <div className="flex items-center">
                        <CalendarClock size={14} className="text-gray-400 mr-1.5" />
                        <span>{formatDate(student.enrollmentDate)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex items-center">
                        {student.status === 'active' ? (
                          <>
                            <CheckCircle2 size={14} className="text-green-500 mr-1.5" />
                            <span className="text-green-700">Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={14} className="text-red-500 mr-1.5" />
                            <span className="text-red-700">Inactive</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className={cn(
                        "text-sm font-medium",
                        student.attendance ? student.attendance >= 90 ? "text-green-700" : 
                                             student.attendance >= 80 ? "text-amber-700" : 
                                             "text-red-700" : "text-gray-500"
                      )}>
                        {student.attendance ? `${student.attendance}%` : 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className={cn(
                        "text-sm font-medium",
                        student.averageGrade ? student.averageGrade >= 90 ? "text-green-700" : 
                                               student.averageGrade >= 80 ? "text-amber-700" : 
                                               "text-red-700" : "text-gray-500"
                      )}>
                        {student.averageGrade ? `${student.averageGrade}%` : 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setSelectedStudent(student);
                            setIsViewProfileOpen(true);
                          }}>
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedStudent(student);
                            setIsEditStudentOpen(true);
                          }}>
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Attendance History
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Grade Report
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-500 focus:text-red-500"
                            onClick={() => {
                              setSelectedStudent(student);
                              setIsDeleteStudentOpen(true);
                            }}
                          >
                            Remove Student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="py-4 px-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {filteredStudents.length} of {students.length} students
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Add Student Dialog */}
      <StudentFormDialog 
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onSuccess={handleStudentAdded}
      />

      {/* Edit Student Dialog */}
      {selectedStudent && (
        <StudentFormDialog 
          isOpen={isEditStudentOpen}
          onClose={() => {
            setIsEditStudentOpen(false);
            setSelectedStudent(null);
          }}
          student={selectedStudent}
          onSuccess={handleStudentAdded}
        />
      )}

      {/* View Profile Dialog */}
      {selectedStudent && (
        <StudentProfileDialog 
          isOpen={isViewProfileOpen}
          onClose={() => {
            setIsViewProfileOpen(false);
            setSelectedStudent(null);
          }}
          student={selectedStudent}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedStudent && (
        <DeleteStudentDialog 
          isOpen={isDeleteStudentOpen}
          onClose={() => {
            setIsDeleteStudentOpen(false);
            setSelectedStudent(null);
          }}
          onConfirm={() => handleRemoveStudent(selectedStudent.id)}
          studentId={selectedStudent.id}
          studentName={selectedStudent.name}
        />
      )}
    </div>
  );
};

export default Students;
