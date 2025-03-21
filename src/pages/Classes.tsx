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
  Clock,
  Eye,
  Pencil,
  Trash,
  CalendarCheck,
  ListCheck
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
import { toast } from 'sonner';
import DeleteClassDialog from '@/components/classes/DeleteClassDialog';
import ClassScheduleDialog from '@/components/classes/ClassScheduleDialog';
import ClassAttendanceDialog from '@/components/classes/ClassAttendanceDialog';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

const Classes = () => {
  const { user, accessToken } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isDeleteClassOpen, setIsDeleteClassOpen] = useState(false);
  const [isEditClassOpen, setIsEditClassOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isManageStudentsOpen, setIsManageStudentsOpen] = useState(false);
  const [isClassScheduleOpen, setIsClassScheduleOpen] = useState(false);
  const [isClassAttendanceOpen, setIsClassAttendanceOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [filters, setFilters] = useState<ClassFiltersType>({
    subjects: [],
    weekdays: [],
  });

  const uniqueSubjects = [...new Set(classes.map(classItem => classItem.subject))];

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      // Pass the accessToken to the getClasses method
      const data = await api.getClasses(accessToken);
      setClasses(data);
      setFilteredClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to load classes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [accessToken]);

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

  const handleClassDeleted = async () => {
    fetchClasses();
  };

  const handleEditClick = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsEditClassOpen(true);
  };

  const handleViewDetailsClick = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsViewDetailsOpen(true);
  };

  const handleManageStudentsClick = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsManageStudentsOpen(true);
  };

  const handleDeleteClick = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsDeleteClassOpen(true);
  };

  const handleViewScheduleClick = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsClassScheduleOpen(true);
  };

  const handleViewAttendanceClick = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsClassAttendanceOpen(true);
  };

  const formatScheduleTime = (schedule: { day: string; startTime: string; endTime: string; room: string }[]) => {
    return schedule.map(s => `${s.day}: ${s.startTime} - ${s.endTime} (Room ${s.room})`).join('\n');
  };

  // Fixed the TypeScript error by removing 'title' and correctly using children
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
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewDetailsClick(classItem)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewScheduleClick(classItem)}>
                          <Calendar className="mr-2 h-4 w-4" />
                          View Schedule
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewAttendanceClick(classItem)}>
                          <CalendarCheck className="mr-2 h-4 w-4" />
                          Manage Attendance
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditClick(classItem)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Class
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleManageStudentsClick(classItem)}>
                          <Users className="mr-2 h-4 w-4" />
                          Manage Students
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-500 focus:text-red-500"
                          onClick={() => handleDeleteClick(classItem)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
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
                <CardFooter className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewScheduleClick(classItem)}
                  >
                    <Calendar className="mr-1 h-3.5 w-3.5" />
                    Schedule
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewAttendanceClick(classItem)}
                  >
                    <ListCheck className="mr-1 h-3.5 w-3.5" />
                    Attendance
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
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewDetailsClick(classItem)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewScheduleClick(classItem)}>
                              <Calendar className="mr-2 h-4 w-4" />
                              View Schedule
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewAttendanceClick(classItem)}>
                              <CalendarCheck className="mr-2 h-4 w-4" />
                              Manage Attendance
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditClick(classItem)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit Class
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleManageStudentsClick(classItem)}>
                              <Users className="mr-2 h-4 w-4" />
                              Manage Students
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-500 focus:text-red-500"
                              onClick={() => handleDeleteClick(classItem)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
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
        onClose={() => setIsAddClassOpen(false)}
        onOpenChange={setIsAddClassOpen}
        onClassCreated={handleClassCreated}
      />
      
      {/* Delete Class Dialog */}
      {selectedClass && (
        <DeleteClassDialog 
          isOpen={isDeleteClassOpen}
          onClose={() => {
            setIsDeleteClassOpen(false);
            setSelectedClass(null);
          }}
          onConfirm={handleClassDeleted}
          classId={selectedClass.id}
          className={selectedClass.name}
        />
      )}

      {/* Class Schedule Dialog */}
      {selectedClass && (
        <ClassScheduleDialog
          isOpen={isClassScheduleOpen}
          onClose={() => {
            setIsClassScheduleOpen(false);
            setSelectedClass(null);
          }}
          classItem={selectedClass}
        />
      )}

      {/* Class Attendance Dialog */}
      {selectedClass && (
        <ClassAttendanceDialog
          isOpen={isClassAttendanceOpen}
          onClose={() => {
            setIsClassAttendanceOpen(false);
            setSelectedClass(null);
          }}
          classItem={selectedClass}
        />
      )}

      {/* View Class Details Dialog */}
      {selectedClass && (
        <Dialog open={isViewDetailsOpen} onOpenChange={(open) => !open && setIsViewDetailsOpen(false)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Class Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="mt-1 text-sm">{selectedClass.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Subject</h3>
                <p className="mt-1 text-sm">{selectedClass.subject}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Teacher</h3>
                <p className="mt-1 text-sm">{selectedClass.teacherName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Students</h3>
                <p className="mt-1 text-sm">{selectedClass.studentCount} students enrolled</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Schedule</h3>
                <div className="mt-1 space-y-1">
                  {selectedClass.schedule.map((scheduleItem, index) => (
                    <div key={index} className="text-sm p-2 rounded bg-gray-50">
                      <span className="font-medium">{scheduleItem.day}:</span> {scheduleItem.startTime} - {scheduleItem.endTime} (Room {scheduleItem.room})
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Placeholder for Edit Class Dialog - Would be an extended version of ClassFormDialog */}
      <Dialog open={isEditClassOpen} onOpenChange={(open) => !open && setIsEditClassOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>
              This feature is coming soon. You would be able to edit {selectedClass?.name} here.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setIsEditClassOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Placeholder for Manage Students Dialog */}
      <Dialog open={isManageStudentsOpen} onOpenChange={(open) => !open && setIsManageStudentsOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Students</DialogTitle>
            <DialogDescription>
              This feature is coming soon. You would be able to manage students for {selectedClass?.name} here.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setIsManageStudentsOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Classes;
