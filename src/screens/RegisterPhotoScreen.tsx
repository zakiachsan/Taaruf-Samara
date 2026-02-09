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
import { ChevronRight, ChevronLeft, Camera, User, Upload } from 'lucide-react-native';

interface PhotoData {
  profilePhoto: string | null;
  fullBodyPhoto: string | null;
  selfiePhoto: string | null;
}

interface Props {
  onNext: (data: PhotoData) => void;
  onBack: () => void;
}

export default function RegisterPhotoScreen({ onNext, onBack }: Props) {
  const [photos, setPhotos] = useState<PhotoData>({
    profilePhoto: null,
    fullBodyPhoto: null,
    selfiePhoto: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mock image picker - in real app use react-native-image-picker
  const pickImage = (type: keyof PhotoData) => {
    Alert.alert(
      'Pilih Foto',
      'Pilih sumber foto',
      [
        {
          text: 'Kamera',
          onPress: () => {
            // Mock - in real app open camera
            setPhotos({
              ...photos,
              [type]: 'mock_camera_image',
            });
          },
        },
        {
          text: 'Galeri',
          onPress: () => {
            // Mock - in real app open gallery
            setPhotos({
              ...photos,
              [type]: 'mock_gallery_image',
            });
          },
        },
        {
          text: 'Batal',
          style: 'cancel',
        },
      ]
    );
  };

  const handleNext = async () => {
    if (!photos.profilePhoto || !photos.fullBodyPhoto) {
      Alert.alert('Foto Wajib', 'Foto profil dan foto sebadan wajib diupload');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    onNext(photos);
  };

  const renderPhotoBox = (
    type: keyof PhotoData,
    title: string,
    subtitle: string,
    isRequired: boolean,
    icon: React.ReactNode
  ) => (
    <View style={styles.photoContainer}>
      <Text style={styles.photoLabel}>
        {title} {isRequired && <Text style={styles.requiredStar}>*</Text>}
      </Text>
      <Text style={styles.photoSubtitle}>{subtitle}</Text>
      
      <TouchableOpacity
        style={[styles.photoBox, photos[type] && styles.photoBoxFilled]}
        onPress={() => pickImage(type)}
      >
        {photos[type] ? (
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Upload Foto</Text>
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
          <Text style={styles.infoText}>• Foto wajah: Wajib (close up, terlihat jelas)</Text>
          <Text style={styles.infoText}>• Foto sebadan: Wajib (full body, berdiri)</Text>
          <Text style={styles.infoText}>• Foto selfie: Opsional (untuk verifikasi)</Text>
        </View>

        {/* Photo Uploads */}
        <View style={styles.photosGrid}>
          {renderPhotoBox(
            'profilePhoto',
            'Foto Profil',
            'Close up wajah, background polos',
            true,
            <User size={40} color="#9CA3AF" />
          )}

          {renderPhotoBox(
            'fullBodyPhoto',
            'Foto Sebadan',
            'Full body, berdiri tegak',
            true,
            <Upload size={40} color="#9CA3AF" />
          )}

          {renderPhotoBox(
            'selfiePhoto',
            'Foto Selfie',
            'Verifikasi wajah (opsional)',
            false,
            <Camera size={40} color="#9CA3AF" />
          )}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ChevronLeft size={20} color="#374151" />
            <Text style={styles.backButtonText}>Kembali</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.nextButton, (!photos.profilePhoto || !photos.fullBodyPhoto) && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={(!photos.profilePhoto || !photos.fullBodyPhoto) || isLoading}
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
    gap: 20,
    marginBottom: 24,
  },
  photoContainer: {
    gap: 8,
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
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  photoBox: {
    height: 180,
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
  uploadContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
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
    fontSize: 14,
    fontWeight: '500',
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
  nextButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
