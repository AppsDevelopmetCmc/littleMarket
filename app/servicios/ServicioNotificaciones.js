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
               .add(notificaciones)
               .then(function () {
                  console.log("Notificacion creada");
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
            console.log("Notificacion actualizada")
         }
         ).catch(function (error) {
            Alert.alert("error" + error)
         }
         );
   }

   registrarEscuchaTodas = (idMail, fnRepintar) => {
      global.db
         .collection('notificaciones')
         .doc(idMail)
         .collection('notificaciones')
         .orderBy("fecha", "desc")
         .limit(10)
         .get()
         .then(async function (documentos) {
            let listaNotificaciones = [];
            for (let i = 0; i < documentos.docs.length; i++) {
               let itemNotificaciones = [];
               itemNotificaciones = documentos.docs[i].data();
               itemNotificaciones.id = documentos.docs[i].id;
               itemNotificaciones.posicion = i;
               listaNotificaciones.push(itemNotificaciones);
            }
            fnRepintar(listaNotificaciones);
         })
         .catch(function (error) {
            Alert.alert('Error catch-->' + error);
         });
      /*
         .onSnapshot(function (snapShot) {
            snapShot.docChanges().forEach(function (change) {
               let itemNotificaciones = change.doc.data();
               itemNotificaciones.id = change.doc.id;

               if (change.type == 'added') {
                  arregloUtil.agregar(itemNotificaciones, fnRepintar);
               }
               if (change.type == 'modified') {
                  arregloUtil.actualizar(itemNotificaciones, fnRepintar);
               }
               if (change.type == 'removed') {
                  arregloUtil.eliminar(itemNotificaciones, fnRepintar);
               }
            });
         });*/
   };

   registarEscuchaNotificacion = (idMail, fnRepintar) => {
      global.db
         .collection('notificaciones')
         .doc(idMail)
         .onSnapshot(function (snapShot) {
            console.log('snapShot', snapShot);
            fnRepintar(snapShot.data());
         });
   };

   buscarNumeroNotificacion = async (idMail) => {
      let valorNumero = 0;
      let notificacion = await global.db
         .collection('notificaciones')
         .doc(idMail)
         .get();
      if (notificacion && notificacion.data()) {
         valorNumero = notificacion.data().numero;
      }
      return valorNumero;
   };

}