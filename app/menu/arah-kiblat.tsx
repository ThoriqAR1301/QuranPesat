import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';

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
  red: '#E74C3C',
};

const KABAH = { lat: 21.4225, lng: 39.8262 };

const hitungArahKiblat = (lat: number, lng: number): number => {
  const latRad = (lat * Math.PI) / 180;
  const lngDiff = ((KABAH.lng - lng) * Math.PI) / 180;
  const kabahLat = (KABAH.lat * Math.PI) / 180;

  const y = Math.sin(lngDiff);
  const x =
    Math.cos(latRad) * Math.tan(kabahLat) -
    Math.sin(latRad) * Math.cos(lngDiff);

  const arah = (Math.atan2(y, x) * 180) / Math.PI;
  return (arah + 360) % 360;
};

export default function ArahKiblatScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lokasi, setLokasi] = useState<{
    lat: number;
    lng: number;
    kota: string;
  } | null>(null);
  const [arahKiblat, setArahKiblat] = useState(0);
  const [kompas, setKompas] = useState(0);
  const [akurasi, setAkurasi] = useState<'baik' | 'sedang' | 'buruk'>('sedang');

  const rotasiKompas = useRef(new Animated.Value(0)).current;
  const rotasiKiblat = useRef(new Animated.Value(0)).current;
  const prevKompas = useRef(0);
  const prevKiblat = useRef(0);

  const animasiRotasi = (
    animated: Animated.Value,
    prev: React.MutableRefObject<number>,
    target: number
  ) => {
    let diff = target - prev.current;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    const newValue = prev.current + diff;
    prev.current = newValue;

    Animated.timing(animated, {
      toValue: newValue,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const initLokasi = async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Izin Lokasi Diperlukan Untuk Menentukan Arah Kiblat');
        setLoading(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = position.coords;

      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const kota =
        geocode[0]?.city ||
        geocode[0]?.district ||
        geocode[0]?.region ||
        'Lokasi Kamu';

      setLokasi({ lat: latitude, lng: longitude, kota });

      const arah = hitungArahKiblat(latitude, longitude);
      setArahKiblat(arah);
      setLoading(false);
    } catch (err) {
      setError('Gagal Mendapatkan Lokasi. Pastikan GPS Aktif');
      setLoading(false);
    }
  };

  useEffect(() => {
    initLokasi();
  }, []);

  useEffect(() => {
    let subscription: any;

    const startMagnetometer = async () => {
      const isAvailable = await Magnetometer.isAvailableAsync();
      if (!isAvailable) {
        setAkurasi('buruk');
        return;
      }

      Magnetometer.setUpdateInterval(100);
      subscription = Magnetometer.addListener((data) => {
        const { x, y } = data;
        let angle = Math.atan2(y, x) * (180 / Math.PI);
        angle = (angle + 360) % 360;

        setKompas(angle);
        setAkurasi('baik');
        animasiRotasi(rotasiKompas, prevKompas, -angle);
      });
    };

    startMagnetometer();
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (lokasi) {
      animasiRotasi(rotasiKiblat, prevKiblat, arahKiblat - kompas);
    }
  }, [kompas, arahKiblat]);

  const selisihArah = (): number => {
    let diff = arahKiblat - kompas;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return Math.abs(diff);
  };

  const isKiblat = selisihArah() < 5;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Mencari Lokasi Kamu...</Text>
        <Text style={styles.loadingSubText}>
          Pastikan GPS Aktif Dan Izin Lokasi Diberikan
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <Text style={styles.errorIcon}>📍</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={initLokasi}>
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
        <Text style={styles.headerTitle}>Arah Kiblat</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={initLokasi}
        >
          <Ionicons
            name="refresh-outline"
            size={22}
            color={Colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>

        <View style={styles.lokasiCard}>
          <View style={styles.lokasiIconBox}>
            <Ionicons
              name="location"
              size={20}
              color={Colors.primary}
            />
          </View>
          <View style={styles.lokasiInfo}>
            <Text style={styles.lokasiKota}>{lokasi?.kota}</Text>
            <Text style={styles.lokasiKoord}>
              {lokasi?.lat.toFixed(4)}°, {lokasi?.lng.toFixed(4)}°
            </Text>
          </View>
          <View
            style={[
              styles.akurasiBadge,
              {
                backgroundColor:
                  akurasi === 'baik'
                    ? Colors.green + '22'
                    : akurasi === 'sedang'
                    ? Colors.accent + '22'
                    : Colors.red + '22',
              },
            ]}
          >
            <Text
              style={[
                styles.akurasiText,
                {
                  color:
                    akurasi === 'baik'
                      ? Colors.green
                      : akurasi === 'sedang'
                      ? Colors.accent
                      : Colors.red,
                },
              ]}
            >
              {akurasi === 'baik'
                ? '● Akurasi Baik'
                : akurasi === 'sedang'
                ? '● Sedang'
                : '● Buruk'}
            </Text>
          </View>
        </View>

        <View style={styles.kompasContainer}>

          <View
            style={[
              styles.statusKiblat,
              { backgroundColor: isKiblat ? Colors.green + '18' : Colors.primary + '12' },
            ]}
          >
            <Text style={styles.statusKiblatEmoji}>
              {isKiblat ? '🕋' : '🧭'}
            </Text>
            <Text
              style={[
                styles.statusKiblatText,
                { color: isKiblat ? Colors.green : Colors.primary },
              ]}
            >
              {isKiblat
                ? 'Menghadap Kiblat!'
                : `Putar ${Math.round(selisihArah())}° Lagi`}
            </Text>
          </View>

          <View style={styles.kompasWrapper}>
            <View style={styles.kompasRing}>
              {['U', 'T', 'S', 'B'].map((arah, i) => (
                <View
                  key={arah}
                  style={[
                    styles.arahLabel,
                    {
                      top: i === 0 ? 8 : i === 2 ? undefined : '42%',
                      bottom: i === 2 ? 8 : undefined,
                      left: i === 3 ? 8 : i === 0 || i === 2 ? '44%' : undefined,
                      right: i === 1 ? 8 : undefined,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.arahText,
                      i === 0 && { color: Colors.red },
                    ]}
                  >
                    {arah}
                  </Text>
                </View>
              ))}

              <Animated.View
                style={[
                  styles.jarumContainer,
                  {
                    transform: [
                      {
                        rotate: rotasiKompas.interpolate({
                          inputRange: [-360, 360],
                          outputRange: ['-360deg', '360deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.jarumAtas} />
                <View style={styles.jarumBawah} />
              </Animated.View>

              <Animated.View
                style={[
                  styles.kiblatContainer,
                  {
                    transform: [
                      {
                        rotate: rotasiKiblat.interpolate({
                          inputRange: [-360, 360],
                          outputRange: ['-360deg', '360deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.kiblatArrow}>
                  <Ionicons
                    name="navigate"
                    size={32}
                    color={isKiblat ? Colors.green : Colors.accent}
                  />
                </View>
              </Animated.View>

              <View style={styles.tengah} />
            </View>
          </View>

          <View style={styles.derajatRow}>
            <View style={styles.derajatItem}>
              <Text style={styles.derajatLabel}>Arah Kiblat</Text>
              <Text style={styles.derajatValue}>
                {Math.round(arahKiblat)}°
              </Text>
            </View>
            <View style={styles.derajatDivider} />
            <View style={styles.derajatItem}>
              <Text style={styles.derajatLabel}>Kompas</Text>
              <Text style={styles.derajatValue}>
                {Math.round(kompas)}°
              </Text>
            </View>
            <View style={styles.derajatDivider} />
            <View style={styles.derajatItem}>
              <Text style={styles.derajatLabel}>Selisih</Text>
              <Text
                style={[
                  styles.derajatValue,
                  { color: isKiblat ? Colors.green : Colors.primary },
                ]}
              >
                {Math.round(selisihArah())}°
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.tipsCard}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={Colors.primary}
          />
          <Text style={styles.tipsText}>
            Jauhkan Dari Benda Logam. Panah Emas Menunjukkan Arah Kiblat.
            Putar Badan Hingga Panah Mengarah Ke Atas
          </Text>
        </View>
      </View>
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

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16,
  },

  lokasiCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  lokasiIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '18',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lokasiInfo: {
    flex: 1,
  },
  lokasiKota: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.text.primary,
  },
  lokasiKoord: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.text.light,
  },
  akurasiBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  akurasiText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
  },

  kompasContainer: {
    alignItems: 'center',
    gap: 16,
  },
  statusKiblat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },
  statusKiblatEmoji: {
    fontSize: 20,
  },
  statusKiblatText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
  kompasWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  kompasRing: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: Colors.white,
    borderWidth: 3,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  arahLabel: {
    position: 'absolute',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arahText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  jarumContainer: {
    position: 'absolute',
    width: 8,
    height: 160,
    alignItems: 'center',
  },
  jarumAtas: {
    width: 8,
    height: 80,
    backgroundColor: Colors.red,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  jarumBawah: {
    width: 8,
    height: 80,
    backgroundColor: Colors.text.light,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  kiblatContainer: {
    position: 'absolute',
    width: 40,
    height: 160,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  kiblatArrow: {
    marginTop: -4,
  },
  tengah: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.text.primary,
  },

  derajatRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    width: '100%',
  },
  derajatItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  derajatDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  derajatLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: Colors.text.light,
  },
  derajatValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: Colors.text.primary,
  },

  tipsCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.primary + '12',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  tipsText: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 18,
  },

  loadingText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  loadingSubText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.text.secondary,
    textAlign: 'center',
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
});