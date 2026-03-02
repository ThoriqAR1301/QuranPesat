export interface Surah {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string;
  deskripsi: string;
  audio: string;
}

export interface Ayat {
  id: number;
  surah: number;
  nomor: number;
  ar: string;
  tr: string;
  idn: string;
}

export interface SurahDetail extends Surah {
  ayat: Ayat[];
}