import queryString from 'query-string';

import { protectedApi } from '@/lib/axios';

export const TransactionService = {
  /**
   * Cria uma transação para o usuário autenticado.
   * @param {Object} input
   * @param {string} input.from - Data de início do filtro (YYYY-MM-DD).
   * @param {string} input.to - Data de fim do filtro (YYYY-MM-DD).
   * @returns {Object} - Retorna um objeto com os dados da transação.
   */
  getAll: async (input) => {
    const query = queryString.stringify({ from: input.from, to: input.to });
    const response = await protectedApi.get(`/transactions/me?${query}`);
    return response.data;
  },
  /**
   * Cria uma transação para o usuário autenticado.
   * @param {Object} input
   * @param {string} input.name - Nome da transação.
   * @param {string} input.date - Data da transação (YYYY-MM-DD).
   * @param {number} input.amount - Valor da transação.
   * @param {string} input.type - Tipo da transação (ex: 'EARNING', 'EXPENSE', 'INVESTMENT').
   * @returns {Object} - Retorna um objeto com os dados da transação.
   */
  create: async (input) => {
    try {
      const response = await protectedApi.post('/transactions/me', {
        name: input.name,
        date: input.date,
        amount: input.amount,
        type: input.type,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  /**
   * Atualiza uma transação do usuário autenticado.
   * @param {Object} input - Dados da transação
   * @param {string} input.id - ID da transação.
   * @param {string} input.name - Nome da transação.
   * @param {string} input.date - Data da transação (YYYY-MM-DD).
   * @param {number} input.amount - Valor da transação.
   * @param {string} input.type - Tipo da transação (ex: 'EARNING', 'EXPENSE', 'INVESTMENT').
   * @returns {Object} - Retorna um objeto com os dados da transação.
   */
  update: async (input) => {
    try {
      const response = await protectedApi.patch(
        `/transactions/me/${input.id}`,
        {
          name: input.name,
          date: input.date,
          amount: input.amount,
          type: input.type,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },
};
