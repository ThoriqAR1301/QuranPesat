import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

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
  danger: '#DC3545',
};

interface MenuItemProps {
  icon: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showArrow?: boolean;
}

function MenuItem({
  icon,
  iconColor = Colors.primary,
  title,
  subtitle,
  onPress,
  rightElement,
  showArrow = true,
}: MenuItemProps) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.menuIconBox, { backgroundColor: iconColor + '18' }]}>
        <Ionicons name={icon as any} size={20} color={iconColor} />
      </View>

      <View style={styles.menuTextBox}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && (
          <Text style={styles.menuSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {rightElement ? (
        rightElement
      ) : showArrow ? (
        <Ionicons
          name="chevron-forward"
          size={16}
          color={Colors.text.light}
        />
      ) : null}
    </TouchableOpacity>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <Text style={styles.sectionLabel}>{label}</Text>
  );
}

export default function PengaturanScreen() {
  const [modeMalam, setModeMalam] = useState(false);
  const [notifikasi, setNotifikasi] = useState(true);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pengaturan</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <View style={styles.card}>
          <View style={styles.akunContainer}>
            <View style={styles.akunAvatar}>
              <Ionicons name="person-outline" size={28} color={Colors.text.light} />
            </View>

            {/* Info */}
            <View style={styles.akunInfo}>
              <Text style={styles.akunNama}>Masuk Akun</Text>
              <Text style={styles.akunStatus}>
                Sync Bookmark & Progress
              </Text>
              <View style={styles.devBadge}>
                <Text style={styles.devBadgeText}>DEVELOP</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.masukButton}>
              <Ionicons name="log-in-outline" size={16} color={Colors.white} />
              <Text style={styles.masukButtonText}>Masuk</Text>
            </TouchableOpacity>
          </View>
        </View>

        <SectionLabel label="NOTIFIKASI" />
        <View style={styles.card}>
          <MenuItem
            icon="notifications-outline"
            title="Pengaturan Notifikasi"
            subtitle="Atur Notifikasi Yang Kamu Inginkan"
            showArrow={false}
            rightElement={
              <Switch
                value={notifikasi}
                onValueChange={setNotifikasi}
                trackColor={{
                  false: Colors.border,
                  true: Colors.primary,
                }}
                thumbColor={Colors.white}
              />
            }
          />
        </View>

        <SectionLabel label="TAMPILAN" />
        <View style={styles.card}>
          <MenuItem
            icon="moon-outline"
            title="Mode Gelap"
            subtitle="Gunakan Tampilan Gelap Di Malam Hari"
            showArrow={false}
            rightElement={
              <Switch
                value={modeMalam}
                onValueChange={setModeMalam}
                trackColor={{
                  false: Colors.border,
                  true: Colors.primary,
                }}
                thumbColor={Colors.white}
              />
            }
          />
          <View style={styles.divider} />
          <MenuItem
            icon="text-outline"
            title="Ukuran Font Arab"
            subtitle="Sedang"
            onPress={() => {}}
          />
        </View>

        <SectionLabel label="DUKUNGAN" />
        <View style={styles.card}>
          <MenuItem
            icon="heart-outline"
            iconColor="#E74C3C"
            title="Dukung Developer"
            subtitle="Bantu Kami Mengembangkan & Terus Berinovasi"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <MenuItem
            icon="star-outline"
            iconColor={Colors.accent}
            title="Beri Rating"
            subtitle="Bantu Kami Dengan Memberikan Rating"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <MenuItem
            icon="share-social-outline"
            iconColor="#27AE60"
            title="Bagikan Aplikasi"
            subtitle="Ajak Temanmu Untuk Menggunakan Aplikasi Ini"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <MenuItem
            icon="mail-outline"
            iconColor={Colors.primary}
            title="Kirim Feedback"
            subtitle="Sampaikan Saran Dan Masukan Kamu"
            onPress={() => {}}
          />
        </View>

        <SectionLabel label="INFORMASI" />
        <View style={styles.card}>
          <MenuItem
            icon="shield-checkmark-outline"
            iconColor={Colors.primary}
            title="Kebijakan Privasi"
            subtitle="Baca Kebijakan Privasi Kami"
            onPress={() => Linking.openURL('https://quranpesat.com/privacy')}
          />
          <View style={styles.divider} />
          <MenuItem
            icon="document-text-outline"
            iconColor={Colors.primary}
            title="Syarat & Ketentuan"
            subtitle="Baca Syarat Dan Ketentuan Penggunaan"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <MenuItem
            icon="information-circle-outline"
            iconColor={Colors.primary}
            title="Tentang Aplikasi"
            subtitle="Quran Pesat v1.0.0"
            onPress={() => {}}
          />
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
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 12,
  },
  headerTitle: {
    color: Colors.text.primary,
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  sectionLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: Colors.text.light,
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 6,
    marginLeft: 4,
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },

  akunContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  akunAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  akunInfo: {
    flex: 1,
    gap: 2,
  },
  akunNama: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: Colors.text.primary,
  },
  akunStatus: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  devBadge: {
    backgroundColor: Colors.accent + '25',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  devBadgeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    color: Colors.accent,
    letterSpacing: 0.5,
  },
  masukButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  masukButtonText: {
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextBox: {
    flex: 1,
  },
  menuTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text.primary,
  },
  menuSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 1,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 66,
  },
});