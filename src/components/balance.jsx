import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';

import piggyBank from '@/assets/images/piggy-bank.svg';
import trendingDown from '@/assets/images/trending-down.svg';
import trendingUp from '@/assets/images/trending-up.svg';
import wallet from '@/assets/images/wallet.svg';
import { useAuthContext } from '@/context/auth';
import { UserService } from '@/services/user';

import BalanceCard from './balance-card';

const Balance = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuthContext();

  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Number(value));

  const { data } = useQuery({
    queryKey: [
      'balance',
      user?.id,
      searchParams.get('from'),
      searchParams.get('to'),
    ],
    queryFn: async () => {
      const from = searchParams.get('from');
      const to = searchParams.get('to');
      return await UserService.getBalance({
        from,
        to,
      });
    },
  });

  return (
    <div className="grid w-full grid-cols-2 gap-6">
      <BalanceCard
        amount={formatCurrency(data?.balance) || 'R$ 0,00'}
        icon={wallet}
        title="Saldo"
      />
      <BalanceCard
        amount={formatCurrency(data?.earnings) || 'R$ 0,00'}
        icon={trendingUp}
        title="Ganhos"
      />
      <BalanceCard
        amount={formatCurrency(data?.expenses) || 'R$ 0,00'}
        icon={trendingDown}
        title="Gastos"
      />
      <BalanceCard
        amount={formatCurrency(data?.investments) || 'R$ 0,00'}
        icon={piggyBank}
        title="Investimentos"
      />
    </div>
  );
};

export default Balance;
