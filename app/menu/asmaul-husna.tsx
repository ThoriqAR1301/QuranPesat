import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getAsmaulHusnaList } from '@/services/asmaulHusnaService';
import { AsmaulHusna } from '@/types/asmaulHusna';

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

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 3;

export default function AsmaulHusnaScreen() {
  const [list, setList] = useState<AsmaulHusna[]>([]);
  const [filtered, setFiltered] = useState<AsmaulHusna[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AsmaulHusna | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAsmaulHusnaList();
      setList(data);
      setFiltered(data);
    } catch (err) {
      setError('Gagal Memuat Data Asmaul Husna. Periksa Koneksi Internet Kamu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(list);
    } else {
      const keyword = search.toLowerCase();
      const result = list.filter(
        (item) =>
          item.latin?.toLowerCase().includes(keyword) ||
          item.arti?.toLowerCase().includes(keyword) ||
          item.arab?.includes(keyword)
      );
      setFiltered(result);
    }
  }, [search, list]);

  const handleOpen = (item: AsmaulHusna) => {
    setSelected(item);
    setModalVisible(true);
  };

  const getNomorColor = (urutan: number): string => {
    const colors = [
      '#5B7FA6', '#C9A84C', '#27AE60', '#E74C3C',
      '#8E44AD', '#2980B9', '#E67E22', '#16A085',
    ];
    return colors[(urutan - 1) % colors.length];
  };

  const renderItem = ({ item }: { item: AsmaulHusna }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleOpen(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.cardNomor}>{item.urutan}</Text>

      <Text style={styles.cardArab} numberOfLines={2}>
        {item.arab}
      </Text>

      <Text style={styles.cardLatin} numberOfLines={1}>
        {item.latin}
      </Text>

      <Text style={styles.cardArti} numberOfLines={2}>
        {item.arti}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={Colors.text.light} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari Nama Atau Arti..."
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

      <Text style={styles.infoText}>
        {filtered.length} Asmaul Husna Tersedia
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Memuat Asmaul Husna...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Asmaul Husna</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={fetchData}
        >
          <Ionicons
            name="refresh-outline"
            size={22}
            color={Colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        key="grid-3-columns"
        data={filtered}
        keyExtractor={(item) => item.urutan.toString()}
        renderItem={renderItem}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={18}
        maxToRenderPerBatch={18}
        windowSize={10}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>✨</Text>
            <Text style={styles.emptyText}>Tidak Ditemukan</Text>
          </View>
        }
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons
                  name="close"
                  size={22}
                  color={Colors.text.primary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalContent}
            >
              <View
                style={[
                  styles.arabBanner,
                  {
                    backgroundColor: selected
                      ? getNomorColor(selected.urutan) + '18'
                      : Colors.primary + '18',
                  },
                ]}
              >
                <View
                  style={[
                    styles.nomorBannerBox,
                    {
                      backgroundColor: selected
                        ? getNomorColor(selected.urutan)
                        : Colors.primary,
                    },
                  ]}
                >
                  <Text style={styles.nomorBannerText}>
                    {selected?.urutan}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.arabBannerText,
                    {
                      color: selected
                        ? getNomorColor(selected.urutan)
                        : Colors.primary,
                    },
                  ]}
                >
                  {selected?.arab}
                </Text>
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionLabel}>NAMA LATIN</Text>
                <Text style={styles.latinBigText}>{selected?.latin}</Text>
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionLabel}>ARTI</Text>
                <Text style={styles.artiBigText}>{selected?.arti}</Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.tutupButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.tutupButtonText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },

  header: {
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: Colors.text.primary,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 10,
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

  infoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.light,
    marginHorizontal: 16,
    marginBottom: 12,
  },

  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 100,
    gap: 8,
  },
  columnWrapper: {
    gap: 8,
    marginBottom: 8,
  },

  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    gap: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  cardNomor: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.text.light,
  },
  cardArab: {
    fontFamily: 'NotoKufiArabic-Regular',
    fontSize: 26,
    color: Colors.text.primary,
    textAlign: 'right',
    lineHeight: 38,
    marginTop: 4,
  },
  cardLatin: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.text.primary,
    marginTop: 4,
  },
  cardArti: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.text.secondary,
    lineHeight: 16,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
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
    paddingHorizontal: 32,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  modalClose: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 20,
  },
  arabBanner: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  nomorBannerBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nomorBannerText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: Colors.white,
  },
  arabBannerText: {
    fontFamily: 'NotoKufiArabic-Regular',
    fontSize: 48,
    textAlign: 'center',
    lineHeight: 72,
  },
  sectionContainer: {
    gap: 6,
  },
  sectionLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.text.secondary,
    letterSpacing: 1,
  },
  latinBigText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: Colors.text.primary,
  },
  artiBigText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  tutupButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  tutupButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.white,
  },
});