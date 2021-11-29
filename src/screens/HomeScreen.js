import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  TextInput,
  FlatList,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import TransactionItem from '../components/TransactionItem';


const HomeScreen = ({ navigation }) => {
  //Home avatar, displayed name and currency states
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [currency, setCurrency] = useState();

  const [modalVisible, setModalVisible] = useState(false);

  //Modal input states
  const [transactionAmount, setTransactionAmount] = useState(null);
  const [transactionName, setTransactionName] = useState(null);
  const [transactionType, setTransactionType] = useState("incoming");

  // Collections of incoming and outgoing transactions
  const [transactions, setTransactions] = useState([]);

  // AdmobAdRef
  const nativeAdViewRef = useRef();

  //Sum of transactions states
  const [balanceIncoming, setBalanceIncoming] = useState();
  const [balanceOutgoing, setBalanceOutgoing] = useState();
  const [balanceSummary, setBalanceSummary] = useState();

  const handleValueChange = (itemValue, itemIndex) => {
    setTransactionType(itemValue);
    console.log(itemValue);
  }

  const showStates = () => {
    transactions.forEach(item => console.log(item["name"]));
  };

  const updateDataFromFirestore = async () => {
    nativeAdViewRef.current?.loadAd();
    setTransactions([]);
    let sumIncoming = 0;
    let sumOutgoing = 0;
    const user = auth().currentUser;
    const emailPart = String(user.email).split("@")[0];
    setEmail(emailPart);

    //Displayed name in title
    const userCollection = firestore().collection('users');
    const currentUserData = await userCollection.doc(user.uid).get().then(documentSnapshot => {
      setName(documentSnapshot.data()["name"]);
      setCurrency(documentSnapshot.data()["currency"]);
    }
    );

    const transactionsCollection = firestore().collection('transactions').orderBy("timestamp", "desc");
    const transactionsData = await transactionsCollection.get();

    transactionsData.docs.forEach(item => {
      if (item.data()["uid"] == user.uid) {
        if (item.data()["type"] == "incoming") {
          sumIncoming += item.data()["amount"];
          var transactionData = item.data();
          transactionData["id"] = item.id;
          setTransactions(transactions => [...transactions, transactionData]);
        } else {
          sumOutgoing += item.data()["amount"];
          var transactionData = item.data();
          transactionData["id"] = item.id;
          console.log(transactionData);
          setTransactions(transactions => [...transactions, transactionData]);
        }
      }
    })
    setBalanceIncoming(sumIncoming);
    setBalanceOutgoing(sumOutgoing);
    setBalanceSummary(sumIncoming - sumOutgoing);

  };

  const hideClearModal = () => {
    setModalVisible(!modalVisible);
    setTransactionAmount(null);
    setTransactionName(null);
  }

  const addNewTransaction = () => {
    const user = auth().currentUser;
    const timestamp = firestore.FieldValue.serverTimestamp();

    if (transactionAmount == null) {
      Alert.alert('You need to provide the amount!');
    }
    else {
      firestore().collection('transactions').doc().set(
        {
          amount: parseInt(transactionAmount),
          name: transactionName,
          uid: user.uid,
          timestamp: timestamp,
          type: transactionType
        }
      ).then(updateDataFromFirestore);
    }
  };

  useEffect(() => { updateDataFromFirestore(); }, []);

  return (
    <View style={styles.wrapper}>
      <View elevation={24} style={styles.bannerView}>
        <View>
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
              <View style={{ flex: 1, alignItems: 'flex-start', paddingLeft: 20 }}>
                <Text style={styles.balanceText}>Incoming</Text>
                <Text style={styles.balanceText}>Outgoing</Text>
                <Text style={styles.balanceText}>Summary</Text>
              </View>
              <View style={{ flex: 2, alignItems: "flex-start", alignItems: "center" }}>
                <Text style={styles.balanceText}>{balanceIncoming} {currency}</Text>
                <Text style={styles.balanceText}>{balanceOutgoing} {currency}</Text>
                <Text style={styles.balanceText}>{balanceSummary} {currency}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <SafeAreaView style={styles.contentView}>
        <FlatList
          data={transactions}
          renderItem={(data) => {
            return <TransactionItem id={data["item"]["id"]} name={data["item"]["name"]} amount={data["item"]["amount"]} currency={currency} transactionType={data["item"]["type"]} updateFn={() => updateDataFromFirestore()} />
          }
          }
        />
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
              <Picker.Item label="Incoming" value="incoming" />
              <Picker.Item label="Outgoing" value="outgoing" />
            </Picker>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                addNewTransaction();
                hideClearModal();
              }}>
              <Text style={styles.buttonTitle}>Add transaction</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={hideClearModal}>
              <Text style={styles.buttonTitle}>Close</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      <View style={styles.addButtonView}>
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <Icon name="add-circle-outline" size={60} color="#3F8EFC" />
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  bannerView: {
    flex: 1,
    padding: 10,
    margin: 5,
    flexDirection: 'row',
    alignItems: "center",
    borderRadius: 30,
    marginTop: 5,
    backgroundColor: '#3F8EFC',
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
    fontSize: 16,
    fontWeight: '500',
    color: "white"
  },
  contentView: {
    flex: 4,
    backgroundColor: 'transparent',
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
});

export default HomeScreen;
