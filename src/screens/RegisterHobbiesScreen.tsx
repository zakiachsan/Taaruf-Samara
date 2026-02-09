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
import { ChevronRight, ChevronLeft, Plus, X, Heart, Music, BookOpen, Gamepad2, Dumbbell, Palette, Plane, Camera, Coffee, Film } from 'lucide-react-native';

interface Props {
  onNext: (hobbies: string[], interests: string[]) => void;
  onBack: () => void;
}

const PRESET_HOBBIES = [
  { id: 'reading', label: 'Membaca', icon: BookOpen },
  { id: 'music', label: 'Musik', icon: Music },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'sports', label: 'Olahraga', icon: Dumbbell },
  { id: 'art', label: 'Seni', icon: Palette },
  { id: 'travel', label: 'Traveling', icon: Plane },
  { id: 'photography', label: 'Fotografi', icon: Camera },
  { id: 'culinary', label: 'Kuliner', icon: Coffee },
  { id: 'movies', label: 'Film', icon: Film },
];

const PRESET_INTERESTS = [
  'Teknologi', 'Bisnis', 'Fashion', 'Kesehatan', 'Pendidikan',
  'Politik', 'Lingkungan', 'Sosial', 'Agama', 'Keluarga',
  'Karir', 'Keuangan', 'Otomotif', 'Desain', 'Fotografi',
];

export default function RegisterHobbiesScreen({ onNext, onBack }: Props) {
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [customHobby, setCustomHobby] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleHobby = (hobby: string) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(selectedHobbies.filter(h => h !== hobby));
    } else {
      setSelectedHobbies([...selectedHobbies, hobby]);
    }
  };

  const addCustomHobby = () => {
    if (customHobby.trim() && !selectedHobbies.includes(customHobby.trim())) {
      setSelectedHobbies([...selectedHobbies, customHobby.trim()]);
      setCustomHobby('');
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !selectedInterests.includes(customInterest.trim())) {
      setSelectedInterests([...selectedInterests, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const handleNext = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    onNext(selectedHobbies, selectedInterests);
  };

  const renderIcon = (IconComponent: any) => (
    <IconComponent size={20} color="#6B7280" />
  );

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
            <Text style={styles.title}>Hobi & Minat</Text>
            <Text style={styles.subtitle}>Langkah 5 dari 6</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '83%' }]} />
            </View>
            <Text style={styles.progressText}>83%</Text>
          </View>

          {/* Hobbies Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hobi</Text>
            <Text style={styles.sectionSubtitle}>Pilih hobi yang Anda sukai</Text>

            <View style={styles.chipsContainer}>
              {PRESET_HOBBIES.map((hobby) => {
                const isSelected = selectedHobbies.includes(hobby.label);
                return (
                  <TouchableOpacity
                    key={hobby.id}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => toggleHobby(hobby.label)}
                  >
                    {renderIcon(hobby.icon)}
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {hobby.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom Hobby Input */}
            <View style={styles.customInputContainer}>
              <TextInput
                style={styles.customInput}
                placeholder="Tambah hobi lain..."
                value={customHobby}
                onChangeText={setCustomHobby}
                onSubmitEditing={addCustomHobby}
              />
              <TouchableOpacity style={styles.addButton} onPress={addCustomHobby}>
                <Plus size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Selected Hobbies */}
            {selectedHobbies.length > 0 && (
              <View style={styles.selectedContainer}>
                <Text style={styles.selectedLabel}>Hobi terpilih:</Text>
                <View style={styles.selectedChips}>
                  {selectedHobbies.map((hobby, index) => (
                    <View key={index} style={styles.selectedChip}>
                      <Text style={styles.selectedChipText}>{hobby}</Text>
                      <TouchableOpacity onPress={() => toggleHobby(hobby)}>
                        <X size={14} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Interests Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Minat</Text>
            <Text style={styles.sectionSubtitle}>Topik yang Anda minati</Text>

            <View style={styles.chipsContainer}>
              {PRESET_INTERESTS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <TouchableOpacity
                    key={interest}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => toggleInterest(interest)}
                  >
                    <Heart size={16} color={isSelected ? '#FFFFFF' : '#6B7280'} />
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {interest}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Custom Interest Input */}
            <View style={styles.customInputContainer}>
              <TextInput
                style={styles.customInput}
                placeholder="Tambah minat lain..."
                value={customInterest}
                onChangeText={setCustomInterest}
                onSubmitEditing={addCustomInterest}
              />
              <TouchableOpacity style={styles.addButton} onPress={addCustomInterest}>
                <Plus size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Selected Interests */}
            {selectedInterests.length > 0 && (
              <View style={styles.selectedContainer}>
                <Text style={styles.selectedLabel}>Minat terpilih:</Text>
                <View style={styles.selectedChips}>
                  {selectedInterests.map((interest, index) => (
                    <View key={index} style={styles.selectedChip}>
                      <Text style={styles.selectedChipText}>{interest}</Text>
                      <TouchableOpacity onPress={() => toggleInterest(interest)}>
                        <X size={14} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  chipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  chipText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  customInputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#10B981',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedContainer: {
    marginTop: 8,
  },
  selectedLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  selectedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#D1FAE5',
  },
  selectedChipText: {
    fontSize: 13,
    color: '#065F46',
    fontWeight: '500',
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
