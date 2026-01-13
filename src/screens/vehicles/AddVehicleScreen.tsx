import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {vinService} from '../../services/vinService';
import {supabase} from '../../config/supabase';
import {useAuth} from '../../contexts/AuthContext';

const AddVehicleScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {user} = useAuth();
  const [vin, setVin] = useState('');
  const [nickname, setNickname] = useState('');
  const [mileage, setMileage] = useState('');
  const [loading, setLoading] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState<any>(null);

  const handleDecodeVIN = async () => {
    if (vin.length !== 17) {
      Alert.alert('Invalid VIN', 'VIN must be 17 characters');
      return;
    }

    setLoading(true);
    try {
      const info = await vinService.decodeVIN(vin);
      if (info) {
        setVehicleInfo(info);
      } else {
        Alert.alert('Error', 'Could not decode VIN');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to decode VIN');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVehicle = async () => {
    if (!vehicleInfo) {
      Alert.alert('Error', 'Please decode VIN first');
      return;
    }

    setLoading(true);
    try {
      const {data, error} = await supabase
        .from('vehicles')
        .insert({
          user_id: user?.id,
          vin: vin,
          make: vehicleInfo.make,
          model: vehicleInfo.model,
          year: vehicleInfo.year,
          engine: vehicleInfo.engine,
          transmission: vehicleInfo.transmission,
          fuel_type: vehicleInfo.fuelType,
          nickname: nickname || null,
          mileage: mileage ? parseInt(mileage) : null,
          is_primary: false,
        })
        .select()
        .single();

      if (error) throw error;

      Alert.alert('Success', 'Vehicle added successfully', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Enter VIN</Text>
        <Text style={styles.sectionDesc}>17-character Vehicle Identification Number</Text>

        <TextInput
          style={styles.input}
          placeholder="VIN Number"
          value={vin}
          onChangeText={setVin}
          maxLength={17}
          autoCapitalize="characters"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleDecodeVIN}
          disabled={loading || vin.length !== 17}
        >
          <Icon name="magnify" size={20} color="#fff" />
          <Text style={styles.buttonText}>Decode VIN</Text>
        </TouchableOpacity>
      </View>

      {vehicleInfo && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Details</Text>
            <View style={styles.detailsCard}>
              <Text style={styles.detailLabel}>Make</Text>
              <Text style={styles.detailValue}>{vehicleInfo.make}</Text>
            </View>
            <View style={styles.detailsCard}>
              <Text style={styles.detailLabel}>Model</Text>
              <Text style={styles.detailValue}>{vehicleInfo.model}</Text>
            </View>
            <View style={styles.detailsCard}>
              <Text style={styles.detailLabel}>Year</Text>
              <Text style={styles.detailValue}>{vehicleInfo.year}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Info (Optional)</Text>

            <TextInput
              style={styles.input}
              placeholder="Nickname (e.g., My Honda)"
              value={nickname}
              onChangeText={setNickname}
            />

            <TextInput
              style={styles.input}
              placeholder="Current Mileage"
              value={mileage}
              onChangeText={setMileage}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.buttonDisabled]}
              onPress={handleSaveVehicle}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Icon name="check" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Save Vehicle</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  detailsCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
});

export default AddVehicleScreen;
