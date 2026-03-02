import API from '@/constants/Api';
import { ArtikelFeed } from '@/types/artikel';

const extractImageFromContent = (content: string): string => {
  if (!content) return '';
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : '';
};

export const getArtikelList = async (): Promise<ArtikelFeed> => {
  try {
    const response = await fetch(API.ARTIKEL_LIST);
    if (!response.ok) throw new Error('Gagal mengambil data artikel');
    const data: ArtikelFeed = await response.json();

    const itemsWithImage = data.items.map((item) => ({
      ...item,
      thumbnail: item.thumbnail || extractImageFromContent(item.description ?? '') || '',
    }));

    return { ...data, items: itemsWithImage };
  } catch (error) {
    console.error('getArtikelList error:', error);
    throw error;
  }
};
