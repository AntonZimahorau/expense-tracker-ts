import { CurrencyCode } from './utils';
import { api } from './axios';

export interface ExtractedInvoice {
  name: string;
  category: string;
  currency: CurrencyCode;
  date: string;
  amount: number;
}

export async function parseInvoice(file: File): Promise<ExtractedInvoice> {
  const form = new FormData();
  form.append('file', file, file.name);

  const { data } = await api.post('/expenses/analyze-invoice', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
