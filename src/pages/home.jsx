import { Navigate } from 'react-router';

import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/auth';

const HomePage = () => {
  const { user, isInitializing, signOut } = useAuthContext();

  if (isInitializing) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header />
      <h1>Olá, {user.first_name}</h1>
      <Button onClick={signOut}>Sair</Button>
    </>
  );
};

export default HomePage;
