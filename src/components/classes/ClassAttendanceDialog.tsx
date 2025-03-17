
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Clock, User, Users, CheckCircle, XCircle, AlertCircle, ClockIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Class, ClassAttendance, StudentAttendance } from "@/lib/types";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface ClassAttendanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  classItem: Class | null;
}

const MOCK_ATTENDANCE: StudentAttendance[] = [
  { studentId: "1", studentName: "Emma Wilson", status: "present" },
  { studentId: "2", studentName: "Michael Johnson", status: "late" },
  { studentId: "3", studentName: "Sophia Brown", status: "absent" },
  { studentId: "4", studentName: "Daniel Taylor", status: "excused" },
  { studentId: "5", studentName: "Olivia Martinez", status: "present" },
];

const ClassAttendanceDialog: React.FC<ClassAttendanceDialogProps> = ({
  isOpen,
  onClose,
  classItem,
}) => {
  const { accessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [attendance, setAttendance] = useState<StudentAttendance[]>([]);
  
  const fetchAttendance = async (date: Date) => {
    setIsLoading(true);
    try {
      // In a real implementation, you would fetch attendance from API
      // const data = await api.getClassAttendance(classItem?.id, format(date, 'yyyy-MM-dd'), accessToken);
      // setAttendance(data.attendees);
      
      // Using mock data for demonstration
      setTimeout(() => {
        setAttendance(MOCK_ATTENDANCE);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to load attendance data");
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen && classItem) {
      fetchAttendance(date);
    }
  }, [isOpen, classItem, date]);
  
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      fetchAttendance(newDate);
    }
  };
  
  const handleStatusChange = (studentId: string, status: StudentAttendance['status']) => {
    setAttendance(prev => 
      prev.map(student => 
        student.studentId === studentId ? { ...student, status } : student
      )
    );
    
    // In a real implementation, you would save this to the API
    toast.success(`Status updated for ${attendance.find(s => s.studentId === studentId)?.studentName}`);
  };
  
  const getStatusIcon = (status: StudentAttendance['status']) => {
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
  
  const getStatusBadge = (status: StudentAttendance['status']) => {
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
  
  const saveAttendance = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would save attendance to API
      // await api.saveClassAttendance(classItem?.id, format(date, 'yyyy-MM-dd'), attendance, accessToken);
      
      setTimeout(() => {
        toast.success("Attendance saved successfully");
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error("Failed to save attendance data");
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Class Attendance</DialogTitle>
          <DialogDescription>
            Manage attendance for {classItem?.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-gray-500" />
              <span className="font-medium">{classItem?.studentCount} Students</span>
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <Separator />
          
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                          No attendance data available for this date
                        </TableCell>
                      </TableRow>
                    ) : (
                      attendance.map((student) => (
                        <TableRow key={student.studentId}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <User className="mr-2 h-4 w-4 text-gray-500" />
                              {student.studentName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getStatusIcon(student.status)}
                              <span className="ml-2">{getStatusBadge(student.status)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              defaultValue={student.status}
                              onValueChange={(value) => handleStatusChange(
                                student.studentId, 
                                value as StudentAttendance['status']
                              )}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="present">Present</SelectItem>
                                <SelectItem value="absent">Absent</SelectItem>
                                <SelectItem value="late">Late</SelectItem>
                                <SelectItem value="excused">Excused</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                    <span className="text-xs text-gray-500">Present: {attendance.filter(s => s.status === 'present').length}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                    <span className="text-xs text-gray-500">Absent: {attendance.filter(s => s.status === 'absent').length}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
                    <span className="text-xs text-gray-500">Late: {attendance.filter(s => s.status === 'late').length}</span>
                  </div>
                </div>
                
                <Button 
                  variant="default" 
                  onClick={saveAttendance}
                  disabled={isLoading}
                >
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClassAttendanceDialog;
