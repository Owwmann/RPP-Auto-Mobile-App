import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../../../src/screens/auth/LoginScreen';
import SignupScreen from '../../../src/screens/auth/SignupScreen';
import { AuthProvider } from '../../../src/contexts/AuthContext';
import { supabase } from '../../../src/config/supabase';

const MockedNavigator = ({ children }: any) => (
  <NavigationContainer>
    <AuthProvider>
      {children}
    </AuthProvider>
  </NavigationContainer>
);

describe('Authentication Integration Tests', () => {
  describe('Login Flow', () => {
    it('should login successfully with valid credentials', async () => {
      const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
      
      const { getByPlaceholderText, getByText } = render(
        <MockedNavigator>
          <LoginScreen navigation={mockNavigation as any} route={{} as any} />
        </MockedNavigator>
      );

      const emailInput = getByPlaceholderText('Email');
      const passwordInput = getByPlaceholderText('Password');
      const loginButton = getByText('Login');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);

      await waitFor(() => {
        // Should navigate after successful login
        expect(mockNavigation.navigate).toHaveBeenCalled();
      }, { timeout: 5000 });
    });

    it('should show error with invalid credentials', async () => {
      const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
      
      const { getByPlaceholderText, getByText, findByText } = render(
        <MockedNavigator>
          <LoginScreen navigation={mockNavigation as any} route={{} as any} />
        </MockedNavigator>
      );

      const emailInput = getByPlaceholderText('Email');
      const passwordInput = getByPlaceholderText('Password');
      const loginButton = getByText('Login');

      fireEvent.changeText(emailInput, 'invalid@example.com');
      fireEvent.changeText(passwordInput, 'wrongpassword');
      fireEvent.press(loginButton);

      // Should show error message
      await waitFor(async () => {
        const errorText = await findByText(/error|invalid|failed/i);
        expect(errorText).toBeDefined();
      }, { timeout: 5000 });
    });

    it('should validate email format', async () => {
      const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
      
      const { getByPlaceholderText, getByText, findByText } = render(
        <MockedNavigator>
          <LoginScreen navigation={mockNavigation as any} route={{} as any} />
        </MockedNavigator>
      );

      const emailInput = getByPlaceholderText('Email');
      const passwordInput = getByPlaceholderText('Password');
      const loginButton = getByText('Login');

      fireEvent.changeText(emailInput, 'not-an-email');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(loginButton);

      await waitFor(async () => {
        const errorText = await findByText(/email|invalid/i);
        expect(errorText).toBeDefined();
      });
    });
  });

  describe('Signup Flow', () => {
    it('should signup successfully with valid data', async () => {
      const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
      
      const { getByPlaceholderText, getByText } = render(
        <MockedNavigator>
          <SignupScreen navigation={mockNavigation as any} route={{} as any} />
        </MockedNavigator>
      );

      const emailInput = getByPlaceholderText('Email');
      const passwordInput = getByPlaceholderText('Password');
      const confirmInput = getByPlaceholderText('Confirm Password');
      const signupButton = getByText('Sign Up');

      const testEmail = `test${Date.now()}@example.com`;
      
      fireEvent.changeText(emailInput, testEmail);
      fireEvent.changeText(passwordInput, 'SecurePass123!');
      fireEvent.changeText(confirmInput, 'SecurePass123!');
      fireEvent.press(signupButton);

      await waitFor(() => {
        expect(mockNavigation.navigate).toHaveBeenCalled();
      }, { timeout: 5000 });
    });

    it('should validate password match', async () => {
      const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
      
      const { getByPlaceholderText, getByText, findByText } = render(
        <MockedNavigator>
          <SignupScreen navigation={mockNavigation as any} route={{} as any} />
        </MockedNavigator>
      );

      const emailInput = getByPlaceholderText('Email');
      const passwordInput = getByPlaceholderText('Password');
      const confirmInput = getByPlaceholderText('Confirm Password');
      const signupButton = getByText('Sign Up');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.changeText(confirmInput, 'different123');
      fireEvent.press(signupButton);

      await waitFor(async () => {
        const errorText = await findByText(/match|password/i);
        expect(errorText).toBeDefined();
      });
    });
  });

  describe('Session Persistence', () => {
    it('should restore session on app restart', async () => {
      // Login first
      await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123'
      });

      // Get session
      const { data: { session } } = await supabase.auth.getSession();
      
      expect(session).toBeDefined();
      expect(session?.user).toBeDefined();

      // Cleanup
      await supabase.auth.signOut();
    });
  });
});
