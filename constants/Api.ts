const API = {
  SURAH_LIST: 'https://quran-api.santrikoding.com/api/surah',
  SURAH_DETAIL: (nomor: number) =>
    `https://quran-api.santrikoding.com/api/surah/${nomor}`,

  DOA_LIST: 'https://open-api.my.id/api/doa',
  DOA_DETAIL: (id: number) =>
    `https://open-api.my.id/api/doa/${id}`,

  HADITS_LIST: 'https://muslim-api-three.vercel.app/v1/hadits',

  DZIKIR_LIST: 'https://muslim-api-three.vercel.app/v1/dzikir',

  ASMAUL_HUSNA_LIST: 'https://asmaul-husna-api.vercel.app/api/all',

  ARTIKEL_LIST:
    'https://api.rss2json.com/v1/api.json?rss_url=https://republika.co.id/rss/khazanah',
};

export default API;