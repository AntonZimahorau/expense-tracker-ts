export const CURRENCIES = ['USD', 'GBP', 'PLN'];
export type CurrencyCode = (typeof CURRENCIES)[number];

export interface Transaction {
  id: number;
  name: string;
  category: string;
  currency: CurrencyCode;
  date: string;
  amount: number;
  user_id: number;
}

export interface DateRangeValue {
  startDate: Date;
  endDate: Date;
}

export type NewTransaction = Omit<Transaction, 'id'>;

export const CURRENCY_SIGNS: Record<CurrencyCode, string> = {
  USD: '$',
  GBP: '£',
  PLN: 'zł',
};

export const CATEGORIES: string[] = [
  'mobile',
  'credit',
  'other_payments',
  'hobby',
  'subscriptions',
  'transport',
  'restaurants',
  'utility',
  'online_shopping',
  'debts',
];

export interface User {
  id: number;
  name: string;
  email: string;
}
