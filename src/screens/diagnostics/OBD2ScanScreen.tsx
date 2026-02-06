/**
 * RPP AUTO - OBD2 Scanner Screen
 * ================================
 * Mock terminal-style scanner interface
 * "Connecting to ECU..." with progress animation
 */

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import theme from '../../theme/theme';
import {useDiagnostic} from '../../context/DiagnosticContext';
import {DiagnosticStackParamList, OBDCode} from '../../types/diagnostic';

type OBD2ScanScreenNavigationProp = StackNavigationProp<DiagnosticStackParamList, 'OBD2Scan'>;

const scanMessages = [
  'Initializing OBD2 adapter...',
  'Connecting to vehicle ECU...',
  'Handshake successful',
  'Reading diagnostic codes...',
  'Analyzing sensor data...',
  'Processing fault codes...',
  'Generating diagnostic report...',
  'Analysis complete',
];

export default function OBD2ScanScreen() {
  const navigation = useNavigation<OBD2ScanScreenNavigationProp>();
  const {setOBDCodes, setResult} = useDiagnostic();
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progress, {
      toValue: 100,
      duration: 6000,
      useNativeDriver: false,
    }).start();

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => {
        if (prev >= scanMessages.length - 1) {
          clearInterval(messageInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 750);

    // Navigate to results after scan completes
    const navigationTimer = setTimeout(() => {
      // Mock OBD codes
      const mockCodes: OBDCode[] = [
        {
          code: 'P0300',
          description: 'Random/Multiple Cylinder Misfire Detected',
          severity: 'high',
        },
        {
          code: 'P0171',
          description: 'System Too Lean (Bank 1)',
          severity: 'medium',
        },
      ];

      setOBDCodes(mockCodes);

      // Mock diagnostic result
      setResult({
        confidence: 92,
        issue: 'Engine Misfire - Cylinder 3',
        severity: 'high',
        description:
          'Multiple sensors indicate a misfire in cylinder 3. This is likely caused by a faulty spark plug or ignition coil. The engine is also running lean, which may be contributing to the problem.',
        recommendedActions: [
          'Replace spark plug in cylinder 3',
          'Inspect ignition coil',
          'Check for vacuum leaks',
          'Clean or replace air filter',
        ],
        estimatedCost: '$150 - $400',
      });

      navigation.replace('Results');
    }, 6500);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(navigationTimer);
    };
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.terminal}>
        <View style={styles.terminalHeader}>
          <Text style={styles.terminalTitle}>OBD2 DIAGNOSTIC SCANNER</Text>
        </View>

        <View style={styles.terminalContent}>
          {scanMessages.slice(0, currentMessage + 1).map((message, index) => (
            <Text key={index} style={styles.terminalLine}>
              {'> '}{message}
              {index === currentMessage && (
                <Text style={styles.cursor}>_</Text>
              )}
            </Text>
          ))}
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {width: progressWidth},
              ]}
            />
          </View>
          <Text style={styles.progressText}>Scanning...</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  terminal: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.brand.green,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  terminalHeader: {
    backgroundColor: theme.colors.brand.green,
    padding: theme.spacing.md,
  },
  terminalTitle: {
    color: theme.colors.background.primary,
    fontSize: theme.typography.sizes.bodySmall,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fonts.mono,
    letterSpacing: 1,
  },
  terminalContent: {
    padding: theme.spacing.lg,
    minHeight: 300,
  },
  terminalLine: {
    color: theme.colors.brand.green,
    fontSize: theme.typography.sizes.bodySmall,
    fontFamily: theme.typography.fonts.mono,
    marginBottom: theme.spacing.sm,
  },
  cursor: {
    color: theme.colors.brand.yellow,
  },
  progressContainer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border.default,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.brand.green,
  },
  progressText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.caption,
    fontFamily: theme.typography.fonts.mono,
    textAlign: 'center',
  },
});
