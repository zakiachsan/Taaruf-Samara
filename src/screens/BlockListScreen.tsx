import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, UserX, Unlock } from 'lucide-react-native';
import { useBlockedUsers } from '../hooks/useMatches';

interface Props {
  onBack: () => void;
  onViewProfile?: (userId: string) => void;
}

export default function BlockListScreen({ onBack, onViewProfile }: Props) {
  const { blockedUsers, loading, refetch, unblockUser } = useBlockedUsers();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleUnblock = (userId: string, userName: string) => {
    Alert.alert(
      'Buka Blokir',
      `Buka blokir ${userName}? Mereka akan bisa melihat profil Anda lagi.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Buka Blokir',
          onPress: async () => {
            try {
              await unblockUser(userId);
              Alert.alert('Berhasil', 'Pengguna telah dibuka blokir');
            } catch (error: any) {
              Alert.alert('Gagal', error.message);
            }
          },
        },
      ]
    );
  };

  const getAvatarUrl = (item: any) => {
    if (item.blocked_profile?.photos && item.blocked_profile.photos.length > 0) {
      return item.blocked_profile.photos[0];
    }
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderItem = ({ item }: { item: any }) => {
    const avatarUrl = getAvatarUrl(item);
    const userName = item.blocked_profile?.full_name || 'Pengguna';

    return (
      <View style={styles.userItem}>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => onViewProfile?.(item.blocked_id)}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
            </View>
          )}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.blockedDate}>
              Diblokir {formatDate(item.created_at)}
            </Text>
            {item.reason && (
              <Text style={styles.reason} numberOfLines={1}>
                Alasan: {item.reason}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.unblockBtn}
          onPress={() => handleUnblock(item.blocked_id, userName)}
        >
          <Unlock size={18} color="#10B981" />
          <Text style={styles.unblockText}>Buka</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <UserX size={48} color="#D1D5DB" />
      </View>
      <Text style={styles.emptyTitle}>Tidak Ada yang Diblokir</Text>
      <Text style={styles.emptyText}>
        Pengguna yang Anda blokir akan muncul di sini
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

      {/* List */}
      {loading && blockedUsers.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : (
        <FlatList
          data={blockedUsers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={blockedUsers.length === 0 ? styles.emptyList : styles.listContent}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#10B981"
            />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
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
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyList: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
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
  },
  avatarPlaceholder: {
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  blockedDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  reason: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  unblockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  unblockText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
});
