
import React from 'react';
import { Link } from 'react-router-dom';
import { format, isToday, isYesterday } from 'date-fns';
import { ActivityItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Award, 
  ClipboardCheck, 
  DollarSign, 
  AlertCircle 
} from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityItem[];
  className?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, className }) => {
  // Icons for different activity types
  const activityIcons = {
    message: MessageSquare,
    grade: Award,
    attendance: ClipboardCheck,
    payment: DollarSign,
    system: AlertCircle,
  };

  // Format the date in a readable way
  const formatActivityDate = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className={cn("bg-white rounded-xl border border-gray-100 shadow-subtle overflow-hidden", className)}>
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {activities.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500">No recent activities</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {activities.map((activity) => {
              const IconComponent = activityIcons[activity.type] || activityIcons.system;
              
              return (
                <li key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start">
                    <Avatar className="h-10 w-10 mr-3 mt-0.5">
                      <AvatarImage src={activity.userAvatar} alt={activity.userName} />
                      <AvatarFallback className="bg-focus-100 text-focus-700">
                        {getInitials(activity.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.userName}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatActivityDate(activity.date)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {activity.action}{' '}
                        <span className="font-medium text-gray-900">
                          {activity.target}
                        </span>
                      </p>
                      <div className="mt-2 flex items-center">
                        <div className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                          activity.type === 'message' && "bg-blue-50 text-blue-700",
                          activity.type === 'grade' && "bg-purple-50 text-purple-700",
                          activity.type === 'attendance' && "bg-green-50 text-green-700",
                          activity.type === 'payment' && "bg-amber-50 text-amber-700",
                          activity.type === 'system' && "bg-gray-50 text-gray-700",
                        )}>
                          <IconComponent size={12} className="mr-1" />
                          <span className="capitalize">{activity.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <Link 
          to="/activities" 
          className="text-sm font-medium text-focus-600 hover:text-focus-700 transition-colors"
        >
          View all activity
        </Link>
      </div>
    </div>
  );
};

export default ActivityFeed;
