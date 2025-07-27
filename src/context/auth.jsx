import { useMutation } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { api } from '@/lib/axios';

export const AuthContext = createContext({
  user: null,
  login: () => {},
  signup: () => {},
  isInitializing: true,
  signOut: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

const LOCAL_STORAGE_ACCESS_TOKEN_KEY = 'accessToken';
const LOCAL_STORAGE_REFRESH_TOKEN_KEY = 'refreshToken';

const setTokens = (token) => {
  localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, token.accessToken);
  localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, token.refreshToken);
};

const removeTokens = () => {
  localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
  localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
};

export const AuthContextProvider = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const accessToken = localStorage.getItem(
          LOCAL_STORAGE_ACCESS_TOKEN_KEY
        );
        const refreshToken = localStorage.getItem(
          LOCAL_STORAGE_REFRESH_TOKEN_KEY
        );

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
        setUser(null);
        removeTokens();
        console.error('Erro ao verificar tokens:', error);
      } finally {
        setIsInitializing(false);
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
      setUser(createdUser);
      setTokens(createdUser.tokens);
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
      setTokens(data.tokens);
      toast.success('Login realizado com sucesso.');
    },
    onError: () => {
      toast.error('Erro ao acessar a conta, tente novamente.');
    },
  });

  const signOut = () => {
    setUser(null);
    removeTokens();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        isInitializing,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
