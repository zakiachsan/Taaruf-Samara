import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search, Bell, Menu, MapPin, Heart, Star, Filter } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  religion: string;
  education: string;
  photo: string;
  isPremium: boolean;
  isBlurred: boolean;
  matchPercentage: number;
}

interface Banner {
  id: string;
  image: string;
  title: string;
  link: string;
}

// Mock Data
const MOCK_BANNERS: Banner[] = [
  { id: '1', image: 'https://via.placeholder.com/400x200/10B981/FFFFFF?text=Promo+50%25', title: 'Diskon 50% Premium', link: '/premium' },
  { id: '2', image: 'https://via.placeholder.com/400x200/6366F1/FFFFFF?text=Event+Taaruf', title: 'Event Taaruf Online', link: '/events' },
  { id: '3', image: 'https://via.placeholder.com/400x200/F59E0B/FFFFFF?text=Success+Story', title: 'Kisah Sukses', link: '/stories' },
];

const MOCK_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'Ahmad Fauzi',
    age: 28,
    location: 'Jakarta',
    religion: 'Islam',
    education: 'S1 Teknik',
    photo: 'https://via.placeholder.com/150',
    isPremium: false,
    isBlurred: false,
    matchPercentage: 85,
  },
  {
    id: '2',
    name: 'Sarah Amalia',
    age: 25,
    location: 'Bandung',
    religion: 'Islam',
    education: 'S1 Kedokteran',
    photo: 'https://via.placeholder.com/150',
    isPremium: true,
    isBlurred: false,
    matchPercentage: 92,
  },
  {
    id: '3',
    name: 'Muhammad Rizky',
    age: 30,
    location: 'Surabaya',
    religion: 'Islam',
    education: 'S2 Ekonomi',
    photo: 'https://via.placeholder.com/150',
    isPremium: false,
    isBlurred: true,
    matchPercentage: 78,
  },
  {
    id: '4',
    name: 'Fatimah Zahra',
    age: 24,
    location: 'Yogyakarta',
    religion: 'Islam',
    education: 'S1 Psikologi',
    photo: 'https://via.placeholder.com/150',
    isPremium: true,
    isBlurred: false,
    matchPercentage: 88,
  },
  {
    id: '5',
    name: 'Budi Santoso',
    age: 29,
    location: 'Jakarta',
    religion: 'Islam',
    education: 'S1 Hukum',
    photo: 'https://via.placeholder.com/150',
    isPremium: false,
    isBlurred: true,
    matchPercentage: 75,
  },
  {
    id: '6',
    name: 'Dewi Kartika',
    age: 26,
    location: 'Malang',
    religion: 'Islam',
    education: 'S1 Farmasi',
    photo: 'https://via.placeholder.com/150',
    isPremium: false,
    isBlurred: false,
    matchPercentage: 82,
  },
];

interface Props {
  onNavigate: (screen: string, params?: any) => void;
}

export default function HomeScreen({ onNavigate }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const [activeBanner, setActiveBanner] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-scroll banner
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % MOCK_BANNERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const filteredProfiles = MOCK_PROFILES.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Assalamualaikum</Text>
            <Text style={styles.username}>Ahmad Fauzi</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Bell size={24} color="#374151" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TouchableOpacity
            style={styles.searchInput}
            onPress={() => onNavigate('Search')}
          >
            <Text style={styles.searchPlaceholder}>Cari calon pasangan...</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Filter size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Banner Carousel */}
        <View style={styles.bannerSection}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveBanner(index);
            }}
            contentOffset={{ x: activeBanner * width, y: 0 }}
          >
            {MOCK_BANNERS.map((banner) => (
              <TouchableOpacity
                key={banner.id}
                style={styles.bannerItem}
                onPress={() => onNavigate('BannerDetail', { banner })}
              >
                <Image source={{ uri: banner.image }} style={styles.bannerImage} />
                <View style={styles.bannerOverlay}>
                  <Text style={styles.bannerTitle}>{banner.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Banner Dots */}
          <View style={styles.bannerDots}>
            {MOCK_BANNERS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === activeBanner && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('Premium')}>
            <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
              <Star size={24} color="#F59E0B" />
            </View>
            <Text style={styles.actionText}>Premium</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('Matches')}>
            <View style={[styles.actionIcon, { backgroundColor: '#FCE7F3' }]}>
              <Heart size={24} color="#EC4899" />
            </View>
            <Text style={styles.actionText}>Match</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('Nearby')}>
            <View style={[styles.actionIcon, { backgroundColor: '#D1FAE5' }]}>
              <MapPin size={24} color="#10B981" />
            </View>
            <Text style={styles.actionText}>Terdekat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('Menu')}>
            <View style={[styles.actionIcon, { backgroundColor: '#E0E7FF' }]}>
              <Menu size={24} color="#6366F1" />
            </View>
            <Text style={styles.actionText}>Menu</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Profiles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rekomendasi Untukmu</Text>
            <TouchableOpacity onPress={() => onNavigate('AllProfiles')}>
              <Text style={styles.seeAll}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profilesGrid}>
            {filteredProfiles.slice(0, 4).map((profile) => (
              <TouchableOpacity
                key={profile.id}
                style={styles.profileCard}
                onPress={() => onNavigate('ProfileDetail', { profile })}
              >
                <View style={styles.photoContainer}>
                  <Image
                    source={{ uri: profile.photo }}
                    style={[
                      styles.profilePhoto,
                      profile.isBlurred && styles.blurredPhoto,
                    ]}
                  />
                  {profile.isBlurred && (
                    <View style={styles.lockOverlay}>
                      <Text style={styles.lockText}>Premium</Text>
                    </View>
                  )}
                  {profile.isPremium && (
                    <View style={styles.premiumBadge}>
                      <Star size={12} color="#FFFFFF" fill="#FFFFFF" />
                    </View>
                  )}
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchText}>{profile.matchPercentage}%</Text>
                  </View>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{profile.name}, {profile.age}</Text>
                  <View style={styles.locationRow}>
                    <MapPin size={12} color="#6B7280" />
                    <Text style={styles.locationText}>{profile.location}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* New Members */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Anggota Baru</Text>
            <TouchableOpacity onPress={() => onNavigate('NewMembers')}>
              <Text style={styles.seeAll}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.newMembersList}
          >
            {MOCK_PROFILES.slice(2).map((profile) => (
              <TouchableOpacity
                key={profile.id}
                style={styles.newMemberCard}
                onPress={() => onNavigate('ProfileDetail', { profile })}
              >
                <Image
                  source={{ uri: profile.photo }}
                  style={[
                    styles.newMemberPhoto,
                    profile.isBlurred && styles.blurredPhoto,
                  ]}
                />
                {profile.isBlurred && (
                  <View style={styles.smallLockOverlay}>
                    <Text style={styles.smallLockText}>Locked</Text>
                  </View>
                )}
                <Text style={styles.newMemberName}>{profile.name}</Text>
                <Text style={styles.newMemberInfo}>{profile.age} th • {profile.location}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  notificationBtn: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
  },
  searchPlaceholder: {
    color: '#9CA3AF',
    fontSize: 15,
  },
  filterBtn: {
    padding: 8,
  },
  bannerSection: {
    marginTop: 16,
  },
  bannerItem: {
    width: width - 32,
    height: 160,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    backgroundColor: '#10B981',
    width: 24,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  profilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  profileCard: {
    width: (width - 44) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoContainer: {
    position: 'relative',
  },
  profilePhoto: {
    width: '100%',
    height: 180,
  },
  blurredPhoto: {
    opacity: 0.3,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    padding: 4,
  },
  matchBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  matchText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileInfo: {
    padding: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#6B7280',
  },
  newMembersList: {
    paddingRight: 16,
    gap: 12,
  },
  newMemberCard: {
    width: 120,
    alignItems: 'center',
  },
  newMemberPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  smallLockOverlay: {
    position: 'absolute',
    top: 0,
    left: 10,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallLockText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  newMemberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  newMemberInfo: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});
