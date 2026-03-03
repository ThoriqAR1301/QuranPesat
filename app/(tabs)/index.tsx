import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { getHijriyahDate } from '@/services/hijriyahService';

const JADWAL_SHOLAT = [
  { nama: 'Subuh',    jam: 4,  menit: 43, icon: 'partly-sunny-outline' },
  { nama: 'Dzuhur',  jam: 12, menit: 9,  icon: 'sunny-outline'         },
  { nama: 'Ashar',   jam: 15, menit: 12, icon: 'cloud-outline'         },
  { nama: 'Maghrib', jam: 18, menit: 15, icon: 'cloudy-night-outline'  },
  { nama: "Isya'",   jam: 19, menit: 24, icon: 'moon-outline'          },
];

const MENU_BERANDA = [
  { id: 1, nama: 'Al-Quran',     icon: 'book-outline',       route: '/(tabs)/quran'      },
  { id: 2, nama: 'Doa Harian',   icon: 'chatbubble-outline', route: '/menu/doa'          },
  { id: 3, nama: 'Dzikir',  icon: 'heart-outline',      route: '/menu/dzikir'       },
  { id: 4, nama: 'Hadits',       icon: 'reader-outline',     route: '/menu/hadits'       },
  { id: 5, nama: 'Arah Kiblat',  icon: 'compass-outline',    route: '/menu/arah-kiblat'  },
  { id: 6, nama: 'Donasi',       icon: 'gift-outline',       route: '/menu/donasi'       },
  { id: 7, nama: 'Asmaul Husna', icon: 'albums-outline',     route: '/menu/asmaul-husna' },
  { id: 8, nama: 'Lainnya',      icon: 'grid-outline',       route: '/menu/lainnya'      },
];

const DOA_SECTION = [
  {
    id: 1,
    nama: 'Fr',
    judul: 'Doa Untuk Kesembuhan Ibu',
    isi: 'Mohon Doanya Untuk Kesembuhan Ibu Saya Yang Sedang Sakit. Semoga Allah...',
    waktu: '5',
  },
  {
    id: 2,
    nama: 'Tah',
    judul: 'Doa Kelancaran Ujian',
    isi: 'Mohon Doanya Untuk Kelancaran Ujian Saya Minggu Depan...',
    waktu: '3',
  },
];

export default function BerandaScreen() {
  const [hijriyah, setHijriyah] = useState('12 Ramadan 1447 H');
  const [lokasi] = useState('Bogor, Indonesia');
  const [jamSekarang, setJamSekarang] = useState('');
  const [countdown, setCountdown] = useState('');
  const [nextSholat, setNextSholat] = useState('Subuh');

  const hitungCountdown = () => {
    const now = new Date();
    const totalDetikNow =
      now.getHours() * 3600 +
      now.getMinutes() * 60 +
      now.getSeconds();

    let selisihDetik = 0;
    let nextSholatFound = JADWAL_SHOLAT[0];

    for (const sholat of JADWAL_SHOLAT) {
      const totalDetikSholat = sholat.jam * 3600 + sholat.menit * 60;
      if (totalDetikSholat > totalDetikNow) {
        nextSholatFound = sholat;
        selisihDetik = totalDetikSholat - totalDetikNow;
        break;
      }
    }

    if (selisihDetik === 0) {
      const subuh = JADWAL_SHOLAT[0];
      selisihDetik =
        24 * 3600 -
        totalDetikNow +
        subuh.jam * 3600 +
        subuh.menit * 60;
      nextSholatFound = subuh;
    }

    const jam = Math.floor(selisihDetik / 3600)
      .toString()
      .padStart(2, '0');
    const menit = Math.floor((selisihDetik % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const detik = (selisihDetik % 60).toString().padStart(2, '0');

    setCountdown(`${jam}:${menit}:${detik}`);
    setNextSholat(nextSholatFound.nama);
  };

  const updateJam = () => {
    const now = new Date();
    const jam = now.getHours().toString().padStart(2, '0');
    const menit = now.getMinutes().toString().padStart(2, '0');
    setJamSekarang(`${jam}.${menit}`);
  };

  useEffect(() => {
    setHijriyah(getHijriyahDate());

    updateJam();
    hitungCountdown();

    const interval = setInterval(() => {
      updateJam();
      hitungCountdown();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView showsVerticalScrollIndicator={false}>

        <ImageBackground
          source={require('@/assets/images/Element.png')}
          style={styles.header}
          imageStyle={styles.headerImage}
        >
          <View style={styles.headerOverlay} />

          <View style={styles.headerTop}>
            <View>
              <Text style={styles.hijriyahText}>{hijriyah}</Text>
              <Text style={styles.lokasiText}>{lokasi}</Text>
            </View>
            <TouchableOpacity>
              <Ionicons
                name="notifications-outline"
                size={26}
                color={Colors.white}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.jamContainer}>
            <Text style={styles.jamText}>{jamSekarang}</Text>
            <Text style={styles.countdownText}>
              {nextSholat} Dalam  {countdown}
            </Text>
          </View>

          <View style={styles.waktuSholatRow}>
            {JADWAL_SHOLAT.map((item, index) => (
              <View key={index} style={styles.waktuSholatItem}>
                <Ionicons
                  name={item.icon as any}
                  size={18}
                  color="rgba(255,255,255,0.85)"
                />
                <Text style={styles.waktuSholatNama}>{item.nama}</Text>
                <Text style={styles.waktuSholatWaktu}>
                  {item.jam.toString().padStart(2, '0')}:
                  {item.menit.toString().padStart(2, '0')}
                </Text>
              </View>
            ))}
          </View>
        </ImageBackground>

        <View style={styles.content}>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Cari Surat, Doa, Artikel, Hadits ..."
              placeholderTextColor={Colors.text.light}
            />
            <Ionicons
              name="search-outline"
              size={20}
              color={Colors.text.light}
            />
          </View>

          <View style={styles.menuGrid}>
            {MENU_BERANDA.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
              >
                <View style={styles.menuIconBox}>
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={Colors.primary}
                  />
                </View>
                <Text style={styles.menuNama}>{item.nama}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.ramadanCard}>
            <Text style={styles.ramadanEmoji}>🌙</Text>
            <View>
              <Text style={styles.ramadanTitle}>Ramadhan Mubarak!</Text>
              <Text style={styles.ramadanSubtitle}>
                Selamat Menjalankan Ibadah Puasa
              </Text>
            </View>
          </View>

          <View style={styles.doaSection}>
            <View style={styles.doaSectionHeader}>
              <Text style={styles.doaSectionTitle}>
                Aminkan Doa Saudaramu
              </Text>
              <TouchableOpacity>
                <Text style={styles.doaSectionLink}>Buat Doa +</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -20 }}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              {DOA_SECTION.map((item) => (
                <View key={item.id} style={styles.doaCard}>
                  <View style={styles.doaCardHeader}>
                    <View style={styles.doaAvatar}>
                      <Text style={styles.doaAvatarText}>{item.nama}</Text>
                    </View>
                    <Text style={styles.doaWaktu}>{item.waktu} Jam Lalu</Text>
                  </View>
                  <Text style={styles.doaJudul}>{item.judul}</Text>
                  <Text style={styles.doaIsi} numberOfLines={2}>
                    {item.isi}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    height: 320,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 50,
  },
  headerImage: {
    resizeMode: 'cover',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 30, 40, 0.45)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  hijriyahText: {
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  lokasiText: {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    marginTop: 2,
  },
  jamContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  jamText: {
    color: Colors.white,
    fontFamily: 'Poppins-Bold',
    fontSize: 64,
    lineHeight: 72,
  },
  countdownText: {
    color: 'rgba(255,255,255,0.75)',
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
  },
  waktuSholatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  waktuSholatItem: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  waktuSholatNama: {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
  },
  waktuSholatWaktu: {
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.text.primary,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  menuItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 16,
    gap: 6,
  },
  menuIconBox: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E8EDF2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuNama: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  ramadanCard: {
    backgroundColor: Colors.ramadanCard,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
  },
  ramadanEmoji: {
    fontSize: 36,
  },
  ramadanTitle: {
    color: Colors.white,
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  ramadanSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  doaSection: {
    marginBottom: 20,
  },
  doaSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  doaSectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: Colors.text.primary,
  },
  doaSectionLink: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: Colors.primary,
  },
  doaCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    width: 200,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  doaCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  doaAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doaAvatarText: {
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
  },
  doaWaktu: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.text.light,
  },
  doaJudul: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  doaIsi: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
});