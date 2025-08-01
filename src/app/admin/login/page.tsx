"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FIXED_PASSWORD = 'admin123'; // Senha fixa para acesso

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === FIXED_PASSWORD) {
      sessionStorage.setItem('isAdminLoggedIn', 'true');
      toast({
        title: "Login bem-sucedido!",
        description: "Redirecionando para o painel de controle.",
      });
      router.push('/admin');
    } else {
      setError('Senha incorreta. Tente novamente.');
       toast({
        title: "Erro de Login",
        description: "Senha incorreta. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleLogin}>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Lock className="h-6 w-6" />
                Área de Administração
            </CardTitle>
            <CardDescription>
              Por favor, insira a senha para acessar o painel.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
