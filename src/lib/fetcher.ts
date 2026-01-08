// lib/fetcher.ts
import api from '@/core/services/api';

export const fetcher = async <T>(url: string): Promise<T> => {
    const res = await api.get(url);
    return res.data;
};