import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {supabase} from '../../config/supabase';
import {useAuth} from '../../contexts/AuthContext';
import {theme} from '../../theme';

interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  nickname?: string;
  is_primary: boolean;
}

const MyVehiclesScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {user} = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const {data, error} = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_primary', {ascending: false})
        .order('created_at', {ascending: false});

      if (error) throw error;
      setVehicles(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    Alert.alert(
      'Delete Vehicle',
      'Are you sure you want to delete this vehicle?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const {error} = await supabase
                .from('vehicles')
                .delete()
                .eq('id', vehicleId);

              if (error) throw error;
              loadVehicles();
              Alert.alert('Success', 'Vehicle deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const renderVehicleCard = ({item}: {item: Vehicle}) => (
    <TouchableOpacity
      style={[styles.card, item.is_primary && styles.primaryCard]}
      onPress={() => navigation.navigate('VehicleDetails', {vehicleId: item.id})}
    >
      <View style={styles.cardHeader}>
        <Icon name="car" size={32} color={theme.colors.primary} />
        {item.is_primary && (
          <View style={styles.primaryBadge}>
            <Text style={styles.primaryText}>PRIMARY</Text>
          </View>
        )}
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.vehicleName}>
          {item.nickname || `${item.year} ${item.make} ${item.model}`}
        </Text>
        <Text style={styles.vehicleDetails}>
          {item.year} {item.make} {item.model}
        </Text>
        <Text style={styles.vin}>VIN: {item.vin}</Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('VehicleDetails', {vehicleId: item.id})}
        >
          <Icon name="eye" size={20} color={theme.colors.primary} />
          <Text style={styles.actionText}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteVehicle(item.id)}
        >
          <Icon name="delete" size={20} color={theme.colors.error} />
          <Text style={[styles.actionText, {color: theme.colors.error}]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Vehicles</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddVehicle')}
        >
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {vehicles.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="car-off" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.emptyText}>No vehicles added yet</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('AddVehicle')}
          >
            <Icon name="plus" size={20} color="#fff" />
            <Text style={styles.buttonText}>Add Your First Vehicle</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={vehicles}
          renderItem={renderVehicleCard}
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
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 15,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  primaryCard: {
    borderColor: theme.colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  primaryText: {
    color: theme.colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBody: {
    marginBottom: 15,
  },
  vehicleName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  vehicleDetails: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  vin: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: 'monospace',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 16,
    color: theme.colors.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default MyVehiclesScreen;
