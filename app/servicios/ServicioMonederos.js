import { ArregloUtil, DateUtil } from '../utils/utils';
import { formatearFechaCompleta } from '../utils/DateUtil';
import { Alert } from 'react-native';

export class ServicioMonederos {
   getRecuperarMonedero = idEmail => {
      global.db
         .collection('monederos')
         .doc(idEmail)
         .get()
         .then(function (coleccion) {
            let monedero = coleccion.data();
            global.db
               .collection('monederos')
               .doc(idEmail)
               .collection('transacciones')
               .get()
               .then(function (coleccionTransacciones) {
                  let transacciones = coleccionTransacciones.docs;
                  let listaTransacciones = [];
                  for (let j = 0; j < transacciones.length; j++) {
                     listaTransacciones.push(transacciones[j].data());
                  }

                  monedero.transacciones = listaTransacciones;

                  global.monedero = monedero;
               });
         })
         .catch(function (error) {
            console.log('Error getting document:', error);
         });
   };

   registarEscuchaMonedero = (idMail, fnRepintar) => {
      global.db
         .collection('monederos')
         .doc(idMail)
         .onSnapshot(function (snapShot) {
            console.log('snapShot', snapShot);
            fnRepintar(snapShot.data());
         });
   };

   registarEscuchaMonederoCompra = (idMail, fnRepintar) => {
      let escucha = global.db
         .collection('monederos')
         .doc(idMail)
         .onSnapshot(function (snapShot) {
            console.log('snapShot', snapShot);
            fnRepintar(snapShot.data());
         });

      return escucha;
   };

   actualizarMonedero = (idMail, datoValor) => {
      global.db
         .collection('monederos')
         .doc(idMail)
         .update({
            valor: datoValor,
         })
         .then(function () {
            console.log("monedero actualizado",datoValor)
         })
         .catch(function (error) {
            Alert.alert('error' + error);
         });
   };
}
