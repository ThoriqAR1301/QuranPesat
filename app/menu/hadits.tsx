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
import { getHaditsList } from '@/services/haditsService';
import { Hadits } from '@/types/hadits';

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

export default function HaditsScreen() {
  const [haditsList, setHaditsList] = useState<Hadits[]>([]);
  const [filtered, setFiltered] = useState<Hadits[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedHadits, setSelectedHadits] = useState<Hadits | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchHadits = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHaditsList();
      setHaditsList(data);
      setFiltered(data);
    } catch (err) {
      setError('Gagal Memuat Data Hadits. Periksa Koneksi Internet Kamu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHadits();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(haditsList);
    } else {
      const keyword = search.toLowerCase();
      const result = haditsList.filter(
        (item) =>
          item.judul?.toLowerCase().includes(keyword) ||
          item.indo?.toLowerCase().includes(keyword)
      );
      setFiltered(result);
    }
  }, [search, haditsList]);

  const handleOpenHadits = (hadits: Hadits) => {
    setSelectedHadits(hadits);
    setModalVisible(true);
  };

  const renderHadits = ({ item }: { item: Hadits }) => (
    <TouchableOpacity
      style={styles.haditsCard}
      onPress={() => handleOpenHadits(item)}
      activeOpacity={0.7}
    >
      <View style={styles.nomorBox}>
        <Text style={styles.nomorText}>#{item.no}</Text>
      </View>

      <View style={styles.haditsContent}>
        <Text style={styles.haditsJudul} numberOfLines={1}>
          {item.judul}
        </Text>

        <Text style={styles.haditsArab} numberOfLines={2}>
          {item.arab}
        </Text>

        <Text style={styles.haditsIndo} numberOfLines={2}>
          {item.indo}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={16}
        color={Colors.text.light}
      />
    </TouchableOpacity>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  const renderHeader = () => (
    <View>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={Colors.text.light} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari Judul Atau Isi Hadits..."
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
        {filtered.length} Hadits Tersedia
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Memuat Hadits...</Text>
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchHadits}>
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
        <Text style={styles.headerTitle}>Hadits</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.no.toString()}
        renderItem={renderHadits}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📖</Text>
            <Text style={styles.emptyText}>Hadits Tidak Ditemukan</Text>
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
              <View style={styles.modalTitleRow}>
                <View style={styles.nomorBadge}>
                  <Text style={styles.nomorBadgeText}>
                    #{selectedHadits?.no}
                  </Text>
                </View>
                <Text style={styles.modalTitle} numberOfLines={2}>
                  {selectedHadits?.judul}
                </Text>
              </View>
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
                  {selectedHadits?.arab}
                </Text>
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionLabel}>TERJEMAHAN</Text>
                <Text style={styles.indoText}>
                  {selectedHadits?.indo}
                </Text>
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

  haditsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    gap: 12,
  },
  nomorBox: {
    width: 44,
    height: 44,
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
  haditsContent: {
    flex: 1,
    gap: 4,
  },
  haditsJudul: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.text.primary,
  },
  haditsArab: {
    fontFamily: 'NotoNaskhArabic-Regular',
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'right',
    lineHeight: 26,
  },
  haditsIndo: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 18,
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
    maxHeight: '90%',
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
  modalTitleRow: {
    flex: 1,
    gap: 6,
  },
  nomorBadge: {
    backgroundColor: Colors.primary + '18',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  nomorBadgeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: Colors.primary,
  },
  modalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: Colors.text.primary,
    lineHeight: 22,
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
    fontSize: 26,
    color: Colors.primary,
    textAlign: 'center',
    lineHeight: 44,
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
  indoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.primary,
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