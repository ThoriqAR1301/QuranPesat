import API from '@/constants/Api';
import { AsmaulHusna } from '@/types/asmaulHusna';

export const getAsmaulHusnaList = async (): Promise<AsmaulHusna[]> => {
  try {
    const response = await fetch(API.ASMAUL_HUSNA_LIST);
    if (!response.ok) throw new Error('Gagal Mengambil Data Asmaul Husna');
    const data = await response.json();

    if (Array.isArray(data)) return data;
    else if (Array.isArray(data?.data)) return data.data;
    else return [];
  } catch (error) {
    console.error('getAsmaulHusnaList error:', error);
    throw error;
  }
};