import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { User, MapPin, Phone, Mail, Settings } from 'lucide-react-native';

export default function ProfileScreen() {
  const [userInfo, setUserInfo] = useState({
    name: 'Rahul Kumar',
    phone: '+91 9876543210',
    email: 'rahul.kumar@email.com',
    district: 'Ranchi',
    area: 'Doranda',
    pincode: '834002',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    Alert.alert('Profile Updated', 'Your profile information has been saved successfully.');
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          Alert.alert('Logged Out', 'You have been logged out successfully.');
        }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>प्रोफाइल</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <User size={48} color="#059669" />
          </View>
          <Text style={styles.userName}>{userInfo.name}</Text>
          <Text style={styles.userLocation}>
            📍 {userInfo.district}, Jharkhand
          </Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Settings size={20} color="#059669" />
              <Text style={styles.editButtonText}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <User size={20} color="#64748b" />
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={userInfo.name}
                onChangeText={(text) => setUserInfo({...userInfo, name: text})}
                placeholder="Full Name / पूरा नाम"
                editable={isEditing}
              />
            </View>

            <View style={styles.inputContainer}>
              <Phone size={20} color="#64748b" />
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={userInfo.phone}
                onChangeText={(text) => setUserInfo({...userInfo, phone: text})}
                placeholder="Phone Number / फोन नंबर"
                keyboardType="phone-pad"
                editable={isEditing}
              />
            </View>

            <View style={styles.inputContainer}>
              <Mail size={20} color="#64748b" />
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={userInfo.email}
                onChangeText={(text) => setUserInfo({...userInfo, email: text})}
                placeholder="Email Address / ईमेल पता"
                keyboardType="email-address"
                editable={isEditing}
              />
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Location Information / स्थान की जानकारी</Text>

          <View style={styles.inputGroup}>
            <View style={styles.inputContainer}>
              <MapPin size={20} color="#64748b" />
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={userInfo.district}
                onChangeText={(text) => setUserInfo({...userInfo, district: text})}
                placeholder="District / जिला"
                editable={isEditing}
              />
            </View>

            <View style={styles.inputContainer}>
              <MapPin size={20} color="#64748b" />
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={userInfo.area}
                onChangeText={(text) => setUserInfo({...userInfo, area: text})}
                placeholder="Area / क्षेत्र"
                editable={isEditing}
              />
            </View>

            <View style={styles.inputContainer}>
              <MapPin size={20} color="#64748b" />
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={userInfo.pincode}
                onChangeText={(text) => setUserInfo({...userInfo, pincode: text})}
                placeholder="Pincode / पिन कोड"
                keyboardType="numeric"
                editable={isEditing}
              />
            </View>
          </View>
        </View>

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes / परिवर्तन सेव करें</Text>
          </TouchableOpacity>
        )}

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Activity / आपकी गतिविधि</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Reports Submitted</Text>
              <Text style={styles.statLabelHindi}>रिपोर्ट्स जमा की गई</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Issues Resolved</Text>
              <Text style={styles.statLabelHindi}>समस्याएं हल की गई</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout / लॉग आउट</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 16,
    color: '#64748b',
  },
  infoSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#059669',
  },
  editButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
  },
  inputGroup: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  inputDisabled: {
    color: '#64748b',
  },
  saveButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  statLabelHindi: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 24,
  },
});