import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ChevronRight, Mail, RefreshCw } from 'lucide-react-native';

interface Props {
  email: string;
  onNext: () => void;
  onBack: () => void;
}

export default function RegisterOTPScreen({ email, onNext, onBack }: Props) {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('OTP harus 6 digit');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API verification
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock verification - in real app, verify with backend
    if (otp === '123456') {
      setIsLoading(false);
      onNext();
    } else {
      setIsLoading(false);
      setError('Kode OTP salah. Coba 123456 untuk demo.');
    }
  };

  const handleResend = () => {
    setCountdown(60);
    Alert.alert('OTP Dikirim', `Kode OTP baru telah dikirim ke ${email}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Verifikasi Email</Text>
          <Text style={styles.subtitle}>Langkah 2 dari 6</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '33%' }]} />
          </View>
          <Text style={styles.progressText}>33%</Text>
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Mail size={40} color="#10B981" />
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          Kami telah mengirimkan kode OTP ke{'\n'}
          <Text style={styles.emailHighlight}>{email}</Text>
        </Text>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <TextInput
            style={[styles.otpInput, error && styles.otpInputError]}
            placeholder="000000"
            value={otp}
            onChangeText={(text) => {
              setOtp(text.replace(/[^0-9]/g, '').slice(0, 6));
              if (error) setError('');
            }}
            keyboardType="number-pad"
            maxLength={6}
          />
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <Text style={styles.hintText}>Masukkan 6 digit kode OTP</Text>
          )}
        </View>

        {/* Resend */}
        <View style={styles.resendContainer}>
          {countdown > 0 ? (
            <Text style={styles.countdownText}>
              Kirim ulang dalam <Text style={styles.countdownHighlight}>{countdown}s</Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend} style={styles.resendButton}>
              <RefreshCw size={16} color="#10B981" />
              <Text style={styles.resendText}>Kirim Ulang OTP</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Demo Hint */}
        <View style={styles.demoHint}>
          <Text style={styles.demoText}>Demo: Gunakan OTP "123456"</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Kembali</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.nextButton, otp.length !== 6 && styles.nextButtonDisabled]}
            onPress={handleVerify}
            disabled={otp.length !== 6 || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.nextButtonText}>Verifikasi</Text>
                <ChevronRight size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
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
    width: '100%',
    marginBottom: 32,
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
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  emailHighlight: {
    fontWeight: 'bold',
    color: '#111827',
  },
  otpContainer: {
    width: '100%',
    marginBottom: 24,
    alignItems: 'center',
  },
  otpInput: {
    width: 200,
    height: 60,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 8,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  otpInputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: '#EF4444',
  },
  hintText: {
    marginTop: 8,
    fontSize: 14,
    color: '#9CA3AF',
  },
  resendContainer: {
    marginBottom: 16,
    height: 40,
    justifyContent: 'center',
  },
  countdownText: {
    fontSize: 14,
    color: '#6B7280',
  },
  countdownHighlight: {
    color: '#10B981',
    fontWeight: '600',
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resendText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  demoHint: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 32,
  },
  demoText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
