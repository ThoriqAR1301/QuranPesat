import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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

const SHORTCUT_MENU = [
  { id: 1, nama: 'Al-Quran',     icon: 'book-outline',       route: '/(tabs)/quran'      },
  { id: 2, nama: 'Doa Harian',   icon: 'chatbubble-outline', route: '/menu/doa'          },
  { id: 3, nama: 'Dzikir Duha',  icon: 'heart-outline',      route: '/menu/dzikir'       },
  { id: 4, nama: 'Hadits',       icon: 'reader-outline',     route: '/menu/hadits'       },
  { id: 5, nama: 'Arah Kiblat',  icon: 'compass-outline',    route: '/menu/arah-kiblat'  },
  { id: 6, nama: 'Donasi',       icon: 'gift-outline',       route: '/menu/donasi'       },
  { id: 7, nama: 'Asmaul Husna', icon: 'albums-outline',     route: '/menu/asmaul-husna' },
];

const LIST_MENU = [
  {
    id: 1,
    nama: 'Kalender Hijriah',
    subtitle: 'Tanggal Hijriah Hari Ini Dan Info Singkat',
    icon: 'calendar-outline',
    route: null,
  },
  {
    id: 2,
    nama: 'Zakat Calculator',
    subtitle: 'Hitung Zakat Mal Dengan Cepat',
    icon: 'calculator-outline',
    route: null,
  },
  {
    id: 3,
    nama: 'Kajian Online',
    subtitle: 'Akses Kajian Dari Berbagai Sumber',
    icon: 'play-circle-outline',
    route: null,
  },
];

export default function LainnyaScreen() {
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
        <Text style={styles.headerTitle}>Lainnya</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons
            name="settings-outline"
            size={22}
            color={Colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.shortcutGrid}>
          {SHORTCUT_MENU.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.shortcutItem}
              onPress={() => item.route && router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <View style={styles.shortcutIconBox}>
                <Ionicons
                  name={item.icon as any}
                  size={26}
                  color={Colors.text.secondary}
                />
              </View>
              <Text style={styles.shortcutNama}>{item.nama}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.dividerLine} />

        <Text style={styles.sectionLabel}>LAINNYA</Text>

        <View style={styles.listContainer}>
          {LIST_MENU.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => item.route && router.push(item.route as any)}
                activeOpacity={0.7}
              >
                <View style={styles.listIconBox}>
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={Colors.text.secondary}
                  />
                </View>

                <View style={styles.listInfo}>
                  <Text style={styles.listNama}>{item.nama}</Text>
                  <Text style={styles.listSubtitle}>{item.subtitle}</Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={Colors.text.light}
                />
              </TouchableOpacity>

              {index < LIST_MENU.length - 1 && (
                <View style={styles.itemDivider} />
              )}
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
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
  settingsButton: {
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

  scrollContent: {
    paddingTop: 20,
  },

  shortcutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 20,
  },
  shortcutItem: {
    width: '22%',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  shortcutIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8EDF2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortcutNama: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.text.primary,
    textAlign: 'center',
  },

  dividerLine: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
    marginBottom: 16,
  },

  sectionLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.text.secondary,
    letterSpacing: 1,
    marginHorizontal: 16,
    marginBottom: 12,
  },

  listContainer: {
    marginHorizontal: 16,
    gap: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  listIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listInfo: {
    flex: 1,
  },
  listNama: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: Colors.text.primary,
  },
  listSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  itemDivider: {
    height: 0,
  },
});