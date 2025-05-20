import http from './http';
import { Debt } from '@/features/debt/types';

export const getAllDebts = () => http.get<Debt[]>('/debts');
export const addDebt = (debt: Debt) => http.post('/debts', debt);
export const deleteDebt = (id: string) => http.delete(`/debts/${id}`);
