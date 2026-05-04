import 'react-native-url-polyfill/auto';
import React from 'react';
import { StatusBar } from 'react-native';
import Navigation from './src/navigation';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#C8102E" />
      <Navigation />
    </>
  );
}
