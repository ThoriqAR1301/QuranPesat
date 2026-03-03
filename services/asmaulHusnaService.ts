import API from '@/constants/Api';
import { AsmaulHusna } from '@/types/asmaulHusna';

export const getAsmaulHusnaList = async (): Promise<AsmaulHusna[]> => {
  try {
    const response = await fetch(API.ASMAUL_HUSNA_LIST);
    if (!response.ok) throw new Error('Gagal Mengambil Data Asmaul Husna');
    const data = await response.json();

    if (Array.isArray(data)) return data;
    else if (Array.isArray(data?.data)) return data.data;
    else if (Array.isArray(data?.asmaul_husna)) return data.asmaul_husna;
    else if (Array.isArray(data?.result)) return data.result;
    else return [];
  } catch (error) {
    console.error('getAsmaulHusnaList error:', error);
    throw error;
  }
};