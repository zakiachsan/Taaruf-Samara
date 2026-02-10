import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Share,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  ChevronLeft,
  Gift,
  Users,
  Wallet,
  Copy,
  Share2,
  ChevronRight,
  Clock,
  CheckCircle,
  X,
  CreditCard,
} from 'lucide-react-native';
import { useReferral } from '../hooks/useReferral';

interface Props {
  onBack: () => void;
  onWithdraw?: () => void;
}

const COMMISSION_AMOUNT = 10000; // Rp 10,000 per successful referral

export default function ReferralScreen({ onBack }: Props) {
  const {
    referralCode,
    stats,
    availableBalance,
    referralHistory,
    loading,
    refetch,
    requestWithdrawal,
  } = useReferral();

  const [refreshing, setRefreshing] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const referralLink = `https://taarufsamara.com/join?ref=${referralCode}`;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCopyCode = () => {
    // Note: In real app, use expo-clipboard package
    // For now just show alert with the code
    Alert.alert('Kode Referral', referralCode, [
      { text: 'OK' }
    ]);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Bergabunglah dengan Taaruf Samara! Gunakan kode referral saya: ${referralCode}\n\n${referralLink}`,
        title: 'Ajak Teman ke Taaruf Samara',
      });
    } catch (error: any) {
      console.error('Error sharing:', error);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !bankName || !accountNumber || !accountName) {
      Alert.alert('Perhatian', 'Lengkapi semua data penarikan');
      return;
    }

    const amount = parseInt(withdrawAmount);
    if (isNaN(amount) || amount < 50000) {
      Alert.alert('Perhatian', 'Minimum penarikan Rp 50.000');
      return;
    }

    if (amount > availableBalance) {
      Alert.alert('Perhatian', 'Saldo tidak mencukupi');
      return;
    }

    setIsSubmitting(true);
    try {
      await requestWithdrawal(amount, bankName, accountNumber, accountName);
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setBankName('');
      setAccountNumber('');
      setAccountName('');
      Alert.alert('Berhasil', 'Permintaan penarikan berhasil dikirim');
    } catch (error: any) {
      Alert.alert('Gagal', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading && referralHistory.length === 0) {
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
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ChevronLeft size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Program Referral</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />
        }
      >
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Gift size={40} color="#6366F1" />
          </View>
          <Text style={styles.heroTitle}>Ajak Teman, Dapat Komisi!</Text>
          <Text style={styles.heroSubtitle}>
            Dapatkan {formatCurrency(COMMISSION_AMOUNT)} untuk setiap teman yang berlangganan Basic
          </Text>
        </View>

        {/* Referral Code */}
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Kode Referral Anda</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{referralCode || '---'}</Text>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopyCode}>
              <Copy size={20} color="#6366F1" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Share2 size={20} color="#FFFFFF" />
            <Text style={styles.shareBtnText}>Bagikan ke Teman</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#E0E7FF' }]}>
              <Users size={20} color="#6366F1" />
            </View>
            <Text style={styles.statNumber}>{stats.totalReferrals}</Text>
            <Text style={styles.statLabel}>Total Referral</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#D1FAE5' }]}>
              <CheckCircle size={20} color="#10B981" />
            </View>
            <Text style={styles.statNumber}>{stats.successfulReferrals}</Text>
            <Text style={styles.statLabel}>Berhasil</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FEF3C7' }]}>
              <Clock size={20} color="#F59E0B" />
            </View>
            <Text style={styles.statNumber}>{stats.pendingReferrals}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Earnings Card */}
        <View style={styles.earningsCard}>
          <View style={styles.earningsRow}>
            <View>
              <Text style={styles.earningsLabel}>Saldo Tersedia</Text>
              <Text style={styles.earningsAmount}>{formatCurrency(availableBalance)}</Text>
            </View>
            <TouchableOpacity
              style={[styles.withdrawBtn, availableBalance < 50000 && styles.withdrawBtnDisabled]}
              onPress={() => setShowWithdrawModal(true)}
              disabled={availableBalance < 50000}
            >
              <Wallet size={18} color="#FFFFFF" />
              <Text style={styles.withdrawBtnText}>Tarik</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.earningsDetails}>
            <Text style={styles.detailText}>
              Total Pendapatan: {formatCurrency(stats.totalEarnings)}
            </Text>
            <Text style={styles.detailText}>
              Sudah Ditarik: {formatCurrency(stats.withdrawnAmount)}
            </Text>
            {stats.pendingWithdrawal > 0 && (
              <Text style={styles.detailTextPending}>
                Dalam Proses: {formatCurrency(stats.pendingWithdrawal)}
              </Text>
            )}
          </View>
        </View>

        {/* History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Riwayat Referral</Text>
          {referralHistory.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyText}>Belum ada referral</Text>
            </View>
          ) : (
            referralHistory.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                {item.referred_photo ? (
                  <Image source={{ uri: item.referred_photo }} style={styles.historyAvatar} />
                ) : (
                  <View style={[styles.historyAvatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarText}>{item.referred_name.charAt(0)}</Text>
                  </View>
                )}
                <View style={styles.historyInfo}>
                  <Text style={styles.historyName}>{item.referred_name}</Text>
                  <Text style={styles.historyDate}>{formatDate(item.created_at)}</Text>
                </View>
                <View style={styles.historyStatus}>
                  {item.status === 'successful' ? (
                    <>
                      <Text style={styles.historyReward}>+{formatCurrency(item.reward_amount)}</Text>
                      <CheckCircle size={16} color="#10B981" />
                    </>
                  ) : item.status === 'pending' ? (
                    <View style={styles.pendingBadge}>
                      <Clock size={14} color="#F59E0B" />
                      <Text style={styles.pendingText}>Pending</Text>
                    </View>
                  ) : (
                    <Text style={styles.failedText}>Gagal</Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Withdraw Modal */}
      <Modal
        visible={showWithdrawModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWithdrawModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tarik Saldo</Text>
              <TouchableOpacity onPress={() => setShowWithdrawModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.balanceInfo}>
              Saldo tersedia: {formatCurrency(availableBalance)}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Jumlah Penarikan</Text>
              <TextInput
                style={styles.input}
                placeholder="Minimum Rp 50.000"
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nama Bank</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: BCA, Mandiri, BNI"
                value={bankName}
                onChangeText={setBankName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nomor Rekening</Text>
              <TextInput
                style={styles.input}
                placeholder="Nomor rekening tujuan"
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nama Pemilik Rekening</Text>
              <TextInput
                style={styles.input}
                placeholder="Nama sesuai rekening"
                value={accountName}
                onChangeText={setAccountName}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
              onPress={handleWithdraw}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <CreditCard size={20} color="#FFFFFF" />
                  <Text style={styles.submitBtnText}>Ajukan Penarikan</Text>
                </>
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
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
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
  heroCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  codeCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  codeLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366F1',
    letterSpacing: 2,
  },
  copyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    borderRadius: 12,
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  earningsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  earningsLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  earningsAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10B981',
  },
  withdrawBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  withdrawBtnDisabled: {
    backgroundColor: '#D1D5DB',
  },
  withdrawBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  earningsDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailTextPending: {
    fontSize: 14,
    color: '#F59E0B',
  },
  historySection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  emptyHistory: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historyAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  historyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  historyName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  historyDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  historyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyReward: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingText: {
    fontSize: 12,
    color: '#D97706',
  },
  failedText: {
    fontSize: 12,
    color: '#EF4444',
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
  balanceInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
