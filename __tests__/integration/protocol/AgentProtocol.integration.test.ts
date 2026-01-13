import { MessageQueue } from '../../../src/agents/protocol/MessageQueue';
import { RequestHandler } from '../../../src/agents/protocol/RequestHandler';
import { ResponseHandler } from '../../../src/agents/protocol/ResponseHandler';
import { EventSystem } from '../../../src/agents/protocol/EventSystem';
import { AgentOrchestrator } from '../../../src/agents/AgentOrchestrator';
import { CustomerServiceAgent } from '../../../src/agents/CustomerServiceAgent';
import { DiagnosticAgent } from '../../../src/agents/DiagnosticAgent';

describe('Agent Protocol Integration Tests', () => {
  let messageQueue: MessageQueue;
  let requestHandler: RequestHandler;
  let responseHandler: ResponseHandler;
  let eventSystem: EventSystem;
  let orchestrator: AgentOrchestrator;

  beforeEach(() => {
    messageQueue = MessageQueue.getInstance();
    requestHandler = RequestHandler.getInstance();
    responseHandler = ResponseHandler.getInstance();
    eventSystem = EventSystem.getInstance();
    orchestrator = AgentOrchestrator.getInstance();
  });

  afterEach(() => {
    messageQueue.shutdown();
    orchestrator.shutdown();
  });

  describe('Message Queue Operations', () => {
    it('should enqueue and dequeue messages correctly', async () => {
      const message = {
        id: 'msg-1',
        type: 'request' as const,
        priority: 1,
        content: 'Test message',
        userId: 'user-1',
        conversationId: 'conv-1',
        timestamp: new Date(),
        metadata: {}
      };

      await messageQueue.enqueue(message);
      const dequeued = await messageQueue.dequeue();

      expect(dequeued).toBeDefined();
      expect(dequeued?.id).toBe(message.id);
    });

    it('should prioritize messages correctly', async () => {
      const lowPriority = {
        id: 'msg-low',
        type: 'request' as const,
        priority: 3,
        content: 'Low priority',
        userId: 'user-1',
        conversationId: 'conv-1',
        timestamp: new Date(),
        metadata: {}
      };

      const highPriority = {
        id: 'msg-high',
        type: 'request' as const,
        priority: 1,
        content: 'High priority',
        userId: 'user-1',
        conversationId: 'conv-1',
        timestamp: new Date(),
        metadata: {}
      };

      await messageQueue.enqueue(lowPriority);
      await messageQueue.enqueue(highPriority);

      const first = await messageQueue.dequeue();
      expect(first?.id).toBe('msg-high');

      const second = await messageQueue.dequeue();
      expect(second?.id).toBe('msg-low');
    });

    it('should handle queue size limits', async () => {
      // Fill queue
      for (let i = 0; i < 100; i++) {
        await messageQueue.enqueue({
          id: `msg-${i}`,
          type: 'request',
          priority: 2,
          content: `Message ${i}`,
          userId: 'user-1',
          conversationId: 'conv-1',
          timestamp: new Date(),
          metadata: {}
        });
      }

      const size = messageQueue.getSize();
      expect(size).toBeGreaterThan(0);
      expect(size).toBeLessThanOrEqual(100);
    });
  });

  describe('Request Handler Integration', () => {
    it('should create and validate request', () => {
      const request = requestHandler.createRequest(
        'test-action',
        { param1: 'value1' },
        1,
        'agent-1',
        'user-1'
      );

      expect(request).toBeDefined();
      expect(request.id).toBeTruthy();
      expect(request.action).toBe('test-action');
      expect(request.priority).toBe(1);

      const isValid = requestHandler.validateRequest(request);
      expect(isValid).toBe(true);
    });

    it('should handle request timeout', async () => {
      const request = requestHandler.createRequest(
        'timeout-action',
        {},
        2,
        'agent-1',
        'user-1'
      );

      const timeout = 100; // 100ms timeout

      await expect(
        requestHandler.executeRequest(request, timeout)
      ).rejects.toThrow();
    });

    it('should retry failed requests', async () => {
      const request = requestHandler.createRequest(
        'retry-action',
        {},
        2,
        'agent-1',
        'user-1'
      );

      let attempts = 0;
      const mockExecutor = async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Simulated failure');
        }
        return { success: true };
      };

      const result = await requestHandler.retryRequest(
        request,
        mockExecutor,
        3,
        100
      );

      expect(result.success).toBe(true);
      expect(attempts).toBe(3);
    });
  });

  describe('Response Handler Integration', () => {
    it('should create and validate response', () => {
      const response = responseHandler.createResponse(
        'req-1',
        'agent-1',
        { result: 'success' },
        null,
        'user-1'
      );

      expect(response).toBeDefined();
      expect(response.requestId).toBe('req-1');
      expect(response.success).toBe(true);

      const isValid = responseHandler.validateResponse(response);
      expect(isValid).toBe(true);
    });

    it('should create error response', () => {
      const error = new Error('Test error');
      const response = responseHandler.createResponse(
        'req-1',
        'agent-1',
        null,
        error,
        'user-1'
      );

      expect(response.success).toBe(false);
      expect(response.error).toBe('Test error');
    });

    it('should cache responses', async () => {
      const response = responseHandler.createResponse(
        'req-cache',
        'agent-1',
        { cached: true },
        null,
        'user-1'
      );

      await responseHandler.cacheResponse(response);
      const cached = await responseHandler.getCachedResponse('req-cache');

      expect(cached).toBeDefined();
      expect(cached?.data.cached).toBe(true);
    });
  });

  describe('Event System Integration', () => {
    it('should emit and handle events', (done) => {
      const eventData = { test: 'data' };

      eventSystem.on('test-event', (data) => {
        expect(data).toEqual(eventData);
        done();
      });

      eventSystem.emit('test-event', eventData);
    });

    it('should handle multiple listeners', () => {
      let count = 0;

      eventSystem.on('multi-event', () => count++);
      eventSystem.on('multi-event', () => count++);
      eventSystem.on('multi-event', () => count++);

      eventSystem.emit('multi-event', {});

      expect(count).toBe(3);
    });

    it('should remove listeners', () => {
      let count = 0;
      const listener = () => count++;

      eventSystem.on('remove-event', listener);
      eventSystem.emit('remove-event', {});
      expect(count).toBe(1);

      eventSystem.off('remove-event', listener);
      eventSystem.emit('remove-event', {});
      expect(count).toBe(1); // Should not increment
    });
  });

  describe('End-to-End Protocol Flow', () => {
    it('should complete full message flow', async () => {
      // Setup agents
      const customerAgent = new CustomerServiceAgent('customer-1');
      await customerAgent.initialize();
      orchestrator.registerAgent(customerAgent);

      // Create request
      const request = requestHandler.createRequest(
        'chat',
        { message: 'Hello, I need help' },
        1,
        'customer-1',
        'user-test'
      );

      // Enqueue message
      await messageQueue.enqueue({
        id: request.id,
        type: 'request',
        priority: request.priority,
        content: JSON.stringify(request),
        userId: request.userId!,
        conversationId: 'conv-test',
        timestamp: new Date(),
        metadata: {}
      });

      // Dequeue and process
      const message = await messageQueue.dequeue();
      expect(message).toBeDefined();

      if (message) {
        const parsedRequest = JSON.parse(message.content);
        const response = await orchestrator.routeMessage({
          id: message.id,
          content: parsedRequest.parameters.message,
          userId: message.userId,
          conversationId: message.conversationId,
          timestamp: message.timestamp,
          metadata: {}
        });

        expect(response).toBeDefined();
        expect(response.content).toBeTruthy();
      }
    });

    it('should handle concurrent message processing', async () => {
      const diagnosticAgent = new DiagnosticAgent('diagnostic-1');
      const customerAgent = new CustomerServiceAgent('customer-1');
      
      await diagnosticAgent.initialize();
      await customerAgent.initialize();
      
      orchestrator.registerAgent(diagnosticAgent);
      orchestrator.registerAgent(customerAgent);

      // Create multiple requests
      const requests = [
        {
          id: 'req-1',
          content: 'P0420 code help',
          userId: 'user-1',
          conversationId: 'conv-1',
          timestamp: new Date(),
          metadata: {}
        },
        {
          id: 'req-2',
          content: 'What are your hours?',
          userId: 'user-2',
          conversationId: 'conv-2',
          timestamp: new Date(),
          metadata: {}
        },
        {
          id: 'req-3',
          content: 'Check engine light diagnosis',
          userId: 'user-3',
          conversationId: 'conv-3',
          timestamp: new Date(),
          metadata: {}
        }
      ];

      // Process concurrently
      const responses = await Promise.all(
        requests.map(req => orchestrator.routeMessage(req))
      );

      expect(responses).toHaveLength(3);
      responses.forEach(response => {
        expect(response).toBeDefined();
        expect(response.content).toBeTruthy();
      });
    });
  });
});
