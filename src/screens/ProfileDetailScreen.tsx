import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  ChevronLeft,
  Heart,
  MessageCircle,
  MapPin,
  Briefcase,
  GraduationCap,
  BookOpen,
  Star,
  Flag,
  Shield,
  Lock,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  religion: string;
  education: string;
  occupation: string;
  income: string;
  prayerCondition: string;
  bio: string;
  photo: string;
  photos: string[];
  hobbies: string[];
  isPremium: boolean;
  isBlurred: boolean;
  matchPercentage: number;
}

// Mock Profile Data
const MOCK_PROFILE: Profile = {
  id: '1',
  name: 'Sarah Amalia',
  age: 25,
  location: 'Bandung, Jawa Barat',
  religion: 'Islam',
  education: 'S1 Kedokteran - Universitas Padjadjaran',
  occupation: 'Dokter Umum di Rumah Sakit',
  income: '10-15 juta/bulan',
  prayerCondition: 'Taat',
  bio: 'Alhamdulillah, saya seorang dokter yang sedang mencari pasangan hidup yang shaleh dan bisa membimbing saya menjadi Muslimah yang lebih baik. Saya suka membaca dan traveling ke tempat-tempat bersejarah Islam.',
  photo: 'https://via.placeholder.com/400',
  photos: [
    'https://via.placeholder.com/400/10B981/FFFFFF',
    'https://via.placeholder.com/400/6366F1/FFFFFF',
    'https://via.placeholder.com/400/F59E0B/FFFFFF',
  ],
  hobbies: ['Membaca', 'Traveling', 'Memasak', 'Yoga'],
  isPremium: true,
  isBlurred: false,
  matchPercentage: 92,
};

interface Props {
  profile?: Profile;
  onBack: () => void;
  onConnect: () => void;
  onMessage: () => void;
  onBlock: () => void;
  onReport: () => void;
}

export default function ProfileDetailScreen({
  profile = MOCK_PROFILE,
  onBack,
  onConnect,
  onMessage,
  onBlock,
  onReport,
}: Props) {
  const [activePhoto, setActivePhoto] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleConnect = () => {
    Alert.alert(
      'Kirim Permintaan Taaruf',
      'Anda akan mengirim permintaan taaruf ke Sarah. Setelah diterima, Anda bisa berkenalan.',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Kirim', onPress: onConnect },
      ]
    );
  };

  const handleBlock = () => {
    Alert.alert(
      'Blokir Pengguna',
      'Anda yakin ingin memblokir Sarah? Pengguna yang diblokir tidak akan muncul di pencarian Anda.',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Blokir', style: 'destructive', onPress: onBlock },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ChevronLeft size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.likeBtn, isLiked && styles.likeBtnActive]}
          onPress={() => setIsLiked(!isLiked)}
        >
          <Heart size={24} color={isLiked ? '#EF4444' : '#FFFFFF'} fill={isLiked ? '#EF4444' : 'transparent'} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Photo Carousel */}
        <View style={styles.photoSection}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActivePhoto(index);
            }}
          >
            {[profile.photo, ...profile.photos].map((photo, index) => (
              <Image key={index} source={{ uri: photo }} style={styles.photo} />
            ))}
          </ScrollView>
          
          {/* Photo Dots */}
          <View style={styles.photoDots}>
            {[profile.photo, ...profile.photos].map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index === activePhoto && styles.dotActive]}
              />
            ))}
          </View>

          {/* Match Badge */}
          <View style={styles.matchBadge}>
            <Star size={14} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.matchText}>{profile.matchPercentage}% Match</Text>
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.infoSection}>
          <View style={styles.nameRow}>
            <View>
              <Text style={styles.name}>{profile.name}, {profile.age}</Text>
              <View style={styles.locationRow}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.location}>{profile.location}</Text>
              </View>
            </View>
            {profile.isPremium && (
              <View style={styles.premiumBadge}>
                <Star size={16} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.premiumText}>Premium</Text>
              </View>
            )}
          </View>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <BookOpen size={20} color="#10B981" />
              <Text style={styles.statLabel}>{profile.religion}</Text>
            </View>
            <View style={styles.statItem}>
              <GraduationCap size={20} color="#6366F1" />
              <Text style={styles.statLabel}>{profile.education.split(' ')[0]}</Text>
            </View>
            <View style={styles.statItem}>
              <Briefcase size={20} color="#F59E0B" />
              <Text style={styles.statLabel}>{profile.occupation.split(' ')[0]}</Text>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tentang</Text>
            <Text style={styles.bio}>{profile.bio}</Text>
          </View>

          {/* Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detail Profil</Text>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Pendidikan</Text>
              <Text style={styles.detailValue}>{profile.education}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Pekerjaan</Text>
              <Text style={styles.detailValue}>{profile.occupation}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Penghasilan</Text>
              <Text style={styles.detailValue}>{profile.income}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Kondisi Ibadah</Text>
              <Text style={styles.detailValue}>{profile.prayerCondition}</Text>
            </View>
          </View>

          {/* Hobbies Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hobi & Minat</Text>
            <View style={styles.hobbiesContainer}>
              {profile.hobbies.map((hobby, index) => (
                <View key={index} style={styles.hobbyChip}>
                  <Text style={styles.hobbyText}>{hobby}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Safety Section */}
          <View style={styles.safetySection}>
            <Text style={styles.safetyTitle}>Keamanan</Text>
            <View style={styles.safetyButtons}>
              <TouchableOpacity style={styles.safetyBtn} onPress={handleBlock}>
                <Shield size={20} color="#6B7280" />
                <Text style={styles.safetyBtnText}>Blokir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.safetyBtn} onPress={onReport}>
                <Flag size={20} color="#6B7280" />
                <Text style={styles.safetyBtnText}>Laporkan</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom padding */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.messageBtn} onPress={onMessage}>
          <MessageCircle size={24} color="#10B981" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.connectBtn} onPress={handleConnect}>
          <Text style={styles.connectBtnText}>Kirim Taaruf</Text>
        </TouchableOpacity>
      </View>

      {/* Premium Lock Overlay (if blurred) */}
      {profile.isBlurred && (
        <View style={styles.premiumLockOverlay}>
          <Lock size={48} color="#FFFFFF" />
          <Text style={styles.premiumLockTitle}>Upgrade ke Premium</Text>
          <Text style={styles.premiumLockText}>
            Lihat profil lengkap dan mulai berkenalan dengan calon pasangan Anda
          </Text>
          <TouchableOpacity style={styles.upgradeBtn}>
            <Text style={styles.upgradeBtnText}>Upgrade Sekarang</Text>
          </TouchableOpacity>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 50,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeBtnActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
  },
  photoSection: {
    position: 'relative',
    height: height * 0.5,
  },
  photo: {
    width: width,
    height: height * 0.5,
  },
  photoDots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  matchBadge: {
    position: 'absolute',
    top: 100,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  matchText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoSection: {
    padding: 20,
    marginTop: -30,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 15,
    color: '#6B7280',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  premiumText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  statLabel: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  bio: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  hobbiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hobbyChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  hobbyText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  safetySection: {
    marginTop: 8,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  safetyButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  safetyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  safetyBtnText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    paddingBottom: 30,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  messageBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  connectBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
  },
  connectBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  premiumLockOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  premiumLockTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  premiumLockText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 20,
  },
  upgradeBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  upgradeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
