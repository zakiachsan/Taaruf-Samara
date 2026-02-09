import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ChevronRight, ChevronLeft, Camera, CreditCard, CheckCircle } from 'lucide-react-native';

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

export default function RegisterKTPScreen({ onComplete, onBack }: Props) {
  const [ktpPhoto, setKtpPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const pickKTPImage = () => {
    Alert.alert(
      'Upload KTP',
      'Pilih sumber foto KTP',
      [
        {
          text: 'Kamera',
          onPress: () => {
            setKtpPhoto('mock_ktp_camera');
          },
        },
        {
          text: 'Galeri',
          onPress: () => {
            setKtpPhoto('mock_ktp_gallery');
          },
        },
        {
          text: 'Batal',
          style: 'cancel',
        },
      ]
    );
  };

  const handleComplete = async () => {
    if (!ktpPhoto) {
      Alert.alert('KTP Wajib', 'Foto KTP wajib diupload untuk verifikasi');
      return;
    }

    if (!agreeTerms) {
      Alert.alert('Syarat & Ketentuan', 'Anda harus menyetujui syarat dan ketentuan');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    onComplete();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Verifikasi KTP</Text>
          <Text style={styles.subtitle}>Langkah 6 dari 6 - Terakhir!</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
          <Text style={styles.progressText}>100%</Text>
        </View>

        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <View style={styles.successIconCircle}>
            <CheckCircle size={50} color="#10B981" />
          </View>
          <Text style={styles.successText}>Hampir Selesai!</Text>
        </View>

        {/* KTP Upload */}
        <View style={styles.ktpContainer}>
          <Text style={styles.ktpLabel}>Upload Foto KTP *</Text>
          <Text style={styles.ktpSubtitle}>
            Data KTP Anda akan diverifikasi dan disimpan dengan aman
          </Text>

          <TouchableOpacity
            style={[styles.ktpBox, ktpPhoto && styles.ktpBoxFilled]}
            onPress={pickKTPImage}
          >
            {ktpPhoto ? (
              <View style={styles.ktpPreview}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/300x200' }}
                  style={styles.previewImage}
                />
                <View style={styles.changeOverlay}>
                  <Camera size={24} color="#FFFFFF" />
                  <Text style={styles.changeText}>Ganti Foto KTP</Text>
                </View>
              </View>
            ) : (
              <View style={styles.uploadContent}>
                <CreditCard size={50} color="#9CA3AF" />
                <Text style={styles.uploadTitle}>Tap untuk upload KTP</Text>
                <Text style={styles.uploadSubtitle}>
                  Pastikan foto KTP terlihat jelas dan tidak blur
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* KTP Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Tips foto KTP yang baik:</Text>
            <Text style={styles.tipText}>• Pastikan pencahayaan cukup terang</Text>
            <Text style={styles.tipText}>• Seluruh bagian KTP terlihat jelas</Text>
            <Text style={styles.tipText}>• Hindari refleksi cahaya di KTP</Text>
            <Text style={styles.tipText}>• Jangan edit atau crop foto</Text>
          </View>
        </View>

        {/* Terms & Conditions */}
        <TouchableOpacity
          style={styles.termsContainer}
          onPress={() => setAgreeTerms(!agreeTerms)}
        >
          <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
            {agreeTerms && <CheckCircle size={16} color="#FFFFFF" />}
          </View>
          <Text style={styles.termsText}>
            Saya menyetujui{' '}
            <Text style={styles.termsLink}>Syarat dan Ketentuan</Text>
            {' '}serta{' '}
            <Text style={styles.termsLink}>Kebijakan Privasi</Text>
            {' '}Taaruf Samara
          </Text>
        </TouchableOpacity>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ChevronLeft size={20} color="#374151" />
            <Text style={styles.backButtonText}>Kembali</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.completeButton,
              (!ktpPhoto || !agreeTerms) && styles.completeButtonDisabled,
            ]}
            onPress={handleComplete}
            disabled={(!ktpPhoto || !agreeTerms) || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.completeButtonText}>Daftar Sekarang</Text>
                <ChevronRight size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  ktpContainer: {
    marginBottom: 24,
  },
  ktpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  ktpSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  ktpBox: {
    height: 200,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    borderStyle: 'dashed',
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  ktpBoxFilled: {
    borderStyle: 'solid',
    borderColor: '#10B981',
  },
  uploadContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  ktpPreview: {
    flex: 1,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  changeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  tipsContainer: {
    marginTop: 16,
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  termsLink: {
    color: '#10B981',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  completeButton: {
    flex: 2,
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  completeButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
