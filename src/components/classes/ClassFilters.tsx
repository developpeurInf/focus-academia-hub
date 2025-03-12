
import React from 'react';
import { X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export interface ClassFilters {
  subjects: string[];
  weekdays: string[];
}

interface ClassFiltersProps {
  trigger: React.ReactNode;
  onFiltersChange: (filters: ClassFilters) => void;
  availableSubjects: string[];
}

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const ClassFilters: React.FC<ClassFiltersProps> = ({
  trigger,
  onFiltersChange,
  availableSubjects,
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>([]);
  const [selectedDays, setSelectedDays] = React.useState<string[]>([]);

  const activeFilterCount = selectedSubjects.length + selectedDays.length;

  const handleSubjectChange = (subject: string, checked: boolean) => {
    setSelectedSubjects(prev => {
      if (checked) {
        return [...prev, subject];
      } else {
        return prev.filter(s => s !== subject);
      }
    });
  };

  const handleDayChange = (day: string, checked: boolean) => {
    setSelectedDays(prev => {
      if (checked) {
        return [...prev, day];
      } else {
        return prev.filter(d => d !== day);
      }
    });
  };

  const applyFilters = () => {
    onFiltersChange({
      subjects: selectedSubjects,
      weekdays: selectedDays,
    });
    setOpen(false);
  };

  const clearFilters = () => {
    setSelectedSubjects([]);
    setSelectedDays([]);
    onFiltersChange({
      subjects: [],
      weekdays: [],
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          {trigger}
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
            >
              {activeFilterCount}
            </Badge>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Filters</h3>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs text-muted-foreground"
                onClick={clearFilters}
              >
                Clear all
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Subjects</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableSubjects.map(subject => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subject-${subject}`}
                    checked={selectedSubjects.includes(subject)}
                    onCheckedChange={(checked) => 
                      handleSubjectChange(subject, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`subject-${subject}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {subject}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-sm">Days</Label>
            <div className="grid grid-cols-2 gap-2">
              {WEEKDAYS.map(day => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day}`}
                    checked={selectedDays.includes(day)}
                    onCheckedChange={(checked) => 
                      handleDayChange(day, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`day-${day}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {day}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ClassFilters;
