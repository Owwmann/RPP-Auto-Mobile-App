import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {supabase} from '../../config/supabase';

interface Part {
  id: string;
  part_number: string;
  part_name: string;
  part_category: string;
  manufacturer: string;
  average_price: number;
}

const PartsSearchScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(false);

  const searchParts = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const {data, error} = await supabase
        .from('parts_catalog')
        .select('*')
        .or(`part_name.ilike.%${searchQuery}%,part_number.ilike.%${searchQuery}%`)
        .limit(20);

      if (error) throw error;
      setParts(data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPart = ({item}: {item: Part}) => (
    <TouchableOpacity 
      style={styles.partCard}
      onPress={() => navigation.navigate('PartDetails', {part: item})}
    >
      <View style={styles.partIcon}>
        <Icon name="cog" size={30} color="#007AFF" />
      </View>
      <View style={styles.partInfo}>
        <Text style={styles.partName}>{item.part_name}</Text>
        <Text style={styles.partNumber}>{item.part_number}</Text>
        <Text style={styles.manufacturer}>{item.manufacturer}</Text>
      </View>
      <View style={styles.partPrice}>
        <Text style={styles.price}>${item.average_price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Icon name="magnify" size={24} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search parts by name or number..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchParts}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => {
            setSearchQuery('');
            setParts([]);
          }}>
            <Icon name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : parts.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="package-variant" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Search for Parts</Text>
          <Text style={styles.emptyText}>Enter a part name or number to begin</Text>
        </View>
      ) : (
        <FlatList
          data={parts}
          renderItem={renderPart}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 15,
  },
  partCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  partIcon: {
    marginRight: 15,
  },
  partInfo: {
    flex: 1,
  },
  partName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  partNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  manufacturer: {
    fontSize: 12,
    color: '#999',
  },
  partPrice: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
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
  },
});

export default PartsSearchScreen;
