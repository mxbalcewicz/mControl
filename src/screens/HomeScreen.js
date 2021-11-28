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
import TransactionItem from '../components/TransactionItem';

const HomeScreen = ({ navigation }) => {
  //Home avatar and displayed name states
  const [name, setName] = useState();
  const [email, setEmail] = useState();

  const [modalVisible, setModalVisible] = useState(false);

  //Modal input states
  const [transactionAmount, setTransactionAmount] = useState(null);
  const [transactionName, setTransactionName] = useState(null);
  const [transactionType, setTransactionType] = useState("INCOMING");

  // Collections of incoming and outgoing transactions
  const [incomingTransactions, setIncomingTransactions] = useState([]);
  const [outgoingTransactions, setOutgoingTransactions] = useState([]);

  //Sum of transactions states
  const [balanceIncoming, setBalanceIncoming] = useState();
  const [balanceOutgoing, setBalanceOutgoing] = useState();
  const [balanceSummary, setBalanceSummary] = useState();

  const handleValueChange = (itemValue, itemIndex) => {
    setTransactionType(itemValue);
    console.log(itemValue);
  }

  const showStates = () => {
    console.log('STARTplusTransactions');
    incomingTransactions.forEach(item => console.log(item));
    console.log('ENDplusTransactions');
  };

  const updateDataFromFirestore = async () => {
    let addSum = 0;
    let subtractSum = 0;
    const user = auth().currentUser;
    const emailPart = String(user.email).split("@")[0];
    setEmail(emailPart);

    //Displayed name in title
    const userCollection = firestore().collection('users');
    userCollection.doc(user.uid).get().then(
      documentSnapshot => {
        setName(documentSnapshot.data()["name"]);
      }
    );

    const incomingTransactionsCollection = firestore().collection('balance_add');
    const outgoingTransactionsCollection = firestore().collection('balance_subtract');
    const incomingTransactionsData = await incomingTransactionsCollection.get();
    const outgoingTransactionsData = await outgoingTransactionsCollection.get();

    incomingTransactionsData.docs.forEach(item => {
      if (item.data()["uid"] == user.uid) {
        //console.log(item.id);
        addSum += item.data()["amount"];
        setIncomingTransactions(incomingTransactions => [...incomingTransactions, item.data()]);
      }
    })
    setBalanceIncoming(addSum);

    outgoingTransactionsData.docs.forEach(item => {
      if (item.data()["uid"] == user.uid) {
        subtractSum += item.data()["amount"];
        setOutgoingTransactions(outgoingTransactions => [...outgoingTransactions, item.data()]);
      }
    })
    setBalanceOutgoing(subtractSum);
    setBalanceSummary(addSum - subtractSum);
  };

  const addNewTransaction = () => {
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

  useEffect(() => {updateDataFromFirestore();}, []);

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
            <Text style={styles.title}>{name}'s finances:</Text>
          </View>
          <View style={styles.balanceWrapper}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: "center" }}>
              <View style={{ flex: 2, alignItems: 'flex-start', paddingLeft: 20 }}>
                <Text style={styles.balanceText}>Balance incoming</Text>
                <Text style={styles.balanceText}>Balance outgoing</Text>
                <Text style={styles.balanceText}>Balance summary</Text>
              </View>
              <View style={{ flex: 1, alignItems: "flex-start", alignItems: "center" }}>
                <Text style={styles.balanceText}>{balanceIncoming}</Text>
                <Text style={styles.balanceText}>{balanceOutgoing}</Text>
                <Text style={styles.balanceText}>{balanceSummary}</Text>
              </View>
            </View>

          </View>
        </View>
      </View>

      <SafeAreaView style={styles.contentView}>
        <ScrollView>
          {/* scroll view items */}
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
        <TouchableOpacity onPress={showStates}>
          <Icon name="add-circle-outline" size={60} color="black" />
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  bannerView: {
    flex: 1,
    padding: 10,
    margin: 5,
    flexDirection: 'row',
    alignItems: "center",
    borderRadius: 30,
    marginTop: 5,
    backgroundColor: '#68a0cf',
    shadowOffset: { width: 20, height: 20 },
    shadowColor: 'black',
    shadowOpacity: 1,
    elevation: 15,
  },
  titleWrapper: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    alignSelf: 'stretch'
  },
  title: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 19,
    fontWeight: '600',
    color: "white"
  },
  balanceWrapper: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  balanceText: {
    fontSize: 18,
    fontWeight: '500',
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
