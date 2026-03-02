import API from '@/constants/Api';
import { ArtikelFeed } from '@/types/artikel';

export const getArtikelList = async (): Promise<ArtikelFeed> => {
  try {
    const response = await fetch(API.ARTIKEL_LIST);
    if (!response.ok) throw new Error('Gagal Mengambil Data Artikel');
    const data: ArtikelFeed = await response.json();
    return data;
  } catch (error) {
    console.error('getArtikelList error:', error);
    throw error;
  }
};