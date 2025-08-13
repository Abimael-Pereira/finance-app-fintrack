import { useMutation, useQueryClient } from '@tanstack/react-query';

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
