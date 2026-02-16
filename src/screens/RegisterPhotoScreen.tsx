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
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ChevronRight, ChevronLeft, Camera, User, Ruler, Scale } from 'lucide-react-native';

interface PhotoData {
  photoCloseup: string | null;
  photoFullbody: string | null;
  heightCm: string;
  weightKg: string;
}

interface Props {
  onNext: (data: PhotoData) => void;
  onBack: () => void;
}

export default function RegisterPhotoScreen({ onNext, onBack }: Props) {
  const [data, setData] = useState<PhotoData>({
    photoCloseup: null,
    photoFullbody: null,
    heightCm: '',
    weightKg: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Mock image picker - in real app use react-native-image-picker
  const pickImage = (type: 'photoCloseup' | 'photoFullbody') => {
    Alert.alert(
      'Pilih Foto',
      'Pilih sumber foto',
      [
        {
          text: 'Kamera',
          onPress: () => {
            setData({
              ...data,
              [type]: 'mock_camera_image',
            });
            if (errors[type]) {
              setErrors({ ...errors, [type]: '' });
            }
          },
        },
        {
          text: 'Galeri',
          onPress: () => {
            setData({
              ...data,
              [type]: 'mock_gallery_image',
            });
            if (errors[type]) {
              setErrors({ ...errors, [type]: '' });
            }
          },
        },
        {
          text: 'Batal',
          style: 'cancel',
        },
      ]
    );
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!data.photoCloseup) {
      newErrors.photoCloseup = 'Foto close up wajib diupload';
    }

    if (!data.photoFullbody) {
      newErrors.photoFullbody = 'Foto sebadan wajib diupload';
    }

    if (!data.heightCm) {
      newErrors.heightCm = 'Tinggi badan wajib diisi';
    } else if (parseInt(data.heightCm) < 100 || parseInt(data.heightCm) > 250) {
      newErrors.heightCm = 'Tinggi badan tidak valid';
    }

    if (!data.weightKg) {
      newErrors.weightKg = 'Berat badan wajib diisi';
    } else if (parseInt(data.weightKg) < 30 || parseInt(data.weightKg) > 200) {
      newErrors.weightKg = 'Berat badan tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    onNext(data);
  };

  const renderPhotoBox = (
    type: 'photoCloseup' | 'photoFullbody',
    title: string,
    subtitle: string,
    icon: React.ReactNode
  ) => (
    <View style={styles.photoContainer}>
      <Text style={styles.photoLabel}>
        {title} <Text style={styles.requiredStar}>*</Text>
      </Text>
      <Text style={styles.photoSubtitle}>{subtitle}</Text>
      
      <TouchableOpacity
        style={[
          styles.photoBox, 
          data[type] && styles.photoBoxFilled,
          errors[type] && styles.photoBoxError,
        ]}
        onPress={() => pickImage(type)}
      >
        {data[type] ? (
          <View style={styles.photoPreview}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.previewImage}
            />
            <View style={styles.changeOverlay}>
              <Camera size={24} color="#FFFFFF" />
              <Text style={styles.changeText}>Ganti Foto</Text>
            </View>
          </View>
        ) : (
          <View style={styles.uploadContent}>
            {icon}
            <Text style={styles.uploadText}>Tap untuk upload</Text>
          </View>
        )}
      </TouchableOpacity>
      {errors[type] && <Text style={styles.errorText}>{errors[type]}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Foto & Fisik</Text>
          <Text style={styles.subtitle}>Langkah 3 dari 6</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '50%' }]} />
          </View>
          <Text style={styles.progressText}>50%</Text>
        </View>

        {/* Photo Requirements Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Ketentuan Foto:</Text>
          <Text style={styles.infoText}>• Foto close up: Wajah terlihat jelas, background polos</Text>
          <Text style={styles.infoText}>• Foto sebadan: Full body, posisi berdiri</Text>
          <Text style={styles.infoText}>• Pastikan foto tidak blur dan pencahayaan baik</Text>
        </View>

        {/* Photo Uploads */}
        <View style={styles.photosGrid}>
          {renderPhotoBox(
            'photoCloseup',
            'Foto Close Up',
            'Wajah terlihat jelas, tanpa filter',
            <User size={40} color="#9CA3AF" />
          )}

          {renderPhotoBox(
            'photoFullbody',
            'Foto Sebadan',
            'Full body dari kepala sampai kaki',
            <User size={40} color="#9CA3AF" />
          )}
        </View>

        {/* Physical Info */}
        <View style={styles.physicalSection}>
          <Text style={styles.sectionTitle}>Informasi Fisik</Text>
          
          <View style={styles.physicalRow}>
            {/* Height */}
            <View style={styles.physicalField}>
              <Text style={styles.physicalLabel}>
                <Ruler size={14} color="#6B7280" /> Tinggi Badan *
              </Text>
              <View style={[styles.physicalInput, errors.heightCm && styles.inputError]}>
                <TextInput
                  style={styles.input}
                  placeholder="170"
                  value={data.heightCm}
                  onChangeText={(text) => {
                    setData({ ...data, heightCm: text.replace(/[^0-9]/g, '') });
                    if (errors.heightCm) setErrors({ ...errors, heightCm: '' });
                  }}
                  keyboardType="number-pad"
                  maxLength={3}
                />
                <Text style={styles.unit}>cm</Text>
              </View>
              {errors.heightCm && <Text style={styles.errorText}>{errors.heightCm}</Text>}
            </View>

            {/* Weight */}
            <View style={styles.physicalField}>
              <Text style={styles.physicalLabel}>
                <Scale size={14} color="#6B7280" /> Berat Badan *
              </Text>
              <View style={[styles.physicalInput, errors.weightKg && styles.inputError]}>
                <TextInput
                  style={styles.input}
                  placeholder="65"
                  value={data.weightKg}
                  onChangeText={(text) => {
                    setData({ ...data, weightKg: text.replace(/[^0-9]/g, '') });
                    if (errors.weightKg) setErrors({ ...errors, weightKg: '' });
                  }}
                  keyboardType="number-pad"
                  maxLength={3}
                />
                <Text style={styles.unit}>kg</Text>
              </View>
              {errors.weightKg && <Text style={styles.errorText}>{errors.weightKg}</Text>}
            </View>
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
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 4,
  },
  photosGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  photoContainer: {
    flex: 1,
    gap: 6,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  requiredStar: {
    color: '#EF4444',
  },
  photoSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
  },
  photoBox: {
    height: 200,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    borderStyle: 'dashed',
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  photoBoxFilled: {
    borderStyle: 'solid',
    borderColor: '#10B981',
  },
  photoBoxError: {
    borderColor: '#EF4444',
  },
  uploadContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  photoPreview: {
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
    paddingVertical: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  changeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  physicalSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  physicalRow: {
    flexDirection: 'row',
    gap: 12,
  },
  physicalField: {
    flex: 1,
  },
  physicalLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  physicalInput: {
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
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  unit: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  errorText: {
    fontSize: 11,
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
