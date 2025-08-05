import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';

import PiggyBank from '@/assets/images/piggy-bank.svg';
import TrendingDown from '@/assets/images/trending-down.svg';
import TrendingUp from '@/assets/images/trending-up.svg';
import Wallet from '@/assets/images/wallet.svg';
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
        icon={Wallet}
        title="Saldo"
      />
      <BalanceCard
        amount={formatCurrency(data?.earnings) || 'R$ 0,00'}
        icon={TrendingUp}
        title="Ganhos"
      />
      <BalanceCard
        amount={formatCurrency(data?.expenses) || 'R$ 0,00'}
        icon={TrendingDown}
        title="Gastos"
      />
      <BalanceCard
        amount={formatCurrency(data?.investments) || 'R$ 0,00'}
        icon={PiggyBank}
        title="Investimentos"
      />
    </div>
  );
};

export default Balance;
