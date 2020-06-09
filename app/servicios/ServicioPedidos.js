import { Alert ,Linking} from 'react-native';
import { ArregloUtil } from '../utils/utils';
import { ServicioCarroCompras } from './ServicioCarroCompras';
import { ServicioMonederos } from './ServicioMonederos';

export const crearPedido = (pedido, items, fnCerrarPantalla) => {
   global.db
      .collection('pedidos')
      .add(pedido)
      .then(function (doc) {
         let descripcionALert='Su pedido ha sido procesado, con la orden: ';
         if (pedido.formaPago === 'EFECTIVO') {
            Alert.alert('Pedido Creado Exitosamente',
            descripcionALert + ''+pedido.orden);
         }
         else
         {
            let text =
            'He realizado el pedido: ' + pedido.orden + ' por el monto $ ' +
           parseFloat(pedido.total-pedido.descuento) + '. Solicito información para realizar la transferencia.';
         Alert.alert(
            "Información",
            text,
            [
               {
                  text: "Aceptar", onPress: () => {
                     console.log("OK Pressed")
                     let numero = '593992920306';
                     Linking.openURL(
                        'whatsapp://send?text=' +
                        text +
                        '&phone=' +
                        numero
                     );
                  }

               }
            ],
            { cancelable: false }
         );
         }
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
         global.yapa = undefined;
         if (pedido.descuento > 0) {
            new ServicioMonederos().actualizarMonedero(
               global.usuario,
               parseFloat(0)
            );
         }
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
         .where('mail', '==', mail)
         .orderBy('orden', 'desc')
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
