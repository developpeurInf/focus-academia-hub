
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
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
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const Students = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const data = await api.getStudents();
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = students.filter(student => 
        student.name.toLowerCase().includes(lowercasedQuery) || 
        student.email.toLowerCase().includes(lowercasedQuery) || 
        student.grade.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
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
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button className="flex-1 sm:flex-none">
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
                    No students found. Try a different search term.
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
                        <span>{student.enrollmentDate}</span>
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
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
                          <DropdownMenuItem>Attendance History</DropdownMenuItem>
                          <DropdownMenuItem>Grade Report</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500 focus:text-red-500">
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
    </div>
  );
};

export default Students;
