import API from '@/constants/Api';
import { Dzikir } from '@/types/dzikir';

export const getDzikirList = async (): Promise<Dzikir[]> => {
  try {
    const response = await fetch(API.DZIKIR_LIST);
    if (!response.ok) throw new Error('Gagal Mengambil Data Dzikir');
    const data: Dzikir[] = await response.json();
    return data;
  } catch (error) {
    console.error('getDzikirList error:', error);
    throw error;
  }
};