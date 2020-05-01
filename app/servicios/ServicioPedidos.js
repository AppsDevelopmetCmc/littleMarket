import { Alert } from 'react-native';
import { ArregloUtil } from '../utils/utils';

export class ServicioPedidos {
    registrarEscuchaTodas = (pedido, fnRepintar, mail) => {
       let arregloUtil = new ArregloUtil(pedido);
       global.db
          .collection('pedidos').where()
          .then(function (snapShot) {
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
