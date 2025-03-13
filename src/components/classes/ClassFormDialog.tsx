
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Plus, Trash } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Class, ClassSchedule } from '@/lib/types';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const defaultSchedule: ClassSchedule = {
  day: 'Monday',
  startTime: '09:00',
  endTime: '10:30',
  room: '',
};

// Update the schema to match the Class type - make all required fields non-optional
const classSchema = z.object({
  name: z.string().min(3, { message: 'Class name must be at least 3 characters' }),
  subject: z.string().min(2, { message: 'Subject is required' }),
  teacherId: z.string().min(1, { message: 'Teacher is required' }),
  teacherName: z.string().min(1, { message: 'Teacher name is required' }),
  studentCount: z.number().min(0),
  schedule: z.array(
    z.object({
      day: z.string(),
      startTime: z.string(),
      endTime: z.string(),
      room: z.string().min(1, { message: 'Room number is required' }),
    })
  ).min(1, { message: 'At least one schedule entry is required' }),
});

type ClassFormValues = z.infer<typeof classSchema>;

interface ClassFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClassCreated?: (newClass: Class) => void;
}

export default function ClassFormDialog({
  open,
  onOpenChange,
  onClassCreated,
}: ClassFormDialogProps) {
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: '',
      subject: '',
      teacherId: '',
      teacherName: '',
      studentCount: 0,
      schedule: [{ ...defaultSchedule }],
    },
  });

  const { reset, formState } = form;

  // Mock teacher data (would be fetched from API in a real app)
  const teachers = [
    { id: '2', name: 'John Smith' },
    { id: '5', name: 'Sarah Johnson' },
    { id: '6', name: 'Robert Chen' },
    { id: '7', name: 'Maria Garcia' },
    { id: '8', name: 'James Wilson' },
    { id: '9', name: 'Emily Davis' },
  ];

  const handleAddSchedule = () => {
    const currentSchedule = form.getValues('schedule') || [];
    form.setValue('schedule', [...currentSchedule, { ...defaultSchedule }]);
  };

  const handleRemoveSchedule = (index: number) => {
    const currentSchedule = form.getValues('schedule');
    if (currentSchedule.length > 1) {
      form.setValue(
        'schedule',
        currentSchedule.filter((_, i) => i !== index)
      );
    }
  };

  const onSubmit = async (data: ClassFormValues) => {
    try {
      // Explicitly cast the data to ensure it meets the required type
      const classData: Omit<Class, "id"> = {
        name: data.name,
        subject: data.subject,
        teacherId: data.teacherId,
        teacherName: data.teacherName,
        studentCount: data.studentCount,
        schedule: data.schedule,
      };
      
      // Now pass the properly typed data to the API
      const newClass = await api.createClass(classData);
      toast({
        title: 'Success',
        description: 'Class has been created successfully',
      });
      
      if (onClassCreated) {
        onClassCreated(newClass);
      }
      
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating class:', error);
      toast({
        title: 'Error',
        description: 'Failed to create class. Please try again.',
        variant: 'destructive',
      });
    }
  };

  React.useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setTimeout(() => reset(), 100);
    }
  }, [open, reset]);

  const handleTeacherChange = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
      form.setValue('teacherName', teacher.name);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Mathematics 101" {...field} />
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
                      <Input placeholder="e.g. Mathematics" {...field} />
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
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleTeacherChange(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teachers.map(teacher => (
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
              
              <FormField
                control={form.control}
                name="studentCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Maximum number of students" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Class Schedule</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSchedule}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Schedule
                </Button>
              </div>
              
              {form.watch('schedule').map((_, index) => (
                <div 
                  key={index}
                  className="border rounded-md p-4 space-y-3"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Session {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSchedule(index)}
                      disabled={form.watch('schedule').length <= 1}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name={`schedule.${index}.day`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Day</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a day" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {weekdays.map(day => (
                                <SelectItem key={day} value={day}>
                                  {day}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`schedule.${index}.room`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. A101" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`schedule.${index}.startTime`}
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
                      name={`schedule.${index}.endTime`}
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
                </div>
              ))}
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? "Creating..." : "Create Class"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
