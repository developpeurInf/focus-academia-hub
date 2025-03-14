
import React, { useState, useEffect } from 'react';
import { Teacher, Class } from '@/lib/types';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Users, CalendarRange, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

type TeacherClassesDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher;
};

const TeacherClassesDialog: React.FC<TeacherClassesDialogProps> = ({
  isOpen,
  onClose,
  teacher,
}) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchTeacherClasses = async () => {
      try {
        setIsLoading(true);
        // Get all classes
        const allClasses = await api.getClasses(accessToken);
        
        // Filter classes for this teacher
        const teacherClasses = allClasses.filter(c => c.teacherId === teacher.id);
        setClasses(teacherClasses);
      } catch (error) {
        console.error('Error fetching teacher classes:', error);
        toast.error('Failed to load classes', {
          description: 'Please try again later.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && teacher.id) {
      fetchTeacherClasses();
    }
  }, [isOpen, teacher.id, accessToken]);

  // Helper to get schedule summary
  const getScheduleSummary = (classItem: Class) => {
    const days = [...new Set(classItem.schedule.map(s => s.day))];
    return days.join(', ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{teacher.name}'s Classes</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : classes.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No classes assigned to this teacher.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {classes.map(classItem => (
              <div key={classItem.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{classItem.name}</h3>
                    <Badge variant="outline" className="mt-1">{classItem.subject}</Badge>
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{classItem.studentCount} students</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarRange size={14} className="mr-1 text-gray-400" />
                    {getScheduleSummary(classItem)}
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1 text-gray-400" />
                    {classItem.schedule.length} sessions per week
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherClassesDialog;
