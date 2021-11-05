import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';

const signOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Home screen view</Text>
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
