import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useVehicle} from '../../contexts/VehicleContext';
import {obd2Service} from '../../services/obd2Service';

const DiagnosticsScreen: React.FC = () => {
  const {selectedVehicle} = useVehicle();
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleScanVehicle = async () => {
    if (!selectedVehicle) {
      Alert.alert('No Vehicle Selected', 'Please select a vehicle first');
      return;
    }

    setIsScanning(true);
    try {
      // Scan for OBD2 devices
      obd2Service.scanForDevices(device => {
        console.log('Found device:', device);
      });

      // TODO: Show device selection modal
    } catch (error) {
      Alert.alert('Scan Error', 'Failed to scan for devices');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vehicle Diagnostics</Text>
      </View>

      {selectedVehicle ? (
        <>
          <View style={styles.vehicleCard}>
            <Text style={styles.vehicleName}>{selectedVehicle.make} {selectedVehicle.model}</Text>
            <Text style={styles.vehicleYear}>{selectedVehicle.year}</Text>
          </View>

          <View style={styles.connectionCard}>
            <Icon 
              name={isConnected ? 'bluetooth-connect' : 'bluetooth-off'} 
              size={40} 
              color={isConnected ? '#4CAF50' : '#999'} 
            />
            <View style={styles.connectionInfo}>
              <Text style={styles.connectionStatus}>
                {isConnected ? 'Connected' : 'Not Connected'}
              </Text>
              <Text style={styles.connectionText}>OBD2 Device</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
            onPress={handleScanVehicle}
            disabled={isScanning}
          >
            <Icon name="bluetooth-search" size={24} color="#fff" />
            <Text style={styles.scanButtonText}>
              {isScanning ? 'Scanning...' : 'Scan Vehicle'}
            </Text>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Diagnostics</Text>
            <View style={styles.emptyState}>
              <Icon name="wrench-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No diagnostic reports yet</Text>
              <Text style={styles.emptySubtext}>Connect your OBD2 device to scan</Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.noVehicleState}>
          <Icon name="car-off" size={80} color="#ccc" />
          <Text style={styles.noVehicleTitle}>No Vehicle Selected</Text>
          <Text style={styles.noVehicleText}>Please select a vehicle from the Vehicles tab</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  vehicleCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
  },
  vehicleName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  vehicleYear: {
    fontSize: 16,
    color: '#666',
  },
  connectionCard: {
    backgroundColor: '#fff',
    margin: 15,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionInfo: {
    marginLeft: 15,
  },
  connectionStatus: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  connectionText: {
    fontSize: 14,
    color: '#666',
  },
  scanButton: {
    backgroundColor: '#007AFF',
    margin: 15,
    marginTop: 0,
    padding: 18,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonDisabled: {
    backgroundColor: '#ccc',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  emptyState: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
  noVehicleState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noVehicleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  noVehicleText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default DiagnosticsScreen;
