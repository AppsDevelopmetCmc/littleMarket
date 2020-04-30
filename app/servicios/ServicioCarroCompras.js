import { Alert } from 'react-native';
import { ArregloUtil } from '../utils/utils';

export class ServicioCarroCompras {
   registrarEscuchaTodas = (itemCarro, fnRepintar, mail) => {
      let arregloUtil = new ArregloUtil(itemCarro);
      global.db
         .collection('carritos')
         .doc(mail)
         .collection('items')
         .onSnapshot(function (snapShot) {
            snapShot.docChanges().forEach(function (change) {
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
   };
}
export const eliminarItemCarro = (itemCarro, mail) => {
   global.db
      .collection('carritos')
      .doc(mail)
      .collection('items')
      .doc(itemCarro.id)
      .delete()
      .then(function () {
         //Alert.alert('eliminando item');
      })
      .catch(function (error) {
         Alert.alert('Error ' + error.message);
      });
};

export const agregarDisminuirItemCarro = (
   itemCarro,
   mail,
   cantidad,
   fnOnSuccess
) => {
   //RECUPERA la cantidad actual del ITEM
   global.db
      .collection('carritos')
      .doc(mail)
      .collection('items')
      .doc(itemCarro.id)
      .get()
      .then(item => {
         if (item.exists) {
            let cantidadActual = item.data().cantidad;
            console.log('cantidadActual', cantidadActual);
            global.db
               .collection('carritos')
               .doc(mail)
               .collection('items')
               .doc(itemCarro.id)
               .update({
                  cantidad: cantidadActual + cantidad,
                  subtotal: Number(
                     ((cantidadActual + cantidad) * itemCarro.precio).toFixed(2)
                  ),
               })
               .then(() => {
                  if (fnOnSuccess) {
                     fnOnSuccess();
                  }
               });
         } else {
            itemCarro.cantidad = 1;
            itemCarro.subtotal = itemCarro.precio;
            global.db
               .collection('carritos')
               .doc(mail)
               .collection('items')
               .doc(itemCarro.id)
               .set(itemCarro)
               .then(() => {
                  console.log('se agrega nuevo item al carro');
                  if (fnOnSuccess) {
                     fnOnSuccess();
                  }
               })
               .catch();
         }
      })
      .catch(() => {});
};
