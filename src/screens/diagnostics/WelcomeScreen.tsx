/**
 * RPP AUTO - Diagnostic Welcome Screen
 * ======================================
 * HUD-style welcome screen with pulsing animation
 * "Initializing System..."
 */

import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import theme from '../../theme/theme';
import {useDiagnostic} from '../../context/DiagnosticContext';
import {DiagnosticStackParamList} from './DiagnosticWizardScreen';

type WelcomeScreenNavigationProp = StackNavigationProp<DiagnosticStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const {startNewSession} = useDiagnostic();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulsing animation for the AI avatar
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleStart = () => {
    startNewSession();
    navigation.navigate('SymptomStep', {step: 1});
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>DIAGNOSTIC SYSTEM</Text>
      </View>

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.avatarContainer,
            {
              transform: [{scale: pulseAnim}],
            },
          ]}
        >
          <View style={styles.avatarOuter}>
            <View style={styles.avatarInner}>
              <MaterialCommunityIcons
                name="brain"
                size={60}
                color={theme.colors.background.primary}
              />
            </View>
          </View>
        </Animated.View>

        <Text style={styles.title}>AI ASSISTANT READY</Text>
        <Text style={styles.subtitle}>Initializing diagnostic protocols...</Text>

        <View style={styles.features}>
          <View style={styles.feature}>
            <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.brand.green} />
            <Text style={styles.featureText}>Advanced symptom analysis</Text>
          </View>
          <View style={styles.feature}>
            <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.brand.green} />
            <Text style={styles.featureText}>OBD2 code interpretation</Text>
          </View>
          <View style={styles.feature}>
            <MaterialCommunityIcons name="check-circle" size={24} color={theme.colors.brand.green} />
            <Text style={styles.featureText}>Instant recommendations</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStart} activeOpacity={0.8}>
          <Text style={styles.startButtonText}>START DIAGNOSTIC</Text>
          <MaterialCommunityIcons name="arrow-right" size={24} color={theme.colors.background.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    padding: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  headerText: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.brand.yellow,
    letterSpacing: 2,
    fontFamily: theme.typography.fonts.mono,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  avatarContainer: {
    marginBottom: theme.spacing.xxl,
  },
  avatarOuter: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: theme.colors.brand.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  avatarInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: theme.colors.brand.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.brand.green,
    marginBottom: theme.spacing.sm,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xxl,
  },
  features: {
    width: '100%',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  featureText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.md,
  },
  footer: {
    padding: theme.spacing.xl,
  },
  startButton: {
    ...theme.components.button.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: theme.colors.background.primary,
    fontSize: theme.typography.sizes.h4,
    fontWeight: theme.typography.weights.semibold,
    marginRight: theme.spacing.sm,
    letterSpacing: 1,
  },
});
