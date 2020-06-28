import { Alert } from 'react-native';

export const recuperarItems = inicial => {
   //TODO: una por cada categoria, por ahora categorias quemadas

   console.log('***recuperarItems carga el mapa');
   global.productos = new Map();
   global.productos.set('F', []);
   global.productos.set('V', []);
   global.productos.set('O', []);
   console.log('****SIZE*******', global.productos.size);
   global.db
      .collection('items')
      .where('estado', '==', 'V')
      .orderBy('posicion')
      .get()
      .then(querySnapShot => {
         let documentos = querySnapShot.docs;
         console.log('*******CARGA*****', documentos.length);
         for (let i = 0; i < documentos.length; i++) {
            let item = documentos[i].data();
            item.id = documentos[i].id;
            //items.push(item);

            let arregloProductos = global.productos.get(item.categoria);
            if (arregloProductos) {
               let repetidos = false;
               for (let i = 0; i < arregloProductos.length; i++) {
                  if (arregloProductos[i].id == item.id) {
                     console.log('intenta cargar repetido');
                     repetidos = true;
                     break;
                  }
               }
               if (repetidos) {
                  console.log('sale por repetidos');
                  break;
               }
               arregloProductos.push(item);
            }
         }
         global.pintarTab1();
         global.pintarTab2();
         global.pintarTab3();
      });
};
