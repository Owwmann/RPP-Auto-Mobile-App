import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ReportingService from '../../services/reportingService';
import AnalyticsService from '../../services/analyticsService';

const { width } = Dimensions.get('window');

const AdminDashboardScreen = ({ navigation }: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'hour' | 'day' | 'week'>('day');

  const reportingService = ReportingService.getInstance();
  const analyticsService = AnalyticsService.getInstance();

  useEffect(() => {
    loadDashboardData();
  }, [period]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load system health report
      const health = await reportingService.generateSystemHealthReport(period);
      setSystemHealth(health);

      await analyticsService.trackScreenView('admin_dashboard');
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const renderMetricCard = (
    title: string,
    value: string | number,
    icon: string,
    color: string,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={[styles.metricCard, { borderLeftColor: color }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.metricIcon}>
        <Icon name={icon} size={32} color={color} />
      </View>
      <View style={styles.metricContent}>
        <Text style={styles.metricTitle}>{title}</Text>
        <Text style={styles.metricValue}>{value}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      {(['hour', 'day', 'week'] as const).map(p => (
        <TouchableOpacity
          key={p}
          style={[
            styles.periodButton,
            period === p && styles.periodButtonActive
          ]}
          onPress={() => setPeriod(p)}
        >
          <Text
            style={[
              styles.periodButtonText,
              period === p && styles.periodButtonTextActive
            ]}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading && !systemHealth) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text>Loading dashboard...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Icon name="refresh" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {renderPeriodSelector()}

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Key Metrics */}
        <Text style={styles.sectionTitle}>System Overview</Text>
        <View style={styles.metricsGrid}>
          {renderMetricCard(
            'Total Requests',
            systemHealth?.totalRequests?.toLocaleString() || '0',
            'trending-up',
            '#4CAF50'
          )}
          {renderMetricCard(
            'Active Users',
            systemHealth?.activeUsers?.toLocaleString() || '0',
            'people',
            '#2196F3'
          )}
          {renderMetricCard(
            'Avg Response',
            systemHealth?.averageResponseTime
              ? `${systemHealth.averageResponseTime.toFixed(0)}ms`
              : '0ms',
            'speed',
            '#FF9800'
          )}
          {renderMetricCard(
            'Error Rate',
            systemHealth?.errorRate
              ? `${systemHealth.errorRate.toFixed(2)}%`
              : '0%',
            'error',
            systemHealth?.errorRate > 5 ? '#F44336' : '#4CAF50'
          )}
        </View>

        {/* Agent Performance */}
        <Text style={styles.sectionTitle}>Agent Performance</Text>
        <View style={styles.card}>
          {systemHealth?.agentPerformance ? (
            Object.entries(systemHealth.agentPerformance).map(([agent, perf]: [string, any]) => (
              <View key={agent} style={styles.agentRow}>
                <View style={styles.agentInfo}>
                  <Text style={styles.agentName}>
                    {agent.replace(/([A-Z])/g, ' $1').trim()}
                  </Text>
                  <Text style={styles.agentStats}>
                    {perf.totalInteractions} interactions • {perf.successRate.toFixed(1)}% success
                  </Text>
                </View>
                <View style={styles.agentMetrics}>
                  <Text style={styles.agentDuration}>
                    {perf.averageDuration.toFixed(0)}ms
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No agent data available</Text>
          )}
        </View>

        {/* Top Errors */}
        <Text style={styles.sectionTitle}>Top Errors</Text>
        <View style={styles.card}>
          {systemHealth?.topErrors && systemHealth.topErrors.length > 0 ? (
            systemHealth.topErrors.map((error: any, index: number) => (
              <View key={index} style={styles.errorRow}>
                <Icon name="error" size={20} color="#F44336" />
                <View style={styles.errorInfo}>
                  <Text style={styles.errorName}>{error.error}</Text>
                  <Text style={styles.errorCount}>{error.count} occurrences</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No errors in this period 🎉</Text>
          )}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('UserManagement')}
          >
            <Icon name="people" size={32} color="#2196F3" />
            <Text style={styles.actionButtonText}>Users</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AnalyticsScreen')}
          >
            <Icon name="analytics" size={32} color="#4CAF50" />
            <Text style={styles.actionButtonText}>Analytics</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('SystemLogs')}
          >
            <Icon name="list" size={32} color="#FF9800" />
            <Text style={styles.actionButtonText}>Logs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Icon name="settings" size={32} color="#9C27B0" />
            <Text style={styles.actionButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  periodSelector: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    gap: 10
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center'
  },
  periodButtonActive: {
    backgroundColor: '#2196F3'
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666'
  },
  periodButtonTextActive: {
    color: '#fff'
  },
  content: {
    flex: 1,
    padding: 15
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  metricCard: {
    width: (width - 50) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  metricIcon: {
    marginBottom: 10
  },
  metricContent: {
    gap: 5
  },
  metricTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500'
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  agentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  agentInfo: {
    flex: 1,
    gap: 5
  },
  agentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  agentStats: {
    fontSize: 12,
    color: '#666'
  },
  agentMetrics: {
    alignItems: 'flex-end'
  },
  agentDuration: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3'
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  errorInfo: {
    flex: 1,
    gap: 3
  },
  errorName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333'
  },
  errorCount: {
    fontSize: 12,
    color: '#666'
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: 20
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20
  },
  actionButton: {
    width: (width - 50) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  }
});

export default AdminDashboardScreen;
