import API from '@/constants/Api';
import { Dzikir } from '@/types/dzikir';

export const getDzikirList = async (): Promise<Dzikir[]> => {
  try {
    const response = await fetch(API.DZIKIR_LIST);
    if (!response.ok) throw new Error('Gagal Mengambil Data Dzikir');
    const data = await response.json();

    console.log('DZIKIR sample:', JSON.stringify(data[0] ?? data?.data?.[0], null, 2));

    if (Array.isArray(data)) {
      return data;
    } else if (Array.isArray(data?.data)) {
      return data.data;
    } else if (Array.isArray(data?.dzikir)) {
      return data.dzikir;
    } else if (Array.isArray(data?.result)) {
      return data.result;
    } else if (Array.isArray(data?.items)) {
      return data.items;
    } else {
      console.warn('Format Data Dzikir Tidak Dikenali : ', JSON.stringify(data).slice(0, 200));
      return [];
    }
  } catch (error) {
    console.error('getDzikirList error:', error);
    throw error;
  }
};