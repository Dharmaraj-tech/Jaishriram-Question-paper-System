import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { GraduationCap, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Toaster } from '../components/ui/sonner';
import { toast } from 'sonner';
import { loginAdmin, setAuthToken } from '../utils/api';

type LocationState = {
  from?: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const redirectTo = state?.from || '/admin';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await loginAdmin(username, password);
      setAuthToken(response.token);
      toast.success('Login successful');
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe,_#f8fafc_45%,_#f1f5f9)]">
      <Toaster />

      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="hidden rounded-[2rem] border border-white/60 bg-slate-900 p-10 text-white shadow-2xl lg:block">
            <div className="flex h-full flex-col justify-between">
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950">
                    <GraduationCap className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">QPaper Admin</p>
                    <h1 className="text-3xl font-semibold">Secure paper management</h1>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="max-w-xl text-5xl font-semibold leading-tight">
                    Sign in to manage uploads, links, and question paper access.
                  </h2>
                  <p className="max-w-lg text-lg text-slate-300">
                    This admin area is now connected to the backend, so papers are shared across users instead of staying in one browser.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <ShieldCheck className="mb-3 h-6 w-6 text-cyan-300" />
                  <p className="font-medium">Protected admin actions</p>
                  <p className="mt-2 text-sm text-slate-300">Only authenticated users can create or delete papers.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <LockKeyhole className="mb-3 h-6 w-6 text-cyan-300" />
                  <p className="font-medium">Admin credentials</p>
                  <p className="mt-2 text-sm text-slate-300">Enter the username or email and password configured on the server.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="flex items-center">
            <Card className="w-full border-slate-200/80 bg-white/90 shadow-xl backdrop-blur">
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3 lg:hidden">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-cyan-300">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>Admin Login</CardTitle>
                    <CardDescription>Enter your admin username and password.</CardDescription>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <CardTitle className="text-3xl">Admin Login</CardTitle>
                  <CardDescription className="text-base">
                    Enter your admin username or email and password to continue.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username or Email</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      autoComplete="username"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                      required
                    />
                  </div>

                  <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </Button>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <Link to="/" className="hover:text-foreground">
                      Back to home
                    </Link>
                    <Link to="/browse" className="hover:text-foreground">
                      Browse papers
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
