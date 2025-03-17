
import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useAuth } from '@/context/AuthContext';
import { 
  Calendar, 
  Search, 
  Filter, 
  BookOpen, 
  User,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertCircle,
  Download,
  Filter as FilterIcon
} from 'lucide-react';
import { api } from '@/lib/api';
import { Class, Attendance, StudentAttendance } from '@/lib/types';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data for attendance records
const MOCK_ATTENDANCE_DATA = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Emma Wilson',
    date: '2023-10-01',
    status: 'present' as const,
    class: 'Mathematics 101'
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Michael Johnson',
    date: '2023-10-01',
    status: 'late' as const,
    class: 'Physics 202'
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Sophia Brown',
    date: '2023-10-01',
    status: 'absent' as const,
    class: 'Literature 301'
  },
  {
    id: '4',
    studentId: '4',
    studentName: 'Daniel Taylor',
    date: '2023-10-02',
    status: 'excused' as const,
    class: 'Chemistry 101'
  },
  {
    id: '5',
    studentId: '5',
    studentName: 'Olivia Martinez',
    date: '2023-10-02',
    status: 'present' as const,
    class: 'Biology 301'
  },
];

// Mock data for class attendance
const MOCK_CLASS_ATTENDANCE: Record<string, StudentAttendance[]> = {
  "Mathematics 101": [
    { studentId: "1", studentName: "Emma Wilson", status: "present" },
    { studentId: "2", studentName: "Michael Johnson", status: "present" },
    { studentId: "3", studentName: "Sophia Brown", status: "present" },
  ],
  "Physics 202": [
    { studentId: "1", studentName: "Emma Wilson", status: "late" },
    { studentId: "4", studentName: "Daniel Taylor", status: "absent" },
    { studentId: "5", studentName: "Olivia Martinez", status: "present" },
  ],
  "Literature 301": [
    { studentId: "3", studentName: "Sophia Brown", status: "absent" },
    { studentId: "5", studentName: "Olivia Martinez", status: "present" },
  ],
};

const AttendancePage = () => {
  const { user, accessToken } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>(MOCK_ATTENDANCE_DATA);
  const [activeTab, setActiveTab] = useState<'overview' | 'byStudent' | 'byClass'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedAttendance, setEditedAttendance] = useState<Record<string, StudentAttendance['status']>>({});

  // Fetch classes for dropdown
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await api.getClasses(accessToken);
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast.error('Failed to load classes. Please try again.');
      }
    };

    fetchClasses();
  }, [accessToken]);

  // Fetch attendance data (using mock data for now)
  useEffect(() => {
    const fetchAttendanceData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, you would fetch from API
        // const data = await api.getAttendance(format(date, 'yyyy-MM-dd'), selectedClass, accessToken);
        
        // Using mock data for demonstration
        setTimeout(() => {
          setAttendanceRecords(MOCK_ATTENDANCE_DATA);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        toast.error('Failed to load attendance data.');
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, [date, selectedClass, accessToken]);

  // Filter attendance records based on selected filters
  const filteredAttendance = attendanceRecords.filter(record => {
    // Filter by date
    const recordDate = new Date(record.date);
    const selectedDate = new Date(date);
    const dateMatch = 
      recordDate.getFullYear() === selectedDate.getFullYear() &&
      recordDate.getMonth() === selectedDate.getMonth() &&
      recordDate.getDate() === selectedDate.getDate();
    
    // Filter by class
    const classMatch = selectedClass === 'all' || record.class === selectedClass;
    
    // Filter by status
    const statusMatch = selectedStatus === 'all' || record.status === selectedStatus;
    
    // Filter by search query
    const searchMatch = 
      searchQuery === '' || 
      record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.class.toLowerCase().includes(searchQuery.toLowerCase());
    
    return dateMatch && classMatch && statusMatch && searchMatch;
  });

  // Get attendance stats for the overview
  const getAttendanceStats = () => {
    const total = filteredAttendance.length;
    const present = filteredAttendance.filter(r => r.status === 'present').length;
    const absent = filteredAttendance.filter(r => r.status === 'absent').length;
    const late = filteredAttendance.filter(r => r.status === 'late').length;
    const excused = filteredAttendance.filter(r => r.status === 'excused').length;
    
    const presentPercentage = total > 0 ? Math.round((present / total) * 100) : 0;
    const absentPercentage = total > 0 ? Math.round((absent / total) * 100) : 0;
    const latePercentage = total > 0 ? Math.round((late / total) * 100) : 0;
    const excusedPercentage = total > 0 ? Math.round((excused / total) * 100) : 0;
    
    return { 
      total, 
      present, 
      absent, 
      late, 
      excused,
      presentPercentage,
      absentPercentage,
      latePercentage,
      excusedPercentage
    };
  };

  const stats = getAttendanceStats();

  // Handle attendance status change
  const handleStatusChange = (recordId: string, newStatus: StudentAttendance['status']) => {
    setEditedAttendance(prev => ({
      ...prev,
      [recordId]: newStatus
    }));
  };

  // Save edited attendance
  const saveAttendanceChanges = () => {
    setIsLoading(true);
    
    try {
      // Update the records with the edited values
      const updatedRecords = attendanceRecords.map(record => {
        if (editedAttendance[record.id]) {
          return { ...record, status: editedAttendance[record.id] };
        }
        return record;
      });
      
      setAttendanceRecords(updatedRecords);
      setEditedAttendance({});
      setIsEditing(false);
      toast.success('Attendance updated successfully');
    } catch (error) {
      console.error('Error saving attendance changes:', error);
      toast.error('Failed to save attendance changes');
    } finally {
      setIsLoading(false);
    }
  };

  // Render status badge
  const renderStatusBadge = (status: StudentAttendance['status']) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Present</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Absent</Badge>;
      case 'late':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Late</Badge>;
      case 'excused':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Excused</Badge>;
      default:
        return null;
    }
  };

  // Render status icon
  const renderStatusIcon = (status: StudentAttendance['status']) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'late':
        return <ClockIcon className="h-4 w-4 text-amber-500" />;
      case 'excused':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Attendance Management"
        description="View and manage student attendance"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-auto flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Calendar className="mr-2 h-4 w-4" />
                {format(date, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button
            variant="default"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel Editing' : 'Edit Attendance'}
          </Button>
          
          {isEditing && (
            <Button
              variant="default"
              size="sm"
              className="w-full sm:w-auto"
              onClick={saveAttendanceChanges}
            >
              Save Changes
            </Button>
          )}
        </div>
      </DashboardHeader>

      {/* Filters */}
      <Card className="p-4 bg-muted/30">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[180px]">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map(c => (
                  <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                ))}
                {/* Add mock classes since real classes might not be loaded yet */}
                <SelectItem value="Mathematics 101">Mathematics 101</SelectItem>
                <SelectItem value="Physics 202">Physics 202</SelectItem>
                <SelectItem value="Literature 301">Literature 301</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="excused">Excused</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                <TabsTrigger value="byStudent" className="flex-1">By Student</TabsTrigger>
                <TabsTrigger value="byClass" className="flex-1">By Class</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </Card>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">{format(date, 'MMM d, yyyy')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Present
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.present} <span className="text-sm text-green-600">({stats.presentPercentage}%)</span></div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${stats.presentPercentage}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                Absent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.absent} <span className="text-sm text-red-600">({stats.absentPercentage}%)</span></div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${stats.absentPercentage}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <ClockIcon className="mr-2 h-4 w-4 text-amber-500" />
                Late
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.late} <span className="text-sm text-amber-600">({stats.latePercentage}%)</span></div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full" 
                  style={{ width: `${stats.latePercentage}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Records Table (For all tabs) */}
      <Card>
        {isLoading ? (
          <CardContent className="p-6">
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        ) : filteredAttendance.length === 0 ? (
          <CardContent className="p-6 text-center">
            <div className="py-8">
              <p className="text-lg text-gray-500">No attendance records found</p>
              <p className="text-sm text-gray-400">Try a different date or filter</p>
            </div>
          </CardContent>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    {activeTab !== 'byClass' && <TableHead>Class</TableHead>}
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    {isEditing && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-gray-500" />
                          {record.studentName}
                        </div>
                      </TableCell>
                      {activeTab !== 'byClass' && (
                        <TableCell>
                          <div className="flex items-center">
                            <BookOpen className="mr-2 h-4 w-4 text-gray-500" />
                            {record.class}
                          </div>
                        </TableCell>
                      )}
                      <TableCell>{format(new Date(record.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {renderStatusIcon(editedAttendance[record.id] || record.status)}
                          <span className="ml-2">
                            {renderStatusBadge(editedAttendance[record.id] || record.status)}
                          </span>
                        </div>
                      </TableCell>
                      {isEditing && (
                        <TableCell>
                          <Select
                            value={editedAttendance[record.id] || record.status}
                            onValueChange={(value) => handleStatusChange(
                              record.id, 
                              value as StudentAttendance['status']
                            )}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="present">Present</SelectItem>
                              <SelectItem value="absent">Absent</SelectItem>
                              <SelectItem value="late">Late</SelectItem>
                              <SelectItem value="excused">Excused</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <CardFooter className="flex justify-between p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {filteredAttendance.length} records
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

export default AttendancePage;
