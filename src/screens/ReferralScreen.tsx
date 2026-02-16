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
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  History,
  AlertCircle,
  Building2,
} from 'lucide-react-native';
import { useReferral } from '../hooks/useReferral';

interface Props {
  onBack: () => void;
  onWithdraw?: () => void;
}

const COMMISSION_AMOUNT = 10000; // Rp 10,000 per successful referral
const MIN_WITHDRAWAL = 50000;

type TabType = 'referrals' | 'transactions';

export default function ReferralScreen({ onBack }: Props) {
  const {
    referralCode,
    stats,
    referralBalance,
    referralHistory,
    transactions,
    loading,
    refetch,
    requestWithdrawal,
  } = useReferral();

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('referrals');
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
    Alert.alert('Kode Referral Disalin', referralCode, [
      { text: 'OK' }
    ]);
  };

  const handleCopyLink = () => {
    Alert.alert('Link Referral Disalin', referralLink, [
      { text: 'OK' }
    ]);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Bergabunglah dengan Taaruf Samara! Aplikasi taaruf Islami terpercaya.\n\nGunakan kode referral saya: ${referralCode}\n\nAtau klik link berikut:\n${referralLink}`,
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

    const amount = parseInt(withdrawAmount.replace(/\D/g, ''));
    if (isNaN(amount) || amount < MIN_WITHDRAWAL) {
      Alert.alert('Perhatian', `Minimum penarikan Rp ${MIN_WITHDRAWAL.toLocaleString('id-ID')}`);
      return;
    }

    if (amount > referralBalance) {
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
      Alert.alert(
        'Berhasil',
        'Permintaan penarikan berhasil dikirim. Dana akan ditransfer dalam 1-3 hari kerja.'
      );
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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View style={styles.balanceIcon}>
              <Wallet size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.balanceLabel}>Saldo Referral</Text>
          </View>
          <Text style={styles.balanceAmount}>{formatCurrency(referralBalance)}</Text>
          
          <View style={styles.balanceActions}>
            <TouchableOpacity
              style={[styles.withdrawButton, referralBalance < MIN_WITHDRAWAL && styles.withdrawButtonDisabled]}
              onPress={() => setShowWithdrawModal(true)}
              disabled={referralBalance < MIN_WITHDRAWAL}
            >
              <ArrowUpRight size={18} color={referralBalance >= MIN_WITHDRAWAL ? '#FFFFFF' : '#9CA3AF'} />
              <Text style={[
                styles.withdrawButtonText,
                referralBalance < MIN_WITHDRAWAL && styles.withdrawButtonTextDisabled
              ]}>
                Tarik Saldo
              </Text>
            </TouchableOpacity>
          </View>
          
          {referralBalance < MIN_WITHDRAWAL && (
            <View style={styles.minWithdrawalNote}>
              <AlertCircle size={14} color="#F59E0B" />
              <Text style={styles.minWithdrawalText}>
                Min. penarikan {formatCurrency(MIN_WITHDRAWAL)}
              </Text>
            </View>
          )}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalReferrals}</Text>
            <Text style={styles.statLabel}>Total Referral</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.statValueSuccess]}>{stats.successfulReferrals}</Text>
            <Text style={styles.statLabel}>Berhasil</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.statValuePending]}>{stats.pendingReferrals}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Referral Code Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bagikan & Dapatkan Komisi</Text>
          
          <View style={styles.codeCard}>
            <View style={styles.codeRow}>
              <View>
                <Text style={styles.codeLabel}>Kode Referral</Text>
                <Text style={styles.codeText}>{referralCode || '---'}</Text>
              </View>
              <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
                <Copy size={18} color="#6366F1" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.linkRow}>
              <Text style={styles.linkText} numberOfLines={1}>{referralLink}</Text>
              <TouchableOpacity onPress={handleCopyLink}>
                <Copy size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Share2 size={20} color="#FFFFFF" />
            <Text style={styles.shareButtonText}>Bagikan ke Teman</Text>
          </TouchableOpacity>

          <View style={styles.commissionInfo}>
            <Gift size={20} color="#10B981" />
            <Text style={styles.commissionText}>
              Dapatkan {formatCurrency(COMMISSION_AMOUNT)} untuk setiap teman yang berlangganan Basic
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'referrals' && styles.tabActive]}
            onPress={() => setActiveTab('referrals')}
          >
            <Users size={18} color={activeTab === 'referrals' ? '#6366F1' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'referrals' && styles.tabTextActive]}>
              Referral
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'transactions' && styles.tabActive]}
            onPress={() => setActiveTab('transactions')}
          >
            <History size={18} color={activeTab === 'transactions' ? '#6366F1' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'transactions' && styles.tabTextActive]}>
              Transaksi
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'referrals' ? (
          <View style={styles.listSection}>
            {referralHistory.length === 0 ? (
              <View style={styles.emptyState}>
                <Users size={48} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>Belum Ada Referral</Text>
                <Text style={styles.emptyText}>
                  Bagikan kode referral Anda dan dapatkan komisi!
                </Text>
              </View>
            ) : (
              referralHistory.map((item) => (
                <View key={item.id} style={styles.listItem}>
                  {item.referred_photo ? (
                    <Image source={{ uri: item.referred_photo }} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                      <Text style={styles.avatarText}>{item.referred_name.charAt(0)}</Text>
                    </View>
                  )}
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.referred_name}</Text>
                    <Text style={styles.itemDate}>{formatDate(item.created_at)}</Text>
                  </View>
                  <View style={styles.itemStatus}>
                    {item.status === 'completed' ? (
                      <>
                        <Text style={styles.itemReward}>+{formatCurrency(item.amount)}</Text>
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
        ) : (
          <View style={styles.listSection}>
            {transactions.length === 0 ? (
              <View style={styles.emptyState}>
                <History size={48} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>Belum Ada Transaksi</Text>
                <Text style={styles.emptyText}>
                  Riwayat transaksi saldo akan muncul di sini
                </Text>
              </View>
            ) : (
              transactions.map((tx) => (
                <View key={tx.id} style={styles.transactionItem}>
                  <View style={[
                    styles.txIcon,
                    tx.type === 'credit' ? styles.txIconCredit : styles.txIconDebit
                  ]}>
                    {tx.type === 'credit' ? (
                      <ArrowDownRight size={18} color="#10B981" />
                    ) : (
                      <ArrowUpRight size={18} color="#EF4444" />
                    )}
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={styles.txTitle}>{tx.description}</Text>
                    <Text style={styles.txDate}>{formatDateTime(tx.created_at)}</Text>
                  </View>
                  <View style={styles.txAmount}>
                    <Text style={[
                      styles.txAmountText,
                      tx.type === 'credit' ? styles.txAmountCredit : styles.txAmountDebit
                    ]}>
                      {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </Text>
                    {tx.status === 'pending' && (
                      <Text style={styles.txStatusPending}>Proses</Text>
                    )}
                    {tx.status === 'completed' && tx.type === 'debit' && (
                      <Text style={styles.txStatusSuccess}>Berhasil</Text>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* How It Works */}
        <View style={styles.howItWorks}>
          <Text style={styles.howItWorksTitle}>Cara Kerja</Text>
          <View style={styles.stepList}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Bagikan Kode</Text>
                <Text style={styles.stepDesc}>Bagikan kode referral ke teman Anda</Text>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Teman Mendaftar</Text>
                <Text style={styles.stepDesc}>Teman mendaftar dan langganan Basic</Text>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Dapat Komisi</Text>
                <Text style={styles.stepDesc}>Anda mendapat {formatCurrency(COMMISSION_AMOUNT)} per referral</Text>
              </View>
            </View>
          </View>
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

            <View style={styles.balanceDisplay}>
              <Text style={styles.balanceDisplayLabel}>Saldo Tersedia</Text>
              <Text style={styles.balanceDisplayAmount}>{formatCurrency(referralBalance)}</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Jumlah Penarikan *</Text>
              <View style={styles.amountInputWrapper}>
                <Text style={styles.currencyPrefix}>Rp</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder={MIN_WITHDRAWAL.toLocaleString('id-ID')}
                  value={withdrawAmount}
                  onChangeText={(text) => setWithdrawAmount(text.replace(/\D/g, ''))}
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.inputHint}>Minimum {formatCurrency(MIN_WITHDRAWAL)}</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nama Bank *</Text>
              <View style={styles.bankInputWrapper}>
                <Building2 size={18} color="#6B7280" />
                <TextInput
                  style={styles.bankInput}
                  placeholder="Contoh: BCA, Mandiri, BNI, BRI"
                  value={bankName}
                  onChangeText={setBankName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nomor Rekening *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nomor rekening tujuan"
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nama Pemilik Rekening *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nama sesuai rekening bank"
                value={accountName}
                onChangeText={setAccountName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.withdrawNote}>
              <AlertCircle size={16} color="#6B7280" />
              <Text style={styles.withdrawNoteText}>
                Dana akan ditransfer dalam 1-3 hari kerja setelah verifikasi
              </Text>
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
  balanceCard: {
    backgroundColor: '#6366F1',
    margin: 16,
    borderRadius: 20,
    padding: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  balanceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  withdrawButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  withdrawButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  withdrawButtonTextDisabled: {
    color: 'rgba(255,255,255,0.5)',
  },
  minWithdrawalNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    backgroundColor: 'rgba(245,158,11,0.2)',
    padding: 8,
    borderRadius: 8,
  },
  minWithdrawalText: {
    fontSize: 12,
    color: '#FCD34D',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statValueSuccess: {
    color: '#10B981',
  },
  statValuePending: {
    color: '#F59E0B',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  codeCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  codeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366F1',
    letterSpacing: 2,
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
  },
  linkText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  commissionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 10,
  },
  commissionText: {
    flex: 1,
    fontSize: 13,
    color: '#047857',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#EEF2FF',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#6366F1',
    fontWeight: '600',
  },
  listSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatar: {
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
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  itemDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  itemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemReward: {
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
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconCredit: {
    backgroundColor: '#D1FAE5',
  },
  txIconDebit: {
    backgroundColor: '#FEE2E2',
  },
  txInfo: {
    flex: 1,
    marginLeft: 12,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  txDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  txAmount: {
    alignItems: 'flex-end',
  },
  txAmountText: {
    fontSize: 14,
    fontWeight: '600',
  },
  txAmountCredit: {
    color: '#10B981',
  },
  txAmountDebit: {
    color: '#EF4444',
  },
  txStatusPending: {
    fontSize: 11,
    color: '#F59E0B',
    marginTop: 2,
  },
  txStatusSuccess: {
    fontSize: 11,
    color: '#10B981',
    marginTop: 2,
  },
  howItWorks: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  howItWorksTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  stepList: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
    marginLeft: 12,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  stepDesc: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
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
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  balanceDisplay: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  balanceDisplayLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  balanceDisplayAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366F1',
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  currencyPrefix: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 14,
  },
  inputHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  bankInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  bankInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
    marginLeft: 10,
  },
  withdrawNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  withdrawNoteText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
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
