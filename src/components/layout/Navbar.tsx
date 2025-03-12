
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, X, MessageSquare, Search, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center flex-1">
          <button 
            onClick={onToggleSidebar}
            className="p-2 mr-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <Link to="/dashboard" className="flex items-center mr-8">
            <span className="text-xl font-semibold text-focus-700">FOCUS</span>
          </Link>
          
          <div className={cn(
            "hidden md:flex items-center max-w-md flex-1 relative transition-all duration-300 ease-in-out",
            searchFocused ? "max-w-xl" : "max-w-md"
          )}>
            <Search size={18} className="absolute left-3 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 h-10 bg-gray-50 border-none focus:ring-1 focus:ring-focus-300 rounded-xl w-full"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell size={20} className="text-gray-600" />
          </Button>
          
          <Button variant="ghost" size="icon" className="rounded-full">
            <MessageSquare size={20} className="text-gray-600" />
          </Button>
          
          <Separator orientation="vertical" className="h-6 mx-1" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border border-gray-100">
                  <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                  <AvatarFallback className="bg-focus-100 text-focus-700">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-1 p-2">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer flex items-center">
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer flex items-center">
                  <Settings size={16} className="mr-2" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-500 focus:text-red-500 cursor-pointer"
                onClick={logout}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
