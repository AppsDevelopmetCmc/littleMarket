import { Alert } from 'react-native';

export const recuperarItems = async fnRepintar => {
   global.db
      .collection('items')
      .where('estado', '==', 'V')
      .orderBy('posicion')
      .get()
      .then(querySnapShot => {
         let documentos = querySnapShot.docs;
         let items = [];
         for (let i = 0; i < documentos.length; i++) {
            let item = documentos[i].data();
            item.id = documentos[i].id;
            items.push(item);
         }
         fnRepintar(items);
      });
};
