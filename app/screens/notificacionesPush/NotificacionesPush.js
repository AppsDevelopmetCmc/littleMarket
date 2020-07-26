import Constants from 'expo-constants';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';

export default function NotificacionesPush() {
   const [expoPushToken, setExpoPushToken] = useState('');
   const [notification, setNotification] = useState(false);
   const notificationListener = useRef();
   const responseListener = useRef();

   useEffect(() => {
      registerForPushNotificationsAsync().then(token =>
         setExpoPushToken(token)
      );
   }, []);

   return (
      <View
         style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-around',
         }}
      >
         <Text>Your expo push token: {expoPushToken}</Text>
         <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>
               Title: {notification && notification.request.content.title}{' '}
            </Text>
            <Text>
               Body: {notification && notification.request.content.body}
            </Text>
            <Text>
               Data:{' '}
               {notification &&
                  JSON.stringify(notification.request.content.data)}
            </Text>
         </View>
         <Button
            title="Press to Send Notification"
            onPress={async () => {
               //wait sendPushNotification(expoPushToken);
               registerForPushNotificationsAsync().then(token =>
                  setExpoPushToken(token)
               );
            }}
         />
      </View>
   );
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
async function sendPushNotification(expoPushToken) {
   const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Original Title',
      body: 'And here is the body!',
      data: { data: 'goes here' },
   };

   await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
         Accept: 'application/json',
         'Accept-encoding': 'gzip, deflate',
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
   });
}

async function registerForPushNotificationsAsync() {
   let token;
   if (Constants.isDevice) {
      console.log('ingreso a recibir notificaciones');
      const { status: existingStatus } = await Permissions.getAsync(
         Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      console.log('finalStatus', finalStatus);

      if (existingStatus !== 'granted') {
         const { status } = await Permissions.askAsync(
            Permissions.NOTIFICATIONS
         );
         finalStatus = status;
      }
      console.log('finalStatus', finalStatus);
      if (finalStatus !== 'granted') {
         alert('Failed to get push token for push notification!');
         return;
      }
      token = await Notifications.getExpoPushTokenAsync();
      console.log('tokenRevision', token);
   } else {
      alert('Must use physical device for Push Notifications');
   }

   //    if (Platform.OS === 'android') {
   //       Notifications.setNotificationChannelAsync('default', {
   //          name: 'default',
   //          importance: Notifications.AndroidImportance.MAX,
   //          vibrationPattern: [0, 250, 250, 250],
   //          lightColor: '#FF231F7C',
   //       });
   //    }

   return token;
}
