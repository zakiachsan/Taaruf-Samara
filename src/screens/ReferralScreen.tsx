import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  Clipboard,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  ChevronLeft,
  Share2,
  Copy,
  Gift,
  Users,
  Wallet,
  ArrowRight,
  Check,
  Info,
} from 'lucide-react-native';

interface ReferralStats {
  totalInvited: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
  withdrawableAmount: number;
}

interface ReferralHistory {
  id: string;
  name: string;
  date: string;
  status: 'pending' | 'success';
  reward: number;
}

const MY_REFERRAL_CODE = 'TAARUF2024';

const REFERRAL_LINK = 'https://taarufsamara.id/ref/TAARUF2024';

const MOCK_STATS: ReferralStats = {
  totalInvited: 12,
  successfulReferrals: 5,
  pendingReferrals: 7,
  totalEarnings: 50000,
  withdrawableAmount: 50000,
};

const MOCK_HISTORY: ReferralHistory[] = [
  { id: '1', name: 'Ahmad Fauzi', date: '2 hari lalu', status: 'success', reward: 10000 },
  { id: '2', name: 'Budi Santoso', date: '3 hari lalu', status: 'success', reward: 10000 },
  { id: '3', name: 'Dewi Kartika', date: '5 hari lalu', status: 'success', reward: 10000 },
  { id: '4', name: 'Fatimah Zahra', date: '1 minggu lalu', status: 'pending', reward: 0 },
  { id: '5', name: 'Rina Susanti', date: '1 minggu lalu', status: 'success', reward: 10000 },
];

interface Props {
  onBack: () => void;
  onWithdraw: () => void;
}

export default function ReferralScreen({ onBack, onWithdraw }: Props) {
  const [referralCode, setReferralCode] = useState('');
  const [codeApplied, setCodeApplied] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    Clipboard.setString(text);
    Alert.alert('Tersalin', `${label} telah disalin ke clipboard`);
  };

  const shareReferral = () => {
    Alert.alert(
      'Bagikan Kode Referral',
      'Pilih metode berbagi',
      [
        { text: 'Salin Link', onPress: () => copyToClipboard(REFERRAL_LINK, 'Link referral') },
        { text: 'Salin Kode', onPress: () => copyToClipboard(MY_REFERRAL_CODE, 'Kode referral') },
        { text: 'Batal', style: 'cancel' },
      ]
    );
  };

  const applyReferralCode = () => {
    if (!referralCode.trim()) {
      Alert.alert('Error', 'Masukkan kode referral');
      return;
    }

    // Mock validation
    if (referralCode.toUpperCase() === MY_REFERRAL_CODE) {
      Alert.alert('Error', 'Anda tidak bisa menggunakan kode sendiri');
      return;
    }

    // Simulate API call
    Alert.alert(
      'Kode Berhasil Digunakan',
      `Anda menggunakan kode ${referralCode.toUpperCase()}. Bonus akan diberikan setelah berlangganan.`,
      [{ text: 'OK', onPress: () => {
        setCodeApplied(true);
        setShowInput(false);
      }}]
    );
  };

  const handleWithdraw = () => {
    if (MOCK_STATS.withdrawableAmount < 50000) {
      Alert.alert(
        'Minimal Withdraw',
        'Minimal penarikan adalah Rp 50.000'
      );
      return;
    }

    Alert.alert(
      'Konfirmasi Penarikan',
      `Anda akan menarik Rp ${MOCK_STATS.withdrawableAmount.toLocaleString('id-ID')} ke rekening Anda?`,
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Tarik', onPress: onWithdraw },
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
        <Text style={styles.headerTitle}>Referral</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Gift size={32} color="#F59E0B" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Dapatkan Rp 10.000!</Text>
            <Text style={styles.infoSubtitle}>
              Ajak teman berlangganan Basic (Rp 50.000) dan dapatkan komisi 20%
            </Text>
          </View>
        </View>

        {/* My Referral Code */}
        <View style={styles.codeSection}>
          <Text style={styles.sectionLabel}>Kode Referral Anda</Text>
          <View style={styles.codeContainer}>
            <Text style={styles.codeText}>{MY_REFERRAL_CODE}</Text>
            <View style={styles.codeActions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => copyToClipboard(MY_REFERRAL_CODE, 'Kode')}
              >
                <Copy size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.shareBtn]}
                onPress={shareReferral}
              >
                <Share2 size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.linkText}>{REFERRAL_LINK}</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Users size={24} color="#6366F1" />
            <Text style={styles.statNumber}>{MOCK_STATS.totalInvited}</Text>
            <Text style={styles.statLabel}>Total Diundang</Text>
          </View>
          <View style={styles.statCard}>
            <Check size={24} color="#10B981" />
            <Text style={styles.statNumber}>{MOCK_STATS.successfulReferrals}</Text>
            <Text style={styles.statLabel}>Berhasil</Text>
          </View>
          <View style={styles.statCard}>
            <Wallet size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>
              Rp {MOCK_STATS.totalEarnings.toLocaleString('id-ID')}
            </Text>
            <Text style={styles.statLabel}>Total Komisi</Text>
          </View>
        </View>

        {/* Withdraw Card */}
        <View style={styles.withdrawCard}>
          <View style={styles.withdrawHeader}>
            <Wallet size={24} color="#10B981" />
            <Text style={styles.withdrawTitle}>Saldo Tersedia</Text>
          </View>
          <Text style={styles.balanceText}>
            Rp {MOCK_STATS.withdrawableAmount.toLocaleString('id-ID')}
          </Text>
          <Text style={styles.minWithdraw}>
            Minimal penarikan: Rp 50.000
          </Text>
          <TouchableOpacity
            style={[
              styles.withdrawBtn,
              MOCK_STATS.withdrawableAmount < 50000 && styles.withdrawBtnDisabled,
            ]}
            onPress={handleWithdraw}
            disabled={MOCK_STATS.withdrawableAmount < 50000}
          >
            <Text style={styles.withdrawBtnText}>Tarik Saldo</Text>
            <ArrowRight size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* How it Works */}
        <View style={styles.howItWorks}>
          <Text style={styles.sectionTitle}>Cara Kerja</Text>
          <View style={styles.steps}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Bagikan Kode</Text>
                <Text style={styles.stepDesc}>
                  Bagikan kode referral Anda ke teman melalui WhatsApp, Instagram, atau media sosial
                </Text>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Teman Berlangganan</Text>
                <Text style={styles.stepDesc}>
                  Teman Anda mendaftar dan berlangganan Basic (Rp 50.000)
                </Text>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Dapatkan Komisi</Text>
                <Text style={styles.stepDesc}>
                  Anda mendapatkan Rp 10.000 (20%) setiap teman berhasil berlangganan
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Riwayat Referral</Text>
          {MOCK_HISTORY.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <Text style={styles.historyName}>{item.name}</Text>
                <Text style={styles.historyDate}>{item.date}</Text>
              </View>
              <View style={styles.historyRight}>
                {item.status === 'success' ? (
                  <View style={styles.rewardBadge}>
                    <Text style={styles.rewardText}>
                      +Rp {item.reward.toLocaleString('id-ID')}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingText}>Menunggu</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Enter Referral Code */}
        {!codeApplied && (
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Punya Kode Referral?</Text>
            {!showInput ? (
              <TouchableOpacity
                style={styles.showInputBtn}
                onPress={() => setShowInput(true)}
              >
                <Text style={styles.showInputText}>Masukkan Kode</Text>
                <ArrowRight size={18} color="#10B981" />
              </TouchableOpacity>
            ) : (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan kode referral"
                  value={referralCode}
                  onChangeText={setReferralCode}
                  autoCapitalize="characters"
                  maxLength={20}
                />
                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={applyReferralCode}
                >
                  <Text style={styles.applyBtnText}>Gunakan</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {codeApplied && (
          <View style={styles.appliedBanner}>
            <Check size={20} color="#10B981" />
            <Text style={styles.appliedText}>
              Kode {referralCode.toUpperCase()} berhasil digunakan!
            </Text>
          </View>
        )}

        {/* Bottom padding */}
        <View style={{ height: 40 }} />
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFFBEB',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B45309',
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  codeSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    letterSpacing: 2,
  },
  codeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  shareBtn: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  linkText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  withdrawCard: {
    backgroundColor: '#F0FDF4',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#10B981',
    marginBottom: 24,
  },
  withdrawHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  withdrawTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
  },
  balanceText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  minWithdraw: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  withdrawBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
  },
  withdrawBtnDisabled: {
    backgroundColor: '#D1D5DB',
  },
  withdrawBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  howItWorks: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  steps: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  historySection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historyLeft: {},
  historyName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 13,
    color: '#6B7280',
  },
  historyRight: {},
  rewardBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rewardText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#065F46',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pendingText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#92400E',
  },
  inputSection: {
    paddingHorizontal: 16,
  },
  showInputBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  showInputText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#10B981',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  applyBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appliedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  appliedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
  },
});
