import { protectedApi } from '@/lib/axios';

export const TransactionService = {
  getTransactions: async (date) => {
    try {
      const response = await protectedApi.get(`/transactions/me${date}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },
};
