import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  useCreateTransaction,
  useUpdateTransaction,
} from '@/api/hooks/transaction';

import {
  createTransactionFormSchema,
  updateTransactionFormSchema,
} from '../schemas/transaction';

export const useCreateTransactionForm = ({ onSuccess, onError }) => {
  const { mutateAsync: createTransaction } = useCreateTransaction();

  const form = useForm({
    resolver: zodResolver(createTransactionFormSchema),
    defaultValues: {
      name: '',
      date: new Date(),
      amount: 1,
      type: 'EARNING',
    },
    shouldUnregister: true,
  });

  const onSubmit = async (data) => {
    try {
      await createTransaction(data);
      onSuccess();
    } catch (error) {
      console.error('Error creating transaction:', error);
      onError();
    }
  };

  return { form, onSubmit };
};

export const useUpdateTransactionForm = ({
  transaction,
  onSuccess,
  onError,
}) => {
  const { mutateAsync: updateTransaction } = useUpdateTransaction();

  const form = useForm({
    resolver: zodResolver(updateTransactionFormSchema),
    defaultValues: {
      id: transaction.id,
      name: transaction.name,
      date: transaction.date,
      amount: parseFloat(transaction.amount),
      type: transaction.type,
    },
    shouldUnregister: true,
  });

  const onSubmit = async (data) => {
    try {
      await updateTransaction(data);
      onSuccess();
    } catch (error) {
      console.error('Error creating transaction:', error);
      onError();
    }
  };

  return { form, onSubmit };
};
