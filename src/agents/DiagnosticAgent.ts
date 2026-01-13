/**
 * Diagnostic Agent
 * Analyzes vehicle diagnostics and provides recommendations
 */

import {BaseAgent, AgentMessage, AgentContext, AgentConfig} from './BaseAgent';
import {motorDaaSService} from '../services/motorDaaSService';
import {obd2Service} from '../services/obd2Service';
import {aiService} from '../services/aiService';

export class DiagnosticAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'Diagnostic Agent',
      type: 'diagnostic',
      description: 'Analyzes vehicle diagnostic codes and sensor data',
      capabilities: [
        'diagnostic_scan',
        'code_analysis',
        'symptom_diagnosis',
        'health_check',
        'sensor_reading',
      ],
      priority: 10,
    };
    super(config);
  }

  async processMessage(message: AgentMessage, context: AgentContext): Promise<AgentMessage> {
    try {
      this.log('info', 'Processing diagnostic request');

      // Extract DTC codes if present in message
      const dtcCodes = this.extractDTCCodes(message.content);

      let responseText = '';

      if (dtcCodes.length > 0) {
        // Look up codes using Motor DaaS
        const codeDetails = await motorDaaSService.lookupMultipleDTCs(dtcCodes);

        // Generate AI analysis
        const analysis = await aiService.generateResponse({
          message: this.buildDiagnosticPrompt(dtcCodes, codeDetails),
          context: context,
          agentType: 'diagnostic',
        });

        responseText = analysis;
      } else {
        // General diagnostic inquiry
        responseText = await aiService.generateResponse({
          message: message.content,
          context: context,
          agentType: 'diagnostic',
        });
      }

      const responseMessage: AgentMessage = {
        id: this.generateMessageId(),
        conversationId: context.conversationId,
        senderId: this.config.type,
        senderType: 'agent',
        content: responseText,
        messageType: 'diagnostic_report',
        timestamp: new Date(),
        metadata: {
          dtcCodes: dtcCodes,
          intent: context.intent,
        },
      };

      return responseMessage;
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  canHandle(intent: string, entities: Record<string, any>): boolean {
    // Check if intent is in capabilities
    if (this.config.capabilities.includes(intent)) {
      return true;
    }

    // Check if DTC codes are present
    if (entities.dtcCodes && Array.isArray(entities.dtcCodes)) {
      return true;
    }

    return false;
  }

  async executeAction(action: string, params: Record<string, any>): Promise<any> {
    switch (action) {
      case 'scan_vehicle':
        return this.scanVehicle();
      case 'read_dtc':
        return this.readDTCCodes();
      case 'clear_dtc':
        return this.clearDTCCodes();
      case 'read_sensors':
        return this.readSensorData();
      case 'analyze_health':
        return this.analyzeVehicleHealth();
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private extractDTCCodes(text: string): string[] {
    // Extract DTC codes (P0xxx, C0xxx, B0xxx, U0xxx)
    const dtcPattern = /[PCBU][0-3][0-9A-F]{3}/gi;
    const matches = text.match(dtcPattern);
    return matches ? [...new Set(matches.map(code => code.toUpperCase()))] : [];
  }

  private buildDiagnosticPrompt(codes: string[], codeDetails: any[]): string {
    let prompt = `Analyze these diagnostic trouble codes:\n\n`;

    codeDetails.forEach(detail => {
      prompt += `Code: ${detail.code}\n`;
      prompt += `Description: ${detail.description}\n`;
      prompt += `Severity: ${detail.severity}\n`;
      prompt += `Possible Causes: ${detail.possibleCauses.join(', ')}\n\n`;
    });

    prompt += `Provide a clear explanation and recommended actions.`;
    return prompt;
  }

  private async scanVehicle(): Promise<any> {
    this.log('info', 'Initiating vehicle scan');

    if (!obd2Service.isConnected()) {
      throw new Error('OBD2 device not connected');
    }

    const dtcCodes = await obd2Service.readDTCs();
    const sensorData = await this.readSensorData();

    return {
      dtcCodes,
      sensorData,
      timestamp: new Date(),
    };
  }

  private async readDTCCodes(): Promise<string[]> {
    if (!obd2Service.isConnected()) {
      throw new Error('OBD2 device not connected');
    }
    return await obd2Service.readDTCs();
  }

  private async clearDTCCodes(): Promise<boolean> {
    this.log('info', 'Clearing DTC codes');
    if (!obd2Service.isConnected()) {
      throw new Error('OBD2 device not connected');
    }
    return await obd2Service.clearDTCs();
  }

  private async readSensorData(): Promise<any> {
    if (!obd2Service.isConnected()) {
      throw new Error('OBD2 device not connected');
    }

    const [rpm, speed, coolantTemp, fuelLevel, batteryVoltage] = await Promise.all([
      obd2Service.readRPM(),
      obd2Service.readSpeed(),
      obd2Service.readCoolantTemp(),
      obd2Service.readFuelLevel(),
      obd2Service.readBatteryVoltage(),
    ]);

    return {
      rpm,
      speed,
      coolantTemp,
      fuelLevel,
      batteryVoltage,
      timestamp: new Date(),
    };
  }

  private async analyzeVehicleHealth(): Promise<any> {
    this.log('info', 'Analyzing vehicle health');

    const sensorData = await this.readSensorData();
    const dtcCodes = await this.readDTCCodes();

    // Calculate health score
    let healthScore = 100;

    // Deduct points for DTCs
    healthScore -= dtcCodes.length * 10;

    // Deduct for abnormal sensor readings
    if (sensorData.coolantTemp > 105) healthScore -= 15;
    if (sensorData.fuelLevel < 10) healthScore -= 5;
    if (sensorData.batteryVoltage < 12) healthScore -= 10;

    healthScore = Math.max(0, healthScore);

    return {
      healthScore,
      dtcCount: dtcCodes.length,
      sensorData,
      recommendation: this.getHealthRecommendation(healthScore),
    };
  }

  private getHealthRecommendation(score: number): string {
    if (score >= 90) return 'Excellent - No immediate action needed';
    if (score >= 70) return 'Good - Monitor regularly';
    if (score >= 50) return 'Fair - Schedule maintenance soon';
    if (score >= 30) return 'Poor - Service needed soon';
    return 'Critical - Immediate attention required';
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
