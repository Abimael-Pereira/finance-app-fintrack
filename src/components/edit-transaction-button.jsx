import { Loader2Icon } from 'lucide-react';
import { ExternalLinkIcon } from 'lucide-react';
import { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { toast } from 'sonner';

import PiggyBank from '@/assets/images/piggy-bank.svg';
import TrendingDown from '@/assets/images/trending-down.svg';
import TrendingUp from '@/assets/images/trending-up.svg';
import { useUpdateTransactionForm } from '@/forms/hooks/transaction';

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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

const EditTransactionButton = ({ transaction }) => {
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const { form, onSubmit } = useUpdateTransactionForm({
    transaction,
    onSuccess: () => {
      setSheetIsOpen(false);
      toast.success('Transação atualizada com sucesso!');
    },
    onError: () => {
      setSheetIsOpen(false);
      toast.error('Erro ao atualizar transação');
    },
  });

  return (
    <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
      <SheetTrigger>
        <Button variant="ghost" size="icon">
          <ExternalLinkIcon className="text-muted-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[450px]">
        <SheetTitle>Editar Transação</SheetTitle>
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

            <SheetFooter className="sm:space-x-4">
              <SheetClose asChild>
                <Button
                  className="w-full"
                  type="reset"
                  variant="secondary"
                  disabled={form.formState.isSubmitting}
                  onClick={() => form.reset()}
                >
                  Cancelar
                </Button>
              </SheetClose>
              <Button
                className="w-full"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2Icon className="animate-spin" />
                )}
                Salvar
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default EditTransactionButton;
