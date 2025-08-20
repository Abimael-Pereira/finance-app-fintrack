import z from 'zod';

export const createTransactionFormSchema = z.object({
  name: z
    .string({ message: 'Nome é obrigatório.' })
    .trim()
    .min(1, 'Nome é obrigatório.'),
  date: z.date({ message: 'Data é obrigatória.' }),
  amount: z
    .number({ message: 'Valor deve ser maior que zero.' })
    .min(0.01, 'Valor deve ser maior que zero.'),
  type: z.enum(['EARNING', 'EXPENSE', 'INVESTMENT'], {
    errorMap: () => ({ message: 'Tipo de transação é obrigatório' }),
  }),
});

export const updateTransactionFormSchema = createTransactionFormSchema.extend({
  id: z.string().uuid({ message: 'ID é obrigatório.' }),
});
