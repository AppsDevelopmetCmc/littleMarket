import { Alert } from 'react-native';
export const crearPedido = pedido => {
   global.db
      .collection('pedidos')
      .add(pedido)
      .then(function () {
         Alert.alert('Pedido agregado');
      })
      .catch(function (error) {
         Alert.alert('error' + error);
      });
};
