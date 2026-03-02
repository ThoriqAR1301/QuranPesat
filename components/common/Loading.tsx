import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = 'Memuat Data...' }: LoadingProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: 'Poppins-Regular',
  },
});