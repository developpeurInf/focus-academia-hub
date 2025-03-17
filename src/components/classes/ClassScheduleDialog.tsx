
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
import { Calendar, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Class, ClassSchedule } from "@/lib/types";

interface ClassScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  classItem: Class | null;
}

const ClassScheduleDialog: React.FC<ClassScheduleDialogProps> = ({
  isOpen,
  onClose,
  classItem,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Group schedule by day
  const scheduleByDay = classItem?.schedule.reduce<Record<string, ClassSchedule[]>>((acc, schedule) => {
    if (!acc[schedule.day]) {
      acc[schedule.day] = [];
    }
    acc[schedule.day].push(schedule);
    return acc;
  }, {}) || {};
  
  // Sort days of the week in correct order
  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const sortedDays = Object.keys(scheduleByDay).sort(
    (a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b)
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Class Schedule</DialogTitle>
          <DialogDescription>
            View the schedule for {classItem?.name}
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-14 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedDays.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No schedule available for this class
              </div>
            ) : (
              sortedDays.map((day) => (
                <div key={day} className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-primary" />
                    <h3 className="font-medium">{day}</h3>
                  </div>
                  <div className="space-y-2">
                    {scheduleByDay[day].map((session, index) => (
                      <div 
                        key={index} 
                        className="p-3 rounded-md border border-border bg-muted/30"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-gray-500" />
                            <span>{session.startTime} - {session.endTime}</span>
                          </div>
                          <Badge variant="outline">Room {session.room}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  {day !== sortedDays[sortedDays.length - 1] && (
                    <Separator className="my-3" />
                  )}
                </div>
              ))
            )}
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClassScheduleDialog;
