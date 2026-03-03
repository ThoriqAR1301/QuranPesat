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
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getDoaList } from '@/services/doaService';
import { Doa } from '@/types/doa';

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

const KATEGORI = ['Semua', 'Favorit'];

export default function DoaScreen() {
  const [doaList, setDoaList] = useState<Doa[]>([]);
  const [filtered, setFiltered] = useState<Doa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeKategori, setActiveKategori] = useState('Semua');
  const [favorit, setFavorit] = useState<number[]>([]);
  const [selectedDoa, setSelectedDoa] = useState<Doa | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchDoa = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDoaList();
      setDoaList(data);
      setFiltered(data);
    } catch (err) {
      setError('Gagal Memuat Data Doa. Periksa Koneksi Internet Kamu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoa();
  }, []);

  useEffect(() => {
    let result = doaList;

    if (activeKategori === 'Favorit') {
      result = result.filter((item) => favorit.includes(item.id));
    }

    if (search.trim() !== '') {
      const keyword = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.judul?.toLowerCase().includes(keyword) ||
          item.terjemah?.toLowerCase().includes(keyword) ||
          item.latin?.toLowerCase().includes(keyword)
      );
    }

    setFiltered(result);
  }, [search, activeKategori, doaList, favorit]);

  const toggleFavorit = (id: number) => {
    setFavorit((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleOpenDoa = (doa: Doa) => {
    setSelectedDoa(doa);
    setModalVisible(true);
  };

  const renderDoa = ({ item, index }: { item: Doa; index: number }) => (
    <TouchableOpacity
      style={styles.doaCard}
      onPress={() => handleOpenDoa(item)}
      activeOpacity={0.7}
    >
      <View style={styles.nomorBox}>
        <Text style={styles.nomorText}>#{index + 1}</Text>
      </View>

      <View style={styles.doaContent}>
        <Text style={styles.doaJudul} numberOfLines={1}>
          {item.judul}
        </Text>
        <Text style={styles.doaArab} numberOfLines={1}>
          {item.arab}
        </Text>
        <Text style={styles.doaArti} numberOfLines={1}>
          {item.terjemah}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.favButton}
        onPress={() => toggleFavorit(item.id)}
      >
        <Ionicons
          name={favorit.includes(item.id) ? 'star' : 'star-outline'}
          size={20}
          color={
            favorit.includes(item.id) ? Colors.accent : Colors.text.light
          }
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  const renderHeader = () => (
    <View>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={Colors.text.light} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari Judul, Arti, Latin..."
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

      <View style={styles.filterRow}>
        {KATEGORI.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterItem,
              activeKategori === item && styles.filterItemActive,
            ]}
            onPress={() => setActiveKategori(item)}
          >
            <Text
              style={[
                styles.filterText,
                activeKategori === item && styles.filterTextActive,
              ]}
            >
              {item}
              {item === 'Favorit' && favorit.length > 0
                ? ` (${favorit.length})`
                : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.infoText}>
        {filtered.length} Doa Tersedia
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Memuat Doa...</Text>
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchDoa}>
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
        <Text style={styles.headerTitle}>Doa Harian</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDoa}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={10}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🤲</Text>
            <Text style={styles.emptyText}>
              {activeKategori === 'Favorit'
                ? 'Belum Ada Doa Favorit'
                : 'Doa Tidak Ditemukan'}
            </Text>
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
              <Text style={styles.modalTitle} numberOfLines={2}>
                {selectedDoa?.judul}
              </Text>
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
              <View style={styles.arabContainer}>
                <Text style={styles.arabText}>
                  {selectedDoa?.arab}
                </Text>
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionLabel}>LATIN</Text>
                <Text style={styles.latinText}>
                  {selectedDoa?.latin}
                </Text>
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionLabel}>ARTINYA</Text>
                <Text style={styles.artiText}>
                  {selectedDoa?.terjemah}
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.favModalButton}
                onPress={() => {
                  if (selectedDoa) toggleFavorit(selectedDoa.id);
                }}
              >
                <Ionicons
                  name={
                    selectedDoa && favorit.includes(selectedDoa.id)
                      ? 'star'
                      : 'star-outline'
                  }
                  size={20}
                  color={
                    selectedDoa && favorit.includes(selectedDoa.id)
                      ? Colors.accent
                      : Colors.text.secondary
                  }
                />
                <Text style={styles.favModalText}>
                  {selectedDoa && favorit.includes(selectedDoa.id)
                    ? 'Hapus Favorit'
                    : 'Simpan Favorit'}
                </Text>
              </TouchableOpacity>

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
  },
  backButton: {
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
    marginTop: 8,
    marginBottom: 12,
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
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 6,
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
  infoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.light,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 100,
    backgroundColor: Colors.white,
    marginTop: 8,
  },
  doaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    gap: 12,
  },
  nomorBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.primary + '18',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nomorText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: Colors.primary,
  },
  doaContent: {
    flex: 1,
    gap: 3,
  },
  doaJudul: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.text.primary,
  },
  doaArab: {
    fontFamily: 'NotoNaskhArabic-Regular',
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'right',
  },
  doaArti: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  favButton: {
    padding: 4,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
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
    textAlign: 'center',
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    flex: 1,
  },
  modalClose: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
    gap: 20,
  },
  arabContainer: {
    backgroundColor: Colors.primary + '12',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  arabText: {
    fontFamily: 'NotoNaskhArabic-Regular',
    fontSize: 28,
    color: Colors.primary,
    textAlign: 'center',
    lineHeight: 48,
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
  latinText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.primary,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  artiText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  favModalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  favModalText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: Colors.text.secondary,
  },
  tutupButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  tutupButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: Colors.white,
  },
});