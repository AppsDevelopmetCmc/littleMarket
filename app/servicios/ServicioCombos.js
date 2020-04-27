import { ArregloUtil } from '../utils/utils';
import { Alert } from 'react-native';

export class ServicioCombos {
   crear = combo => {
      global.db
         .collection('combos')
         .doc(combo.id)
         .set(combo)
         .then(function() {
            Alert.alert('Combo agregado');
         })
         .catch(function(error) {
            Alert.alert('error' + error);
         });
   };

   crearComboProducto = (idCombo, producto) => {
      global.db
         .collection('combos')
         .doc(idCombo)
         .collection('productosCombo')
         .doc(producto.id)
         .set(producto)
         .then(function() {
            Alert.alert('Producto Combo agregado');
         })
         .catch(function(error) {
            Alert.alert('error' + error);
         });
   };

   eliminarComboProducto = (idCombo,idProd) => {
      global.db
         .collection('combos')
         .doc(idCombo)
         .collection('productosCombo')
         .doc(idProd)
         .delete()
         .then(function() {
            console.log('Document successfully deleted!');
         })
         .catch(function(error) {
            console.error('Error removing document: ', error);
         });
   };
   eliminar = id => {
      global.db
         .collection('combos')
         .doc(id)
         .delete()
         .then(function() {
            console.log('Document successfully deleted!');
         })
         .catch(function(error) {
            console.error('Error removing document: ', error);
         });
   };
   actualizar = objeto => {
      global.db
         .collection('combos')
         .doc(objeto.id)
         .update({
            imagen: objeto.imagen,
            precio: objeto.precio,
            alias: objeto.alias,
         })
         .then(function() {
            Alert.alert('Combo Actualizado');
         })
         .catch(function(error) {
            Alert.alert('error' + error);
         });
   };

   registrarEscuchaTodas = (arreglo, fnRepintar) => {
      let arregloUtil = new ArregloUtil(arreglo);
      global.db.collection('combos').onSnapshot(function(snapShot) {
         snapShot.docChanges().forEach(function(change) {
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

   registrarEscuchaProductoComboTodas = (arreglo, fnRepintar, idCombo) => {
      let arregloUtil = new ArregloUtil(arreglo);
      global.db
         .collection('combos')
         .doc(idCombo)
         .collection('productosCombo')
         .onSnapshot(function(snapShot) {
            snapShot.docChanges().forEach(function(change) {
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
