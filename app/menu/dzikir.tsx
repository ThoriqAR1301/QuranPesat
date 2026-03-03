import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getDzikirList } from '@/services/dzikirService';
import { Dzikir } from '@/types/dzikir';

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

const FILTER_WAKTU = ['Semua', 'Pagi', 'Sore', 'Shalat'];

export default function DzikirScreen() {
  const [dzikirList, setDzikirList] = useState<Dzikir[]>([]);
  const [filtered, setFiltered] = useState<Dzikir[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [selectedDzikir, setSelectedDzikir] = useState<Dzikir | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchDzikir = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDzikirList();
      setDzikirList(data);
      setFiltered(data);
    } catch (err) {
      setError('Gagal Memuat Data Dzikir. Periksa Koneksi Internet Kamu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDzikir();
  }, []);

  useEffect(() => {
    if (activeFilter === 'Semua') {
      setFiltered(dzikirList);
    } else {
      const keyword = activeFilter.toLowerCase();
      const result = dzikirList.filter((item) =>
        item.type?.toLowerCase().includes(keyword)
      );
      setFiltered(result.length > 0 ? result : []);
    }
  }, [activeFilter, dzikirList]);

  const handleOpenDzikir = (dzikir: Dzikir) => {
    setSelectedDzikir(dzikir);
    setModalVisible(true);
  };

  const renderDzikir = ({ item, index }: { item: Dzikir; index: number }) => (
    <TouchableOpacity
      style={styles.dzikirCard}
      onPress={() => handleOpenDzikir(item)}
      activeOpacity={0.7}
    >
      <View style={styles.nomorBox}>
        <Text style={styles.nomorText}>{index + 1}</Text>
      </View>

      <View style={styles.dzikirContent}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {item.type}
            </Text>
          </View>
        </View>

        <Text style={styles.dzikirArab} numberOfLines={2}>
          {item.arab}
        </Text>

        <Text style={styles.dzikirArti} numberOfLines={1}>
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
    <View style={styles.filterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
      >
        {FILTER_WAKTU.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterItem,
              activeFilter === item && styles.filterItemActive,
            ]}
            onPress={() => setActiveFilter(item)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === item && styles.filterTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.infoText}>
        {filtered.length} Dzikir Tersedia
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Memuat Dzikir...</Text>
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchDzikir}>
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
        <Text style={styles.headerTitle}>Dzikir</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderDzikir}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={10}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📿</Text>
            <Text style={styles.emptyText}>Dzikir Tidak Ditemukan</Text>
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
                <View style={styles.badgeModal}>
                  <Text style={styles.badgeModalText}>
                    {selectedDzikir?.type}
                  </Text>
                </View>
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
                  {selectedDzikir?.arab}
                </Text>
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionLabel}>DIULANG</Text>
                <Text style={styles.ulangText}>
                  {selectedDzikir?.ulang} Kali
                </Text>
              </View>

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionLabel}>ARTINYA</Text>
                <Text style={styles.artiText}>
                  {selectedDzikir?.indo}
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
  filterContainer: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 8,
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
  dzikirCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    gap: 12,
  },
  nomorBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + '18',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nomorText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.primary,
  },
  dzikirContent: {
    flex: 1,
    gap: 4,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: Colors.accent + '22',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    color: Colors.accent,
    textTransform: 'capitalize',
  },
  dzikirArab: {
    fontFamily: 'NotoNaskhArabic-Regular',
    fontSize: 18,
    color: Colors.primary,
    textAlign: 'right',
    lineHeight: 30,
  },
  dzikirArti: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
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
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitleRow: {
    flex: 1,
  },
  badgeModal: {
    backgroundColor: Colors.accent + '22',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeModalText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.accent,
    textTransform: 'capitalize',
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
  ulangText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.primary,
  },
  artiText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.primary,
    lineHeight: 22,
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