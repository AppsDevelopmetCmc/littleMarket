import { Alert } from 'react-native';

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
