import API from '@/constants/Api';
import { Surah, SurahDetail } from '@/types/surah';

export const getSurahList = async (): Promise<Surah[]> => {
  try {
    const response = await fetch(API.SURAH_LIST);
    if (!response.ok) throw new Error('Gagal Mengambil Data Surah');
    const data: Surah[] = await response.json();
    return data;
  } catch (error) {
    console.error('getSurahList error:', error);
    throw error;
  }
};

export const getSurahDetail = async (nomor: number): Promise<SurahDetail> => {
  try {
    const response = await fetch(API.SURAH_DETAIL(nomor));
    if (!response.ok) throw new Error('Gagal Mengambil Detail Surah');
    const data: SurahDetail = await response.json();
    return data;
  } catch (error) {
    console.error('getSurahDetail error:', error);
    throw error;
  }
};