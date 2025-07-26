import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/axios';

const loginSchema = z.object({
  email: z.string().trim().email('Email é inválido'),
  password: z.string().trim().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const LoginPage = () => {
  const [user, setUser] = useState(null);

  const { setError, ...form } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const init = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!accessToken || !refreshToken) {
          return;
        }

        const response = await api.get('/users/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUser(response.data);
      } catch (error) {
        console.log(error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refeshToken');
      }
    };

    init();
  }, []);

  const { mutate: loginMutation } = useMutation({
    mutationKey: ['login'],
    mutationFn: async (variables) => {
      const response = await api.post('auth/login', {
        email: variables.email,
        password: variables.password,
      });

      return response.data;
    },
    onSuccess: (data) => {
      setUser(data);
      toast.success('Login realizado com sucesso.');
      localStorage.setItem('accessToken', data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.tokens.refreshToken);
    },
    onError: (error) => {
      if (error.status === 404) {
        return setError('email', { message: 'E-mail não encontrado.' });
      }
      if (error.status === 401) {
        return setError('password', { message: 'Senha incorreta.' });
      }

      console.log(error);
    },
  });

  const handleSubmit = (data) => {
    loginMutation(data);
  };

  if (user) {
    return <h1>Olá {user.first_name}</h1>;
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <Card className="w-[500px]">
            <CardHeader className="text-center">
              <CardTitle>Entre na sua conta</CardTitle>
              <CardDescription>Insira seus dados abaixo.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu e-mail" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter>
              <Button className="w-full">Fazer login</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      <div className="flex items-center justify-center">
        <p className="text-center opacity-50">Ainda não possui uma conta?</p>
        <Button variant="link" asChild>
          <Link to={'/signup'} className="text-white">
            Crie agora
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
