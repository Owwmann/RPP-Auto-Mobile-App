import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { supabase } from '../../config/supabase';
import AnalyticsService from '../../services/analyticsService';
import ReportingService from '../../services/reportingService';

interface User {
  id: string;
  email: string;
  created_at: string;
  preferences: any;
  last_login?: string;
}

const UserManagementScreen = ({ navigation }: any) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);

  const analyticsService = AnalyticsService.getInstance();
  const reportingService = ReportingService.getInstance();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setUsers(data || []);
      await analyticsService.trackScreenView('user_management');
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadUserDetails = async (user: User) => {
    try {
      setSelectedUser(user);
      
      // Load user statistics
      const stats = await reportingService.generateUsageReport(user.id, 'month');
      setUserStats(stats);
      
      setShowUserDetails(true);
    } catch (error) {
      console.error('Error loading user details:', error);
      Alert.alert('Error', 'Failed to load user details');
    }
  };

  const deleteUser = async (userId: string) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', userId);

              if (error) throw error;

              await loadUsers();
              Alert.alert('Success', 'User deleted successfully');
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('Error', 'Failed to delete user');
            }
          }
        }
      ]
    );
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => loadUserDetails(item)}
    >
      <View style={styles.userIcon}>
        <Icon name="person" size={32} color="#2196F3" />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userId}>ID: {item.id.substring(0, 8)}...</Text>
        <Text style={styles.userDate}>
          Joined: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteUser(item.id)}
      >
        <Icon name="delete" size={20} color="#F44336" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>User Management</Text>
        <TouchableOpacity onPress={loadUsers}>
          <Icon name="refresh" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by email or ID..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="clear" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Total Users: {users.length}
        </Text>
        <Text style={styles.statsText}>
          Filtered: {filteredUsers.length}
        </Text>
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadUsers}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="people" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
      />

      {/* User Details Modal */}
      <Modal
        visible={showUserDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowUserDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>User Details</Text>
              <TouchableOpacity onPress={() => setShowUserDetails(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedUser && (
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email:</Text>
                  <Text style={styles.detailValue}>{selectedUser.email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>User ID:</Text>
                  <Text style={styles.detailValue}>{selectedUser.id}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Joined:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(selectedUser.created_at).toLocaleString()}
                  </Text>
                </View>

                {userStats && (
                  <>
                    <Text style={styles.statsTitle}>Usage Statistics (Last Month)</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Sessions:</Text>
                      <Text style={styles.detailValue}>{userStats.totalSessions}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Diagnostics:</Text>
                      <Text style={styles.detailValue}>{userStats.totalDiagnostics}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Agent Interactions:</Text>
                      <Text style={styles.detailValue}>
                        {userStats.totalAgentInteractions}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Avg Session:</Text>
                      <Text style={styles.detailValue}>
                        {(userStats.averageSessionDuration / 1000 / 60).toFixed(1)} min
                      </Text>
                    </View>

                    {userStats.mostUsedFeatures.length > 0 && (
                      <>
                        <Text style={styles.statsTitle}>Top Features</Text>
                        {userStats.mostUsedFeatures.slice(0, 5).map((feature: any) => (
                          <View key={feature.feature} style={styles.featureRow}>
                            <Text style={styles.featureName}>{feature.feature}</Text>
                            <Text style={styles.featureCount}>{feature.count}</Text>
                          </View>
                        ))}
                      </>
                    )}
                  </>
                )}
              </View>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowUserDetails(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    padding: 12,
    borderRadius: 8,
    gap: 10
  },
  searchInput: {
    flex: 1,
    fontSize: 16
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 12,
    borderRadius: 8
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600'
  },
  list: {
    padding: 15
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  userIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  userInfo: {
    flex: 1,
    gap: 3
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  userId: {
    fontSize: 12,
    color: '#666'
  },
  userDate: {
    fontSize: 12,
    color: '#999'
  },
  deleteButton: {
    padding: 8
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#999'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  detailsContainer: {
    gap: 10
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    flex: 1
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right'
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6
  },
  featureName: {
    fontSize: 13,
    color: '#666'
  },
  featureCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2196F3'
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center'
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default UserManagementScreen;
