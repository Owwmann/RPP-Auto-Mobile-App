/**
 * Base Agent Framework
 * Core abstract class that all specialized agents extend
 */

import {EventEmitter} from 'events';

export enum AgentState {
  IDLE = 'idle',
  LISTENING = 'listening',
  PROCESSING = 'processing',
  ACTION = 'action',
  RESPONDING = 'responding',
  WAITING = 'waiting',
  ERROR = 'error',
}

export interface AgentMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'user' | 'agent';
  content: string;
  messageType: 'text' | 'image' | 'diagnostic_report' | 'recommendation';
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AgentContext {
  conversationId: string;
  userId: string;
  vehicleId?: string;
  history: AgentMessage[];
  entities: Record<string, any>;
  intent?: string;
  confidence?: number;
}

export interface AgentConfig {
  name: string;
  type: string;
  description: string;
  capabilities: string[];
  priority: number;
}

export abstract class BaseAgent extends EventEmitter {
  protected state: AgentState = AgentState.IDLE;
  protected config: AgentConfig;
  protected context: AgentContext | null = null;
  private stateHistory: Array<{state: AgentState; timestamp: Date}> = [];

  constructor(config: AgentConfig) {
    super();
    this.config = config;
    this.log('info', `Agent ${config.name} initialized`);
  }

  // ============ Abstract Methods (Must be implemented by subclasses) ============

  /**
   * Process a user message and generate a response
   */
  abstract processMessage(message: AgentMessage, context: AgentContext): Promise<AgentMessage>;

  /**
   * Determine if this agent can handle the given intent
   */
  abstract canHandle(intent: string, entities: Record<string, any>): boolean;

  /**
   * Execute agent-specific action
   */
  abstract executeAction(action: string, params: Record<string, any>): Promise<any>;

  // ============ State Management ============

  protected setState(newState: AgentState): void {
    const oldState = this.state;
    this.state = newState;

    this.stateHistory.push({
      state: newState,
      timestamp: new Date(),
    });

    this.log('debug', `State transition: ${oldState} -> ${newState}`);
    this.emit('stateChange', {oldState, newState, timestamp: new Date()});
  }

  public getState(): AgentState {
    return this.state;
  }

  public getStateHistory(): Array<{state: AgentState; timestamp: Date}> {
    return [...this.stateHistory];
  }

  // ============ Context Management ============

  public setContext(context: AgentContext): void {
    this.context = context;
    this.log('debug', `Context set for conversation ${context.conversationId}`);
  }

  public getContext(): AgentContext | null {
    return this.context;
  }

  public clearContext(): void {
    this.context = null;
    this.setState(AgentState.IDLE);
  }

  // ============ Message Handling ============

  public async handleMessage(message: AgentMessage, context: AgentContext): Promise<AgentMessage> {
    try {
      this.setContext(context);
      this.setState(AgentState.LISTENING);

      this.log('info', `Handling message: ${message.id}`);

      // Validate message
      if (!this.validateMessage(message)) {
        throw new Error('Invalid message format');
      }

      this.setState(AgentState.PROCESSING);

      // Process the message (implemented by subclass)
      const response = await this.processMessage(message, context);

      this.setState(AgentState.RESPONDING);

      return response;
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    } finally {
      this.setState(AgentState.IDLE);
    }
  }

  protected validateMessage(message: AgentMessage): boolean {
    return !!(
      message.id &&
      message.conversationId &&
      message.content &&
      message.senderId
    );
  }

  // ============ Error Handling ============

  protected handleError(error: Error): void {
    this.setState(AgentState.ERROR);
    this.log('error', `Error in ${this.config.name}: ${error.message}`, {
      error: error.stack,
    });
    this.emit('error', {
      agent: this.config.name,
      error: error.message,
      timestamp: new Date(),
    });
  }

  // ============ Logging ============

  protected log(
    level: 'debug' | 'info' | 'warn' | 'error',
    message: string,
    metadata?: Record<string, any>
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      agent: this.config.name,
      message,
      state: this.state,
      ...metadata,
    };

    console.log(JSON.stringify(logEntry));
    this.emit('log', logEntry);
  }

  // ============ Utility Methods ============

  public getConfig(): AgentConfig {
    return {...this.config};
  }

  public getName(): string {
    return this.config.name;
  }

  public getType(): string {
    return this.config.type;
  }

  public getCapabilities(): string[] {
    return [...this.config.capabilities];
  }

  public isIdle(): boolean {
    return this.state === AgentState.IDLE;
  }

  public isBusy(): boolean {
    return this.state !== AgentState.IDLE && this.state !== AgentState.ERROR;
  }

  // ============ Lifecycle Methods ============

  public async initialize(): Promise<void> {
    this.log('info', 'Initializing agent');
    this.setState(AgentState.IDLE);
  }

  public async shutdown(): Promise<void> {
    this.log('info', 'Shutting down agent');
    this.clearContext();
    this.removeAllListeners();
  }
}
