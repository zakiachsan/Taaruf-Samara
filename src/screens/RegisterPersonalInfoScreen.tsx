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
import { 
  ChevronRight, 
  ChevronLeft, 
  DollarSign, 
  GraduationCap,
  Briefcase,
  Heart,
  Users,
  Calendar,
  Plus,
  Trash2,
} from 'lucide-react-native';

interface Child {
  id: string;
  gender: 'male' | 'female';
  age: string;
}

interface PersonalInfoData {
  profession: string;
  marriageStatus: string;
  children: Child[];
  marriageReadiness: string;
  marriageTarget: string;
  prayerCondition: string;
  manhaj: string;
  salary: string;
  education: string;
}

interface FormErrors {
  profession?: string;
  marriageStatus?: string;
  marriageReadiness?: string;
  prayerCondition?: string;
  salary?: string;
  education?: string;
}

interface Props {
  onNext: (data: PersonalInfoData) => void;
  onBack: () => void;
}

const PROFESSIONS = [
  'Pegawai Negeri Sipil (PNS)',
  'Militer/Polisi',
  'Pegawai Swasta',
  'Pegawai Honorer',
  'Wiraswasta',
  'Ibu Rumah Tangga (IRT)',
  'Mahasiswa/Pelajar',
  'Freelancer',
  'Lainnya',
];

const MARRIAGE_STATUS = [
  { value: 'lajang', label: 'Lajang' },
  { value: 'menikah', label: 'Menikah' },
  { value: 'cerai_hidup', label: 'Cerai Hidup' },
  { value: 'cerai_mati', label: 'Cerai Mati' },
];

const MARRIAGE_READINESS = [
  { value: 'sangat_siap', label: 'Sangat Siap' },
  { value: 'siap', label: 'Siap' },
  { value: 'cukup_siap', label: 'Cukup Siap' },
];

const PRAYER_CONDITIONS = [
  { value: 'terjaga', label: 'Terjaga (5 waktu)' },
  { value: 'bolong', label: 'Masih Bolong-bolong' },
];

const MANHAJ_OPTIONS = [
  'Salafi',
  'Nahdlatul Ulama (NU)',
  'Muhammadiyah',
  'Persis',
  'Prefer Tidak Pilih',
  'Lainnya',
];

const EDUCATION_LEVELS = [
  'SD',
  'SMP',
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
    profession: '',
    marriageStatus: '',
    children: [],
    marriageReadiness: '',
    marriageTarget: '',
    prayerCondition: '',
    manhaj: '',
    salary: '',
    education: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Dropdown states
  const [showProfessionDropdown, setShowProfessionDropdown] = useState(false);
  const [showMarriageStatusDropdown, setShowMarriageStatusDropdown] = useState(false);
  const [showManhajDropdown, setShowManhajDropdown] = useState(false);
  const [showEducationDropdown, setShowEducationDropdown] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.profession) {
      newErrors.profession = 'Profesi wajib dipilih';
    }

    if (!formData.marriageStatus) {
      newErrors.marriageStatus = 'Status pernikahan wajib dipilih';
    }

    if (!formData.marriageReadiness) {
      newErrors.marriageReadiness = 'Kesiapan menikah wajib dipilih';
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
    const numericValue = value.replace(/[^0-9]/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const addChild = () => {
    setFormData({
      ...formData,
      children: [
        ...formData.children,
        { id: Date.now().toString(), gender: 'male', age: '' },
      ],
    });
  };

  const removeChild = (id: string) => {
    setFormData({
      ...formData,
      children: formData.children.filter(child => child.id !== id),
    });
  };

  const updateChild = (id: string, field: 'gender' | 'age', value: string) => {
    setFormData({
      ...formData,
      children: formData.children.map(child =>
        child.id === id ? { ...child, [field]: value } : child
      ),
    });
  };

  const closeAllDropdowns = () => {
    setShowProfessionDropdown(false);
    setShowMarriageStatusDropdown(false);
    setShowManhajDropdown(false);
    setShowEducationDropdown(false);
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
          onScrollBeginDrag={closeAllDropdowns}
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
            
            {/* Profession */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                <Briefcase size={16} color="#6B7280" /> Profesi/Pekerjaan *
              </Text>
              <TouchableOpacity
                style={[styles.selectWrapper, errors.profession && styles.inputError]}
                onPress={() => {
                  closeAllDropdowns();
                  setShowProfessionDropdown(!showProfessionDropdown);
                }}
              >
                <Text style={[styles.selectText, !formData.profession && styles.placeholderText]}>
                  {formData.profession || 'Pilih profesi'}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
              {errors.profession && <Text style={styles.errorText}>{errors.profession}</Text>}

              {showProfessionDropdown && (
                <View style={styles.dropdown}>
                  <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                    {PROFESSIONS.map((profession) => (
                      <TouchableOpacity
                        key={profession}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setFormData({ ...formData, profession });
                          setShowProfessionDropdown(false);
                          if (errors.profession) setErrors({ ...errors, profession: undefined });
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{profession}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Marriage Status */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                <Heart size={16} color="#6B7280" /> Status Pernikahan *
              </Text>
              <TouchableOpacity
                style={[styles.selectWrapper, errors.marriageStatus && styles.inputError]}
                onPress={() => {
                  closeAllDropdowns();
                  setShowMarriageStatusDropdown(!showMarriageStatusDropdown);
                }}
              >
                <Text style={[styles.selectText, !formData.marriageStatus && styles.placeholderText]}>
                  {MARRIAGE_STATUS.find(s => s.value === formData.marriageStatus)?.label || 'Pilih status'}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
              {errors.marriageStatus && <Text style={styles.errorText}>{errors.marriageStatus}</Text>}

              {showMarriageStatusDropdown && (
                <View style={styles.dropdown}>
                  {MARRIAGE_STATUS.map((status) => (
                    <TouchableOpacity
                      key={status.value}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFormData({ ...formData, marriageStatus: status.value });
                        setShowMarriageStatusDropdown(false);
                        if (errors.marriageStatus) setErrors({ ...errors, marriageStatus: undefined });
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{status.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Children */}
            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>
                  <Users size={16} color="#6B7280" /> Anak yang Dimiliki
                </Text>
                <TouchableOpacity style={styles.addButton} onPress={addChild}>
                  <Plus size={16} color="#FFFFFF" />
                  <Text style={styles.addButtonText}>Tambah</Text>
                </TouchableOpacity>
              </View>
              
              {formData.children.length === 0 && (
                <Text style={styles.helperText}>Belum ada data anak. Tekan "Tambah" jika memiliki anak.</Text>
              )}

              {formData.children.map((child, index) => (
                <View key={child.id} style={styles.childCard}>
                  <View style={styles.childHeader}>
                    <Text style={styles.childTitle}>Anak ke-{index + 1}</Text>
                    <TouchableOpacity onPress={() => removeChild(child.id)}>
                      <Trash2 size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.childForm}>
                    <View style={styles.childField}>
                      <Text style={styles.childLabel}>Jenis Kelamin</Text>
                      <View style={styles.genderButtons}>
                        <TouchableOpacity
                          style={[
                            styles.genderButton,
                            child.gender === 'male' && styles.genderButtonActive,
                          ]}
                          onPress={() => updateChild(child.id, 'gender', 'male')}
                        >
                          <Text style={[
                            styles.genderButtonText,
                            child.gender === 'male' && styles.genderButtonTextActive,
                          ]}>Laki-laki</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.genderButton,
                            child.gender === 'female' && styles.genderButtonActive,
                          ]}
                          onPress={() => updateChild(child.id, 'gender', 'female')}
                        >
                          <Text style={[
                            styles.genderButtonText,
                            child.gender === 'female' && styles.genderButtonTextActive,
                          ]}>Perempuan</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.childField}>
                      <Text style={styles.childLabel}>Umur (tahun)</Text>
                      <TextInput
                        style={styles.childInput}
                        placeholder="Contoh: 5"
                        value={child.age}
                        onChangeText={(text) => updateChild(child.id, 'age', text.replace(/[^0-9]/g, ''))}
                        keyboardType="number-pad"
                        maxLength={2}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Marriage Readiness */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Kesiapan Menikah *</Text>
              <View style={styles.radioContainer}>
                {MARRIAGE_READINESS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.radioButton,
                      formData.marriageReadiness === option.value && styles.radioButtonActive,
                    ]}
                    onPress={() => {
                      setFormData({ ...formData, marriageReadiness: option.value });
                      if (errors.marriageReadiness) setErrors({ ...errors, marriageReadiness: undefined });
                    }}
                  >
                    <Text style={[
                      styles.radioText,
                      formData.marriageReadiness === option.value && styles.radioTextActive,
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.marriageReadiness && <Text style={styles.errorText}>{errors.marriageReadiness}</Text>}
            </View>

            {/* Marriage Target */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                <Calendar size={16} color="#6B7280" /> Target Menikah
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Contoh: Tahun 2025 atau 6 bulan lagi"
                value={formData.marriageTarget}
                onChangeText={(text) => setFormData({ ...formData, marriageTarget: text })}
              />
            </View>

            {/* Prayer Condition */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Kondisi Solat 5 Waktu *</Text>
              <View style={styles.radioContainer}>
                {PRAYER_CONDITIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.radioButton,
                      formData.prayerCondition === option.value && styles.radioButtonActive,
                    ]}
                    onPress={() => {
                      setFormData({ ...formData, prayerCondition: option.value });
                      if (errors.prayerCondition) setErrors({ ...errors, prayerCondition: undefined });
                    }}
                  >
                    <Text style={[
                      styles.radioText,
                      formData.prayerCondition === option.value && styles.radioTextActive,
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.prayerCondition && <Text style={styles.errorText}>{errors.prayerCondition}</Text>}
            </View>

            {/* Manhaj */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Manhaj/Aliran</Text>
              <TouchableOpacity
                style={styles.selectWrapper}
                onPress={() => {
                  closeAllDropdowns();
                  setShowManhajDropdown(!showManhajDropdown);
                }}
              >
                <Text style={[styles.selectText, !formData.manhaj && styles.placeholderText]}>
                  {formData.manhaj || 'Pilih manhaj (opsional)'}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>

              {showManhajDropdown && (
                <View style={styles.dropdown}>
                  {MANHAJ_OPTIONS.map((manhaj) => (
                    <TouchableOpacity
                      key={manhaj}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFormData({ ...formData, manhaj });
                        setShowManhajDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{manhaj}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Salary */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                <DollarSign size={16} color="#6B7280" /> Gaji per Bulan *
              </Text>
              <View style={[styles.inputWrapper, errors.salary && styles.inputError]}>
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
              <Text style={styles.label}>
                <GraduationCap size={16} color="#6B7280" /> Pendidikan Terakhir *
              </Text>
              <TouchableOpacity
                style={[styles.selectWrapper, errors.education && styles.inputError]}
                onPress={() => {
                  closeAllDropdowns();
                  setShowEducationDropdown(!showEducationDropdown);
                }}
              >
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
    zIndex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    flexWrap: 'wrap',
    gap: 8,
  },
  radioButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    fontSize: 14,
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
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: '#F9FAFB',
    fontSize: 16,
    color: '#111827',
  },
  helperText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  childCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 8,
  },
  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  childTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  childForm: {
    flexDirection: 'row',
    gap: 12,
  },
  childField: {
    flex: 1,
  },
  childLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  childInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  genderButtonActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  genderButtonText: {
    fontSize: 12,
    color: '#6B7280',
  },
  genderButtonTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
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
