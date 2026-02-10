import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  Settings,
  Edit2,
  Camera,
  MapPin,
  Briefcase,
  GraduationCap,
  BookOpen,
  Star,
  Crown,
  Gift,
  Shield,
  ChevronRight,
  LogOut,
  Lock,
  Bell,
  HelpCircle,
  FileText,
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';

interface Props {
  onNavigate?: (screen: string, params?: any) => void;
}

export default function ProfileScreen({ onNavigate }: Props) {
  const { user, signOut } = useAuth();
  const { profile, loading, refetch } = useProfile();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Keluar',
      'Anda yakin ingin keluar dari akun?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            try {
              await signOut();
            } catch (error: any) {
              Alert.alert('Gagal', error.message);
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const getPhotoUrl = () => {
    if (profile?.photos && profile.photos.length > 0) {
      return profile.photos[0];
    }
    return null;
  };

  const getSubscriptionBadge = () => {
    const sub = user?.subscription;
    if (!sub || sub.status !== 'active') return null;
    
    if (sub.plan_type === 'premium') {
      return { label: 'Premium', color: '#F59E0B', icon: Crown };
    }
    return { label: 'Basic', color: '#10B981', icon: Star };
  };

  const subscriptionBadge = getSubscriptionBadge();
  const photoUrl = getPhotoUrl();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil Saya</Text>
        <TouchableOpacity 
          style={styles.settingsBtn}
          onPress={() => onNavigate?.('Settings')}
        >
          <Settings size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Photo */}
          <View style={styles.photoContainer}>
            {photoUrl ? (
              <Image source={{ uri: photoUrl }} style={styles.profilePhoto} />
            ) : (
              <View style={[styles.profilePhoto, styles.photoPlaceholder]}>
                <Camera size={32} color="#9CA3AF" />
              </View>
            )}
            <TouchableOpacity 
              style={styles.editPhotoBtn}
              onPress={() => onNavigate?.('EditPhotos')}
            >
              <Camera size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Name & Info */}
          <Text style={styles.name}>
            {profile?.full_name || user?.full_name || 'Nama Anda'}
          </Text>
          
          {profile?.age && profile?.location && (
            <Text style={styles.subInfo}>
              {profile.age} tahun, {profile.location}
            </Text>
          )}

          {/* Subscription Badge */}
          {subscriptionBadge && (
            <View style={[styles.subscriptionBadge, { backgroundColor: `${subscriptionBadge.color}20` }]}>
              <subscriptionBadge.icon size={16} color={subscriptionBadge.color} />
              <Text style={[styles.subscriptionText, { color: subscriptionBadge.color }]}>
                {subscriptionBadge.label}
              </Text>
            </View>
          )}

          {/* Verification Status */}
          <View style={styles.verificationRow}>
            {profile?.is_verified ? (
              <View style={styles.verifiedBadge}>
                <Shield size={16} color="#10B981" />
                <Text style={styles.verifiedText}>Terverifikasi</Text>
              </View>
            ) : (
              <View style={styles.unverifiedBadge}>
                <Shield size={16} color="#F59E0B" />
                <Text style={styles.unverifiedText}>Menunggu Verifikasi</Text>
              </View>
            )}
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity 
            style={styles.editProfileBtn}
            onPress={() => onNavigate?.('EditProfile')}
          >
            <Edit2 size={18} color="#10B981" />
            <Text style={styles.editProfileText}>Edit Profil</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Dilihat</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Match</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Taaruf</Text>
          </View>
        </View>

        {/* Referral Code */}
        {profile?.referral_code && (
          <TouchableOpacity 
            style={styles.referralCard}
            onPress={() => onNavigate?.('Referral')}
          >
            <View style={styles.referralIcon}>
              <Gift size={24} color="#6366F1" />
            </View>
            <View style={styles.referralInfo}>
              <Text style={styles.referralLabel}>Kode Referral Anda</Text>
              <Text style={styles.referralCode}>{profile.referral_code}</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Akun</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => onNavigate?.('Premium')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#FEF3C7' }]}>
              <Crown size={20} color="#F59E0B" />
            </View>
            <Text style={styles.menuText}>Upgrade ke Premium</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => onNavigate?.('BlockList')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#FEE2E2' }]}>
              <Lock size={20} color="#EF4444" />
            </View>
            <Text style={styles.menuText}>Daftar Blokir</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => onNavigate?.('Notifications')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#E0E7FF' }]}>
              <Bell size={20} color="#6366F1" />
            </View>
            <Text style={styles.menuText}>Pengaturan Notifikasi</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Lainnya</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => onNavigate?.('Help')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#D1FAE5' }]}>
              <HelpCircle size={20} color="#10B981" />
            </View>
            <Text style={styles.menuText}>Bantuan</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => onNavigate?.('Terms')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#F3F4F6' }]}>
              <FileText size={20} color="#6B7280" />
            </View>
            <Text style={styles.menuText}>Syarat & Ketentuan</Text>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
            disabled={loggingOut}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#FEE2E2' }]}>
              <LogOut size={20} color="#EF4444" />
            </View>
            <Text style={[styles.menuText, styles.logoutText]}>
              {loggingOut ? 'Keluar...' : 'Keluar'}
            </Text>
            {loggingOut && <ActivityIndicator size="small" color="#EF4444" />}
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={styles.version}>Taaruf Samara v1.0.0</Text>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editPhotoBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subInfo: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  subscriptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  verificationRow: {
    marginBottom: 16,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#D1FAE5',
    borderRadius: 16,
  },
  verifiedText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  unverifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
  },
  unverifiedText: {
    fontSize: 14,
    color: '#D97706',
    fontWeight: '500',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  referralCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  referralIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  referralInfo: {
    flex: 1,
  },
  referralLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  referralCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366F1',
    letterSpacing: 1,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    paddingVertical: 8,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  logoutItem: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 8,
    paddingTop: 16,
  },
  logoutText: {
    color: '#EF4444',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 16,
  },
});
