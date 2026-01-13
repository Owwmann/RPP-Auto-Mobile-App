import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AnalyticsService from '../../services/analyticsService';

const { width } = Dimensions.get('window');

const AnalyticsScreen = ({ navigation }: any) => {
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');

  const analyticsService = AnalyticsService.getInstance();

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = getStartDate(period);

      const counts = await analyticsService.getEventCounts(startDate, endDate);
      setEventCounts(counts);

      await analyticsService.trackScreenView('analytics');
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = (period: 'day' | 'week' | 'month'): Date => {
    const now = new Date();
    switch (period) {
      case 'day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  };

  const getTotalEvents = () => {
    return Object.values(eventCounts).reduce((a, b) => a + b, 0);
  };

  const getEventTypeColor = (eventType: string): string => {
    switch (eventType) {
      case 'user_action':
        return '#2196F3';
      case 'system_event':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      case 'performance':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  const renderEventTypeCard = (eventType: string, count: number) => {
    const color = getEventTypeColor(eventType);
    const percentage = ((count / getTotalEvents()) * 100).toFixed(1);

    return (
      <View key={eventType} style={[styles.eventCard, { borderLeftColor: color }]}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventType}>
            {eventType.replace('_', ' ').toUpperCase()}
          </Text>
          <Text style={[styles.eventPercentage, { color }]}>
            {percentage}%
          </Text>
        </View>
        <Text style={styles.eventCount}>{count.toLocaleString()}</Text>
        <View style={[styles.eventBar, { backgroundColor: color, width: `${percentage}%` }]} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Analytics</Text>
        <TouchableOpacity onPress={loadAnalytics}>
          <Icon name="refresh" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.periodSelector}>
        {(['day', 'week', 'month'] as const).map(p => (
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

      <ScrollView style={styles.content}>
        {/* Total Events */}
        <View style={styles.totalCard}>
          <Icon name="assessment" size={48} color="#2196F3" />
          <View style={styles.totalInfo}>
            <Text style={styles.totalLabel}>Total Events</Text>
            <Text style={styles.totalValue}>{getTotalEvents().toLocaleString()}</Text>
            <Text style={styles.totalPeriod}>Last {period}</Text>
          </View>
        </View>

        {/* Event Breakdown */}
        <Text style={styles.sectionTitle}>Event Breakdown</Text>
        <View style={styles.eventsContainer}>
          {Object.entries(eventCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([type, count]) => renderEventTypeCard(type, count))}
        </View>

        {loading && (
          <Text style={styles.loadingText}>Loading analytics...</Text>
        )}
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
  totalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20
  },
  totalInfo: {
    flex: 1,
    gap: 5
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  totalValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333'
  },
  totalPeriod: {
    fontSize: 12,
    color: '#999'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  eventsContainer: {
    gap: 12,
    marginBottom: 20
  },
  eventCard: {
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
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  eventType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666'
  },
  eventPercentage: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  eventCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  eventBar: {
    height: 4,
    borderRadius: 2
  },
  loadingText: {
    textAlign: 'center',
    color: '#999',
    padding: 20
  }
});

export default AnalyticsScreen;
