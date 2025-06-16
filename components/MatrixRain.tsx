import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface MatrixRainProps {
  opacity?: number;
}

export default function MatrixRain({ opacity = 0.3 }: MatrixRainProps) {
  const animatedValues = useRef<Animated.Value[]>([]);
  const columns = Math.floor(width / 20);
  
  useEffect(() => {
    // Initialize animated values for each column
    animatedValues.current = Array.from({ length: columns }, () => new Animated.Value(0));
    
    const animations = animatedValues.current.map((animValue, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(Math.random() * 2000),
          Animated.timing(animValue, {
            toValue: height + 100,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: -100,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    });

    // Start all animations
    animations.forEach(animation => animation.start());

    return () => {
      animations.forEach(animation => animation.stop());
    };
  }, [columns]);

  const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

  return (
    <View style={[styles.container, { opacity }]} pointerEvents="none">
      {animatedValues.current.map((animValue, index) => (
        <Animated.View
          key={index}
          style={[
            styles.column,
            {
              left: index * 20,
              transform: [{ translateY: animValue }],
            },
          ]}
        >
          {Array.from({ length: 20 }, (_, charIndex) => (
            <Animated.Text
              key={charIndex}
              style={[
                styles.char,
                {
                  opacity: Math.max(0, 1 - (charIndex * 0.1)),
                  color: charIndex === 0 ? '#00ffff' : '#008800',
                },
              ]}
            >
              {matrixChars[Math.floor(Math.random() * matrixChars.length)]}
            </Animated.Text>
          ))}
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  column: {
    position: 'absolute',
    top: -100,
  },
  char: {
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20,
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
});