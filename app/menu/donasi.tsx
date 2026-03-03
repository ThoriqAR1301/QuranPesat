import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Linking,
  Share,
  Image,
} from 'react-native';
import { router, Stack } from 'expo-router';
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
  green: '#27AE60',
};

const LEADERBOARD = [
  { id: 1, nama: 'Hamba Allah', jumlah: 'Rp 500.000', emoji: '🥇' },
  { id: 2, nama: 'Anonymous',   jumlah: 'Rp 250.000', emoji: '🥈' },
  { id: 3, nama: 'Barakallah',  jumlah: 'Rp 100.000', emoji: '🥉' },
];

const TARGET = 50000000;
const TERKUMPUL = 0;
const PERSEN = Math.min((TERKUMPUL / TARGET) * 100, 100);

const formatRupiah = (angka: number): string => {
  if (angka >= 1000000) {
    return `Rp${(angka / 1000000).toFixed(0)}.000.000`;
  }
  return `Rp${angka.toLocaleString('id-ID')}`;
};

export default function DonasiScreen() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          'Dukung Pengembangan Quran Pesat! Aplikasi Al-Quran Gratis Tanpa Iklan. Donasi Via Saweria: https://saweria.co/quranpesat',
        title: 'Dukung Quran Pesat',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleBukaSaweria = () => {
    Linking.openURL('https://saweria.co/quranpesat');
  };

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
        <Text style={styles.headerTitle}>Dukung Developer</Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Ionicons
            name="share-outline"
            size={22}
            color={Colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Milestone Dukungan</Text>
          <Text style={styles.cardSubtitle}>
            Quran Pesat Adalah Aplikasi Gratis Tanpa Iklan Yang Dibuat Dengan
            Penuh Cinta
          </Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressLabel}>
              <Text style={styles.progressTitle}>
                Bayar Server Dan Akomodasi
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${PERSEN}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {formatRupiah(TERKUMPUL)} / {formatRupiah(TARGET)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>DUKUNGAN VIA SAWERIA</Text>
        <View style={styles.card}>
          <Text style={styles.saweriaTitleText}>
            Scan QR Atau Buka Saweria
          </Text>
          <Text style={styles.saweriaSubtitle}>
            Semua Dukungan Akan Masuk Langsung Ke Halaman Saweria
          </Text>

          <View style={styles.qrContainer}>
            <Image source={require('@/assets/images/Sawer.png')} style={styles.qrImage} resizeMode="contain" />
          </View>

          <TouchableOpacity
            style={styles.saweriaButton}
            onPress={handleBukaSaweria}
            activeOpacity={0.8}
          >
            <Text style={styles.saweriaButtonText}>Buka Saweria</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Catatan Development & Transparansi
          </Text>
          <View style={styles.transparansiList}>
            {[
              'Ini Dukungan Untuk Developer, Bukan Penggalangan Donasi Lembaga',
              'Penyaluran Ke Pihak Lain Sepenuhnya Keputusan Pribadi Developer',
              'Dana Akan Digunakan Untuk Server, Domain, Dan Pengembangan Fitur',
              'Laporan Penggunaan Dana Akan Dibagikan Secara Berkala',
            ].map((item, index) => (
              <View key={index} style={styles.transparansiItem}>
                <Text style={styles.transparansiNomor}>
                  {index + 1}.
                </Text>
                <Text style={styles.transparansiText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Leaderboard Dukungan</Text>
          <Text style={styles.cardSubtitle}>
            Terima kasih Untuk Para Pendukung Teratas
          </Text>

          <View style={styles.leaderboardList}>
            {LEADERBOARD.map((item) => (
              <View key={item.id} style={styles.leaderboardItem}>
                <Text style={styles.leaderboardEmoji}>{item.emoji}</Text>
                <Text style={styles.leaderboardNama}>{item.nama}</Text>
                <Text style={styles.leaderboardJumlah}>
                  {item.jumlah}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.jadiPendukungButton}
            onPress={handleBukaSaweria}
            activeOpacity={0.8}
          >
            <Ionicons name="heart-outline" size={18} color={Colors.white} />
            <Text style={styles.jadiPendukungText}>
              Jadi Pendukung Pertama!
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Jazakallahu Khairan 🙏
          </Text>
          <Text style={styles.footerSubText}>
            Setiap Dukungan Sangat Berarti Bagi Kami
          </Text>
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
  shareButton: {
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
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },

  sectionLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.text.secondary,
    letterSpacing: 1,
    marginTop: 4,
    marginLeft: 4,
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    gap: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  cardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: Colors.text.primary,
  },
  cardSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 20,
  },

  progressContainer: {
    gap: 8,
    marginTop: 4,
  },
  progressLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: Colors.text.primary,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: Colors.background,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 5,
    minWidth: 4,
  },
  progressText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: Colors.text.primary,
    textAlign: 'center',
  },

  saweriaTitleText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: Colors.text.primary,
  },
  saweriaSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.text.secondary,
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  qrImage: {
    width: 220,
    height: 220,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.background,
  },
  qrText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.light,
  },
  saweriaButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saweriaButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: Colors.white,
  },

  transparansiList: {
    gap: 8,
    marginTop: 4,
  },
  transparansiItem: {
    flexDirection: 'row',
    gap: 8,
  },
  transparansiNomor: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: Colors.text.secondary,
    minWidth: 16,
  },
  transparansiText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },

  leaderboardList: {
    gap: 10,
    marginTop: 4,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  leaderboardEmoji: {
    fontSize: 24,
  },
  leaderboardNama: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
  },
  leaderboardJumlah: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: Colors.primary,
  },
  jadiPendukungButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 4,
  },
  jadiPendukungText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.white,
  },

  footer: {
    alignItems: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  footerText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.text.primary,
  },
  footerSubText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
});