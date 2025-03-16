
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export type StudentFilters = {
  grades: string[];
  status: string[];
}

type StudentFiltersProps = {
  trigger: React.ReactNode;
  onFiltersChange: (filters: StudentFilters) => void;
  availableGrades: string[];
}

const StudentFilters: React.FC<StudentFiltersProps> = ({
  trigger,
  onFiltersChange,
  availableGrades,
}) => {
  const [filters, setFilters] = useState<StudentFilters>({
    grades: [],
    status: [],
  });

  const handleGradeChange = (grade: string, checked: boolean) => {
    const newGrades = checked
      ? [...filters.grades, grade]
      : filters.grades.filter(g => g !== grade);
    
    const newFilters = { ...filters, grades: newGrades };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatus = checked
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status);
    
    const newFilters = { ...filters, status: newStatus };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters = { grades: [], status: [] };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">Filters</h4>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-auto p-0 text-xs text-gray-500"
            onClick={clearFilters}
          >
            Clear all
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h5 className="mb-2 text-sm font-medium">Grade</h5>
            <div className="space-y-2">
              {availableGrades.map(grade => (
                <div key={grade} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`grade-${grade}`}
                    checked={filters.grades.includes(grade)}
                    onCheckedChange={(checked) => 
                      handleGradeChange(grade, checked === true)
                    }
                  />
                  <Label htmlFor={`grade-${grade}`} className="text-sm">
                    {grade}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h5 className="mb-2 text-sm font-medium">Status</h5>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="status-active"
                  checked={filters.status.includes('active')}
                  onCheckedChange={(checked) => 
                    handleStatusChange('active', checked === true)
                  }
                />
                <Label htmlFor="status-active" className="text-sm">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="status-inactive"
                  checked={filters.status.includes('inactive')}
                  onCheckedChange={(checked) => 
                    handleStatusChange('inactive', checked === true)
                  }
                />
                <Label htmlFor="status-inactive" className="text-sm">Inactive</Label>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default StudentFilters;
