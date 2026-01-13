import { supabase } from '../config/supabase';
import analytics from '@react-native-firebase/analytics';

interface AnalyticsEvent {
  event_name: string;
  event_type: 'user_action' | 'system_event' | 'error' | 'performance';
  user_id?: string;
  session_id: string;
  properties: Record<string, any>;
  timestamp: Date;
  platform: 'ios' | 'android' | 'web';
}

interface UserBehavior {
  userId: string;
  sessionDuration: number;
  screenViews: Record<string, number>;
  actions: string[];
  errors: number;
}

interface PerformanceMetrics {
  metricName: string;
  value: number;
  unit: string;
  context: Record<string, any>;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private sessionId: string;
  private sessionStart: Date;
  private currentScreen: string | null = null;
  private eventQueue: AnalyticsEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStart = new Date();
    this.startEventFlush();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private startEventFlush() {
    // Flush events every 30 seconds
    this.flushInterval = setInterval(() => {
      this.flushEvents();
    }, 30000);
  }

  private async flushEvents() {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert(events.map(event => ({
          event_name: event.event_name,
          event_type: event.event_type,
          user_id: event.user_id,
          session_id: event.session_id,
          properties: event.properties,
          timestamp: event.timestamp.toISOString(),
          platform: event.platform
        })));

      if (error) {
        console.error('Failed to flush analytics events:', error);
        // Re-queue events on failure
        this.eventQueue.push(...events);
      }
    } catch (error) {
      console.error('Error flushing events:', error);
      this.eventQueue.push(...events);
    }
  }

  // Track generic event
  public async trackEvent(
    eventName: string,
    eventType: AnalyticsEvent['event_type'],
    properties: Record<string, any> = {},
    userId?: string
  ) {
    const event: AnalyticsEvent = {
      event_name: eventName,
      event_type: eventType,
      user_id: userId,
      session_id: this.sessionId,
      properties,
      timestamp: new Date(),
      platform: this.getPlatform()
    };

    this.eventQueue.push(event);

    // Also log to Firebase Analytics
    try {
      await analytics().logEvent(eventName, properties);
    } catch (error) {
      console.error('Firebase analytics error:', error);
    }
  }

  // Track screen view
  public async trackScreenView(screenName: string, userId?: string) {
    this.currentScreen = screenName;

    await this.trackEvent(
      'screen_view',
      'user_action',
      {
        screen_name: screenName,
        previous_screen: this.currentScreen
      },
      userId
    );

    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenName
      });
    } catch (error) {
      console.error('Firebase screen view error:', error);
    }
  }

  // Track user action
  public async trackAction(
    actionName: string,
    properties: Record<string, any> = {},
    userId?: string
  ) {
    await this.trackEvent(
      actionName,
      'user_action',
      {
        ...properties,
        screen: this.currentScreen
      },
      userId
    );
  }

  // Track error
  public async trackError(
    errorName: string,
    errorDetails: any,
    userId?: string
  ) {
    await this.trackEvent(
      'error_occurred',
      'error',
      {
        error_name: errorName,
        error_details: errorDetails,
        screen: this.currentScreen
      },
      userId
    );
  }

  // Track performance metric
  public async trackPerformance(
    metricName: string,
    value: number,
    unit: string,
    context: Record<string, any> = {}
  ) {
    await this.trackEvent(
      'performance_metric',
      'performance',
      {
        metric_name: metricName,
        value,
        unit,
        ...context
      }
    );
  }

  // Track API call
  public async trackAPICall(
    endpoint: string,
    method: string,
    duration: number,
    statusCode: number,
    userId?: string
  ) {
    await this.trackEvent(
      'api_call',
      'performance',
      {
        endpoint,
        method,
        duration,
        status_code: statusCode,
        screen: this.currentScreen
      },
      userId
    );
  }

  // Track agent interaction
  public async trackAgentInteraction(
    agentType: string,
    interactionType: string,
    duration: number,
    success: boolean,
    userId?: string
  ) {
    await this.trackEvent(
      'agent_interaction',
      'system_event',
      {
        agent_type: agentType,
        interaction_type: interactionType,
        duration,
        success,
        screen: this.currentScreen
      },
      userId
    );
  }

  // Track diagnostic scan
  public async trackDiagnosticScan(
    vehicleId: string,
    dtcCodesFound: number,
    scanDuration: number,
    userId?: string
  ) {
    await this.trackEvent(
      'diagnostic_scan',
      'user_action',
      {
        vehicle_id: vehicleId,
        dtc_codes_found: dtcCodesFound,
        scan_duration: scanDuration
      },
      userId
    );
  }

  // Get user behavior analytics
  public async getUserBehavior(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<UserBehavior | null> {
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());

      if (error || !data) {
        console.error('Error fetching user behavior:', error);
        return null;
      }

      const screenViews: Record<string, number> = {};
      const actions: string[] = [];
      let errorCount = 0;

      data.forEach(event => {
        if (event.event_name === 'screen_view') {
          const screenName = event.properties.screen_name;
          screenViews[screenName] = (screenViews[screenName] || 0) + 1;
        }
        if (event.event_type === 'user_action') {
          actions.push(event.event_name);
        }
        if (event.event_type === 'error') {
          errorCount++;
        }
      });

      const sessionDuration = endDate.getTime() - startDate.getTime();

      return {
        userId,
        sessionDuration,
        screenViews,
        actions,
        errors: errorCount
      };
    } catch (error) {
      console.error('Error analyzing user behavior:', error);
      return null;
    }
  }

  // Get performance metrics
  public async getPerformanceMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<PerformanceMetrics[]> {
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('event_type', 'performance')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());

      if (error || !data) {
        console.error('Error fetching performance metrics:', error);
        return [];
      }

      return data.map(event => ({
        metricName: event.properties.metric_name || event.event_name,
        value: event.properties.value || event.properties.duration || 0,
        unit: event.properties.unit || 'ms',
        context: event.properties
      }));
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return [];
    }
  }

  // Get event counts by type
  public async getEventCounts(
    startDate: Date,
    endDate: Date
  ): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('event_type')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());

      if (error || !data) {
        console.error('Error fetching event counts:', error);
        return {};
      }

      const counts: Record<string, number> = {};
      data.forEach(event => {
        counts[event.event_type] = (counts[event.event_type] || 0) + 1;
      });

      return counts;
    } catch (error) {
      console.error('Error counting events:', error);
      return {};
    }
  }

  // Set user properties
  public async setUserProperties(
    userId: string,
    properties: Record<string, any>
  ) {
    try {
      await analytics().setUserProperties(properties);
      await analytics().setUserId(userId);
    } catch (error) {
      console.error('Error setting user properties:', error);
    }
  }

  private getPlatform(): 'ios' | 'android' | 'web' {
    // Detect platform
    if (typeof navigator !== 'undefined') {
      if (/android/i.test(navigator.userAgent)) return 'android';
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return 'ios';
    }
    return 'web';
  }

  // Cleanup
  public shutdown() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushEvents();
  }
}

export default AnalyticsService;
