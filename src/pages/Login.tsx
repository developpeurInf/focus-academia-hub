
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RoleSelector from '@/components/ui/RoleSelector';

const Login = () => {
  const { user, login, updateUserRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'credentials' | 'role'>('credentials');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [error, setError] = useState('');

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      await login(email, password);
      setStep('role');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleRoleSubmit = () => {
    if (selectedRole) {
      updateUserRole(selectedRole);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-focus-50/50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-focus-700 mb-2">FOCUS</h1>
          <p className="text-gray-500">School Management System</p>
        </div>
        
        <Card className="w-full shadow-card border-0 overflow-hidden">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="demo" disabled={isLoading}>Demo Users</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4 pt-2">
              {step === 'credentials' && (
                <>
                  <CardHeader>
                    <CardTitle>Welcome back</CardTitle>
                    <CardDescription>
                      Sign in to your account to continue
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <a
                            href="#"
                            className="text-xs text-focus-600 hover:text-focus-700 transition-colors"
                          >
                            Forgot password?
                          </a>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                      </div>
                      
                      {error && (
                        <div className="text-sm text-red-500 mt-2">{error}</div>
                      )}
                      
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <span className="flex items-center">
                            <span className="h-4 w-4 mr-2 rounded-full border-2 border-t-white/30 border-white animate-spin"></span>
                            Signing in...
                          </span>
                        ) : (
                          'Sign in'
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </>
              )}
              
              {step === 'role' && (
                <>
                  <CardHeader>
                    <CardTitle>Select your role</CardTitle>
                    <CardDescription>
                      Choose how you want to use the system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RoleSelector
                      selectedRole={selectedRole}
                      onRoleSelect={handleRoleSelect}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      disabled={!selectedRole}
                      onClick={handleRoleSubmit}
                    >
                      Continue as {selectedRole && selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                    </Button>
                  </CardFooter>
                </>
              )}
              
              <CardFooter className="border-t pt-6 pb-4">
                <p className="text-sm text-center text-gray-500 w-full">
                  Don't have an account?{' '}
                  <a
                    href="#"
                    className="text-focus-600 hover:text-focus-700 transition-colors font-medium"
                  >
                    Create an account
                  </a>
                </p>
              </CardFooter>
            </TabsContent>
            
            <TabsContent value="demo">
              <CardHeader>
                <CardTitle>Demo Accounts</CardTitle>
                <CardDescription>
                  Use these credentials to test the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Administrator</h3>
                    <p className="text-sm text-gray-500 mb-1">Email: admin@focus.edu</p>
                    <p className="text-sm text-gray-500">Password: password</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => {
                        setEmail('admin@focus.edu');
                        setPassword('password');
                      }}
                    >
                      Use Admin Account
                    </Button>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">Teacher</h3>
                    <p className="text-sm text-gray-500 mb-1">Email: john@focus.edu</p>
                    <p className="text-sm text-gray-500">Password: password</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 w-full"
                      onClick={() => {
                        setEmail('john@focus.edu');
                        setPassword('password');
                      }}
                    >
                      Use Teacher Account
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Student</h3>
                      <p className="text-xs text-gray-500 mb-1">Email: emma@focus.edu</p>
                      <p className="text-xs text-gray-500">Password: password</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 w-full"
                        onClick={() => {
                          setEmail('emma@focus.edu');
                          setPassword('password');
                        }}
                      >
                        Use
                      </Button>
                    </div>
                    
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Parent</h3>
                      <p className="text-xs text-gray-500 mb-1">Email: robert@focus.edu</p>
                      <p className="text-xs text-gray-500">Password: password</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 w-full"
                        onClick={() => {
                          setEmail('robert@focus.edu');
                          setPassword('password');
                        }}
                      >
                        Use
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
        
        <p className="text-xs text-center text-gray-500 mt-8">
          &copy; {new Date().getFullYear()} FOCUS School Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
