#  React Native app code to integrate with PNFPB WordPress plugin using API in Push notification for Post and BuddyPress<br/>
React native sample code to integrate Android mobile app with WordPress push notification plugin - PNFPB Push notification for Post and BuddyPress.
PNFPB plugin is designed to send push notifications using Firebase Cloud Messaging (FCM) to websites, Android/iOS mobile apps. This plugin has REST API facility to integrate with native/hybrid Android/iOS mobile apps for push notifications. <br/><br/>

It uses AES-256-CBC encryption using cryptography and secret code from PNFPB WordPress Plugin to send Firebase token to PNFPB Plugin to store in plugin device tokens database table. It uses following react-native packages for encryption. It uses react-native-crypto-js package to encrypt Firebase token and it uses react-native-hash package to generate HMACSHA256 hash. The generated hash will compared in WordPress PNFPB plugin with HMACSHA256 hash created using PHP in backend to make sure it got correct firebase token from the mobile app.

```
import { NativeModules, Platform } from 'react-native'
var Aes = NativeModules.Aes
import CryptoJS from "react-native-crypto-js";
import { JSHash, JSHmac, CONSTANTS } from "react-native-hash";

```

# Download Push notification plugin from WordPress.org repository<br/>
https://wordpress.org/plugins/push-notification-for-post-and-buddypress/<br/><br/>
It sends notification whenever new WordPress post, custom post types,new BuddyPress activities,comments published. It has facility to generate PWA - Progressive Web App. This plugin is able to send push notification to more than 200,000 subscribers unlimited push notifications using background action scheduler.

# PNFPB plugin REST API for Android App<br/>
REST API to connect mobile native/hybrid apps to send push notification from WordPress site to both mobile apps and WordPress sites.
Using this REST API WordPress site gets Firebase Push Notification subscription token from Mobile app(Android/Ios). 
This allows to send push notifications to WordPress site users as well as to Native mobile app Android/ios users.
REST API url is https:/<domain>/wp-json/PNFPBpush/v1/subscriptiontoken

# Integrate Native mobile apps like mobile app with this WordPress plugin<br />
New API to send push notification subscription from Native mobile apps like mobile app to WordPress backend and to send push notifications from WordPress to Native mobile app using Firebase.
1. Generate secret key in mobile app tab to communicate between mobile app(in Integrate app api tab plugin settings)
2. REST api to send subscription token from Mobile app using WebView to this WordPress plugin to store it in WordPress db to send push notification whenever new activities/post are published.

Note:- All REST api code is already included in the code, below is only for reference as guide,

REST API using POST method, to send push notification in secured way using AES 256 cryptography encryption method to avoid spams

REST API url post method to send push notification
https://domainname.com/wp-json/PNFPBpush/v1/subscriptiontoken

Input parameters in body in http post method in mobile APP,
token – it should be encrypted according to AES 256 cryptography standards,


Using secret key generated from step 1, enter secret key in mobile app code

store token in global variable for other user
Generate envrypted token as mentioned below using below coding (AES 256 cryptography encryption)
Once plugin receives this token, it will unencrypt using the secret key generate and compare hash code to confirm it is sent from mobile app

Following is sample code to generate encrypted token using SHA256 cryptography and to generate hash HMACSHA256 ,

```
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
```

# Video tutorial showing how to use API (first video) and how to configure Firebase for this plugin(Second Video)<br />

https://youtu.be/tP2gn8aHZ2s?si=C7ad4c9OyHGjXLuD <br/>
	
https://www.youtube.com/watch?v=02oymYLt3qo <br />![Screenshot 2023-11-11 at 10 47 40 AM](https://github.com/muraliwebworld/Integrate_React_Native_app_with_WordPress_PNFPB_Push_notification_plugin/assets/32461311/1823fbc0-26f3-4986-96b9-fc0c7696efc5)
![Screenshot 2023-11-11 at 10 47 26 AM](https://github.com/muraliwebworld/Integrate_React_Native_app_with_WordPress_PNFPB_Push_notification_plugin/assets/32461311/ee60e2d8-2238-4009-9bf0-81e66e39593b)
![Screenshot 2023-11-11 at 10 47 20 AM](https://github.com/muraliwebworld/Integrate_React_Native_app_with_WordPress_PNFPB_Push_notification_plugin/assets/32461311/d27f0a46-aa2a-499e-af84-727c435e8ac2)



