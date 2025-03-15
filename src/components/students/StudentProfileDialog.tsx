
import React from 'react';
import { Student } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, GraduationCap, Mail, MapPin, Phone, UserCheck, Book } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type StudentProfileDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
};

const StudentProfileDialog: React.FC<StudentProfileDialogProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Student Profile</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={student.avatar} alt={student.name} />
            <AvatarFallback className="bg-focus-100 text-focus-700 text-xl">
              {getInitials(student.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900">{student.name}</h3>
            <div className="flex items-center justify-center mt-1">
              <GraduationCap className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-gray-500">{student.grade} Grade</span>
            </div>
            <div className="mt-2">
              <Badge variant={student.status === 'active' ? 'success' : 'destructive'}>
                {student.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <div className="flex items-start space-x-2">
            <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-500">Email</div>
              <div className="text-sm text-gray-900">{student.email}</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-500">Phone</div>
              <div className="text-sm text-gray-900">{student.phoneNumber || 'N/A'}</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-500">Date of Birth</div>
              <div className="text-sm text-gray-900">{student.dateOfBirth ? formatDate(student.dateOfBirth) : 'N/A'}</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <UserCheck className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-500">Enrollment Date</div>
              <div className="text-sm text-gray-900">{formatDate(student.enrollmentDate)}</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 col-span-2">
            <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-500">Address</div>
              <div className="text-sm text-gray-900">{student.address || 'N/A'}</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Book className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-500">Attendance</div>
              <div className="text-sm text-gray-900 font-medium">
                {student.attendance ? `${student.attendance}%` : 'N/A'}
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <GraduationCap className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-gray-500">Average Grade</div>
              <div className="text-sm text-gray-900 font-medium">
                {student.averageGrade ? `${student.averageGrade}%` : 'N/A'}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentProfileDialog;
