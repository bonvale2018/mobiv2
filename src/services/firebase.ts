import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const config = {
  apiKey:            'AIzaSyCOfDKmZVeJlO7ygmjviY_0iTDowHCXIQg',
  authDomain:        'marvelexecutivecarhire-6da8d.firebaseapp.com',
  projectId:         'marvelexecutivecarhire-6da8d',
  storageBucket:     'marvelexecutivecarhire-6da8d.firebasestorage.app',
  messagingSenderId: '431795853920',
  appId:             '1:431795853920:web:a2fda054af2a5fe9a20105',
};

// Only initialise once
const app = getApps().length === 0 ? initializeApp(config) : getApp();

let auth: ReturnType<typeof getAuth>;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };
