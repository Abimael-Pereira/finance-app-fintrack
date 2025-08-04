import { Card, CardContent, CardHeader } from './ui/card';

const BalanceCard = ({ title, icon, amount = 'R$ 0,00' }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <img
            src={icon}
            alt="Wallet"
            className="rounded-md bg-white bg-opacity-5 p-2"
          />
          <span className="text-[#71717A] opacity-80">{title}</span>
        </div>
      </CardHeader>

      <CardContent className="text-2xl font-bold">
        <h3>{amount}</h3>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
