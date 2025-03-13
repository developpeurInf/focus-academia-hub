import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarDays, Clock, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import { Class, ClassSchedule } from '@/lib/types';

interface ClassFormDialogProps {
  open: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  onClassCreated?: (newClass: Class) => void;
}

interface Teacher {
  id: string;
  name: string;
}

const teachers: Teacher[] = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Alice Johnson' },
];

const initialScheduleItem: ClassSchedule = {
  day: '',
  startTime: '',
  endTime: '',
  room: '',
};

// Update the schema to match the Class type - make all required fields non-optional
const classSchema = z.object({
  name: z.string().min(3, { message: 'Class name must be at least 3 characters' }),
  subject: z.string().min(2, { message: 'Subject is required' }),
  teacherId: z.string().min(1, { message: 'Teacher is required' }),
  teacherName: z.string(),
  studentCount: z.number().min(0).default(0),
  schedule: z.array(
    z.object({
      day: z.string().min(1, { message: 'Day is required' }),
      startTime: z.string().min(1, { message: 'Start time is required' }),
      endTime: z.string().min(1, { message: 'End time is required' }),
      room: z.string().min(1, { message: 'Room is required' }),
    })
  ).min(1, { message: 'At least one schedule item is required' }),
});

type ClassFormValues = z.infer<typeof classSchema>;

const ClassFormDialog: React.FC<ClassFormDialogProps> = ({ open, onClose, onOpenChange, onClassCreated }) => {
  const { toast } = useToast();
  const [scheduleItems, setScheduleItems] = React.useState<ClassSchedule[]>([initialScheduleItem]);

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: '',
      subject: '',
      teacherId: '',
      teacherName: '',
      studentCount: 0,
      schedule: [initialScheduleItem],
    },
  });

  const onSubmit = async (data: ClassFormValues) => {
    try {
      // Explicitly cast the data to ensure it meets the required type
      const classData: Omit<Class, "id"> = {
        name: data.name,
        subject: data.subject,
        teacherId: data.teacherId,
        teacherName: data.teacherName,
        studentCount: data.studentCount,
        // Ensure each schedule item has all required fields
        schedule: data.schedule.map(item => ({
          day: item.day,
          startTime: item.startTime,
          endTime: item.endTime,
          room: item.room
        })),
      };
      
      // Now pass the properly typed data to the API
      const newClass = await api.createClass(classData);
      toast({
        title: 'Success',
        description: 'Class has been created successfully',
      });
      onClose();
      onClassCreated && onClassCreated(newClass);
    } catch (error) {
      console.error('Failed to create class:', error);
      toast({
        title: 'Error',
        description: 'Failed to create class. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const addScheduleItem = () => {
    setScheduleItems([...scheduleItems, initialScheduleItem]);
    form.setValue('schedule', [...scheduleItems, initialScheduleItem]);
  };

  const removeScheduleItem = (index: number) => {
    const newScheduleItems = [...scheduleItems];
    newScheduleItems.splice(index, 1);
    setScheduleItems(newScheduleItems);
    form.setValue('schedule', newScheduleItems);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Class</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter class name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teacherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teacher</FormLabel>
                  <Select onValueChange={(value) => {
                    const selectedTeacher = teachers.find(teacher => teacher.id === value);
                    form.setValue('teacherId', value);
                    form.setValue('teacherName', selectedTeacher?.name || '');
                  }}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {scheduleItems.map((_, index) => (
              <div key={index} className="space-y-2 border p-4 rounded-md">
                <h4 className="text-sm font-medium">Schedule Item #{index + 1}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`schedule.${index}.day` as const}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Day</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a day" defaultValue={field.value} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Monday">Monday</SelectItem>
                              <SelectItem value="Tuesday">Tuesday</SelectItem>
                              <SelectItem value="Wednesday">Wednesday</SelectItem>
                              <SelectItem value="Thursday">Thursday</SelectItem>
                              <SelectItem value="Friday">Friday</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`schedule.${index}.room` as const}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter room number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`schedule.${index}.startTime` as const}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`schedule.${index}.endTime` as const}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {scheduleItems.length > 1 && (
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeScheduleItem(index)}>
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="secondary" size="sm" onClick={addScheduleItem}>
              Add Schedule Item
            </Button>
            <Button type="submit">Create Class</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ClassFormDialog;
