import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const Stack = createStackNavigator();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{title: 'Create Account'}}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{title: 'Reset Password'}}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
