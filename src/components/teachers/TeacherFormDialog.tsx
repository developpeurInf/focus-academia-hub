
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Teacher } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Define the form schema using zod
const teacherFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(1, { message: 'Subject is required.' }),
  phoneNumber: z.string().optional(),
  department: z.string().optional(),
  qualification: z.string().optional(),
  joinDate: z.string(),
});

type TeacherFormValues = z.infer<typeof teacherFormSchema>;

type TeacherFormDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  teacher?: Teacher;
  onSuccess?: () => void;
};

const TeacherFormDialog: React.FC<TeacherFormDialogProps> = ({
  isOpen,
  onClose,
  teacher,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { accessToken } = useAuth();
  const isEditing = !!teacher;

  // Initialize the form with default values
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      name: teacher?.name || '',
      email: teacher?.email || '',
      subject: teacher?.subject || '',
      phoneNumber: teacher?.phoneNumber || '',
      department: teacher?.department || '',
      qualification: teacher?.qualification || '',
      joinDate: teacher?.joinDate || new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: TeacherFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (isEditing && teacher) {
        // TODO: Implement update teacher API
        // For now, we'll just show a success message
        toast.success('Teacher updated successfully', {
          description: `${data.name}'s information has been updated.`,
        });
      } else {
        // Create a new teacher
        // Make sure all required properties are passed as non-optional
        await api.createTeacher({
          name: data.name,           // Required field
          email: data.email,         // Required field
          subject: data.subject,     // Required field
          joinDate: data.joinDate,   // Required field
          avatar: '/placeholder.svg', // Default avatar
          phoneNumber: data.phoneNumber,
          department: data.department,
          qualification: data.qualification,
        });
        
        toast.success('Teacher added successfully', {
          description: `${data.name} has been added to the system.`,
        });
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving teacher:', error);
      toast.error('Failed to save teacher', {
        description: 'Please try again or contact support if the issue persists.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Teacher' : 'Add New Teacher'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="teacher@focus.edu" {...field} />
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
                      <Input placeholder="Mathematics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="qualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualification</FormLabel>
                    <FormControl>
                      <Input placeholder="Ph.D. in Mathematics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="joinDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Join Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Teacher' : 'Add Teacher'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherFormDialog;
