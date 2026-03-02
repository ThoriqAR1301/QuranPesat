import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';

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
  userBubble: '#5B7FA6',
  aiBubble: '#FFFFFF',
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const CONTOH_PERTANYAAN = [
  'Apa Amalan Terbaik Setelah Shalat Wajib?',
  'Jelaskan Perbedaan Zakat Fitrah Dan Zakat Mal',
  'Doa Ketika Merasa Gelisah',
  'Apa Keutamaan Membaca Al-Quran?',
];

const formatWaktu = (date: Date): string => {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function AIScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content:
        'Assalamualaikum! Saya Siap Bantu Pertanyaan Seputar Islam : Al-Quran, Hadits, Fiqh, Doa, Dan Sejarah Islam.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async (text?: string) => {
    const messageText = text ?? input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const response = await fetch(
        'https://api.together.xyz/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer tgp_v1_vDjlv1dhu0ls34rsWmxNOGm36_eMCmdEWc723uYn9RU`,
          },
          body: JSON.stringify({
            model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
            messages: [
              {
                role: 'system',
                content: `Kamu Adalah Asisten Islami AI Yang Bernama "Asisten Islam". 
                Kamu Hanya Menjawab Pertanyaan Seputar Islam Seperti :
                Al-Quran, Hadits, Fiqh, Doa, Dzikir, Sejarah Islam, Dan Topik Keislaman Lainnya.
                Jawab Dengan Bahasa Indonesia Yang Sopan, Ramah, Dan Mudah Dipahami.
                Jika Pertanyaan Di Luar Topik Islam, Tolak Dengan Sopan Dan Arahkan Ke Topik Islam.
                Gunakan Dalil Al-Quran Atau Hadits Jika Relevan.`,
              },
              ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
              {
                role: 'user',
                content: messageText,
              },
            ],
            max_tokens: 1024,
            temperature: 0.7,
          }),
        }
      );

      const data = await response.json();
      const aiReply =
        data.choices?.[0]?.message?.content ??
        'Maaf, Saya Tidak Dapat Memproses Pertanyaan Kamu Saat Ini';

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiReply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'Maaf, Terjadi Kesalahan Koneksi. Periksa Internet Kamu Dan Coba Lagi',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';

    return (
      <View
        style={[
          styles.messageRow,
          isUser ? styles.messageRowUser : styles.messageRowAI,
        ]}
      >
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={16} color={Colors.white} />
          </View>
        )}

        <View
          style={[
            styles.bubble,
            isUser ? styles.bubbleUser : styles.bubbleAI,
          ]}
        >
          <Text
            style={[
              styles.bubbleText,
              isUser ? styles.bubbleTextUser : styles.bubbleTextAI,
            ]}
          >
            {item.content}
          </Text>
          <Text
            style={[
              styles.bubbleTime,
              isUser ? styles.bubbleTimeUser : styles.bubbleTimeAI,
            ]}
          >
            {formatWaktu(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.contohContainer}>
      <Text style={styles.contohLabel}>Contoh Pertanyaan</Text>
      {CONTOH_PERTANYAAN.map((q, index) => (
        <TouchableOpacity
          key={index}
          style={styles.contohItem}
          onPress={() => handleSend(q)}
          activeOpacity={0.7}
        >
          <Text style={styles.contohText}>{q}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAvatar}>
            <Ionicons name="sparkles" size={20} color={Colors.white} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Asisten Islami AI</Text>
            <Text style={styles.headerSubtitle}>
              Siap Bantu Seputar Islam
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() =>
            setMessages([
              {
                id: '0',
                role: 'assistant',
                content:
                  'Assalamualaikum! Saya Siap Bantu Pertanyaan Seputar Islam : Al-Quran, Hadits, Fiqh, Doa, dan Sejarah Islam.',
                timestamp: new Date(),
              },
            ])
          }
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={Colors.text.secondary}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        ListHeaderComponent={messages.length <= 1 ? renderHeader : null}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {isLoading && (
        <View style={styles.loadingRow}>
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={16} color={Colors.white} />
          </View>
          <View style={styles.loadingBubble}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.loadingText}>Sedang Menjawab...</Text>
          </View>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tanyakan Seputar Islam..."
          placeholderTextColor={Colors.text.light}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
          onSubmitEditing={() => handleSend()}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!input.trim() || isLoading) && styles.sendButtonDisabled,
          ]}
          onPress={() => handleSend()}
          disabled={!input.trim() || isLoading}
        >
          <Ionicons
            name="send"
            size={18}
            color={
              !input.trim() || isLoading
                ? Colors.text.light
                : Colors.white
            }
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  clearButton: {
    padding: 8,
  },

  chatContent: {
    padding: 16,
    paddingBottom: 8,
    gap: 12,
  },

  contohContainer: {
    marginBottom: 16,
    gap: 8,
  },
  contohLabel: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  contohItem: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contohText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.text.primary,
  },

  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAI: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  bubbleUser: {
    backgroundColor: Colors.userBubble,
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: Colors.aiBubble,
    borderBottomLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  bubbleText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 22,
  },
  bubbleTextUser: {
    color: Colors.white,
  },
  bubbleTextAI: {
    color: Colors.text.primary,
  },
  bubbleTime: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  bubbleTimeUser: {
    color: 'rgba(255,255,255,0.65)',
  },
  bubbleTimeAI: {
    color: Colors.text.light,
  },

  loadingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
    elevation: 1,
  },
  loadingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: Colors.text.secondary,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text.primary,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.border,
  },
});