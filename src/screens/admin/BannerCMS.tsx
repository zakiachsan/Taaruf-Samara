import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  ChevronLeft,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  Image as ImageIcon,
  Link,
  Calendar,
} from 'lucide-react-native';

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkTo: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  order: number;
}

const MOCK_BANNERS: Banner[] = [
  {
    id: '1',
    title: 'Diskon 50% Premium',
    subtitle: 'Berlangganan Basic hanya Rp 25.000',
    imageUrl: 'https://via.placeholder.com/400x200/10B981/FFFFFF?text=Diskon+50%25',
    linkTo: '/premium',
    isActive: true,
    startDate: '2026-02-01',
    endDate: '2026-02-28',
    order: 1,
  },
  {
    id: '2',
    title: 'Event Taaruf Online',
    subtitle: 'Bergabung dengan 100+ calon pasangan',
    imageUrl: 'https://via.placeholder.com/400x200/6366F1/FFFFFF?text=Event+Taaruf',
    linkTo: '/events/taaruf-online',
    isActive: true,
    order: 2,
  },
  {
    id: '3',
    title: 'Kisah Sukses',
    subtitle: 'Lihat cerita pasangan yang berhasil',
    imageUrl: 'https://via.placeholder.com/400x200/F59E0B/FFFFFF?text=Kisah+Sukses',
    linkTo: '/stories',
    isActive: false,
    order: 3,
  },
];

const LINK_OPTIONS = [
  { value: '/premium', label: 'Halaman Premium' },
  { value: '/events', label: 'Halaman Event' },
  { value: '/stories', label: 'Kisah Sukses' },
  { value: '/referral', label: 'Program Referral' },
  { value: '/self-value', label: 'Sertifikasi Self-Value' },
  { value: 'https://', label: 'Link Eksternal' },
];

interface Props {
  onBack: () => void;
}

export default function BannerCMS({ onBack }: Props) {
  const [banners, setBanners] = useState<Banner[]>(MOCK_BANNERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [showLinkDropdown, setShowLinkDropdown] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Banner>>({
    title: '',
    subtitle: '',
    imageUrl: '',
    linkTo: '',
    isActive: true,
  });

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      imageUrl: '',
      linkTo: '/premium',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({ ...banner });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.imageUrl) {
      Alert.alert('Error', 'Judul dan gambar wajib diisi');
      return;
    }

    if (editingBanner) {
      // Update existing
      setBanners(banners.map(b => 
        b.id === editingBanner.id 
          ? { ...b, ...formData } as Banner
          : b
      ));
    } else {
      // Add new
      const newBanner: Banner = {
        id: Date.now().toString(),
        title: formData.title || '',
        subtitle: formData.subtitle,
        imageUrl: formData.imageUrl || '',
        linkTo: formData.linkTo || '/premium',
        isActive: formData.isActive ?? true,
        order: banners.length + 1,
      };
      setBanners([...banners, newBanner]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (banner: Banner) => {
    Alert.alert(
      'Hapus Banner',
      `Anda yakin ingin menghapus "${banner.title}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: () => setBanners(banners.filter(b => b.id !== banner.id))
        },
      ]
    );
  };

  const toggleActive = (banner: Banner) => {
    setBanners(banners.map(b => 
      b.id === banner.id ? { ...b, isActive: !b.isActive } : b
    ));
  };

  const moveOrder = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === banners.length - 1) return;

    const newBanners = [...banners];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newBanners[index], newBanners[targetIndex]] = [newBanners[targetIndex], newBanners[index]];
    
    // Update order numbers
    newBanners.forEach((banner, i) => {
      banner.order = i + 1;
    });
    
    setBanners(newBanners);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ChevronLeft size={28} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kelola Banner</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{banners.length}</Text>
            <Text style={styles.statLabel}>Total Banner</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{banners.filter(b => b.isActive).length}</Text>
            <Text style={styles.statLabel}>Aktif</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{banners.filter(b => !b.isActive).length}</Text>
            <Text style={styles.statLabel}>Nonaktif</Text>
          </View>
        </View>

        {/* Banner List */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Daftar Banner</Text>
          
          {banners.map((banner, index) => (
            <View key={banner.id} style={styles.bannerCard}>
              {/* Order Number */}
              <View style={styles.orderBadge}>
                <Text style={styles.orderText}>{banner.order}</Text>
              </View>

              {/* Banner Preview */}
              <Image source={{ uri: banner.imageUrl }} style={styles.bannerImage} />

              {/* Banner Info */}
              <View style={styles.bannerInfo}>
                <View style={styles.bannerHeader}>
                  <Text style={styles.bannerTitle} numberOfLines={1}>{banner.title}</Text>
                  <TouchableOpacity
                    style={[styles.statusBadge, banner.isActive ? styles.activeBadge : styles.inactiveBadge]}
                    onPress={() => toggleActive(banner)}
                  >
                    <Text style={[styles.statusText, banner.isActive ? styles.activeText : styles.inactiveText]}>
                      {banner.isActive ? 'Aktif' : 'Nonaktif'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {banner.subtitle && (
                  <Text style={styles.bannerSubtitle} numberOfLines={1}>{banner.subtitle}</Text>
                )}
                
                <View style={styles.linkRow}>
                  <Link size={14} color="#6B7280" />
                  <Text style={styles.linkText} numberOfLines={1}>{banner.linkTo}</Text>
                </View>

                {(banner.startDate || banner.endDate) && (
                  <View style={styles.dateRow}>
                    <Calendar size={14} color="#6B7280" />
                    <Text style={styles.dateText}>
                      {banner.startDate} {banner.endDate && `- ${banner.endDate}`}
                    </Text>
                  </View>
                )}
              </View>

              {/* Actions */}
              <View style={styles.actionsContainer}>
                {/* Reorder */}
                <View style={styles.reorderButtons}>
                  <TouchableOpacity 
                    style={[styles.reorderBtn, index === 0 && styles.reorderBtnDisabled]}
                    onPress={() => moveOrder(index, 'up')}
                    disabled={index === 0}
                  >
                    <Text style={styles.reorderText}>↑</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.reorderBtn, index === banners.length - 1 && styles.reorderBtnDisabled]}
                    onPress={() => moveOrder(index, 'down')}
                    disabled={index === banners.length - 1}
                  >
                    <Text style={styles.reorderText}>↓</Text>
                  </TouchableOpacity>
                </View>

                {/* Edit/Delete */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => openEditModal(banner)}>
                    <Edit2 size={18} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(banner)}>
                    <Trash2 size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom padding */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingBanner ? 'Edit Banner' : 'Tambah Banner'}
              </Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Image URL */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>URL Gambar *</Text>
                <View style={styles.inputWrapper}>
                  <ImageIcon size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
                  />
                </View>
              </View>

              {/* Title */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Judul Banner *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan judul"
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                />
              </View>

              {/* Subtitle */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Subjudul (Opsional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Masukkan subjudul"
                  value={formData.subtitle}
                  onChangeText={(text) => setFormData({ ...formData, subtitle: text })}
                />
              </View>

              {/* Link To */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Link Tujuan *</Text>
                <TouchableOpacity
                  style={styles.selectInput}
                  onPress={() => setShowLinkDropdown(!showLinkDropdown)}
                >
                  <Link size={20} color="#6B7280" style={styles.inputIcon} />
                  <Text style={styles.selectText}>
                    {LINK_OPTIONS.find(o => o.value === formData.linkTo)?.label || 'Pilih link'}
                  </Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>

                {showLinkDropdown && (
                  <View style={styles.dropdown}>
                    {LINK_OPTIONS.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setFormData({ ...formData, linkTo: option.value });
                          setShowLinkDropdown(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{option.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Active Toggle */}
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Aktifkan Banner</Text>
                <TouchableOpacity
                  style={[styles.toggle, formData.isActive && styles.toggleActive]}
                  onPress={() => setFormData({ ...formData, isActive: !formData.isActive })}
                >
                  {formData.isActive && <Check size={16} color="#FFFFFF" />}
                </TouchableOpacity>
              </View>

              {/* Preview */}
              {formData.imageUrl && (
                <View style={styles.previewContainer}>
                  <Text style={styles.previewLabel}>Preview</Text>
                  <Image source={{ uri: formData.imageUrl }} style={styles.previewImage} />
                </View>
              )}

              {/* Save Button */}
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>
                  {editingBanner ? 'Simpan Perubahan' : 'Tambah Banner'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
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
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  listContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  bannerCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  orderBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  orderText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bannerImage: {
    width: 100,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  bannerInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeBadge: {
    backgroundColor: '#D1FAE5',
  },
  inactiveBadge: {
    backgroundColor: '#F3F4F6',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  activeText: {
    color: '#065F46',
  },
  inactiveText: {
    color: '#6B7280',
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  actionsContainer: {
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  reorderButtons: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  reorderBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reorderBtnDisabled: {
    opacity: 0.3,
  },
  reorderText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
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
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  selectText: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
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
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#111827',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D1D5DB',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#10B981',
    alignItems: 'flex-end',
  },
  previewContainer: {
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  saveBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
