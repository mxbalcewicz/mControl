import React, { useState } from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
//import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import Title from '../components/Title';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob-alpha';

const HomeScreen = ({navigation}) => {
  const [name, setName] = useState();

  return (
    <View style={styles.container}>
      <Title name={name}/>
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
