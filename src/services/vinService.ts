/**
 * VIN Decoding Service
 * Integration with Auto.dev API for VIN decoding
 */

import axios from 'axios';
import {API_CONFIG} from '../config/api';
import type {VehicleInfo} from './motorDaaSService';

class VINService {
  private baseURL = API_CONFIG.AUTO_DEV_BASE_URL;
  private apiKey = API_CONFIG.AUTO_DEV_API_KEY;

  /**
   * Decode VIN and get vehicle information
   */
  async decodeVIN(vin: string): Promise<VehicleInfo | null> {
    try {
      if (!this.isValidVIN(vin)) {
        throw new Error('Invalid VIN format');
      }

      const response = await axios.get(`${this.baseURL}/${vin}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data) {
        return {
          vin: vin,
          make: response.data.make,
          model: response.data.model,
          year: response.data.year,
          engine: response.data.engine || '',
          transmission: response.data.transmission || '',
          fuelType: response.data.fuel_type || '',
        };
      }

      return null;
    } catch (error) {
      console.error('VIN decode error:', error);
      return null;
    }
  }

  /**
   * Validate VIN format
   */
  isValidVIN(vin: string): boolean {
    // VIN must be 17 characters
    if (vin.length !== 17) {
      return false;
    }

    // VIN can only contain alphanumeric characters (no I, O, Q)
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
    if (!vinRegex.test(vin)) {
      return false;
    }

    // Validate check digit (position 9)
    return this.validateCheckDigit(vin);
  }

  /**
   * Validate VIN check digit
   */
  private validateCheckDigit(vin: string): boolean {
    const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
    const transliteration: Record<string, number> = {
      A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
      J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
      S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
    };

    let sum = 0;
    for (let i = 0; i < 17; i++) {
      const char = vin[i];
      const value = isNaN(parseInt(char)) ? transliteration[char] : parseInt(char);
      sum += value * weights[i];
    }

    const checkDigit = sum % 11;
    const expectedCheckDigit = vin[8] === 'X' ? 10 : parseInt(vin[8]);

    return checkDigit === expectedCheckDigit;
  }

  /**
   * Get vehicle make from VIN
   */
  getMakeFromVIN(vin: string): string {
    // WMI (World Manufacturer Identifier) - first 3 characters
    const wmi = vin.substring(0, 3);

    // Common WMI to manufacturer mappings
    const wmiMap: Record<string, string> = {
      '1FA': 'Ford',
      '1FT': 'Ford',
      '1GC': 'Chevrolet',
      '1G1': 'Chevrolet',
      '2G1': 'Chevrolet',
      '3FA': 'Ford',
      '4T1': 'Toyota',
      '5YJ': 'Tesla',
      'JM1': 'Mazda',
      'KM8': 'Hyundai',
      'WBA': 'BMW',
      'WDD': 'Mercedes-Benz',
    };

    return wmiMap[wmi] || 'Unknown';
  }
}

export const vinService = new VINService();
