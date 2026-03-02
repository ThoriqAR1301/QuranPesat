import API from '@/constants/Api';
import { Doa } from '@/types/doa';

export const getDoaList = async (): Promise<Doa[]> => {
  try {
    const response = await fetch(API.DOA_LIST);
    if (!response.ok) throw new Error('Gagal Mengambil Data Doa');
    const data: Doa[] = await response.json();
    return data;
  } catch (error) {
    console.error('getDoaList error:', error);
    throw error;
  }
};

export const getDoaDetail = async (id: number): Promise<Doa> => {
  try {
    const response = await fetch(API.DOA_DETAIL(id));
    if (!response.ok) throw new Error('Gagal Mengambil Detail Doa');
    const data: Doa = await response.json();
    return data;
  } catch (error) {
    console.error('getDoaDetail error:', error);
    throw error;
  }
};