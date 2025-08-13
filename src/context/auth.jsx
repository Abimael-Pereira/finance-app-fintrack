import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useLogin, useSignup } from '@/api/hooks/user';
import { UserService } from '@/api/services/user';
import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
} from '@/constants/local-storege';

export const AuthContext = createContext({
  user: null,
  login: () => {},
  signup: () => {},
  isInitializing: true,
  signOut: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

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

        const response = await UserService.me();
        setUser(response);
      } catch (error) {
        setUser(null);
        console.error('Erro ao verificar tokens:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, []);

  const signupMutation = useSignup();

  const loginMutation = useLogin();

  const signup = async (data) => {
    try {
      const createdUser = await signupMutation.mutateAsync(data);
      setUser(createdUser);
      setTokens(createdUser.tokens);
      toast.success('Conta criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar conta');
      console.error('Erro ao criar conta:', error);
    }
  };

  const login = async (data) => {
    try {
      const loggedUser = await loginMutation.mutateAsync(data);
      setUser(loggedUser);
      setTokens(loggedUser.tokens);
      toast.success('Login realizado com sucesso.');
    } catch (error) {
      toast.error('Erro ao acessar a conta, tente novamente.');
      console.error('Erro ao acessar a conta:', error);
    }
  };

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
