import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useVehicle} from '../../contexts/VehicleContext';
import type {Vehicle} from '../../types/database.types';

const VehiclesScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {selectedVehicle, setSelectedVehicle} = useVehicle();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    // TODO: Load vehicles from Supabase
    setLoading(false);
  };

  const renderVehicle = ({item}: {item: Vehicle}) => (
    <TouchableOpacity
      style={[
        styles.vehicleCard,
        selectedVehicle?.id === item.id && styles.selectedCard,
      ]}
      onPress={() => setSelectedVehicle(item)}
    >
      <View style={styles.vehicleIcon}>
        <Icon name="car" size={40} color="#007AFF" />
      </View>
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleName}>{item.nickname || `${item.make} ${item.model}`}</Text>
        <Text style={styles.vehicleDetails}>{item.year} • {item.vin}</Text>
        <Text style={styles.vehicleMileage}>{item.mileage?.toLocaleString()} miles</Text>
      </View>
      {item.is_primary && (
        <View style={styles.primaryBadge}>
          <Text style={styles.primaryText}>Primary</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Vehicles</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="plus" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {vehicles.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="car-off" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>No vehicles yet</Text>
          <Text style={styles.emptyText}>Add your first vehicle to get started</Text>
          <TouchableOpacity style={styles.addVehicleButton}>
            <Text style={styles.addVehicleText}>Add Vehicle</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={vehicles}
          renderItem={renderVehicle}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  list: {
    padding: 15,
  },
  vehicleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  vehicleIcon: {
    marginRight: 15,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  vehicleMileage: {
    fontSize: 14,
    color: '#999',
  },
  primaryBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  primaryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  addVehicleButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  addVehicleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VehiclesScreen;
