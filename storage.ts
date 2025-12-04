// storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const CREDENTIALS_KEY = 'user_credentials';
const MESSAGES_KEY = 'chat_debug_v1';

export const saveCredentials = async (email: string, password: string) => {
  try {
    const jsonValue = JSON.stringify({ email, password });
    await AsyncStorage.setItem(CREDENTIALS_KEY, jsonValue);
  } catch (e) {
    console.error(e);
  }
};
export const getCredentials = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(CREDENTIALS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    return null;
  }
};
export const clearCredentials = async () => {
  try {
    await AsyncStorage.removeItem(CREDENTIALS_KEY);
  } catch (e) {}
};

export const saveCachedMessages = async (messages: any[]) => {
  try {
    const jsonValue = JSON.stringify(messages);
    await AsyncStorage.setItem(MESSAGES_KEY, jsonValue);
  } catch (e) {
    console.error(e);
  }
};

export const getCachedMessages = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(MESSAGES_KEY);
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    }
    return [];
  } catch (e) {
    return [];
  }
};
