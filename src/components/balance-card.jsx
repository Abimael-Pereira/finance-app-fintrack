import TransactionTypeIcon from './transaction-type-title';
import { Card, CardContent, CardHeader } from './ui/card';

const BalanceCard = ({ title, icon, amount = 'R$ 0,00' }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <TransactionTypeIcon icon={icon} title={title} />
      </CardHeader>

      <CardContent className="text-2xl font-bold">
        <h3>{amount}</h3>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
