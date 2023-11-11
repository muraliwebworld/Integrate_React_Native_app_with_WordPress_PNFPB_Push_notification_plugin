/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import type {PropsWithChildren} from 'react';
import messaging from '@react-native-firebase/messaging';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { NativeModules, Platform } from 'react-native'
var Aes = NativeModules.Aes
import CryptoJS from "react-native-crypto-js";
import { JSHash, JSHmac, CONSTANTS } from "react-native-hash";


type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}



function App(): JSX.Element {
  const generateKey = (password: any, salt: any, cost: any, length: any) => Aes.pbkdf2(password, salt, cost, length,'sha256')

  const encryptData = (text: string, key: string) => {
    return Aes.randomKey(16).then((iv: String) => {
        return Aes.encrypt(text, key, iv, 'aes-256-cbc').then((cipher: String) => ({
            cipher,
            iv,
        }))
    })
  }

  const decryptData = (encryptedData: { cipher: string; iv: string; }, key: string) => Aes.decrypt(encryptedData.cipher, key, encryptedData.iv, 'aes-256-cbc')

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const requestUserPermission = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
        console.log(fcmToken);
        console.log('FIREBASE:: Your Firebase Token is:', fcmToken);
        return fcmToken;
    }
    console.log('FIREBASE:: Failed', 'No token received');
    return null;
}

  useEffect(() => {
    try {
      requestUserPermission().then((fcmToken) => {
        if (fcmToken) {
                  var ct = CryptoJS.AES.encrypt(fcmToken, 'secret key from pnfpb plugin');
                  const ivHex = ct.iv.toString();
                  const key = CryptoJS.enc.Utf8.parse('secret key from pnfpb plugin');
                  const ivhex = CryptoJS.enc.Hex.parse(ivHex);
                  const ivhexbase64 = CryptoJS.enc.Base64.stringify(ivhex);
                  let encrypted = CryptoJS.AES.encrypt(fcmToken, key,{ iv: ivhex, mode: CryptoJS.mode.CBC });
                  let cipertextbase64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
                 
                  JSHmac(fcmToken, 'secret key from pnfpb plugin', CONSTANTS.HmacAlgorithms.HmacSHA256)
                    .then((hash) => {
                      const encryptedSubscription = `${cipertextbase64}:${ivhexbase64}:${hash}:${hash}`;
                      fetch(
                        'https://www.muraliwebworld.com/wp-json/PNFPBpush/v1/subscriptiontoken',
                        {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                          },
                          body: JSON.stringify({
                            token: encryptedSubscription,
                          }),
                        }
                        ).then(response => { return response.json();})
                        .then(responseData => {console.log(responseData); return responseData;})
                        .then(data => {console.log(data)});

                    }).catch(e => console.log(e));
                  }
                })        

  } catch (e) {  console.log(e) }
  });

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
