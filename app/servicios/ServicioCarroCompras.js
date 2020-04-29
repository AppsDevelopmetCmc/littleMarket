import { Alert } from 'react-native';
import {ArregloUtil} from '../utils/utils'


export class ServicioCarroCompras {

   registrarEscuchaTodas = (itemCarro, fnRepintar, mail) => {
   let arregloUtil = new ArregloUtil(itemCarro);
   global.db
      .collection('carritos')
      .doc(mail)
      .collection('items')
      .onSnapshot(function(snapShot) {
         snapShot.docChanges().forEach(function(change) {
            if (change.type == 'added') {
               arregloUtil.agregar(change.doc.data(), fnRepintar);
            }
            if (change.type == 'modified') {
               arregloUtil.actualizar(change.doc.data(), fnRepintar);
            } 
            if (change.type == 'removed') {
               arregloUtil.eliminar(change.doc.data(), fnRepintar);
            }
         });
      });

   eliminarItemCarro = (itemCarro, mail)=>{
      global.db
      .collection('carritos')
      .doc(mail)
      .collection('items')
      .doc(itemCarro.id)
      .delete()
      .then(function () {
         Alert.alert('eliminando item');
      })
      .catch(function (error) {
         Alert.alert('Error ' + error.message);
      });
   }
};
}

export const crearPedidoCarro = (itemCarro, mail) => {
   global.db
      .collection('carritos')
      .doc(mail)
      .set({ total: 10 })
      .then(function () {
         agregarItemCarro(itemCarro, mail);
      })
      .catch(function (error) {});
};

export const agregarItemCarro = (itemCarro, mail) => {
   global.db
      .collection('carritos')
      .doc(mail)
      .collection('items')
      .doc(itemCarro.id)
      .set(itemCarro)
      .then(function () {
         Alert.alert('agregando item');
      })
      .catch(function (error) {
         Alert.alert('Error ' + error.message);
      });
};

