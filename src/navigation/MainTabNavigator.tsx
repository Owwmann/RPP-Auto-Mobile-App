/**
 * RPP AUTO - Main Tab Navigator
 * ==============================
 * Implements 5-tab bottom navigation with Recession Proof dark mode theme
 * 
 * TABS:
 * 1. Home - Dashboard (existing)
 * 2. Vehicles - My Vehicles (placeholder)
 * 3. SCAN - Diagnostic Wizard (center, emphasized, placeholder)
 * 4. Community - Forum Feed (placeholder)
 * 5. Profile - User Profile (placeholder)
 */

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {View, StyleSheet} from 'react-native';
import theme from '../theme/theme';

// Import existing screens
import HomeScreen from '../screens/dashboard/HomeScreen';

// Placeholder screens (to be implemented in future batches)
import {Text} from 'react-native';

const PlaceholderScreen = ({title}: {title: string}) => (
  <View style={styles.placeholderContainer}>
    <MaterialCommunityIcons name="wrench" size={64} color={theme.colors.brand.green} />
    <Text style={styles.placeholderTitle}>{title}</Text>
    <Text style={styles.placeholderSubtitle}>Coming Soon</Text>
    <Text style={styles.placeholderText}>This feature will be implemented in the next batch</Text>
  </View>
);

const VehiclesScreen = () => <PlaceholderScreen title="My Vehicles" />;
const ScanScreen = () => <PlaceholderScreen title="Diagnostic Scan" />;
const CommunityScreen = () => <PlaceholderScreen title="Community" />;
const ProfileScreen = () => <PlaceholderScreen title="Profile" />;

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: theme.colors.brand.green,
        tabBarInactiveTintColor: '#666666',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Vehicles"
        component={VehiclesScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="car-sports" size={size} color={color} />
          ),
        }}
      />
      
      {/* CENTER TAB - EMPHASIZED SCAN BUTTON */}
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarIcon: ({color, focused}) => (
            <View style={[styles.centerButton, focused && styles.centerButtonActive]}>
              <MaterialCommunityIcons 
                name="scan-helper" 
                size={32} 
                color={focused ? theme.colors.background.primary : theme.colors.brand.yellow} 
              />
            </View>
          ),
          tabBarLabel: '',
        }}
      />
      
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="account-group" size={size} color={color} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.background.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.default,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.medium,
  },
  tabBarIcon: {
    marginBottom: -4,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.brand.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...theme.shadows.md,
  },
  centerButtonActive: {
    backgroundColor: theme.colors.brand.green,
    transform: [{scale: 1.1}],
  },
  placeholderContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  placeholderTitle: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
  },
  placeholderSubtitle: {
    fontSize: theme.typography.sizes.h4,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.brand.yellow,
    marginTop: theme.spacing.sm,
  },
  placeholderText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
});
