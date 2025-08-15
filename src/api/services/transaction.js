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
  getTransactions: async (date) => {
    try {
      const query = queryString.stringify({ from: date.from, to: date.to });
      const response = await protectedApi.get(`/transactions/me?${query}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
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
      const response = await protectedApi.post('/transactions/me', input);
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },
};
