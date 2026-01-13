import { supabase } from '../../src/config/supabase';
import { AgentOrchestrator } from '../../src/agents/AgentOrchestrator';
import { CustomerServiceAgent } from '../../src/agents/CustomerServiceAgent';
import { DiagnosticAgent } from '../../src/agents/DiagnosticAgent';
import { BookingAgent } from '../../src/agents/BookingAgent';
import { PartsAgent } from '../../src/agents/PartsAgent';
import { OBD2Service } from '../../src/services/obd2Service';
import { MotorDaaSService } from '../../src/services/motorDaaSService';
import { VINService } from '../../src/services/vinService';
import AnalyticsService from '../../src/services/analyticsService';
import ReportingService from '../../src/services/reportingService';

/**
 * Complete End-to-End Workflow Tests
 * 
 * These tests simulate real user workflows from start to finish,
 * including multiple agents, services, and database interactions.
 */

describe('Complete E2E Workflows', () => {
  let orchestrator: AgentOrchestrator;
  let customerAgent: CustomerServiceAgent;
  let diagnosticAgent: DiagnosticAgent;
  let bookingAgent: BookingAgent;
  let partsAgent: PartsAgent;
  
  const testUserId = 'e2e-test-user';
  const testVIN = '1HGBH41JXMN109186';

  beforeAll(async () => {
    // Initialize all agents
    orchestrator = AgentOrchestrator.getInstance();
    customerAgent = new CustomerServiceAgent('customer-e2e');
    diagnosticAgent = new DiagnosticAgent('diagnostic-e2e');
    bookingAgent = new BookingAgent('booking-e2e');
    partsAgent = new PartsAgent('parts-e2e');

    await customerAgent.initialize();
    await diagnosticAgent.initialize();
    await bookingAgent.initialize();
    await partsAgent.initialize();

    orchestrator.registerAgent(customerAgent);
    orchestrator.registerAgent(diagnosticAgent);
    orchestrator.registerAgent(bookingAgent);
    orchestrator.registerAgent(partsAgent);

    // Create test user
    const { error } = await supabase
      .from('users')
      .upsert({
        id: testUserId,
        email: 'e2e-test@example.com',
        preferences: {}
      });

    if (error) console.error('Error creating test user:', error);
  });

  afterAll(async () => {
    // Cleanup
    orchestrator.shutdown();
    
    // Delete test data
    await supabase.from('users').delete().eq('id', testUserId);
    await supabase.from('vehicles').delete().eq('user_id', testUserId);
  });

  describe('Complete Diagnostic Workflow', () => {
    it('should complete full diagnostic workflow from VIN to report', async () => {
      const vinService = VINService.getInstance();
      const motorDaaS = MotorDaaSService.getInstance();
      const reportingService = ReportingService.getInstance();

      // Step 1: User adds vehicle by VIN
      console.log('Step 1: Decoding VIN...');
      const vehicleInfo = await vinService.decodeVIN(testVIN);
      expect(vehicleInfo).toBeDefined();
      expect(vehicleInfo.vin).toBe(testVIN);

      // Step 2: Store vehicle in database
      console.log('Step 2: Storing vehicle...');
      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .insert({
          user_id: testUserId,
          vin: vehicleInfo.vin,
          make: vehicleInfo.make,
          model: vehicleInfo.model,
          year: vehicleInfo.year,
          metadata: vehicleInfo
        })
        .select()
        .single();

      expect(vehicleError).toBeNull();
      expect(vehicle).toBeDefined();

      // Step 3: User scans vehicle (simulated DTC codes)
      console.log('Step 3: Simulating diagnostic scan...');
      const dtcCodes = ['P0420', 'P0171', 'P0300'];

      // Step 4: Lookup DTC codes
      console.log('Step 4: Looking up DTC codes...');
      const codeDetails = await motorDaaS.lookupDTCCodesBatch(dtcCodes);
      expect(codeDetails).toHaveLength(3);
      codeDetails.forEach(detail => {
        expect(detail.description).toBeTruthy();
      });

      // Step 5: Store diagnostic results
      console.log('Step 5: Storing diagnostic...');
      const { data: diagnostic, error: diagError } = await supabase
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

      expect(diagError).toBeNull();
      expect(diagnostic).toBeDefined();

      // Step 6: User asks diagnostic agent about the codes
      console.log('Step 6: Asking diagnostic agent...');
      const diagnosticResponse = await orchestrator.routeMessage({
        id: 'e2e-diag-msg',
        content: `I have codes ${dtcCodes.join(', ')} on my ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`,
        userId: testUserId,
        conversationId: 'e2e-conv-diag',
        timestamp: new Date(),
        metadata: { vehicleId: vehicle.id }
      });

      expect(diagnosticResponse).toBeDefined();
      expect(diagnosticResponse.content).toBeTruthy();
      expect(diagnosticResponse.agentId).toBe('diagnostic-e2e');

      // Step 7: Generate diagnostic report
      console.log('Step 7: Generating report...');
      const report = await reportingService.generateDiagnosticReport(diagnostic.id);
      expect(report).toBeDefined();
      expect(report?.dtcCodes).toEqual(dtcCodes);
      expect(report?.recommendations.length).toBeGreaterThan(0);

      console.log('✅ Complete diagnostic workflow successful!');

      // Cleanup this test's data
      await supabase.from('vehicle_diagnostics').delete().eq('id', diagnostic.id);
      await supabase.from('vehicles').delete().eq('id', vehicle.id);
    }, 30000); // 30 second timeout
  });

  describe('Complete Service Booking Workflow', () => {
    it('should complete booking workflow from diagnosis to appointment', async () => {
      // Step 1: User has diagnostic issue
      console.log('Step 1: User reports issue...');
      const issueResponse = await orchestrator.routeMessage({
        id: 'e2e-book-1',
        content: 'My check engine light is on, I need to schedule service',
        userId: testUserId,
        conversationId: 'e2e-conv-book',
        timestamp: new Date(),
        metadata: {}
      });

      expect(issueResponse).toBeDefined();

      // Step 2: Find service providers
      console.log('Step 2: Finding service providers...');
      const { data: providers } = await supabase
        .from('service_providers')
        .select('*')
        .limit(5);

      // Step 3: User requests booking
      console.log('Step 3: Requesting appointment...');
      const bookingResponse = await orchestrator.routeMessage({
        id: 'e2e-book-2',
        content: 'Book an appointment for diagnostic service tomorrow at 2pm',
        userId: testUserId,
        conversationId: 'e2e-conv-book',
        timestamp: new Date(),
        metadata: {
          preferredDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          preferredTime: '14:00'
        }
      });

      expect(bookingResponse).toBeDefined();
      expect(bookingResponse.agentId).toBe('booking-e2e');

      console.log('✅ Booking workflow successful!');
    }, 20000);
  });

  describe('Complete Parts Recommendation Workflow', () => {
    it('should recommend parts based on diagnostic codes', async () => {
      // Step 1: User has diagnostic codes
      const dtcCodes = ['P0420'];
      
      console.log('Step 1: Asking for parts recommendations...');
      const partsResponse = await orchestrator.routeMessage({
        id: 'e2e-parts-1',
        content: `I need parts to fix code ${dtcCodes[0]}`,
        userId: testUserId,
        conversationId: 'e2e-conv-parts',
        timestamp: new Date(),
        metadata: { dtcCodes }
      });

      expect(partsResponse).toBeDefined();
      expect(partsResponse.agentId).toBe('parts-e2e');
      expect(partsResponse.content).toBeTruthy();

      console.log('✅ Parts recommendation workflow successful!');
    }, 20000);
  });

  describe('Multi-Agent Conversation Flow', () => {
    it('should handle conversation spanning multiple agents', async () => {
      const conversationId = 'e2e-multi-conv';

      // Message 1: General inquiry (Customer Service)
      console.log('Message 1: General inquiry...');
      const response1 = await orchestrator.routeMessage({
        id: 'e2e-multi-1',
        content: 'Hello, I have a problem with my car',
        userId: testUserId,
        conversationId,
        timestamp: new Date(),
        metadata: {}
      });
      expect(response1.agentId).toBe('customer-e2e');

      // Message 2: Diagnostic question (Diagnostic Agent)
      console.log('Message 2: Diagnostic question...');
      const response2 = await orchestrator.routeMessage({
        id: 'e2e-multi-2',
        content: 'I have a P0420 code, what does it mean?',
        userId: testUserId,
        conversationId,
        timestamp: new Date(),
        metadata: {}
      });
      expect(response2.agentId).toBe('diagnostic-e2e');

      // Message 3: Parts inquiry (Parts Agent)
      console.log('Message 3: Parts inquiry...');
      const response3 = await orchestrator.routeMessage({
        id: 'e2e-multi-3',
        content: 'What parts do I need to fix this?',
        userId: testUserId,
        conversationId,
        timestamp: new Date(),
        metadata: { dtcCodes: ['P0420'] }
      });
      expect(response3.agentId).toBe('parts-e2e');

      // Message 4: Booking request (Booking Agent)
      console.log('Message 4: Booking request...');
      const response4 = await orchestrator.routeMessage({
        id: 'e2e-multi-4',
        content: 'Schedule a service appointment for next week',
        userId: testUserId,
        conversationId,
        timestamp: new Date(),
        metadata: {}
      });
      expect(response4.agentId).toBe('booking-e2e');

      console.log('✅ Multi-agent conversation flow successful!');
    }, 30000);
  });

  describe('Analytics and Reporting Integration', () => {
    it('should track events throughout workflow', async () => {
      const analyticsService = AnalyticsService.getInstance();
      const reportingService = ReportingService.getInstance();

      // Track various events
      await analyticsService.trackScreenView('diagnostic_screen', testUserId);
      await analyticsService.trackAction('scan_vehicle', { vehicleId: 'test-vehicle' }, testUserId);
      await analyticsService.trackDiagnosticScan('test-vehicle', 3, 5000, testUserId);

      // Wait for events to be flushed
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate usage report
      const report = await reportingService.generateUsageReport(testUserId, 'day');
      
      expect(report).toBeDefined();
      if (report) {
        expect(report.userId).toBe(testUserId);
      }

      console.log('✅ Analytics tracking successful!');
    }, 15000);
  });
});
