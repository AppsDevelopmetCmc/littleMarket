import { Alert } from 'react-native';
import { ArregloUtil } from '../utils/utils';

export class ServicioReferidos {
    registrarEscuchaTodas = (pedido, fnRepintar, mail) => {
       let arregloUtil = new ArregloUtil(pedido);
       global.db
          .collection('pedidos').where("mail","==", mail)
          //.onSnapshot(function (snapShot) {
          .onSnapshot(function (snapShot) {
             snapShot.docChanges().forEach(function (change) {
                let itemPedidos = change.doc.data();
                itemPedidos.id=change.doc.id;

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
    
    
    recuperarReferidos = (arreglo,fnRepintar, pedido) => {
        let arregloUtil = new ArregloUtil(arreglo);
        global.db.collection('pedidos').doc(pedido.id).collection('combos').onSnapshot(function(snapShot) {
           snapShot.docChanges().forEach(function(change) {
            let combos = change.doc.data();
            combos.id=change.doc.id;
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
    };

