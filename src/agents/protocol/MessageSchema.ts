/**
 * Message Schema Definitions
 * Standard message formats for inter-agent communication
 */

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  DIAGNOSTIC_REPORT = 'diagnostic_report',
  RECOMMENDATION = 'recommendation',
  BOOKING_CONFIRMATION = 'booking_confirmation',
  ERROR = 'error',
  SYSTEM = 'system',
}

export enum MessagePriority {
  LOW = 1,
  NORMAL = 5,
  HIGH = 8,
  URGENT = 10,
}

export interface MessageMetadata {
  intent?: string;
  confidence?: number;
  entities?: Record<string, any>;
  conversationId: string;
  userId: string;
  vehicleId?: string;
  timestamp: string;
  [key: string]: any;
}

export interface AgentMessage {
  // Core fields
  id: string;
  conversationId: string;

  // Sender information
  senderId: string;
  senderType: 'user' | 'agent' | 'system';
  senderAgent?: string; // Agent type if sender is agent

  // Message content
  content: string;
  messageType: MessageType;

  // Metadata
  timestamp: Date;
  priority: MessagePriority;
  metadata: MessageMetadata;

  // Reply/threading
  replyTo?: string; // Message ID being replied to
  threadId?: string; // Thread identifier

  // Status
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  error?: string;

  // Attachments
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'link';
  url: string;
  mimeType?: string;
  size?: number;
  name?: string;
}

export interface AgentRequest {
  requestId: string;
  sourceAgent: string;
  targetAgent: string;
  action: string;
  parameters: Record<string, any>;
  timeout?: number;
  timestamp: Date;
}

export interface AgentResponse {
  responseId: string;
  requestId: string;
  sourceAgent: string;
  success: boolean;
  data?: any;
  error?: string;
  timestamp: Date;
}

export interface AgentRegistration {
  agentId: string;
  agentType: string;
  capabilities: string[];
  priority: number;
  status: 'active' | 'idle' | 'busy' | 'offline';
  lastHeartbeat: Date;
}

export interface MessageValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate message structure
 */
export function validateMessage(message: any): MessageValidationResult {
  const errors: string[] = [];

  // Required fields
  if (!message.id) errors.push('Missing required field: id');
  if (!message.conversationId) errors.push('Missing required field: conversationId');
  if (!message.senderId) errors.push('Missing required field: senderId');
  if (!message.senderType) errors.push('Missing required field: senderType');
  if (!message.content) errors.push('Missing required field: content');
  if (!message.messageType) errors.push('Missing required field: messageType');

  // Type validation
  if (message.senderType && !['user', 'agent', 'system'].includes(message.senderType)) {
    errors.push('Invalid senderType');
  }

  if (message.messageType && !Object.values(MessageType).includes(message.messageType)) {
    errors.push('Invalid messageType');
  }

  if (message.priority && !Object.values(MessagePriority).includes(message.priority)) {
    errors.push('Invalid priority');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
