import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, GraduationCap, Plane, Sparkles, CircleCheck as CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MatrixRain from '@/components/MatrixRain';
import AnimatedBackground from '@/components/AnimatedBackground';

const { width, height } = Dimensions.get('window');

export default function UserTypeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0.5)).current;

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
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const userTypes = [
    {
      id: 'general',
      title: 'General Awareness',
      subtitle: 'Learn basic laws and rights for everyday life',
      icon: <User size={24} color="#FFFFFF" />,
      gradient: ['#40E0FF', '#1E40AF'],
      description: 'Perfect for citizens who want to understand their rights and responsibilities',
    },
    {
      id: 'student',
      title: 'Law Student',
      subtitle: 'Advanced legal studies and case analysis',
      icon: <GraduationCap size={24} color="#FFFFFF" />,
      gradient: ['#8B5CF6', '#7C3AED'],
      description: 'Comprehensive resources for law students and legal professionals',
    },
    {
      id: 'traveler',
      title: 'International Traveler',
      subtitle: 'Global legal guidance and travel laws',
      icon: <Plane size={24} color="#FFFFFF" />,
      gradient: ['#10B981', '#059669'],
      description: 'Essential legal information for international travel and business',
    },
  ];

  const handleUserTypeSelect = (userType: string) => {
    // Animate selection
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push('/(tabs)');
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
          <Text style={styles.progressText}>Step 2 of 2</Text>
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
                <Sparkles size={28} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Choose Your Path</Text>
            <Text style={styles.subtitle}>Select how you'll use LAXIA to get personalized content</Text>
          </Animated.View>

          <Animated.View 
            style={[
              styles.cardsContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {userTypes.map((type, index) => (
              <TouchableOpacity
                key={type.id}
                style={styles.typeCard}
                onPress={() => handleUserTypeSelect(type.id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#1F2937', '#111827']}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardContent}>
                    <LinearGradient
                      colors={type.gradient}
                      style={styles.cardIcon}
                    >
                      {type.icon}
                    </LinearGradient>
                    
                    <View style={styles.cardText}>
                      <Text style={styles.cardTitle}>{type.title}</Text>
                      <Text style={styles.cardSubtitle}>{type.subtitle}</Text>
                      <Text style={styles.cardDescription}>{type.description}</Text>
                    </View>
                    
                    <View style={styles.selectIndicator}>
                      <LinearGradient
                        colors={['#40E0FF20', '#40E0FF10']}
                        style={styles.selectIconContainer}
                      >
                        <CheckCircle size={16} color="#40E0FF" />
                      </LinearGradient>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
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
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  title: {
    fontSize: width < 380 ? 24 : 28,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
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
  cardsContainer: {
    gap: 16,
  },
  typeCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  cardGradient: {
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width < 380 ? 16 : 20,
  },
  cardIcon: {
    width: width < 380 ? 44 : 48,
    height: width < 380 ? 44 : 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardText: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: width < 380 ? 16 : 18,
    fontFamily: 'Orbitron-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: '#40E0FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  cardSubtitle: {
    fontSize: width < 380 ? 12 : 14,
    fontFamily: 'Rajdhani-SemiBold',
    color: '#40E0FF',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: width < 380 ? 11 : 12,
    fontFamily: 'Rajdhani-Medium',
    color: '#9CA3AF',
    lineHeight: 16,
  },
  selectIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#40E0FF40',
  },
});