import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorView({
  message = 'Terjadi Kesalahan',
  onRetry,
}: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Coba Lagi</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 24,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
});