import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ChevronRight, ChevronLeft, DollarSign, GraduationCap } from 'lucide-react-native';

interface PersonalInfoData {
  religion: string;
  prayerCondition: 'taat' | 'sedang' | '';
  salary: string;
  education: string;
}

interface FormErrors {
  religion?: string;
  prayerCondition?: string;
  salary?: string;
  education?: string;
}

interface Props {
  onNext: (data: PersonalInfoData) => void;
  onBack: () => void;
}

const RELIGIONS = [
  'Islam',
  'Kristen Protestan',
  'Kristen Katolik',
  'Hindu',
  'Buddha',
  'Konghucu',
];

const EDUCATION_LEVELS = [
  'SMA/SMK',
  'D1',
  'D2',
  'D3',
  'S1',
  'S2',
  'S3',
];

export default function RegisterPersonalInfoScreen({ onNext, onBack }: Props) {
  const [formData, setFormData] = useState<PersonalInfoData>({
    religion: '',
    prayerCondition: '',
    salary: '',
    education: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showReligionDropdown, setShowReligionDropdown] = useState(false);
  const [showEducationDropdown, setShowEducationDropdown] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.religion) {
      newErrors.religion = 'Agama wajib dipilih';
    }

    if (!formData.prayerCondition) {
      newErrors.prayerCondition = 'Kondisi ibadah wajib dipilih';
    }

    if (!formData.salary) {
      newErrors.salary = 'Gaji wajib diisi';
    }

    if (!formData.education) {
      newErrors.education = 'Pendidikan wajib dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    onNext(formData);
  };

  const formatSalary = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    // Format with thousand separator
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Informasi Pribadi</Text>
            <Text style={styles.subtitle}>Langkah 4 dari 6</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '66%' }]} />
            </View>
            <Text style={styles.progressText}>66%</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Religion */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Agama *</Text>
              <TouchableOpacity
                style={[styles.selectWrapper, errors.religion && styles.inputError]}
                onPress={() => setShowReligionDropdown(!showReligionDropdown)}
              >
                <Text style={[styles.selectText, !formData.religion && styles.placeholderText]}>
                  {formData.religion || 'Pilih agama'}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
              {errors.religion && <Text style={styles.errorText}>{errors.religion}</Text>}

              {showReligionDropdown && (
                <View style={styles.dropdown}>
                  {RELIGIONS.map((religion) => (
                    <TouchableOpacity
                      key={religion}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFormData({ ...formData, religion });
                        setShowReligionDropdown(false);
                        if (errors.religion) setErrors({ ...errors, religion: undefined });
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{religion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Prayer Condition */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Kondisi Ibadah *</Text>
              <View style={styles.radioContainer}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.prayerCondition === 'taat' && styles.radioButtonActive,
                  ]}
                  onPress={() => {
                    setFormData({ ...formData, prayerCondition: 'taat' });
                    if (errors.prayerCondition) setErrors({ ...errors, prayerCondition: undefined });
                  }}
                >
                  <Text style={[
                    styles.radioText,
                    formData.prayerCondition === 'taat' && styles.radioTextActive,
                  ]}>
                    Taat
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.prayerCondition === 'sedang' && styles.radioButtonActive,
                  ]}
                  onPress={() => {
                    setFormData({ ...formData, prayerCondition: 'sedang' });
                    if (errors.prayerCondition) setErrors({ ...errors, prayerCondition: undefined });
                  }}
                >
                  <Text style={[
                    styles.radioText,
                    formData.prayerCondition === 'sedang' && styles.radioTextActive,
                  ]}>
                    Sedang
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.prayerCondition && <Text style={styles.errorText}>{errors.prayerCondition}</Text>}
            </View>

            {/* Salary */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Gaji per Bulan *</Text>
              <View style={[styles.inputWrapper, errors.salary && styles.inputError]}>
                <DollarSign size={20} color="#6B7280" style={styles.inputIcon} />
                <Text style={styles.currencyPrefix}>Rp</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={formData.salary ? formatSalary(formData.salary) : ''}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, salary: numericValue });
                    if (errors.salary) setErrors({ ...errors, salary: undefined });
                  }}
                  keyboardType="number-pad"
                />
              </View>
              {errors.salary && <Text style={styles.errorText}>{errors.salary}</Text>}
            </View>

            {/* Education */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Pendidikan Terakhir *</Text>
              <TouchableOpacity
                style={[styles.selectWrapper, errors.education && styles.inputError]}
                onPress={() => setShowEducationDropdown(!showEducationDropdown)}
              >
                <GraduationCap size={20} color="#6B7280" style={styles.selectIcon} />
                <Text style={[styles.selectText, !formData.education && styles.placeholderText]}>
                  {formData.education || 'Pilih pendidikan'}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
              {errors.education && <Text style={styles.errorText}>{errors.education}</Text>}

              {showEducationDropdown && (
                <View style={styles.dropdown}>
                  {EDUCATION_LEVELS.map((education) => (
                    <TouchableOpacity
                      key={education}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFormData({ ...formData, education });
                        setShowEducationDropdown(false);
                        if (errors.education) setErrors({ ...errors, education: undefined });
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{education}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <ChevronLeft size={20} color="#374151" />
              <Text style={styles.backButtonText}>Kembali</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.nextButtonText}>Lanjutkan</Text>
                  <ChevronRight size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
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
  form: {
    gap: 20,
    marginBottom: 24,
  },
  inputContainer: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  selectWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: '#F9FAFB',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  selectIcon: {
    marginRight: 12,
  },
  selectText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#6B7280',
  },
  dropdown: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#111827',
  },
  radioContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  radioButtonActive: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  radioText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  radioTextActive: {
    color: '#10B981',
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: '#F9FAFB',
  },
  inputIcon: {
    marginRight: 8,
  },
  currencyPrefix: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
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
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
