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

   actualizarNotificaciones = (objeto) => {
      global
         .db
         .collection("notificaciones")
         .doc(objeto.mail)
         .update(
            {
               numero: objeto.numero,
            }
         ).then(function () {
            Alert.alert("Notificacion actualizado")
         }
         ).catch(function (error) {
            Alert.alert("error" + error)
         }
         );
   }

   registrarEscuchaTodas = (idMail, fnRepintar, mail) => {
      let arregloUtil = new ArregloUtil(pedido);
      global.db
         .collection('notificaciones')
         .doc(idMail)
         .collection('notificaciones')
         .where('mail', '==', mail)
         .orderBy("orden", "desc")
         .onSnapshot(function (snapShot) {
            snapShot.docChanges().forEach(function (change) {
               let itemPedidos = change.doc.data();
               itemPedidos.id = change.doc.id;

               if (change.type == 'added') {
                  arregloUtil.agregar(itemPedidos, fnRepintar);
               }
               if (change.type == 'modified') {
                  arregloUtil.actualizar(itemPedidos, fnRepintar);
               }
               if (change.type == 'removed') {
                  arregloUtil.eliminar(itemPedidos, fnRepintar);
               }
            });
         });
   };

}