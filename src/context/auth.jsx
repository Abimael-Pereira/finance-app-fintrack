import { useMutation } from '@tanstack/react-query';
import { createContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { api } from '@/lib/axios';

export const AuthContext = createContext({
  user: null,
  login: () => {},
  signup: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!accessToken || !refreshToken) {
          return;
        }

        const response = await api.get('/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Erro ao verificar tokens:', error);
        localStorage.removeItem('accesToken');
        localStorage.removeItem('refreshToken');
      }
    };

    init();
  }, []);

  const { mutate: signup } = useMutation({
    mutationKey: ['signup'],
    mutationFn: async (variables) => {
      const response = await api.post('/users', {
        first_name: variables.firstName,
        last_name: variables.lastName,
        email: variables.email,
        password: variables.password,
      });

      return response.data;
    },
    onSuccess: (createdUser) => {
      const accessToken = createdUser.tokens.accessToken;
      const refreshToken = createdUser.tokens.refreshToken;
      setUser(createdUser);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      toast.success('Conta criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar conta');
    },
  });

  const { mutate: login } = useMutation({
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
    onError: () => {
      toast.error('Erro ao acessar a conta, tente novamente.');
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
