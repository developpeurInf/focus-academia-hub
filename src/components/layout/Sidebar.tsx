
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  CalendarDays, 
  BookOpen, 
  DollarSign, 
  Bell, 
  Settings,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  isOpen: boolean;
}

interface NavigationLink {
  label: string;
  icon: React.ElementType;
  href: string;
  roles: Array<"admin" | "teacher" | "student" | "parent">;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const navigationLinks: NavigationLink[] = [
    { 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      href: '/dashboard', 
      roles: ['admin', 'teacher', 'student', 'parent'] 
    },
    { 
      label: 'Students', 
      icon: GraduationCap, 
      href: '/students', 
      roles: ['admin', 'teacher'],
      badge: { text: 'New', variant: 'default' } 
    },
    { 
      label: 'Teachers', 
      icon: Users, 
      href: '/teachers', 
      roles: ['admin'] 
    },
    { 
      label: 'Classes', 
      icon: BookOpen, 
      href: '/classes', 
      roles: ['admin', 'teacher', 'student', 'parent'] 
    },
    { 
      label: 'Schedule', 
      icon: CalendarDays, 
      href: '/schedule', 
      roles: ['admin', 'teacher', 'student', 'parent'] 
    },
    { 
      label: 'Attendance', 
      icon: ClipboardList, 
      href: '/attendance', 
      roles: ['admin', 'teacher', 'student', 'parent'] 
    },
    { 
      label: 'Finances', 
      icon: DollarSign, 
      href: '/finances', 
      roles: ['admin', 'parent'] 
    },
    { 
      label: 'Notifications', 
      icon: Bell, 
      href: '/notifications', 
      roles: ['admin', 'teacher', 'student', 'parent'],
      badge: { text: '5', variant: 'destructive' } 
    },
  ];
  
  const filteredLinks = navigationLinks.filter(
    link => user?.role && link.roles.includes(user.role)
  );

  return (
    <aside className={cn(
      "fixed left-0 top-16 bottom-0 z-20 w-64 bg-white border-r border-gray-100 transition-transform duration-300 ease-in-out transform",
      isOpen ? "translate-x-0" : "-translate-x-full",
      "md:translate-x-0"
    )}>
      <div className="flex flex-col h-full py-6 px-4 overflow-y-auto">
        <nav className="flex-1 space-y-1">
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-4">
              Main
            </p>
            <ul className="space-y-1">
              {filteredLinks.slice(0, 6).map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  isActive={location.pathname === item.href}
                />
              ))}
            </ul>
          </div>
          
          {filteredLinks.length > 6 && (
            <>
              <Separator className="my-4" />
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-4">
                  Management
                </p>
                <ul className="space-y-1">
                  {filteredLinks.slice(6).map((item) => (
                    <NavItem
                      key={item.href}
                      item={item}
                      isActive={location.pathname === item.href}
                    />
                  ))}
                </ul>
              </div>
            </>
          )}
        </nav>
        
        <div className="mt-auto">
          <Separator className="my-4" />
          <ul>
            <NavItem
              item={{ 
                label: 'Settings', 
                icon: Settings, 
                href: '/settings', 
                roles: ['admin', 'teacher', 'student', 'parent'] 
              }}
              isActive={location.pathname === '/settings'}
            />
          </ul>
          
          <div className="mt-6 px-4">
            <div className="rounded-lg bg-focus-50 p-4 border border-focus-100">
              <h5 className="text-sm font-medium text-focus-800 mb-2">Need Help?</h5>
              <p className="text-xs text-focus-600 mb-3">
                Contact support for assistance with FOCUS.
              </p>
              <Link 
                to="/support" 
                className="text-xs font-medium text-focus-700 hover:text-focus-800 transition-colors"
              >
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

interface NavItemProps {
  item: NavigationLink;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ item, isActive }) => {
  const Icon = item.icon;
  
  return (
    <li>
      <Link
        to={item.href}
        className={cn(
          "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
          isActive 
            ? "bg-focus-50 text-focus-700" 
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        )}
      >
        <Icon size={18} className={cn("mr-3", isActive ? "text-focus-600" : "text-gray-400")} />
        <span>{item.label}</span>
        {item.badge && (
          <Badge 
            variant={item.badge.variant} 
            className="ml-auto"
          >
            {item.badge.text}
          </Badge>
        )}
      </Link>
    </li>
  );
};

export default Sidebar;
