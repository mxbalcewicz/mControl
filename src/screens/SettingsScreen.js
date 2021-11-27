import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Input } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';

const SettingsScreen = () => {
  const [selectedCurrency, setSelectedCurrency] = useState();
  const [userData, setUserData] = useState();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const showStateData = () => {
    console.log(userData["name"]);
  };

  const updateUserData = () => {
    const user = auth().currentUser;
    console.log(user);
    console.log(user.uid);
    firestore()
      .collection('users').doc(user.uid)
      .update({
        name: name,
        description: description,
        currency: selectedCurrency
      })
      .then(() => {
        console.log('User data updated in firestore database!');
      });
  };

  const signOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  const handleValueChange = (itemValue, itemIndex) =>
    setSelectedCurrency(itemValue);

  useEffect(() => {
    const user = auth().currentUser;
    firestore().collection('users').doc(user.uid).get()
      .then(
        documentSnapshot => {
          setUserData(documentSnapshot.data());
          setName(documentSnapshot.data()["name"]);
          setDescription(documentSnapshot.data()["description"]);
          setSelectedCurrency(documentSnapshot.data()["currency"]);
        });
  }, []
  );


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#aaaaaa"
        onChangeText={text => setName(text)}
        value={name}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor="#aaaaaa"
        onChangeText={text => setDescription(text)}
        value={description}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
      />
      <Picker
        style={styles.pickerStyles}
        selectedValue={selectedCurrency}
        onValueChange={handleValueChange}>
        <Picker.Item label="PLN" value="PLN" />
        <Picker.Item label="EUR" value="EUR" />
        <Picker.Item label="USD" value="USD" />
      </Picker>
      <Button title="Update user data" onPress={updateUserData} />
      <Button title="Sign out" onPress={signOut} />
      <Button title="Show data" onPress={showStateData} />
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerStyles: {
    width: '50%',
    backgroundColor: 'white',
    color: 'black',
  },
  input: {
    height: 48,
    width: '50%',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },
});
