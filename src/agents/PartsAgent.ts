/**
 * Parts Agent
 * Recommends and helps find vehicle parts
 */

import {BaseAgent, AgentMessage, AgentContext, AgentConfig} from './BaseAgent';
import {aiService} from '../services/aiService';
import {supabase} from '../config/supabase';

export class PartsAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'Parts Agent',
      type: 'parts',
      description: 'Recommends parts and helps with parts ordering',
      capabilities: [
        'recommend_parts',
        'search_parts',
        'find_compatible_parts',
        'price_comparison',
        'parts_availability',
      ],
      priority: 7,
    };
    super(config);
  }

  async processMessage(message: AgentMessage, context: AgentContext): Promise<AgentMessage> {
    try {
      this.log('info', 'Processing parts request');

      // Check if diagnostic codes are present
      const dtcCodes = context.entities.dtcCodes as string[] | undefined;
      let response = '';

      if (dtcCodes && dtcCodes.length > 0) {
        // Get parts recommendations based on DTCs
        const recommendations = await this.getPartsForDTCs(dtcCodes, context.vehicleId);

        response = await aiService.generateResponse({
          message: `User is asking about parts for these diagnostic codes: ${dtcCodes.join(', ')}. Recommendations: ${JSON.stringify(recommendations)}`,
          context: context,
          agentType: 'parts',
        });
      } else {
        // General parts inquiry
        response = await aiService.generateResponse({
          message: message.content,
          context: context,
          agentType: 'parts',
        });
      }

      const responseMessage: AgentMessage = {
        id: this.generateMessageId(),
        conversationId: context.conversationId,
        senderId: this.config.type,
        senderType: 'agent',
        content: response,
        messageType: 'recommendation',
        timestamp: new Date(),
        metadata: {
          dtcCodes,
          intent: context.intent,
        },
      };

      return responseMessage;
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  canHandle(intent: string, entities: Record<string, any>): boolean {
    // Check capabilities
    if (this.config.capabilities.includes(intent)) {
      return true;
    }

    // Check for parts-related entities
    if (entities.partType || entities.partNumber) {
      return true;
    }

    return false;
  }

  async executeAction(action: string, params: Record<string, any>): Promise<any> {
    switch (action) {
      case 'search_parts':
        return this.searchParts(params);
      case 'get_recommendations':
        return this.getRecommendations(params);
      case 'check_compatibility':
        return this.checkCompatibility(params);
      case 'compare_prices':
        return this.comparePrices(params);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private async getPartsForDTCs(dtcCodes: string[], vehicleId?: string): Promise<any[]> {
    this.log('info', `Getting parts recommendations for DTCs: ${dtcCodes.join(', ')}`);

    const {data, error} = await supabase
      .from('parts_recommendations')
      .select(`
        *,
        parts_catalog (
          part_number,
          part_name,
          part_category,
          manufacturer,
          average_price
        )
      `)
      .in('diagnostic_id', dtcCodes)
      .eq('status', 'suggested')
      .order('priority', {ascending: false})
      .limit(5);

    if (error) {
      this.log('error', `Failed to get recommendations: ${error.message}`);
      return [];
    }

    return data || [];
  }

  private async searchParts(params: Record<string, any>): Promise<any> {
    this.log('info', `Searching parts: ${params.query}`);

    let query = supabase
      .from('parts_catalog')
      .select('*');

    if (params.query) {
      query = query.or(`part_name.ilike.%${params.query}%,part_number.ilike.%${params.query}%`);
    }

    if (params.category) {
      query = query.eq('part_category', params.category);
    }

    if (params.make) {
      query = query.contains('compatible_makes', [params.make]);
    }

    if (params.model) {
      query = query.contains('compatible_models', [params.model]);
    }

    const {data, error} = await query.limit(20);

    if (error) {
      throw new Error(`Failed to search parts: ${error.message}`);
    }

    return data;
  }

  private async getRecommendations(params: Record<string, any>): Promise<any> {
    this.log('info', `Getting recommendations for vehicle: ${params.vehicleId}`);

    const {data, error} = await supabase
      .from('parts_recommendations')
      .select(`
        *,
        parts_catalog (*)
      `)
      .eq('vehicle_id', params.vehicleId)
      .eq('status', 'suggested')
      .order('priority', {ascending: false})
      .limit(10);

    if (error) {
      throw new Error(`Failed to get recommendations: ${error.message}`);
    }

    return data;
  }

  private async checkCompatibility(params: Record<string, any>): Promise<any> {
    this.log('info', `Checking compatibility for part: ${params.partNumber}`);

    const {data, error} = await supabase
      .from('parts_catalog')
      .select('*')
      .eq('part_number', params.partNumber)
      .single();

    if (error || !data) {
      return {compatible: false, reason: 'Part not found'};
    }

    // Check vehicle compatibility
    const isCompatible = 
      (!params.make || data.compatible_makes.includes(params.make)) &&
      (!params.model || data.compatible_models.includes(params.model)) &&
      (!params.year || data.compatible_years.includes(params.year));

    return {
      compatible: isCompatible,
      part: data,
      reason: isCompatible ? 'Compatible' : 'Not compatible with your vehicle',
    };
  }

  private async comparePrices(params: Record<string, any>): Promise<any> {
    this.log('info', `Comparing prices for: ${params.partNumber}`);

    // TODO: Implement price comparison from multiple sources
    // This would integrate with external parts APIs

    return {
      partNumber: params.partNumber,
      prices: [
        {source: 'AutoZone', price: 45.99, availability: 'In Stock'},
        {source: 'NAPA', price: 48.50, availability: 'In Stock'},
        {source: 'O'Reilly', price: 44.99, availability: 'Limited'},
      ],
      lowestPrice: 44.99,
      averagePrice: 46.49,
    };
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
