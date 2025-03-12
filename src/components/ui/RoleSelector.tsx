
import React from 'react';
import { 
  GraduationCap, 
  User, 
  Users, 
  UserPlus, 
  CheckCircle2,
  CircleIcon
} from 'lucide-react';
import { UserRole } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onRoleSelect: (role: UserRole) => void;
}

interface RoleOption {
  role: UserRole;
  label: string;
  icon: React.ElementType;
  description: string;
}

const roleOptions: RoleOption[] = [
  {
    role: 'admin',
    label: 'Administrator',
    icon: Users,
    description: 'Full control over the school management system'
  },
  {
    role: 'teacher',
    label: 'Teacher',
    icon: User,
    description: 'Manage classes, grades, and student progress'
  },
  {
    role: 'student',
    label: 'Student',
    icon: GraduationCap,
    description: 'View grades, schedules, and assignments'
  },
  {
    role: 'parent',
    label: 'Parent',
    icon: UserPlus,
    description: 'Monitor your child\'s progress and payments'
  }
];

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onRoleSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {roleOptions.map((option) => {
        const isSelected = selectedRole === option.role;
        const IconComponent = option.icon;
        
        return (
          <button
            key={option.role}
            type="button"
            onClick={() => onRoleSelect(option.role)}
            className={cn(
              "flex items-start p-4 rounded-xl border border-gray-200 transition-all duration-300",
              "hover:shadow-card focus:outline-none focus:ring-2 focus:ring-focus-400 focus:ring-offset-2",
              isSelected 
                ? "border-focus-400 bg-focus-50 ring-2 ring-focus-400 ring-offset-2" 
                : "hover:border-gray-300 hover:bg-white"
            )}
          >
            <div className="flex-shrink-0 mr-4">
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center",
                isSelected ? "bg-focus-100 text-focus-600" : "bg-gray-100 text-gray-500"
              )}>
                <IconComponent size={22} />
              </div>
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center mb-1">
                <h3 className={cn(
                  "text-base font-medium",
                  isSelected ? "text-focus-700" : "text-gray-900"
                )}>
                  {option.label}
                </h3>
                {isSelected && (
                  <CheckCircle2 size={16} className="text-focus-600 ml-2" />
                )}
                {!isSelected && (
                  <CircleIcon size={16} className="text-gray-300 ml-2" />
                )}
              </div>
              <p className="text-sm text-gray-500">{option.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default RoleSelector;
