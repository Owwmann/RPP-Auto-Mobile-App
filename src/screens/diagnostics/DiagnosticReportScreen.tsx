import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface DiagnosticCode {
  code: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
}

const DiagnosticReportScreen: React.FC<{route: any; navigation: any}> = ({route, navigation}) => {
  const {report} = route.params || {};

  const dtcCodes: DiagnosticCode[] = [
    {code: 'P0300', description: 'Random/Multiple Cylinder Misfire Detected', severity: 'critical'},
    {code: 'P0171', description: 'System Too Lean (Bank 1)', severity: 'warning'},
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#FF3B30';
      case 'warning': return '#FF9500';
      case 'info': return '#007AFF';
      default: return '#666';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return 'alert-circle';
      case 'warning': return 'alert';
      case 'info': return 'information';
      default: return 'check-circle';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.healthScore}>
          <Text style={styles.scoreValue}>72</Text>
          <Text style={styles.scoreLabel}>Health Score</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Diagnostic Trouble Codes</Text>
        {dtcCodes.map((code, index) => (
          <View key={index} style={styles.codeCard}>
            <View style={[styles.severityBadge, {backgroundColor: getSeverityColor(code.severity)}]}>
              <Icon name={getSeverityIcon(code.severity)} size={20} color="#fff" />
            </View>
            <View style={styles.codeInfo}>
              <Text style={styles.codeNumber}>{code.code}</Text>
              <Text style={styles.codeDescription}>{code.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sensor Readings</Text>
        <View style={styles.sensorGrid}>
          <View style={styles.sensorCard}>
            <Icon name="speedometer" size={24} color="#007AFF" />
            <Text style={styles.sensorValue}>0 RPM</Text>
            <Text style={styles.sensorLabel}>Engine RPM</Text>
          </View>
          <View style={styles.sensorCard}>
            <Icon name="thermometer" size={24} color="#007AFF" />
            <Text style={styles.sensorValue}>--°C</Text>
            <Text style={styles.sensorLabel}>Coolant Temp</Text>
          </View>
          <View style={styles.sensorCard}>
            <Icon name="car-battery" size={24} color="#007AFF" />
            <Text style={styles.sensorValue}>-- V</Text>
            <Text style={styles.sensorLabel}>Battery</Text>
          </View>
          <View style={styles.sensorCard}>
            <Icon name="gas-station" size={24} color="#007AFF" />
            <Text style={styles.sensorValue}>--%</Text>
            <Text style={styles.sensorLabel}>Fuel Level</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="car-wrench" size={24} color="#007AFF" />
          <Text style={styles.actionText}>Get Parts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="calendar-check" size={24} color="#007AFF" />
          <Text style={styles.actionText}>Book Service</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 30,
    alignItems: 'center',
  },
  healthScore: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  codeCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  severityBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  codeInfo: {
    flex: 1,
  },
  codeNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  codeDescription: {
    fontSize: 14,
    color: '#666',
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sensorCard: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  sensorValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  sensorLabel: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: '#fff',
    flex: 1,
    margin: 5,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default DiagnosticReportScreen;
