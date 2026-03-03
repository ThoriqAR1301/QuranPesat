import API from '@/constants/Api';
import { Doa } from '@/types/doa';

export const getDoaList = async (): Promise<Doa[]> => {
  try {
    const response = await fetch(API.DOA_LIST);
    if (!response.ok) throw new Error('Gagal Mengambil Data Doa');
    const data = await response.json();

    console.log('DOA sample:', JSON.stringify(data[0] ?? data?.data?.[0], null, 2));

    if (Array.isArray(data)) return data;
    else if (Array.isArray(data?.data)) return data.data;
    else if (Array.isArray(data?.doa)) return data.doa;
    else if (Array.isArray(data?.result)) return data.result;
    else return [];
  } catch (error) {
    console.error('getDoaList error:', error);
    throw error;
  }
};

export const getDoaDetail = async (id: number): Promise<Doa> => {
  try {
    const response = await fetch(API.DOA_DETAIL(id));
    if (!response.ok) throw new Error('Gagal Mengambil Detail Doa');
    const data = await response.json();
    return data?.data ?? data;
  } catch (error) {
    console.error('getDoaDetail error:', error);
    throw error;
  }
};