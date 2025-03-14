
import React, { useState, useEffect } from 'react';
import { Teacher } from '@/lib/types';
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
import { ClassSchedule } from '@/lib/types';
import { Clock, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type TeacherScheduleDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher;
};

// Helper type for schedule display
type ScheduleItem = {
  className: string;
  subject: string;
  schedule: ClassSchedule;
};

// Days of week for sorting
const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TeacherScheduleDialog: React.FC<TeacherScheduleDialogProps> = ({
  isOpen,
  onClose,
  teacher,
}) => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchTeacherSchedule = async () => {
      try {
        setIsLoading(true);
        // Get all classes
        const classes = await api.getClasses(accessToken);
        
        // Filter classes for this teacher
        const teacherClasses = classes.filter(c => c.teacherId === teacher.id);
        
        // Create schedule items by expanding each class's schedule
        const scheduleItems: ScheduleItem[] = [];
        
        teacherClasses.forEach(cls => {
          cls.schedule.forEach(scheduleItem => {
            scheduleItems.push({
              className: cls.name,
              subject: cls.subject,
              schedule: scheduleItem
            });
          });
        });
        
        // Sort by day of week and start time
        scheduleItems.sort((a, b) => {
          const dayDiff = daysOrder.indexOf(a.schedule.day) - daysOrder.indexOf(b.schedule.day);
          if (dayDiff !== 0) return dayDiff;
          return a.schedule.startTime.localeCompare(b.schedule.startTime);
        });
        
        setSchedule(scheduleItems);
      } catch (error) {
        console.error('Error fetching teacher schedule:', error);
        toast.error('Failed to load schedule', {
          description: 'Please try again later.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && teacher.id) {
      fetchTeacherSchedule();
    }
  }, [isOpen, teacher.id, accessToken]);

  // Group schedule by day
  const scheduleByDay = schedule.reduce((acc, item) => {
    const day = item.schedule.day;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(item);
    return acc;
  }, {} as Record<string, ScheduleItem[]>);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{teacher.name}'s Schedule</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : schedule.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No classes scheduled for this teacher.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {daysOrder.map(day => scheduleByDay[day] && (
              <div key={day} className="space-y-2">
                <h3 className="font-medium text-gray-800">{day}</h3>
                <div className="space-y-2">
                  {scheduleByDay[day].map((item, index) => (
                    <div 
                      key={index} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg bg-gray-50"
                    >
                      <div>
                        <div className="font-medium">{item.className}</div>
                        <div className="text-sm text-gray-500">{item.subject}</div>
                      </div>
                      <div className="flex mt-2 sm:mt-0 space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock size={14} className="mr-1" />
                          {item.schedule.startTime} - {item.schedule.endTime}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin size={14} className="mr-1" />
                          Room {item.schedule.room}
                        </div>
                      </div>
                    </div>
                  ))}
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

export default TeacherScheduleDialog;
