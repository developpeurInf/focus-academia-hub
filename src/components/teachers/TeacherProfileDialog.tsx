
import React from 'react';
import { Teacher } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  CalendarClock, 
  BookOpen,
  GraduationCap,
  Phone,
  Mail,
  Building,
  UserRound
} from 'lucide-react';

type TeacherProfileDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher;
};

const TeacherProfileDialog: React.FC<TeacherProfileDialogProps> = ({
  isOpen,
  onClose,
  teacher,
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
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Teacher Profile</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 p-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={teacher.avatar} alt={teacher.name} />
            <AvatarFallback className="bg-focus-100 text-focus-700 text-xl">
              {getInitials(teacher.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <h2 className="text-xl font-semibold">{teacher.name}</h2>
            <div className="flex items-center justify-center text-gray-500 gap-1">
              <BookOpen size={16} />
              <span>{teacher.subject} Teacher</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 p-2 rounded-lg border">
              <Mail className="text-gray-400" size={18} />
              <div>
                <div className="text-xs text-gray-500">Email</div>
                <div>{teacher.email}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 p-2 rounded-lg border">
              <Phone className="text-gray-400" size={18} />
              <div>
                <div className="text-xs text-gray-500">Phone</div>
                <div>{teacher.phoneNumber || 'Not provided'}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 p-2 rounded-lg border">
              <Building className="text-gray-400" size={18} />
              <div>
                <div className="text-xs text-gray-500">Department</div>
                <div>{teacher.department || 'Not assigned'}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 p-2 rounded-lg border">
              <GraduationCap className="text-gray-400" size={18} />
              <div>
                <div className="text-xs text-gray-500">Qualification</div>
                <div>{teacher.qualification || 'Not provided'}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 p-2 rounded-lg border">
              <CalendarClock className="text-gray-400" size={18} />
              <div>
                <div className="text-xs text-gray-500">Join Date</div>
                <div>{formatDate(teacher.joinDate)}</div>
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

export default TeacherProfileDialog;
