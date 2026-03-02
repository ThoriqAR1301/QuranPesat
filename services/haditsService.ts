import API from '@/constants/Api';
import { Hadits } from '@/types/hadits';

export const getHaditsList = async (): Promise<Hadits[]> => {
  try {
    const response = await fetch(API.HADITS_LIST);
    if (!response.ok) throw new Error('Gagal Mengambil Data Hadits');
    const data: Hadits[] = await response.json();
    return data;
  } catch (error) {
    console.error('getHaditsList error:', error);
    throw error;
  }
};