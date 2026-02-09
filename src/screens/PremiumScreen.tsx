import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  ChevronLeft,
  Check,
  Crown,
  Star,
  Shield,
  MessageCircle,
  Eye,
  Zap,
  Lock,
} from 'lucide-react-native';

interface Props {
  onBack: () => void;
  hasBasicSubscription?: boolean;
}

const BASIC_FEATURES = [
  'Lihat profil lengkap tanpa batas',
  'Kirim permintaan taaruf',
  'Chat dengan calon pasangan',
  'Akses daftar match harian',
  'Notifikasi realtime',
];

const PREMIUM_FEATURES = [
  'Semua fitur Basic',
  '3x taaruf dengan pendampingan',
  'Prioritas di daftar pencarian',
  'Badge Premium di profil',
  'Konsultasi dengan admin',
  'Sertifikasi self-value (opsional)',
];

export default function PremiumScreen({ onBack, hasBasicSubscription = false }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | null>(null);

  const handleSubscribe = () => {
    if (!selectedPlan) {
      Alert.alert('Pilih Paket', 'Silakan pilih paket subscription terlebih dahulu');
      return;
    }

    if (selectedPlan === 'premium' && !hasBasicSubscription) {
      Alert.alert(
        'Wajib Basic Dulu',
        'Untuk mengakses paket Premium 300rb, Anda harus berlangganan Basic 50rb terlebih dahulu.',
        [
          { text: 'Batal', style: 'cancel' },
          { 
            text: 'Pilih Basic', 
            onPress: () => setSelectedPlan('basic') 
          },
        ]
      );
      return;
    }

    Alert.alert(
      'Konfirmasi Pembayaran',
      selectedPlan === 'basic' 
        ? 'Anda akan berlangganan Basic seharga Rp 50.000/bulan'
        : 'Anda akan membeli paket Premium 3x Taaruf seharga Rp 300.000',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Bayar', onPress: () => console.log('Proceed to payment:', selectedPlan) },
      ]
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
        <Text style={styles.headerTitle}>Upgrade Akun</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.crownContainer}>
            <Crown size={48} color="#F59E0B" />
          </View>
          <Text style={styles.heroTitle}>Jadi Member Premium</Text>
          <Text style={styles.heroSubtitle}>
            Dapatkan akses penuh untuk menemukan pasangan hidup yang tepat
          </Text>
        </View>

        {/* Subscription Status */}
        {hasBasicSubscription && (
          <View style={styles.statusBadge}>
            <Check size={16} color="#10B981" />
            <Text style={styles.statusText}>Anda sudah berlangganan Basic</Text>
          </View>
        )}

        {/* Plans Container */}
        <View style={styles.plansContainer}>
          {/* BASIC PLAN - Required */}
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'basic' && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan('basic')}
          >
            {/* Required Badge */}
            <View style={styles.requiredBadge}>
              <Text style={styles.requiredText}>WAJIB</Text>
            </View>

            <View style={styles.planHeader}>
              <View style={[styles.planIcon, { backgroundColor: '#D1FAE5' }]}>
                <Star size={24} color="#10B981" />
              </View>
              <View style={styles.planTitleContainer}>
                <Text style={styles.planName}>Basic</Text>
                <Text style={styles.planSubtitle}>Langganan Bulanan</Text>
              </View>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.currency}>Rp</Text>
              <Text style={styles.price}>50.000</Text>
              <Text style={styles.period}>/bulan</Text>
            </View>

            <View style={styles.featuresContainer}>
              {BASIC_FEATURES.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.checkIcon}>
                    <Check size={14} color="#10B981" />
                  </View>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* Selection Indicator */}
            <View style={[
              styles.selectionIndicator,
              selectedPlan === 'basic' && styles.selectionIndicatorActive
            ]]}>
              {selectedPlan === 'basic' && <Check size={20} color="#FFFFFF" />}
            </View>
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>ATAU</Text>
            <View style={styles.orLine} />
          </View>

          {/* PREMIUM PLAN - Optional */}
          <TouchableOpacity
            style={[
              styles.planCard,
              styles.premiumCard,
              !hasBasicSubscription && styles.premiumCardDisabled,
              selectedPlan === 'premium' && styles.planCardSelectedPremium,
            ]}
            onPress={() => {
              if (!hasBasicSubscription) {
                Alert.alert(
                  'Wajib Basic Dulu',
                  'Anda harus berlangganan Basic 50rb terlebih dahulu untuk mengakses paket ini.'
                );
                return;
              }
              setSelectedPlan('premium');
            }}
          >
            {/* Lock Badge if no basic */}
            {!hasBasicSubscription && (
              <View style={styles.lockBadge}>
                <Lock size={16} color="#FFFFFF" />
                <Text style={styles.lockText}>Wajib Basic</Text>
              </View>
            )}

            {/* Best Value Badge */}
            {hasBasicSubscription && (
              <View style={styles.bestValueBadge}>
                <Text style={styles.bestValueText}>PALING POPULER</Text>
              </View>
            )}

            <View style={styles.planHeader}>
              <View style={[styles.planIcon, { backgroundColor: '#FEF3C7' }]}>
                <Crown size={24} color="#F59E0B" />
              </View>
              <View style={styles.planTitleContainer}>
                <Text style={[styles.planName, styles.premiumPlanName]}>Premium</Text>
                <Text style={styles.planSubtitle}>3x Taaruf + Pendampingan</Text>
              </View>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.currency}>Rp</Text>
              <Text style={[styles.price, styles.premiumPrice]}>300.000</Text>
              <Text style={styles.period}>sekali bayar</Text>
            </View>

            {/* Savings Badge */}
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsText}>Hemat Rp 150.000</Text>
            </View>

            <View style={styles.featuresContainer}>
              {PREMIUM_FEATURES.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={[styles.checkIcon, styles.premiumCheckIcon]}>
                    <Check size={14} color="#F59E0B" />
                  </View>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* Selection Indicator */}
            <View style={[
              styles.selectionIndicator,
              styles.premiumSelectionIndicator,
              selectedPlan === 'premium' && styles.premiumSelectionIndicatorActive
            ]]}>
              {selectedPlan === 'premium' && <Check size={20} color="#FFFFFF" />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Shield size={20} color="#10B981" />
          <Text style={styles.infoText}>
            Pembayaran aman dengan enkripsi. Garansi uang kembali dalam 7 hari.
          </Text>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <View style={styles.priceSummary}>
          <Text style={styles.summaryLabel}>Total:</Text>
          <Text style={styles.summaryPrice}>
            {selectedPlan === 'basic' ? 'Rp 50.000' : 
             selectedPlan === 'premium' ? 'Rp 300.000' : '-'}
          </Text>
          <Text style={styles.summaryPeriod}>
            {selectedPlan === 'basic' ? '/bulan' : selectedPlan === 'premium' ? 'sekali bayar' : ''}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.subscribeBtn, !selectedPlan && styles.subscribeBtnDisabled]}
          onPress={handleSubscribe}
          disabled={!selectedPlan}
        >
          <Text style={styles.subscribeBtnText}>
            {selectedPlan ? 'Bayar Sekarang' : 'Pilih Paket'}
          </Text>
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
    paddingTop: 16,
  },
  crownContainer: {
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
    color: '#111827',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D1FAE5',
    marginHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
  },
  plansContainer: {
    paddingHorizontal: 24,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  premiumCard: {
    borderColor: '#FCD34D',
    backgroundColor: '#FFFBEB',
  },
  premiumCardDisabled: {
    opacity: 0.6,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  planCardSelectedPremium: {
    borderColor: '#F59E0B',
    backgroundColor: '#FEF3C7',
  },
  requiredBadge: {
    position: 'absolute',
    top: -1,
    right: 20,
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  requiredText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  lockBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#6B7280',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  lockText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -1,
    right: 20,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  bestValueText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planTitleContainer: {
    flex: 1,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  premiumPlanName: {
    color: '#B45309',
  },
  planSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 8,
  },
  currency: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111827',
  },
  premiumPrice: {
    color: '#B45309',
  },
  period: {
    fontSize: 14,
    color: '#6B7280',
  },
  savingsBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803D',
  },
  featuresContainer: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumCheckIcon: {
    backgroundColor: '#FEF3C7',
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionIndicatorActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  premiumSelectionIndicator: {
    borderColor: '#FCD34D',
  },
  premiumSelectionIndicatorActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  orText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDF4',
    marginHorizontal: 24,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#065F46',
    lineHeight: 18,
  },
  actionBar: {
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
  priceSummary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  summaryPeriod: {
    fontSize: 12,
    color: '#6B7280',
  },
  subscribeBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  subscribeBtnDisabled: {
    backgroundColor: '#D1D5DB',
  },
  subscribeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
