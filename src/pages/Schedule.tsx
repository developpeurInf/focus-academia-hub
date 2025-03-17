
import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Clock, BookOpen, MapPin, Users, Search, Filter } from 'lucide-react';
import { api } from '@/lib/api';
import { Class } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const Schedule = () => {
  const { user, accessToken } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [date, setDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  // Fetch classes for the schedule
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoading(true);
        const data = await api.getClasses(accessToken);
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast.error('Failed to load class schedule. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, [accessToken]);

  // Filter classes based on search and subject
  const filteredClasses = classes.filter(classItem => {
    // Apply search filter
    const matchesSearch = searchQuery === '' || 
      classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.teacherName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply subject filter
    const matchesSubject = subjectFilter === 'all' || classItem.subject === subjectFilter;
    
    return matchesSearch && matchesSubject;
  });

  // Get unique subjects for filtering
  const subjects = ['all', ...new Set(classes.map(c => c.subject))];

  // Group schedule by day
  const scheduleByDay = filteredClasses.reduce<Record<string, any[]>>((acc, classItem) => {
    classItem.schedule.forEach(schedule => {
      if (!acc[schedule.day]) {
        acc[schedule.day] = [];
      }
      
      acc[schedule.day].push({
        classId: classItem.id,
        className: classItem.name,
        subject: classItem.subject,
        teacherName: classItem.teacherName,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        room: schedule.room
      });
    });
    
    return acc;
  }, {});

  // Sort days of the week in correct order
  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const sortedDays = Object.keys(scheduleByDay).sort(
    (a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b)
  );

  // Sort each day's schedule by start time
  Object.keys(scheduleByDay).forEach(day => {
    scheduleByDay[day].sort((a, b) => {
      const timeA = a.startTime.split(':').map(Number);
      const timeB = b.startTime.split(':').map(Number);
      
      if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
      return timeA[1] - timeB[1];
    });
  });

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Class Schedule"
        description="View and manage your class schedule"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-auto flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search classes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map(subject => (
                <SelectItem key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Tabs value={view} onValueChange={(v) => setView(v as 'day' | 'week' | 'month')}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Calendar className="mr-2 h-4 w-4" />
                {format(date, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </DashboardHeader>

      {view === 'week' && (
        <div className="space-y-6">
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-24" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[1, 2, 3].map(j => (
                        <Skeleton key={j} className="h-16 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : sortedDays.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-40">
                <p className="text-lg text-gray-500">No schedule found</p>
                <p className="text-sm text-gray-400 mt-1">Try a different filter or search term</p>
              </CardContent>
            </Card>
          ) : (
            sortedDays.map(day => (
              <Card key={day} className="overflow-hidden">
                <CardHeader className="pb-2 bg-muted/50">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    {day}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {scheduleByDay[day].map((session, idx) => (
                      <div key={idx} className="p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <div className="space-y-1">
                            <div className="font-medium text-base">{session.className}</div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <BookOpen className="mr-1 h-4 w-4" />
                                {session.subject}
                              </span>
                              <span className="flex items-center">
                                <Users className="mr-1 h-4 w-4" />
                                {session.teacherName}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 sm:mt-0 flex items-center space-x-4">
                            <Badge className="flex items-center bg-primary/10 text-primary hover:bg-primary/20">
                              <Clock className="mr-1 h-3.5 w-3.5" />
                              {session.startTime} - {session.endTime}
                            </Badge>
                            <Badge variant="outline" className="flex items-center">
                              <MapPin className="mr-1 h-3.5 w-3.5" />
                              Room {session.room}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {view === 'day' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{format(date, 'EEEE, MMMM d, yyyy')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div>
                  <div className="text-center py-10 text-gray-500">
                    Day view is coming soon. Please use Week or Month view.
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {view === 'month' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{format(date, 'MMMM yyyy')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : (
                <div>
                  <div className="text-center py-10 text-gray-500">
                    Month view is coming soon. Please use Week or Day view.
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Schedule;
