import { NewTransaction, Transaction, DateRangeValue, User } from './utils';
import { format } from 'date-fns';
import { api } from './axios';

function formatDate(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export async function fetchTransactions(
  range: DateRangeValue,
): Promise<Transaction[]> {
  const { data } = await api.get<Transaction[]>('/expenses', {
    params: {
      startDate: formatDate(range.startDate),
      endDate: formatDate(range.endDate),
    },
  });
  return data;
}

export async function postTransaction(
  transaction: NewTransaction,
): Promise<string> {
  const { data } = await api.post('/expenses', transaction);
  return data.message;
}

export async function deleteTransaction(
  transactionId: number,
): Promise<string> {
  const res = await api.delete(`/expenses/${transactionId}`);
  return res.data.message;
}

export async function updateTransaction(
  transactionId: number,
  updates: Partial<Transaction>,
): Promise<Transaction> {
  const res = await api.patch(`/expenses/${transactionId}`, updates);
  return res.data.message;
}

export async function getUserData(): Promise<User> {
  const res = await api.get('/users/me');
  return res.data;
}
