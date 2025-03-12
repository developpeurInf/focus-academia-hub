
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Class } from '@/lib/types';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Calendar, 
  BookOpen,
  Users,
  Clock
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import ClassFormDialog from '@/components/classes/ClassFormDialog';
import ClassFilters, { ClassFilters as ClassFiltersType } from '@/components/classes/ClassFilters';
import { toast } from '@/hooks/use-toast';

const Classes = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [filters, setFilters] = useState<ClassFiltersType>({
    subjects: [],
    weekdays: [],
  });

  const uniqueSubjects = [...new Set(classes.map(classItem => classItem.subject))];

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const data = await api.getClasses();
      setClasses(data);
      setFilteredClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load classes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    let filtered = [...classes];
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(classItem => 
        classItem.name.toLowerCase().includes(lowercasedQuery) || 
        classItem.subject.toLowerCase().includes(lowercasedQuery) || 
        classItem.teacherName.toLowerCase().includes(lowercasedQuery)
      );
    }
    
    // Apply subject filters
    if (filters.subjects.length > 0) {
      filtered = filtered.filter(classItem => 
        filters.subjects.includes(classItem.subject)
      );
    }
    
    // Apply day filters
    if (filters.weekdays.length > 0) {
      filtered = filtered.filter(classItem => 
        classItem.schedule.some(schedule => 
          filters.weekdays.includes(schedule.day)
        )
      );
    }
    
    setFilteredClasses(filtered);
  }, [searchQuery, classes, filters]);

  const handleClassCreated = (newClass: Class) => {
    setClasses(prev => [...prev, newClass]);
  };

  const handleFilterChange = (newFilters: ClassFiltersType) => {
    setFilters(newFilters);
  };

  const getScheduleLabel = (schedules: { day: string; startTime: string; endTime: string; room: string }[]) => {
    if (schedules.length === 0) return 'No schedule';
    
    return `${schedules.length} ${schedules.length === 1 ? 'session' : 'sessions'} per week`;
  };

  return (
    <div>
      <DashboardHeader
        title="Class Management"
        description="View, add, and manage classes"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search classes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Tabs defaultValue="grid" className="w-[160px]">
              <TabsList>
                <TabsTrigger value="grid" onClick={() => setViewMode('grid')}>Grid</TabsTrigger>
                <TabsTrigger value="list" onClick={() => setViewMode('list')}>List</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <ClassFilters 
              trigger={
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              }
              onFiltersChange={handleFilterChange}
              availableSubjects={uniqueSubjects}
            />
            
            <Button 
              className="flex-1 sm:flex-none"
              onClick={() => setIsAddClassOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </div>
        </div>
      </DashboardHeader>
      
      {viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons for grid view
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden border border-gray-100 shadow-subtle">
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </Card>
            ))
          ) : filteredClasses.length === 0 ? (
            <div className="col-span-full py-10 text-center text-gray-500">
              No classes found. Try a different search term or filter.
            </div>
          ) : (
            filteredClasses.map((classItem) => (
              <Card key={classItem.id} className="overflow-hidden border border-gray-100 shadow-subtle hover:shadow-card-hover transition-shadow">
                <div className="h-2 bg-focus-600"></div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{classItem.name}</h3>
                      <Badge variant="secondary">{classItem.subject}</Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Class</DropdownMenuItem>
                        <DropdownMenuItem>Manage Students</DropdownMenuItem>
                        <DropdownMenuItem>View Schedule</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500 focus:text-red-500">
                          Delete Class
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center text-sm">
                      <Users size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-700">{classItem.studentCount} Students</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <BookOpen size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-700">Teacher: {classItem.teacherName}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-700">{getScheduleLabel(classItem.schedule)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 bg-gray-50 border-t border-gray-100">
                  <Button variant="outline" size="sm" className="w-full">
                    View Class
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      ) : (
        // List View
        <div className="bg-white rounded-xl border border-gray-100 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Class</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Subject</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">Teacher</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 hidden lg:table-cell">Students</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 hidden lg:table-cell">Schedule</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  // Loading skeleton for list view
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-3 px-4"><Skeleton className="h-6 w-40" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-6 w-24" /></td>
                      <td className="py-3 px-4 hidden md:table-cell"><Skeleton className="h-6 w-32" /></td>
                      <td className="py-3 px-4 hidden lg:table-cell"><Skeleton className="h-6 w-16" /></td>
                      <td className="py-3 px-4 hidden lg:table-cell"><Skeleton className="h-6 w-32" /></td>
                      <td className="py-3 px-4 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-full" /></td>
                    </tr>
                  ))
                ) : filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No classes found. Try a different search term.
                    </td>
                  </tr>
                ) : (
                  filteredClasses.map((classItem) => (
                    <tr key={classItem.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{classItem.name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">{classItem.subject}</Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-700 hidden md:table-cell">
                        {classItem.teacherName}
                      </td>
                      <td className="py-3 px-4 text-gray-700 hidden lg:table-cell">
                        {classItem.studentCount}
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <div className="flex items-center text-gray-700">
                          <Clock size={14} className="text-gray-400 mr-1.5" />
                          <span>{getScheduleLabel(classItem.schedule)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Class</DropdownMenuItem>
                            <DropdownMenuItem>Manage Students</DropdownMenuItem>
                            <DropdownMenuItem>View Schedule</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500 focus:text-red-500">
                              Delete Class
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
              Showing {filteredClasses.length} of {classes.length} classes
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
      )}
      
      {/* Add Class Dialog */}
      <ClassFormDialog 
        open={isAddClassOpen} 
        onOpenChange={setIsAddClassOpen}
        onClassCreated={handleClassCreated}
      />
    </div>
  );
};

export default Classes;
