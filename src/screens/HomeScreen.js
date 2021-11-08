import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
//import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob-alpha';


const signOut = () => {
  auth()
    .signOut()
    .then(() => console.log('User signed out!'));
};

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Home screen view</Text>
      <AdMobBanner
        adSize="fullBanner"
        adUnitID="ca-app-pub-9984594795986752/5137656974"
        //testDevices={[AdMobBanner.simulatorId]}
        adViewDidReceiveAd={a => console.log('RECEIVED AD ' + a)}
        //onAdFailedToLoad={error => console.error(error)}
      />
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
