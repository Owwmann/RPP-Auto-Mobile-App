import { OBD2Service } from '../../../src/services/obd2Service';
import { MotorDaaSService } from '../../../src/services/motorDaaSService';
import { VINService } from '../../../src/services/vinService';
import { supabase } from '../../../src/config/supabase';

describe('OBD2 Service Integration Tests', () => {
  let obd2Service: OBD2Service;
  let motorDaaSService: MotorDaaSService;
  let vinService: VINService;

  beforeEach(() => {
    obd2Service = OBD2Service.getInstance();
    motorDaaSService = MotorDaaSService.getInstance();
    vinService = VINService.getInstance();
  });

  describe('VIN Decoding Integration', () => {
    it('should decode VIN and store vehicle data', async () => {
      const testVIN = '1HGBH41JXMN109186'; // Valid Honda VIN
      
      const vehicleInfo = await vinService.decodeVIN(testVIN);
      
      expect(vehicleInfo).toBeDefined();
      expect(vehicleInfo.vin).toBe(testVIN);
      expect(vehicleInfo.make).toBeTruthy();
      expect(vehicleInfo.model).toBeTruthy();
      expect(vehicleInfo.year).toBeGreaterThan(1900);

      // Store in database
      const { data, error } = await supabase
        .from('vehicles')
        .insert({
          user_id: 'test-user-1',
          vin: vehicleInfo.vin,
          make: vehicleInfo.make,
          model: vehicleInfo.model,
          year: vehicleInfo.year,
          metadata: vehicleInfo
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();

      // Cleanup
      await supabase.from('vehicles').delete().eq('id', data.id);
    });

    it('should validate invalid VIN', async () => {
      const invalidVIN = 'INVALID123';
      
      const isValid = vinService.validateVIN(invalidVIN);
      
      expect(isValid).toBe(false);
    });
  });

  describe('DTC Code Lookup Integration', () => {
    it('should lookup DTC code and get details', async () => {
      const dtcCode = 'P0420';
      
      const codeInfo = await motorDaaSService.lookupDTCCode(dtcCode);
      
      expect(codeInfo).toBeDefined();
      expect(codeInfo.code).toBe(dtcCode);
      expect(codeInfo.description).toBeTruthy();
      expect(codeInfo.severity).toBeTruthy();
      expect(codeInfo.possibleCauses).toBeDefined();
      expect(codeInfo.possibleCauses.length).toBeGreaterThan(0);
    });

    it('should lookup multiple codes in batch', async () => {
      const codes = ['P0420', 'P0300', 'P0171'];
      
      const results = await motorDaaSService.lookupDTCCodesBatch(codes);
      
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.code).toBeTruthy();
        expect(result.description).toBeTruthy();
      });
    });

    it('should store diagnostic results in database', async () => {
      const vehicleId = 'test-vehicle-1';
      const dtcCodes = ['P0420', 'P0300'];
      
      // Lookup codes
      const codeDetails = await motorDaaSService.lookupDTCCodesBatch(dtcCodes);
      
      // Store diagnostic session
      const { data: diagnostic, error: diagError } = await supabase
        .from('vehicle_diagnostics')
        .insert({
          vehicle_id: vehicleId,
          dtc_codes: dtcCodes,
          scan_date: new Date().toISOString(),
          severity: 'warning',
          metadata: { codeDetails }
        })
        .select()
        .single();

      expect(diagError).toBeNull();
      expect(diagnostic).toBeDefined();

      // Cleanup
      await supabase.from('vehicle_diagnostics').delete().eq('id', diagnostic.id);
    });
  });

  describe('OBD2 Device Integration', () => {
    it('should scan for OBD2 devices', async () => {
      const devices = await obd2Service.scanForDevices();
      
      expect(Array.isArray(devices)).toBe(true);
      // Note: May be empty if no devices available
    });

    it('should parse OBD2 responses correctly', () => {
      const response = '41 0C 1A F8'; // RPM response
      
      const rpm = obd2Service.parseRPM(response);
      
      expect(rpm).toBeGreaterThan(0);
    });

    it('should parse multiple sensor values', () => {
      const responses = {
        rpm: '41 0C 1A F8',
        speed: '41 0D 3C',
        coolant: '41 05 50'
      };

      const rpm = obd2Service.parseRPM(responses.rpm);
      const speed = obd2Service.parseSpeed(responses.speed);
      const coolant = obd2Service.parseCoolantTemp(responses.coolant);

      expect(rpm).toBeGreaterThan(0);
      expect(speed).toBeGreaterThanOrEqual(0);
      expect(coolant).toBeGreaterThan(-40); // Valid temperature range
    });
  });

  describe('End-to-End Diagnostic Flow', () => {
    it('should complete full diagnostic workflow', async () => {
      // 1. Decode VIN
      const testVIN = '1HGBH41JXMN109186';
      const vehicleInfo = await vinService.decodeVIN(testVIN);
      expect(vehicleInfo).toBeDefined();

      // 2. Simulate DTC codes read from OBD2
      const dtcCodes = ['P0420', 'P0171'];
      
      // 3. Lookup code details
      const codeDetails = await motorDaaSService.lookupDTCCodesBatch(dtcCodes);
      expect(codeDetails).toHaveLength(2);

      // 4. Store complete diagnostic
      const { data: vehicle } = await supabase
        .from('vehicles')
        .insert({
          user_id: 'test-user-flow',
          vin: vehicleInfo.vin,
          make: vehicleInfo.make,
          model: vehicleInfo.model,
          year: vehicleInfo.year
        })
        .select()
        .single();

      const { data: diagnostic } = await supabase
        .from('vehicle_diagnostics')
        .insert({
          vehicle_id: vehicle.id,
          dtc_codes: dtcCodes,
          scan_date: new Date().toISOString(),
          severity: 'warning',
          metadata: { codeDetails, vehicleInfo }
        })
        .select()
        .single();

      expect(diagnostic).toBeDefined();
      expect(diagnostic.dtc_codes).toEqual(dtcCodes);

      // Cleanup
      await supabase.from('vehicle_diagnostics').delete().eq('id', diagnostic.id);
      await supabase.from('vehicles').delete().eq('id', vehicle.id);
    });
  });
});
