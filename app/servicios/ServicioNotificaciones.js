import { ArregloUtil, DateUtil } from '../utils/utils';
import { formatearFechaCompleta } from '../utils/DateUtil';
import { Alert } from 'react-native';

export class ServicioNotificaciones {

   crearNotificaciones = (idMail, notificacion, notificaciones) => {
      global.db.collection("notificaciones")
         .doc(idMail).
         set(notificacion)
         .then(function () {
            console.log("Notificacion creada")
            global
               .db
               .collection("notificaciones")
               .doc(idMail)
               .collection("notificaciones")
               .set(notificaciones)
               .then(function () {
                  Alert.alert("Subcoleccion de Notifcaciones creados")
               }).catch(function (error) {
                  Alert.alert("error" + error)
               })

         }).catch(function (error) {
            Alert.alert("error" + error)
         })
   }

}