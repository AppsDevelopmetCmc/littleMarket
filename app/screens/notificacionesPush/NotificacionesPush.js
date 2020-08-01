import Constants from 'expo-constants';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';

export class NotificacionesPush {
   registerForPushNotificationsAsync = async () => {
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
         this.traerToken(token);
      } else {
         alert('Must use physical device for Push Notifications');
      }
   };

   traerToken = async token => {
      await global.db
         .collection('push_cliente')
         .doc(global.usuario)
         .get()
         .then(doc => {
            if (!doc.data()) {
               this.guardarToken(token);
            } else {
               console.log('El token ya existe');
            }
         })
         .catch(err => {
            console.log('Error firebase', err);
         });
   };

   guardarToken = async token => {
      await global.db
         .collection('push_cliente')
         .doc(global.usuario)
         .set({ token_push: token });
   };

   //Funcion para poder enviar notificaciones
   // async function sendPushNotification(expoPushToken) {
   //    console.log('Ingreso a sendPushNotification', expoPushToken);
   //    const message = {
   //       to: 'ExponentPushToken[Hu_kykFb5bhJU9Hvhzzxhz]',
   //       sound: 'default',
   //       title: 'Original Title',
   //       body: 'And here is the body!',
   //       data: { data: 'goes here' },
   //    };

   //    await fetch('https://exp.host/--/api/v2/push/send', {
   //       method: 'POST',
   //       headers: {
   //          Accept: 'application/json',
   //          'Accept-encoding': 'gzip, deflate',
   //          'Content-Type': 'application/json',
   //       },
   //       body: JSON.stringify(message),
   //    });
   // }
}
