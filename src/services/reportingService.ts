import { supabase } from '../config/supabase';
import AnalyticsService from './analyticsService';

interface DiagnosticReport {
  reportId: string;
  vehicleId: string;
  vehicleInfo: any;
  scanDate: Date;
  dtcCodes: string[];
  codeDetails: any[];
  severity: 'critical' | 'warning' | 'info';
  recommendations: string[];
  estimatedCost?: {
    min: number;
    max: number;
    currency: string;
  };
}

interface UsageReport {
  userId: string;
  period: 'day' | 'week' | 'month';
  totalSessions: number;
  totalDiagnostics: number;
  totalAgentInteractions: number;
  mostUsedFeatures: Array<{ feature: string; count: number }>;
  averageSessionDuration: number;
}

interface SystemHealthReport {
  period: 'hour' | 'day' | 'week';
  totalRequests: number;
  averageResponseTime: number;
  errorRate: number;
  activeUsers: number;
  topErrors: Array<{ error: string; count: number }>;
  agentPerformance: Record<string, {
    totalInteractions: number;
    successRate: number;
    averageDuration: number;
  }>;
}

class ReportingService {
  private static instance: ReportingService;
  private analytics: AnalyticsService;

  private constructor() {
    this.analytics = AnalyticsService.getInstance();
  }

  public static getInstance(): ReportingService {
    if (!ReportingService.instance) {
      ReportingService.instance = new ReportingService();
    }
    return ReportingService.instance;
  }

  // Generate diagnostic report
  public async generateDiagnosticReport(
    diagnosticId: string
  ): Promise<DiagnosticReport | null> {
    try {
      // Fetch diagnostic data
      const { data: diagnostic, error: diagError } = await supabase
        .from('vehicle_diagnostics')
        .select(`
          *,
          vehicle:vehicles(*)
        `)
        .eq('id', diagnosticId)
        .single();

      if (diagError || !diagnostic) {
        console.error('Error fetching diagnostic:', diagError);
        return null;
      }

      // Analyze severity
      const severity = this.determineSeverity(diagnostic.dtc_codes);

      // Generate recommendations
      const recommendations = await this.generateRecommendations(
        diagnostic.dtc_codes,
        diagnostic.metadata
      );

      // Estimate repair cost
      const estimatedCost = await this.estimateRepairCost(
        diagnostic.dtc_codes
      );

      const report: DiagnosticReport = {
        reportId: diagnosticId,
        vehicleId: diagnostic.vehicle_id,
        vehicleInfo: diagnostic.vehicle,
        scanDate: new Date(diagnostic.scan_date),
        dtcCodes: diagnostic.dtc_codes,
        codeDetails: diagnostic.metadata?.codeDetails || [],
        severity,
        recommendations,
        estimatedCost
      };

      // Store report
      await supabase
        .from('diagnostic_reports')
        .upsert({
          id: diagnosticId,
          vehicle_id: diagnostic.vehicle_id,
          user_id: diagnostic.vehicle.user_id,
          report_data: report,
          generated_at: new Date().toISOString()
        });

      return report;
    } catch (error) {
      console.error('Error generating diagnostic report:', error);
      return null;
    }
  }

  // Generate user usage report
  public async generateUsageReport(
    userId: string,
    period: 'day' | 'week' | 'month'
  ): Promise<UsageReport | null> {
    try {
      const startDate = this.getStartDate(period);
      const endDate = new Date();

      // Get all user events
      const { data: events, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());

      if (error || !events) {
        console.error('Error fetching usage data:', error);
        return null;
      }

      // Calculate metrics
      const sessions = new Set(events.map(e => e.session_id));
      const totalSessions = sessions.size;

      const diagnostics = events.filter(
        e => e.event_name === 'diagnostic_scan'
      );
      const totalDiagnostics = diagnostics.length;

      const agentInteractions = events.filter(
        e => e.event_name === 'agent_interaction'
      );
      const totalAgentInteractions = agentInteractions.length;

      // Most used features
      const featureCounts: Record<string, number> = {};
      events
        .filter(e => e.event_type === 'user_action')
        .forEach(e => {
          featureCounts[e.event_name] = (featureCounts[e.event_name] || 0) + 1;
        });

      const mostUsedFeatures = Object.entries(featureCounts)
        .map(([feature, count]) => ({ feature, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Average session duration
      const sessionDurations: number[] = [];
      sessions.forEach(sessionId => {
        const sessionEvents = events.filter(e => e.session_id === sessionId);
        if (sessionEvents.length > 0) {
          const firstEvent = new Date(sessionEvents[0].timestamp);
          const lastEvent = new Date(
            sessionEvents[sessionEvents.length - 1].timestamp
          );
          sessionDurations.push(lastEvent.getTime() - firstEvent.getTime());
        }
      });

      const averageSessionDuration =
        sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length || 0;

      return {
        userId,
        period,
        totalSessions,
        totalDiagnostics,
        totalAgentInteractions,
        mostUsedFeatures,
        averageSessionDuration
      };
    } catch (error) {
      console.error('Error generating usage report:', error);
      return null;
    }
  }

  // Generate system health report
  public async generateSystemHealthReport(
    period: 'hour' | 'day' | 'week'
  ): Promise<SystemHealthReport | null> {
    try {
      const startDate = this.getStartDate(period);
      const endDate = new Date();

      const { data: events, error } = await supabase
        .from('analytics_events')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());

      if (error || !events) {
        console.error('Error fetching system data:', error);
        return null;
      }

      // Total requests
      const apiCalls = events.filter(e => e.event_name === 'api_call');
      const totalRequests = apiCalls.length;

      // Average response time
      const responseTimes = apiCalls
        .map(e => e.properties.duration)
        .filter(d => typeof d === 'number');
      const averageResponseTime =
        responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length || 0;

      // Error rate
      const errors = events.filter(e => e.event_type === 'error');
      const errorRate = (errors.length / events.length) * 100 || 0;

      // Active users
      const activeUsers = new Set(events.map(e => e.user_id).filter(Boolean)).size;

      // Top errors
      const errorCounts: Record<string, number> = {};
      errors.forEach(e => {
        const errorName = e.properties.error_name || 'Unknown';
        errorCounts[errorName] = (errorCounts[errorName] || 0) + 1;
      });
      const topErrors = Object.entries(errorCounts)
        .map(([error, count]) => ({ error, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Agent performance
      const agentInteractions = events.filter(
        e => e.event_name === 'agent_interaction'
      );
      const agentPerformance: SystemHealthReport['agentPerformance'] = {};

      const agentTypes = new Set(
        agentInteractions.map(e => e.properties.agent_type)
      );

      agentTypes.forEach(agentType => {
        const interactions = agentInteractions.filter(
          e => e.properties.agent_type === agentType
        );
        const successful = interactions.filter(e => e.properties.success).length;
        const durations = interactions
          .map(e => e.properties.duration)
          .filter(d => typeof d === 'number');
        const avgDuration =
          durations.reduce((a, b) => a + b, 0) / durations.length || 0;

        agentPerformance[agentType] = {
          totalInteractions: interactions.length,
          successRate: (successful / interactions.length) * 100 || 0,
          averageDuration: avgDuration
        };
      });

      return {
        period,
        totalRequests,
        averageResponseTime,
        errorRate,
        activeUsers,
        topErrors,
        agentPerformance
      };
    } catch (error) {
      console.error('Error generating system health report:', error);
      return null;
    }
  }

  // Export report to PDF (stub - would use pdf generation library)
  public async exportReportToPDF(
    reportData: any,
    reportType: string
  ): Promise<string | null> {
    // TODO: Implement PDF generation
    console.log('Exporting report to PDF:', reportType);
    return null;
  }

  // Helper methods
  private determineSeverity(
    dtcCodes: string[]
  ): 'critical' | 'warning' | 'info' {
    // Critical codes (P0xxx power train critical)
    const criticalPattern = /^P0[0-3]/;
    if (dtcCodes.some(code => criticalPattern.test(code))) {
      return 'critical';
    }

    // Warning codes
    const warningPattern = /^P[01]/;
    if (dtcCodes.some(code => warningPattern.test(code))) {
      return 'warning';
    }

    return 'info';
  }

  private async generateRecommendations(
    dtcCodes: string[],
    metadata: any
  ): Promise<string[]> {
    const recommendations: string[] = [];

    // Based on code details from metadata
    if (metadata?.codeDetails) {
      metadata.codeDetails.forEach((detail: any) => {
        if (detail.possibleCauses) {
          recommendations.push(
            `For ${detail.code}: Check ${detail.possibleCauses.slice(0, 2).join(', ')}`
          );
        }
      });
    }

    // Generic recommendations
    if (recommendations.length === 0) {
      recommendations.push('Schedule a diagnostic inspection');
      recommendations.push('Check vehicle service history');
    }

    return recommendations;
  }

  private async estimateRepairCost(dtcCodes: string[]): Promise<{
    min: number;
    max: number;
    currency: string;
  }> {
    // Simplified cost estimation
    const baseCost = dtcCodes.length * 100;
    return {
      min: baseCost,
      max: baseCost * 3,
      currency: 'USD'
    };
  }

  private getStartDate(period: 'hour' | 'day' | 'week' | 'month'): Date {
    const now = new Date();
    switch (period) {
      case 'hour':
        return new Date(now.getTime() - 60 * 60 * 1000);
      case 'day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
  }
}

export default ReportingService;
