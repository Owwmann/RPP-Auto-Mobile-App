# Agent Communication Protocol

This directory contains the complete communication protocol for the multi-agent system.

## Overview

The Agent Communication Protocol defines how agents communicate with each other, with the orchestrator, and with external systems. It provides:

- **Standard Message Formats**: Consistent message schemas
- **Priority-Based Routing**: Messages processed by urgency
- **Request/Response Patterns**: Synchronous agent communication
- **Message Validation**: Schema validation for all messages
- **History Tracking**: Conversation history management

## Components

### MessageSchema.ts
Defines all message types, validation, and data structures:

- `AgentMessage`: Standard message format
- `AgentRequest/Response`: Request-response pattern
- `AgentRegistration`: Agent registration data
- `MessageType`: Enum of all message types
- `MessagePriority`: Priority levels
- `validateMessage()`: Message validation function

### MessageRouter.ts
Handles message routing and delivery:

- Priority queue management
- Message validation and routing
- Request/response handling
- Conversation history tracking
- Event emission for monitoring

## Message Format

All messages follow this structure:

```typescript
{
  id: string;               // Unique message ID
  conversationId: string;   // Conversation identifier
  senderId: string;         // Sender ID
  senderType: 'user' | 'agent' | 'system';
  content: string;          // Message content
  messageType: MessageType; // Type of message
  timestamp: Date;          // When message was created
  priority: MessagePriority;// Message priority
  metadata: {               // Additional context
    intent?: string;
    confidence?: number;
    entities?: object;
  };
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
}
```

## Message Types

- **TEXT**: Plain text messages
- **IMAGE**: Image attachments
- **DIAGNOSTIC_REPORT**: Vehicle diagnostic results
- **RECOMMENDATION**: Parts or service recommendations
- **BOOKING_CONFIRMATION**: Appointment confirmations
- **ERROR**: Error messages
- **SYSTEM**: System notifications

## Priority Levels

1. **URGENT** (10): Critical errors, safety issues
2. **HIGH** (8): Important notifications, confirmations
3. **NORMAL** (5): Regular messages
4. **LOW** (1): Background updates, analytics

## Usage Examples

### Sending a Message

```typescript
import {messageRouter} from './protocol/MessageRouter';
import {MessageType, MessagePriority} from './protocol/MessageSchema';

const message: AgentMessage = {
  id: 'msg_123',
  conversationId: 'conv_456',
  senderId: 'user_789',
  senderType: 'user',
  content: 'What's wrong with my car?',
  messageType: MessageType.TEXT,
  timestamp: new Date(),
  priority: MessagePriority.NORMAL,
  metadata: {
    conversationId: 'conv_456',
    userId: 'user_789',
    timestamp: new Date().toISOString(),
  },
  status: 'pending',
};

await messageRouter.routeMessage(message);
```

### Agent-to-Agent Request

```typescript
const request: AgentRequest = {
  requestId: 'req_123',
  sourceAgent: 'diagnostic_agent',
  targetAgent: 'parts_agent',
  action: 'recommend_parts',
  parameters: {
    dtcCodes: ['P0300', 'P0171'],
    vehicleId: 'vehicle_123',
  },
  timeout: 10000,
  timestamp: new Date(),
};

const response = await messageRouter.sendRequest(request);
```

### Listening to Events

```typescript
messageRouter.on('messageReceived', (message) => {
  console.log('New message:', message);
});

messageRouter.on('messageDelivered', (message) => {
  console.log('Message delivered:', message.id);
});

messageRouter.on('messageDeliveryFailed', ({message, error}) => {
  console.error('Delivery failed:', error);
});
```

## Message Flow

1. **User Input** → System receives message
2. **Validation** → MessageRouter validates format
3. **Queue** → Added to priority queue
4. **Processing** → Processed by priority
5. **Routing** → Delivered to target agent
6. **Response** → Agent generates response
7. **Delivery** → Response sent back to user

## Best Practices

1. **Always validate messages** before sending
2. **Use appropriate priorities** - don't overuse URGENT
3. **Include context** in metadata for better routing
4. **Handle errors gracefully** with proper error messages
5. **Keep conversation history** for context preservation
6. **Monitor queue stats** to prevent backlogs
7. **Set reasonable timeouts** for requests

## Error Handling

The protocol includes comprehensive error handling:

- **Validation Errors**: Rejected before queuing
- **Delivery Failures**: Status updated, events emitted
- **Timeout Errors**: Requests time out after specified duration
- **Unknown Destinations**: Logged and reported

## Performance

The router is designed for high throughput:

- Priority queues for efficient processing
- Non-blocking async operations
- Event-driven architecture
- Conversation history limits (100 messages)
- Queue statistics for monitoring

## Extension

To add new message types:

1. Add to `MessageType` enum
2. Update validation rules if needed
3. Document in this README
4. Update agents to handle new type

To add new priorities:

1. Add to `MessagePriority` enum
2. Router will automatically support it
3. Document appropriate use cases
