import { Alert, Linking } from 'react-native';
import { ArregloUtil } from '../utils/utils';
import { ServicioCarroCompras, eliminarCarro } from './ServicioCarroCompras';
import { ServicioMonederos } from './ServicioMonederos';

export const agregarItemPedido = producto => {
   if (global.items == null) {
      global.items = new Map();
      global.subtotal = 0;
   }
   let itemProducto = global.items.get(producto.id);
   if (itemProducto == null) {
      global.items.set(producto.id, crearItemPedido(producto));
   } else {
      modificarItemPedidos(itemProducto, 1);
   }
   modificarSubtotal(producto.precio, 1);
};
const modificarSubtotal = (precio, cantidad) => {
   console.log('modificaSubtotal', precio, cantidad);
   global.subtotal += precio * cantidad;
   for (let i = 0; i < global.refrescarBotones.length; i++) {
      global.refrescarBotones[i](global.subtotal);
   }
};
const calcularSubtotal = () => {
   //console.log('GLOBAL.ITEMS', global.items);
   global.subtotal = 0;
   let item = null;
   /*for (let key of global.items.keys()) {
      item = global.items.get(key);
      console.log('item', item);
      global.subtotal += item.cantidad * item.precio;
   }*/

   global.refrescarBoton(global.subtotal);
};
export const disminuirItemPedido = producto => {
   let itemProducto = global.items.get(producto.id);
   if (itemProducto != null) {
      modificarItemPedidos(itemProducto, -1);
   } else {
      console.log(
         'ERROR se intenta MODIFICAR un item que no existe ',
         producto.id
      );
   }
   modificarSubtotal(producto.precio, -1);
};

export const eliminarItemPedido = producto => {
   let itemProducto = global.items.get(producto.id);
   if (itemProducto != null) {
      global.items.delete(producto.id);
   } else {
      console.log(
         'ERROR se intenta eliminar un item que no existe ',
         producto.id
      );
   }
   modificarSubtotal(producto.precio, -itemProducto.cantidad);
};
const crearItemPedido = producto => {
   let itemProducto = {
      id: producto.id,
      nombre: producto.nombre,
      cantidad: 1,
      cantidadItem: producto.cantidad,
      empacado: false,
      recibido: false,
      precio: producto.precio,
      subtotal: producto.precio,
      unidad: producto.unidad,
   };
   return itemProducto;
};

const modificarItemPedidos = (itemProducto, cantidad) => {
   itemProducto.cantidad += cantidad;
   itemProducto.subtotal = itemProducto.cantidad * itemProducto.precio;
};

export const limpiarProductosSeleccionados = () => {
   global.items = null;
   for (let key of global.productos.keys()) {
      let arregloProductos = global.productos.get(key);
      for (let i = 0; i < arregloProductos.length; i++) {
         arregloProductos[i].limpiar = true;
      }
   }
   global.subtotal = 0;
   global.pintarTab1();
   global.pintarTab2();
   global.pintarTab3();
   for (let i = 0; i < global.refrescarBotones.length; i++) {
      global.refrescarBotones[i](global.subtotal);
   }
};
export const crearPedido = (pedido, items, fnCerrarPantalla, fnPagoRest) => {
   global.db
      .collection('pedidos')
      .add(pedido)
      .then(function (doc) {
         let descripcionALert = 'Su pedido ha sido procesado, con la orden: ';
         if (pedido.formaPago === 'EFECTIVO') {
            Alert.alert(
               'Gracias por comprar en Yappando',
               descripcionALert + '' + pedido.orden
            );
         }
         if (pedido.formaPago === 'TRANSFERENCIA') {
            let text =
               'He realizado el pedido: ' +
               pedido.orden +
               ' por el monto $ ' +
               parseFloat(pedido.total).toFixed(2) +
               '. Solicito información para realizar la transferencia.';
            let textAlert =
               'Ha realizado el pedido: ' +
               pedido.orden +
               ' por el monto $ ' +
               parseFloat(pedido.total).toFixed(2) +
               '. Solicite información para realizar la transferencia.';
            Alert.alert(
               'Gracias por comprar en Yappando',
               textAlert,
               [
                  {
                     text: 'Solicitar',
                     onPress: () => {
                        console.log('OK Pressed');
                        let numero = global.numWhatssap;
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
            fnPagoRest(doc.id, pedido);
         }
         //////////////aqui
         for (let key of global.items.keys()) {
            //for (let i = 0; i < items.length; i++) {
            let itemPedido = global.items.get(key);
            //let itemPedido = items[i];
            itemPedido.empacado = false;
            itemPedido.recibido = false;
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
         global.items = null;
         limpiarProductosSeleccionados();
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
         .orderBy('orden', 'asc')
         .onSnapshot(function (snapShot) {
            snapShot.docChanges().forEach(function (change) {
               let itemPedidos = change.doc.data();
               itemPedidos.id = change.doc.id;

               if (change.type == 'added') {
                  arregloUtil.agregarAlInicio(itemPedidos, fnRepintar);
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
      global.db
         .collection('pedidos')
         .doc(idPedido)
         .update({
            urlPago: objeto.urlPago,
            tokerUrlPago: objeto.tokerUrlPago,
         })
         .then(function () {
            console.log('Datos Actualizados');
         })
         .catch(function (error) {
            Alert.alert('error' + error);
         });
   };
}
