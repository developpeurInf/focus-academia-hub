
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'sonner';

import './App.css';

// Layouts
import DashboardLayout from '@/components/layout/DashboardLayout';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Students from '@/pages/Students';
import Teachers from '@/pages/Teachers';
import Classes from '@/pages/Classes';
import NotFound from '@/pages/NotFound';

// Create a client for React Query
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: '/dashboard/students',
        element: <Students />,
      },
      {
        path: '/dashboard/teachers',
        element: <Teachers />,
      },
      {
        path: '/dashboard/classes',
        element: <Classes />,
      },
    ],
  },
  {
    path: '/students',
    element: <Navigate to="/dashboard/students" replace />,
  },
  {
    path: '/teachers',
    element: <Navigate to="/dashboard/teachers" replace />,
  },
  {
    path: '/classes',
    element: <Navigate to="/dashboard/classes" replace />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="focus-theme">
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
