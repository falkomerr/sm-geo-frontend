import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { useAuthStore } from '../model/store';
import { login } from '../api/login';
import { generateFingerprint } from '../../../shared/lib/fingerprint';

export function LoginForm() {
  const navigate = useNavigate();
  const { login: setAuth, setLoading, setError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrorLocal] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLocal('');
    setIsLoading(true);
    setLoading(true);

    try {
      // Generate fingerprint before login
      const fingerprint = await generateFingerprint();

      // Call login API
      const response = await login({
        email,
        password,
        fingerprint,
      });

      // Update auth store
      setAuth(response.user, response.token);

      // Redirect to dashboard
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка входа';
      setErrorLocal(message);
      setError(message);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        <Card className="w-full">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-12 px-4 text-base"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="password" className="text-base">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-12 px-4 text-base"
              />
            </div>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-base text-red-800">{error}</p>
              </div>
            )}
            <Button type="submit" className="w-full h-12 text-base" size="lg" disabled={isLoading}>
              {isLoading ? 'Вход в систему...' : 'Войти'}
            </Button>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
