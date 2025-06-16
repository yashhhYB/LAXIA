import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface GlowCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  glowColor?: string;
}

export default function GlowCard({ 
  title, 
  subtitle, 
  icon, 
  onPress, 
  style,
  glowColor = '#00ffff'
}: GlowCardProps) {
  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent onPress={onPress} style={[styles.container, style]}>
      <BlurView intensity={20} style={styles.blur}>
        <LinearGradient
          colors={['rgba(0, 255, 255, 0.1)', 'rgba(139, 92, 246, 0.1)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </LinearGradient>
      </BlurView>
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
    shadowColor: '#00ffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  blur: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 20,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 10,
  },
  title: {
    color: '#00ffff',
    fontSize: 16,
    fontFamily: 'Orbitron-Bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    color: '#8b5cf6',
    fontSize: 12,
    fontFamily: 'Rajdhani-Regular',
    textAlign: 'center',
  },
});