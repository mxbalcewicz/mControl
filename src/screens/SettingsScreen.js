import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';

const SettingsScreen = () => {
  const [selectedCurrency, setSelectedCurrency] = useState();
  const [userData, setUserData] = useState();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

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
        updateData();
      });
  };

  const signOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  const handleValueChange = (itemValue, itemIndex) =>
    setSelectedCurrency(itemValue);

  const updateData = () => {
    const user = auth().currentUser;
    firestore().collection('users').doc(user.uid).get()
      .then(
        documentSnapshot => {
          setUserData(documentSnapshot.data());
          setName(documentSnapshot.data()["name"]);
          setDescription(documentSnapshot.data()["description"]);
          setSelectedCurrency(documentSnapshot.data()["currency"]);
        });
  }

  useEffect(() => {updateData();}, []);

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <View style={{flex: 1 }}>
          <Text>Name</Text>
        </View>
        <View style={{flex: 3 }}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#aaaaaa"
            onChangeText={text => setName(text)}
            value={name}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>

      </View>
      <View style={styles.inputWrapper}>
        <View style={{flex: 1 }}>
          <Text>Description</Text>
        </View>
        <View style={{flex: 3 }}>
          <TextInput
            style={styles.input}
            placeholder="Description"
            placeholderTextColor="#aaaaaa"
            onChangeText={text => setDescription(text)}
            value={description}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
      </View>

      <Picker
        style={styles.pickerStyles}
        selectedValue={selectedCurrency}
        onValueChange={handleValueChange}>
        <Picker.Item label="PLN" value="PLN" />
        <Picker.Item label="EUR" value="EUR" />
        <Picker.Item label="USD" value="USD" />
      </Picker>
      <TouchableOpacity
        style={styles.button}
        onPress={updateUserData}>
        <Text style={styles.buttonTitle}>Update user data</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={signOut}>
        <Text style={styles.buttonTitle}>Sign out!</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: '#788eec',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    width: 150,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center'
  },
  buttonTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: "bold"
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: "center",
    width: '75%',
  }
});

export default SettingsScreen;