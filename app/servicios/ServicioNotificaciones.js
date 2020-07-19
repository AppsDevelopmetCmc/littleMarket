import { ArregloUtil, DateUtil } from '../utils/utils';
import { formatearFechaCompleta } from '../utils/DateUtil';
import { Alert } from 'react-native';

export class ServicioNotificaciones {
   crearNotificaciones = (idMail, notificacion, notificaciones) => {
      console.log('Parametros de ingreso al método');
      console.log('idMail', idMail);
      console.log('notificacion', notificacion);
      console.log('notificaciones', notificaciones);

      global.db
         .collection('notificaciones')
         .doc(idMail)
         .set(notificacion)
         .then(function () {
            console.log('Notificacion creada');
            global.db
               .collection('notificaciones')
               .doc(idMail)
               .collection('notificaciones')
               .add(notificaciones)
               .then(function () {
                  console.log('Notificacion creada');
               })
               .catch(function (error) {
                  Alert.alert('Se ha Producido un Error', error);
               });
         })
         .catch(function (error) {
            Alert.alert('Se ha Producido un Error', error);
         });
   };

   actualizarNotificaciones = objeto => {
      global.db
         .collection('notificaciones')
         .doc(objeto.mail)
         .update({
            numero: objeto.numero,
         })
         .then(function () {
            console.log('Notificaciones actualizada');
         })
         .catch(function (error) {
            Alert.alert('Se ha Producido un Error', error);
         });
   };

   actualizarEstadoNotificacion = (mail, id) => {
      console.log('ingreso actualizar');
      console.log(mail);
      console.log(id);
      global.db
         .collection('notificaciones')
         .doc(mail)
         .collection('notificaciones')
         .doc(id)
         .update({ estado: 'L' })
         .then(function () {
            console.log('Notificacion actualizada');
         })
         .catch(function (error) {
            Alert.alert('Se ha Producido un Error', error);
         });
   };

   registrarEscuchaTodas = (idMail, fnRepintar) => {
      global.db
         .collection('notificaciones')
         .doc(idMail)
         .collection('notificaciones')
         .orderBy('estado', 'desc')
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
            Alert.alert('Error catch-->', error);
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
            //console.log('snapShot', snapShot);
            fnRepintar(snapShot.data());
         });
   };

   buscarNumeroNotificacion = async idMail => {
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

   actualizarTotaleNotificaciones = async idMail => {
      console.log('idMail', idMail);
      let numeroTotal = 0;
      let numero = 0;
      let numeroLeido = 0;

      await global.db
         .collection('notificaciones')
         .doc(idMail)
         .collection('notificaciones')
         .where('estado', '==', 'V')
         .get()
         .then(doc => {
            numero = doc.size;
            console.log('numero sin leer', numero);
         });

      await global.db
         .collection('notificaciones')
         .doc(idMail)
         .collection('notificaciones')
         .where('estado', '==', 'L')
         .get()
         .then(doc => {
            numeroLeido = doc.size;
            console.log('numeroLeido', numeroLeido);
         });

      numeroTotal = numero + numeroLeido;

      await global.db
         .collection('notificaciones')
         .doc(idMail)
         .update({
            numero: numero,
            numeroLeido: numeroLeido,
            total: numeroTotal,
         })
         .then(function () {
            console.log('Notificaciones actualizada');
         })
         .catch(function (error) {
            Alert.alert('Se ha Producido un Error', error);
         });
   };
}
