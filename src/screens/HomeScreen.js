import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  TextInput
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Avatar } from 'react-native-elements';
// TODO Google AdMob integration @rnfirebase/admob / admob-alpha
import Icon from 'react-native-vector-icons/Ionicons';


const HomeScreen = ({ navigation }) => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState(null);
  const [transactionName, setTransactionName] = useState(null);
  const [transactionType, setTransactionType] = useState("INCOMING");
  const [plusTransactions, setPlusTransactions] = useState();
  const [minusTransactions, setMinusTransactions] = useState();
  const [balanceIncoming, setBalanceIncoming] = useState();
  const [balanceOutgoing, setBalanceOutgoing] = useState();
  const [balanceSummary, setBalanceSummary] = useState();
  const [currentBalance, setCurrentBalance] = useState();

  const handleValueChange = (itemValue, itemIndex) => {
    setTransactionType(itemValue);
    console.log(itemValue);
  }

  const updateDataFromFirestore = () => {
    console.log('UPDATE DATA');
    let addSum = 0;
    let subtractSum = 0;
    const user = auth().currentUser;
    const emailPart = String(user.email).split("@")[0];
    setEmail(emailPart);
    firestore().collection('users').doc(user.uid).get()
      .then(
        documentSnapshot => {
          console.log(documentSnapshot.data());
          setName(documentSnapshot.data()["name"]);
        }
      );

    firestore().collection('balance_add').get()
      .then(
        documentSnapshot => {
          documentSnapshot.forEach(snap => {
            if (snap.data()["uid"] == user.uid) {
              addSum += snap.data()["amount"];
            }
          });
          setBalanceIncoming(addSum);
        }
      );
    firestore().collection('balance_subtract').get()
      .then(
        documentSnapshot => {
          documentSnapshot.forEach(snap => {
            if (snap.data()["uid"] == user.uid) {
              subtractSum += snap.data()["amount"];
            }
          });
          setBalanceOutgoing(subtractSum);
        }
      );
      //BALANCE UPDATE SUMMARY
  };

  useEffect(updateDataFromFirestore, []);

  const addNewTransaction = () => {
    console.log(transactionType);
    const user = auth().currentUser;
    const timestamp = firestore.FieldValue.serverTimestamp();
    if (transactionType == "INCOMING") {
      firestore().collection('balance_add').doc().set(
        {
          amount: parseInt(transactionAmount),
          name: transactionName,
          uid: user.uid,
          timestamp: timestamp
        }
      ).then(updateDataFromFirestore);
    }
    else {
      firestore().collection('balance_subtract').doc().set(
        {
          amount: parseInt(transactionAmount),
          name: transactionName,
          uid: user.uid,
          timestamp: timestamp
        }
      ).then(updateDataFromFirestore);
    }
  };



  return (
    <View style={styles.wrapper}>
      <View elevation={24} style={styles.bannerView}>
        <View style={styles.avatarView}>
          <Avatar
            rounded
            source={{
              uri:
                'https://robohash.org/' + email,
            }}
            size={130}
            avatarStyle={{ borderWidth: 2, borderColor: 'white', borderTopLeftRadius: 1 }}
          />
        </View>

        <View style={styles.wrapper}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Hello {name}!</Text>
          </View>
          <View style={styles.balanceWrapper}>
            <Text>Balance incoming: {balanceIncoming}</Text>
            <Text>Balance outgoing: {balanceOutgoing}</Text>
            <Text>Balance summary: {currentBalance}</Text>
          </View>
        </View>
      </View>

      <SafeAreaView style={styles.contentView}>
        <ScrollView>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>
        </ScrollView>
      </SafeAreaView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setName(null);
          setTransactionAmount(null);
        }
        }
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add new transaction to your history</Text>
            <TextInput
              style={styles.input}
              placeholder="Transaction name"
              placeholderTextColor="#aaaaaa"
              onChangeText={text => setTransactionName(text)}
              value={transactionName}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType='numeric'
              placeholderTextColor="#aaaaaa"
              onChangeText={text => setTransactionAmount(text)}
              value={transactionAmount}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
            <Picker
              style={styles.pickerStyles}
              selectedValue={transactionType}
              onValueChange={handleValueChange}>
              <Picker.Item label="Incoming" value="INCOMING" />
              <Picker.Item label="Outgoing" value="OUTGOING" />
            </Picker>

            <TouchableOpacity
              style={styles.button}
              onPress={addNewTransaction}>
              <Text style={styles.buttonTitle}>Add transaction</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                setModalVisible(!modalVisible)
              }>
              <Text style={styles.buttonTitle}>Close</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      <View style={styles.addButtonView}>
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <Icon name="add-circle-outline" size={60} color="black" />
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'black'
  },
  bannerView: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: "center",
    borderRadius: 30,
    marginTop: 5,
    backgroundColor: '#68a0cf',
  },
  avatarView: {
    borderWidth: 1,
    borderColor: 'black',
  },
  titleWrapper: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: 'black',
    alignSelf: 'stretch'
  },
  title: {
    textAlign:'center',
    alignSelf:'center',
  },
  balanceWrapper: {
    flex: 3,
    justifyContent: "center",
  },
  contentView: {
    flex: 4,
    backgroundColor: 'transparent',
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButton: {
    backgroundColor: 'transparent',
  },
  addButtonView: {
    padding: 25,
    position: 'absolute',
    bottom: 3,
    alignSelf: 'flex-end',
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
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center'
  },
  buttonTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: "bold"
  },
});

export default HomeScreen;
