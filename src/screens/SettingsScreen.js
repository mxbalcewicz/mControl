import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Input} from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';

const SettingsScreen = () => {
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [userData, setUserData] = useState();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [bio, setBio] = useState('');
  const [currency, setCurrency] = useState('');

  const showStateData = () => {
    console.log(userData);
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
    const snapshot = firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => setUserData(documentSnapshot.data()));
  });

  return (
    <View style={styles.container}>
      {/* {userData[name] == "" ? <Input placeholder="Name" /> : <Input placeholder={userData[name]}/>} */}

      <Input placeholder="Name" />
      <Input placeholder="Surname" />
      <Input placeholder="Bio" />
      <Picker
        style={styles.pickerStyles}
        selectedValue={selectedCurrency}
        onValueChange={handleValueChange}>
        <Picker.Item label="PLN" value="PLN" />
        <Picker.Item label="EUR" value="EUR" />
        <Picker.Item label="USD" value="USD" />
      </Picker>
      <Button title="Update user data" />
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
    width: '100%',
    backgroundColor: 'white',
    color: 'black',
  },
});
