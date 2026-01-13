/**
 * Message Router
 * Routes messages between agents and handles message delivery
 */

import {AgentMessage, AgentRequest, AgentResponse, MessagePriority, validateMessage} from './MessageSchema';
import {EventEmitter} from 'events';

export class MessageRouter extends EventEmitter {
  private messageQueue: Map<MessagePriority, AgentMessage[]> = new Map();
  private pendingRequests: Map<string, AgentRequest> = new Map();
  private messageHistory: Map<string, AgentMessage[]> = new Map();
  private isProcessing: boolean = false;

  constructor() {
    super();
    this.initializeQueue();
  }

  private initializeQueue(): void {
    // Initialize priority queues
    Object.values(MessagePriority).forEach(priority => {
      if (typeof priority === 'number') {
        this.messageQueue.set(priority, []);
      }
    });
  }

  /**
   * Route a message to the appropriate destination
   */
  async routeMessage(message: AgentMessage): Promise<void> {
    // Validate message
    const validation = validateMessage(message);
    if (!validation.valid) {
      throw new Error(`Invalid message: ${validation.errors.join(', ')}`);
    }

    // Add to appropriate priority queue
    const queue = this.messageQueue.get(message.priority) || [];
    queue.push(message);
    this.messageQueue.set(message.priority, queue);

    // Store in history
    this.addToHistory(message);

    // Emit event
    this.emit('messageReceived', message);

    // Process queue
    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  /**
   * Process message queue by priority
   */
  private async processQueue(): Promise<void> {
    this.isProcessing = true;

    try {
      // Process from highest to lowest priority
      const priorities = [
        MessagePriority.URGENT,
        MessagePriority.HIGH,
        MessagePriority.NORMAL,
        MessagePriority.LOW,
      ];

      for (const priority of priorities) {
        const queue = this.messageQueue.get(priority);
        if (queue && queue.length > 0) {
          const message = queue.shift();
          if (message) {
            await this.deliverMessage(message);
          }
        }
      }
    } finally {
      this.isProcessing = false;

      // Check if there are more messages
      if (this.hasMessages()) {
        await this.processQueue();
      }
    }
  }

  /**
   * Deliver message to destination
   */
  private async deliverMessage(message: AgentMessage): Promise<void> {
    try {
      message.status = 'sent';
      this.emit('messageDelivered', message);

      // Update message status in history
      this.updateHistoryStatus(message.id, 'delivered');
    } catch (error) {
      message.status = 'failed';
      message.error = (error as Error).message;
      this.emit('messageDeliveryFailed', {message, error});
    }
  }

  /**
   * Send request from one agent to another
   */
  async sendRequest(request: AgentRequest): Promise<AgentResponse> {
    this.pendingRequests.set(request.requestId, request);

    return new Promise((resolve, reject) => {
      const timeout = request.timeout || 30000;

      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(request.requestId);
        reject(new Error('Request timeout'));
      }, timeout);

      this.once(`response:${request.requestId}`, (response: AgentResponse) => {
        clearTimeout(timeoutId);
        this.pendingRequests.delete(request.requestId);
        resolve(response);
      });

      this.emit('requestSent', request);
    });
  }

  /**
   * Send response to a request
   */
  sendResponse(response: AgentResponse): void {
    this.emit(`response:${response.requestId}`, response);
    this.emit('responseSent', response);
  }

  /**
   * Get message history for a conversation
   */
  getConversationHistory(conversationId: string): AgentMessage[] {
    return this.messageHistory.get(conversationId) || [];
  }

  /**
   * Add message to history
   */
  private addToHistory(message: AgentMessage): void {
    const history = this.messageHistory.get(message.conversationId) || [];
    history.push(message);

    // Keep only last 100 messages per conversation
    if (history.length > 100) {
      history.shift();
    }

    this.messageHistory.set(message.conversationId, history);
  }

  /**
   * Update message status in history
   */
  private updateHistoryStatus(messageId: string, status: string): void {
    for (const [conversationId, messages] of this.messageHistory.entries()) {
      const message = messages.find(m => m.id === messageId);
      if (message) {
        message.status = status as any;
        break;
      }
    }
  }

  /**
   * Check if queue has messages
   */
  private hasMessages(): boolean {
    for (const queue of this.messageQueue.values()) {
      if (queue.length > 0) return true;
    }
    return false;
  }

  /**
   * Get queue statistics
   */
  getQueueStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    for (const [priority, queue] of this.messageQueue.entries()) {
      stats[`priority_${priority}`] = queue.length;
    }
    return stats;
  }

  /**
   * Clear all queues
   */
  clearQueues(): void {
    for (const queue of this.messageQueue.values()) {
      queue.length = 0;
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory(conversationId?: string): void {
    if (conversationId) {
      this.messageHistory.delete(conversationId);
    } else {
      this.messageHistory.clear();
    }
  }
}

// Singleton instance
export const messageRouter = new MessageRouter();
