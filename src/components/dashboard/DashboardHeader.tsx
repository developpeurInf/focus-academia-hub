
import React from 'react';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  description,
  children,
  className,
}) => {
  const today = new Date();
  const formattedDate = format(today, 'EEEE, MMMM d, yyyy');

  return (
    <div className={cn("mb-8", className)}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{title}</h1>
          {description && (
            <p className="text-gray-500">{description}</p>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <CalendarDays size={16} className="mr-1.5" />
          <span>{formattedDate}</span>
        </div>
      </div>
      {children && (
        <div className="mt-6">
          {children}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
