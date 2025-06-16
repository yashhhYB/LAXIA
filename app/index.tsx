import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Scale, Shield, Globe, Sparkles, Zap, Award } from 'lucide-react-native';
import MatrixRain from '@/components/MatrixRain';
import AnimatedBackground from '@/components/AnimatedBackground';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main entrance animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Continuous animations
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 10,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    rotateAnimation.start();
    pulseAnimation.start();
    floatAnimation.start();

    return () => {
      rotateAnimation.stop();
      pulseAnimation.stop();
      floatAnimation.stop();
    };
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <MatrixRain opacity={0.15} />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Floating particles */}
          <Animated.View 
            style={[
              styles.particle,
              styles.particle1,
              { transform: [{ translateY: floatAnim }] }
            ]}
          >
            <Sparkles size={20} color="#40E0FF" />
          </Animated.View>
          <Animated.View 
            style={[
              styles.particle,
              styles.particle2,
              { transform: [{ translateY: floatAnim }] }
            ]}
          >
            <Zap size={16} color="#8B5CF6" />
          </Animated.View>
          <Animated.View 
            style={[
              styles.particle,
              styles.particle3,
              { transform: [{ translateY: floatAnim }] }
            ]}
          >
            <Award size={18} color="#10B981" />
          </Animated.View>

          {/* Logo Section */}
          <Animated.View 
            style={[
              styles.logoContainer,
              { 
                transform: [
                  { scale: scaleAnim },
                  { scale: pulseAnim }
                ] 
              }
            ]}
          >
            <Animated.View 
              style={[
                styles.logoWrapper,
                { transform: [{ rotate: rotateInterpolate }] }
              ]}
            >
              <LinearGradient
                colors={['#40E0FF', '#8B5CF6', '#10B981']}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Scale size={70} color="#FFFFFF" strokeWidth={3} />
              </LinearGradient>
              
              {/* Outer glow ring */}
              <Animated.View 
                style={[
                  styles.glowRing,
                  { transform: [{ rotate: rotateInterpolate }, { scale: pulseAnim }] }
                ]}
              />
            </Animated.View>
            
            <Animated.Text 
              style={[
                styles.appName,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              LAXIA
            </Animated.Text>
            <Text style={styles.tagline}>Legal Awareness Intelligence</Text>
            <Text style={styles.version}>Powered by Advanced AI</Text>
          </Animated.View>

          {/* Get Started Button */}
          <Animated.View 
            style={[
              styles.buttonContainer,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.getStartedButton}
              onPress={() => router.push('/onboarding')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#40E0FF', '#8B5CF6', '#10B981']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Get Started</Text>
                <Zap size={20} color="#FFFFFF" strokeWidth={2.5} />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Feature Badges */}
          <Animated.View 
            style={[
              styles.badgesContainer,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Animated.View 
              style={[
                styles.badge,
                { transform: [{ translateY: floatAnim }] }
              ]}
            >
              <LinearGradient
                colors={['#40E0FF20', '#40E0FF10']}
                style={styles.badgeGradient}
              >
                <Shield size={18} color="#40E0FF" />
                <Text style={styles.badgeText}>Blockchain Secured</Text>
              </LinearGradient>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.badge,
                { transform: [{ translateY: floatAnim }] }
              ]}
            >
              <LinearGradient
                colors={['#8B5CF620', '#8B5CF610']}
                style={styles.badgeGradient}
              >
                <Scale size={18} color="#8B5CF6" />
                <Text style={[styles.badgeText, { color: '#8B5CF6' }]}>AI Powered</Text>
              </LinearGradient>
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.badge,
                { transform: [{ translateY: floatAnim }] }
              ]}
            >
              <LinearGradient
                colors={['#10B98120', '#10B98110']}
                style={styles.badgeGradient}
              >
                <Globe size={18} color="#10B981" />
                <Text style={[styles.badgeText, { color: '#10B981' }]}>Global Coverage</Text>
              </LinearGradient>
            </Animated.View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  particle: {
    position: 'absolute',
    opacity: 0.6,
  },
  particle1: {
    top: height * 0.2,
    left: width * 0.1,
  },
  particle2: {
    top: height * 0.3,
    right: width * 0.15,
  },
  particle3: {
    top: height * 0.7,
    left: width * 0.2,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    marginBottom: 30,
    position: 'relative',
  },
  logoGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 30,
  },
  glowRing: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: '#40E0FF40',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  appName: {
    fontSize: 56,
    fontFamily: 'Orbitron-Black',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 6,
    textShadowColor: '#40E0FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    fontFamily: 'Rajdhani-SemiBold',
    color: '#8B5CF6',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 4,
    textShadowColor: '#8B5CF6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  version: {
    fontSize: 14,
    fontFamily: 'Rajdhani-Medium',
    color: '#6B7280',
    textAlign: 'center',
    letterSpacing: 1,
  },
  buttonContainer: {
    marginBottom: 60,
    width: width - 60,
  },
  getStartedButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Orbitron-Bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginRight: 10,
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    flexWrap: 'wrap',
    gap: 12,
  },
  badge: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#40E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#40E0FF30',
  },
  badgeText: {
    color: '#40E0FF',
    fontSize: 13,
    fontFamily: 'Rajdhani-SemiBold',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
});