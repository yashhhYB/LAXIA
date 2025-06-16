import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';
import MatrixRain from '@/components/MatrixRain';
import NeonButton from '@/components/NeonButton';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <AnimatedBackground />
        <MatrixRain opacity={0.2} />
        
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <AlertTriangle size={80} color="#00ffff" />
            <Text style={styles.title}>404</Text>
            <Text style={styles.subtitle}>This screen doesn't exist.</Text>
            <Text style={styles.description}>
              The legal pathway you're looking for seems to have vanished into the digital void.
            </Text>
            
            <Link href="/" asChild>
              <NeonButton
                title="Return to LAXIA"
                onPress={() => {}}
                style={styles.button}
              />
            </Link>
          </View>
        </SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontSize: 72,
    fontFamily: 'Orbitron-Black',
    color: '#00ffff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 24,
    fontFamily: 'Orbitron-Bold',
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Rajdhani-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  button: {
    paddingHorizontal: 40,
  },
});