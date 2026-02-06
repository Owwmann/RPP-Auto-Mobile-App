/**
 * AI Service - Enhanced with Real OpenRouter Integration
 * Integration with OpenRouter API (Claude 3.5)
 * 
 * BATCH E Implementation: Real AI Integration for RPP Auto App
 */

import axios from 'axios';
import {API_CONFIG} from '../config/api';
import type {AgentContext} from '../agents/BaseAgent';

interface AIRequest {
  message: string;
  context: AgentContext;
  agentType: string;
}

interface DiagnosisRequest {
  symptoms: string[];
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
  };
  dtcCodes?: string[];
}

interface DiagnosisResponse {
  diagnosis: string;
  confidence: number;
  recommendations: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost?: {
    min: number;
    max: number;
  };
}

class AIService {
  private baseURL = 'https://openrouter.ai/api/v1';
  private apiKey = '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';
  private model = 'anthropic/claude-3.5-sonnet';

  /**
   * BATCH E - Main Function: Fetch AI-Powered Diagnosis
   * This function implements the core requirement from the PRD:
   * "Implement a function `fetchDiagnosis(symptoms: string[])`"
   */
  async fetchDiagnosis(request: DiagnosisRequest): Promise<DiagnosisResponse> {
    try {
      const prompt = this.buildDiagnosticPrompt(request);

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `You are an expert automotive mechanic with over 20 years of experience. 
              Analyze vehicle symptoms and diagnostic trouble codes (DTCs) to provide accurate diagnoses.
              Always provide:
              1. A clear diagnosis
              2. Confidence score (0-100)
              3. Recommended actions
              4. Severity level (low/medium/high/critical)
              5. Estimated repair cost range

              Respond in JSON format with these exact fields:
              {
                "diagnosis": "detailed explanation",
                "confidence": 85,
                "recommendations": ["action 1", "action 2"],
                "severity": "medium",
                "estimatedCost": {"min": 100, "max": 500}
              }`,
            },
            {role: 'user', content: prompt},
          ],
          max_tokens: 1000,
          temperature: 0.7,
          response_format: {type: 'json_object'},
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://rppauto.com',
            'X-Title': 'RPP Auto - AI Diagnostics',
          },
        }
      );

      const result = JSON.parse(response.data.choices[0].message.content);
      return result as DiagnosisResponse;
    } catch (error: any) {
      console.error('AI Diagnosis error:', error.response?.data || error.message);

      // Fallback response
      return {
        diagnosis: 'Unable to generate diagnosis at this time. Please try again or consult a mechanic.',
        confidence: 0,
        recommendations: ['Visit a certified mechanic for proper diagnosis'],
        severity: 'medium',
      };
    }
  }

  /**
   * Generate AI response for general queries
   */
  async generateResponse(request: AIRequest): Promise<string> {
    try {
      const systemPrompt = this.getSystemPrompt(request.agentType);
      const userPrompt = this.buildUserPrompt(request);

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {role: 'system', content: systemPrompt},
            ...this.buildConversationHistory(request.context),
            {role: 'user', content: userPrompt},
          ],
          max_tokens: 1000,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://rppauto.com',
            'X-Title': 'RPP Auto - AI Assistant',
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('AI service error:', error);
      return 'I apologize, but I encountered an error processing your request. Please try again.';
    }
  }

  /**
   * Recognize intent from user message
   */
  async recognizeIntent(message: string): Promise<{intent: string; confidence: number}> {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `You are an intent classifier for a vehicle diagnostics app. 
              Classify user messages into one of these intents:
              - diagnostic: questions about vehicle problems, error codes
              - service: booking appointments, finding mechanics
              - parts: searching for parts, recommendations
              - general: greetings, help, general inquiries

              Respond with JSON: {"intent": "intent_name", "confidence": 0.0-1.0}`,
            },
            {role: 'user', content: message},
          ],
          max_tokens: 50,
          response_format: {type: 'json_object'},
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = JSON.parse(response.data.choices[0].message.content);
      return result;
    } catch (error) {
      console.error('Intent recognition error:', error);
      return {intent: 'general', confidence: 0.5};
    }
  }

  private buildDiagnosticPrompt(request: DiagnosisRequest): string {
    let prompt = `Analyze the following vehicle symptoms and provide a comprehensive diagnosis:\n\n`;

    prompt += `Symptoms:\n`;
    request.symptoms.forEach((symptom, index) => {
      prompt += `${index + 1}. ${symptom}\n`;
    });

    if (request.vehicleInfo) {
      prompt += `\nVehicle: ${request.vehicleInfo.year} ${request.vehicleInfo.make} ${request.vehicleInfo.model}`;
    }

    if (request.dtcCodes && request.dtcCodes.length > 0) {
      prompt += `\n\nDiagnostic Trouble Codes (DTCs):\n`;
      request.dtcCodes.forEach(code => {
        prompt += `- ${code}\n`;
      });
    }

    return prompt;
  }

  private getSystemPrompt(agentType: string): string {
    const prompts: Record<string, string> = {
      customer_service: `You are a helpful customer service agent for RPP Auto, 
      an AI-powered vehicle diagnostics mobile app. Be friendly, professional, 
      and help users with their questions about the app, their vehicles, and services.`,

      diagnostic: `You are a vehicle diagnostic expert. Analyze diagnostic trouble 
      codes (DTCs) and sensor data to help users understand their vehicle problems. 
      Provide clear explanations and recommendations.`,

      booking: `You are a service booking assistant. Help users schedule appointments 
      for vehicle maintenance and repairs. Be efficient and confirm all details.`,

      parts: `You are a parts recommendation specialist. Help users find the right 
      parts for their vehicles based on diagnostic information and vehicle details.`,
    };

    return prompts[agentType] || prompts.customer_service;
  }

  private buildUserPrompt(request: AIRequest): string {
    let prompt = `User message: ${request.message}`;

    if (request.context.vehicleId) {
      prompt += `\n\nContext: User is asking about their vehicle.`;
    }

    if (request.context.intent) {
      prompt += `\nDetected intent: ${request.context.intent}`;
    }

    return prompt;
  }

  private buildConversationHistory(context: AgentContext): Array<{role: string; content: string}> {
    return context.history.slice(-5).map(msg => ({
      role: msg.senderType === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));
  }
}

export const aiService = new AIService();
