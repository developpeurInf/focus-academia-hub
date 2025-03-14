
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Teacher } from '@/lib/types';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  CalendarClock, 
  BookOpen,
  GraduationCap,
  Phone
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
import { api } from '@/lib/api';
import { toast } from 'sonner';

const Teachers = () => {
  const { user, accessToken } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setIsLoading(true);
        const data = await api.getTeachers(accessToken);
        setTeachers(data);
        setFilteredTeachers(data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        toast.error('Failed to load teachers. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch teachers if we have an access token
    if (accessToken) {
      fetchTeachers();
    } else {
      // If no access token is available, set empty teachers list
      setTeachers([]);
      setFilteredTeachers([]);
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTeachers(teachers);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = teachers.filter(teacher => 
        teacher.name.toLowerCase().includes(lowercasedQuery) || 
        teacher.email.toLowerCase().includes(lowercasedQuery) || 
        teacher.subject.toLowerCase().includes(lowercasedQuery) ||
        (teacher.department && teacher.department.toLowerCase().includes(lowercasedQuery)) ||
        (teacher.qualification && teacher.qualification.toLowerCase().includes(lowercasedQuery))
      );
      setFilteredTeachers(filtered);
    }
  }, [searchQuery, teachers]);

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

  return (
    <div>
      <DashboardHeader
        title="Teacher Management"
        description="View, add, and manage teachers"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search teachers..."
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
              Add Teacher
            </Button>
          </div>
        </div>
      </DashboardHeader>
      
      <div className="bg-white rounded-xl border border-gray-100 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Teacher</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Subject</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">Join Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 hidden lg:table-cell">Qualification</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 hidden lg:table-cell">Contact</th>
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
                    <td className="py-3 px-4 hidden md:table-cell"><Skeleton className="h-6 w-24" /></td>
                    <td className="py-3 px-4 hidden lg:table-cell"><Skeleton className="h-6 w-40" /></td>
                    <td className="py-3 px-4 hidden lg:table-cell"><Skeleton className="h-6 w-24" /></td>
                    <td className="py-3 px-4 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-full" /></td>
                  </tr>
                ))
              ) : filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    {accessToken ? "No teachers found. Try a different search term." : "Please log in to view teachers."}
                  </td>
                </tr>
              ) : (
                filteredTeachers.map(teacher => (
                  <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={teacher.avatar} alt={teacher.name} />
                          <AvatarFallback className="bg-focus-100 text-focus-700 text-xs">
                            {getInitials(teacher.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{teacher.name}</div>
                          <div className="text-gray-500 text-xs">{teacher.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <BookOpen size={14} className="text-gray-400 mr-1.5" />
                        <Badge variant="secondary">{teacher.subject}</Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500 hidden md:table-cell">
                      {teacher.department || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-500 hidden md:table-cell">
                      <div className="flex items-center">
                        <CalendarClock size={14} className="text-gray-400 mr-1.5" />
                        <span>{formatDate(teacher.joinDate)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex items-center">
                        <GraduationCap size={14} className="text-gray-400 mr-1.5" />
                        <span className="text-gray-700">{teacher.qualification || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex items-center">
                        <Phone size={14} className="text-gray-400 mr-1.5" />
                        <span className="text-gray-700">{teacher.phoneNumber || 'N/A'}</span>
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
                          <DropdownMenuItem>View Schedule</DropdownMenuItem>
                          <DropdownMenuItem>Assigned Classes</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500 focus:text-red-500">
                            Remove Teacher
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
            Showing {filteredTeachers.length} of {teachers.length} teachers
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

export default Teachers;
