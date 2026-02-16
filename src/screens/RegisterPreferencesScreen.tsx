import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ChevronRight, ChevronLeft, Users, Heart } from 'lucide-react-native';

interface PreferencesData {
  partnerEthnicities: string[];
  partnerHijab: string;
}

interface Props {
  onNext: (data: PreferencesData) => void;
  onBack: () => void;
  gender: 'male' | 'female'; // User's gender to customize UI
}

const ETHNICITIES = [
  'Jawa',
  'Sunda',
  'Batak',
  'Minang',
  'Melayu',
  'Bugis',
  'Betawi',
  'Madura',
  'Aceh',
  'Bali',
  'Banjar',
  'Sasak',
  'Tionghoa',
  'Arab',
  'Lainnya',
  'Tidak Ada Preferensi',
];

const HIJAB_OPTIONS_MALE = [
  { value: 'berhijab', label: 'Berhijab' },
  { value: 'bercadar', label: 'Bercadar' },
  { value: 'tidak_ada_preferensi', label: 'Tidak Ada Preferensi' },
];

export default function RegisterPreferencesScreen({ onNext, onBack, gender }: Props) {
  const [data, setData] = useState<PreferencesData>({
    partnerEthnicities: [],
    partnerHijab: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const toggleEthnicity = (ethnicity: string) => {
    if (ethnicity === 'Tidak Ada Preferensi') {
      // If "Tidak Ada Preferensi" is selected, clear all others
      setData({ ...data, partnerEthnicities: ['Tidak Ada Preferensi'] });
    } else {
      // Remove "Tidak Ada Preferensi" if selecting specific ethnicity
      let newList = data.partnerEthnicities.filter(e => e !== 'Tidak Ada Preferensi');
      
      if (newList.includes(ethnicity)) {
        newList = newList.filter(e => e !== ethnicity);
      } else {
        newList = [...newList, ethnicity];
      }
      setData({ ...data, partnerEthnicities: newList });
    }
  };

  const handleNext = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    onNext(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Preferensi Pasangan</Text>
          <Text style={styles.subtitle}>Langkah 5 dari 6</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '83%' }]} />
          </View>
          <Text style={styles.progressText}>83%</Text>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Heart size={20} color="#10B981" />
          <Text style={styles.infoText}>
            Preferensi ini akan membantu kami mencarikan pasangan yang sesuai dengan kriteria Anda. Pilihan bersifat opsional.
          </Text>
        </View>

        {/* Ethnicity Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Users size={18} color="#374151" /> Preferensi Suku
          </Text>
          <Text style={styles.sectionSubtitle}>Pilih satu atau lebih suku yang Anda preferensikan</Text>
          
          <View style={styles.chipContainer}>
            {ETHNICITIES.map((ethnicity) => (
              <TouchableOpacity
                key={ethnicity}
                style={[
                  styles.chip,
                  data.partnerEthnicities.includes(ethnicity) && styles.chipActive,
                ]}
                onPress={() => toggleEthnicity(ethnicity)}
              >
                <Text style={[
                  styles.chipText,
                  data.partnerEthnicities.includes(ethnicity) && styles.chipTextActive,
                ]}>
                  {ethnicity}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Hijab Preference (only for male users looking for female partner) */}
        {gender === 'male' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferensi Hijab Pasangan</Text>
            <Text style={styles.sectionSubtitle}>Pilih preferensi penampilan pasangan Anda</Text>
            
            <View style={styles.radioContainer}>
              {HIJAB_OPTIONS_MALE.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.radioButton,
                    data.partnerHijab === option.value && styles.radioButtonActive,
                  ]}
                  onPress={() => setData({ ...data, partnerHijab: option.value })}
                >
                  <View style={styles.radioCircle}>
                    {data.partnerHijab === option.value && (
                      <View style={styles.radioCircleFilled} />
                    )}
                  </View>
                  <Text style={[
                    styles.radioText,
                    data.partnerHijab === option.value && styles.radioTextActive,
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Summary */}
        {(data.partnerEthnicities.length > 0 || data.partnerHijab) && (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Ringkasan Preferensi:</Text>
            {data.partnerEthnicities.length > 0 && (
              <Text style={styles.summaryText}>
                Suku: {data.partnerEthnicities.join(', ')}
              </Text>
            )}
            {gender === 'male' && data.partnerHijab && (
              <Text style={styles.summaryText}>
                Hijab: {HIJAB_OPTIONS_MALE.find(o => o.value === data.partnerHijab)?.label}
              </Text>
            )}
          </View>
        )}

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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  chipActive: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  chipText: {
    fontSize: 14,
    color: '#4B5563',
  },
  chipTextActive: {
    color: '#047857',
    fontWeight: '600',
  },
  radioContainer: {
    gap: 12,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    gap: 12,
  },
  radioButtonActive: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleFilled: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
  },
  radioText: {
    fontSize: 15,
    color: '#4B5563',
  },
  radioTextActive: {
    color: '#047857',
    fontWeight: '600',
  },
  summaryBox: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 13,
    color: '#3B82F6',
    marginBottom: 4,
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
