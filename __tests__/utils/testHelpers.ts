import { supabase } from '../../src/config/supabase';
import { AgentOrchestrator } from '../../src/agents/AgentOrchestrator';

/**
 * Test helper utilities for RPP Auto testing
 */

export class TestHelpers {
  // Generate unique test ID
  static generateTestId(prefix: string = 'test'): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  // Create test user
  static async createTestUser(email?: string): Promise<any> {
    const testEmail = email || `test-${Date.now()}@example.com`;
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: testEmail,
        preferences: {}
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Create test vehicle
  static async createTestVehicle(userId: string, vin?: string): Promise<any> {
    const testVIN = vin || '1HGBH41JXMN109186';
    const { data, error } = await supabase
      .from('vehicles')
      .insert({
        user_id: userId,
        vin: testVIN,
        make: 'Honda',
        model: 'Accord',
        year: 2020,
        metadata: {}
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Create test diagnostic
  static async createTestDiagnostic(
    vehicleId: string,
    dtcCodes: string[] = ['P0420']
  ): Promise<any> {
    const { data, error } = await supabase
      .from('vehicle_diagnostics')
      .insert({
        vehicle_id: vehicleId,
        dtc_codes: dtcCodes,
        scan_date: new Date().toISOString(),
        severity: 'warning',
        metadata: {}
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete test user and all related data
  static async deleteTestUser(userId: string): Promise<void> {
    // Delete in order of dependencies
    await supabase.from('vehicle_diagnostics').delete().eq('user_id', userId);
    await supabase.from('vehicles').delete().eq('user_id', userId);
    await supabase.from('ai_conversations').delete().eq('user_id', userId);
    await supabase.from('users').delete().eq('id', userId);
  }

  // Wait for async operation
  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock agent response
  static mockAgentResponse(content: string, agentId: string = 'test-agent'): any {
    return {
      id: TestHelpers.generateTestId('response'),
      content,
      agentId,
      timestamp: new Date(),
      metadata: {},
      conversationId: 'test-conv',
      userId: 'test-user'
    };
  }

  // Create test message
  static createTestMessage(
    content: string,
    userId: string = 'test-user',
    conversationId: string = 'test-conv'
  ): any {
    return {
      id: TestHelpers.generateTestId('msg'),
      content,
      userId,
      conversationId,
      timestamp: new Date(),
      metadata: {}
    };
  }

  // Setup test agents
  static async setupTestAgents(): Promise<AgentOrchestrator> {
    const orchestrator = AgentOrchestrator.getInstance();
    // Agents can be registered here if needed
    return orchestrator;
  }

  // Teardown test agents
  static async teardownTestAgents(): Promise<void> {
    const orchestrator = AgentOrchestrator.getInstance();
    orchestrator.shutdown();
  }

  // Verify database record exists
  static async verifyRecordExists(
    table: string,
    id: string
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from(table)
      .select('id')
      .eq('id', id)
      .single();

    return !error && !!data;
  }

  // Get record count
  static async getRecordCount(
    table: string,
    filters?: Record<string, any>
  ): Promise<number> {
    let query = supabase.from(table).select('id', { count: 'exact' });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { count, error } = await query;

    if (error) throw error;
    return count || 0;
  }

  // Clean all test data
  static async cleanAllTestData(): Promise<void> {
    await supabase.from('vehicle_diagnostics').delete().like('id', 'test-%');
    await supabase.from('vehicles').delete().like('id', 'test-%');
    await supabase.from('users').delete().like('email', 'test-%');
    await supabase.from('ai_conversations').delete().like('id', 'test-%');
  }
}

export default TestHelpers;
