/**
 * OBD2 Service
 * Handles Bluetooth communication with OBD2 devices
 */

import {BleManager, Device, Characteristic} from 'react-native-ble-plx';

export interface OBD2Device {
  id: string;
  name: string;
  macAddress: string;
  isConnected: boolean;
}

export interface OBD2Command {
  pid: string;
  description: string;
  command: string;
}

class OBD2Service {
  private bleManager: BleManager;
  private connectedDevice: Device | null = null;
  private serviceUUID = '0000fff0-0000-1000-8000-00805f9b34fb';
  private characteristicUUID = '0000fff1-0000-1000-8000-00805f9b34fb';

  constructor() {
    this.bleManager = new BleManager();
  }

  /**
   * Scan for available OBD2 devices
   */
  async scanForDevices(onDeviceFound: (device: OBD2Device) => void): Promise<void> {
    const devices: Map<string, OBD2Device> = new Map();

    this.bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Scan error:', error);
        return;
      }

      if (device && device.name && (device.name.includes('OBD') || device.name.includes('ELM'))) {
        if (!devices.has(device.id)) {
          const obd2Device: OBD2Device = {
            id: device.id,
            name: device.name,
            macAddress: device.id,
            isConnected: false,
          };
          devices.set(device.id, obd2Device);
          onDeviceFound(obd2Device);
        }
      }
    });

    // Stop scanning after 10 seconds
    setTimeout(() => {
      this.bleManager.stopDeviceScan();
    }, 10000);
  }

  /**
   * Connect to an OBD2 device
   */
  async connectToDevice(deviceId: string): Promise<boolean> {
    try {
      console.log(`Connecting to device: ${deviceId}`);

      const device = await this.bleManager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();

      this.connectedDevice = device;
      console.log('Connected successfully');

      // Initialize OBD2 adapter
      await this.sendCommand('ATZ'); // Reset
      await this.sendCommand('ATE0'); // Echo off
      await this.sendCommand('ATL0'); // Linefeeds off
      await this.sendCommand('ATSP0'); // Auto protocol

      return true;
    } catch (error) {
      console.error('Connection error:', error);
      return false;
    }
  }

  /**
   * Disconnect from current device
   */
  async disconnect(): Promise<void> {
    if (this.connectedDevice) {
      await this.bleManager.cancelDeviceConnection(this.connectedDevice.id);
      this.connectedDevice = null;
      console.log('Disconnected');
    }
  }

  /**
   * Check if device is connected
   */
  isConnected(): boolean {
    return this.connectedDevice !== null;
  }

  /**
   * Send OBD2 command and read response
   */
  async sendCommand(command: string): Promise<string> {
    if (!this.connectedDevice) {
      throw new Error('No device connected');
    }

    try {
      // Write command
      const commandWithCR = `${command}\r`;
      const base64Command = Buffer.from(commandWithCR).toString('base64');

      await this.connectedDevice.writeCharacteristicWithResponseForService(
        this.serviceUUID,
        this.characteristicUUID,
        base64Command
      );

      // Read response
      const characteristic = await this.connectedDevice.readCharacteristicForService(
        this.serviceUUID,
        this.characteristicUUID
      );

      if (characteristic.value) {
        return Buffer.from(characteristic.value, 'base64').toString('ascii');
      }

      return '';
    } catch (error) {
      console.error('Command error:', error);
      throw error;
    }
  }

  /**
   * Read diagnostic trouble codes (DTCs)
   */
  async readDTCs(): Promise<string[]> {
    const response = await this.sendCommand('03');
    return this.parseDTCs(response);
  }

  /**
   * Clear diagnostic trouble codes
   */
  async clearDTCs(): Promise<boolean> {
    try {
      await this.sendCommand('04');
      return true;
    } catch (error) {
      console.error('Clear DTCs error:', error);
      return false;
    }
  }

  /**
   * Read VIN
   */
  async readVIN(): Promise<string> {
    const response = await this.sendCommand('0902');
    return this.parseVIN(response);
  }

  /**
   * Read engine RPM
   */
  async readRPM(): Promise<number> {
    const response = await this.sendCommand('010C');
    return this.parseRPM(response);
  }

  /**
   * Read vehicle speed
   */
  async readSpeed(): Promise<number> {
    const response = await this.sendCommand('010D');
    return this.parseSpeed(response);
  }

  /**
   * Read coolant temperature
   */
  async readCoolantTemp(): Promise<number> {
    const response = await this.sendCommand('0105');
    return this.parseCoolantTemp(response);
  }

  /**
   * Read fuel level
   */
  async readFuelLevel(): Promise<number> {
    const response = await this.sendCommand('012F');
    return this.parseFuelLevel(response);
  }

  /**
   * Read battery voltage
   */
  async readBatteryVoltage(): Promise<number> {
    const response = await this.sendCommand('0142');
    return this.parseBatteryVoltage(response);
  }

  // ============ Helper Methods ============

  private parseDTCs(response: string): string[] {
    const dtcs: string[] = [];
    const hex = response.replace(/\s/g, '');

    // Parse DTC codes from hex response
    for (let i = 0; i < hex.length; i += 4) {
      const code = hex.substr(i, 4);
      if (code !== '0000') {
        dtcs.push(this.formatDTC(code));
      }
    }

    return dtcs;
  }

  private formatDTC(hex: string): string {
    const firstChar = hex.charAt(0);
    const prefix = ['P', 'C', 'B', 'U'][parseInt(firstChar, 16) >> 2];
    const rest = hex.substr(1);
    return `${prefix}${rest}`;
  }

  private parseVIN(response: string): string {
    const hex = response.replace(/\s/g, '');
    let vin = '';
    for (let i = 0; i < hex.length; i += 2) {
      const char = String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      if (char.match(/[A-Z0-9]/)) {
        vin += char;
      }
    }
    return vin;
  }

  private parseRPM(response: string): number {
    const bytes = this.hexToBytes(response);
    if (bytes.length >= 2) {
      return ((bytes[0] * 256) + bytes[1]) / 4;
    }
    return 0;
  }

  private parseSpeed(response: string): number {
    const bytes = this.hexToBytes(response);
    return bytes.length > 0 ? bytes[0] : 0;
  }

  private parseCoolantTemp(response: string): number {
    const bytes = this.hexToBytes(response);
    return bytes.length > 0 ? bytes[0] - 40 : 0;
  }

  private parseFuelLevel(response: string): number {
    const bytes = this.hexToBytes(response);
    return bytes.length > 0 ? (bytes[0] * 100) / 255 : 0;
  }

  private parseBatteryVoltage(response: string): number {
    const bytes = this.hexToBytes(response);
    if (bytes.length >= 2) {
      return ((bytes[0] * 256) + bytes[1]) / 1000;
    }
    return 0;
  }

  private hexToBytes(hex: string): number[] {
    const clean = hex.replace(/\s/g, '');
    const bytes: number[] = [];
    for (let i = 0; i < clean.length; i += 2) {
      bytes.push(parseInt(clean.substr(i, 2), 16));
    }
    return bytes;
  }
}

export const obd2Service = new OBD2Service();
