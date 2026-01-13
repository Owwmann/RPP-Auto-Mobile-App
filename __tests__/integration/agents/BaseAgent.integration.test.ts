import { BaseAgent } from '../../../src/agents/BaseAgent';
import { AgentOrchestrator } from '../../../src/agents/AgentOrchestrator';
import { CustomerServiceAgent } from '../../../src/agents/CustomerServiceAgent';
import { DiagnosticAgent } from '../../../src/agents/DiagnosticAgent';
import { supabase } from '../../../src/config/supabase';

describe('Agent Integration Tests', () => {
  let orchestrator: AgentOrchestrator;
  let customerAgent: CustomerServiceAgent;
  let diagnosticAgent: DiagnosticAgent;

  beforeEach(() => {
    orchestrator = AgentOrchestrator.getInstance();
    customerAgent = new CustomerServiceAgent('customer-service-1');
    diagnosticAgent = new DiagnosticAgent('diagnostic-1');
    
    orchestrator.registerAgent(customerAgent);
    orchestrator.registerAgent(diagnosticAgent);
  });

  afterEach(() => {
    orchestrator.shutdown();
  });

  describe('Agent Lifecycle', () => {
    it('should initialize agent correctly', async () => {
      await customerAgent.initialize();
      
      expect(customerAgent.getState()).toBe('IDLE');
      expect(customerAgent.isInitialized()).toBe(true);
    });

    it('should handle messages through complete lifecycle', async () => {
      await customerAgent.initialize();
      
      const response = await customerAgent.handleMessage({
        id: 'test-msg-1',
        content: 'Hello, I need help',
        userId: 'test-user-1',
        conversationId: 'test-conv-1',
        timestamp: new Date(),
        metadata: {}
      });

      expect(response).toBeDefined();
      expect(response.content).toBeTruthy();
      expect(response.agentId).toBe('customer-service-1');
    });

    it('should shutdown gracefully', async () => {
      await customerAgent.initialize();
      await customerAgent.shutdown();
      
      expect(customerAgent.getState()).toBe('IDLE');
    });
  });

  describe('Agent Orchestration', () => {
    it('should route message to correct agent', async () => {
      await customerAgent.initialize();
      await diagnosticAgent.initialize();

      const message = {
        id: 'test-msg-2',
        content: 'My check engine light is on',
        userId: 'test-user-1',
        conversationId: 'test-conv-1',
        timestamp: new Date(),
        metadata: {}
      };

      const response = await orchestrator.routeMessage(message);
      
      expect(response).toBeDefined();
      expect(response.agentId).toBe('diagnostic-1');
    });

    it('should handle multiple concurrent messages', async () => {
      await customerAgent.initialize();
      await diagnosticAgent.initialize();

      const messages = [
        {
          id: 'msg-1',
          content: 'What are your hours?',
          userId: 'user-1',
          conversationId: 'conv-1',
          timestamp: new Date(),
          metadata: {}
        },
        {
          id: 'msg-2',
          content: 'P0420 code diagnosis',
          userId: 'user-2',
          conversationId: 'conv-2',
          timestamp: new Date(),
          metadata: {}
        }
      ];

      const responses = await Promise.all(
        messages.map(msg => orchestrator.routeMessage(msg))
      );

      expect(responses).toHaveLength(2);
      expect(responses[0].agentId).toBe('customer-service-1');
      expect(responses[1].agentId).toBe('diagnostic-1');
    });
  });

  describe('Context Persistence', () => {
    it('should persist conversation context', async () => {
      await customerAgent.initialize();
      
      const conversationId = 'test-conv-persist';
      
      // First message
      await customerAgent.handleMessage({
        id: 'msg-1',
        content: 'My car is a 2020 Honda Accord',
        userId: 'user-1',
        conversationId,
        timestamp: new Date(),
        metadata: {}
      });

      // Second message should have context
      const response = await customerAgent.handleMessage({
        id: 'msg-2',
        content: 'What oil does it need?',
        userId: 'user-1',
        conversationId,
        timestamp: new Date(),
        metadata: {}
      });

      expect(response.content).toContain('Accord');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid messages gracefully', async () => {
      await customerAgent.initialize();
      
      const response = await customerAgent.handleMessage({
        id: 'invalid-msg',
        content: '',
        userId: 'user-1',
        conversationId: 'conv-1',
        timestamp: new Date(),
        metadata: {}
      });

      expect(response).toBeDefined();
      expect(response.error).toBeDefined();
    });

    it('should recover from errors and continue', async () => {
      await customerAgent.initialize();
      
      // Simulate error
      jest.spyOn(customerAgent, 'processMessage').mockRejectedValueOnce(
        new Error('Test error')
      );

      const response1 = await customerAgent.handleMessage({
        id: 'msg-error',
        content: 'Test',
        userId: 'user-1',
        conversationId: 'conv-1',
        timestamp: new Date(),
        metadata: {}
      });

      expect(response1.error).toBeDefined();

      // Should work on next message
      const response2 = await customerAgent.handleMessage({
        id: 'msg-ok',
        content: 'Test again',
        userId: 'user-1',
        conversationId: 'conv-1',
        timestamp: new Date(),
        metadata: {}
      });

      expect(response2.error).toBeUndefined();
    });
  });
});
