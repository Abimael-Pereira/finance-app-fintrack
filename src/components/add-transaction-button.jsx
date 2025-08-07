import { zodResolver } from '@hookform/resolvers/zod';
import { DialogClose } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2Icon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { toast } from 'sonner';
import z from 'zod';

import PiggyBank from '@/assets/images/piggy-bank.svg';
import TrendingDown from '@/assets/images/trending-down.svg';
import TrendingUp from '@/assets/images/trending-up.svg';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuthContext } from '@/context/auth';
import { TransactionService } from '@/services/transaction';

import { Button } from './ui/button';
import DatePicker from './ui/date-picker';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';

const formSchema = z.object({
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

const AddTransactionButton = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const { mutateAsync: createTransaction } = useMutation({
    mutationKey: ['create-transaction'],
    mutationFn: (data) => TransactionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance', user?.id] });
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
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
      setDialogOpen(false);
      toast.success('Transação adicionada com sucesso!');
      form.reset();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          {' '}
          <PlusIcon />
          Nova transação
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar transação</DialogTitle>
          <DialogDescription>
            Insira as informações da transação.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome da transação" />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <NumericFormat
                      placeholder="Digite o valor"
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={2}
                      prefix="R$ "
                      fixedDecimalScale={true}
                      allowNegative={false}
                      customInput={Input}
                      {...field}
                      onChange={() => {}}
                      onValueChange={(values) => {
                        field.onChange(values.floatValue);
                      }}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <DatePicker {...field} placeholder="Data da transação" />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-3 gap-4">
                      <Button
                        type="button"
                        variant={
                          field.value === 'EARNING' ? 'secondary' : 'outline'
                        }
                        onClick={() => field.onChange('EARNING')}
                      >
                        <img src={TrendingUp} alt="ganho" />
                        Ganho
                      </Button>

                      <Button
                        type="button"
                        variant={
                          field.value === 'EXPENSE' ? 'secondary' : 'outline'
                        }
                        onClick={() => field.onChange('EXPENSE')}
                      >
                        <img src={TrendingDown} alt="gasto" />
                        Gasto
                      </Button>

                      <Button
                        type="button"
                        variant={
                          field.value === 'INVESTMENT' ? 'secondary' : 'outline'
                        }
                        onClick={() => field.onChange('INVESTMENT')}
                      >
                        <img src={PiggyBank} alt="investimento" />
                        Investimento
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="sm:space-x-4">
              <DialogClose asChild>
                <Button
                  className="w-full"
                  type="reset"
                  variant="secondary"
                  disabled={form.formState.isSubmitting}
                  onClick={() => form.reset()}
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                className="w-full"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2Icon className="animate-spin" />
                )}
                Adicionar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionButton;
