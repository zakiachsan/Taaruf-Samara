import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Shield, UserX, Unlock, Search, Ban } from 'lucide-react-native';

interface BlockedUser {
  id: string;
  name: string;
  age: number;
  location: string;
  photo: string;
  blockedAt: string;
  reason?: string;
}

const MOCK_BLOCKED_USERS: BlockedUser[] = [
  {
    id: '1',
    name: 'Budi Santoso',
    age: 29,
    location: 'Jakarta',
    photo: 'https://via.placeholder.com/100',
    blockedAt: '2 hari lalu',
    reason: 'Perilaku tidak sopan',
  },
  {
    id: '2',
    name: 'Dewi Kartika',
    age: 26,
    location: 'Malang',
    photo: 'https://via.placeholder.com/100',
    blockedAt: '1 minggu lalu',
  },
  {
    id: '3',
    name: 'Rina Susanti',
    age: 27,
    location: 'Surabaya',
    photo: 'https://via.placeholder.com/100',
    blockedAt: '2 minggu lalu',
    reason: 'Spam pesan',
  },
];

interface Props {
  onBack: () => void;
  onViewProfile: (userId: string) => void;
}

export default function BlockListScreen({ onBack, onViewProfile }: Props) {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>(MOCK_BLOCKED_USERS);

  const handleUnblock = (user: BlockedUser) => {
    Alert.alert(
      'Buka Blokir',
      `Anda yakin ingin membuka blokir ${user.name}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Buka Blokir',
          onPress: () => {
            setBlockedUsers(blockedUsers.filter((u) => u.id !== user.id));
            Alert.alert('Berhasil', `${user.name} telah dihapus dari daftar blokir`);
          },
        },
      ]
    );
  };

  const handleBlockReason = (reason?: string) => {
    if (!reason) return null;
    return (
      <View style={styles.reasonBadge}>
        <Text style={styles.reasonText}>{reason}</Text>
      </View>
    );
  };

  const renderBlockedUser = ({ item }: { item: BlockedUser }) => (
    <View style={styles.userCard}>
      <TouchableOpacity
        style={styles.userInfo}
        onPress={() => onViewProfile(item.id)}
      >
        <Image source={{ uri: item.photo }} style={styles.avatar} />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>
            {item.name}, {item.age}
          </Text>
          <Text style={styles.userLocation}>{item.location}</Text>
          {handleBlockReason(item.reason)}
          <Text style={styles.blockedAt}>Diblokir {item.blockedAt}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.unblockBtn}
        onPress={() => handleUnblock(item)}
      >
        <Unlock size={18} color="#10B981" />
        <Text style={styles.unblockText}>Buka</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Shield size={48} color="#10B981" />
      </View>
      <Text style={styles.emptyTitle}>Tidak Ada Blokiran</Text>
      <Text style={styles.emptyText}>
        Anda belum memblokir pengguna apapun.{'\n'}
        Daftar blokir akan muncul di sini.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ChevronLeft size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daftar Blokir</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <UserX size={24} color="#6B7280" />
        <Text style={styles.infoText}>
          Pengguna yang Anda blokir tidak akan bisa melihat profil Anda atau
          mengirim pesan.
        </Text>
      </View>

      {/* Blocked Users List */}
      {blockedUsers.length > 0 ? (
        <FlatList
          data={blockedUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderBlockedUser}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}

      {/* Block Count */}
      {blockedUsers.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {blockedUsers.length} pengguna diblokir
          </Text>
        </View>
      )}
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
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6B7280',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  userLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  reasonBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 11,
    color: '#991B1B',
    fontWeight: '500',
  },
  blockedAt: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  unblockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  unblockText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
