import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { Camera, MapPin, Upload } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ISSUE_TYPES = [
  { id: 'pothole', label: 'Pothole / सड़क में गड्ढा', icon: '🕳️' },
  { id: 'streetlight', label: 'Street Light / बिजली की रोशनी', icon: '💡' },
  { id: 'garbage', label: 'Garbage / कचरा', icon: '🗑️' },
  { id: 'water', label: 'Water Supply / पानी की आपूर्ति', icon: '💧' },
  { id: 'drainage', label: 'Drainage / नाली', icon: '🚰' },
  { id: 'other', label: 'Other / अन्य', icon: '📋' },
];

const JHARKHAND_DISTRICTS = [
  'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh',
  'Giridih', 'Ramgarh', 'Medininagar', 'Chaibasa', 'Daltonganj', 'Dumka'
];

export default function ReportIssueScreen() {
  const [selectedIssue, setSelectedIssue] = useState<string>('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [area, setArea] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to report issues accurately.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      // Auto-detect district based on coordinates (simplified)
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      
      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        setArea(`${address.street || ''} ${address.subregion || ''}`);
        if (address.region) {
          const district = JHARKHAND_DISTRICTS.find(d => 
            address.region?.toLowerCase().includes(d.toLowerCase())
          );
          if (district) setSelectedDistrict(district);
        }
      }
    } catch (error) {
      console.log('Location error:', error);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Camera permission is required to take photos.');
        return;
      }
    }
    setShowCamera(true);
  };

  const handleCameraCapture = async (camera: any) => {
    try {
      const photo = await camera.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      setSelectedImage(photo.uri);
      setShowCamera(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const submitReport = async () => {
    if (!selectedIssue || !description.trim()) {
      Alert.alert('Missing Information', 'Please select issue type and provide description.');
      return;
    }

    if (!selectedImage) {
      Alert.alert('Photo Required', 'Please take a photo or select one from gallery.');
      return;
    }

    try {
      const reportId = Date.now().toString();
      const report = {
        id: reportId,
        type: selectedIssue,
        description: description.trim(),
        image: selectedImage,
        location: location,
        district: selectedDistrict,
        area: area,
        status: 'submitted',
        timestamp: new Date().toISOString(),
      };

      // Save to AsyncStorage (in real app, this would go to backend)
      const existingReports = await AsyncStorage.getItem('reports');
      const reports = existingReports ? JSON.parse(existingReports) : [];
      reports.push(report);
      await AsyncStorage.setItem('reports', JSON.stringify(reports));

      Alert.alert(
        'Report Submitted',
        `Your report has been submitted successfully! Report ID: ${reportId.slice(-6)}`,
        [{ text: 'OK', onPress: resetForm }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    }
  };

  const capturePhoto = async () => {
    try {
      // Simulate photo capture for now
      const timestamp = Date.now();
      const photoUri = `photo_${timestamp}.jpg`;
      setSelectedImage(photoUri);
      setShowCamera(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const resetForm = () => {
    setSelectedIssue('');
    setDescription('');
    setSelectedImage(null);
    setArea('');
  };

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
        >
          <View style={styles.cameraOverlay}>
            <TouchableOpacity
              style={styles.closeCamera}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.closeCameraText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={capturePhoto}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Report Civic Issue</Text>
        <Text style={styles.headerSubtitle}>झारखंड नागरिक शिकायत</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Issue Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Issue Type / समस्या का प्रकार</Text>
          <View style={styles.issueGrid}>
            {ISSUE_TYPES.map((issue) => (
              <TouchableOpacity
                key={issue.id}
                style={[
                  styles.issueCard,
                  selectedIssue === issue.id && styles.selectedIssueCard,
                ]}
                onPress={() => setSelectedIssue(issue.id)}
              >
                <Text style={styles.issueIcon}>{issue.icon}</Text>
                <Text style={[
                  styles.issueLabel,
                  selectedIssue === issue.id && styles.selectedIssueLabel,
                ]}>
                  {issue.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location / स्थान</Text>
          <View style={styles.locationContainer}>
            <MapPin size={20} color="#059669" />
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                {location ? 'Location detected' : 'Detecting location...'}
              </Text>
              <Text style={styles.locationSubText}>
                {selectedDistrict} {area && `, ${area}`}
              </Text>
            </View>
          </View>
          
          <View style={styles.inputRow}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>District / जिला</Text>
              <TextInput
                style={styles.input}
                value={selectedDistrict}
                onChangeText={setSelectedDistrict}
                placeholder="Select District"
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Area / क्षेत्र</Text>
              <TextInput
                style={styles.input}
                value={area}
                onChangeText={setArea}
                placeholder="Enter area"
              />
            </View>
          </View>
        </View>

        {/* Photo Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo Evidence / फोटो प्रमाण</Text>
          <View style={styles.photoActions}>
            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <Camera size={24} color="#059669" />
              <Text style={styles.photoButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
              <Upload size={24} color="#059669" />
              <Text style={styles.photoButtonText}>Upload Photo</Text>
            </TouchableOpacity>
          </View>
          
          {selectedImage && (
            <View style={styles.imagePreview}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeImage}
                onPress={() => setSelectedImage(null)}
              >
                <Text style={styles.removeImageText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description / विवरण</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the issue in detail... / समस्या का विस्तृत विवरण दें..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={submitReport}>
          <Text style={styles.submitButtonText}>Submit Report / रिपोर्ट जमा करें</Text>
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
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  issueGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  issueCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  selectedIssueCard: {
    borderColor: '#059669',
    backgroundColor: '#f0fdf4',
  },
  issueIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  issueLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedIssueLabel: {
    color: '#059669',
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  locationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  locationSubText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  photoButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  photoButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
  },
  imagePreview: {
    position: 'relative',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 8,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImage: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#ef4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  textArea: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 24,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  closeCamera: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeCameraText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#059669',
  },
});