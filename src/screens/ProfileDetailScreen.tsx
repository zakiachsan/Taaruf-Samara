import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
  Modal,
  TextInput,
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
  X,
  Send,
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useProfileById } from '../hooks/useProfile';
import { useMatches, useBlockedUsers, useReports } from '../hooks/useMatches';
import { UserProfile } from '../types';

const { width } = Dimensions.get('window');

interface Props {
  profile?: UserProfile;
  userId?: string;
  onBack: () => void;
  onConnect?: () => void;
  onMessage?: () => void;
  onBlock?: () => void;
  onReport?: () => void;
}

const REPORT_REASONS = [
  'Foto tidak sesuai',
  'Informasi palsu',
  'Perilaku tidak sopan',
  'Spam/Penipuan',
  'Lainnya',
];

export default function ProfileDetailScreen({ 
  profile: initialProfile, 
  userId,
  onBack,
}: Props) {
  const { user } = useAuth();
  const { profile: fetchedProfile, loading: loadingProfile } = useProfileById(
    userId || initialProfile?.user_id || null
  );
  const { sendRequest, hasPendingRequest, isMatched } = useMatches();
  const { blockUser, isBlocked } = useBlockedUsers();
  const { submitReport } = useReports();

  const [activePhoto, setActivePhoto] = useState(0);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [introMessage, setIntroMessage] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const profile = fetchedProfile || initialProfile;
  const photos = profile?.photos || [];
  const profileUserId = profile?.user_id || userId || '';

  const isPending = hasPendingRequest(profileUserId);
  const isAlreadyMatched = isMatched(profileUserId);
  const isUserBlocked = isBlocked(profileUserId);

  // Check if user has premium subscription
  const hasPremium = user?.subscription?.plan_type === 'premium' || 
                     user?.subscription?.plan_type === 'basic';

  const getPhotoUrl = (index: number) => {
    if (photos[index]) return photos[index];
    return 'https://via.placeholder.com/400/E5E7EB/9CA3AF?text=No+Photo';
  };

  const handleConnect = async () => {
    if (!hasPremium) {
      Alert.alert(
        'Upgrade ke Premium',
        'Anda harus berlangganan untuk mengirim permintaan taaruf.',
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Lihat Paket', onPress: () => {} }, // Navigate to Premium
        ]
      );
      return;
    }

    if (isPending) {
      Alert.alert('Info', 'Permintaan Anda sudah dikirim sebelumnya.');
      return;
    }

    if (isAlreadyMatched) {
      Alert.alert('Info', 'Anda sudah match dengan profil ini.');
      return;
    }

    setShowRequestModal(true);
  };

  const sendTaarufRequest = async () => {
    if (!introMessage.trim()) {
      Alert.alert('Perhatian', 'Silakan tulis pesan perkenalan');
      return;
    }

    setIsSubmitting(true);
    try {
      await sendRequest(profileUserId, introMessage);
      setShowRequestModal(false);
      setIntroMessage('');
      Alert.alert('Berhasil', 'Permintaan taaruf berhasil dikirim!');
    } catch (error: any) {
      Alert.alert('Gagal', error.message || 'Gagal mengirim permintaan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlock = () => {
    Alert.alert(
      'Blokir Pengguna',
      `Anda yakin ingin memblokir ${profile?.full_name || 'pengguna ini'}? Mereka tidak akan bisa melihat profil Anda.`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Blokir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await blockUser(profileUserId);
              Alert.alert('Berhasil', 'Pengguna telah diblokir');
              onBack();
            } catch (error: any) {
              Alert.alert('Gagal', error.message);
            }
          }
        },
      ]
    );
  };

  const handleReport = () => {
    setShowReportModal(true);
  };

  const submitReportHandler = async () => {
    if (!reportReason) {
      Alert.alert('Perhatian', 'Pilih alasan laporan');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReport(profileUserId, reportReason, reportDescription);
      setShowReportModal(false);
      setReportReason('');
      setReportDescription('');
      Alert.alert('Berhasil', 'Laporan telah dikirim. Tim kami akan meninjau.');
    } catch (error: any) {
      Alert.alert('Gagal', error.message || 'Gagal mengirim laporan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingProfile && !initialProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <ChevronLeft size={28} color="#111827" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Profil tidak ditemukan</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

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
            {photos.length > 0 ? (
              photos.map((photo, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image
                    source={{ uri: photo }}
                    style={[
                      styles.photo,
                      profile.is_blurred && !hasPremium && styles.blurredPhoto,
                    ]}
                  />
                  {profile.is_blurred && !hasPremium && (
                    <View style={styles.blurOverlay}>
                      <Lock size={40} color="#FFFFFF" />
                      <Text style={styles.blurText}>Upgrade untuk melihat foto</Text>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View style={[styles.photoContainer, styles.noPhotoContainer]}>
                <Text style={styles.noPhotoText}>Tidak ada foto</Text>
              </View>
            )}
          </ScrollView>

          {/* Back Button */}
          <TouchableOpacity style={styles.backBtnFloat} onPress={onBack}>
            <ChevronLeft size={28} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Photo Indicators */}
          {photos.length > 1 && (
            <View style={styles.photoIndicators}>
              {photos.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === activePhoto && styles.indicatorActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Profile Info */}
        <View style={styles.infoSection}>
          {/* Name & Age */}
          <View style={styles.nameRow}>
            <Text style={styles.name}>
              {profile.full_name || 'Anonymous'}, {profile.age || '?'}
            </Text>
            {profile.is_verified && (
              <View style={styles.verifiedBadge}>
                <Shield size={16} color="#10B981" />
              </View>
            )}
          </View>

          {/* Location */}
          {profile.location && (
            <View style={styles.infoRow}>
              <MapPin size={18} color="#6B7280" />
              <Text style={styles.infoText}>{profile.location}</Text>
            </View>
          )}

          {/* Religion & Prayer */}
          {profile.religion && (
            <View style={styles.infoRow}>
              <BookOpen size={18} color="#6B7280" />
              <Text style={styles.infoText}>
                {profile.religion}
                {profile.prayer_condition && ` - ${profile.prayer_condition}`}
              </Text>
            </View>
          )}

          {/* Education */}
          {profile.education && (
            <View style={styles.infoRow}>
              <GraduationCap size={18} color="#6B7280" />
              <Text style={styles.infoText}>{profile.education}</Text>
            </View>
          )}

          {/* Salary */}
          {profile.salary_range && (
            <View style={styles.infoRow}>
              <Briefcase size={18} color="#6B7280" />
              <Text style={styles.infoText}>{profile.salary_range}</Text>
            </View>
          )}

          {/* Bio */}
          {profile.bio && (
            <View style={styles.bioSection}>
              <Text style={styles.sectionTitle}>Tentang Saya</Text>
              <Text style={styles.bioText}>{profile.bio}</Text>
            </View>
          )}

          {/* Hobbies */}
          {profile.hobbies && profile.hobbies.length > 0 && (
            <View style={styles.hobbiesSection}>
              <Text style={styles.sectionTitle}>Hobi & Minat</Text>
              <View style={styles.hobbiesList}>
                {profile.hobbies.map((hobby, index) => (
                  <View key={index} style={styles.hobbyTag}>
                    <Text style={styles.hobbyText}>{hobby}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Report & Block */}
          <View style={styles.actionLinks}>
            <TouchableOpacity style={styles.actionLink} onPress={handleReport}>
              <Flag size={16} color="#EF4444" />
              <Text style={styles.actionLinkText}>Laporkan</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionLink} onPress={handleBlock}>
              <Shield size={16} color="#6B7280" />
              <Text style={styles.actionLinkTextMuted}>Blokir</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={[
            styles.connectBtn,
            (isPending || isAlreadyMatched) && styles.connectBtnDisabled
          ]} 
          onPress={handleConnect}
          disabled={isPending || isAlreadyMatched}
        >
          <Heart size={24} color="#FFFFFF" />
          <Text style={styles.connectBtnText}>
            {isAlreadyMatched ? 'Sudah Match' : isPending ? 'Menunggu' : 'Ajukan Taaruf'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Taaruf Request Modal */}
      <Modal
        visible={showRequestModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRequestModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Permintaan Taaruf</Text>
              <TouchableOpacity onPress={() => setShowRequestModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Tulis pesan perkenalan untuk {profile.full_name?.split(' ')[0]}
            </Text>

            <TextInput
              style={styles.messageInput}
              placeholder="Assalamualaikum, perkenalkan saya..."
              value={introMessage}
              onChangeText={setIntroMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.sendBtn, isSubmitting && styles.sendBtnDisabled]}
              onPress={sendTaarufRequest}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Send size={20} color="#FFFFFF" />
                  <Text style={styles.sendBtnText}>Kirim Permintaan</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Report Modal */}
      <Modal
        visible={showReportModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Laporkan Pengguna</Text>
              <TouchableOpacity onPress={() => setShowReportModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Pilih alasan laporan:</Text>

            {REPORT_REASONS.map((reason) => (
              <TouchableOpacity
                key={reason}
                style={[
                  styles.reasonOption,
                  reportReason === reason && styles.reasonOptionActive,
                ]}
                onPress={() => setReportReason(reason)}
              >
                <Text style={[
                  styles.reasonText,
                  reportReason === reason && styles.reasonTextActive,
                ]}>
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}

            <TextInput
              style={styles.descriptionInput}
              placeholder="Detail tambahan (opsional)"
              value={reportDescription}
              onChangeText={setReportDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[styles.reportBtn, isSubmitting && styles.reportBtnDisabled]}
              onPress={submitReportHandler}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.reportBtnText}>Kirim Laporan</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    padding: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoSection: {
    width: width,
    height: width * 1.2,
    backgroundColor: '#F3F4F6',
  },
  photoContainer: {
    width: width,
    height: width * 1.2,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  blurredPhoto: {
    opacity: 0.3,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 12,
  },
  noPhotoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5E7EB',
  },
  noPhotoText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  backBtnFloat: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  indicatorActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  infoSection: {
    padding: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  verifiedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#6B7280',
  },
  bioSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  hobbiesSection: {
    marginTop: 20,
  },
  hobbiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hobbyTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
  },
  hobbyText: {
    fontSize: 14,
    color: '#374151',
  },
  actionLinks: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionLinkText: {
    fontSize: 14,
    color: '#EF4444',
  },
  actionLinkTextMuted: {
    fontSize: 14,
    color: '#6B7280',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  connectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
  },
  connectBtnDisabled: {
    backgroundColor: '#9CA3AF',
  },
  connectBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 16,
  },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
  },
  sendBtnDisabled: {
    opacity: 0.7,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reasonOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 8,
  },
  reasonOptionActive: {
    borderColor: '#10B981',
    backgroundColor: '#D1FAE5',
  },
  reasonText: {
    fontSize: 16,
    color: '#374151',
  },
  reasonTextActive: {
    color: '#059669',
    fontWeight: '500',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 80,
    marginTop: 8,
    marginBottom: 16,
  },
  reportBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
  },
  reportBtnDisabled: {
    opacity: 0.7,
  },
  reportBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
