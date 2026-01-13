/**
 * Booking Agent
 * Handles service appointment scheduling
 */

import {BaseAgent, AgentMessage, AgentContext, AgentConfig} from './BaseAgent';
import {aiService} from '../services/aiService';
import {supabase} from '../config/supabase';

export class BookingAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      name: 'Booking Agent',
      type: 'booking',
      description: 'Manages service appointments and scheduling',
      capabilities: [
        'book_appointment',
        'reschedule_appointment',
        'cancel_appointment',
        'find_service_provider',
        'check_availability',
      ],
      priority: 8,
    };
    super(config);
  }

  async processMessage(message: AgentMessage, context: AgentContext): Promise<AgentMessage> {
    try {
      this.log('info', 'Processing booking request');

      // Extract booking entities (dates, times, service types)
      const bookingEntities = this.extractBookingEntities(context.entities);

      // Generate response
      const response = await aiService.generateResponse({
        message: message.content,
        context: {
          ...context,
          entities: bookingEntities,
        },
        agentType: 'booking',
      });

      const responseMessage: AgentMessage = {
        id: this.generateMessageId(),
        conversationId: context.conversationId,
        senderId: this.config.type,
        senderType: 'agent',
        content: response,
        messageType: 'text',
        timestamp: new Date(),
        metadata: {
          bookingEntities,
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

    // Check for booking-related entities
    if (entities.serviceType || entities.date || entities.time) {
      return true;
    }

    return false;
  }

  async executeAction(action: string, params: Record<string, any>): Promise<any> {
    switch (action) {
      case 'create_appointment':
        return this.createAppointment(params);
      case 'update_appointment':
        return this.updateAppointment(params);
      case 'cancel_appointment':
        return this.cancelAppointment(params);
      case 'find_providers':
        return this.findServiceProviders(params);
      case 'check_availability':
        return this.checkAvailability(params);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  private extractBookingEntities(entities: Record<string, any>): Record<string, any> {
    return {
      serviceType: entities.serviceType || null,
      date: entities.date || null,
      time: entities.time || null,
      providerId: entities.providerId || null,
      vehicleId: entities.vehicleId || null,
    };
  }

  private async createAppointment(params: Record<string, any>): Promise<any> {
    this.log('info', 'Creating appointment');

    const {data, error} = await supabase
      .from('service_appointments')
      .insert({
        user_id: params.userId,
        vehicle_id: params.vehicleId,
        provider_id: params.providerId,
        appointment_type: params.serviceType,
        scheduled_at: params.scheduledAt,
        service_description: params.description,
        estimated_cost: params.estimatedCost,
        status: 'scheduled',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create appointment: ${error.message}`);
    }

    return {
      appointmentId: data.id,
      scheduledAt: data.scheduled_at,
      status: data.status,
    };
  }

  private async updateAppointment(params: Record<string, any>): Promise<any> {
    this.log('info', `Updating appointment: ${params.appointmentId}`);

    const updateData: any = {};
    if (params.scheduledAt) updateData.scheduled_at = params.scheduledAt;
    if (params.status) updateData.status = params.status;
    if (params.notes) updateData.notes = params.notes;

    const {data, error} = await supabase
      .from('service_appointments')
      .update(updateData)
      .eq('id', params.appointmentId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update appointment: ${error.message}`);
    }

    return data;
  }

  private async cancelAppointment(params: Record<string, any>): Promise<any> {
    this.log('info', `Cancelling appointment: ${params.appointmentId}`);

    const {data, error} = await supabase
      .from('service_appointments')
      .update({status: 'cancelled'})
      .eq('id', params.appointmentId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to cancel appointment: ${error.message}`);
    }

    return {
      appointmentId: data.id,
      status: data.status,
      cancelled: true,
    };
  }

  private async findServiceProviders(params: Record<string, any>): Promise<any> {
    this.log('info', 'Finding service providers');

    let query = supabase
      .from('service_providers')
      .select('*')
      .eq('is_verified', true);

    if (params.serviceType) {
      query = query.contains('specialties', [params.serviceType]);
    }

    if (params.location) {
      // TODO: Add geolocation filtering
    }

    const {data, error} = await query.limit(10);

    if (error) {
      throw new Error(`Failed to find providers: ${error.message}`);
    }

    return data;
  }

  private async checkAvailability(params: Record<string, any>): Promise<any> {
    this.log('info', 'Checking availability');

    // TODO: Implement availability checking logic
    // This would check provider schedules, existing appointments, etc.

    return {
      available: true,
      slots: [
        '9:00 AM',
        '11:00 AM',
        '2:00 PM',
        '4:00 PM',
      ],
    };
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
