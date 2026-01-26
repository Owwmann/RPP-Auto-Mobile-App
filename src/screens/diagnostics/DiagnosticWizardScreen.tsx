/**
 * RPP AUTO - Diagnostic Wizard Navigator
 * ========================================
 * Main navigator for diagnostic flow
 * Welcome → Symptoms (7 steps) → OBD2 Scan → Results
 */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomeScreen from './WelcomeScreen';
import SymptomStepScreen from './SymptomStepScreen';
import OBD2ScanScreen from './OBD2ScanScreen';
import ResultsScreen from './ResultsScreen';
import theme from '../../theme/theme';

export type DiagnosticStackParamList = {
  Welcome: undefined;
  SymptomStep: {step: number};
  OBD2Scan: undefined;
  Results: undefined;
};

const Stack = createStackNavigator<DiagnosticStackParamList>();

export default function DiagnosticWizardScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: theme.colors.background.primary},
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SymptomStep" component={SymptomStepScreen} />
      <Stack.Screen name="OBD2Scan" component={OBD2ScanScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
    </Stack.Navigator>
  );
}
