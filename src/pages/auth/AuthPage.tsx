import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ticket, Mail, Lock, User, Phone, MapPin, Calendar, Users, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  mobile_number: z.string().min(10, 'Mobile number must be at least 10 digits').max(15),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
  city: z.string().min(2, 'City is required'),
  gender: z.string().optional(),
  date_of_birth: z.string().optional(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

const AuthPage: React.FC = () => {
  const { user, role, isLoading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupData, setSignupData] = useState({
    full_name: '',
    email: '',
    mobile_number: '',
    password: '',
    confirm_password: '',
    city: '',
    gender: '',
    date_of_birth: '',
  });

  // Redirect authenticated users based on role
  useEffect(() => {
    if (!isLoading && user && role) {
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, role, isLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      loginSchema.parse({ email: loginEmail, password: loginPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    setIsSubmitting(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      signupSchema.parse(signupData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    setIsSubmitting(true);
    const { error } = await signUp({
      email: signupData.email,
      password: signupData.password,
      full_name: signupData.full_name,
      mobile_number: signupData.mobile_number,
      city: signupData.city,
      gender: signupData.gender || undefined,
      date_of_birth: signupData.date_of_birth || undefined,
    });
    setIsSubmitting(false);

    if (error) {
      if (error.message.includes('already registered')) {
        toast({
          title: "Account exists",
          description: "This email is already registered. Please log in instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      setActiveTab('login');
      setLoginEmail(signupData.email);
      toast({
        title: "Registration successful!",
        description: "You can now log in with your credentials.",
      });
    }
  };

  const handleSignupChange = (field: string, value: string) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      <Card className="w-full max-w-md relative z-10 border-border/50 bg-card/80 backdrop-blur-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto p-3 rounded-xl bg-primary/10 w-fit">
            <Ticket className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">
              Seat<span className="text-primary">Book</span>
            </CardTitle>
            <CardDescription className="mt-2">
              Book your seats for amazing shows
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <div className="p-3 rounded-lg bg-secondary/30 border border-border/50 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    <strong>Default Admin:</strong> admin@seatbook.com / admin123
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    disabled={isCreatingAdmin}
                    onClick={async () => {
                      setIsCreatingAdmin(true);
                      try {
                        const { data, error } = await supabase.functions.invoke('seed-admin');
                        if (error) {
                          toast({
                            title: "Error",
                            description: error.message,
                            variant: "destructive",
                          });
                        } else {
                          toast({
                            title: "Success",
                            description: data.message || "Admin user ready!",
                          });
                          setLoginEmail('admin@seatbook.com');
                          setLoginPassword('admin123');
                        }
                      } catch (err) {
                        toast({
                          title: "Error",
                          description: "Failed to create admin user",
                          variant: "destructive",
                        });
                      }
                      setIsCreatingAdmin(false);
                    }}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {isCreatingAdmin ? 'Creating...' : 'Initialize Admin User'}
                  </Button>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="full_name"
                      placeholder="Enter your full name"
                      value={signupData.full_name}
                      onChange={(e) => handleSignupChange('full_name', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.full_name && <p className="text-sm text-destructive">{errors.full_name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupData.email}
                      onChange={(e) => handleSignupChange('email', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile_number">Mobile Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="mobile_number"
                      placeholder="Enter your mobile number"
                      value={signupData.mobile_number}
                      onChange={(e) => handleSignupChange('mobile_number', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.mobile_number && <p className="text-sm text-destructive">{errors.mobile_number}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Password"
                        value={signupData.password}
                        onChange={(e) => handleSignupChange('password', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirm_password"
                        type="password"
                        placeholder="Confirm"
                        value={signupData.confirm_password}
                        onChange={(e) => handleSignupChange('confirm_password', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.confirm_password && <p className="text-sm text-destructive">{errors.confirm_password}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="city"
                      placeholder="Enter your city"
                      value={signupData.city}
                      onChange={(e) => handleSignupChange('city', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={signupData.gender} onValueChange={(v) => handleSignupChange('gender', v)}>
                      <SelectTrigger>
                        <Users className="absolute left-3 w-4 h-4 text-muted-foreground" />
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={signupData.date_of_birth}
                        onChange={(e) => handleSignupChange('date_of_birth', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
