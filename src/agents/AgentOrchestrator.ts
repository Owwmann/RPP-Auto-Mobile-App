/**
 * Agent Orchestrator
 * Routes requests to appropriate specialized agents
 */

import {BaseAgent, AgentMessage, AgentContext} from './BaseAgent';

export class AgentOrchestrator {
  private agents: Map<string, BaseAgent> = new Map();
  private routingRules: Map<string, string[]> = new Map();

  constructor() {
    this.initializeRoutingRules();
  }

  /**
   * Register a new agent with the orchestrator
   */
  public registerAgent(agent: BaseAgent): void {
    const agentType = agent.getType();
    this.agents.set(agentType, agent);
    console.log(`Registered agent: ${agent.getName()} (${agentType})`);
  }

  /**
   * Unregister an agent
   */
  public unregisterAgent(agentType: string): void {
    this.agents.delete(agentType);
    console.log(`Unregistered agent type: ${agentType}`);
  }

  /**
   * Route a message to the appropriate agent
   */
  public async routeMessage(
    message: AgentMessage,
    context: AgentContext
  ): Promise<AgentMessage> {
    try {
      // Select the best agent for this intent
      const agent = this.selectAgent(context.intent || '', context.entities);

      if (!agent) {
        throw new Error(`No agent available to handle intent: ${context.intent}`);
      }

      console.log(`Routing to agent: ${agent.getName()}`);

      // Handle the message with the selected agent
      return await agent.handleMessage(message, context);
    } catch (error) {
      console.error('Routing error:', error);
      throw error;
    }
  }

  /**
   * Select the best agent for a given intent and entities
   */
  private selectAgent(intent: string, entities: Record<string, any>): BaseAgent | null {
    // Find agents that can handle this intent
    const capableAgents: BaseAgent[] = [];

    for (const agent of this.agents.values()) {
      if (agent.canHandle(intent, entities) && agent.isIdle()) {
        capableAgents.push(agent);
      }
    }

    if (capableAgents.length === 0) {
      return null;
    }

    // Sort by priority and return the highest priority agent
    capableAgents.sort((a, b) => {
      const priorityA = a.getConfig().priority;
      const priorityB = b.getConfig().priority;
      return priorityB - priorityA;
    });

    return capableAgents[0];
  }

  /**
   * Initialize routing rules for intents
   */
  private initializeRoutingRules(): void {
    // Map intents to agent types
    this.routingRules.set('diagnostic', ['diagnostic_agent', 'general_agent']);
    this.routingRules.set('service', ['booking_agent', 'general_agent']);
    this.routingRules.set('parts', ['parts_agent', 'general_agent']);
    this.routingRules.set('general', ['general_agent']);
  }

  /**
   * Get all registered agents
   */
  public getAgents(): BaseAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agent by type
   */
  public getAgent(type: string): BaseAgent | undefined {
    return this.agents.get(type);
  }

  /**
   * Check if any agent is currently busy
   */
  public isAnyAgentBusy(): boolean {
    for (const agent of this.agents.values()) {
      if (agent.isBusy()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get status of all agents
   */
  public getAgentStatuses(): Array<{name: string; type: string; state: string}> {
    return Array.from(this.agents.values()).map(agent => ({
      name: agent.getName(),
      type: agent.getType(),
      state: agent.getState(),
    }));
  }
}
