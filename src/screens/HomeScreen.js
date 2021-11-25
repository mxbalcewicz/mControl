import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import auth from '@react-native-firebase/auth';
// TODO Google AdMob integration @rnfirebase/admob / admob-alpha
// import Title from '../components/Title';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({navigation}) => {
  const [name, setName] = useState();
  const [modalVisible, setModalVisible] = useState(true);
  // useEffect(() => {

  // });

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.container}>
            <View style={styles.modalView}>
              <Text>Modal</Text>
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Icon name="add-circle-outline" size={60} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      <View style={styles.addButtonView}>
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <Icon name="add-circle-outline" size={60} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
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
    borderWidth: 0,
    padding: 25,
    position: 'absolute',
    bottom: 3,
    alignSelf: 'flex-end',
  },
});

export default HomeScreen;
