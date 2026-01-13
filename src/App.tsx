import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from './contexts/AuthContext';
import {VehicleProvider} from './contexts/VehicleContext';
import {AppNavigator} from './navigation/AppNavigator';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <VehicleProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </VehicleProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
