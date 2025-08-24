import { Navigate } from 'react-router';

import AddTransactionButton from '@/components/add-transaction-button';
import Balance from '@/components/balance';
import DateSelection from '@/components/date-selection';
import Header from '@/components/header';
import TransactionsTable from '@/components/transaction-table';
import TransactionTypeChart from '@/components/transaction-type-chart';
import { useAuthContext } from '@/context/auth';

const HomePage = () => {
  const { user, isInitializing } = useAuthContext();

  if (isInitializing) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header />
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="flex items-center gap-4">
            <DateSelection />
            <AddTransactionButton />
          </div>
        </div>

        <div className="grid grid-cols-[2fr,1fr] gap-6">
          <Balance />
          <TransactionTypeChart />
        </div>

        <TransactionsTable />
      </div>
    </>
  );
};

export default HomePage;
