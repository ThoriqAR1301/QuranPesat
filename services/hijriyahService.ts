export const getHijriyahDate = (): string => {
  const today = new Date();

  const hijriyah = new Intl.DateTimeFormat('id-TH-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(today);

  return hijriyah;
};

export const getNamaHari = (): string => {
  const hari = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  return hari[new Date().getDay()];
};