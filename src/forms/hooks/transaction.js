import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
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
const getUpdateTransactionFormDefaultValues = (transaction) => ({
  name: transaction.name,
  date: new Date(transaction.date),
  amount: parseFloat(transaction.amount),
  type: transaction.type,
});

export const useUpdateTransactionForm = ({
  transaction,
  onSuccess,
  onError,
}) => {
  const { mutateAsync: updateTransaction } = useUpdateTransaction();

  const form = useForm({
    resolver: zodResolver(updateTransactionFormSchema),
    defaultValues: getUpdateTransactionFormDefaultValues(transaction),
    shouldUnregister: true,
  });

  useEffect(() => {
    form.reset(getUpdateTransactionFormDefaultValues(transaction));
    form.setValue('id', transaction.id);
  }, [transaction, form]);

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
