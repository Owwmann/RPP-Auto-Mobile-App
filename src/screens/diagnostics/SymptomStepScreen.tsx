/**
 * RPP AUTO - Symptom Step Screen
 * ================================
 * Reusable component for 7-step symptom wizard
 * Multi-select chips with progress indicator
 */

import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import theme from '../../theme/theme';
import {useDiagnostic} from '../../context/DiagnosticContext';
import {symptomQuestions} from '../../types/diagnostic';
import {DiagnosticStackParamList} from './DiagnosticWizardScreen';

type SymptomStepScreenNavigationProp = StackNavigationProp<DiagnosticStackParamList, 'SymptomStep'>;
type SymptomStepScreenRouteProp = RouteProp<DiagnosticStackParamList, 'SymptomStep'>;

export default function SymptomStepScreen() {
  const navigation = useNavigation<SymptomStepScreenNavigationProp>();
  const route = useRoute<SymptomStepScreenRouteProp>();
  const {updateStep} = useDiagnostic();
  const {step} = route.params;

  const question = symptomQuestions[step - 1];
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(o => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleNext = () => {
    updateStep(step, selectedOptions);

    if (step < symptomQuestions.length) {
      navigation.push('SymptomStep', {step: step + 1});
    } else {
      navigation.navigate('OBD2Scan');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      navigation.goBack();
    } else {
      navigation.navigate('Welcome');
    }
  };

  const progress = step / symptomQuestions.length;

  return (
    <View style={styles.container}>
      {/* Header with progress */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.brand.green} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Step {step} of {symptomQuestions.length}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, {width: `${progress * 100}%`}]} />
          </View>
        </View>
      </View>

      {/* Question */}
      <ScrollView style={styles.content}>
        <Text style={styles.question}>{question.question}</Text>
        <Text style={styles.hint}>Select all that apply</Text>

        {/* Options */}
        <View style={styles.options}>
          {question.options.map((option, index) => {
            const isSelected = selectedOptions.includes(option);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  isSelected && styles.optionSelected,
                ]}
                onPress={() => toggleOption(option)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                {isSelected && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color={theme.colors.background.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer with Next button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedOptions.length === 0 && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={selectedOptions.length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {step === symptomQuestions.length ? 'Continue to Scan' : 'Next'}
          </Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={24}
            color={theme.colors.background.primary}
          />
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.default,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  progressContainer: {
    flex: 1,
  },
  progressText: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.border.default,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.brand.green,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
  },
  question: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  hint: {
    fontSize: theme.typography.sizes.bodySmall,
    color: theme.colors.brand.yellow,
    marginBottom: theme.spacing.xl,
  },
  options: {
    gap: theme.spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.surface,
    borderWidth: 2,
    borderColor: theme.colors.border.default,
    borderRadius: theme.borderRadius.md,
  },
  optionSelected: {
    backgroundColor: theme.colors.brand.green,
    borderColor: theme.colors.brand.green,
  },
  optionText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.primary,
    flex: 1,
  },
  optionTextSelected: {
    color: theme.colors.background.primary,
    fontWeight: theme.typography.weights.semibold,
  },
  footer: {
    padding: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
  },
  nextButton: {
    ...theme.components.button.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: theme.colors.interactive.disabled,
  },
  nextButtonText: {
    color: theme.colors.background.primary,
    fontSize: theme.typography.sizes.h4,
    fontWeight: theme.typography.weights.semibold,
    marginRight: theme.spacing.sm,
  },
});
