
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { DashboardStats, ActivityItem } from '@/lib/types';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import { 
  GraduationCap, 
  Users, 
  CalendarCheck, 
  Award, 
  BadgeDollarSign, 
  Calendar
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        if (user) {
          // Fetch stats based on user role
          const dashboardStats = await api.getDashboardStats(user.role);
          setStats(dashboardStats);
          
          // Fetch recent activity
          const recentActivity = await api.getRecentActivity(5);
          setActivities(recentActivity);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get role-specific description
  const getRoleDescription = () => {
    if (!user) return '';
    
    switch (user.role) {
      case 'admin':
        return 'Here\'s an overview of your school management system.';
      case 'teacher':
        return 'Here\'s an overview of your classes and student performance.';
      case 'student':
        return 'Here\'s an overview of your academic performance and schedule.';
      case 'parent':
        return 'Here\'s an overview of your child\'s academic progress.';
      default:
        return 'Welcome to your dashboard.';
    }
  };

  return (
    <div>
      <DashboardHeader
        title={`${getGreeting()}, ${user?.name}`}
        description={getRoleDescription()}
      />
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            icon={GraduationCap}
            variant="primary"
            description="Active enrollment"
          />
          <StatCard
            title="Total Teachers"
            value={stats?.totalTeachers || 0}
            icon={Users}
            variant="secondary"
            description="Faculty members"
          />
          <StatCard
            title="Average Attendance"
            value={`${stats?.averageAttendance || 0}%`}
            icon={CalendarCheck}
            variant="success"
            change={{ value: 2.1, isPositive: true }}
            description="Last 30 days"
          />
          <StatCard
            title="Average Grade"
            value={`${stats?.averageGrade || 0}%`}
            icon={Award}
            variant="warning"
            change={{ value: 0.8, isPositive: true }}
            description="All subjects"
          />
          <StatCard
            title="Pending Payments"
            value={stats?.pendingPayments || 0}
            icon={BadgeDollarSign}
            variant="danger"
            description="Requires attention"
          />
          <StatCard
            title="Upcoming Events"
            value={stats?.upcomingEvents || 0}
            icon={Calendar}
            description="Next 30 days"
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isLoading ? (
            <Skeleton className="h-96 w-full rounded-xl" />
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-subtle overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold">Performance Overview</h3>
              </div>
              <div className="p-6 h-80 flex items-center justify-center">
                <p className="text-gray-500">Charts will be implemented in the next iteration</p>
              </div>
            </div>
          )}
        </div>
        
        <div>
          {isLoading ? (
            <Skeleton className="h-96 w-full rounded-xl" />
          ) : (
            <ActivityFeed activities={activities} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
