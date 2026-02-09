import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  ChevronLeft,
  MoreVertical,
  Send,
  Phone,
  Shield,
  Info,
} from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
  type: 'text' | 'introduction';
}

interface Props {
  chatId: string;
  onBack: () => void;
  onViewProfile: () => void;
}

// Mock Messages
const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Assalamualaikum wr. wb.\n\nPerkenalkan, saya Ahmad Fauzi, 28 tahun, bekerja sebagai software engineer di Jakarta. Saya menemukan profil Anda di aplikasi ini dan tertarik untuk berkenalan dengan niat taaruf.\n\nMohon maaf mengganggu waktunya. Jika berkenan, saya ingin mengenal Anda lebih jauh.\n\nWassalamualaikum wr. wb.',
    sender: 'them',
    timestamp: '10:30',
    type: 'introduction',
  },
  {
    id: '2',
    text: 'Waalaikumsalam wr. wb.\n\nTerima kasih telah menghubungi saya. Saya tertarik untuk berkenalan juga. Boleh ceritakan lebih banyak tentang diri Anda dan keluarga?',
    sender: 'me',
    timestamp: '10:45',
    type: 'text',
  },
  {
    id: '3',
    text: 'Alhamdulillah, terima kasih atas responnya. Saya anak kedua dari 3 bersaudara. Ayah saya pensiunan PNS dan ibu saya ibu rumah tangga. Saya lulusan Teknik Informatika ITB dan saat ini bekerja di perusahaan startup.',
    sender: 'them',
    timestamp: '11:00',
    type: 'text',
  },
];

const INTRODUCTION_TEMPLATES = [
  {
    id: 'formal',
    label: 'Formal',
    text: 'Assalamualaikum wr. wb.\n\nPerkenalkan, saya [Nama], [Umur] tahun. Saya menemukan profil Anda dan tertarik untuk berkenalan dengan niat taaruf. Mohon maaf mengganggu waktunya.\n\nWassalamualaikum wr. wb.',
  },
  {
    id: 'simple',
    label: 'Sederhana',
    text: 'Assalamualaikum, perkenalkan saya [Nama]. Saya ingin berkenalan dengan Anda. Terima kasih.',
  },
  {
    id: 'detailed',
    label: 'Detail',
    text: 'Assalamualaikum wr. wb.\n\nPerkenalkan, saya [Nama], [Umur] tahun, bekerja sebagai [Pekerjaan] di [Kota]. Saya menemukan profil Anda dan tertarik untuk berkenalan lebih jauh dengan niat baik.\n\nMohon maaf mengganggu waktunya. Semoga Allah memberkahi langkah kita.\n\nWassalamualaikum wr. wb.',
  },
];

export default function ChatRoomScreen({ chatId, onBack, onViewProfile }: Props) {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Scroll to bottom on mount
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, []);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'me',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    setShowTemplates(false);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const useTemplate = (templateText: string) => {
    setInputText(templateText);
    setShowTemplates(false);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender === 'me';

    return (
      <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.theirMessage]}>
        {item.type === 'introduction' && !isMe && (
          <View style={styles.introductionBadge}>
            <Shield size={14} color="#10B981" />
            <Text style={styles.introductionText}>Pesan Perkenalan</Text>
          </View>
        )}
        <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.theirBubble]}>
          <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
            {item.text}
          </Text>
        </View>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ChevronLeft size={28} color="#111827" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.profileInfo} onPress={onViewProfile}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.headerAvatar}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.headerName}>Sarah Amalia</Text>
            <Text style={styles.onlineStatus}>Online</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moreBtn}>
          <MoreVertical size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Safety Notice */}
      <View style={styles.safetyNotice}>
        <Shield size={16} color="#6B7280" />
        <Text style={styles.safetyText}>
          Jaga kesopanan dalam berkomunikasi. Laporkan jika ada pelanggaran.
        </Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Templates */}
      {showTemplates && (
        <View style={styles.templatesContainer}>
          <View style={styles.templatesHeader}>
            <Text style={styles.templatesTitle}>Template Pesan Perkenalan</Text>
            <TouchableOpacity onPress={() => setShowTemplates(false)}>
              <Text style={styles.closeTemplates}>Tutup</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.templateList}>
            {INTRODUCTION_TEMPLATES.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={styles.templateItem}
                onPress={() => useTemplate(template.text)}
              >
                <Text style={styles.templateLabel}>{template.label}</Text>
                <Text style={styles.templatePreview} numberOfLines={2}>
                  {template.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          {/* Introduction Button */}
          {!showTemplates && messages.length < 2 && (
            <TouchableOpacity
              style={styles.introBtn}
              onPress={() => setShowTemplates(true)}
            >
              <Shield size={18} color="#10B981" />
              <Text style={styles.introBtnText}>Template</Text>
            </TouchableOpacity>
          )}

          <TextInput
            style={styles.input}
            placeholder="Ketik pesan..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />

          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Send size={20} color={inputText.trim() ? '#FFFFFF' : '#9CA3AF'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    padding: 4,
  },
  profileInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  nameContainer: {
    marginLeft: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  onlineStatus: {
    fontSize: 13,
    color: '#10B981',
  },
  moreBtn: {
    padding: 4,
  },
  safetyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  safetyText: {
    fontSize: 12,
    color: '#6B7280',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '85%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  introductionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  introductionText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '500',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '100%',
  },
  myBubble: {
    backgroundColor: '#10B981',
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  theirMessageText: {
    color: '#111827',
  },
  timestamp: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  templatesContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    maxHeight: 250,
  },
  templatesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  templatesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  closeTemplates: {
    fontSize: 14,
    color: '#6B7280',
  },
  templateList: {
    padding: 12,
  },
  templateItem: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  templateLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 4,
  },
  templatePreview: {
    fontSize: 13,
    color: '#6B7280',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  introBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  introBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  input: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 10,
    maxHeight: 100,
    fontSize: 15,
    color: '#111827',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#F3F4F6',
  },
});
