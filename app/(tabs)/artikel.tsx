import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getArtikelList } from '@/services/artikelService';
import { Artikel } from '@/types/artikel';

const Colors = {
  primary: '#5B7FA6',
  accent: '#C9A84C',
  background: '#F5F0E8',
  white: '#FFFFFF',
  text: {
    primary: '#2C2C2C',
    secondary: '#8A8A8A',
    light: '#BBBBBB',
  },
  border: '#E8E3D8',
};

const KATEGORI = ['Semua', 'Islam', 'Ramadhan', 'Ibadah', 'Kisah Nabi', 'Tafsir'];

const getProxyImage = (url: string): string => {
  if (!url || url.trim() === '') return '';
  const cleanUrl = url.trim();
  return `https://wsrv.nl/?url=${encodeURIComponent(cleanUrl)}&w=600&h=300&fit=cover&output=jpg&il`;
};

const formatTanggal = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '').trim();
};

interface ThumbnailProps {
  uri: string;
}

function ArticleThumbnail({ uri }: ThumbnailProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!uri || hasError) {
    return (
      <View style={styles.thumbnailPlaceholder}>
        <Ionicons name="newspaper-outline" size={40} color={Colors.text.light} />
      </View>
    );
  }

  return (
    <View style={styles.thumbnailContainer}>
      {isLoading && (
        <View style={styles.thumbnailLoading}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      )}
      <Image
        source={{
          uri: getProxyImage(uri),
          headers: {
            'User-Agent': 'Mozilla/5.0',
            'Accept': 'image/*',
          },
        }}
        style={styles.thumbnail}
        resizeMode="cover"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </View>
  );
}

export default function ArtikelScreen() {
  const [artikelList, setArtikelList] = useState<Artikel[]>([]);
  const [filtered, setFiltered] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeKategori, setActiveKategori] = useState('Semua');

  const fetchArtikel = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getArtikelList();
      setArtikelList(data.items);
      setFiltered(data.items);
    } catch (err) {
      setError('Gagal Memuat Artikel. Periksa Koneksi Internet Kamu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtikel();
  }, []);

  const handleKategori = (kategori: string) => {
    setActiveKategori(kategori);
    if (kategori === 'Semua') {
      setFiltered(artikelList);
    } else {
      const result = artikelList.filter((item) =>
        item.categories?.some((cat) =>
          cat.toLowerCase().includes(kategori.toLowerCase())
        )
      );
      setFiltered(result.length > 0 ? result : artikelList);
    }
  };

  const handleBacaArtikel = (url: string) => {
    if (url) Linking.openURL(url);
  };

  const renderArtikel = ({ item }: { item: Artikel }) => (
    <View style={styles.artikelCard}>
      <ArticleThumbnail uri={item.thumbnail} />

      <View style={styles.artikelContent}>
        <View style={styles.artikelMeta}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {item.categories?.[0] ?? 'Islam'}
            </Text>
          </View>
          <Text style={styles.tanggal}>
            {formatTanggal(item.pubDate)}
          </Text>
        </View>

        <Text style={styles.artikelJudul} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.artikelDeskripsi} numberOfLines={3}>
          {stripHtml(item.description)}
        </Text>

        <View style={styles.artikelFooter}>
          <Text style={styles.artikelAuthor} numberOfLines={1}>
            {item.author || 'Republika'}
          </Text>
          <TouchableOpacity
            style={styles.bacaButton}
            onPress={() => handleBacaArtikel(item.link)}
          >
            <Text style={styles.bacaButtonText}>Baca Selengkapnya</Text>
            <Ionicons name="open-outline" size={12} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  const renderHeader = () => (
    <View style={styles.filterContainer}>
      <FlatList
        data={KATEGORI}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterItem,
              activeKategori === item && styles.filterItemActive,
            ]}
            onPress={() => handleKategori(item)}
          >
            <Text
              style={[
                styles.filterText,
                activeKategori === item && styles.filterTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Memuat Artikel...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchArtikel}>
          <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons
            name="newspaper-outline"
            size={24}
            color={Colors.text.primary}
          />
          <View>
            <Text style={styles.headerTitle}>Artikel</Text>
            <Text style={styles.headerSubtitle}>
              Berita Dan Artikel Islami Terkini
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item, index) => `${item.link}-${index}`}
        renderItem={renderArtikel}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={styles.errorIcon}>📰</Text>
            <Text style={styles.errorText}>
              Tidak Ada Artikel Tersedia
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    gap: 12,
    padding: 24,
    minHeight: 300,
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
    gap: 10,
  },
  headerTitle: {
    color: Colors.text.primary,
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    lineHeight: 28,
  },
  headerSubtitle: {
    color: Colors.text.secondary,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
  },

  filterContainer: {
    marginBottom: 8,
  },
  filterList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterItemActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  filterTextActive: {
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },

  listContent: {
    paddingBottom: 100,
    backgroundColor: Colors.background,
  },

  artikelCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  thumbnailContainer: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.border,
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  thumbnailLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.border,
    zIndex: 1,
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artikelContent: {
    padding: 16,
    gap: 8,
  },
  artikelMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    color: Colors.primary,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    textTransform: 'capitalize',
  },
  tanggal: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.text.light,
  },
  artikelJudul: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  artikelDeskripsi: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  artikelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  artikelAuthor: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.light,
    flex: 1,
  },
  bacaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bacaButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.primary,
  },

  separator: {
    height: 12,
  },

  loadingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  errorIcon: {
    fontSize: 48,
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  retryText: {
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
});