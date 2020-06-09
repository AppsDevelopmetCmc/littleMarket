import firebase from 'firebase';
import '@firebase/firestore';
import { ArregloUtil } from '../utils/utils';
import { Alert } from 'react-native';
import '@firebase/storage';

export class ServicioProductos {
   crear = producto => {
      global.db
         .collection('productos')
         .doc(producto.id)
         .set(producto)
         .then(function () {
            Alert.alert('Informacion', 'Producto Creado Exitosamente');
         })
         .catch(function (error) {
            Alert.alert('Se ha producido un error', error);
         });
   };
   eliminar = id => {
      global.db
         .collection('productos')
         .doc(id)
         .delete()
         .then(function () {
            console.log('Document successfully deleted!');
         })
         .catch(function (error) {
            console.error('Error removing document: ', error);
         });
   };
   actualizar = objeto => {
      global.db
         .collection('productos')
         .doc(objeto.id)
         .update({
            cantidad: objeto.cantidad,
            unidad: objeto.unidad,
            precio: objeto.precio,
            imagen: objeto.imagen,
         })
         .then(function () {
            Alert.alert('Información','Producto Actualizado Exitosamente');
         })
         .catch(function (error) {
            Alert.alert('Se ha producido un Error', error);
         });
   };
   registrarEscuchaTodas = (arreglo, fnRepintar) => {
      let arregloUtil = new ArregloUtil(arreglo);
      global.db.collection('productos').onSnapshot(function (snapShot) {
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

   recuperarProductos = async fnRepintar => {
      global.db
         .collection('productos')
         .get()
         .then(async function (coleccion) {
            let documentos = coleccion.docs;
            let productos = [];
            for (let i = 0; i < documentos.length; i++) {
               productos.push(documentos[i].data());

               let coleccionPrecios = await global.db
                  .collection('productos')
                  .doc(documentos[i].id)
                  .collection('precios')
                  .get();
               let precios = coleccionPrecios.docs;
               let listaPrecios = [];
               for (let j = 0; j < precios.length; j++) {
                  listaPrecios.push(precios[j].data());
               }
               productos[i].listPrecios = listaPrecios;
            }
            fnRepintar(productos);
         })
         .catch(function (error) {
            console.log('Error getting document:', error);
         });
   };
}
