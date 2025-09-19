import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { ExternalLink, Shield, Users, ChartBar as BarChart3 } from 'lucide-react-native';

export default function DashboardScreen() {
  const handleDashboardLogin = () => {
    Alert.alert(
      'Municipal Dashboard',
      'You will be redirected to the official Jharkhand Municipal Dashboard. This is for authorized municipal staff only.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          onPress: () => {
            // In a real app, this would redirect to the actual municipal dashboard
            Linking.openURL('https://jharkhand.gov.in/municipal-dashboard');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Municipal Dashboard</Text>
        <Text style={styles.headerSubtitle}>नगरपालिका डैशबोर्ड</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Shield size={32} color="#059669" />
          <Text style={styles.infoTitle}>For Authorized Personnel Only</Text>
          <Text style={styles.infoSubtitle}>
            This dashboard is exclusively for municipal staff, contractors, and authorized government personnel.
          </Text>
          <Text style={styles.infoSubtitleHindi}>
            यह डैशबोर्ड केवल नगरपालिका कर्मचारियों, ठेकेदारों और अधिकृत सरकारी कर्मचारियों के लिए है।
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Dashboard Features</Text>
          
          <View style={styles.featureItem}>
            <BarChart3 size={24} color="#3b82f6" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Reports Analytics</Text>
              <Text style={styles.featureDescription}>
                View and analyze civic issue reports across Jharkhand districts
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Users size={24} color="#8b5cf6" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Staff Management</Text>
              <Text style={styles.featureDescription}>
                Assign issues to departments and track resolution progress
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <ExternalLink size={24} color="#f59e0b" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Integration Tools</Text>
              <Text style={styles.featureDescription}>
                Connect with existing municipal management systems
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleDashboardLogin}>
          <Text style={styles.loginButtonText}>Access Municipal Dashboard</Text>
          <Text style={styles.loginButtonSubtext}>नगरपालिका डैशबोर्ड एक्सेस करें</Text>
          <ExternalLink size={20} color="#ffffff" style={styles.loginButtonIcon} />
        </TouchableOpacity>

        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerTitle}>Important Notice</Text>
          <Text style={styles.disclaimerText}>
            • Login credentials are provided by your municipal authority{'\n'}
            • Unauthorized access is strictly prohibited{'\n'}
            • All activities are logged and monitored{'\n'}
            • Contact your IT administrator for access issues
          </Text>
          <Text style={styles.disclaimerTextHindi}>
            • लॉगिन क्रेडेंशियल आपके नगरपालिका प्राधिकरण द्वारा प्रदान किए जाते हैं{'\n'}
            • अनधिकृत पहुंच सख्त वर्जित है
          </Text>
        </View>
      </View>
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
    paddingTop: 20,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  infoSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  infoSubtitleHindi: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  featuresContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  loginButton: {
    backgroundColor: '#059669',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  loginButtonSubtext: {
    color: '#dcfce7',
    fontSize: 14,
  },
  loginButtonIcon: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -10,
  },
  disclaimerCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#a16207',
    lineHeight: 20,
    marginBottom: 8,
  },
  disclaimerTextHindi: {
    fontSize: 13,
    color: '#a16207',
    lineHeight: 18,
  },
});