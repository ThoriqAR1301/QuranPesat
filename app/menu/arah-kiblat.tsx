import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Animated,
  Easing,
  ImageBackground,
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

  const getInstruksi = (): string => {
    if (selisihArah() < 5) return 'Menghadap Kiblat! 🕋';
    let diff = arahKiblat - kompas;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    if (diff > 0) return `Putar ke kanan ${Math.round(Math.abs(diff))}°`;
    return `Putar ke kiri ${Math.round(Math.abs(diff))}°`;
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
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <ImageBackground
        source={require('@/assets/images/Kabah.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Arah Kiblat</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons
              name="ellipsis-vertical"
              size={22}
              color={Colors.text.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.lokasiContainer}>
          <View style={styles.lokasiRow}>
            <Ionicons
              name="location-outline"
              size={18}
              color={Colors.text.primary}
            />
            <Text style={styles.lokasiKota}>
              {lokasi?.kota}, Indonesia
            </Text>
          </View>
          <Text style={styles.instruksiText}>{getInstruksi()}</Text>
        </View>

        <View style={styles.kompasArea}>
          <View style={styles.kompasWrapper}>

            <View style={styles.tengahPutih} />

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
                styles.jarumKiblatContainer,
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
              <View style={styles.jarumKiblat} />
            </Animated.View>

          </View>
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.kameraButton}
            activeOpacity={0.85}
          >
            <Text style={styles.kameraButtonText}>
              Tentukan Kiblat Pakai Kamera
            </Text>
          </TouchableOpacity>

          <Text style={styles.tipsText}>
            Jauhkan Ponsel Dari Benda Logam Agar Kompas Stabil
          </Text>
        </View>
      </ImageBackground>
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

  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(220, 225, 230, 0.55)',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
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

  lokasiContainer: {
    alignItems: 'center',
    paddingTop: 16,
    gap: 6,
  },
  lokasiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lokasiKota: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.text.primary,
  },
  instruksiText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.primary,
  },

  kompasArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kompasWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tengahPutih: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.white,
    borderWidth: 3,
    borderColor: Colors.white,
    zIndex: 10,
    elevation: 10,
  },
  jarumContainer: {
    position: 'absolute',
    width: 10,
    height: 180,
    alignItems: 'center',
    zIndex: 5,
  },
  jarumAtas: {
    width: 10,
    height: 90,
    backgroundColor: Colors.red,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  jarumBawah: {
    width: 10,
    height: 90,
    backgroundColor: '#3A5FD9',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  jarumKiblatContainer: {
    position: 'absolute',
    width: 140,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  jarumKiblat: {
    width: 140,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 4,
  },

  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
    alignItems: 'center',
  },
  kameraButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  kameraButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: Colors.white,
  },
  tipsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
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