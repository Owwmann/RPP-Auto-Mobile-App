/**
 * RPP AUTO - Diagnostic Results Screen
 * ======================================
 * Display diagnostic verdict with confidence score
 * Action buttons: Find Mechanic, Clear Codes
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import theme from '../../theme/theme';
import {useDiagnostic} from '../../context/DiagnosticContext';

export default function ResultsScreen() {
  const navigation = useNavigation();
  const {currentSession, completeSession, resetSession} = useDiagnostic();

  const result = currentSession?.result;
  const obdCodes = currentSession?.obdCodes || [];

  if (!result) {
    return null;
  }

  const getSeverityColor = () => {
    switch (result.severity) {
      case 'critical':
        return theme.colors.semantic.error;
      case 'high':
        return theme.colors.semantic.warning;
      case 'medium':
        return theme.colors.brand.yellow;
      case 'low':
        return theme.colors.brand.green;
    }
  };

  const handleFindMechanic = () => {
    completeSession();
    // TODO: Navigate to mechanic finder
    alert('Mechanic finder coming soon!');
  };

  const handleClearCodes = () => {
    resetSession();
    navigation.goBack();
  };

  const handleNewDiagnostic = () => {
    resetSession();
    navigation.navigate('DiagnosticWizard' as never);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="check-decagram"
          size={64}
          color={theme.colors.brand.green}
        />
        <Text style={styles.headerTitle}>ANALYSIS COMPLETE</Text>
      </View>

      {/* Confidence Score */}
      <View style={styles.confidenceCard}>
        <Text style={styles.confidenceLabel}>Confidence Score</Text>
        <Text style={styles.confidenceScore}>{result.confidence}%</Text>
        <View style={styles.confidenceBar}>
          <View
            style={[
              styles.confidenceBarFill,
              {width: `${result.confidence}%`},
            ]}
          />
        </View>
      </View>

      {/* Main Issue */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={24}
            color={getSeverityColor()}
          />
          <Text style={styles.cardTitle}>Detected Issue</Text>
        </View>
        <Text style={styles.issueTitle}>{result.issue}</Text>
        <Text style={styles.issueDescription}>{result.description}</Text>
        {result.estimatedCost && (
          <View style={styles.costBadge}>
            <Text style={styles.costText}>Est. Cost: {result.estimatedCost}</Text>
          </View>
        )}
      </View>

      {/* OBD Codes */}
      {obdCodes.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="code-braces"
              size={24}
              color={theme.colors.brand.green}
            />
            <Text style={styles.cardTitle}>Diagnostic Codes</Text>
          </View>
          {obdCodes.map((code, index) => (
            <View key={index} style={styles.codeItem}>
              <Text style={styles.codeNumber}>{code.code}</Text>
              <Text style={styles.codeDescription}>{code.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Recommended Actions */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons
            name="wrench"
            size={24}
            color={theme.colors.brand.green}
          />
          <Text style={styles.cardTitle}>Recommended Actions</Text>
        </View>
        {result.recommendedActions.map((action, index) => (
          <View key={index} style={styles.actionItem}>
            <MaterialCommunityIcons
              name="check"
              size={20}
              color={theme.colors.brand.green}
            />
            <Text style={styles.actionText}>{action}</Text>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleFindMechanic}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="map-marker"
            size={24}
            color={theme.colors.background.primary}
          />
          <Text style={styles.primaryButtonText}>Find Mechanic</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleClearCodes}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="broom"
            size={24}
            color={theme.colors.brand.yellow}
          />
          <Text style={styles.secondaryButtonText}>Clear Codes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ghostButton}
          onPress={handleNewDiagnostic}
          activeOpacity={0.8}
        >
          <Text style={styles.ghostButtonText}>New Diagnostic</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    alignItems: 'center',
    padding: theme.spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.brand.green,
    marginTop: theme.spacing.md,
    letterSpacing: 1,
  },
  confidenceCard: {
    margin: theme.spacing.lg,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.brand.yellow,
  },
  confidenceLabel: {
    fontSize: theme.typography.sizes.bodySmall,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
  },
  confidenceScore: {
    fontSize: 48,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.brand.yellow,
  },
  confidenceBar: {
    width: '100%',
    height: 8,
    backgroundColor: theme.colors.border.default,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: theme.spacing.md,
  },
  confidenceBarFill: {
    height: '100%',
    backgroundColor: theme.colors.brand.yellow,
  },
  card: {
    margin: theme.spacing.lg,
    marginTop: 0,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.h4,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  issueTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  issueDescription: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.sizes.body * theme.typography.lineHeights.relaxed,
  },
  costBadge: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.brand.yellow,
    borderRadius: theme.borderRadius.pill,
    alignSelf: 'flex-start',
  },
  costText: {
    fontSize: theme.typography.sizes.bodySmall,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.background.primary,
  },
  codeItem: {
    marginBottom: theme.spacing.md,
  },
  codeNumber: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.brand.green,
    fontFamily: theme.typography.fonts.mono,
  },
  codeDescription: {
    fontSize: theme.typography.sizes.bodySmall,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  actionText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  actions: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  primaryButton: {
    ...theme.components.button.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: theme.colors.background.primary,
    fontSize: theme.typography.sizes.h4,
    fontWeight: theme.typography.weights.semibold,
    marginLeft: theme.spacing.sm,
  },
  secondaryButton: {
    ...theme.components.button.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: theme.colors.brand.yellow,
    fontSize: theme.typography.sizes.h4,
    fontWeight: theme.typography.weights.semibold,
    marginLeft: theme.spacing.sm,
  },
  ghostButton: {
    ...theme.components.button.ghost,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostButtonText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.body,
  },
});
