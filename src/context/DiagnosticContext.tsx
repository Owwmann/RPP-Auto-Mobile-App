/**
 * RPP AUTO - Diagnostic Context
 * ==============================
 * Global state management for diagnostic wizard
 */

import React, {createContext, useContext, useState, ReactNode} from 'react';
import {DiagnosticSession, WizardStep, DiagnosticResult, OBDCode} from '../types/diagnostic';

interface DiagnosticContextType {
  currentSession: DiagnosticSession | null;
  startNewSession: (vehicleId?: string) => void;
  updateStep: (step: number, selectedOptions: string[]) => void;
  setOBDCodes: (codes: OBDCode[]) => void;
  setResult: (result: DiagnosticResult) => void;
  completeSession: () => void;
  resetSession: () => void;
}

const DiagnosticContext = createContext<DiagnosticContextType | undefined>(undefined);

export function DiagnosticProvider({children}: {children: ReactNode}) {
  const [currentSession, setCurrentSession] = useState<DiagnosticSession | null>(null);

  const startNewSession = (vehicleId?: string) => {
    const session: DiagnosticSession = {
      id: `session_${Date.now()}`,
      vehicleId,
      steps: [],
      createdAt: new Date(),
    };
    setCurrentSession(session);
  };

  const updateStep = (step: number, selectedOptions: string[]) => {
    if (!currentSession) return;

    const updatedSteps = [...currentSession.steps];
    const stepIndex = updatedSteps.findIndex(s => s.step === step);

    if (stepIndex >= 0) {
      updatedSteps[stepIndex].selectedOptions = selectedOptions;
    } else {
      // Will be filled with actual question data in the wizard screen
      updatedSteps.push({
        step,
        question: {id: '', question: '', options: [], category: 'other'},
        selectedOptions,
      });
    }

    setCurrentSession({
      ...currentSession,
      steps: updatedSteps,
    });
  };

  const setOBDCodes = (codes: OBDCode[]) => {
    if (!currentSession) return;
    setCurrentSession({
      ...currentSession,
      obdCodes: codes,
    });
  };

  const setResult = (result: DiagnosticResult) => {
    if (!currentSession) return;
    setCurrentSession({
      ...currentSession,
      result,
    });
  };

  const completeSession = () => {
    if (!currentSession) return;
    setCurrentSession({
      ...currentSession,
      completedAt: new Date(),
    });
  };

  const resetSession = () => {
    setCurrentSession(null);
  };

  return (
    <DiagnosticContext.Provider
      value={{
        currentSession,
        startNewSession,
        updateStep,
        setOBDCodes,
        setResult,
        completeSession,
        resetSession,
      }}
    >
      {children}
    </DiagnosticContext.Provider>
  );
}

export function useDiagnostic() {
  const context = useContext(DiagnosticContext);
  if (context === undefined) {
    throw new Error('useDiagnostic must be used within a DiagnosticProvider');
  }
  return context;
}
