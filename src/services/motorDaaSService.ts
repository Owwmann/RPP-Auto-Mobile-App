/**
 * Motor DaaS Service
 * Integration with Motor DaaS API for DTC code lookup
 */

import axios from 'axios';
import {API_CONFIG} from '../config/api';

export interface DTCCode {
  code: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  possibleCauses: string[];
  recommendedActions: string[];
}

export interface VehicleInfo {
  vin: string;
  make: string;
  model: string;
  year: number;
  engine: string;
  transmission: string;
  fuelType: string;
}

class MotorDaaSService {
  private baseURL = API_CONFIG.MOTOR_DAAS_BASE_URL;
  private publicKey = API_CONFIG.MOTOR_DAAS_PUBLIC_KEY;
  private privateKey = API_CONFIG.MOTOR_DAAS_PRIVATE_KEY;

  /**
   * Look up DTC code information
   */
  async lookupDTC(code: string): Promise<DTCCode | null> {
    try {
      const response = await axios.get(`${this.baseURL}/dtc/${code}`, {
        headers: {
          'X-API-Key': this.publicKey,
          'X-API-Secret': this.privateKey,
        },
      });

      if (response.data) {
        return {
          code: response.data.code,
          description: response.data.description,
          severity: this.determineSeverity(response.data.priority),
          category: response.data.category || 'general',
          possibleCauses: response.data.possible_causes || [],
          recommendedActions: response.data.recommended_actions || [],
        };
      }

      return null;
    } catch (error) {
      console.error('DTC lookup error:', error);
      return null;
    }
  }

  /**
   * Look up multiple DTC codes
   */
  async lookupMultipleDTCs(codes: string[]): Promise<DTCCode[]> {
    const results = await Promise.all(
      codes.map(code => this.lookupDTC(code))
    );
    return results.filter((result): result is DTCCode => result !== null);
  }

  /**
   * Search DTC codes by keyword
   */
  async searchDTCs(keyword: string): Promise<DTCCode[]> {
    try {
      const response = await axios.get(`${this.baseURL}/dtc/search`, {
        params: {query: keyword},
        headers: {
          'X-API-Key': this.publicKey,
          'X-API-Secret': this.privateKey,
        },
      });

      return response.data.results.map((item: any) => ({
        code: item.code,
        description: item.description,
        severity: this.determineSeverity(item.priority),
        category: item.category,
        possibleCauses: item.possible_causes || [],
        recommendedActions: item.recommended_actions || [],
      }));
    } catch (error) {
      console.error('DTC search error:', error);
      return [];
    }
  }

  /**
   * Get all codes for a specific category
   */
  async getDTCsByCategory(category: string): Promise<DTCCode[]> {
    try {
      const response = await axios.get(`${this.baseURL}/dtc/category/${category}`, {
        headers: {
          'X-API-Key': this.publicKey,
          'X-API-Secret': this.privateKey,
        },
      });

      return response.data.results.map((item: any) => ({
        code: item.code,
        description: item.description,
        severity: this.determineSeverity(item.priority),
        category: item.category,
        possibleCauses: item.possible_causes || [],
        recommendedActions: item.recommended_actions || [],
      }));
    } catch (error) {
      console.error('Category lookup error:', error);
      return [];
    }
  }

  private determineSeverity(priority: string | number): 'critical' | 'warning' | 'info' {
    if (typeof priority === 'string') {
      const lower = priority.toLowerCase();
      if (lower.includes('critical') || lower.includes('severe')) {
        return 'critical';
      }
      if (lower.includes('warning') || lower.includes('moderate')) {
        return 'warning';
      }
      return 'info';
    }

    // Numeric priority (1-10)
    if (priority >= 8) return 'critical';
    if (priority >= 5) return 'warning';
    return 'info';
  }
}

export const motorDaaSService = new MotorDaaSService();
