import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  ChevronLeft,
  Heart,
  FileText,
  MessageSquare,
  Brain,
  CheckCircle,
  ArrowRight,
} from 'lucide-react-native';

interface Props {
  onBack: () => void;
  onStartTaaruf?: () => void;
}

const TAARUF_MATERIALS = [
  {
    id: 1,
    title: 'Tes Self Value',
    icon: Heart,
    color: '#EC4899',
    bgColor: '#FDF2F8',
    description: 'Bahan dasar awal persiapan pra taaruf',
    points: [
      'Mengetahui kualitas diri',
      'Evaluasi kesiapan mental',
      'Identifikasi kekurangan & bagasi emosi',
      'Memahami kebutuhan dalam hidup',
      'Menentukan kategori jodoh yang tepat',
    ],
  },
  {
    id: 2,
    title: 'Bedah CV',
    icon: FileText,
    color: '#3B82F6',
    bgColor: '#EFF6FF',
    description: 'Mencocokkan data CV dengan aslinya',
    points: [
      'Pengecekan dokumen (KTP, Akte Cerai/Kematian, KK, KTA, dll)',
      'Mengetahui chemistry pasangan',
      'Hal yang disukai dan dihindari',
      'Cara berkomunikasi & bahasa cinta',
      'Aktivitas sehari-hari',
    ],
  },
  {
    id: 3,
    title: 'Bedah Masalah',
    icon: MessageSquare,
    color: '#10B981',
    bgColor: '#ECFDF5',
    description: 'Simulasi masalah rumah tangga',
    points: [
      'Mengukur tingkat kedewasaan',
      'Menilai kemandirian',
      'Memahami karakter asli',
      'Mengetahui wawasan & keseriusan',
      'Menguji kejujuran',
    ],
  },
  {
    id: 4,
    title: 'Tes Stifin',
    icon: Brain,
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    description: 'Tes kepribadian dengan metode Stifin',
    points: [
      'Dilakukan offline dengan promotor Stifin',
      'Langsung dari lembaga Stifin resmi',
      'Tersedia di berbagai wilayah',
      'Opsional (bagi yang mampu)',
    ],
    optional: true,
  },
];

const PENDAMPINGAN_INFO = {
  title: 'Pendampingan Admin via WhatsApp',
  details: [
    {
      icon: '👥',
      text: 'Pendampingan 3x pertemuan untuk satu pasangan',
    },
    {
      icon: '🔄',
      text: '3x kesempatan memilih pasangan berbeda jika tidak cocok',
    },
    {
      icon: '💬',
      text: '3x pertemuan online via WhatsApp',
    },
    {
      icon: '🤝',
      text: '1x pertemuan offline saat Nadzor',
    },
    {
      icon: '📚',
      text: 'Materi dibahas runut dengan diskusi aktif',
    },
  ],
};

export default function TaarufMaterialsScreen({ onBack, onStartTaaruf }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ChevronLeft size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Materi Taaruf</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Proses Taaruf yang Terstruktur</Text>
          <Text style={styles.heroSubtitle}>
            4 tahap materi untuk membantu Anda menemukan pasangan yang tepat
          </Text>
        </View>

        {/* Pendampingan Info */}
        <View style={styles.pendampinganCard}>
          <Text style={styles.pendampinganTitle}>
            {PENDAMPINGAN_INFO.title}
          </Text>
          <View style={styles.pendampinganList}>
            {PENDAMPINGAN_INFO.details.map((item, index) => (
              <View key={index} style={styles.pendampinganItem}>
                <Text style={styles.pendampinganIcon}>{item.icon}</Text>
                <Text style={styles.pendampinganText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Materials List */}
        <View style={styles.materialsSection}>
          <Text style={styles.sectionTitle}>4 Materi Taaruf</Text>
          
          {TAARUF_MATERIALS.map((material) => {
            const IconComponent = material.icon;
            return (
              <View key={material.id} style={styles.materialCard}>
                <View style={styles.materialHeader}>
                  <View style={[styles.materialIconContainer, { backgroundColor: material.bgColor }]}>
                    <IconComponent size={24} color={material.color} />
                  </View>
                  <View style={styles.materialHeaderText}>
                    <View style={styles.materialTitleRow}>
                      <Text style={styles.materialNumber}>{material.id}.</Text>
                      <Text style={styles.materialTitle}>{material.title}</Text>
                      {material.optional && (
                        <View style={styles.optionalBadge}>
                          <Text style={styles.optionalText}>Opsional</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.materialDescription}>{material.description}</Text>
                  </View>
                </View>
                
                <View style={styles.pointsList}>
                  {material.points.map((point, index) => (
                    <View key={index} style={styles.pointItem}>
                      <CheckCircle size={16} color={material.color} />
                      <Text style={styles.pointText}>{point}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>

        {/* CTA Section */}
        {onStartTaaruf && (
          <View style={styles.ctaSection}>
            <TouchableOpacity style={styles.ctaButton} onPress={onStartTaaruf}>
              <Text style={styles.ctaButtonText}>Mulai Proses Taaruf</Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#FDF2F8',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  pendampinganCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  pendampinganTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 16,
  },
  pendampinganList: {
    gap: 12,
  },
  pendampinganItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  pendampinganIcon: {
    fontSize: 18,
  },
  pendampinganText: {
    flex: 1,
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
  },
  materialsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  materialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  materialHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  materialIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  materialHeaderText: {
    flex: 1,
  },
  materialTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  materialNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },
  materialTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  optionalBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 4,
  },
  optionalText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
  },
  materialDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  pointsList: {
    gap: 10,
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  pointText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EC4899',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
