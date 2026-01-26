/**
 * RPP AUTO - Splash Screen
 * =========================
 * Animated splash screen with Recession Proof branding
 * Black background, green animated logo
 */

import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import theme from '../../theme/theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({onFinish}: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animate logo entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-advance to onboarding after 2 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}
      >
        <MaterialCommunityIcons
          name="car-wrench"
          size={80}
          color={theme.colors.brand.green}
        />
        <Text style={styles.title}>RPP AUTO</Text>
        <Text style={styles.subtitle}>RECESSION PROOF</Text>
      </Animated.View>

      <Animated.View style={[styles.tagline, {opacity: fadeAnim}]}>
        <Text style={styles.taglineText}>AI-Powered Vehicle Diagnostics</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.sizes.h1 + 8,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.brand.green,
    marginTop: theme.spacing.lg,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: theme.typography.sizes.h4,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.brand.yellow,
    marginTop: theme.spacing.xs,
    letterSpacing: 4,
  },
  tagline: {
    position: 'absolute',
    bottom: theme.spacing.xxxl,
  },
  taglineText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    letterSpacing: 1,
  },
});
