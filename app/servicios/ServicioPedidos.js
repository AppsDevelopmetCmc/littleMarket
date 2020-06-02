import { Alert } from 'react-native';
import { ArregloUtil } from '../utils/utils';
import { ServicioCarroCompras } from './ServicioCarroCompras';

export const crearPedido = (pedido, items, fnCerrarPantalla) => {
   global.db
      .collection('pedidos')
      .add(pedido)
      .then(function (doc) {
         Alert.alert('Su pedido ha sido procesado');
         for (let i = 0; i < items.length; i++) {
            global.db
               .collection('pedidos')
               .doc(doc.id)
               .collection('combos')
               .doc(items[i].id)
               .set(items[i]);
         }
         new ServicioCarroCompras().eliminarCarro(global.usuario);
         fnCerrarPantalla();
         global.pagoSeleccionado = null;
         global.fechaSeleccionada = null;
         global.horarioSeleccionado = null;
      })
      .catch(function (error) {
         Alert.alert('error' + error);
      });
};

export class ServicioPedidos {
   registrarEscuchaTodas = (pedido, fnRepintar, mail) => {
      let arregloUtil = new ArregloUtil(pedido);
      global.db
         .collection('pedidos')
         .where('mail', '==', mail).orderBy("orden", "desc")
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

   recuperarDetallePedido = (arreglo, fnRepintar, pedido) => {
      let arregloUtil = new ArregloUtil(arreglo);
      global.db
         .collection('pedidos')
         .doc(pedido.id)
         .collection('combos')
         .onSnapshot(function (snapShot) {
            snapShot.docChanges().forEach(function (change) {
               let combos = change.doc.data();
               combos.id = change.doc.id;
               if (change.type == 'added') {
                  arregloUtil.agregar(combos, fnRepintar);
               }
               if (change.type == 'modified') {
                  arregloUtil.actualizar(combos, fnRepintar);
               }
               if (change.type == 'removed') {
                  arregloUtil.eliminar(combos, fnRepintar);
               }
            });
         });
   };
}
