
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  description,
  icon: Icon,
  variant = 'default'
}) => {
  // Variant styles
  const variants = {
    default: {
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-500',
      chartColor: 'text-gray-500'
    },
    primary: {
      iconBg: 'bg-focus-100',
      iconColor: 'text-focus-600',
      chartColor: 'text-focus-500'
    },
    secondary: {
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      chartColor: 'text-purple-500'
    },
    success: {
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      chartColor: 'text-green-500'
    },
    warning: {
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      chartColor: 'text-amber-500'
    },
    danger: {
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      chartColor: 'text-red-500'
    }
  };

  const currentVariant = variants[variant];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-subtle hover:shadow-card transition-shadow duration-300 p-6">
      <div className="flex items-start">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center mr-4",
          currentVariant.iconBg
        )}>
          <Icon className={cn("h-6 w-6", currentVariant.iconColor)} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            {change && (
              <span className={cn(
                "ml-2 text-sm font-medium",
                change.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
