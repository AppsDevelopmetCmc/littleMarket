import Constants from 'expo-constants';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';

export default function NotificacionesPush() {
   const [expoPushToken, setExpoPushToken] = useState('');
   const [notification, setNotification] = useState(null);

   useEffect(() => {
      console.log('Ingreso al useEffect');
      registerForPushNotificationsAsync().then(token =>
         setExpoPushToken(token)
      );
      Notifications.addListener(notificacionRecibida => {
         console.log('notificacionRecibida', notificacionRecibida);
         setNotification(notificacionRecibida);
      });
   }, []);

   console.log('expoPushToken', expoPushToken);

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
            <Text> {'Title: ' + notification.data.title}</Text>
            <Text>Body:</Text>
            <Text>Data: </Text>
         </View>
         <Button
            title="Press to Send Notification"
            onPress={async () => {
               await sendPushNotification(expoPushToken);
               // registerForPushNotificationsAsync().then(token =>
               //    setExpoPushToken(token)
               // );
            }}
         />
      </View>
   );
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
async function sendPushNotification(expoPushToken) {
   console.log('Ingreso a sendPushNotification', expoPushToken);
   const message = {
      to: 'ExponentPushToken[Hu_kykFb5bhJU9Hvhzzxhz]',
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

   return token;
}
