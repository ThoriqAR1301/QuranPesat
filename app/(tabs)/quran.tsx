import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getSurahList } from '@/services/quranService';
import { Surah } from '@/types/surah';
import Loading from '@/components/common/Loading';
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
    arabic: '#5B7FA6',
  },
  border: '#E8E3D8',
};

export default function QuranScreen() {
  const [surahList, setSurahList] = useState<Surah[]>([]);
  const [filtered, setFiltered] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchSurah = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSurahList();
      setSurahList(data);
      setFiltered(data);
    } catch (err) {
      setError('Gagal Memuat Data Surah. Periksa Koneksi Internet Kamu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurah();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(surahList);
    } else {
      const keyword = search.toLowerCase();
      const result = surahList.filter(
        (item) =>
          item.nama_latin.toLowerCase().includes(keyword) ||
          item.arti.toLowerCase().includes(keyword) ||
          item.nomor.toString().includes(keyword)
      );
      setFiltered(result);
    }
  }, [search, surahList]);

  if (loading) return <Loading message="Memuat Daftar Surah..." />;

  if (error) return <ErrorView message={error} onRetry={fetchSurah} />;

  const renderSurah = ({ item }: { item: Surah }) => (
    <TouchableOpacity
      style={styles.surahItem}
      onPress={() => router.push(`/surah/${item.nomor}`)}
      activeOpacity={0.7}
    >
      <View style={styles.nomorWrapper}>
        <View style={styles.nomorDiamond}>
          <Text style={styles.nomorText}>{item.nomor}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.namaLatin}>{item.nama_latin}</Text>
        <Text style={styles.infoDetail}>
          {item.arti} • {item.jumlah_ayat} Ayat
        </Text>
      </View>

      <View style={styles.arabContainer}>
        <Text style={styles.namaArab}>{item.nama}</Text>
        <Text style={styles.tempatTurun}>
          {item.tempat_turun?.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  const renderHeader = () => (
    <View style={styles.searchWrapper}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={18}
          color={Colors.text.light}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari Surah..."
          placeholderTextColor={Colors.text.light}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons
              name="close-circle"
              size={18}
              color={Colors.text.light}
            />
          </TouchableOpacity>
        )}
      </View>
      {search.length > 0 && (
        <Text style={styles.searchResult}>
          Ditemukan {filtered.length} Surah
        </Text>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyText}>
        Surah "{search}" Tidak Ditemukan
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons
            name="book-outline"
            size={24}
            color={Colors.text.primary}
          />
          <Text style={styles.headerTitle}>Al-Quran</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons
              name="bookmark-outline"
              size={22}
              color={Colors.text.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons
              name="settings-outline"
              size={22}
              color={Colors.text.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.nomor.toString()}
        renderItem={renderSurah}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: Colors.text.primary,
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  headerIcon: {
    padding: 2,
  },

  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.text.primary,
    paddingVertical: 0,
  },
  searchResult: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 6,
    marginLeft: 4,
  },

  listContent: {
    paddingBottom: 100,
    backgroundColor: Colors.background,
  },

  surahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.background,
    gap: 14,
  },

  nomorWrapper: {
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nomorDiamond: {
    width: 46,
    height: 46,
    fontSize: 44,
    backgroundColor: Colors.accent,
    transform: [{ rotate: '45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  nomorText: {
    color: Colors.text.primary,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    transform: [{ rotate: '-45deg' }],
    includeFontPadding: false,
    textAlign: 'center',
  },

  infoContainer: {
    flex: 1,
    flexShrink: 1,
    paddingRight: 8,
  },
  namaLatin: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: Colors.text.primary,
  },
  infoDetail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 3,
  },

  arabContainer: {
    alignItems: 'flex-end',
    marginLeft: 8,
    minWidth: 90,
    gap: 4,
  },
  namaArab: {
    fontFamily: 'NotoKufiArabic-Regular',
    fontSize: 22,
    color: Colors.text.arabic,
    lineHeight: 32,
  },
  tempatTurun: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.text.secondary,
    marginTop: 2,
  },

  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 20,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 14,
  },
  emptyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});