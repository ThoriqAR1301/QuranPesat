import API from '@/constants/Api';
import { Hadits } from '@/types/hadits';

export const getHaditsList = async (): Promise<Hadits[]> => {
  try {
    const response = await fetch(API.HADITS_LIST);
    if (!response.ok) throw new Error('Gagal Mengambil Data Hadits');
    const data = await response.json();

    if (Array.isArray(data)) return data;
    else if (Array.isArray(data?.data)) return data.data;
    else return [];
  } catch (error) {
    console.error('getHaditsList error:', error);
    throw error;
  }
};