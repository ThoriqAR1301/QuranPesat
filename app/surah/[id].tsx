import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getSurahDetail } from '@/services/quranService';
import { SurahDetail, Ayat } from '@/types/surah';
import ErrorView from '@/components/common/ErrorView';

const Colors = {
  primary: '#5B7FA6',
  accent: '#C9A84C',
  background: '#F5F0E8',
  white: '#FFFFFF',
  text: {
    primary: '#2C2C2C',
    secondary: '#8A8A8A',
    light: '#BBBBBB',
    arabic: '#2C2C2C',
  },
  border: '#E8E3D8',
  headerBg: '#5B7FA6',
};

export default function DetailSurahScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedAyat, setSavedAyat] = useState<number[]>([]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const nomor = parseInt(id as string);
      const data = await getSurahDetail(nomor);
      setSurah(data);
    } catch (err) {
      setError('Gagal Memuat Detail Surah. Periksa Koneksi Internet Kamu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const toggleSaveAyat = (nomor: number) => {
    setSavedAyat((prev) =>
      prev.includes(nomor)
        ? prev.filter((n) => n !== nomor)
        : [...prev, nomor]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="light-content" backgroundColor={Colors.headerBg} />
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Memuat Surah...</Text>
      </View>
    );
  }

  if (error || !surah) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <ErrorView message={error ?? 'Data Tidak Ditemukan'} onRetry={fetchDetail} />
      </>
    );
  }

  const renderAyat = ({ item }: { item: Ayat }) => (
    <View style={styles.ayatCard}>
      <View style={styles.ayatHeader}>
        <View style={styles.ayatNomorBox}>
          <Text style={styles.ayatNomor}>{item.nomor}</Text>
        </View>
        <View style={styles.ayatActions}>
          <TouchableOpacity style={styles.ayatActionBtn}>
            <Ionicons
              name="play-circle-outline"
              size={22}
              color={Colors.text.secondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ayatActionBtn}
            onPress={() => toggleSaveAyat(item.nomor)}
          >
            <Ionicons
              name={savedAyat.includes(item.nomor) ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={savedAyat.includes(item.nomor) ? Colors.primary : Colors.text.secondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.ayatArab}>{item.ar}</Text>

      <Text style={styles.ayatTerjemahan}>{item.idn}</Text>
    </View>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  const renderHeader = () => (
    <View>
      <View style={styles.surahBanner}>
        <Text style={styles.bannerNamaArab}>{surah.nama}</Text>
        <Text style={styles.bannerNamaLatin}>{surah.nama_latin}</Text>
        <Text style={styles.bannerInfo}>
          {surah.arti} • {surah.jumlah_ayat} Ayat •{' '}
          {surah.tempat_turun?.toLowerCase()}
        </Text>
        <View style={styles.bannerDivider} />
        <TouchableOpacity style={styles.playButton}>
          <Ionicons name="play-circle-outline" size={20} color={Colors.white} />
          <Text style={styles.playButtonText}>Putar Full Surah</Text>
        </TouchableOpacity>
      </View>

      {surah.nomor !== 9 && (
        <View style={styles.bismillahContainer}>
          <Text style={styles.bismillahText}>
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>

      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor={Colors.headerBg} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{surah.nama_latin}</Text>
          <Text style={styles.headerSubtitle}>
            {surah.jumlah_ayat} Ayat • {surah.tempat_turun?.toLowerCase()}
          </Text>
        </View>

        <Text style={styles.headerArab}>{surah.nama}</Text>
      </View>

      <FlatList
        data={surah.ayat}
        keyExtractor={(item) => item.nomor.toString()}
        renderItem={renderAyat}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    gap: 12,
  },
  loadingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },

  header: {
    backgroundColor: Colors.headerBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 16,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginTop: 1,
    textTransform: 'capitalize',
  },
  headerArab: {
    color: Colors.white,
    fontFamily: 'NotoKufiArabic-Regular',
    fontSize: 22,
    lineHeight: 32,
  },

  surahBanner: {
    backgroundColor: Colors.headerBg,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'center',
    gap: 6,
  },
  bannerNamaArab: {
    color: Colors.white,
    fontFamily: 'NotoKufiArabic-Regular',
    fontSize: 36,
    lineHeight: 52,
  },
  bannerNamaLatin: {
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  bannerInfo: {
    color: 'rgba(255,255,255,0.75)',
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    textTransform: 'capitalize',
  },
  bannerDivider: {
    width: 60,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 8,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 4,
  },
  playButtonText: {
    color: Colors.white,
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
  },

  bismillahContainer: {
    backgroundColor: Colors.white,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  bismillahText: {
    fontFamily: 'NotoKufiArabic-Regular',
    fontSize: 28,
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 48,
  },

  listContent: {
    paddingBottom: 100,
  },

  ayatCard: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  ayatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ayatNomorBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ayatNomor: {
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
  },
  ayatActions: {
    flexDirection: 'row',
    gap: 8,
  },
  ayatActionBtn: {
    padding: 4,
  },
  ayatArab: {
    fontFamily: 'NotoKufiArabic-Regular',
    fontSize: 26,
    color: Colors.text.arabic,
    textAlign: 'right',
    lineHeight: 48,
    marginBottom: 12,
  },
  ayatTerjemahan: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
  },
});