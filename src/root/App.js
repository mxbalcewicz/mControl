import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import UnauthenticatedScreen from '../screens/UnauthenticatedScreen';
import AuthenticatedScreen from '../screens/AuthenticatedScreen';

export default App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (!user) {
    return (
      <UnauthenticatedScreen />
    );
  }

  return (
    <AuthenticatedScreen />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});