import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import {useAuth} from '../../contexts/AuthContext';
import {useVehicle} from '../../contexts/VehicleContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen: React.FC = () => {
  const {user} = useAuth();
  const {selectedVehicle} = useVehicle();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Load user's vehicles and recent diagnostics
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back!</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {selectedVehicle ? (
        <View style={styles.vehicleCard}>
          <Icon name="car" size={40} color="#007AFF" />
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleName}>{selectedVehicle.make} {selectedVehicle.model}</Text>
            <Text style={styles.vehicleYear}>{selectedVehicle.year}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.noVehicleCard}>
          <Icon name="plus-circle" size={40} color="#007AFF" />
          <Text style={styles.noVehicleText}>Add your first vehicle</Text>
        </View>
      )}

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity style={styles.actionCard}>
          <Icon name="bluetooth" size={30} color="#007AFF" />
          <Text style={styles.actionText}>Scan Vehicle</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Icon name="calendar" size={30} color="#007AFF" />
          <Text style={styles.actionText}>Book Service</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Icon name="wrench" size={30} color="#007AFF" />
          <Text style={styles.actionText}>View Diagnostics</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard}>
          <Icon name="robot" size={30} color="#007AFF" />
          <Text style={styles.actionText}>Ask AI Assistant</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No recent activity</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  vehicleCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleInfo: {
    marginLeft: 15,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '600',
  },
  vehicleYear: {
    fontSize: 14,
    color: '#666',
  },
  noVehicleCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ddd',
  },
  noVehicleText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  quickActions: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
  recentActivity: {
    padding: 15,
  },
  emptyState: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
});

export default HomeScreen;
