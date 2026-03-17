import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout/layout';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loggedInUser = await login(email, password);

      if (loggedInUser) {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Sign in failed',
          description: 'Invalid email or password. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-57px)] flex">
        {/* Left — form */}
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-sm animate-fade-up">
            <div className="mb-8">
              <h1 className="font-serif text-3xl font-semibold mb-2">Welcome back</h1>
              <p className="text-muted-foreground text-sm">Sign in to continue to your dashboard.</p>
            </div>

            {/* Demo credentials */}
            <div className="mb-6 p-3 rounded-lg bg-muted/60 border border-border text-sm">
              <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1">Demo account</p>
              <p className="text-foreground/70 text-xs font-mono">user@dobetter.com / user123</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-10 bg-foreground text-background hover:bg-foreground/90 text-sm font-medium" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-foreground font-medium hover:underline underline-offset-4">
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Right — decorative panel */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-primary/10 rounded-full blur-[80px]" />
          <div className="relative text-center px-12">
            <p className="font-serif text-4xl font-semibold text-background leading-tight italic">
              "The secret of getting ahead is getting started."
            </p>
            <p className="mt-4 text-background/50 text-sm">— Mark Twain</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
