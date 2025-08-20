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
      queryClient.invalidateQueries({
        queryKey: getTransactionsQueryKey({ userId: user?.id }),
      });
    },
  });
};

export const getTransactionsQueryKey = ({ userId, from, to }) => {
  if (!from || !to) {
    return ['getTransactions', userId];
  }
  return ['getTransactions', userId, from, to];
};

export const useGetTransactions = ({ from, to }) => {
  const { user } = useAuthContext();
  return useQuery({
    queryKey: getTransactionsQueryKey({ userId: user.id, from, to }),
    queryFn: () => TransactionService.getAll({ from, to }),
    enabled: Boolean(from) && Boolean(to) && Boolean(user.id),
  });
};

export const updateTransactionMutationKey = ['update-transaction'];

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  const { user } = useAuthContext();

  return useMutation({
    mutationKey: updateTransactionMutationKey,
    mutationFn: (data) => TransactionService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUserBalanceQueryKey({ userId: user?.id }),
      });
      queryClient.invalidateQueries({
        queryKey: getTransactionsQueryKey({ userId: user?.id }),
      });
    },
  });
};
