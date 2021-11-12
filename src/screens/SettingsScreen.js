import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import auth from '@react-native-firebase/auth';

const signOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

const SettingsScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Fill you data here!</Text>
            <Button title="Sign out" onPress={signOut} />
        </View>
    )
}

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
