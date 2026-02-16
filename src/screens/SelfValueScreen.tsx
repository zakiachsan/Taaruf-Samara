import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  ChevronLeft,
  Award,
  Check,
  Clock,
  Users,
  Star,
  Calendar,
  MessageCircle,
  Shield,
  ArrowRight,
  Heart,
  Target,
  User,
} from 'lucide-react-native';

interface Props {
  onBack: () => void;
  onBook: () => void;
  hasBasicSubscription?: boolean;
}

const SERVICE_DETAILS = {
  title: 'Bedah Value',
  subtitle: 'Kenali Diri & Temukan Pasangan yang Cocok',
  price: 300000,
  duration: '3 jam',
  format: 'Online Video Call',
  sessions: 1,
};

const WHAT_YOU_GET = [
  {
    icon: 'profile',
    title: 'Kualitas Diri',
    description: 'Mengetahui kelebihan dan potensi terbaik dalam diri Anda',
  },
  {
    icon: 'shield',
    title: 'Kesiapan Mental',
    description: 'Evaluasi kesiapan mental untuk menjalani rumah tangga',
  },
  {
    icon: 'heart',
    title: 'Bagasi Emosi',
    description: 'Identifikasi kekurangan, kesalahan masa lalu & bagasi emosi',
  },
  {
    icon: 'target',
    title: 'Kebutuhan Hidup',
    description: 'Memahami kebutuhan dan prioritas dalam kehidupan Anda',
  },
  {
    icon: 'match',
    title: 'Kategori Jodoh Tepat',
    description: 'Menentukan kriteria pasangan yang paling cocok untuk Anda',
  },
  {
    icon: 'certificate',
    title: 'Sertifikat Bedah Value',
    description: 'Sertifikat resmi yang menunjukkan Anda sudah ikut program',
  },
];

const SESSION_STEPS = [
  {
    step: 1,
    title: 'Pengenalan',
    duration: '30 menit',
    description: 'Perkenalan dan pengisian formulir assessment',
  },
  {
    step: 2,
    title: 'Assessment Mendalam',
    duration: '90 menit',
    description: 'Wawancara dan analisis bersama konsultan',
  },
  {
    step: 3,
    title: 'Rekomendasi & Sertifikat',
    duration: '60 menit',
    description: 'Pembahasan hasil dan penerimaan sertifikat Bedah Value',
  },
];

const TESTIMONIALS = [
  {
    id: '1',
    name: 'Ahmad Fauzi',
    role: 'Software Engineer',
    text: 'Bedah Value sangat membantu saya memahami diri sendiri dan apa yang saya cari dalam pasangan. Alhamdulillah, saya sudah menemukan pasangan yang cocok.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Sarah Amalia',
    role: 'Dokter',
    text: 'Prosesnya profesional dan insightful. Konsultan sangat membantu dalam mengarahkan saya ke tipe pasangan yang sesuai dengan nilai-nilai saya.',
    rating: 5,
  },
];

export default function SelfValueScreen({ onBack, onBook, hasBasicSubscription = false }: Props) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const handleBook = () => {
    if (!hasBasicSubscription) {
      Alert.alert(
        'Wajib Basic Dulu',
        'Untuk mengakses layanan ini, Anda harus berlangganan Basic 50rb terlebih dahulu.',
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Lihat Paket', onPress: () => console.log('Navigate to premium') },
        ]
      );
      return;
    }

    Alert.alert(
      'Booking Bedah Value',
      `Anda akan booking ${SERVICE_DETAILS.title} seharga Rp ${SERVICE_DETAILS.price.toLocaleString('id-ID')}. Lanjutkan?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Booking', onPress: onBook },
      ]
    );
  };

  const renderStars = (count: number) => {
    return (
      <View style={styles.starsContainer}>
        {[...Array(count)].map((_, i) => (
          <Star key={i} size={16} color="#F59E0B" fill="#F59E0B" />
        ))}
      </View>
    );
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'profile':
        return <User size={24} color="#10B981" />;
      case 'shield':
        return <Shield size={24} color="#6366F1" />;
      case 'heart':
        return <Heart size={24} color="#EC4899" />;
      case 'target':
        return <Target size={24} color="#F59E0B" />;
      case 'match':
        return <Users size={24} color="#8B5CF6" />;
      case 'certificate':
        return <Award size={24} color="#14B8A6" />;
      default:
        return <Star size={24} color="#6B7280" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ChevronLeft size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bedah Value</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Award size={48} color="#F59E0B" />
          </View>
          <Text style={styles.heroTitle}>{SERVICE_DETAILS.title}</Text>
          <Text style={styles.heroSubtitle}>{SERVICE_DETAILS.subtitle}</Text>
          
          {/* Price Badge */}
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>
              Rp {SERVICE_DETAILS.price.toLocaleString('id-ID')}
            </Text>
            <Text style={styles.priceNote}>Sekali bayar</Text>
          </View>
        </View>

        {/* Quick Info */}
        <View style={styles.quickInfo}>
          <View style={styles.infoItem}>
            <Clock size={20} color="#10B981" />
            <Text style={styles.infoLabel}>{SERVICE_DETAILS.duration}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoItem}>
            <MessageCircle size={20} color="#6366F1" />
            <Text style={styles.infoLabel}>{SERVICE_DETAILS.format}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoItem}>
            <Users size={20} color="#EC4899" />
            <Text style={styles.infoLabel}>1-on-1</Text>
          </View>
        </View>

        {/* What You Get */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apa yang Anda Dapatkan</Text>
          <View style={styles.benefitsGrid}>
            {WHAT_YOU_GET.map((item, index) => (
              <View key={index} style={styles.benefitCard}>
                <View style={styles.benefitIcon}>
                  {renderIcon(item.icon)}
                </View>
                <Text style={styles.benefitTitle}>{item.title}</Text>
                <Text style={styles.benefitDesc}>{item.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Session Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alur Sesi</Text>
          <View style={styles.stepsContainer}>
            {SESSION_STEPS.map((step, index) => (
              <TouchableOpacity
                key={step.step}
                style={styles.stepCard}
                onPress={() => setExpandedStep(expandedStep === index ? null : index)}
              >
                <View style={styles.stepHeader}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{step.step}</Text>
                  </View>
                  <View style={styles.stepInfo}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <View style={styles.stepDuration}>
                      <Clock size={14} color="#6B7280" />
                      <Text style={styles.stepDurationText}>{step.duration}</Text>
                    </View>
                  </View>
                  <Text style={styles.expandIcon}>
                    {expandedStep === index ? '▼' : '▶'}
                  </Text>
                </View>
                {expandedStep === index && (
                  <Text style={styles.stepDescription}>{step.description}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Comparison with Premium */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perbandingan Layanan</Text>
          <View style={styles.comparisonCard}>
            <View style={styles.comparisonRow}>
              <View style={[styles.comparisonCell, styles.comparisonHeader]}>
                <Text style={styles.comparisonHeaderText}>Fitur</Text>
              </View>
              <View style={[styles.comparisonCell, styles.comparisonHeader, styles.premiumCol]}>
                <Text style={styles.comparisonHeaderText}>Premium</Text>
                <Text style={styles.comparisonPrice}>300rb</Text>
              </View>
              <View style={[styles.comparisonCell, styles.comparisonHeader, styles.bedahValueCol]}>
                <Text style={styles.comparisonHeaderTextActive}>Bedah Value</Text>
                <Text style={styles.comparisonPriceActive}>300rb</Text>
              </View>
            </View>
            
            {[
              { feature: '3x Taaruf', premium: true, bedahValue: false },
              { feature: 'Pendampingan', premium: true, bedahValue: true },
              { feature: 'Profil Diri', premium: false, bedahValue: true },
              { feature: 'Rekomendasi Pasangan', premium: false, bedahValue: true },
              { feature: 'Sertifikat', premium: false, bedahValue: true },
            ].map((row, index) => (
              <View key={index} style={styles.comparisonRow}>
                <View style={styles.comparisonCell}>
                  <Text style={styles.featureText}>{row.feature}</Text>
                </View>
                <View style={[styles.comparisonCell, styles.premiumCol]}>
                  {row.premium ? (
                    <Check size={20} color="#10B981" />
                  ) : (
                    <Text style={styles.dash}>-</Text>
                  )}
                </View>
                <View style={[styles.comparisonCell, styles.bedahValueCol]}>
                  {row.bedahValue ? (
                    <Check size={20} color="#F59E0B" />
                  ) : (
                    <Text style={styles.dash}>-</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Testimonials */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Testimoni</Text>
          {TESTIMONIALS.map((item) => (
            <View key={item.id} style={styles.testimonialCard}>
              <View style={styles.testimonialHeader}>
                <View style={styles.testimonialAvatar}>
                  <Text style={styles.avatarText}>{item.name[0]}</Text>
                </View>
                <View style={styles.testimonialInfo}>
                  <Text style={styles.testimonialName}>{item.name}</Text>
                  <Text style={styles.testimonialRole}>{item.role}</Text>
                </View>
                {renderStars(item.rating)}
              </View>
              <Text style={styles.testimonialText}>"{item.text}"</Text>
            </View>
          ))}
        </View>

        {/* Certificate Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sertifikat Bedah Value</Text>
          <View style={styles.certificatePreview}>
            <Award size={48} color="#F59E0B" />
            <Text style={styles.certificateTitle}>Sertifikat Bedah Value</Text>
            <Text style={styles.certificateDesc}>
              Setelah menyelesaikan sesi, Anda akan mendapatkan sertifikat digital yang memuat hasil assessment dan rekomendasi pasangan.
            </Text>
            <View style={styles.certificateFeatures}>
              <View style={styles.certFeature}>
                <Check size={16} color="#10B981" />
                <Text style={styles.certFeatureText}>Kode unik sertifikat</Text>
              </View>
              <View style={styles.certFeature}>
                <Check size={16} color="#10B981" />
                <Text style={styles.certFeatureText}>Dapat diverifikasi</Text>
              </View>
              <View style={styles.certFeature}>
                <Check size={16} color="#10B981" />
                <Text style={styles.certFeatureText}>Tampil di profil</Text>
              </View>
            </View>
          </View>
        </View>

        {/* FAQ Note */}
        <View style={styles.faqSection}>
          <Shield size={24} color="#10B981" />
          <Text style={styles.faqText}>
            Data Anda akan dijaga kerahasiaannya. Sesi dilakukan oleh konsultan berpengalaman.
          </Text>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.ctaContainer}>
        <View style={styles.ctaInfo}>
          <Text style={styles.ctaPrice}>
            Rp {SERVICE_DETAILS.price.toLocaleString('id-ID')}
          </Text>
          <Text style={styles.ctaNote}>Sekali bayar | 3 jam sesi</Text>
        </View>
        <TouchableOpacity style={styles.ctaButton} onPress={handleBook}>
          <Text style={styles.ctaButtonText}>Booking Sekarang</Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
  heroSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFBEB',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B45309',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
    marginBottom: 16,
  },
  priceBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B45309',
  },
  priceNote: {
    fontSize: 12,
    color: '#92400E',
    textAlign: 'center',
  },
  quickInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  infoItem: {
    alignItems: 'center',
    gap: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
  },
  section: {
    padding: 20,
    paddingTop: 0,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  benefitCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  benefitDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  stepsContainer: {
    gap: 12,
  },
  stepCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepInfo: {
    flex: 1,
    marginLeft: 12,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  stepDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepDurationText: {
    fontSize: 13,
    color: '#6B7280',
  },
  expandIcon: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
    marginLeft: 48,
  },
  comparisonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  comparisonRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  comparisonCell: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comparisonHeader: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 16,
  },
  comparisonHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  comparisonHeaderTextActive: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B45309',
  },
  premiumCol: {
    backgroundColor: '#F0FDF4',
  },
  bedahValueCol: {
    backgroundColor: '#FEF3C7',
  },
  comparisonPrice: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  comparisonPriceActive: {
    fontSize: 12,
    color: '#B45309',
    fontWeight: '600',
    marginTop: 2,
  },
  featureText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  dash: {
    fontSize: 18,
    color: '#D1D5DB',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testimonialAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  testimonialInfo: {
    flex: 1,
    marginLeft: 12,
  },
  testimonialName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  testimonialRole: {
    fontSize: 13,
    color: '#6B7280',
  },
  testimonialText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  certificatePreview: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FCD34D',
    borderStyle: 'dashed',
  },
  certificateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B45309',
    marginTop: 12,
    marginBottom: 8,
  },
  certificateDesc: {
    fontSize: 13,
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  certificateFeatures: {
    gap: 8,
  },
  certFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  certFeatureText: {
    fontSize: 13,
    color: '#047857',
    fontWeight: '500',
  },
  faqSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDF4',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  faqText: {
    flex: 1,
    fontSize: 13,
    color: '#065F46',
    lineHeight: 18,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    padding: 16,
    paddingBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ctaInfo: {
    flex: 1,
  },
  ctaPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  ctaNote: {
    fontSize: 12,
    color: '#6B7280',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
  },
  ctaButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
