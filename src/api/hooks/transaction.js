import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuthContext } from '@/context/auth';

import { TransactionService } from '../services/transaction';
import { getUserBalanceQueryKey } from './user';

export const createTransactionMutationKey = ['create-transaction'];

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  const { user } = useAuthContext();

  return useMutation({
    mutationKey: createTransactionMutationKey,
    mutationFn: (data) => TransactionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUserBalanceQueryKey({ userId: user?.id }),
      });
    },
  });
};

export const getTransactionsQueryKey = ({ userId, from, to }) => {
  if (!from || !to) return ['transactions', userId];

  return ['transactions', userId, from, to];
};

export const useGetTransactions = ({ from, to }) => {
  const { user } = useAuthContext();
  return useQuery({
    queryKey: getTransactionsQueryKey({
      userId: user?.id,
      from: from,
      to: to,
    }),
    queryFn: () => TransactionService.getTransactions({ from, to }),
  });
};
