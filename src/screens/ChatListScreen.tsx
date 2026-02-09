import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search, MoreVertical } from 'lucide-react-native';

interface ChatPreview {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

const MOCK_CHATS: ChatPreview[] = [
  {
    id: '1',
    name: 'Sarah Amalia',
    avatar: 'https://via.placeholder.com/100',
    lastMessage: 'Assalamualaikum, saya tertarik untuk berkenalan...',
    timestamp: '10:30',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Fatimah Zahra',
    avatar: 'https://via.placeholder.com/100',
    lastMessage: 'Terima kasih, saya akan mempertimbangkannya',
    timestamp: 'Kemarin',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '3',
    name: 'Aisyah Putri',
    avatar: 'https://via.placeholder.com/100',
    lastMessage: 'Boleh saya tahu lebih banyak tentang...',
    timestamp: 'Kemarin',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: '4',
    name: 'Dewi Kartika',
    avatar: 'https://via.placeholder.com/100',
    lastMessage: 'Walaikumsalam, alhamdulillah baik',
    timestamp: 'Sen',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '5',
    name: 'Rina Susanti',
    avatar: 'https://via.placeholder.com/100',
    lastMessage: 'Terima kasih atas waktunya',
    timestamp: 'Minggu',
    unreadCount: 0,
    isOnline: false,
  },
];

interface Props {
  onChatPress: (chatId: string) => void;
}

export default function ChatListScreen({ onChatPress }: Props) {
  const renderChatItem = ({ item }: { item: ChatPreview }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => onChatPress(item.id)}
    >
      {/* Avatar with online status */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      {/* Chat Info */}
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <View style={styles.chatPreview}>
          <Text 
            style={[styles.lastMessage, item.unreadCount > 0 && styles.unreadMessage]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pesan</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Search size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Chat List */}
      <FlatList
        data={MOCK_CHATS}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Belum ada pesan</Text>
            <Text style={styles.emptySubtext}>
              Mulai berkenalan dengan calon pasangan Anda
            </Text>
          </View>
        }
      />
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
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  searchBtn: {
    padding: 8,
  },
  chatList: {
    paddingVertical: 8,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  timestamp: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  chatPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  unreadMessage: {
    color: '#111827',
    fontWeight: '500',
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
