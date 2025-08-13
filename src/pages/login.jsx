import { Link, Navigate } from 'react-router';

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
import { useAuthContext } from '@/context/auth';
import { useLoginForm } from '@/forms/hooks/user';

const LoginPage = () => {
  const { user, login, isInitializing } = useAuthContext();

  const { setError, ...form } = useLoginForm();

  const handleSubmit = async (data) => {
    await login(data, {
      onError: (error) => {
        if (error.status === 404) {
          return setError('email', { message: 'E-mail não encontrado.' });
        }
        if (error.status === 401) {
          return setError('password', { message: 'Senha incorreta.' });
        }
        setError('root', {
          message: 'Erro ao acessar a conta, tente novamente.',
        });
      },
    });
  };

  if (isInitializing) {
    return null;
  }

  if (user) {
    return <Navigate to={'/'} />;
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
              <Button className="w-full" disabled={form.formState.isSubmitting}>
                Fazer login
              </Button>
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
