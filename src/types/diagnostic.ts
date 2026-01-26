/**
 * RPP AUTO - Diagnostic Types
 * ============================
 * TypeScript interfaces for diagnostic wizard
 */

export interface SymptomQuestion {
  id: string;
  question: string;
  options: string[];
  category: 'engine' | 'transmission' | 'brakes' | 'electrical' | 'other';
}

export interface WizardStep {
  step: number;
  question: SymptomQuestion;
  selectedOptions: string[];
}

export interface DiagnosticResult {
  confidence: number;
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendedActions: string[];
  estimatedCost?: string;
}

export interface OBDCode {
  code: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface DiagnosticSession {
  id: string;
  vehicleId?: string;
  steps: WizardStep[];
  obdCodes?: OBDCode[];
  result?: DiagnosticResult;
  createdAt: Date;
  completedAt?: Date;
}

export const symptomQuestions: SymptomQuestion[] = [
  {
    id: 'q1',
    question: 'What type of problem are you experiencing?',
    category: 'other',
    options: [
      'Engine issues',
      'Strange noises',
      'Warning lights',
      'Performance problems',
      'Other',
    ],
  },
  {
    id: 'q2',
    question: 'When does the problem occur?',
    category: 'other',
    options: [
      'During startup',
      'While driving',
      'When braking',
      'When accelerating',
      'Constantly',
    ],
  },
  {
    id: 'q3',
    question: 'Have you noticed any warning lights?',
    category: 'electrical',
    options: [
      'Check Engine Light',
      'ABS Light',
      'Oil Light',
      'Battery Light',
      'No warning lights',
    ],
  },
  {
    id: 'q4',
    question: 'Are there any unusual sounds?',
    category: 'other',
    options: [
      'Squealing',
      'Grinding',
      'Knocking',
      'Clicking',
      'No unusual sounds',
    ],
  },
  {
    id: 'q5',
    question: 'How is the vehicle performing?',
    category: 'engine',
    options: [
      'Loss of power',
      'Rough idle',
      'Stalling',
      'Poor acceleration',
      'Performing normally',
    ],
  },
  {
    id: 'q6',
    question: 'Have you noticed any leaks?',
    category: 'other',
    options: [
      'Oil leak',
      'Coolant leak',
      'Transmission fluid leak',
      'Brake fluid leak',
      'No leaks',
    ],
  },
  {
    id: 'q7',
    question: 'How long has this issue been occurring?',
    category: 'other',
    options: [
      'Just started',
      'A few days',
      'A few weeks',
      'A few months',
      'Longer',
    ],
  },
];
