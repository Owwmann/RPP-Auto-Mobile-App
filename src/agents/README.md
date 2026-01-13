# AI Agent Framework

This directory contains the multi-agent system for RPP Auto.

## Architecture

### Base Agent Framework
- **BaseAgent.ts** - Abstract base class that all agents extend
- **AgentOrchestrator.ts** - Routes messages to appropriate agents

### Specialized Agents
- **CustomerServiceAgent.ts** - General inquiries and support
- **DiagnosticAgent.ts** - Vehicle diagnostics (to be implemented)
- **BookingAgent.ts** - Service appointments (to be implemented)
- **PartsAgent.ts** - Parts recommendations (to be implemented)

## Agent Lifecycle

1. **IDLE** - Waiting for requests
2. **LISTENING** - Receiving message
3. **PROCESSING** - Analyzing intent/entities
4. **ACTION** - Executing specific tasks
5. **RESPONDING** - Generating response
6. **WAITING** - Awaiting user confirmation
7. **ERROR** - Handling failures

## Usage Example

```typescript
import {AgentOrchestrator} from './agents/AgentOrchestrator';
import {CustomerServiceAgent} from './agents/CustomerServiceAgent';

// Initialize orchestrator
const orchestrator = new AgentOrchestrator();

// Register agents
const customerAgent = new CustomerServiceAgent();
orchestrator.registerAgent(customerAgent);

// Route a message
const message = {
  id: 'msg_123',
  conversationId: 'conv_456',
  senderId: 'user_789',
  senderType: 'user',
  content: 'How do I scan my vehicle?',
  messageType: 'text',
  timestamp: new Date(),
};

const context = {
  conversationId: 'conv_456',
  userId: 'user_789',
  history: [],
  entities: {},
  intent: 'help',
};

const response = await orchestrator.routeMessage(message, context);
```

## Event System

Agents emit events that can be listened to:

```typescript
agent.on('stateChange', ({oldState, newState}) => {
  console.log(`State changed: ${oldState} -> ${newState}`);
});

agent.on('error', ({agent, error}) => {
  console.error(`Error in ${agent}: ${error}`);
});

agent.on('log', (logEntry) => {
  // Send to logging service
});
```

## Extending the Framework

To create a new specialized agent:

1. Extend `BaseAgent`
2. Implement required abstract methods
3. Define capabilities and priority
4. Register with orchestrator

```typescript
export class MyCustomAgent extends BaseAgent {
  constructor() {
    super({
      name: 'My Custom Agent',
      type: 'custom',
      description: 'Does custom things',
      capabilities: ['custom_intent_1', 'custom_intent_2'],
      priority: 7,
    });
  }

  async processMessage(message, context) {
    // Your logic here
  }

  canHandle(intent, entities) {
    return this.config.capabilities.includes(intent);
  }

  async executeAction(action, params) {
    // Execute custom actions
  }
}
```
