// App.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { User, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, onAuthStateChanged } from './firebase';
import { getCredentials } from './storage';
import LoginScreen from './screens/LoginScreen';
import ChatScreen from './screens/ChatScreen';

export type RootStackParamList = {
  Login: undefined;
  Chat: { email: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, currentUser => {
      if (currentUser) {
        setUser(currentUser);
        setInitializing(false);
      } else {
        checkLocalLogin();
      }
    });

    return () => unsub();
  }, []);

  const checkLocalLogin = async () => {
    try {
      const creds = await getCredentials();

      if (creds) {
        try {
          await signInWithEmailAndPassword(auth, creds.email, creds.password);
        } catch (loginError) {
          console.log('Login online gagal, masuk mode offline', loginError);

          setUser({ email: creds.email } as User);
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('Gagal membaca credentials', e);
      setUser(null);
    } finally {
      setInitializing(false);
    }
  };

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            initialParams={{ email: user.email || 'Anon' }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
