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
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search, Bell, MapPin, Heart, Star, Filter, Menu, Eye } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useRecommendedProfiles, useNewMembers } from '../hooks/useProfiles';
import { supabase } from '../lib/supabase';
import { UserProfile, Banner } from '../types';

const { width } = Dimensions.get('window');

interface Props {
  onNavigate: (screen: string, params?: any) => void;
}

export default function HomeScreen({ onNavigate }: Props) {
  const { user } = useAuth();
  const { profile: myProfile } = useProfile();
  const { profiles: recommendedProfiles, loading: loadingRecommended } = useRecommendedProfiles(6);
  const { members: newMembers, loading: loadingNewMembers } = useNewMembers(10);
  
  const [refreshing, setRefreshing] = useState(false);
  const [activeBanner, setActiveBanner] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(true);

  // Fetch banners
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .or(`start_date.is.null,start_date.lte.${now}`)
        .or(`end_date.is.null,end_date.gte.${now}`)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (err) {
      console.error('Error fetching banners:', err);
      // Use default banners if fetch fails
      setBanners([
        { id: '1', title: 'Jadi Premium', subtitle: 'Akses fitur lengkap', image_url: '', link_to: 'Premium', is_active: true, display_order: 1 },
      ]);
    } finally {
      setLoadingBanners(false);
    }
  };

  // Auto-scroll banner
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBanners();
    setRefreshing(false);
  };

  const getDisplayName = () => {
    if (myProfile?.full_name) {
      return myProfile.full_name.split(' ')[0];
    }
    return user?.full_name?.split(' ')[0] || 'User';
  };

  const getPhotoUrl = (profile: UserProfile) => {
    if (profile.photos && profile.photos.length > 0) {
      return profile.photos[0];
    }
    return 'https://via.placeholder.com/150/E5E7EB/9CA3AF?text=No+Photo';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Assalamualaikum</Text>
            <Text style={styles.username}>{getDisplayName()}</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Bell size={24} color="#374151" />
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
        {banners.length > 0 && (
          <View style={styles.bannerSection}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / (width - 32));
                setActiveBanner(index);
              }}
            >
              {banners.map((banner) => (
                <TouchableOpacity
                  key={banner.id}
                  style={styles.bannerItem}
                  onPress={() => {
                    if (banner.link_to) {
                      onNavigate(banner.link_to);
                    }
                  }}
                >
                  {banner.image_url ? (
                    <Image source={{ uri: banner.image_url }} style={styles.bannerImage} />
                  ) : (
                    <View style={[styles.bannerImage, styles.bannerPlaceholder]}>
                      <Star size={32} color="#F59E0B" />
                    </View>
                  )}
                  <View style={styles.bannerOverlay}>
                    <Text style={styles.bannerTitle}>{banner.title}</Text>
                    {banner.subtitle && (
                      <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {/* Banner Dots */}
            {banners.length > 1 && (
              <View style={styles.bannerDots}>
                {banners.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      index === activeBanner && styles.dotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        )}

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
          <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('SelfValue')}>
            <View style={[styles.actionIcon, { backgroundColor: '#D1FAE5' }]}>
              <Eye size={24} color="#10B981" />
            </View>
            <Text style={styles.actionText}>Self-Value</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onNavigate('Referral')}>
            <View style={[styles.actionIcon, { backgroundColor: '#E0E7FF' }]}>
              <Menu size={24} color="#6366F1" />
            </View>
            <Text style={styles.actionText}>Referral</Text>
          </TouchableOpacity>
        </View>

        {/* Recommended Profiles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rekomendasi Untukmu</Text>
            <TouchableOpacity onPress={() => onNavigate('AllProfiles')}>
              <Text style={styles.seeAll}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {loadingRecommended ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#10B981" />
            </View>
          ) : recommendedProfiles.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.profilesScroll}
            >
              {recommendedProfiles.map((profile) => (
                <TouchableOpacity
                  key={profile.id}
                  style={styles.profileCard}
                  onPress={() => onNavigate('ProfileDetail', { profile })}
                >
                  <Image
                    source={{ uri: getPhotoUrl(profile) }}
                    style={[
                      styles.profileImage,
                      profile.is_blurred && styles.blurredImage,
                    ]}
                  />
                  {profile.is_blurred && (
                    <View style={styles.blurOverlay}>
                      <Eye size={20} color="#FFFFFF" />
                    </View>
                  )}
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName} numberOfLines={1}>
                      {profile.full_name || 'Anonymous'}
                    </Text>
                    <Text style={styles.profileDetails}>
                      {profile.age ? `${profile.age} tahun` : ''}{profile.age && profile.location ? ' • ' : ''}{profile.location || ''}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Belum ada rekomendasi</Text>
            </View>
          )}
        </View>

        {/* New Members */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Member Baru</Text>
            <TouchableOpacity onPress={() => onNavigate('AllProfiles', { sortBy: 'newest' })}>
              <Text style={styles.seeAll}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {loadingNewMembers ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#10B981" />
            </View>
          ) : newMembers.length > 0 ? (
            <View style={styles.newMembersGrid}>
              {newMembers.slice(0, 4).map((member) => (
                <TouchableOpacity
                  key={member.id}
                  style={styles.newMemberCard}
                  onPress={() => onNavigate('ProfileDetail', { profile: member })}
                >
                  <Image
                    source={{ uri: getPhotoUrl(member) }}
                    style={styles.newMemberImage}
                  />
                  <Text style={styles.newMemberName} numberOfLines={1}>
                    {member.full_name?.split(' ')[0] || 'User'}
                  </Text>
                  {member.age && (
                    <Text style={styles.newMemberAge}>{member.age} thn</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Belum ada member baru</Text>
            </View>
          )}
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
    paddingBottom: 8,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    justifyContent: 'center',
  },
  searchPlaceholder: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  filterBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  bannerItem: {
    width: width - 32,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerPlaceholder: {
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 4,
  },
  bannerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
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
    gap: 8,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  section: {
    marginTop: 8,
    paddingHorizontal: 16,
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
    fontWeight: '500',
  },
  loadingContainer: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  profilesScroll: {
    paddingRight: 16,
    gap: 12,
  },
  profileCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#F3F4F6',
  },
  blurredImage: {
    opacity: 0.3,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  profileInfo: {
    padding: 12,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  profileDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  newMembersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  newMemberCard: {
    width: (width - 32 - 36) / 4,
    alignItems: 'center',
  },
  newMemberImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    marginBottom: 8,
  },
  newMemberName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },
  newMemberAge: {
    fontSize: 11,
    color: '#6B7280',
  },
});
