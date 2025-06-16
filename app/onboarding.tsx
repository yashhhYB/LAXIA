import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { MapPin, Globe, Zap, CircleCheck as CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MatrixRain from '@/components/MatrixRain';
import AnimatedBackground from '@/components/AnimatedBackground';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [location] = useState('Delhi, India');
  const [step, setStep] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: 0.5,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  const countries = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'Germany', 'France', 'Japan', 'Singapore', 'UAE'
  ];

  const handleContinue = () => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      router.push('/user-type');
    });
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <MatrixRain opacity={0.1} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill,
                { width: progressWidth }
              ]}
            />
          </View>
          <Text style={styles.progressText}>Step 1 of 2</Text>
        </View>

        <View style={styles.content}>
          <Animated.View 
            style={[
              styles.headerContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['#40E0FF', '#8B5CF6']}
                style={styles.iconGradient}
              >
                <Globe size={width < 380 ? 28 : 32} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Setup Your Profile</Text>
            <Text style={styles.subtitle}>Let's personalize your legal experience with location-based insights</Text>
          </Animated.View>

          {/* Location Detection */}
          <Animated.View 
            style={[
              styles.locationCard,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={['#1F2937', '#111827']}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.cardIcon}
                >
                  <MapPin size={18} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Current Location</Text>
                  <Text style={styles.cardSubtitle}>{location}</Text>
                </View>
                <CheckCircle size={18} color="#10B981" />
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Country Selection */}
          <Animated.View 
            style={[
              styles.pickerContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.pickerLabel}>Select Your Country</Text>
            <View style={styles.pickerWrapper}>
              <LinearGradient
                colors={['#1F2937', '#111827']}
                style={styles.pickerGradient}
              >
                <Picker
                  selectedValue={selectedCountry}
                  onValueChange={setSelectedCountry}
                  style={styles.picker}
                  dropdownIconColor="#40E0FF"
                  itemStyle={styles.pickerItem}
                >
                  {countries.map((country) => (
                    <Picker.Item
                      key={country}
                      label={country}
                      value={country}
                      color="#FFFFFF"
                      style={styles.pickerItemStyle}
                    />
                  ))}
                </Picker>
              </LinearGradient>
            </View>
          </Animated.View>

          <Animated.View 
            style={[
              styles.buttonContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#40E0FF', '#8B5CF6']}
                style={styles.continueButtonGradient}
              >
                <Text style={styles.continueButtonText}>
                  Continue
                </Text>
                <Zap size={16} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  safeArea: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: width < 380 ? 20 : 30,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#40E0FF',
    borderRadius: 2,
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Rajdhani-Medium',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: width < 380 ? 20 : 30,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 35,
  },
  iconContainer: {
    marginBottom: 18,
  },
  iconGradient: {
    width: width < 380 ? 70 : 80,
    height: width < 380 ? 70 : 80,
    borderRadius: width < 380 ? 35 : 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  title: {
    fontSize: width < 380 ? 26 : 30,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: '#40E0FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: width < 380 ? 14 : 16,
    fontFamily: 'Rajdhani-Medium',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  locationCard: {
    marginBottom: 25,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  cardGradient: {
    padding: width < 380 ? 16 : 18,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: width < 380 ? 36 : 40,
    height: width < 380 ? 36 : 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: width < 380 ? 15 : 16,
    fontFamily: 'Orbitron-SemiBold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: width < 380 ? 13 : 14,
    fontFamily: 'Rajdhani-Medium',
    color: '#9CA3AF',
  },
  pickerContainer: {
    marginBottom: 35,
  },
  pickerLabel: {
    fontSize: width < 380 ? 15 : 16,
    fontFamily: 'Orbitron-Medium',
    color: '#FFFFFF',
    marginBottom: 12,
    textShadowColor: '#40E0FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  pickerWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  pickerGradient: {
    borderWidth: 1,
    borderColor: '#374151',
  },
  picker: {
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    fontFamily: 'Rajdhani-Medium',
    fontSize: width < 380 ? 14 : 16,
  },
  pickerItem: {
    backgroundColor: '#1F2937',
    color: '#FFFFFF',
    fontSize: width < 380 ? 14 : 16,
  },
  pickerItemStyle: {
    backgroundColor: '#1F2937',
    color: '#FFFFFF',
    fontSize: width < 380 ? 14 : 16,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  continueButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    width: width - (width < 380 ? 40 : 60),
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: width < 380 ? 14 : 16,
    paddingHorizontal: 40,
  },
  continueButtonText: {
    fontSize: width < 380 ? 16 : 18,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    marginRight: 8,
    letterSpacing: 1,
  },
});