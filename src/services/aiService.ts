/**
 * AI Service
 * Integration with OpenRouter API (Claude 3.5)
 */

import axios from 'axios';
import {API_CONFIG} from '../config/api';
import type {AgentContext} from '../agents/BaseAgent';

interface AIRequest {
  message: string;
  context: AgentContext;
  agentType: string;
}

class AIService {
  private baseURL = API_CONFIG.OPENROUTER_BASE_URL;
  private apiKey = API_CONFIG.OPENROUTER_API_KEY;
  private model = 'anthropic/claude-3.5-sonnet';

  /**
   * Generate AI response
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
