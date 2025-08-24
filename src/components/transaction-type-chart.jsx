import { useSearchParams } from 'react-router';
import { Pie, PieChart } from 'recharts';

import { useGetUserBalance } from '@/api/hooks/user';
import PiggyBank from '@/assets/images/piggy-bank.svg';
import TrendingDown from '@/assets/images/trending-down.svg';
import TrendingUp from '@/assets/images/trending-up.svg';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import TransactionTypeIcon from './transaction-type-title';
import { Card } from './ui/card';

const chartConfig = {
  balance: {
    label: 'Saldo',
    color: 'hsl(var(--primary-green))',
  },
  earning: {
    label: 'Ganhos',
    color: 'hsl(var(--primary-green))',
  },
  expenses: {
    label: 'Gastos',
    color: 'hsl(var(--primary-red))',
  },
  investments: {
    label: 'Invest.',
    color: 'hsl(var(--primary-blue))',
  },
};

const TransactionTypeChart = () => {
  const [searchParams] = useSearchParams();

  const from = searchParams.get('from'); //YYYY-MM-DD
  const to = searchParams.get('to'); //YYYY-MM-DD

  const { data } = useGetUserBalance({ from, to });

  console.log(data);

  const thereIsNoData =
    data?.earningsPercentage === 0 &&
    data?.expensesPercentage === 0 &&
    data?.investmentsPercentage === 0;

  const chartData = [
    {
      type: 'earning',
      balance: parseFloat(data?.earnings),
      fill: 'hsl(var(--primary-green))',
    },
    {
      type: 'expenses',
      balance: parseFloat(data?.expenses),
      fill: 'hsl(var(--primary-red))',
    },
    {
      type: 'investments',
      balance: parseFloat(data?.investments),
      fill: 'hsl(var(--primary-blue))',
    },
  ];

  return (
    <Card className="flex h-fit w-full items-center gap-12 px-12 py-6">
      {!thereIsNoData && (
        <div className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="balance"
                nameKey="type"
                innerRadius={60}
              />
            </PieChart>
          </ChartContainer>
        </div>
      )}

      <div className="space-y-3">
        <TransactionTypeIcon
          icon={TrendingUp}
          title="Ganhos"
          percentage={data?.earningsPercentage || 0}
        />
        <TransactionTypeIcon
          icon={TrendingDown}
          title="Gastos"
          percentage={data?.expensesPercentage || 0}
        />
        <TransactionTypeIcon
          icon={PiggyBank}
          title="Investimentos"
          percentage={data?.investmentsPercentage || 0}
        />
      </div>
    </Card>
  );
};

export default TransactionTypeChart;
