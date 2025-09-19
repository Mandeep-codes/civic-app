import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Platform,
} from 'react-native';
import { Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Eye } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface Report {
  id: string;
  type: string;
  description: string;
  image: string;
  location: any;
  district: string;
  area: string;
  status: 'submitted' | 'acknowledged' | 'in-progress' | 'resolved';
  timestamp: string;
}

const STATUS_CONFIG = {
  submitted: { label: 'Submitted / जमा की गई', icon: Clock, color: '#f59e0b' },
  acknowledged: { label: 'Acknowledged / स्वीकार की गई', icon: Eye, color: '#3b82f6' },
  'in-progress': { label: 'In Progress / प्रगति में', icon: AlertCircle, color: '#8b5cf6' },
  resolved: { label: 'Resolved / हल की गई', icon: CheckCircle, color: '#10b981' },
};

const ISSUE_LABELS: { [key: string]: string } = {
  pothole: 'Pothole / सड़क में गड्ढा',
  streetlight: 'Street Light / बिजली की रोशनी',
  garbage: 'Garbage / कचरा',
  water: 'Water Supply / पानी की आपूर्ति',
  drainage: 'Drainage / नाली',
  other: 'Other / अन्य',
};

export default function ReportsScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadReports();
    }, [])
  );

  const loadReports = async () => {
    try {
      const storedReports = await AsyncStorage.getItem('reports');
      if (storedReports) {
        const parsedReports = JSON.parse(storedReports);
        // Sort by timestamp descending (newest first)
        parsedReports.sort((a: Report, b: Report) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setReports(parsedReports);
      }
    } catch (error) {
      console.log('Error loading reports:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    
    // Simulate status updates (in real app, this would fetch from backend)
    const updatedReports = reports.map(report => {
      if (report.status === 'submitted' && Math.random() > 0.7) {
        return { ...report, status: 'acknowledged' as const };
      }
      if (report.status === 'acknowledged' && Math.random() > 0.8) {
        return { ...report, status: 'in-progress' as const };
      }
      if (report.status === 'in-progress' && Math.random() > 0.9) {
        return { ...report, status: 'resolved' as const };
      }
      return report;
    });

    if (JSON.stringify(updatedReports) !== JSON.stringify(reports)) {
      await AsyncStorage.setItem('reports', JSON.stringify(updatedReports));
      setReports(updatedReports);
    }
    
    setRefreshing(false);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (reports.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Reports</Text>
          <Text style={styles.headerSubtitle}>मेरी रिपोर्ट्स</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No Reports Yet</Text>
          <Text style={styles.emptySubtitle}>
            You haven't submitted any civic issues yet.{'\n'}
            कोई रिपोर्ट अभी तक जमा नहीं की गई है।
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Reports</Text>
        <Text style={styles.headerSubtitle}>मेरी रिपोर्ट्स ({reports.length})</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {reports.map((report) => {
          const statusConfig = STATUS_CONFIG[report.status];
          const StatusIcon = statusConfig.icon;
          
          return (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportType}>
                    {ISSUE_LABELS[report.type] || report.type}
                  </Text>
                  <Text style={styles.reportDate}>
                    {formatDate(report.timestamp)}
                  </Text>
                  <Text style={styles.reportId}>
                    ID: {report.id.slice(-6)}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
                  <StatusIcon size={16} color={statusConfig.color} />
                  <Text style={[styles.statusText, { color: statusConfig.color }]}>
                    {statusConfig.label}
                  </Text>
                </View>
              </View>

              <Text style={styles.reportDescription} numberOfLines={2}>
                {report.description}
              </Text>

              <View style={styles.reportLocation}>
                <Text style={styles.locationText}>
                  📍 {report.district}{report.area ? `, ${report.area}` : ''}
                </Text>
              </View>

              {report.image && (
                <Image source={{ uri: report.image }} style={styles.reportImage} />
              )}

              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: report.status === 'submitted' ? '25%' : 
                             report.status === 'acknowledged' ? '50%' : 
                             report.status === 'in-progress' ? '75%' : '100%',
                      backgroundColor: statusConfig.color
                    }
                  ]} 
                />
              </View>
            </View>
          );
        })}

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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  reportCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  reportId: {
    fontSize: 12,
    color: '#94a3b8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  reportLocation: {
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#64748b',
  },
  reportImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  bottomSpacing: {
    height: 24,
  },
});