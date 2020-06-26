import { Alert, Linking } from 'react-native';
import { ArregloUtil } from '../utils/utils';
import { ServicioCarroCompras ,eliminarCarro} from './ServicioCarroCompras';
import { ServicioMonederos } from './ServicioMonederos';

export const crearPedido = (pedido, items, fnCerrarPantalla,fnPagoRest) => {
   global.db
      .collection('pedidos')
      .add(pedido)
      .then(function (doc) {
         let descripcionALert = 'Su pedido ha sido procesado, con la orden: ';
         if (pedido.formaPago === 'EFECTIVO') {
            Alert.alert(
               'Gracias por su compra',
               descripcionALert + '' + pedido.orden
            );
         }  
         if (pedido.formaPago === 'TRANSFERENCIA') {
            let text =
               'He realizado el pedido: ' +
               pedido.orden +
               ' por el monto $ ' +
               parseFloat(pedido.total - pedido.descuento) +
               '. Solicito información para realizar la transferencia.';
            Alert.alert(
               'Gracias por su compra',
               text,
               [
                  {
                     text: 'Aceptar',
                     onPress: () => {
                        console.log('OK Pressed');
                        let numero = '593992920306';
                        Linking.openURL(
                           'whatsapp://send?text=' + text + '&phone=' + numero
                        );
                     },
                  },
               ],
               { cancelable: false }
            );
            
         }
         if (pedido.formaPago === 'TARJETA') {
            fnPagoRest(doc.id,pedido)
         }
         for (let i = 0; i < items.length; i++) {
            let itemPedido=items[i]
            itemPedido.empacado=false;
            itemPedido.recibido=false;
            global.db
               .collection('pedidos')
               .doc(doc.id)
               .collection('combos')
               .doc(itemPedido.id)
               .set(itemPedido);
         }
         eliminarCarro(global.usuario);
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
         Alert.alert('Se ha Producido un error', error.message);
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

   actualizarPedidoUrlPago = (idPedido, objeto) => {
      global
         .db
         .collection('pedidos')
         .doc(idPedido)
         .update({
            urlPago: objeto.urlPago,
            tokerUrlPago: objeto.tokerUrlPago,
         })
         .then(function () {
            console.log("Datos Actualizados")
         })
         .catch(function (error) {
            Alert.alert('error' + error);
         });
   };
}
